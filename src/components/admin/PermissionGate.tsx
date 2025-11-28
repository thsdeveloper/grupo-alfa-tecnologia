"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Resource, Action } from "@/lib/permissions/constants"

interface PermissionGateProps {
  resource: Resource
  action: Action
  userId: string
  children: React.ReactNode
  fallback?: React.ReactNode
  showLoading?: boolean
}

/**
 * Componente que mostra/esconde conteúdo baseado nas permissões do usuário
 * 
 * Uso:
 * <PermissionGate resource="atas" action="edit" userId={user.id}>
 *   <Button>Editar</Button>
 * </PermissionGate>
 */
export function PermissionGate({
  resource,
  action,
  userId,
  children,
  fallback = null,
  showLoading = false,
}: PermissionGateProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkPermission() {
      try {
        const supabase = createClient()
        
        // Verificar se é super admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_super_admin')
          .eq('id', userId)
          .single()
        
        if (profile?.is_super_admin) {
          setHasPermission(true)
          setIsLoading(false)
          return
        }
        
        // Usar a função RPC do banco
        const { data, error } = await supabase.rpc('user_has_permission', {
          p_user_id: userId,
          p_resource: resource,
          p_action: action,
        })
        
        if (error) {
          console.error('Erro ao verificar permissão:', error)
          setHasPermission(false)
        } else {
          setHasPermission(data === true)
        }
      } catch (error) {
        console.error('Erro ao verificar permissão:', error)
        setHasPermission(false)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkPermission()
  }, [userId, resource, action])

  if (isLoading) {
    if (showLoading) {
      return (
        <div className="animate-pulse bg-gray-200 rounded h-8 w-20" />
      )
    }
    return null
  }

  if (!hasPermission) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Versão server-side do PermissionGate
 * Deve ser usado com os dados de permissões já carregados
 */
interface ServerPermissionGateProps {
  resource: Resource
  action: Action
  userPermissions: Array<{ resource: string; action: string }>
  isSuperAdmin?: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ServerPermissionGate({
  resource,
  action,
  userPermissions,
  isSuperAdmin = false,
  children,
  fallback = null,
}: ServerPermissionGateProps) {
  // Super admin tem todas as permissões
  if (isSuperAdmin) {
    return <>{children}</>
  }

  // Verificar se tem a permissão necessária
  const hasPermission = userPermissions.some(
    (p) => p.resource === resource && p.action === action
  )

  if (!hasPermission) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

