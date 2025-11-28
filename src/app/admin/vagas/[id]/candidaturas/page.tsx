"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Search,
  RefreshCw,
  Loader2,
  Users,
  FileText,
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Car,
  Briefcase,
  DollarSign,
  UserPlus,
  Calendar,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Candidatura {
  id: string
  vaga_id: string
  nome_completo: string
  data_nascimento: string
  cpf: string
  telefone: string
  endereco_completo: string
  escolaridade: string
  possui_experiencia: boolean | null
  possui_cnh: boolean | null
  tipo_cnh: string | null
  cenario_atual: string
  pretensao_salarial: number | null
  indicacao: string | null
  curriculo_url: string
  curriculo_nome_original: string | null
  status: string | null
  created_at: string | null
}

interface Vaga {
  id: string
  titulo: string
  tipo_contrato: string
  local: string | null
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  nova: { label: "Nova", color: "bg-blue-100 text-blue-700", icon: Clock },
  em_analise: { label: "Em Análise", color: "bg-yellow-100 text-yellow-700", icon: Eye },
  aprovada: { label: "Aprovada", color: "bg-green-100 text-green-700", icon: CheckCircle },
  reprovada: { label: "Reprovada", color: "bg-red-100 text-red-700", icon: XCircle },
}

const escolaridadeLabels: Record<string, string> = {
  fundamental: "Ensino Fundamental",
  medio: "Ensino Médio",
  superior: "Ensino Superior",
  pos_graduacao: "Pós-Graduação",
}

const cenarioLabels: Record<string, string> = {
  desempregado: "Desempregado",
  empregado: "Empregado, buscando novas oportunidades",
  freelancer: "Freelancer",
}

const tipoContratoLabels: Record<string, string> = {
  clt: "CLT",
  pj: "PJ",
  estagio: "Estágio",
}

export default function CandidaturasPage() {
  const params = useParams()
  const vagaId = params.id as string
  const supabase = createClient()
  
  const [vaga, setVaga] = useState<Vaga | null>(null)
  const [candidaturas, setCandidaturas] = useState<Candidatura[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedCandidatura, setSelectedCandidatura] = useState<Candidatura | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      // Buscar vaga
      const { data: vagaData, error: vagaError } = await supabase
        .from("vagas")
        .select("id, titulo, tipo_contrato, local")
        .eq("id", vagaId)
        .single()

      if (vagaError) throw vagaError
      setVaga(vagaData)

      // Buscar candidaturas
      let query = supabase
        .from("candidaturas")
        .select("*")
        .eq("vaga_id", vagaId)
        .order("created_at", { ascending: false })

      if (statusFilter) {
        query = query.eq("status", statusFilter)
      }

      const { data: candidaturasData, error: candidaturasError } = await query

      if (candidaturasError) throw candidaturasError
      setCandidaturas(candidaturasData || [])
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
    } finally {
      setLoading(false)
    }
  }, [supabase, vagaId, statusFilter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const updateStatus = async (candidaturaId: string, newStatus: string) => {
    setUpdatingStatus(true)
    try {
      const { error } = await supabase
        .from("candidaturas")
        .update({ status: newStatus })
        .eq("id", candidaturaId)

      if (error) throw error

      // Atualizar localmente
      setCandidaturas((prev) =>
        prev.map((c) => (c.id === candidaturaId ? { ...c, status: newStatus } : c))
      )

      if (selectedCandidatura?.id === candidaturaId) {
        setSelectedCandidatura({ ...selectedCandidatura, status: newStatus })
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      alert("Erro ao atualizar status")
    } finally {
      setUpdatingStatus(false)
    }
  }

  const downloadCurriculo = async (candidatura: Candidatura) => {
    try {
      const { data, error } = await supabase.storage
        .from("curriculos")
        .download(candidatura.curriculo_url)

      if (error) throw error

      // Criar link para download
      const url = URL.createObjectURL(data)
      const a = document.createElement("a")
      a.href = url
      a.download = candidatura.curriculo_nome_original || "curriculo.pdf"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Erro ao baixar currículo:", error)
      alert("Erro ao baixar currículo")
    }
  }

  const openDetails = (candidatura: Candidatura) => {
    setSelectedCandidatura(candidatura)
    setDetailsOpen(true)
  }

  const filteredCandidaturas = candidaturas.filter(
    (c) =>
      c.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cpf.includes(searchTerm) ||
      c.telefone.includes(searchTerm)
  )

  // Estatísticas
  const estatisticas = {
    total: candidaturas.length,
    nova: candidaturas.filter((c) => c.status === "nova").length,
    em_analise: candidaturas.filter((c) => c.status === "em_analise").length,
    aprovada: candidaturas.filter((c) => c.status === "aprovada").length,
    reprovada: candidaturas.filter((c) => c.status === "reprovada").length,
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleDateString("pt-BR")
  }

  const formatCurrency = (value: number | null) => {
    if (value === null) return "Não informado"
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "")
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    }
    return phone
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link
            href="/admin/vagas"
            className="inline-flex items-center text-sm text-cinza-escuro hover:text-preto mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para Vagas
          </Link>
          <h1 className="text-3xl font-bold font-heading text-preto">
            Candidaturas
          </h1>
          {vaga && (
            <p className="text-cinza-escuro mt-1">
              {vaga.titulo} • {tipoContratoLabels[vaga.tipo_contrato] || vaga.tipo_contrato}
              {vaga.local && ` • ${vaga.local}`}
            </p>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card
          className={`border-0 shadow-md cursor-pointer transition-all ${
            statusFilter === "" ? "ring-2 ring-verde" : ""
          }`}
          onClick={() => setStatusFilter("")}
        >
          <CardContent className="pt-4 pb-4">
            <div className="flex flex-col items-center text-center">
              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-gray-700" />
              </div>
              <p className="text-2xl font-bold text-preto">{estatisticas.total}</p>
              <p className="text-xs text-cinza-escuro">Total</p>
            </div>
          </CardContent>
        </Card>
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon
          return (
            <Card
              key={status}
              className={`border-0 shadow-md cursor-pointer transition-all ${
                statusFilter === status ? "ring-2 ring-verde" : ""
              }`}
              onClick={() => setStatusFilter(statusFilter === status ? "" : status)}
            >
              <CardContent className="pt-4 pb-4">
                <div className="flex flex-col items-center text-center">
                  <div className={`h-10 w-10 rounded-lg ${config.color} flex items-center justify-center mb-2`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-bold text-preto">
                    {estatisticas[status as keyof typeof estatisticas]}
                  </p>
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
                placeholder="Buscar por nome, CPF ou telefone..."
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
              {Object.entries(statusConfig).map(([value, { label }]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <Button variant="outline" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-heading">Lista de Candidatos</CardTitle>
          <CardDescription>
            {filteredCandidaturas.length} candidatura(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-verde" />
            </div>
          ) : filteredCandidaturas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-cinza-escuro mb-4" />
              <h3 className="text-lg font-medium text-preto">Nenhuma candidatura encontrada</h3>
              <p className="text-cinza-escuro mt-1">
                {searchTerm || statusFilter
                  ? "Tente ajustar os filtros"
                  : "Ainda não há candidatos para esta vaga"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidato</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Escolaridade</TableHead>
                  <TableHead>Cenário</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidaturas.map((candidatura) => {
                  const status = statusConfig[candidatura.status || "nova"] || statusConfig.nova
                  const StatusIcon = status.icon

                  return (
                    <TableRow key={candidatura.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-semibold">{candidatura.nome_completo}</p>
                          <p className="text-xs text-cinza-escuro">
                            CPF: {formatCPF(candidatura.cpf)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{formatPhone(candidatura.telefone)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {escolaridadeLabels[candidatura.escolaridade] || candidatura.escolaridade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-cinza-escuro">
                          {cenarioLabels[candidatura.cenario_atual] || candidatura.cenario_atual}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-cinza-escuro">
                          {formatDate(candidatura.created_at)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={status.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => openDetails(candidatura)}
                            title="Ver Detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => downloadCurriculo(candidatura)}
                            title="Baixar Currículo"
                          >
                            <Download className="h-4 w-4" />
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

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent onClose={() => setDetailsOpen(false)} className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Candidatura</DialogTitle>
            <DialogDescription>
              Informações completas do candidato
            </DialogDescription>
          </DialogHeader>

          {selectedCandidatura && (
            <div className="space-y-6">
              {/* Status Actions */}
              <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium mr-2">Alterar Status:</span>
                {Object.entries(statusConfig).map(([status, config]) => {
                  const Icon = config.icon
                  const isActive = selectedCandidatura.status === status
                  return (
                    <Button
                      key={status}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateStatus(selectedCandidatura.id, status)}
                      disabled={updatingStatus}
                      className={isActive ? "bg-verde text-preto" : ""}
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {config.label}
                    </Button>
                  )
                })}
              </div>

              {/* Dados Pessoais */}
              <div className="space-y-3">
                <h4 className="font-semibold text-preto border-b pb-2">Dados Pessoais</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 mt-0.5 text-cinza-escuro" />
                    <div>
                      <p className="text-xs text-cinza-escuro">Nome Completo</p>
                      <p className="font-medium">{selectedCandidatura.nome_completo}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 mt-0.5 text-cinza-escuro" />
                    <div>
                      <p className="text-xs text-cinza-escuro">Data de Nascimento</p>
                      <p className="font-medium">{formatDate(selectedCandidatura.data_nascimento)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 mt-0.5 text-cinza-escuro" />
                    <div>
                      <p className="text-xs text-cinza-escuro">CPF</p>
                      <p className="font-medium">{formatCPF(selectedCandidatura.cpf)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 mt-0.5 text-cinza-escuro" />
                    <div>
                      <p className="text-xs text-cinza-escuro">Telefone</p>
                      <p className="font-medium">{formatPhone(selectedCandidatura.telefone)}</p>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-cinza-escuro" />
                    <div>
                      <p className="text-xs text-cinza-escuro">Endereço</p>
                      <p className="font-medium">{selectedCandidatura.endereco_completo}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações Profissionais */}
              <div className="space-y-3">
                <h4 className="font-semibold text-preto border-b pb-2">Informações Profissionais</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <GraduationCap className="h-4 w-4 mt-0.5 text-cinza-escuro" />
                    <div>
                      <p className="text-xs text-cinza-escuro">Escolaridade</p>
                      <p className="font-medium">
                        {escolaridadeLabels[selectedCandidatura.escolaridade] || selectedCandidatura.escolaridade}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Briefcase className="h-4 w-4 mt-0.5 text-cinza-escuro" />
                    <div>
                      <p className="text-xs text-cinza-escuro">Experiência na Área</p>
                      <p className="font-medium">{selectedCandidatura.possui_experiencia ? "Sim" : "Não"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Car className="h-4 w-4 mt-0.5 text-cinza-escuro" />
                    <div>
                      <p className="text-xs text-cinza-escuro">CNH</p>
                      <p className="font-medium">
                        {selectedCandidatura.possui_cnh
                          ? `Sim - Categoria ${selectedCandidatura.tipo_cnh?.toUpperCase() || "N/I"}`
                          : "Não possui"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 text-cinza-escuro" />
                    <div>
                      <p className="text-xs text-cinza-escuro">Cenário Atual</p>
                      <p className="font-medium">
                        {cenarioLabels[selectedCandidatura.cenario_atual] || selectedCandidatura.cenario_atual}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 mt-0.5 text-cinza-escuro" />
                    <div>
                      <p className="text-xs text-cinza-escuro">Pretensão Salarial</p>
                      <p className="font-medium">{formatCurrency(selectedCandidatura.pretensao_salarial)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <UserPlus className="h-4 w-4 mt-0.5 text-cinza-escuro" />
                    <div>
                      <p className="text-xs text-cinza-escuro">Indicação</p>
                      <p className="font-medium">{selectedCandidatura.indicacao || "Não informado"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data de Candidatura */}
              <div className="flex items-center gap-2 text-sm text-cinza-escuro">
                <Clock className="h-4 w-4" />
                Candidatura recebida em {formatDate(selectedCandidatura.created_at)}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsOpen(false)}>
              Fechar
            </Button>
            {selectedCandidatura && (
              <Button
                onClick={() => downloadCurriculo(selectedCandidatura)}
                className="bg-verde hover:bg-verde/90 text-preto"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar Currículo
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

