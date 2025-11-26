"use client"

import { useState, useEffect, useCallback } from "react"
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
  Package,
  Plus,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  Loader2,
  Camera,
  Network,
  BatteryCharging,
  Server,
  Box,
  AlertCircle,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Equipamento {
  id: string
  nome_comercial: string
  fabricante: string | null
  categoria: string
  formato: string | null
  tecnologia: string | null
  resolucao_mp: number | null
  varifocal: boolean | null
  ptz: boolean | null
  poe: boolean | null
  ir_metros: number | null
  potencia_va: number | null
  autonomia_min: number | null
  portas: number | null
  velocidade: string | null
  capacidade_armazenamento_tb: number | null
  caracteristicas_livres: string | null
  preco_custo: number | null
  preco_venda: number | null
  ativo: boolean | null
  created_at: string | null
}

const categoriaConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  camera: { label: "Câmera", icon: Camera, color: "bg-blue-100 text-blue-700" },
  switch: { label: "Switch", icon: Network, color: "bg-purple-100 text-purple-700" },
  nobreak: { label: "No-break", icon: BatteryCharging, color: "bg-yellow-100 text-yellow-700" },
  servidor: { label: "Servidor", icon: Server, color: "bg-green-100 text-green-700" },
  rack: { label: "Rack", icon: Box, color: "bg-gray-100 text-gray-700" },
  acessorio: { label: "Acessório", icon: Package, color: "bg-orange-100 text-orange-700" },
  software: { label: "Software", icon: Package, color: "bg-pink-100 text-pink-700" },
  outros: { label: "Outros", icon: Package, color: "bg-gray-100 text-gray-700" },
}

const categorias = Object.keys(categoriaConfig)

export default function EquipamentosPage() {
  const supabase = createClient()
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState<string>("")
  const [editOpen, setEditOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editingEquipamento, setEditingEquipamento] = useState<Partial<Equipamento> | null>(null)

  const fetchEquipamentos = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from("equipamentos")
        .select("*")
        .order("nome_comercial", { ascending: true })

      if (categoriaFilter) {
        query = query.eq("categoria", categoriaFilter)
      }

      const { data, error } = await query

      if (error) throw error
      setEquipamentos(data || [])
    } catch (error) {
      console.error("Erro ao buscar equipamentos:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase, categoriaFilter])

  useEffect(() => {
    fetchEquipamentos()
  }, [fetchEquipamentos])

  const handleSave = async () => {
    if (!editingEquipamento?.nome_comercial || !editingEquipamento?.categoria) {
      alert("Nome e categoria são obrigatórios")
      return
    }

    setSaving(true)
    try {
      if (editingEquipamento.id) {
        // Atualizar
        const { id, created_at, ...updateData } = editingEquipamento
        const { error } = await supabase
          .from("equipamentos")
          .update(updateData)
          .eq("id", id)

        if (error) throw error
      } else {
        // Criar - garantir campos obrigatórios
        const insertData = {
          nome_comercial: editingEquipamento.nome_comercial!,
          categoria: editingEquipamento.categoria!,
          fabricante: editingEquipamento.fabricante,
          formato: editingEquipamento.formato,
          tecnologia: editingEquipamento.tecnologia,
          resolucao_mp: editingEquipamento.resolucao_mp,
          varifocal: editingEquipamento.varifocal,
          ptz: editingEquipamento.ptz,
          poe: editingEquipamento.poe,
          ir_metros: editingEquipamento.ir_metros,
          potencia_va: editingEquipamento.potencia_va,
          autonomia_min: editingEquipamento.autonomia_min,
          portas: editingEquipamento.portas,
          velocidade: editingEquipamento.velocidade,
          capacidade_armazenamento_tb: editingEquipamento.capacidade_armazenamento_tb,
          caracteristicas_livres: editingEquipamento.caracteristicas_livres,
          preco_custo: editingEquipamento.preco_custo,
          preco_venda: editingEquipamento.preco_venda,
          ativo: editingEquipamento.ativo ?? true,
        }
        const { error } = await supabase.from("equipamentos").insert(insertData)

        if (error) throw error
      }

      setEditOpen(false)
      setEditingEquipamento(null)
      fetchEquipamentos()
    } catch (error) {
      console.error("Erro ao salvar:", error)
      alert("Erro ao salvar equipamento")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(true)
    try {
      const { error } = await supabase.from("equipamentos").delete().eq("id", id)

      if (error) throw error

      setDeleteConfirm(null)
      fetchEquipamentos()
    } catch (error) {
      console.error("Erro ao excluir:", error)
      alert("Erro ao excluir equipamento")
    } finally {
      setDeleting(false)
    }
  }

  const openEdit = (equipamento?: Equipamento) => {
    setEditingEquipamento(
      equipamento || {
        nome_comercial: "",
        categoria: "camera",
        ativo: true,
      }
    )
    setEditOpen(true)
  }

  const filteredEquipamentos = equipamentos.filter(
    (eq) =>
      eq.nome_comercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.fabricante?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.caracteristicas_livres?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Estatísticas por categoria
  const estatisticas = categorias.reduce((acc, cat) => {
    acc[cat] = equipamentos.filter((eq) => eq.categoria === cat).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-preto">
            Catálogo de Equipamentos
          </h1>
          <p className="text-cinza-escuro mt-1">
            Gerencie o catálogo interno de equipamentos da empresa
          </p>
        </div>
        <Button onClick={() => openEdit()} className="bg-verde hover:bg-verde/90 text-preto">
          <Plus className="h-4 w-4 mr-2" />
          Novo Equipamento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8">
        {categorias.slice(0, 5).map((cat) => {
          const config = categoriaConfig[cat]
          const Icon = config.icon
          return (
            <Card
              key={cat}
              className={`border-0 shadow-md cursor-pointer transition-all ${
                categoriaFilter === cat ? "ring-2 ring-verde" : ""
              }`}
              onClick={() => setCategoriaFilter(categoriaFilter === cat ? "" : cat)}
            >
              <CardContent className="pt-4 pb-4">
                <div className="flex flex-col items-center text-center">
                  <div className={`h-10 w-10 rounded-lg ${config.color} flex items-center justify-center mb-2`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-bold text-preto">{estatisticas[cat] || 0}</p>
                  <p className="text-xs text-cinza-escuro">{config.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cinza-escuro" />
              <Input
                placeholder="Buscar por nome, fabricante ou características..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={categoriaFilter}
              onChange={(e) => setCategoriaFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Todas as categorias</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {categoriaConfig[cat].label}
                </option>
              ))}
            </select>
            <Button variant="outline" onClick={fetchEquipamentos} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-heading">Lista de Equipamentos</CardTitle>
          <CardDescription>
            {filteredEquipamentos.length} equipamento(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-verde" />
            </div>
          ) : filteredEquipamentos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-cinza-escuro mb-4" />
              <h3 className="text-lg font-medium text-preto">Nenhum equipamento encontrado</h3>
              <p className="text-cinza-escuro mt-1">
                {searchTerm || categoriaFilter
                  ? "Tente ajustar os filtros"
                  : "Clique em 'Novo Equipamento' para começar"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Fabricante</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Specs</TableHead>
                  <TableHead className="text-right">Preço Venda</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipamentos.map((eq) => {
                  const config = categoriaConfig[eq.categoria] || categoriaConfig.outros
                  const Icon = config.icon

                  // Montar specs resumidas
                  const specs: string[] = []
                  if (eq.resolucao_mp) specs.push(`${eq.resolucao_mp}MP`)
                  if (eq.ptz) specs.push("PTZ")
                  if (eq.poe) specs.push("PoE")
                  if (eq.ir_metros) specs.push(`IR ${eq.ir_metros}m`)
                  if (eq.portas) specs.push(`${eq.portas} portas`)
                  if (eq.potencia_va) specs.push(`${eq.potencia_va}VA`)
                  if (eq.velocidade) specs.push(eq.velocidade)

                  return (
                    <TableRow key={eq.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className={`h-8 w-8 rounded-lg ${config.color} flex items-center justify-center`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="truncate max-w-[200px]">{eq.nome_comercial}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-cinza-escuro">
                        {eq.fabricante || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {specs.slice(0, 3).map((spec, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                          {specs.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{specs.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {eq.preco_venda
                          ? `R$ ${eq.preco_venda.toFixed(2)}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={eq.ativo ? "success" : "secondary"}>
                          {eq.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openEdit(eq)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setDeleteConfirm(eq.id)}
                            title="Excluir"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
              {editingEquipamento?.id ? "Editar Equipamento" : "Novo Equipamento"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do equipamento. Campos com * são obrigatórios.
            </DialogDescription>
          </DialogHeader>

          {editingEquipamento && (
            <div className="space-y-6">
              {/* Dados Básicos */}
              <div className="space-y-4">
                <h4 className="font-semibold text-preto border-b pb-2">Dados Básicos</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="nome">Nome Comercial *</Label>
                    <Input
                      id="nome"
                      value={editingEquipamento.nome_comercial || ""}
                      onChange={(e) =>
                        setEditingEquipamento({
                          ...editingEquipamento,
                          nome_comercial: e.target.value,
                        })
                      }
                      placeholder="Ex: Câmera IP Bullet 4MP IR 30m"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fabricante">Fabricante</Label>
                    <Input
                      id="fabricante"
                      value={editingEquipamento.fabricante || ""}
                      onChange={(e) =>
                        setEditingEquipamento({
                          ...editingEquipamento,
                          fabricante: e.target.value,
                        })
                      }
                      placeholder="Ex: Intelbras"
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoria">Categoria *</Label>
                    <select
                      id="categoria"
                      value={editingEquipamento.categoria || "camera"}
                      onChange={(e) =>
                        setEditingEquipamento({
                          ...editingEquipamento,
                          categoria: e.target.value,
                        })
                      }
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    >
                      {categorias.map((cat) => (
                        <option key={cat} value={cat}>
                          {categoriaConfig[cat].label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Especificações */}
              <div className="space-y-4">
                <h4 className="font-semibold text-preto border-b pb-2">Especificações</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="formato">Formato</Label>
                    <Input
                      id="formato"
                      value={editingEquipamento.formato || ""}
                      onChange={(e) =>
                        setEditingEquipamento({
                          ...editingEquipamento,
                          formato: e.target.value,
                        })
                      }
                      placeholder="Ex: bullet, dome, torre"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tecnologia">Tecnologia</Label>
                    <Input
                      id="tecnologia"
                      value={editingEquipamento.tecnologia || ""}
                      onChange={(e) =>
                        setEditingEquipamento({
                          ...editingEquipamento,
                          tecnologia: e.target.value,
                        })
                      }
                      placeholder="Ex: IP, PoE, Gigabit"
                    />
                  </div>
                  <div>
                    <Label htmlFor="resolucao">Resolução (MP)</Label>
                    <Input
                      id="resolucao"
                      type="number"
                      step="0.1"
                      value={editingEquipamento.resolucao_mp || ""}
                      onChange={(e) =>
                        setEditingEquipamento({
                          ...editingEquipamento,
                          resolucao_mp: e.target.value ? parseFloat(e.target.value) : null,
                        })
                      }
                      placeholder="Ex: 4"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ir_metros">IR (metros)</Label>
                    <Input
                      id="ir_metros"
                      type="number"
                      value={editingEquipamento.ir_metros || ""}
                      onChange={(e) =>
                        setEditingEquipamento({
                          ...editingEquipamento,
                          ir_metros: e.target.value ? parseInt(e.target.value) : null,
                        })
                      }
                      placeholder="Ex: 30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="portas">Portas</Label>
                    <Input
                      id="portas"
                      type="number"
                      value={editingEquipamento.portas || ""}
                      onChange={(e) =>
                        setEditingEquipamento({
                          ...editingEquipamento,
                          portas: e.target.value ? parseInt(e.target.value) : null,
                        })
                      }
                      placeholder="Ex: 8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="velocidade">Velocidade</Label>
                    <Input
                      id="velocidade"
                      value={editingEquipamento.velocidade || ""}
                      onChange={(e) =>
                        setEditingEquipamento({
                          ...editingEquipamento,
                          velocidade: e.target.value,
                        })
                      }
                      placeholder="Ex: gigabit"
                    />
                  </div>
                  <div>
                    <Label htmlFor="potencia_va">Potência (VA)</Label>
                    <Input
                      id="potencia_va"
                      type="number"
                      value={editingEquipamento.potencia_va || ""}
                      onChange={(e) =>
                        setEditingEquipamento({
                          ...editingEquipamento,
                          potencia_va: e.target.value ? parseInt(e.target.value) : null,
                        })
                      }
                      placeholder="Ex: 1500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="autonomia">Autonomia (min)</Label>
                    <Input
                      id="autonomia"
                      type="number"
                      value={editingEquipamento.autonomia_min || ""}
                      onChange={(e) =>
                        setEditingEquipamento({
                          ...editingEquipamento,
                          autonomia_min: e.target.value ? parseInt(e.target.value) : null,
                        })
                      }
                      placeholder="Ex: 30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacidade">Capacidade (TB)</Label>
                    <Input
                      id="capacidade"
                      type="number"
                      step="0.01"
                      value={editingEquipamento.capacidade_armazenamento_tb || ""}
                      onChange={(e) =>
                        setEditingEquipamento({
                          ...editingEquipamento,
                          capacidade_armazenamento_tb: e.target.value
                            ? parseFloat(e.target.value)
                            : null,
                        })
                      }
                      placeholder="Ex: 2"
                    />
                  </div>
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingEquipamento.ptz || false}
                      onChange={(e) =>
                        setEditingEquipamento({
                          ...editingEquipamento,
                          ptz: e.target.checked,
                        })
                      }
                      className="rounded"
                    />
                    <span className="text-sm">PTZ</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingEquipamento.varifocal || false}
                      onChange={(e) =>
                        setEditingEquipamento({
                          ...editingEquipamento,
                          varifocal: e.target.checked,
                        })
                      }
                      className="rounded"
                    />
                    <span className="text-sm">Varifocal</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingEquipamento.poe || false}
                      onChange={(e) =>
                        setEditingEquipamento({
                          ...editingEquipamento,
                          poe: e.target.checked,
                        })
                      }
                      className="rounded"
                    />
                    <span className="text-sm">PoE</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingEquipamento.ativo ?? true}
                      onChange={(e) =>
                        setEditingEquipamento({
                          ...editingEquipamento,
                          ativo: e.target.checked,
                        })
                      }
                      className="rounded"
                    />
                    <span className="text-sm">Ativo</span>
                  </label>
                </div>
              </div>

              {/* Preços */}
              <div className="space-y-4">
                <h4 className="font-semibold text-preto border-b pb-2">Preços</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preco_custo">Preço de Custo (R$)</Label>
                    <Input
                      id="preco_custo"
                      type="number"
                      step="0.01"
                      value={editingEquipamento.preco_custo || ""}
                      onChange={(e) =>
                        setEditingEquipamento({
                          ...editingEquipamento,
                          preco_custo: e.target.value ? parseFloat(e.target.value) : null,
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="preco_venda">Preço de Venda (R$)</Label>
                    <Input
                      id="preco_venda"
                      type="number"
                      step="0.01"
                      value={editingEquipamento.preco_venda || ""}
                      onChange={(e) =>
                        setEditingEquipamento({
                          ...editingEquipamento,
                          preco_venda: e.target.value ? parseFloat(e.target.value) : null,
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Características Livres */}
              <div className="space-y-4">
                <h4 className="font-semibold text-preto border-b pb-2">Características Adicionais</h4>
                <div>
                  <Label htmlFor="caracteristicas">Descrição / Ficha Técnica</Label>
                  <textarea
                    id="caracteristicas"
                    value={editingEquipamento.caracteristicas_livres || ""}
                    onChange={(e) =>
                      setEditingEquipamento({
                        ...editingEquipamento,
                        caracteristicas_livres: e.target.value,
                      })
                    }
                    placeholder="Descreva características adicionais do equipamento..."
                    className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  />
                </div>
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
              Tem certeza que deseja excluir este equipamento? Esta ação não pode ser desfeita.
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

