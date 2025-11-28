"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
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
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Shield, 
  Check,
  Loader2,
} from "lucide-react"
import { 
  RESOURCE_LABELS, 
  ACTION_LABELS, 
  type Role, 
  type DbPermission 
} from "@/lib/permissions/constants"
import { useRouter } from "next/navigation"

interface RolesManagerProps {
  initialRoles: Role[]
  allPermissions: DbPermission[]
  rolePermissions: Array<{ role_id: string; permission_id: string }>
}

export function RolesManager({ 
  initialRoles, 
  allPermissions,
  rolePermissions: initialRolePermissions,
}: RolesManagerProps) {
  const router = useRouter()
  const [roles, setRoles] = useState(initialRoles)
  const [rolePermissions, setRolePermissions] = useState(initialRolePermissions)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set())
  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleDescription, setNewRoleDescription] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  // Agrupar permissões por recurso
  const permissionsByResource = allPermissions.reduce((acc, permission) => {
    const resource = permission.resource
    if (!acc[resource]) {
      acc[resource] = []
    }
    acc[resource].push(permission)
    return acc
  }, {} as Record<string, DbPermission[]>)

  // Obter permissões de um papel
  const getRolePermissionIds = (roleId: string): string[] => {
    return rolePermissions
      .filter(rp => rp.role_id === roleId)
      .map(rp => rp.permission_id)
  }

  // Abrir diálogo de criação
  const openCreateDialog = () => {
    setNewRoleName("")
    setNewRoleDescription("")
    setSelectedPermissions(new Set())
    setIsCreating(true)
  }

  // Abrir diálogo de edição
  const openEditDialog = (role: Role) => {
    setEditingRole(role)
    setNewRoleName(role.name)
    setNewRoleDescription(role.description || "")
    setSelectedPermissions(new Set(getRolePermissionIds(role.id)))
    setIsEditing(true)
  }

  // Toggle de permissão
  const togglePermission = (permissionId: string) => {
    const newSelected = new Set(selectedPermissions)
    if (newSelected.has(permissionId)) {
      newSelected.delete(permissionId)
    } else {
      newSelected.add(permissionId)
    }
    setSelectedPermissions(newSelected)
  }

  // Selecionar todas as permissões de um recurso
  const toggleResourcePermissions = (resource: string) => {
    const resourcePermissions = permissionsByResource[resource] || []
    const allSelected = resourcePermissions.every(p => selectedPermissions.has(p.id))
    
    const newSelected = new Set(selectedPermissions)
    if (allSelected) {
      // Desmarcar todas
      resourcePermissions.forEach(p => newSelected.delete(p.id))
    } else {
      // Marcar todas
      resourcePermissions.forEach(p => newSelected.add(p.id))
    }
    setSelectedPermissions(newSelected)
  }

  // Criar novo papel
  const handleCreate = async () => {
    if (!newRoleName.trim()) return
    
    setIsSaving(true)
    try {
      const supabase = createClient()
      
      // Criar papel
      const { data: newRole, error: roleError } = await supabase
        .from('roles')
        .insert({
          name: newRoleName.trim(),
          description: newRoleDescription.trim() || null,
        })
        .select()
        .single()
      
      if (roleError) throw roleError
      
      // Adicionar permissões
      if (selectedPermissions.size > 0) {
        const permissionsToAdd = Array.from(selectedPermissions).map(permissionId => ({
          role_id: newRole.id,
          permission_id: permissionId,
        }))
        
        const { error: permError } = await supabase
          .from('role_permissions')
          .insert(permissionsToAdd)
        
        if (permError) throw permError
        
        // Atualizar estado local
        setRolePermissions([...rolePermissions, ...permissionsToAdd])
      }
      
      setRoles([...roles, newRole as Role])
      setIsCreating(false)
      router.refresh()
    } catch (error) {
      console.error('Erro ao criar papel:', error)
      alert('Erro ao criar papel. Verifique se o nome já não está em uso.')
    } finally {
      setIsSaving(false)
    }
  }

  // Atualizar papel existente
  const handleUpdate = async () => {
    if (!editingRole || !newRoleName.trim()) return
    
    setIsSaving(true)
    try {
      const supabase = createClient()
      
      // Atualizar papel
      const { error: roleError } = await supabase
        .from('roles')
        .update({
          name: newRoleName.trim(),
          description: newRoleDescription.trim() || null,
        })
        .eq('id', editingRole.id)
      
      if (roleError) throw roleError
      
      // Remover permissões antigas
      await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', editingRole.id)
      
      // Adicionar novas permissões
      if (selectedPermissions.size > 0) {
        const permissionsToAdd = Array.from(selectedPermissions).map(permissionId => ({
          role_id: editingRole.id,
          permission_id: permissionId,
        }))
        
        const { error: permError } = await supabase
          .from('role_permissions')
          .insert(permissionsToAdd)
        
        if (permError) throw permError
      }
      
      // Atualizar estado local
      setRoles(roles.map(r => 
        r.id === editingRole.id 
          ? { ...r, name: newRoleName.trim(), description: newRoleDescription.trim() || null }
          : r
      ))
      setRolePermissions([
        ...rolePermissions.filter(rp => rp.role_id !== editingRole.id),
        ...Array.from(selectedPermissions).map(permissionId => ({
          role_id: editingRole.id,
          permission_id: permissionId,
        }))
      ])
      
      setIsEditing(false)
      setEditingRole(null)
      router.refresh()
    } catch (error) {
      console.error('Erro ao atualizar papel:', error)
      alert('Erro ao atualizar papel.')
    } finally {
      setIsSaving(false)
    }
  }

  // Excluir papel
  const handleDelete = async (roleId: string) => {
    if (!confirm('Tem certeza que deseja excluir este papel? Esta ação não pode ser desfeita.')) {
      return
    }
    
    setIsDeleting(roleId)
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', roleId)
      
      if (error) throw error
      
      setRoles(roles.filter(r => r.id !== roleId))
      setRolePermissions(rolePermissions.filter(rp => rp.role_id !== roleId))
      router.refresh()
    } catch (error) {
      console.error('Erro ao excluir papel:', error)
      alert('Erro ao excluir papel. Verifique se não há usuários associados.')
    } finally {
      setIsDeleting(null)
    }
  }

  // Renderizar formulário de permissões
  const renderPermissionsForm = () => (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {Object.entries(permissionsByResource).map(([resource, permissions]) => {
        const allSelected = permissions.every(p => selectedPermissions.has(p.id))
        const someSelected = permissions.some(p => selectedPermissions.has(p.id))
        
        return (
          <div key={resource} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Checkbox 
                  id={`resource-${resource}`}
                  checked={allSelected}
                  indeterminate={someSelected && !allSelected}
                  onCheckedChange={() => toggleResourcePermissions(resource)}
                />
                <Label 
                  htmlFor={`resource-${resource}`}
                  className="font-semibold text-preto cursor-pointer"
                >
                  {RESOURCE_LABELS[resource as keyof typeof RESOURCE_LABELS] || resource}
                </Label>
              </div>
              <Badge variant="outline" className="text-xs">
                {permissions.filter(p => selectedPermissions.has(p.id)).length}/{permissions.length}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 ml-6">
              {permissions.map(permission => (
                <div key={permission.id} className="flex items-center gap-2">
                  <Checkbox 
                    id={`perm-${permission.id}`}
                    checked={selectedPermissions.has(permission.id)}
                    onCheckedChange={() => togglePermission(permission.id)}
                  />
                  <Label 
                    htmlFor={`perm-${permission.id}`}
                    className="text-sm text-cinza-escuro cursor-pointer"
                  >
                    {ACTION_LABELS[permission.action as keyof typeof ACTION_LABELS] || permission.action}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Botão de criar */}
      <div className="flex justify-end">
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                openCreateDialog()
              }} 
              className="bg-verde hover:bg-verde/90 text-preto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Papel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Criar Novo Papel
              </DialogTitle>
              <DialogDescription>
                Defina o nome, descrição e permissões do novo papel
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Papel</Label>
                <Input 
                  id="name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="Ex: Gerente de Vendas"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Input 
                  id="description"
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  placeholder="Descrição do papel e suas responsabilidades"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Permissões</Label>
                {renderPermissionsForm()}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={isSaving || !newRoleName.trim()}
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
                    Criar Papel
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Diálogo de Edição */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Editar Papel
            </DialogTitle>
            <DialogDescription>
              Modifique o nome, descrição e permissões do papel
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome do Papel</Label>
              <Input 
                id="edit-name"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Ex: Gerente de Vendas"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição (opcional)</Label>
              <Input 
                id="edit-description"
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
                placeholder="Descrição do papel e suas responsabilidades"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Permissões</Label>
              {renderPermissionsForm()}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdate}
              disabled={isSaving || !newRoleName.trim()}
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

      {/* Lista de Papéis */}
      <Card>
        <CardHeader>
          <CardTitle>Papéis do Sistema</CardTitle>
          <CardDescription>
            Gerencie os papéis e suas permissões associadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-center">Permissões</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => {
                const permCount = getRolePermissionIds(role.id).length
                
                return (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-verde" />
                        {role.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-cinza-escuro">
                      {role.description || "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {permCount} {permCount === 1 ? "permissão" : "permissões"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(role)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(role.id)}
                          disabled={isDeleting === role.id}
                        >
                          {isDeleting === role.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {roles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-cinza-escuro">
                    Nenhum papel cadastrado
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

