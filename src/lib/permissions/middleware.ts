import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'
import type { Resource, Action } from './constants'

/**
 * Verifica se o usuário tem permissão para acessar um recurso
 * Para uso em API routes
 */
export async function checkApiPermission(
  request: NextRequest,
  resource: Resource,
  action: Action
): Promise<{ authorized: boolean; userId?: string; error?: NextResponse }> {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) {
    return {
      authorized: false,
      error: NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      ),
    }
  }
  
  // Verificar se é super admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_super_admin')
    .eq('id', user.id)
    .single()
  
  if (profile?.is_super_admin) {
    return { authorized: true, userId: user.id }
  }
  
  // Verificar permissão específica
  const { data: hasPermission } = await supabase.rpc('user_has_permission', {
    p_user_id: user.id,
    p_resource: resource,
    p_action: action,
  })
  
  if (!hasPermission) {
    return {
      authorized: false,
      userId: user.id,
      error: NextResponse.json(
        { error: 'Sem permissão para esta ação' },
        { status: 403 }
      ),
    }
  }
  
  return { authorized: true, userId: user.id }
}

/**
 * Wrapper para proteger API routes com verificação de permissão
 */
export function withPermission(
  resource: Resource,
  action: Action,
  handler: (request: NextRequest, context: { userId: string }) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const { authorized, userId, error } = await checkApiPermission(request, resource, action)
    
    if (!authorized || !userId) {
      return error!
    }
    
    return handler(request, { userId })
  }
}

/**
 * Wrapper para proteger API routes com params
 */
export function withPermissionAndParams<T extends { params: Promise<Record<string, string>> }>(
  resource: Resource,
  action: Action,
  handler: (request: NextRequest, context: T & { userId: string }) => Promise<NextResponse>
) {
  return async (request: NextRequest, routeContext: T) => {
    const { authorized, userId, error } = await checkApiPermission(request, resource, action)
    
    if (!authorized || !userId) {
      return error!
    }
    
    return handler(request, { ...routeContext, userId })
  }
}

/**
 * Verifica permissão em server components
 * Retorna true se o usuário tem a permissão, false caso contrário
 */
export async function checkPagePermission(
  resource: Resource,
  action: Action
): Promise<{ hasPermission: boolean; userId?: string; isSuperAdmin?: boolean }> {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) {
    return { hasPermission: false }
  }
  
  // Verificar se é super admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_super_admin')
    .eq('id', user.id)
    .single()
  
  if (profile?.is_super_admin) {
    return { hasPermission: true, userId: user.id, isSuperAdmin: true }
  }
  
  // Verificar permissão específica
  const { data: hasPermission } = await supabase.rpc('user_has_permission', {
    p_user_id: user.id,
    p_resource: resource,
    p_action: action,
  })
  
  return { 
    hasPermission: hasPermission === true, 
    userId: user.id,
    isSuperAdmin: false,
  }
}

