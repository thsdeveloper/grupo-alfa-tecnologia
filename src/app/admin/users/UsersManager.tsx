"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Pencil,
  Shield, 
  ShieldCheck,
  User,
  Check,
  Loader2,
} from "lucide-react"
import { type Role } from "@/lib/permissions/constants"
import { useRouter } from "next/navigation"

interface UserProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
  is_super_admin: boolean | null
  username: string | null
}

interface UsersManagerProps {
  initialUsers: UserProfile[]
  allRoles: Role[]
  userRoles: Array<{ user_id: string; role_id: string }>
  currentUserId: string
}

export function UsersManager({ 
  initialUsers, 
  allRoles,
  userRoles: initialUserRoles,
  currentUserId,
}: UsersManagerProps) {
  const router = useRouter()
  const [users, setUsers] = useState(initialUsers)
  const [userRoles, setUserRoles] = useState(initialUserRoles)
  const [isEditing, setIsEditing] = useState(false)
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set())
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Obter papéis de um usuário
  const getUserRoleIds = (userId: string): string[] => {
    return userRoles
      .filter(ur => ur.user_id === userId)
      .map(ur => ur.role_id)
  }

  // Obter nomes dos papéis de um usuário
  const getUserRoleNames = (userId: string): string[] => {
    const roleIds = getUserRoleIds(userId)
    return allRoles
      .filter(r => roleIds.includes(r.id))
      .map(r => r.name)
  }

  // Abrir diálogo de edição
  const openEditDialog = (user: UserProfile) => {
    setEditingUser(user)
    setSelectedRoles(new Set(getUserRoleIds(user.id)))
    setIsSuperAdmin(user.is_super_admin || false)
    setIsEditing(true)
  }

  // Toggle de papel
  const toggleRole = (roleId: string) => {
    const newSelected = new Set(selectedRoles)
    if (newSelected.has(roleId)) {
      newSelected.delete(roleId)
    } else {
      newSelected.add(roleId)
    }
    setSelectedRoles(newSelected)
  }

  // Salvar alterações
  const handleSave = async () => {
    if (!editingUser) return
    
    setIsSaving(true)
    try {
      const supabase = createClient()
      
      // Atualizar status de super admin
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ is_super_admin: isSuperAdmin })
        .eq('id', editingUser.id)
      
      if (profileError) throw profileError
      
      // Remover papéis antigos
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', editingUser.id)
      
      // Adicionar novos papéis
      if (selectedRoles.size > 0) {
        const rolesToAdd = Array.from(selectedRoles).map(roleId => ({
          user_id: editingUser.id,
          role_id: roleId,
        }))
        
        const { error: rolesError } = await supabase
          .from('user_roles')
          .insert(rolesToAdd)
        
        if (rolesError) throw rolesError
      }
      
      // Atualizar estado local
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, is_super_admin: isSuperAdmin }
          : u
      ))
      setUserRoles([
        ...userRoles.filter(ur => ur.user_id !== editingUser.id),
        ...Array.from(selectedRoles).map(roleId => ({
          user_id: editingUser.id,
          role_id: roleId,
        }))
      ])
      
      setIsEditing(false)
      setEditingUser(null)
      router.refresh()
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      alert('Erro ao atualizar usuário.')
    } finally {
      setIsSaving(false)
    }
  }

  // Obter iniciais do nome
  const getInitials = (name: string | null): string => {
    if (!name) return "U"
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-6">
      {/* Diálogo de Edição */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Editar Permissões do Usuário
            </DialogTitle>
            <DialogDescription>
              {editingUser?.full_name || editingUser?.username || "Usuário"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Super Admin Toggle */}
            <div className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 border-yellow-200">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-yellow-600" />
                <div>
                  <Label htmlFor="super-admin" className="font-semibold">
                    Super Administrador
                  </Label>
                  <p className="text-sm text-cinza-escuro">
                    Acesso total ao sistema, incluindo gerenciamento de permissões
                  </p>
                </div>
              </div>
              <Switch 
                id="super-admin"
                checked={isSuperAdmin}
                onCheckedChange={setIsSuperAdmin}
                disabled={editingUser?.id === currentUserId}
              />
            </div>

            {editingUser?.id === currentUserId && (
              <p className="text-sm text-yellow-600">
                Você não pode remover seu próprio status de super admin.
              </p>
            )}
            
            {/* Papéis */}
            <div className="space-y-3">
              <Label>Papéis</Label>
              <p className="text-sm text-cinza-escuro">
                Selecione os papéis que este usuário terá. Super admins têm todas as permissões automaticamente.
              </p>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {allRoles.map(role => (
                  <div 
                    key={role.id}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Checkbox 
                      id={`role-${role.id}`}
                      checked={selectedRoles.has(role.id)}
                      onCheckedChange={() => toggleRole(role.id)}
                      disabled={isSuperAdmin}
                    />
                    <Label 
                      htmlFor={`role-${role.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-verde" />
                        <span className="font-medium">{role.name}</span>
                      </div>
                      {role.description && (
                        <p className="text-sm text-cinza-escuro mt-1">
                          {role.description}
                        </p>
                      )}
                    </Label>
                  </div>
                ))}
                {allRoles.length === 0 && (
                  <p className="text-center py-4 text-cinza-escuro">
                    Nenhum papel cadastrado. Crie papéis na página de Permissões.
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-verde hover:bg-verde/90 text-preto"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários do Sistema</CardTitle>
          <CardDescription>
            Gerencie os papéis e permissões de cada usuário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Papéis</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const roleNames = getUserRoleNames(user.id)
                
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback className="bg-verde text-preto">
                            {getInitials(user.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {user.full_name || user.username || "Sem nome"}
                          </p>
                          <p className="text-sm text-cinza-escuro">
                            {user.username || ""}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.is_super_admin ? (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          Super Admin
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <User className="h-3 w-3 mr-1" />
                          Usuário
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {roleNames.length > 0 ? (
                          roleNames.map(name => (
                            <Badge key={name} variant="outline" className="text-xs">
                              {name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-cinza-escuro text-sm">Sem papéis</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(user)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-cinza-escuro">
                    Nenhum usuário cadastrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

