"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Briefcase,
  Plus,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  Loader2,
  Users,
  MapPin,
  AlertCircle,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { PermissionGate } from "@/components/admin/PermissionGate"
import type { DbPermission } from "@/lib/permissions/constants"

interface Vaga {
  id: string
  titulo: string
  descricao: string | null
  requisitos: string | null
  beneficios: string | null
  local: string | null
  tipo_contrato: string
  ativo: boolean | null
  created_at: string | null
  updated_at: string | null
  candidaturas_count?: number
}

const tipoContratoConfig: Record<string, { label: string; color: string }> = {
  clt: { label: "CLT", color: "bg-blue-100 text-blue-700" },
  pj: { label: "PJ", color: "bg-purple-100 text-purple-700" },
  estagio: { label: "Estágio", color: "bg-green-100 text-green-700" },
}

const tiposContrato = Object.keys(tipoContratoConfig)

export default function VagasPage() {
  const supabase = createClient()
  const [vagas, setVagas] = useState<Vaga[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFilter, setTipoFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [editOpen, setEditOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editingVaga, setEditingVaga] = useState<Partial<Vaga> | null>(null)
  const [userPermissions, setUserPermissions] = useState<DbPermission[]>([])
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [permissionsLoading, setPermissionsLoading] = useState(true)

  const fetchVagas = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from("vagas")
        .select("*")
        .order("created_at", { ascending: false })

      if (tipoFilter) {
        query = query.eq("tipo_contrato", tipoFilter)
      }

      if (statusFilter === "ativo") {
        query = query.eq("ativo", true)
      } else if (statusFilter === "inativo") {
        query = query.eq("ativo", false)
      }

      const { data: vagasData, error } = await query

      if (error) throw error

      // Buscar contagem de candidaturas para cada vaga
      const vagasComCandidaturas = await Promise.all(
        (vagasData || []).map(async (vaga) => {
          const { count } = await supabase
            .from("candidaturas")
            .select("*", { count: "exact", head: true })
            .eq("vaga_id", vaga.id)
          
          return {
            ...vaga,
            candidaturas_count: count || 0,
          }
        })
      )

      setVagas(vagasComCandidaturas)
    } catch (error) {
      console.error("Erro ao buscar vagas:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase, tipoFilter, statusFilter])

  // Buscar permissões do usuário
  useEffect(() => {
    async function loadPermissions() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        setUserId(user.id)

        // Verificar se é super admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_super_admin')
          .eq('id', user.id)
          .single()

        if (profile?.is_super_admin) {
          setIsSuperAdmin(true)
          // Super admin tem todas as permissões
          const { data: allPermissions } = await supabase
            .from('permissions')
            .select('*')
          setUserPermissions((allPermissions || []) as DbPermission[])
        } else {
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
            .eq('user_id', user.id)

          if (data) {
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
            setUserPermissions(Array.from(permissionsSet.values()))
          }
        }
      } catch (error) {
        console.error('Erro ao carregar permissões:', error)
      } finally {
        setPermissionsLoading(false)
      }
    }

    loadPermissions()
  }, [supabase])

  useEffect(() => {
    fetchVagas()
  }, [fetchVagas])

  // Função auxiliar para verificar permissão
  const hasPermission = (resource: string, action: string): boolean => {
    if (isSuperAdmin) return true
    return userPermissions.some(p => p.resource === resource && p.action === action)
  }

  const handleSave = async () => {
    if (!editingVaga?.titulo || !editingVaga?.tipo_contrato) {
      alert("Título e tipo de contrato são obrigatórios")
      return
    }

    // Verificar permissões
    if (editingVaga.id) {
      // Atualizar - precisa de permissão edit ou manage
      if (!hasPermission('vagas', 'edit') && !hasPermission('vagas', 'manage')) {
        alert("Você não tem permissão para editar vagas")
        return
      }
    } else {
      // Criar - precisa de permissão create ou manage
      if (!hasPermission('vagas', 'create') && !hasPermission('vagas', 'manage')) {
        alert("Você não tem permissão para criar vagas")
        return
      }
    }

    setSaving(true)
    try {
      if (editingVaga.id) {
        // Atualizar
        const { id, created_at, updated_at, candidaturas_count, ...updateData } = editingVaga
        const { error } = await supabase
          .from("vagas")
          .update(updateData)
          .eq("id", id)

        if (error) throw error
      } else {
        // Criar
        const insertData = {
          titulo: editingVaga.titulo!,
          tipo_contrato: editingVaga.tipo_contrato!,
          descricao: editingVaga.descricao,
          requisitos: editingVaga.requisitos,
          beneficios: editingVaga.beneficios,
          local: editingVaga.local,
          ativo: editingVaga.ativo ?? true,
        }
        const { error } = await supabase.from("vagas").insert(insertData)

        if (error) throw error
      }

      setEditOpen(false)
      setEditingVaga(null)
      fetchVagas()
    } catch (error) {
      console.error("Erro ao salvar:", error)
      alert("Erro ao salvar vaga")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    // Verificar permissão
    if (!hasPermission('vagas', 'delete') && !hasPermission('vagas', 'manage')) {
      alert("Você não tem permissão para excluir vagas")
      return
    }

    setDeleting(true)
    try {
      const { error } = await supabase.from("vagas").delete().eq("id", id)

      if (error) throw error

      setDeleteConfirm(null)
      fetchVagas()
    } catch (error) {
      console.error("Erro ao excluir:", error)
      alert("Erro ao excluir vaga. Verifique se não há candidaturas vinculadas.")
    } finally {
      setDeleting(false)
    }
  }

  const toggleAtivo = async (vaga: Vaga) => {
    // Verificar permissão para editar
    if (!hasPermission('vagas', 'edit') && !hasPermission('vagas', 'manage')) {
      alert("Você não tem permissão para editar vagas")
      return
    }

    try {
      const { error } = await supabase
        .from("vagas")
        .update({ ativo: !vaga.ativo })
        .eq("id", vaga.id)

      if (error) throw error
      fetchVagas()
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  const openEdit = (vaga?: Vaga) => {
    setEditingVaga(
      vaga || {
        titulo: "",
        tipo_contrato: "clt",
        ativo: true,
      }
    )
    setEditOpen(true)
  }

  const filteredVagas = vagas.filter(
    (vaga) =>
      vaga.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaga.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vaga.local?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Estatísticas
  const totalVagas = vagas.length
  const vagasAtivas = vagas.filter((v) => v.ativo).length
  const totalCandidaturas = vagas.reduce((acc, v) => acc + (v.candidaturas_count || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-preto">
            Gestão de Vagas
          </h1>
          <p className="text-cinza-escuro mt-1">
            Gerencie as vagas de emprego e visualize candidaturas
          </p>
        </div>
        {userId && (
          <PermissionGate 
            resource="vagas" 
            action="create" 
            userId={userId}
          >
            <Button onClick={() => openEdit()} className="bg-verde hover:bg-verde/90 text-preto">
              <Plus className="h-4 w-4 mr-2" />
              Nova Vaga
            </Button>
          </PermissionGate>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-preto">{totalVagas}</p>
                <p className="text-sm text-cinza-escuro">Total de Vagas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-preto">{vagasAtivas}</p>
                <p className="text-sm text-cinza-escuro">Vagas Ativas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-preto">{totalCandidaturas}</p>
                <p className="text-sm text-cinza-escuro">Total de Candidaturas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cinza-escuro" />
              <Input
                placeholder="Buscar por título, descrição ou local..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Todos os tipos</option>
              {tiposContrato.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipoContratoConfig[tipo].label}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Todos os status</option>
              <option value="ativo">Ativas</option>
              <option value="inativo">Inativas</option>
            </select>
            <Button variant="outline" onClick={fetchVagas} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-heading">Lista de Vagas</CardTitle>
          <CardDescription>
            {filteredVagas.length} vaga(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-verde" />
            </div>
          ) : filteredVagas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Briefcase className="h-12 w-12 text-cinza-escuro mb-4" />
              <h3 className="text-lg font-medium text-preto">Nenhuma vaga encontrada</h3>
              <p className="text-cinza-escuro mt-1">
                {searchTerm || tipoFilter || statusFilter
                  ? "Tente ajustar os filtros"
                  : "Clique em 'Nova Vaga' para começar"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vaga</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-center">Candidaturas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVagas.map((vaga) => {
                  const tipoConfig = tipoContratoConfig[vaga.tipo_contrato] || {
                    label: vaga.tipo_contrato,
                    color: "bg-gray-100 text-gray-700",
                  }

                  return (
                    <TableRow key={vaga.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-verde/20 flex items-center justify-center">
                            <Briefcase className="h-4 w-4 text-verde" />
                          </div>
                          <span className="truncate max-w-[250px]">{vaga.titulo}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-cinza-escuro">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {vaga.local || "Não informado"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={tipoConfig.color}>
                          {tipoConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Link href={`/admin/vagas/${vaga.id}/candidaturas`}>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-verde/10"
                          >
                            <Users className="h-3 w-3 mr-1" />
                            {vaga.candidaturas_count || 0}
                          </Badge>
                        </Link>
                      </TableCell>
                      <TableCell>
                        {userId && (
                          <PermissionGate 
                            resource="vagas" 
                            action="edit" 
                            userId={userId}
                            fallback={
                              <Badge
                                variant={vaga.ativo ? "success" : "secondary"}
                                className="cursor-not-allowed opacity-50"
                              >
                                {vaga.ativo ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Ativa
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Inativa
                                  </>
                                )}
                              </Badge>
                            }
                          >
                            <Badge
                              variant={vaga.ativo ? "success" : "secondary"}
                              className="cursor-pointer"
                              onClick={() => toggleAtivo(vaga)}
                            >
                              {vaga.ativo ? (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Ativa
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Inativa
                                </>
                              )}
                            </Badge>
                          </PermissionGate>
                        )}
                        {!userId && (
                          <Badge
                            variant={vaga.ativo ? "success" : "secondary"}
                          >
                            {vaga.ativo ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Ativa
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Inativa
                              </>
                            )}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/vagas/${vaga.id}/candidaturas`}>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              title="Ver Candidaturas"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          {userId && (
                            <>
                              <PermissionGate 
                                resource="vagas" 
                                action="edit" 
                                userId={userId}
                              >
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => openEdit(vaga)}
                                  title="Editar"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </PermissionGate>
                              <PermissionGate 
                                resource="vagas" 
                                action="delete" 
                                userId={userId}
                              >
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => setDeleteConfirm(vaga.id)}
                                  title="Excluir"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </PermissionGate>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent onClose={() => setEditOpen(false)} className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingVaga?.id ? "Editar Vaga" : "Nova Vaga"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da vaga. Campos com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>

          {editingVaga && (
            <div className="space-y-6">
              {/* Dados Básicos */}
              <div className="space-y-4">
                <h4 className="font-semibold text-preto border-b pb-2">Dados da Vaga</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="titulo">Título da Vaga *</Label>
                    <Input
                      id="titulo"
                      value={editingVaga.titulo || ""}
                      onChange={(e) =>
                        setEditingVaga({
                          ...editingVaga,
                          titulo: e.target.value,
                        })
                      }
                      placeholder="Ex: Técnico em Fibra Óptica"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tipo_contrato">Tipo de Contrato *</Label>
                    <select
                      id="tipo_contrato"
                      value={editingVaga.tipo_contrato || "clt"}
                      onChange={(e) =>
                        setEditingVaga({
                          ...editingVaga,
                          tipo_contrato: e.target.value,
                        })
                      }
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    >
                      {tiposContrato.map((tipo) => (
                        <option key={tipo} value={tipo}>
                          {tipoContratoConfig[tipo].label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="local">Local de Trabalho</Label>
                    <Input
                      id="local"
                      value={editingVaga.local || ""}
                      onChange={(e) =>
                        setEditingVaga({
                          ...editingVaga,
                          local: e.target.value,
                        })
                      }
                      placeholder="Ex: Brasília - DF"
                    />
                  </div>
                </div>
              </div>

              {/* Descrição */}
              <div className="space-y-4">
                <h4 className="font-semibold text-preto border-b pb-2">Descrição e Requisitos</h4>
                <div>
                  <Label htmlFor="descricao">Descrição da Vaga</Label>
                  <textarea
                    id="descricao"
                    value={editingVaga.descricao || ""}
                    onChange={(e) =>
                      setEditingVaga({
                        ...editingVaga,
                        descricao: e.target.value,
                      })
                    }
                    placeholder="Descreva as atividades e responsabilidades da vaga..."
                    className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="requisitos">Requisitos</Label>
                  <textarea
                    id="requisitos"
                    value={editingVaga.requisitos || ""}
                    onChange={(e) =>
                      setEditingVaga({
                        ...editingVaga,
                        requisitos: e.target.value,
                      })
                    }
                    placeholder="Liste os requisitos necessários para a vaga..."
                    className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="beneficios">Benefícios</Label>
                  <textarea
                    id="beneficios"
                    value={editingVaga.beneficios || ""}
                    onChange={(e) =>
                      setEditingVaga({
                        ...editingVaga,
                        beneficios: e.target.value,
                      })
                    }
                    placeholder="Liste os benefícios oferecidos..."
                    className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={editingVaga.ativo ?? true}
                  onChange={(e) =>
                    setEditingVaga({
                      ...editingVaga,
                      ativo: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <Label htmlFor="ativo">Vaga ativa (visível no site)</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-verde hover:bg-verde/90 text-preto"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent onClose={() => setDeleteConfirm(null)} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta vaga? Todas as candidaturas vinculadas também serão excluídas. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

