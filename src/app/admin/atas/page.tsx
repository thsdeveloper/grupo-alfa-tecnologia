"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  DialogFooter,
} from "@/components/ui/dialog"
import {
  ScrollText,
  Plus,
  Search,
  RefreshCw,
  Loader2,
  Eye,
  CheckCircle,
  XCircle,
  Building,
  Calendar,
  ExternalLink,
  FileText,
  Trash2,
  AlertTriangle,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Ata {
  id: string
  slug: string
  numero_ata: string
  orgao_gerenciador: string
  orgao_gerenciador_sigla: string | null
  modalidade: string
  numero_planejamento: string | null
  vigencia_meses: number | null
  data_inicio: string | null
  data_fim: string | null
  status: string
  objeto: string | null
  fornecedor_nome: string
  fornecedor_cnpj: string
  ativo: boolean | null
  destaque_home: boolean | null
  created_at: string | null
  pdf_ata_url: string | null
  itens_count?: number
  lotes_count?: number
}

const statusConfig: Record<string, { label: string; color: string }> = {
  vigente: { label: "Vigente", color: "bg-green-100 text-green-700" },
  expirada: { label: "Expirada", color: "bg-red-100 text-red-700" },
  suspensa: { label: "Suspensa", color: "bg-yellow-100 text-yellow-700" },
}

export default function AtasPage() {
  const supabase = createClient()
  const [atas, setAtas] = useState<Ata[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [ataToDelete, setAtaToDelete] = useState<Ata | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchAtas = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from("atas_registro_preco")
        .select("*")
        .order("created_at", { ascending: false })

      if (statusFilter) {
        query = query.eq("status", statusFilter)
      }

      const { data: atasData, error } = await query

      if (error) throw error

      // Buscar contagem de itens e lotes para cada ATA
      const atasComContagem = await Promise.all(
        (atasData || []).map(async (ata) => {
          const [{ count: itensCount }, { count: lotesCount }] = await Promise.all([
            supabase
              .from("ata_itens")
              .select("*", { count: "exact", head: true })
              .eq("ata_id", ata.id),
            supabase
              .from("ata_lotes")
              .select("*", { count: "exact", head: true })
              .eq("ata_id", ata.id),
          ])

          return {
            ...ata,
            itens_count: itensCount || 0,
            lotes_count: lotesCount || 0,
          }
        })
      )

      setAtas(atasComContagem)
    } catch (error) {
      console.error("Erro ao buscar ATAs:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase, statusFilter])

  useEffect(() => {
    fetchAtas()
  }, [fetchAtas])

  // Função para excluir a ATA e todos os arquivos relacionados
  const handleDeleteAta = async () => {
    if (!ataToDelete) return
    
    setDeleting(true)
    try {
      // 1. Excluir todos os itens da ATA
      await supabase.from("ata_itens").delete().eq("ata_id", ataToDelete.id)

      // 2. Excluir todos os lotes da ATA
      await supabase.from("ata_lotes").delete().eq("ata_id", ataToDelete.id)

      // 3. Excluir o PDF da ATA do Storage (se existir)
      if (ataToDelete.pdf_ata_url) {
        const urlParts = ataToDelete.pdf_ata_url.split("/")
        const fileName = urlParts[urlParts.length - 1]
        if (fileName) {
          await supabase.storage.from("atas-documentos").remove([fileName])
        }
      }

      // 4. Excluir a ATA do banco de dados
      const { error } = await supabase
        .from("atas_registro_preco")
        .delete()
        .eq("id", ataToDelete.id)
      
      if (error) throw error

      // Atualizar lista
      fetchAtas()
    } catch (error) {
      console.error("Erro ao excluir ATA:", error)
      alert("Erro ao excluir a ATA. Tente novamente.")
    } finally {
      setDeleting(false)
      setDeleteModalOpen(false)
      setAtaToDelete(null)
    }
  }

  const filteredAtas = atas.filter(
    (ata) =>
      ata.numero_ata.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ata.orgao_gerenciador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ata.orgao_gerenciador_sigla?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ata.objeto?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Estatísticas
  const totalAtas = atas.length
  const atasVigentes = atas.filter((a) => a.status === "vigente").length
  const atasAtivas = atas.filter((a) => a.ativo).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-preto">
            Atas de Registro de Preço
          </h1>
          <p className="text-cinza-escuro mt-1">
            Visualize as ATAs de registro de preço cadastradas
          </p>
        </div>
        <Link href="/admin/atas/nova">
          <Button className="bg-verde hover:bg-verde/90 text-preto">
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar ATA
          </Button>
        </Link>
      </div>


      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <ScrollText className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-preto">{totalAtas}</p>
                <p className="text-sm text-cinza-escuro">Total de ATAs</p>
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
                <p className="text-2xl font-bold text-preto">{atasVigentes}</p>
                <p className="text-sm text-cinza-escuro">ATAs Vigentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Eye className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-preto">{atasAtivas}</p>
                <p className="text-sm text-cinza-escuro">Visíveis no Site</p>
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
                placeholder="Buscar por número, órgão ou objeto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Todos os status</option>
              <option value="vigente">Vigentes</option>
              <option value="expirada">Expiradas</option>
              <option value="suspensa">Suspensas</option>
            </select>
            <Button variant="outline" onClick={fetchAtas} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-heading">Lista de ATAs</CardTitle>
          <CardDescription>
            {filteredAtas.length} ATA(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-verde" />
            </div>
          ) : filteredAtas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ScrollText className="h-12 w-12 text-cinza-escuro mb-4" />
              <h3 className="text-lg font-medium text-preto">Nenhuma ATA encontrada</h3>
              <p className="text-cinza-escuro mt-1">
                {searchTerm || statusFilter
                  ? "Tente ajustar os filtros"
                  : "Clique em 'Cadastrar ATA' para começar"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ATA / Órgão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Lotes</TableHead>
                  <TableHead className="text-center">Itens</TableHead>
                  <TableHead>Vigência</TableHead>
                  <TableHead>Visível</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAtas.map((ata) => {
                  const config = statusConfig[ata.status] || {
                    label: ata.status,
                    color: "bg-gray-100 text-gray-700",
                  }

                  return (
                    <TableRow key={ata.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-lg bg-verde/20 flex items-center justify-center flex-shrink-0">
                            <ScrollText className="h-5 w-5 text-verde" />
                          </div>
                          <div>
                            <p className="font-semibold text-preto">{ata.numero_ata}</p>
                            <p className="text-xs text-cinza-escuro flex items-center gap-1">
                              <Building className="h-3 w-3" />
                              {ata.orgao_gerenciador_sigla || ata.orgao_gerenciador}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={config.color}>{config.label}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{ata.lotes_count || 0}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{ata.itens_count || 0}</Badge>
                      </TableCell>
                      <TableCell className="text-cinza-escuro text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {ata.vigencia_meses ? `${ata.vigencia_meses} meses` : "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={ata.ativo ? "success" : "secondary"}
                        >
                          {ata.ativo ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Sim
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Não
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Ver PDF Original */}
                          {ata.pdf_ata_url && (
                            <a
                              href={ata.pdf_ata_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                title="Ver PDF Original"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                            </a>
                          )}
                          {/* Ver Detalhes */}
                          <Link href={`/admin/atas/${ata.id}`}>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              title="Ver Detalhes"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          {/* Ver no Site */}
                          <Link
                            href={`/ata-registro-preco/${ata.slug}`}
                            target="_blank"
                          >
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              title="Ver no site"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                          {/* Excluir */}
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Excluir ATA"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              setAtaToDelete(ata)
                              setDeleteModalOpen(true)
                            }}
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

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent onClose={() => setDeleteModalOpen(false)} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Excluir ATA Permanentemente
            </DialogTitle>
          </DialogHeader>
          {ataToDelete && (
            <div className="text-left text-sm text-muted-foreground">
              <p>
                Tem certeza que deseja excluir a ATA <strong>{ataToDelete.numero_ata}</strong>?
              </p>
              <p className="mt-3 text-red-600 font-medium">
                Esta ação irá excluir permanentemente:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Todos os <strong>{ataToDelete.itens_count || 0} itens</strong> cadastrados</li>
                <li>Todos os <strong>{ataToDelete.lotes_count || 0} lotes</strong> cadastrados</li>
                <li>Os arquivos PDF da ATA</li>
              </ul>
              <p className="mt-3 text-red-600 font-semibold">
                Esta ação não pode ser desfeita!
              </p>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false)
                setAtaToDelete(null)
              }}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAta}
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
                  Excluir Permanentemente
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
