"use client"

import { useState, useEffect, useCallback, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  ArrowLeft,
  FileText,
  Download,
  RefreshCw,
  Play,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Cpu,
  Package,
  Building2,
  Hash,
  Calendar,
} from "lucide-react"

interface Equipamento {
  id: string
  nome_comercial: string
  fabricante: string | null
  categoria: string
  preco_venda: number | null
}

interface Sugestao {
  id: string
  is_principal: boolean
  aderencia_percentual: number | null
  comentario: string | null
  confirmado_por_usuario: boolean | null
  equipamentos: Equipamento
}

interface ItemNormalizado {
  id: string
  categoria: string | null
  formato: string | null
  tecnologia: string | null
  observacoes: string | null
  confidence: number | null
}

interface Item {
  id: string
  numero_item: number
  descricao_bruta: string
  unidade: string | null
  quantidade: number | null
  status: string | null
  termo_itens_normalizados: ItemNormalizado | null
  termo_sugestoes: Sugestao[]
}

interface Grupo {
  id: string
  numero: number
  nome: string
  local: string | null
  termo_itens: Item[]
}

interface Termo {
  id: string
  nome: string
  numero_edital: string | null
  orgao: string | null
  status: string
  total_grupos: number | null
  total_itens: number | null
  created_at: string
  pdf_url: string | null
}

interface Log {
  id: string
  etapa: string
  status: string
  mensagem: string | null
  duracao_ms: number | null
  created_at: string
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"; icon: React.ElementType }> = {
  pendente: { label: "Pendente", variant: "secondary", icon: Clock },
  normalizado: { label: "Normalizado", variant: "info", icon: Cpu },
  sugerido: { label: "Sugerido", variant: "warning", icon: Package },
  confirmado: { label: "Confirmado", variant: "success", icon: CheckCircle2 },
  erro: { label: "Erro", variant: "destructive", icon: XCircle },
}

const termoStatusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info"; icon: React.ElementType }> = {
  pendente: { label: "Pendente", variant: "secondary", icon: Clock },
  processando: { label: "Processando", variant: "info", icon: Loader2 },
  processado: { label: "Processado", variant: "success", icon: CheckCircle2 },
  erro: { label: "Erro", variant: "destructive", icon: XCircle },
  revisado: { label: "Revisado", variant: "default", icon: CheckCircle2 },
}

export default function TermoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [termo, setTermo] = useState<Termo | null>(null)
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [confirmingItem, setConfirmingItem] = useState<string | null>(null)

  const fetchTermo = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/termos/${id}`)
      const data = await response.json()
      
      if (data.termo) {
        setTermo(data.termo)
        setGrupos(data.grupos || [])
        setLogs(data.logs || [])
        
        // Expandir primeiro grupo por padrão
        if (data.grupos?.length > 0) {
          setExpandedGroups(new Set([data.grupos[0].id]))
        }
      }
    } catch (error) {
      console.error("Erro ao buscar termo:", error)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchTermo()
  }, [fetchTermo])

  const handleProcessar = async () => {
    setProcessing(true)
    try {
      const response = await fetch(`/api/termos/${id}/processar`, {
        method: "POST",
      })
      const data = await response.json()
      
      if (data.success) {
        alert(`Processamento concluído: ${data.processados} itens processados, ${data.erros} erros`)
        fetchTermo()
      } else {
        alert(data.error || "Erro ao processar itens")
      }
    } catch (error) {
      console.error("Erro ao processar:", error)
      alert("Erro ao processar itens")
    } finally {
      setProcessing(false)
    }
  }

  const handleConfirmarSugestao = async (itemId: string, equipamentoId: string) => {
    setConfirmingItem(itemId)
    try {
      const response = await fetch(`/api/termos/${id}/itens/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipamento_id: equipamentoId }),
      })
      
      if (response.ok) {
        fetchTermo()
        setSelectedItem(null)
      } else {
        alert("Erro ao confirmar sugestão")
      }
    } catch (error) {
      console.error("Erro ao confirmar:", error)
      alert("Erro ao confirmar sugestão")
    } finally {
      setConfirmingItem(null)
    }
  }

  const handleExport = async (format: "csv" | "json") => {
    try {
      const response = await fetch(`/api/termos/${id}/export?format=${format}`)
      
      if (format === "csv") {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `termo-${termo?.nome || id}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        const data = await response.json()
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `termo-${termo?.nome || id}.json`
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Erro ao exportar:", error)
      alert("Erro ao exportar termo")
    }
  }

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId)
    } else {
      newExpanded.add(groupId)
    }
    setExpandedGroups(newExpanded)
  }

  // Calcular estatísticas
  const totalItens = grupos.reduce((acc, g) => acc + g.termo_itens.length, 0)
  const itensProcessados = grupos.reduce(
    (acc, g) => acc + g.termo_itens.filter((i) => i.status !== "pendente").length,
    0
  )
  const itensConfirmados = grupos.reduce(
    (acc, g) => acc + g.termo_itens.filter((i) => i.status === "confirmado").length,
    0
  )
  const progressoProcessamento = totalItens > 0 ? (itensProcessados / totalItens) * 100 : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-verde" />
      </div>
    )
  }

  if (!termo) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold">Termo não encontrado</h2>
        <Button variant="outline" onClick={() => router.push("/admin/termos")} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>
    )
  }

  const termoStatus = termoStatusConfig[termo.status] || termoStatusConfig.pendente
  const TermoStatusIcon = termoStatus.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex items-start gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/termos")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-heading text-preto">{termo.nome}</h1>
              <Badge variant={termoStatus.variant} className="gap-1">
                <TermoStatusIcon className={`h-3 w-3 ${termo.status === "processando" ? "animate-spin" : ""}`} />
                {termoStatus.label}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-cinza-escuro">
              {termo.numero_edital && (
                <span className="flex items-center gap-1">
                  <Hash className="h-4 w-4" />
                  {termo.numero_edital}
                </span>
              )}
              {termo.orgao && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {termo.orgao}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(termo.created_at).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("csv")}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button
            onClick={handleProcessar}
            disabled={processing || termo.status === "processando"}
            className="bg-verde hover:bg-verde/90 text-preto"
          >
            {processing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Processar Itens
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cinza-escuro">Total de Grupos</p>
                <p className="text-2xl font-bold text-preto">{grupos.length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cinza-escuro">Total de Itens</p>
                <p className="text-2xl font-bold text-preto">{totalItens}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cinza-escuro">Itens Processados</p>
                <p className="text-2xl font-bold text-preto">{itensProcessados}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <Cpu className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cinza-escuro">Itens Confirmados</p>
                <p className="text-2xl font-bold text-preto">{itensConfirmados}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      {totalItens > 0 && (
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-preto">Progresso do Processamento</span>
              <span className="text-sm text-cinza-escuro">{progressoProcessamento.toFixed(0)}%</span>
            </div>
            <Progress value={progressoProcessamento} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Groups and Items */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-heading">Grupos e Itens</CardTitle>
          <CardDescription>
            Visualize e confirme as sugestões de equipamentos para cada item
          </CardDescription>
        </CardHeader>
        <CardContent>
          {grupos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-cinza-escuro mb-4" />
              <h3 className="text-lg font-medium text-preto">Nenhum grupo encontrado</h3>
              <p className="text-cinza-escuro mt-1">
                O PDF pode não ter sido processado corretamente
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {grupos.map((grupo) => (
                <div key={grupo.id} className="border rounded-lg overflow-hidden">
                  {/* Group Header */}
                  <button
                    onClick={() => toggleGroup(grupo.id)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {expandedGroups.has(grupo.id) ? (
                        <ChevronDown className="h-5 w-5 text-cinza-escuro" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-cinza-escuro" />
                      )}
                      <div className="text-left">
                        <h3 className="font-semibold text-preto">{grupo.nome}</h3>
                        {grupo.local && (
                          <p className="text-sm text-cinza-escuro">{grupo.local}</p>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline">{grupo.termo_itens.length} itens</Badge>
                  </button>

                  {/* Group Items */}
                  {expandedGroups.has(grupo.id) && (
                    <div className="p-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">#</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead className="w-24">Qtd</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Sugestão</TableHead>
                            <TableHead className="w-24">Status</TableHead>
                            <TableHead className="w-24 text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {grupo.termo_itens.map((item) => {
                            const itemStatus = statusConfig[item.status || "pendente"]
                            const ItemStatusIcon = itemStatus.icon
                            const sugestaoPrincipal = item.termo_sugestoes?.find((s) => s.is_principal)

                            return (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.numero_item}</TableCell>
                                <TableCell>
                                  <p className="text-sm line-clamp-2">{item.descricao_bruta}</p>
                                </TableCell>
                                <TableCell>{item.quantidade || 1}</TableCell>
                                <TableCell>
                                  {item.termo_itens_normalizados?.categoria ? (
                                    <Badge variant="outline" className="capitalize">
                                      {item.termo_itens_normalizados.categoria}
                                    </Badge>
                                  ) : (
                                    <span className="text-cinza-escuro">-</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {sugestaoPrincipal ? (
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm truncate max-w-[200px]">
                                        {sugestaoPrincipal.equipamentos.nome_comercial}
                                      </span>
                                      {sugestaoPrincipal.aderencia_percentual && (
                                        <Badge
                                          variant={
                                            sugestaoPrincipal.aderencia_percentual >= 0.8
                                              ? "success"
                                              : sugestaoPrincipal.aderencia_percentual >= 0.5
                                              ? "warning"
                                              : "secondary"
                                          }
                                        >
                                          {(sugestaoPrincipal.aderencia_percentual * 100).toFixed(0)}%
                                        </Badge>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-cinza-escuro">-</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={itemStatus.variant} className="gap-1">
                                    <ItemStatusIcon className="h-3 w-3" />
                                    {itemStatus.label}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedItem(item)}
                                  >
                                    Ver detalhes
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Logs */}
      {logs.length > 0 && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Logs de Processamento</CardTitle>
            <CardDescription>Últimas atividades de processamento do termo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {logs.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {log.status === "sucesso" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : log.status === "erro" ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-blue-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-preto capitalize">{log.etapa}</p>
                      {log.mensagem && (
                        <p className="text-xs text-cinza-escuro">{log.mensagem}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-cinza-escuro">
                      {new Date(log.created_at).toLocaleString("pt-BR")}
                    </p>
                    {log.duracao_ms && (
                      <p className="text-xs text-cinza-escuro">{log.duracao_ms}ms</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Item Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent onClose={() => setSelectedItem(null)} className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Item #{selectedItem?.numero_item}</DialogTitle>
            <DialogDescription>
              Visualize as informações do item e confirme a sugestão de equipamento
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6">
              {/* Item Info */}
              <div className="space-y-2">
                <h4 className="font-semibold text-preto">Descrição Original</h4>
                <p className="text-sm text-cinza-escuro bg-gray-50 p-3 rounded-lg">
                  {selectedItem.descricao_bruta}
                </p>
              </div>

              {/* Normalized Data */}
              {selectedItem.termo_itens_normalizados && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-preto">Dados Interpretados pela IA</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-cinza-escuro">Categoria:</span>
                      <span className="ml-2 font-medium capitalize">
                        {selectedItem.termo_itens_normalizados.categoria || "-"}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-cinza-escuro">Formato:</span>
                      <span className="ml-2 font-medium capitalize">
                        {selectedItem.termo_itens_normalizados.formato || "-"}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-cinza-escuro">Tecnologia:</span>
                      <span className="ml-2 font-medium">
                        {selectedItem.termo_itens_normalizados.tecnologia || "-"}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-cinza-escuro">Confiança:</span>
                      <span className="ml-2 font-medium">
                        {selectedItem.termo_itens_normalizados.confidence
                          ? `${(selectedItem.termo_itens_normalizados.confidence * 100).toFixed(0)}%`
                          : "-"}
                      </span>
                    </div>
                  </div>
                  {selectedItem.termo_itens_normalizados.observacoes && (
                    <p className="text-sm text-cinza-escuro bg-gray-50 p-3 rounded-lg">
                      <span className="font-medium">Observações:</span>{" "}
                      {selectedItem.termo_itens_normalizados.observacoes}
                    </p>
                  )}
                </div>
              )}

              {/* Suggestions */}
              {selectedItem.termo_sugestoes && selectedItem.termo_sugestoes.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-preto">Sugestões de Equipamentos</h4>
                  <div className="space-y-2">
                    {selectedItem.termo_sugestoes
                      .sort((a, b) => (b.is_principal ? 1 : 0) - (a.is_principal ? 1 : 0))
                      .map((sugestao) => (
                        <div
                          key={sugestao.id}
                          className={`p-4 rounded-lg border ${
                            sugestao.is_principal
                              ? "border-verde bg-verde/5"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h5 className="font-medium text-preto">
                                  {sugestao.equipamentos.nome_comercial}
                                </h5>
                                {sugestao.is_principal && (
                                  <Badge variant="success" className="text-xs">
                                    Principal
                                  </Badge>
                                )}
                                {sugestao.confirmado_por_usuario && (
                                  <Badge variant="info" className="text-xs">
                                    Confirmado
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-cinza-escuro mt-1">
                                {sugestao.equipamentos.fabricante || "Fabricante não informado"}
                              </p>
                              {sugestao.comentario && (
                                <p className="text-sm text-cinza-escuro mt-2">
                                  {sugestao.comentario}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              {sugestao.aderencia_percentual && (
                                <Badge
                                  variant={
                                    sugestao.aderencia_percentual >= 0.8
                                      ? "success"
                                      : sugestao.aderencia_percentual >= 0.5
                                      ? "warning"
                                      : "secondary"
                                  }
                                >
                                  {(sugestao.aderencia_percentual * 100).toFixed(0)}%
                                </Badge>
                              )}
                              {sugestao.equipamentos.preco_venda && (
                                <span className="text-sm font-medium text-preto">
                                  R$ {sugestao.equipamentos.preco_venda.toFixed(2)}
                                </span>
                              )}
                              {!sugestao.confirmado_por_usuario && (
                                <Button
                                  size="sm"
                                  variant={sugestao.is_principal ? "default" : "outline"}
                                  onClick={() =>
                                    handleConfirmarSugestao(
                                      selectedItem.id,
                                      sugestao.equipamentos.id
                                    )
                                  }
                                  disabled={confirmingItem === selectedItem.id}
                                  className={
                                    sugestao.is_principal
                                      ? "bg-verde hover:bg-verde/90 text-preto"
                                      : ""
                                  }
                                >
                                  {confirmingItem === selectedItem.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Check className="h-4 w-4" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {(!selectedItem.termo_sugestoes ||
                selectedItem.termo_sugestoes.length === 0) && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Package className="h-12 w-12 text-cinza-escuro mb-4" />
                  <h3 className="text-lg font-medium text-preto">Nenhuma sugestão ainda</h3>
                  <p className="text-cinza-escuro mt-1">
                    Clique em "Processar Itens" para gerar sugestões
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedItem(null)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

