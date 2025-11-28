"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Resource, Action, DbPermission } from "@/lib/permissions/constants"

interface PermissionsContextType {
  permissions: DbPermission[]
  isSuperAdmin: boolean
  isLoading: boolean
  hasPermission: (resource: Resource, action: Action) => boolean
  refetchPermissions: () => Promise<void>
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined)

interface PermissionsProviderProps {
  userId: string
  children: ReactNode
  initialPermissions?: DbPermission[]
  initialIsSuperAdmin?: boolean
}

export function PermissionsProvider({
  userId,
  children,
  initialPermissions = [],
  initialIsSuperAdmin = false,
}: PermissionsProviderProps) {
  const [permissions, setPermissions] = useState<DbPermission[]>(initialPermissions)
  const [isSuperAdmin, setIsSuperAdmin] = useState(initialIsSuperAdmin)
  const [isLoading, setIsLoading] = useState(!initialPermissions.length && !initialIsSuperAdmin)

  const fetchPermissions = async () => {
    try {
      const supabase = createClient()
      
      // Verificar se é super admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_super_admin')
        .eq('id', userId)
        .single()
      
      if (profile?.is_super_admin) {
        setIsSuperAdmin(true)
        // Super admin tem todas as permissões
        const { data: allPermissions } = await supabase
          .from('permissions')
          .select('*')
        setPermissions((allPermissions || []) as DbPermission[])
        return
      }
      
      setIsSuperAdmin(false)
      
      // Buscar permissões através dos papéis
      const { data } = await supabase
        .from('user_roles')
        .select(`
          roles!inner(
            role_permissions(
              permissions(*)
            )
          )
        `)
        .eq('user_id', userId)
      
      if (!data) {
        setPermissions([])
        return
      }
      
      // Extrair permissões únicas
      const permissionsSet = new Map<string, DbPermission>()
      
      for (const userRole of data) {
        const roles = userRole.roles as { role_permissions: { permissions: DbPermission }[] }
        for (const rp of roles.role_permissions) {
          const perm = rp.permissions
          if (perm && !permissionsSet.has(perm.id)) {
            permissionsSet.set(perm.id, perm)
          }
        }
      }
      
      setPermissions(Array.from(permissionsSet.values()))
    } catch (error) {
      console.error('Erro ao buscar permissões:', error)
      setPermissions([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!initialPermissions.length && !initialIsSuperAdmin) {
      fetchPermissions()
    }
  }, [userId])

  const hasPermission = (resource: Resource, action: Action): boolean => {
    if (isSuperAdmin) return true
    return permissions.some(p => p.resource === resource && p.action === action)
  }

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        isSuperAdmin,
        isLoading,
        hasPermission,
        refetchPermissions: fetchPermissions,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  )
}

export function usePermissions() {
  const context = useContext(PermissionsContext)
  if (context === undefined) {
    throw new Error('usePermissions deve ser usado dentro de um PermissionsProvider')
  }
  return context
}

