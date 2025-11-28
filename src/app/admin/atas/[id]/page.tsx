"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  ArrowLeft,
  Loader2,
  FileText,
  Package,
  Layers,
  Building,
  Calendar,
  User,
  Hash,
  FileCheck,
  ExternalLink,
  Info,
  Clock,
  Target,
  Scale,
  Trash2,
  AlertTriangle,
  Check,
  X,
  Wrench,
  ImagePlus,
  Camera,
  Upload,
} from "lucide-react"
import Image from "next/image"
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
  base_legal: string | null
  pdf_ata_url: string | null
  pdf_ata_nome: string | null
  pdf_termo_url: string | null
  pdf_termo_nome: string | null
  ativo: boolean | null
  destaque_home: boolean | null
  created_at: string | null
}

interface Lote {
  id: string
  ata_id: string
  numero: string
  descricao: string | null
  ativo: boolean
  ordem: number
}

interface Item {
  id: string
  ata_id: string
  lote_id: string | null
  numero_item: string
  descricao: string
  unidade: string
  quantidade: number
  preco_unitario: number
  ativo: boolean
  ordem: number
  executavel: boolean
}

interface ItemImagem {
  id: string
  item_id: string
  url: string
  nome_arquivo: string | null
  descricao: string | null
  ordem: number
}

const statusConfig: Record<string, { label: string; color: string }> = {
  vigente: { label: "Vigente", color: "bg-green-100 text-green-700" },
  expirada: { label: "Expirada", color: "bg-red-100 text-red-700" },
  suspensa: { label: "Suspensa", color: "bg-yellow-100 text-yellow-700" },
}

export default function VisualizarAtaPage() {
  const router = useRouter()
  const params = useParams()
  const ataId = params.id as string
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [ata, setAta] = useState<Ata | null>(null)
  const [lotes, setLotes] = useState<Lote[]>([])
  const [itens, setItens] = useState<Item[]>([])
  const [imagens, setImagens] = useState<ItemImagem[]>([])
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  // Estados para modal de imagens
  const [imagensModalOpen, setImagensModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [uploadingImagem, setUploadingImagem] = useState(false)
  const [deletingImagem, setDeletingImagem] = useState<string | null>(null)

  const fetchAta = useCallback(async () => {
    setLoading(true)
    try {
      const [{ data: ataData, error: ataError }, { data: lotesData }, { data: itensData }] =
        await Promise.all([
          supabase.from("atas_registro_preco").select("*").eq("id", ataId).single(),
          supabase.from("ata_lotes").select("*").eq("ata_id", ataId).order("ordem"),
          supabase.from("ata_itens").select("*").eq("ata_id", ataId).order("ordem"),
        ])

      if (ataError) throw ataError

      // Buscar imagens de todos os itens
      const itemIds = (itensData || []).map(i => i.id)
      const { data: imagensData } = await supabase
        .from("ata_item_imagens")
        .select("*")
        .in("item_id", itemIds.length > 0 ? itemIds : ['none'])
        .order("ordem")

      setAta(ataData)
      setLotes(lotesData || [])
      setItens(itensData || [])
      setImagens(imagensData || [])
    } catch (error) {
      console.error("Erro ao buscar ATA:", error)
      alert("Erro ao carregar dados da ATA")
      router.push("/admin/atas")
    } finally {
      setLoading(false)
    }
  }, [supabase, ataId, router])

  useEffect(() => {
    fetchAta()
  }, [fetchAta])

  // Função para excluir a ATA e todos os arquivos relacionados
  const handleDeleteAta = async () => {
    if (!ata) return
    
    setDeleting(true)
    try {
      // 1. Excluir todos os itens da ATA
      const { error: itensError } = await supabase
        .from("ata_itens")
        .delete()
        .eq("ata_id", ata.id)
      
      if (itensError) {
        console.error("Erro ao excluir itens:", itensError)
      }

      // 2. Excluir todos os lotes da ATA
      const { error: lotesError } = await supabase
        .from("ata_lotes")
        .delete()
        .eq("ata_id", ata.id)
      
      if (lotesError) {
        console.error("Erro ao excluir lotes:", lotesError)
      }

      // 3. Excluir o PDF da ATA do Storage (se existir)
      if (ata.pdf_ata_url) {
        // Extrair o nome do arquivo da URL
        const urlParts = ata.pdf_ata_url.split("/")
        const fileName = urlParts[urlParts.length - 1]
        
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from("atas-documentos")
            .remove([fileName])
          
          if (storageError) {
            console.error("Erro ao excluir PDF da ATA:", storageError)
          }
        }
      }

      // 4. Excluir o PDF do Termo de Referência do Storage (se existir)
      if (ata.pdf_termo_url) {
        const urlParts = ata.pdf_termo_url.split("/")
        const fileName = urlParts[urlParts.length - 1]
        
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from("atas-documentos")
            .remove([fileName])
          
          if (storageError) {
            console.error("Erro ao excluir PDF do Termo:", storageError)
          }
        }
      }

      // 5. Excluir a ATA do banco de dados
      const { error: ataError } = await supabase
        .from("atas_registro_preco")
        .delete()
        .eq("id", ata.id)
      
      if (ataError) {
        throw ataError
      }

      // Redirecionar para a lista de ATAs
      router.push("/admin/atas")
    } catch (error) {
      console.error("Erro ao excluir ATA:", error)
      alert("Erro ao excluir a ATA. Tente novamente.")
    } finally {
      setDeleting(false)
      setDeleteModalOpen(false)
    }
  }

  // Função para alternar se um item é executável pela empresa
  const toggleExecutavel = async (itemId: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from("ata_itens")
        .update({ executavel: !currentValue })
        .eq("id", itemId)

      if (error) throw error

      // Atualizar o estado local
      setItens(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, executavel: !currentValue }
            : item
        )
      )
    } catch (error) {
      console.error("Erro ao atualizar item:", error)
      alert("Erro ao atualizar o item. Tente novamente.")
    }
  }

  // Marcar/desmarcar todos os itens de um lote como executáveis
  const toggleLoteExecutavel = async (loteId: string, executavel: boolean) => {
    try {
      const { error } = await supabase
        .from("ata_itens")
        .update({ executavel })
        .eq("lote_id", loteId)

      if (error) throw error

      // Atualizar o estado local
      setItens(prev => 
        prev.map(item => 
          item.lote_id === loteId 
            ? { ...item, executavel }
            : item
        )
      )
    } catch (error) {
      console.error("Erro ao atualizar itens do lote:", error)
      alert("Erro ao atualizar os itens. Tente novamente.")
    }
  }

  // Upload de imagem para um item
  const handleUploadImagem = async (file: File) => {
    if (!selectedItem) return

    setUploadingImagem(true)
    try {
      // Upload para o storage
      const timestamp = Date.now()
      const sanitizedFileName = file.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9.-]/g, '_')
      const fileName = `${selectedItem.id}/${timestamp}-${sanitizedFileName}`

      const { error: uploadError } = await supabase.storage
        .from('atas-servicos-imagens')
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('atas-servicos-imagens')
        .getPublicUrl(fileName)

      // Salvar no banco
      const imagensDoItem = imagens.filter(i => i.item_id === selectedItem.id)
      const { data: novaImagem, error: dbError } = await supabase
        .from('ata_item_imagens')
        .insert({
          item_id: selectedItem.id,
          url: urlData.publicUrl,
          nome_arquivo: file.name,
          ordem: imagensDoItem.length,
        })
        .select()
        .single()

      if (dbError) throw dbError

      // Atualizar estado local
      setImagens(prev => [...prev, novaImagem])
    } catch (error) {
      console.error("Erro ao fazer upload:", error)
      alert("Erro ao fazer upload da imagem. Tente novamente.")
    } finally {
      setUploadingImagem(false)
    }
  }

  // Deletar imagem
  const handleDeleteImagem = async (imagemId: string, url: string) => {
    setDeletingImagem(imagemId)
    try {
      // Extrair nome do arquivo da URL
      const urlParts = url.split('/atas-servicos-imagens/')
      const fileName = urlParts[1]

      // Deletar do storage
      if (fileName) {
        await supabase.storage
          .from('atas-servicos-imagens')
          .remove([fileName])
      }

      // Deletar do banco
      const { error } = await supabase
        .from('ata_item_imagens')
        .delete()
        .eq('id', imagemId)

      if (error) throw error

      // Atualizar estado local
      setImagens(prev => prev.filter(i => i.id !== imagemId))
    } catch (error) {
      console.error("Erro ao deletar imagem:", error)
      alert("Erro ao deletar a imagem. Tente novamente.")
    } finally {
      setDeletingImagem(null)
    }
  }

  // Obter imagens de um item específico
  const getImagensDoItem = (itemId: string) => {
    return imagens.filter(i => i.item_id === itemId)
  }

  // Calcular valores
  const valorTotal = itens.reduce((acc, item) => acc + (item.quantidade * item.preco_unitario), 0)
  const itensExecutaveis = itens.filter(item => item.executavel)
  const valorExecutavel = itensExecutaveis.reduce((acc, item) => acc + (item.quantidade * item.preco_unitario), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-verde" />
      </div>
    )
  }

  if (!ata) return null

  const config = statusConfig[ata.status] || { label: ata.status, color: "bg-gray-100 text-gray-700" }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/atas">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold font-heading text-preto">
                ATA {ata.numero_ata}
              </h1>
              <Badge className={config.color}>{config.label}</Badge>
            </div>
            <p className="text-cinza-escuro mt-1 flex items-center gap-2">
              <Building className="h-4 w-4" />
              {ata.orgao_gerenciador_sigla || ata.orgao_gerenciador}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {ata.pdf_ata_url && (
            <a href={ata.pdf_ata_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                <FileText className="h-4 w-4 mr-2" />
                Ver PDF Original
              </Button>
            </a>
          )}
          <Link href={`/ata-registro-preco/${ata.slug}`} target="_blank">
            <Button className="bg-verde hover:bg-verde/90 text-preto">
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver no Site
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => setDeleteModalOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir ATA
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <Card className="border-0 shadow-md bg-blue-50 border-l-4 border-l-blue-500">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Wrench className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Defina os serviços que sua empresa executa</p>
              <p className="text-blue-600 mt-1">
                Na tabela de itens abaixo, marque quais serviços sua empresa presta. 
                Apenas os itens marcados como &quot;Executamos&quot; serão exibidos no site público e na apresentação.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Layers className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-preto">{lotes.length}</p>
                <p className="text-sm text-cinza-escuro">Lotes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-gray-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-preto">{itens.length}</p>
                <p className="text-sm text-cinza-escuro">Itens Totais</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-verde/5 border border-verde/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-verde/20 flex items-center justify-center">
                <Wrench className="h-6 w-6 text-verde" />
              </div>
              <div>
                <p className="text-2xl font-bold text-verde">{itensExecutaveis.length}</p>
                <p className="text-sm text-cinza-escuro">Serviços que Executamos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <p className="text-2xl font-bold text-preto">{ata.vigencia_meses || 12}</p>
                <p className="text-sm text-cinza-escuro">Meses de Vigência</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-verde/5 border border-verde/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-verde/20 flex items-center justify-center">
                <Target className="h-6 w-6 text-verde" />
              </div>
              <div>
                <p className="text-lg font-bold text-verde">
                  {valorExecutavel.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>
                <p className="text-sm text-cinza-escuro">Valor dos Executáveis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dados da ATA */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-verde" />
            Dados da ATA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Número da ATA */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-cinza-escuro text-sm">
                <Hash className="h-4 w-4" />
                Número da ATA
              </div>
              <p className="font-semibold text-preto">{ata.numero_ata}</p>
            </div>

            {/* Órgão Gerenciador */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-cinza-escuro text-sm">
                <Building className="h-4 w-4" />
                Órgão Gerenciador
              </div>
              <div className="font-semibold text-preto flex items-center gap-2">
                <span>{ata.orgao_gerenciador}</span>
                {ata.orgao_gerenciador_sigla && (
                  <Badge variant="outline">{ata.orgao_gerenciador_sigla}</Badge>
                )}
              </div>
            </div>

            {/* Modalidade */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-cinza-escuro text-sm">
                <FileCheck className="h-4 w-4" />
                Modalidade
              </div>
              <p className="font-semibold text-preto">
                {ata.modalidade}
                {ata.numero_planejamento && (
                  <span className="text-cinza-escuro font-normal ml-1">
                    (Planejamento nº {ata.numero_planejamento})
                  </span>
                )}
              </p>
            </div>

            {/* Fornecedor */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-cinza-escuro text-sm">
                <User className="h-4 w-4" />
                Fornecedor Beneficiário
              </div>
              <p className="font-semibold text-preto">{ata.fornecedor_nome}</p>
              <p className="text-sm text-cinza-escuro">CNPJ: {ata.fornecedor_cnpj}</p>
            </div>

            {/* Vigência */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-cinza-escuro text-sm">
                <Calendar className="h-4 w-4" />
                Período de Vigência
              </div>
              <p className="font-semibold text-preto">
                {ata.data_inicio ? new Date(ata.data_inicio).toLocaleDateString("pt-BR") : "N/D"}
                {" → "}
                {ata.data_fim ? new Date(ata.data_fim).toLocaleDateString("pt-BR") : "N/D"}
              </p>
              <p className="text-sm text-cinza-escuro">{ata.vigencia_meses || 12} meses</p>
            </div>

            {/* Base Legal */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-cinza-escuro text-sm">
                <Scale className="h-4 w-4" />
                Base Legal
              </div>
              <p className="font-semibold text-preto">{ata.base_legal || "Lei nº 14.133/2021"}</p>
            </div>
          </div>

          {/* Objeto */}
          {ata.objeto && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center gap-2 text-cinza-escuro text-sm mb-2">
                <Target className="h-4 w-4" />
                Objeto da Contratação
              </div>
              <p className="text-preto leading-relaxed">{ata.objeto}</p>
            </div>
          )}

          {/* Configurações */}
          <div className="mt-6 pt-6 border-t flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-cinza-escuro">Status de visibilidade:</span>
              <Badge variant={ata.ativo ? "success" : "secondary"}>
                {ata.ativo ? "Visível no site" : "Oculta"}
              </Badge>
            </div>
            {ata.destaque_home && (
              <Badge className="bg-amber-100 text-amber-700">
                ⭐ Em destaque na home
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* PDFs */}
      {(ata.pdf_ata_url || ata.pdf_termo_url) && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <FileText className="h-5 w-5 text-verde" />
              Documentos PDF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {ata.pdf_ata_url && (
                <a
                  href={ata.pdf_ata_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                >
                  <FileText className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="font-medium text-preto">Ata de Registro de Preço</p>
                    <p className="text-sm text-cinza-escuro">{ata.pdf_ata_nome || "PDF Original"}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-cinza-escuro ml-2" />
                </a>
              )}
              {ata.pdf_termo_url && (
                <a
                  href={ata.pdf_termo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-preto">Termo de Referência</p>
                    <p className="text-sm text-cinza-escuro">{ata.pdf_termo_nome || "PDF Original"}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-cinza-escuro ml-2" />
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lotes */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <Layers className="h-5 w-5 text-verde" />
            Lotes da ATA
          </CardTitle>
          <CardDescription>{lotes.length} lote(s) registrado(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {lotes.length === 0 ? (
            <p className="text-center text-cinza-escuro py-8">Nenhum lote registrado</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {lotes.map((lote) => {
                const itensDoLote = itens.filter(i => i.lote_id === lote.id)
                const itensExecutaveisDoLote = itensDoLote.filter(i => i.executavel)
                const todosExecutaveis = itensDoLote.length > 0 && itensDoLote.every(i => i.executavel)
                const nenhumExecutavel = itensDoLote.every(i => !i.executavel)
                
                return (
                  <Card key={lote.id} className={`border shadow-sm ${todosExecutaveis ? 'border-verde/30 bg-verde/5' : ''}`}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-preto">Lote {lote.numero}</h3>
                          {lote.descricao && (
                            <p className="text-sm text-cinza-escuro mt-1">{lote.descricao}</p>
                          )}
                        </div>
                        <Badge variant={lote.ativo ? "success" : "secondary"} className="text-xs">
                          {lote.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-cinza-escuro">
                          {itensDoLote.length} itens 
                          <span className="text-verde ml-1">
                            ({itensExecutaveisDoLote.length} executamos)
                          </span>
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={todosExecutaveis ? "outline" : "default"}
                          className={todosExecutaveis ? "" : "bg-verde hover:bg-verde/90 text-preto"}
                          onClick={() => toggleLoteExecutavel(lote.id, true)}
                          disabled={todosExecutaveis}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Marcar Todos
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleLoteExecutavel(lote.id, false)}
                          disabled={nenhumExecutavel}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Desmarcar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Itens */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <Package className="h-5 w-5 text-verde" />
            Itens da ATA
          </CardTitle>
          <CardDescription>
            {itens.length} item(ns) registrado(s) • 
            <span className="text-verde font-medium ml-1">
              {itensExecutaveis.length} serviço(s) que executamos
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {itens.length === 0 ? (
            <p className="text-center text-cinza-escuro py-8">Nenhum item registrado</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] text-center">Executamos</TableHead>
                    <TableHead className="w-[80px]">Item</TableHead>
                    <TableHead className="w-[80px]">Lote</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="w-[80px]">Unidade</TableHead>
                    <TableHead className="text-right w-[90px]">Qtd</TableHead>
                    <TableHead className="text-right w-[100px]">Preço</TableHead>
                    <TableHead className="w-[100px] text-center">Fotos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itens.map((item) => {
                    const lote = lotes.find((l) => l.id === item.lote_id)
                    const imagensDoItem = getImagensDoItem(item.id)
                    
                    return (
                      <TableRow key={item.id} className={item.executavel ? 'bg-verde/5' : 'opacity-60'}>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant={item.executavel ? "default" : "outline"}
                            className={item.executavel 
                              ? "bg-verde hover:bg-verde/90 text-preto h-8 px-3" 
                              : "h-8 px-3"
                            }
                            onClick={() => toggleExecutavel(item.id, item.executavel)}
                          >
                            {item.executavel ? (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                Sim
                              </>
                            ) : (
                              <>
                                <X className="h-3 w-3 mr-1" />
                                Não
                              </>
                            )}
                          </Button>
                        </TableCell>
                        <TableCell className="font-medium">{item.numero_item}</TableCell>
                        <TableCell>
                          {lote ? (
                            <Badge variant="outline" className="text-xs">
                              {lote.numero}
                            </Badge>
                          ) : (
                            <span className="text-cinza-escuro">-</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[300px]">
                          <p className="line-clamp-2 text-sm">{item.descricao}</p>
                        </TableCell>
                        <TableCell className="text-sm text-cinza-escuro">{item.unidade}</TableCell>
                        <TableCell className="text-right font-medium">
                          {item.quantidade.toLocaleString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right text-verde font-medium">
                          {item.preco_unitario.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.executavel ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-2"
                              onClick={() => {
                                setSelectedItem(item)
                                setImagensModalOpen(true)
                              }}
                            >
                              <Camera className="h-3 w-3 mr-1" />
                              {imagensDoItem.length > 0 ? (
                                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                                  {imagensDoItem.length}
                                </Badge>
                              ) : (
                                <span className="text-xs">Adicionar</span>
                              )}
                            </Button>
                          ) : (
                            <span className="text-xs text-cinza-escuro">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rodapé com data de cadastro */}
      <Card className="border-0 shadow-sm bg-gray-50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm text-cinza-escuro">
            <span>
              Cadastrado em: {ata.created_at 
                ? new Date(ata.created_at).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/D"
              }
            </span>
            <span>ID: {ata.id}</span>
          </div>
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
          <div className="text-left text-sm text-muted-foreground">
            <p className="mt-2">
              Tem certeza que deseja excluir a ATA <strong>{ata.numero_ata}</strong>?
            </p>
            <p className="mt-3 text-red-600 font-medium">
              Esta ação irá excluir permanentemente:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Todos os <strong>{itens.length} itens</strong> cadastrados</li>
              <li>Todos os <strong>{lotes.length} lotes</strong> cadastrados</li>
              <li>Os arquivos PDF da ATA e Termo de Referência</li>
              <li>Todos os dados da ATA no banco de dados</li>
            </ul>
            <p className="mt-3 text-red-600 font-semibold">
              Esta ação não pode ser desfeita!
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
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

      {/* Modal de Gerenciamento de Imagens */}
      <Dialog open={imagensModalOpen} onOpenChange={setImagensModalOpen}>
        <DialogContent onClose={() => setImagensModalOpen(false)} className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-verde" />
              Fotos do Serviço
            </DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              {/* Info do Item */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-cinza-escuro">
                  <strong>Item {selectedItem.numero_item}:</strong> {selectedItem.descricao.substring(0, 100)}
                  {selectedItem.descricao.length > 100 && '...'}
                </p>
              </div>

              {/* Upload de Imagem */}
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleUploadImagem(file)
                    e.target.value = ''
                  }}
                  className="hidden"
                  id="upload-imagem"
                  disabled={uploadingImagem}
                />
                <label htmlFor="upload-imagem" className="cursor-pointer flex flex-col items-center gap-2">
                  {uploadingImagem ? (
                    <>
                      <Loader2 className="h-8 w-8 animate-spin text-verde" />
                      <span className="text-sm text-cinza-escuro">Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-cinza-escuro" />
                      <span className="text-sm text-cinza-escuro">
                        Clique para enviar uma foto do serviço realizado
                      </span>
                      <span className="text-xs text-gray-400">
                        Formatos aceitos: JPG, PNG, WebP, GIF (máx. 10MB)
                      </span>
                    </>
                  )}
                </label>
              </div>

              {/* Lista de Imagens */}
              {getImagensDoItem(selectedItem.id).length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {getImagensDoItem(selectedItem.id).map((imagem) => (
                    <div key={imagem.id} className="relative group">
                      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={imagem.url}
                          alt={imagem.nome_arquivo || 'Imagem do serviço'}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteImagem(imagem.id, imagem.url)}
                        disabled={deletingImagem === imagem.id}
                      >
                        {deletingImagem === imagem.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                      {imagem.nome_arquivo && (
                        <p className="text-xs text-cinza-escuro mt-1 truncate">
                          {imagem.nome_arquivo}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-cinza-escuro">
                  <ImagePlus className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>Nenhuma foto cadastrada para este serviço</p>
                  <p className="text-sm mt-1">Adicione fotos para mostrar exemplos do trabalho realizado</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setImagensModalOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
