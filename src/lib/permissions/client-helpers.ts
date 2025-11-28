"use client"

import { createClient } from '@/lib/supabase/client'
import type { Resource, Action, DbPermission } from './constants'

/**
 * Verifica se o usuário é super admin (versão cliente)
 */
export async function isSuperAdminClient(userId: string): Promise<boolean> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('is_super_admin')
    .eq('id', userId)
    .single()
  
  if (error || !data) {
    return false
  }
  
  return data.is_super_admin === true
}

/**
 * Verifica se o usuário tem uma permissão específica (versão cliente)
 */
export async function hasPermissionClient(
  userId: string,
  resource: Resource,
  action: Action
): Promise<boolean> {
  const supabase = createClient()
  
  // Primeiro, verificar se é super admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_super_admin')
    .eq('id', userId)
    .single()
  
  if (profile?.is_super_admin) {
    return true
  }
  
  // Usar a função RPC do banco
  const { data, error } = await supabase.rpc('user_has_permission', {
    p_user_id: userId,
    p_resource: resource,
    p_action: action,
  })
  
  if (error) {
    console.error('Erro ao verificar permissão:', error)
    return false
  }
  
  return data === true
}

/**
 * Obtém todas as permissões do usuário (versão cliente)
 */
export async function getUserPermissionsClient(userId: string): Promise<DbPermission[]> {
  const supabase = createClient()
  
  // Verificar se é super admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_super_admin')
    .eq('id', userId)
    .single()
  
  if (profile?.is_super_admin) {
    // Retornar todas as permissões
    const { data: allPermissions } = await supabase
      .from('permissions')
      .select('*')
    
    return (allPermissions || []) as DbPermission[]
  }
  
  // Buscar permissões através dos papéis
  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      roles!inner(
        role_permissions(
          permissions(*)
        )
      )
    `)
    .eq('user_id', userId)
  
  if (error || !data) {
    return []
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
  
  return Array.from(permissionsSet.values())
}

