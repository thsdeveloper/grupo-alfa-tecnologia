import { createClient } from "@/lib/supabase/server"
import type { OrganizationSettings } from "@/lib/database.types"

// Valores padrão para quando as configurações não podem ser carregadas
const defaultSettings: OrganizationSettings = {
  id: "",
  company_name: "Alfa Tecnologia em Engenharia e Infraestrutura de Redes Ltda.",
  company_short_name: "Grupo Alfa Tecnologia",
  company_slogan: "Soluções em Tecnologia",
  cnpj: "31.837.899/0001-25",
  logo_url: "/logo-alfa-telecon2.png",
  logo_dark_url: "/logo-alfa-telecon2.png",
  favicon_url: "/favicon.ico",
  primary_color: "#00FF66",
  secondary_color: "#1a1a1a",
  accent_color: "#00cc52",
  email: "contato@grupoalfatecnologia.com.br",
  phone: "(61) 99999-9999",
  whatsapp: "5561999999999",
  address_street: "",
  address_number: "",
  address_complement: "",
  address_neighborhood: "",
  address_city: "Brasília",
  address_state: "DF",
  address_zipcode: "",
  social_instagram: "",
  social_facebook: "",
  social_linkedin: "",
  social_youtube: "",
  seo_title: "Grupo Alfa Tecnologia | Soluções em Tecnologia",
  seo_description: "Empresa especializada em soluções tecnológicas para o setor público e privado.",
  seo_keywords: "tecnologia, infraestrutura de redes, segurança eletrônica",
  business_hours: "Segunda a Sexta: 08h às 18h",
  created_at: null,
  updated_at: null,
}

// Cache em memória para Server Components
let serverCache: OrganizationSettings | null = null
let serverCacheTimestamp: number = 0
const CACHE_DURATION = 30 * 1000 // 30 segundos para server-side (reduzido para melhor atualização)

/**
 * Busca as configurações da organização (para uso em Server Components)
 * Esta função pode ser usada em qualquer Server Component ou API Route
 */
export async function getOrganizationSettings(): Promise<OrganizationSettings> {
  // Verificar cache
  if (serverCache && Date.now() - serverCacheTimestamp < CACHE_DURATION) {
    return serverCache
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("organization_settings")
      .select("*")
      .single()

    if (error) {
      console.error("Erro ao carregar configurações:", error)
      return defaultSettings
    }

    serverCache = data
    serverCacheTimestamp = Date.now()
    return data
  } catch (error) {
    console.error("Erro ao carregar configurações:", error)
    return defaultSettings
  }
}

/**
 * Limpa o cache do servidor
 * Útil após atualizar as configurações
 */
export function clearOrganizationCache(): void {
  serverCache = null
  serverCacheTimestamp = 0
}

/**
 * Retorna os valores padrão das configurações
 */
export function getDefaultSettings(): OrganizationSettings {
  return { ...defaultSettings }
}

/**
 * Formata o endereço completo a partir das configurações
 */
export function formatAddress(settings: OrganizationSettings): string {
  const parts = [
    settings.address_street,
    settings.address_number,
    settings.address_complement,
    settings.address_neighborhood,
    settings.address_city,
    settings.address_state,
    settings.address_zipcode,
  ].filter(Boolean)

  return parts.join(", ")
}

/**
 * Retorna o link do WhatsApp formatado
 */
export function getWhatsAppLink(settings: OrganizationSettings, message?: string): string {
  const baseUrl = `https://wa.me/${settings.whatsapp || "5561999999999"}`
  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message)}`
  }
  return baseUrl
}

export { defaultSettings }
