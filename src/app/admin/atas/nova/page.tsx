"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ScrollText,
  ArrowLeft,
  Loader2,
  Save,
  Upload,
  FileText,
  X,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Wand2,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

interface UploadResult {
  success: boolean
  ata_id?: string
  slug?: string
  dados?: {
    numero_ata: string
    orgao: string
    fornecedor: string
    lotes: number
    itens: number
  }
  message?: string
  error?: string
}

interface ProgressEvent {
  etapa: string
  mensagem: string
  progresso: number
  status: 'processando' | 'sucesso' | 'erro'
  dados?: Record<string, unknown>
}

// Mapeamento de etapas para ícones e labels
const etapasInfo: Record<string, { label: string; icon: string }> = {
  autenticacao: { label: 'Autenticação', icon: '🔐' },
  upload: { label: 'Upload do Arquivo', icon: '📤' },
  extracao: { label: 'Extração de Texto', icon: '📄' },
  ia: { label: 'Análise com IA', icon: '🤖' },
  validacao: { label: 'Validação', icon: '✅' },
  storage: { label: 'Armazenamento', icon: '💾' },
  banco: { label: 'Banco de Dados', icon: '🗄️' },
  lotes: { label: 'Criação de Lotes', icon: '📦' },
  itens: { label: 'Criação de Itens', icon: '📝' },
  finalizado: { label: 'Finalizado', icon: '🎉' },
  erro: { label: 'Erro', icon: '❌' },
}

export default function NovaAtaPage() {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [uploadingPdfAta, setUploadingPdfAta] = useState(false)
  const [uploadingPdfTermo, setUploadingPdfTermo] = useState(false)
  
  // Estado para upload inteligente
  const [smartUploadFile, setSmartUploadFile] = useState<File | null>(null)
  const [smartUploadProgress, setSmartUploadProgress] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle")
  const [smartUploadResult, setSmartUploadResult] = useState<UploadResult | null>(null)
  const [progressEvents, setProgressEvents] = useState<ProgressEvent[]>([])
  const [currentProgress, setCurrentProgress] = useState(0)
  
  const [formData, setFormData] = useState({
    numero_ata: "",
    slug: "",
    orgao_gerenciador: "",
    orgao_gerenciador_sigla: "",
    modalidade: "Pregão Eletrônico",
    numero_planejamento: "",
    vigencia_meses: 12,
    data_inicio: "",
    data_fim: "",
    status: "vigente",
    objeto: "",
    fornecedor_nome: "Alfa Tecnologia em Engenharia e Infraestrutura de Redes Ltda.",
    fornecedor_cnpj: "31.837.899/0001-25",
    base_legal: "Lei nº 14.133/2021 e Decreto nº 48.779/2024",
    pdf_ata_url: "",
    pdf_ata_nome: "",
    pdf_termo_url: "",
    pdf_termo_nome: "",
    ativo: true,
    destaque_home: false,
  })

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }
      
      // Auto-gerar slug baseado no número da ATA e órgão
      if (field === "numero_ata" || field === "orgao_gerenciador_sigla") {
        const ataNum = field === "numero_ata" ? value : prev.numero_ata
        const sigla = field === "orgao_gerenciador_sigla" ? value : prev.orgao_gerenciador_sigla
        if (ataNum && sigla) {
          newData.slug = generateSlug(`${ataNum}-${sigla}`)
        }
      }
      
      return newData
    })
  }

  // Upload inteligente com IA usando Server-Sent Events
  const handleSmartUpload = async () => {
    if (!smartUploadFile) return

    setSmartUploadProgress("processing")
    setSmartUploadResult(null)
    setProgressEvents([])
    setCurrentProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", smartUploadFile)

      const response = await fetch("/api/atas/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.body) {
        throw new Error("Resposta sem body")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        
        // Processar eventos SSE do buffer
        const lines = buffer.split("\n\n")
        buffer = lines.pop() || "" // Manter dados incompletos no buffer

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const eventData: ProgressEvent = JSON.parse(line.slice(6))
              
              setProgressEvents(prev => {
                // Atualizar ou adicionar evento
                const existing = prev.findIndex(e => e.etapa === eventData.etapa)
                if (existing >= 0) {
                  const updated = [...prev]
                  updated[existing] = eventData
                  return updated
                }
                return [...prev, eventData]
              })
              
              setCurrentProgress(eventData.progresso)

              // Verificar se finalizou
              if (eventData.etapa === "finalizado" && eventData.status === "sucesso") {
                setSmartUploadProgress("success")
                setSmartUploadResult({
                  success: true,
                  ata_id: eventData.dados?.ata_id as string,
                  slug: eventData.dados?.slug as string,
                  dados: {
                    numero_ata: eventData.dados?.numero_ata as string,
                    orgao: eventData.dados?.orgao as string,
                    fornecedor: eventData.dados?.fornecedor as string,
                    lotes: eventData.dados?.lotes as number,
                    itens: eventData.dados?.itens as number,
                  },
                  message: eventData.mensagem,
                })
              }

              // Verificar se houve erro
              if (eventData.status === "erro") {
                setSmartUploadProgress("error")
                setSmartUploadResult({
                  success: false,
                  error: eventData.mensagem,
                })
              }
            } catch (e) {
              console.error("Erro ao parsear evento SSE:", e)
            }
          }
        }
      }
    } catch (error) {
      console.error("Erro no upload inteligente:", error)
      setSmartUploadProgress("error")
      setSmartUploadResult({
        success: false,
        error: "Erro ao processar o arquivo. Tente novamente.",
      })
    }
  }

  const handleFileUpload = async (
    file: File,
    type: "ata" | "termo"
  ) => {
    const setUploading = type === "ata" ? setUploadingPdfAta : setUploadingPdfTermo
    setUploading(true)

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${type}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { data, error } = await supabase.storage
        .from("atas-documentos")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (error) throw error

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from("atas-documentos")
        .getPublicUrl(data.path)

      if (type === "ata") {
        setFormData((prev) => ({
          ...prev,
          pdf_ata_url: publicUrl,
          pdf_ata_nome: file.name,
        }))
      } else {
        setFormData((prev) => ({
          ...prev,
          pdf_termo_url: publicUrl,
          pdf_termo_nome: file.name,
        }))
      }
    } catch (error) {
      console.error("Erro ao fazer upload:", error)
      alert("Erro ao fazer upload do arquivo")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.numero_ata || !formData.orgao_gerenciador || !formData.slug) {
      alert("Preencha os campos obrigatórios: Número da ATA, Órgão Gerenciador e Slug")
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase.from("atas_registro_preco").insert({
        ...formData,
        data_inicio: formData.data_inicio || null,
        data_fim: formData.data_fim || null,
      })

      if (error) throw error

      router.push("/admin/atas")
    } catch (error: unknown) {
      console.error("Erro ao salvar:", error)
      const errorMessage = error instanceof Error && 'code' in error && (error as { code: string }).code === "23505"
        ? "Já existe uma ATA com este slug. Escolha um slug diferente."
        : "Erro ao salvar ATA"
      alert(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/atas">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-heading text-preto">
            Nova Ata de Registro de Preço
          </h1>
          <p className="text-cinza-escuro mt-1">
            Cadastre uma nova ATA para exibição no site
          </p>
        </div>
      </div>

      {/* Upload Inteligente com IA */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-verde/5 to-verde/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-verde rounded-lg">
              <Wand2 className="h-6 w-6 text-preto" />
            </div>
            <div>
              <CardTitle className="text-xl font-heading flex items-center gap-2">
                Upload Inteligente com IA
                <span className="text-xs bg-verde/20 text-verde px-2 py-0.5 rounded-full font-normal">
                  Recomendado
                </span>
              </CardTitle>
              <CardDescription>
                Envie o PDF da ATA e deixe nossa IA extrair automaticamente todos os dados
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {smartUploadProgress === "idle" && (
            <div className="border-2 border-dashed border-verde/30 rounded-xl p-8 text-center hover:border-verde/50 transition-colors">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setSmartUploadFile(e.target.files?.[0] || null)}
                className="hidden"
                id="smart-upload"
              />
              <label htmlFor="smart-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-verde/10 rounded-full">
                    <Sparkles className="h-8 w-8 text-verde" />
                  </div>
                  <div>
                    <p className="font-semibold text-preto">
                      {smartUploadFile ? smartUploadFile.name : "Clique para selecionar o PDF da ATA"}
                    </p>
                    <p className="text-sm text-cinza-escuro mt-1">
                      A IA irá extrair: número da ATA, órgão, fornecedor, lotes e itens
                    </p>
                  </div>
                </div>
              </label>
              
              {smartUploadFile && (
                <div className="mt-4 flex justify-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSmartUploadFile(null)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remover
                  </Button>
                  <Button
                    onClick={handleSmartUpload}
                    className="bg-verde hover:bg-verde/90 text-preto"
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Processar com IA
                  </Button>
                </div>
              )}
            </div>
          )}

          {smartUploadProgress === "processing" && (
            <div className="border-2 border-verde/30 rounded-xl p-6 bg-verde/5">
              {/* Barra de Progresso Geral */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-preto">Progresso Geral</span>
                  <span className="text-sm font-semibold text-verde">{currentProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-verde to-verde/80 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${currentProgress}%` }}
                  />
                </div>
              </div>

              {/* Lista de Etapas */}
              <div className="space-y-3">
                {progressEvents.map((event, index) => {
                  const info = etapasInfo[event.etapa] || { label: event.etapa, icon: '⏳' }
                  return (
                    <div 
                      key={event.etapa}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                        event.status === 'processando' 
                          ? 'bg-yellow-50 border border-yellow-200' 
                          : event.status === 'sucesso'
                          ? 'bg-green-50 border border-green-200'
                          : event.status === 'erro'
                          ? 'bg-red-50 border border-red-200'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {/* Ícone de Status */}
                      <div className="flex-shrink-0">
                        {event.status === 'processando' ? (
                          <Loader2 className="h-5 w-5 text-yellow-600 animate-spin" />
                        ) : event.status === 'sucesso' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : event.status === 'erro' ? (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        ) : (
                          <span className="text-lg">{info.icon}</span>
                        )}
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm ${
                          event.status === 'processando' ? 'text-yellow-800' :
                          event.status === 'sucesso' ? 'text-green-800' :
                          event.status === 'erro' ? 'text-red-800' :
                          'text-gray-800'
                        }`}>
                          {info.label}
                        </p>
                        <p className={`text-xs truncate ${
                          event.status === 'processando' ? 'text-yellow-600' :
                          event.status === 'sucesso' ? 'text-green-600' :
                          event.status === 'erro' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {event.mensagem}
                        </p>
                      </div>

                      {/* Badge de Status */}
                      <div className="flex-shrink-0">
                        {event.status === 'processando' && (
                          <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
                            Em andamento
                          </span>
                        )}
                        {event.status === 'sucesso' && (
                          <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                            Concluído
                          </span>
                        )}
                        {event.status === 'erro' && (
                          <span className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full">
                            Erro
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Indicador de Processamento */}
              {progressEvents.length === 0 && (
                <div className="flex flex-col items-center gap-4 py-4">
                  <Loader2 className="h-10 w-10 text-verde animate-spin" />
                  <p className="text-sm text-cinza-escuro">Iniciando processamento...</p>
                </div>
              )}
            </div>
          )}

          {smartUploadProgress === "success" && smartUploadResult && (
            <div className="border-2 border-green-300 rounded-xl p-6 bg-green-50">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-green-800 text-lg">
                    ATA cadastrada com sucesso!
                  </p>
                  <p className="text-green-700 mt-1">
                    {smartUploadResult.message}
                  </p>
                  {smartUploadResult.dados && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-gray-500">ATA</p>
                        <p className="font-semibold text-sm">{smartUploadResult.dados.numero_ata}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-gray-500">Órgão</p>
                        <p className="font-semibold text-sm">{smartUploadResult.dados.orgao}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-gray-500">Fornecedor</p>
                        <p className="font-semibold text-sm truncate">{smartUploadResult.dados.fornecedor}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-gray-500">Lotes</p>
                        <p className="font-semibold text-sm">{smartUploadResult.dados.lotes}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-xs text-gray-500">Itens</p>
                        <p className="font-semibold text-sm">{smartUploadResult.dados.itens}</p>
                      </div>
                    </div>
                  )}
                  <div className="mt-4 flex gap-3">
                    <Button
                      onClick={() => router.push(`/admin/atas/${smartUploadResult.ata_id}`)}
                      className="bg-verde hover:bg-verde/90 text-preto"
                    >
                      Ver ATA Cadastrada
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSmartUploadProgress("idle")
                        setSmartUploadFile(null)
                        setSmartUploadResult(null)
                        setProgressEvents([])
                        setCurrentProgress(0)
                      }}
                    >
                      Cadastrar Outra
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {smartUploadProgress === "error" && smartUploadResult && (
            <div className="border-2 border-red-300 rounded-xl p-6 bg-red-50">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-red-800">
                    Erro ao processar o PDF
                  </p>
                  <p className="text-red-700 mt-1">
                    {smartUploadResult.error}
                  </p>
                  <div className="mt-4 flex gap-3">
                    <Button
                      onClick={() => {
                        setSmartUploadProgress("idle")
                        setSmartUploadResult(null)
                        setProgressEvents([])
                        setCurrentProgress(0)
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Tentar Novamente
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Divisor */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-50 px-4 text-sm text-cinza-escuro">
            ou preencha manualmente
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Básicos */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-verde" />
              Dados da ATA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numero_ata">Número da ATA *</Label>
                <Input
                  id="numero_ata"
                  value={formData.numero_ata}
                  onChange={(e) => handleChange("numero_ata", e.target.value)}
                  placeholder="Ex: 264/2025 - I"
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug (URL) *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  placeholder="ex: 264-2025-seplag-mg"
                  required
                />
                <p className="text-xs text-cinza-escuro mt-1">
                  URL: /ata-registro-preco/{formData.slug || "[slug]"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="orgao_gerenciador">Órgão Gerenciador *</Label>
                <Input
                  id="orgao_gerenciador"
                  value={formData.orgao_gerenciador}
                  onChange={(e) => handleChange("orgao_gerenciador", e.target.value)}
                  placeholder="Ex: Secretaria de Estado de Planejamento e Gestão"
                  required
                />
              </div>
              <div>
                <Label htmlFor="orgao_gerenciador_sigla">Sigla do Órgão</Label>
                <Input
                  id="orgao_gerenciador_sigla"
                  value={formData.orgao_gerenciador_sigla}
                  onChange={(e) => handleChange("orgao_gerenciador_sigla", e.target.value)}
                  placeholder="Ex: SEPLAG-MG"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="modalidade">Modalidade</Label>
                <select
                  id="modalidade"
                  value={formData.modalidade}
                  onChange={(e) => handleChange("modalidade", e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="Pregão Eletrônico">Pregão Eletrônico</option>
                  <option value="Pregão Presencial">Pregão Presencial</option>
                  <option value="Concorrência">Concorrência</option>
                </select>
              </div>
              <div>
                <Label htmlFor="numero_planejamento">Nº Planejamento</Label>
                <Input
                  id="numero_planejamento"
                  value={formData.numero_planejamento}
                  onChange={(e) => handleChange("numero_planejamento", e.target.value)}
                  placeholder="Ex: 396/2024"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="vigente">Vigente</option>
                  <option value="expirada">Expirada</option>
                  <option value="suspensa">Suspensa</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="vigencia_meses">Vigência (meses)</Label>
                <Input
                  id="vigencia_meses"
                  type="number"
                  value={formData.vigencia_meses}
                  onChange={(e) => handleChange("vigencia_meses", parseInt(e.target.value) || 12)}
                />
              </div>
              <div>
                <Label htmlFor="data_inicio">Data de Início</Label>
                <Input
                  id="data_inicio"
                  type="date"
                  value={formData.data_inicio}
                  onChange={(e) => handleChange("data_inicio", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="data_fim">Data de Término</Label>
                <Input
                  id="data_fim"
                  type="date"
                  value={formData.data_fim}
                  onChange={(e) => handleChange("data_fim", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="objeto">Objeto da Contratação</Label>
              <textarea
                id="objeto"
                value={formData.objeto}
                onChange={(e) => handleChange("objeto", e.target.value)}
                placeholder="Descrição do objeto da ATA..."
                className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              />
            </div>

            <div>
              <Label htmlFor="base_legal">Base Legal</Label>
              <Input
                id="base_legal"
                value={formData.base_legal}
                onChange={(e) => handleChange("base_legal", e.target.value)}
                placeholder="Ex: Lei nº 14.133/2021"
              />
            </div>
          </CardContent>
        </Card>

        {/* Fornecedor */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Dados do Fornecedor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fornecedor_nome">Razão Social</Label>
                <Input
                  id="fornecedor_nome"
                  value={formData.fornecedor_nome}
                  onChange={(e) => handleChange("fornecedor_nome", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="fornecedor_cnpj">CNPJ</Label>
                <Input
                  id="fornecedor_cnpj"
                  value={formData.fornecedor_cnpj}
                  onChange={(e) => handleChange("fornecedor_cnpj", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PDFs */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <FileText className="h-5 w-5 text-verde" />
              Documentos PDF
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PDF da ATA */}
              <div className="space-y-2">
                <Label>PDF da Ata de Registro de Preço</Label>
                {formData.pdf_ata_url ? (
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span className="flex-1 text-sm truncate">{formData.pdf_ata_nome}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setFormData((prev) => ({
                        ...prev,
                        pdf_ata_url: "",
                        pdf_ata_nome: "",
                      }))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, "ata")
                      }}
                      className="hidden"
                      id="pdf-ata"
                      disabled={uploadingPdfAta}
                    />
                    <label
                      htmlFor="pdf-ata"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      {uploadingPdfAta ? (
                        <Loader2 className="h-8 w-8 animate-spin text-verde" />
                      ) : (
                        <Upload className="h-8 w-8 text-cinza-escuro" />
                      )}
                      <span className="text-sm text-cinza-escuro">
                        {uploadingPdfAta ? "Enviando..." : "Clique para enviar PDF"}
                      </span>
                    </label>
                  </div>
                )}
              </div>

              {/* PDF do Termo */}
              <div className="space-y-2">
                <Label>PDF do Termo de Referência</Label>
                {formData.pdf_termo_url ? (
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span className="flex-1 text-sm truncate">{formData.pdf_termo_nome}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setFormData((prev) => ({
                        ...prev,
                        pdf_termo_url: "",
                        pdf_termo_nome: "",
                      }))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, "termo")
                      }}
                      className="hidden"
                      id="pdf-termo"
                      disabled={uploadingPdfTermo}
                    />
                    <label
                      htmlFor="pdf-termo"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      {uploadingPdfTermo ? (
                        <Loader2 className="h-8 w-8 animate-spin text-verde" />
                      ) : (
                        <Upload className="h-8 w-8 text-cinza-escuro" />
                      )}
                      <span className="text-sm text-cinza-escuro">
                        {uploadingPdfTermo ? "Enviando..." : "Clique para enviar PDF"}
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configurações */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Configurações de Exibição</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={formData.ativo}
                  onChange={(e) => handleChange("ativo", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="ativo">ATA ativa (visível no site)</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="destaque_home"
                  checked={formData.destaque_home}
                  onChange={(e) => handleChange("destaque_home", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="destaque_home">Destacar na página inicial</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/atas">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={saving}
            className="bg-verde hover:bg-verde/90 text-preto"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar ATA
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
