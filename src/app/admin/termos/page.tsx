"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Upload,
  FileText,
  Trash2,
  Eye,
  RefreshCw,
  Download,
  Search,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react"

interface Termo {
  id: string
  nome: string
  numero_edital: string | null
  orgao: string | null
  status: string
  total_grupos: number | null
  total_itens: number | null
  created_at: string
  pdf_nome_original: string | null
  pdf_url: string | null
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"; icon: React.ElementType }> = {
  pendente: { label: "Pendente", variant: "secondary", icon: Clock },
  processando: { label: "Processando", variant: "info", icon: Loader2 },
  processado: { label: "Processado", variant: "success", icon: CheckCircle2 },
  erro: { label: "Erro", variant: "destructive", icon: XCircle },
  revisado: { label: "Revisado", variant: "default", icon: CheckCircle2 },
}

export default function TermosPage() {
  const router = useRouter()
  const [termos, setTermos] = useState<Termo[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchTermos = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/termos?page=${pagination.page}&limit=${pagination.limit}`)
      const data = await response.json()
      setTermos(data.termos || [])
      setPagination(data.pagination || pagination)
    } catch (error) {
      console.error("Erro ao buscar termos:", error)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    fetchTermos()
  }, [fetchTermos])

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("nome", selectedFile.name.replace(/\.pdf$/i, ""))

      const response = await fetch("/api/termos/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setUploadOpen(false)
        setSelectedFile(null)
        fetchTermos()
        // Redirecionar para a página do termo
        router.push(`/admin/termos/${data.termo_id}`)
      } else {
        alert(data.error || "Erro ao fazer upload")
      }
    } catch (error) {
      console.error("Erro no upload:", error)
      alert("Erro ao fazer upload do arquivo")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/termos/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setDeleteConfirm(null)
        fetchTermos()
      } else {
        alert("Erro ao excluir termo")
      }
    } catch (error) {
      console.error("Erro ao excluir:", error)
      alert("Erro ao excluir termo")
    } finally {
      setDeleting(false)
    }
  }

  const handleExport = async (id: string, format: "csv" | "json") => {
    try {
      const response = await fetch(`/api/termos/${id}/export?format=${format}`)
      
      if (format === "csv") {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `termo-${id}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        const data = await response.json()
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `termo-${id}.json`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Erro ao exportar:", error)
      alert("Erro ao exportar termo")
    }
  }

  const filteredTermos = termos.filter(
    (termo) =>
      termo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      termo.numero_edital?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      termo.orgao?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-preto">
            Termos de Referência
          </h1>
          <p className="text-cinza-escuro mt-1">
            Gerencie seus editais e termos de referência de licitação
          </p>
        </div>
        <Button onClick={() => setUploadOpen(true)} className="bg-verde hover:bg-verde/90 text-preto">
          <Plus className="h-4 w-4 mr-2" />
          Novo Termo
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cinza-escuro" />
              <Input
                placeholder="Buscar por nome, número do edital ou órgão..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={fetchTermos} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-heading">Lista de Termos</CardTitle>
          <CardDescription>
            {pagination.total} termo(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-verde" />
            </div>
          ) : filteredTermos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-cinza-escuro mb-4" />
              <h3 className="text-lg font-medium text-preto">Nenhum termo encontrado</h3>
              <p className="text-cinza-escuro mt-1">
                {searchTerm
                  ? "Tente ajustar sua busca"
                  : "Clique em 'Novo Termo' para começar"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Edital</TableHead>
                  <TableHead>Órgão</TableHead>
                  <TableHead className="text-center">Itens</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTermos.map((termo) => {
                  const status = statusConfig[termo.status] || statusConfig.pendente
                  const StatusIcon = status.icon

                  return (
                    <TableRow key={termo.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-cinza-escuro" />
                          <span className="truncate max-w-[200px]">{termo.nome}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-cinza-escuro">
                        {termo.numero_edital || "-"}
                      </TableCell>
                      <TableCell className="text-cinza-escuro truncate max-w-[150px]">
                        {termo.orgao || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">{termo.total_itens || 0}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant} className="gap-1">
                          <StatusIcon className={`h-3 w-3 ${termo.status === "processando" ? "animate-spin" : ""}`} />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-cinza-escuro">
                        {new Date(termo.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/termos/${termo.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizar Detalhes
                            </DropdownMenuItem>
                            {termo.pdf_url && (
                              <DropdownMenuItem
                                onClick={() => window.open(termo.pdf_url!, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Visualizar PDF
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleExport(termo.id, "csv")}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Exportar CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleExport(termo.id, "json")}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Exportar JSON
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteConfirm(termo.id)}
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-cinza-escuro">
                Página {pagination.page} de {pagination.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                  disabled={pagination.page <= 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent onClose={() => setUploadOpen(false)} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload de Termo de Referência</DialogTitle>
            <DialogDescription>
              Selecione um arquivo PDF contendo o termo de referência ou edital de licitação.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                selectedFile
                  ? "border-verde bg-verde/5"
                  : "border-cinza-medio hover:border-verde/50"
              }`}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="hidden"
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload" className="cursor-pointer">
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-12 w-12 text-verde" />
                    <p className="font-medium text-preto">{selectedFile.name}</p>
                    <p className="text-sm text-cinza-escuro">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-12 w-12 text-cinza-escuro" />
                    <p className="font-medium text-preto">
                      Clique para selecionar um arquivo
                    </p>
                    <p className="text-sm text-cinza-escuro">
                      Apenas arquivos PDF (máx. 50MB)
                    </p>
                  </div>
                )}
              </label>
            </div>

            {selectedFile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedFile(null)}
                className="w-full"
              >
                Remover arquivo
              </Button>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="bg-verde hover:bg-verde/90 text-preto"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Enviar e Processar
                </>
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
              Tem certeza que deseja excluir este termo? Esta ação não pode ser desfeita.
              Todos os grupos, itens e sugestões serão removidos permanentemente.
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

