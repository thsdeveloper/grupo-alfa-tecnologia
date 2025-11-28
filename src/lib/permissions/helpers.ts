import { createClient } from '@/lib/supabase/server'
import type { Resource, Action, DbPermission, Role, UserWithRoles, RoleWithPermissions } from './constants'

/**
 * Verifica se o usuário é super admin
 */
export async function isSuperAdmin(userId: string): Promise<boolean> {
  const supabase = await createClient()
  
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
 * Verifica se o usuário tem uma permissão específica
 */
export async function hasPermission(
  userId: string,
  resource: Resource,
  action: Action
): Promise<boolean> {
  const supabase = await createClient()
  
  // Primeiro, verificar se é super admin (tem todas as permissões)
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_super_admin')
    .eq('id', userId)
    .single()
  
  if (profile?.is_super_admin) {
    return true
  }
  
  // Usar a função RPC do banco para verificar permissão
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
 * Verifica se o usuário tem um papel específico
 */
export async function hasRole(userId: string, roleName: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      role_id,
      roles!inner(name)
    `)
    .eq('user_id', userId)
  
  if (error || !data) {
    return false
  }
  
  return data.some((ur: { roles: { name: string } }) => ur.roles.name === roleName)
}

/**
 * Obtém todas as permissões do usuário
 */
export async function getUserPermissions(userId: string): Promise<DbPermission[]> {
  const supabase = await createClient()
  
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

/**
 * Obtém os papéis do usuário
 */
export async function getUserRoles(userId: string): Promise<Role[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      roles(*)
    `)
    .eq('user_id', userId)
  
  if (error || !data) {
    return []
  }
  
  return data.map((ur) => ur.roles as Role)
}

/**
 * Obtém todos os papéis disponíveis
 */
export async function getAllRoles(): Promise<Role[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('roles')
    .select('*')
    .order('name')
  
  if (error) {
    console.error('Erro ao buscar papéis:', error)
    return []
  }
  
  return data as Role[]
}

/**
 * Obtém um papel com suas permissões
 */
export async function getRoleWithPermissions(roleId: string): Promise<RoleWithPermissions | null> {
  const supabase = await createClient()
  
  const { data: role, error: roleError } = await supabase
    .from('roles')
    .select('*')
    .eq('id', roleId)
    .single()
  
  if (roleError || !role) {
    return null
  }
  
  const { data: rolePermissions } = await supabase
    .from('role_permissions')
    .select(`
      permissions(*)
    `)
    .eq('role_id', roleId)
  
  const permissions = rolePermissions?.map((rp) => rp.permissions as DbPermission) || []
  
  return {
    ...role,
    permissions,
  } as RoleWithPermissions
}

/**
 * Obtém todas as permissões disponíveis
 */
export async function getAllPermissions(): Promise<DbPermission[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('permissions')
    .select('*')
    .order('resource')
    .order('action')
  
  if (error) {
    console.error('Erro ao buscar permissões:', error)
    return []
  }
  
  return data as DbPermission[]
}

/**
 * Obtém todos os usuários com seus papéis
 */
export async function getAllUsersWithRoles(): Promise<UserWithRoles[]> {
  const supabase = await createClient()
  
  // Buscar todos os profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, is_super_admin')
    .order('full_name')
  
  if (profilesError || !profiles) {
    return []
  }
  
  // Buscar emails dos usuários via auth
  const { data: authData } = await supabase.auth.admin.listUsers()
  const emailMap = new Map<string, string>()
  if (authData?.users) {
    for (const user of authData.users) {
      emailMap.set(user.id, user.email || '')
    }
  }
  
  // Buscar papéis de todos os usuários
  const { data: allUserRoles } = await supabase
    .from('user_roles')
    .select(`
      user_id,
      roles(*)
    `)
  
  const rolesMap = new Map<string, Role[]>()
  if (allUserRoles) {
    for (const ur of allUserRoles) {
      const userId = ur.user_id
      if (!rolesMap.has(userId)) {
        rolesMap.set(userId, [])
      }
      rolesMap.get(userId)!.push(ur.roles as Role)
    }
  }
  
  return profiles.map((profile) => ({
    id: profile.id,
    full_name: profile.full_name,
    email: emailMap.get(profile.id) || '',
    avatar_url: profile.avatar_url,
    is_super_admin: profile.is_super_admin || false,
    roles: rolesMap.get(profile.id) || [],
  }))
}

/**
 * Verifica múltiplas permissões de uma vez (otimizado)
 */
export async function hasAnyPermission(
  userId: string,
  permissions: Array<{ resource: Resource; action: Action }>
): Promise<boolean> {
  const userPermissions = await getUserPermissions(userId)
  
  return permissions.some((required) =>
    userPermissions.some(
      (up) => up.resource === required.resource && up.action === required.action
    )
  )
}

/**
 * Verifica se o usuário pode acessar uma rota específica
 */
export async function canAccessRoute(userId: string, pathname: string): Promise<boolean> {
  const supabase = await createClient()
  
  // Super admin pode acessar tudo
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_super_admin')
    .eq('id', userId)
    .single()
  
  if (profile?.is_super_admin) {
    return true
  }
  
  // Rotas que todos podem acessar
  const publicAdminRoutes = ['/admin', '/admin/profile']
  if (publicAdminRoutes.includes(pathname)) {
    return true
  }
  
  // Mapear rota para permissão
  const routePermissions: Record<string, { resource: Resource; action: Action }> = {
    '/admin/atas': { resource: 'atas', action: 'view' },
    '/admin/termos': { resource: 'termos', action: 'view' },
    '/admin/equipamentos': { resource: 'equipamentos', action: 'view' },
    '/admin/vagas': { resource: 'vagas', action: 'view' },
    '/admin/users': { resource: 'users', action: 'view' },
    '/admin/permissions': { resource: 'permissions', action: 'manage' },
  }
  
  // Verificar rota exata ou se começa com alguma das rotas mapeadas
  for (const [route, perm] of Object.entries(routePermissions)) {
    if (pathname === route || pathname.startsWith(route + '/')) {
      return hasPermission(userId, perm.resource, perm.action)
    }
  }
  
  // Se não encontrou mapeamento, permitir acesso (rota pode não estar protegida)
  return true
}

