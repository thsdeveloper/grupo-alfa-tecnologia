// Recursos do sistema
export const RESOURCES = {
  ATAS: 'atas',
  TERMOS: 'termos',
  EQUIPAMENTOS: 'equipamentos',
  VAGAS: 'vagas',
  USERS: 'users',
  PERMISSIONS: 'permissions',
} as const

// Ações disponíveis
export const ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
  MANAGE: 'manage',
} as const

// Tipos derivados
export type Resource = typeof RESOURCES[keyof typeof RESOURCES]
export type Action = typeof ACTIONS[keyof typeof ACTIONS]

// Tipo para uma permissão completa
export type Permission = `${Resource}:${Action}`

// Interface para permissão do banco
export interface DbPermission {
  id: string
  resource: Resource
  action: Action
  name: string
  created_at: string
}

// Interface para papel
export interface Role {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

// Interface para papel com permissões
export interface RoleWithPermissions extends Role {
  permissions: DbPermission[]
}

// Interface para usuário com papéis
export interface UserWithRoles {
  id: string
  full_name: string | null
  email: string
  avatar_url: string | null
  is_super_admin: boolean
  roles: Role[]
}

// Mapeamento de recursos para labels em português
export const RESOURCE_LABELS: Record<Resource, string> = {
  [RESOURCES.ATAS]: 'Atas de Preço',
  [RESOURCES.TERMOS]: 'Termos de Referência',
  [RESOURCES.EQUIPAMENTOS]: 'Equipamentos',
  [RESOURCES.VAGAS]: 'Vagas',
  [RESOURCES.USERS]: 'Usuários',
  [RESOURCES.PERMISSIONS]: 'Permissões',
}

// Mapeamento de ações para labels em português
export const ACTION_LABELS: Record<Action, string> = {
  [ACTIONS.VIEW]: 'Visualizar',
  [ACTIONS.CREATE]: 'Criar',
  [ACTIONS.EDIT]: 'Editar',
  [ACTIONS.DELETE]: 'Excluir',
  [ACTIONS.MANAGE]: 'Gerenciar',
}

// Permissões para cada módulo do menu
export const MENU_PERMISSIONS: Record<string, { resource: Resource; action: Action }> = {
  '/admin': { resource: RESOURCES.ATAS, action: ACTIONS.VIEW }, // Dashboard - acesso básico
  '/admin/atas': { resource: RESOURCES.ATAS, action: ACTIONS.VIEW },
  '/admin/termos': { resource: RESOURCES.TERMOS, action: ACTIONS.VIEW },
  '/admin/equipamentos': { resource: RESOURCES.EQUIPAMENTOS, action: ACTIONS.VIEW },
  '/admin/vagas': { resource: RESOURCES.VAGAS, action: ACTIONS.VIEW },
  '/admin/users': { resource: RESOURCES.USERS, action: ACTIONS.VIEW },
  '/admin/permissions': { resource: RESOURCES.PERMISSIONS, action: ACTIONS.MANAGE },
}

// Papéis padrão do sistema
export const DEFAULT_ROLES = {
  SUPER_ADMIN: 'Super Administrador',
  ADMIN: 'Administrador',
  EDITOR: 'Editor',
  VIEWER: 'Visualizador',
} as const

