"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building2,
  Palette,
  Phone,
  MapPin,
  Globe,
  Search,
  Loader2,
  Save,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ImageUpload } from "@/components/admin/ImageUpload"
import type { OrganizationSettings } from "@/lib/database.types"
import { invalidateSettingsCache } from "@/lib/hooks/useOrganizationSettings"

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [settings, setSettings] = useState<Partial<OrganizationSettings>>({})
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        // Verificar se o usuário é super admin
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push("/login")
          return
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("is_super_admin")
          .eq("id", user.id)
          .single()

        if (!profile?.is_super_admin) {
          router.push("/admin")
          return
        }

        setIsSuperAdmin(true)

        // Carregar configurações
        const { data: settingsData, error } = await supabase
          .from("organization_settings")
          .select("*")
          .single()

        if (error) throw error
        setSettings(settingsData)
      } catch (error) {
        console.error("Erro ao carregar configurações:", error)
        setMessage({ type: "error", text: "Erro ao carregar configurações" })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [supabase, router])

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const { id, created_at, updated_at, ...updateData } = settings

      const { error } = await supabase
        .from("organization_settings")
        .update(updateData)
        .eq("id", id!)

      if (error) throw error

      setMessage({ type: "success", text: "Configurações salvas com sucesso!" })
    } catch (error) {
      console.error("Erro ao salvar:", error)
      setMessage({ type: "error", text: "Erro ao salvar configurações" })
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof OrganizationSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  // Função para salvar um campo específico imediatamente (usado para uploads)
  const saveField = async (field: keyof OrganizationSettings, value: string) => {
    // Atualizar estado local imediatamente
    setSettings((prev) => ({ ...prev, [field]: value }))

    // Salvar no banco imediatamente
    try {
      const { error } = await supabase
        .from("organization_settings")
        .update({ [field]: value })
        .eq("id", settings.id!)

      if (error) throw error

      // Invalidar o cache global para que outras partes do site vejam a nova imagem
      invalidateSettingsCache()

      setMessage({ type: "success", text: "Imagem salva com sucesso!" })
      // Limpar mensagem após 3 segundos
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error("Erro ao salvar imagem:", error)
      setMessage({ type: "error", text: "Erro ao salvar imagem" })
    }
  }

  // Função para excluir uma imagem
  const deleteImageField = async (field: keyof OrganizationSettings) => {
    try {
      const { error } = await supabase
        .from("organization_settings")
        .update({ [field]: null })
        .eq("id", settings.id!)

      if (error) throw error

      // Invalidar o cache global
      invalidateSettingsCache()

      setMessage({ type: "success", text: "Imagem excluída com sucesso!" })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      console.error("Erro ao excluir imagem:", error)
      setMessage({ type: "error", text: "Erro ao excluir imagem" })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-verde" />
      </div>
    )
  }

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-preto">Acesso Negado</h2>
        <p className="text-cinza-escuro">Apenas super administradores podem acessar esta página.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-preto">
            Configurações da Organização
          </h1>
          <p className="text-cinza-escuro mt-1">
            Gerencie as informações da empresa que aparecem no site
          </p>
        </div>
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
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>

      {/* Mensagem */}
      {message && (
        <div
          className={`flex items-center gap-2 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="identity" className="space-y-6">
        <TabsList className="bg-cinza-claro">
          <TabsTrigger value="identity" className="data-[state=active]:bg-verde data-[state=active]:text-preto">
            <Building2 className="h-4 w-4 mr-2" />
            Identidade
          </TabsTrigger>
          <TabsTrigger value="colors" className="data-[state=active]:bg-verde data-[state=active]:text-preto">
            <Palette className="h-4 w-4 mr-2" />
            Cores
          </TabsTrigger>
          <TabsTrigger value="contact" className="data-[state=active]:bg-verde data-[state=active]:text-preto">
            <Phone className="h-4 w-4 mr-2" />
            Contato
          </TabsTrigger>
          <TabsTrigger value="address" className="data-[state=active]:bg-verde data-[state=active]:text-preto">
            <MapPin className="h-4 w-4 mr-2" />
            Endereço
          </TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-verde data-[state=active]:text-preto">
            <Globe className="h-4 w-4 mr-2" />
            Redes Sociais
          </TabsTrigger>
          <TabsTrigger value="seo" className="data-[state=active]:bg-verde data-[state=active]:text-preto">
            <Search className="h-4 w-4 mr-2" />
            SEO
          </TabsTrigger>
        </TabsList>

        {/* Identidade da Empresa */}
        <TabsContent value="identity">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Identidade da Empresa</CardTitle>
              <CardDescription>
                Informações básicas da empresa que aparecem em todo o site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_name">Razão Social *</Label>
                  <Input
                    id="company_name"
                    value={settings.company_name || ""}
                    onChange={(e) => updateField("company_name", e.target.value)}
                    placeholder="Nome completo da empresa"
                  />
                </div>
                <div>
                  <Label htmlFor="company_short_name">Nome Fantasia *</Label>
                  <Input
                    id="company_short_name"
                    value={settings.company_short_name || ""}
                    onChange={(e) => updateField("company_short_name", e.target.value)}
                    placeholder="Nome curto/fantasia"
                  />
                </div>
                <div>
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input
                    id="cnpj"
                    value={settings.cnpj || ""}
                    onChange={(e) => updateField("cnpj", e.target.value)}
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                <div>
                  <Label htmlFor="company_slogan">Slogan</Label>
                  <Input
                    id="company_slogan"
                    value={settings.company_slogan || ""}
                    onChange={(e) => updateField("company_slogan", e.target.value)}
                    placeholder="Slogan da empresa"
                  />
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold text-preto mb-4">Logos e Imagens</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <ImageUpload
                      label="Logo Principal"
                      value={settings.logo_url}
                      onChange={(url) => saveField("logo_url", url)}
                      onDelete={() => deleteImageField("logo_url")}
                      folder="logos"
                      hint="PNG, JPG ou SVG. Recomendado: fundo transparente"
                      previewClassName="h-28 bg-white"
                    />
                  </div>
                  <div>
                    <ImageUpload
                      label="Logo para Fundo Escuro"
                      value={settings.logo_dark_url}
                      onChange={(url) => saveField("logo_dark_url", url)}
                      onDelete={() => deleteImageField("logo_dark_url")}
                      folder="logos"
                      hint="Versão para usar em fundos escuros"
                      previewClassName="h-28 bg-gray-800"
                    />
                  </div>
                  <div>
                    <ImageUpload
                      label="Favicon"
                      value={settings.favicon_url}
                      onChange={(url) => saveField("favicon_url", url)}
                      onDelete={() => deleteImageField("favicon_url")}
                      folder="logos"
                      accept="image/png,image/x-icon,image/vnd.microsoft.icon,image/svg+xml"
                      hint="ICO, PNG ou SVG. Tamanho: 32x32 ou 64x64"
                      previewClassName="h-28"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold text-preto mb-4">Horário de Funcionamento</h4>
                <div>
                  <Label htmlFor="business_hours">Horário</Label>
                  <Input
                    id="business_hours"
                    value={settings.business_hours || ""}
                    onChange={(e) => updateField("business_hours", e.target.value)}
                    placeholder="Segunda a Sexta: 08h às 18h"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cores */}
        <TabsContent value="colors">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Cores da Marca</CardTitle>
              <CardDescription>
                Defina as cores principais da identidade visual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primary_color">Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary_color"
                      type="color"
                      value={settings.primary_color || "#00FF66"}
                      onChange={(e) => updateField("primary_color", e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.primary_color || "#00FF66"}
                      onChange={(e) => updateField("primary_color", e.target.value)}
                      placeholder="#00FF66"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondary_color">Cor Secundária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary_color"
                      type="color"
                      value={settings.secondary_color || "#1a1a1a"}
                      onChange={(e) => updateField("secondary_color", e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.secondary_color || "#1a1a1a"}
                      onChange={(e) => updateField("secondary_color", e.target.value)}
                      placeholder="#1a1a1a"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="accent_color">Cor de Destaque</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accent_color"
                      type="color"
                      value={settings.accent_color || "#00cc52"}
                      onChange={(e) => updateField("accent_color", e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.accent_color || "#00cc52"}
                      onChange={(e) => updateField("accent_color", e.target.value)}
                      placeholder="#00cc52"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Preview das cores */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold text-preto mb-4">Preview</h4>
                <div className="flex gap-4">
                  <div
                    className="w-24 h-24 rounded-lg shadow-md flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: settings.primary_color || "#00FF66" }}
                  >
                    Primária
                  </div>
                  <div
                    className="w-24 h-24 rounded-lg shadow-md flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: settings.secondary_color || "#1a1a1a" }}
                  >
                    Secundária
                  </div>
                  <div
                    className="w-24 h-24 rounded-lg shadow-md flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: settings.accent_color || "#00cc52" }}
                  >
                    Destaque
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contato */}
        <TabsContent value="contact">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
              <CardDescription>
                Dados de contato que aparecem no site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email || ""}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="contato@empresa.com.br"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={settings.phone || ""}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="(61) 99999-9999"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="whatsapp">WhatsApp (apenas números)</Label>
                  <Input
                    id="whatsapp"
                    value={settings.whatsapp || ""}
                    onChange={(e) => updateField("whatsapp", e.target.value)}
                    placeholder="5561999999999"
                  />
                  <p className="text-xs text-cinza-escuro mt-1">
                    Formato: código do país + DDD + número (sem espaços ou caracteres especiais)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Endereço */}
        <TabsContent value="address">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
              <CardDescription>
                Localização física da empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="address_street">Logradouro</Label>
                  <Input
                    id="address_street"
                    value={settings.address_street || ""}
                    onChange={(e) => updateField("address_street", e.target.value)}
                    placeholder="Rua, Avenida, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="address_number">Número</Label>
                  <Input
                    id="address_number"
                    value={settings.address_number || ""}
                    onChange={(e) => updateField("address_number", e.target.value)}
                    placeholder="123"
                  />
                </div>
                <div>
                  <Label htmlFor="address_complement">Complemento</Label>
                  <Input
                    id="address_complement"
                    value={settings.address_complement || ""}
                    onChange={(e) => updateField("address_complement", e.target.value)}
                    placeholder="Sala 101, Bloco A"
                  />
                </div>
                <div>
                  <Label htmlFor="address_neighborhood">Bairro</Label>
                  <Input
                    id="address_neighborhood"
                    value={settings.address_neighborhood || ""}
                    onChange={(e) => updateField("address_neighborhood", e.target.value)}
                    placeholder="Bairro"
                  />
                </div>
                <div>
                  <Label htmlFor="address_city">Cidade</Label>
                  <Input
                    id="address_city"
                    value={settings.address_city || ""}
                    onChange={(e) => updateField("address_city", e.target.value)}
                    placeholder="Brasília"
                  />
                </div>
                <div>
                  <Label htmlFor="address_state">Estado (UF)</Label>
                  <Input
                    id="address_state"
                    value={settings.address_state || ""}
                    onChange={(e) => updateField("address_state", e.target.value)}
                    placeholder="DF"
                    maxLength={2}
                  />
                </div>
                <div>
                  <Label htmlFor="address_zipcode">CEP</Label>
                  <Input
                    id="address_zipcode"
                    value={settings.address_zipcode || ""}
                    onChange={(e) => updateField("address_zipcode", e.target.value)}
                    placeholder="00000-000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Redes Sociais */}
        <TabsContent value="social">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
              <CardDescription>
                Links das redes sociais da empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="social_instagram">Instagram</Label>
                  <Input
                    id="social_instagram"
                    value={settings.social_instagram || ""}
                    onChange={(e) => updateField("social_instagram", e.target.value)}
                    placeholder="https://instagram.com/empresa"
                  />
                </div>
                <div>
                  <Label htmlFor="social_facebook">Facebook</Label>
                  <Input
                    id="social_facebook"
                    value={settings.social_facebook || ""}
                    onChange={(e) => updateField("social_facebook", e.target.value)}
                    placeholder="https://facebook.com/empresa"
                  />
                </div>
                <div>
                  <Label htmlFor="social_linkedin">LinkedIn</Label>
                  <Input
                    id="social_linkedin"
                    value={settings.social_linkedin || ""}
                    onChange={(e) => updateField("social_linkedin", e.target.value)}
                    placeholder="https://linkedin.com/company/empresa"
                  />
                </div>
                <div>
                  <Label htmlFor="social_youtube">YouTube</Label>
                  <Input
                    id="social_youtube"
                    value={settings.social_youtube || ""}
                    onChange={(e) => updateField("social_youtube", e.target.value)}
                    placeholder="https://youtube.com/@empresa"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>SEO (Otimização para Buscadores)</CardTitle>
              <CardDescription>
                Configurações para melhorar a visibilidade nos motores de busca
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seo_title">Título da Página (meta title)</Label>
                <Input
                  id="seo_title"
                  value={settings.seo_title || ""}
                  onChange={(e) => updateField("seo_title", e.target.value)}
                  placeholder="Nome da Empresa | Soluções em Tecnologia"
                />
                <p className="text-xs text-cinza-escuro mt-1">
                  Recomendado: até 60 caracteres
                </p>
              </div>
              <div>
                <Label htmlFor="seo_description">Descrição (meta description)</Label>
                <textarea
                  id="seo_description"
                  value={settings.seo_description || ""}
                  onChange={(e) => updateField("seo_description", e.target.value)}
                  placeholder="Descrição da empresa para aparecer nos resultados de busca..."
                  className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                />
                <p className="text-xs text-cinza-escuro mt-1">
                  Recomendado: entre 150 e 160 caracteres
                </p>
              </div>
              <div>
                <Label htmlFor="seo_keywords">Palavras-chave (separadas por vírgula)</Label>
                <Input
                  id="seo_keywords"
                  value={settings.seo_keywords || ""}
                  onChange={(e) => updateField("seo_keywords", e.target.value)}
                  placeholder="tecnologia, infraestrutura, segurança eletrônica"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
