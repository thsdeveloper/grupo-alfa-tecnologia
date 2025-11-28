"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { OrganizationSettings } from "@/lib/database.types"

// Valores padrão para quando as configurações ainda não foram carregadas
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

// Cache global para evitar múltiplas requisições
let cachedSettings: OrganizationSettings | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 1 * 60 * 1000 // 1 minuto (reduzido para melhor atualização)

// Função global para invalidar o cache
export function invalidateSettingsCache() {
  cachedSettings = null
  cacheTimestamp = 0
}

export function useOrganizationSettings() {
  const [settings, setSettings] = useState<OrganizationSettings>(cachedSettings || defaultSettings)
  const [loading, setLoading] = useState(!cachedSettings)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSettings() {
      // Verificar se o cache ainda é válido
      if (cachedSettings && Date.now() - cacheTimestamp < CACHE_DURATION) {
        setSettings(cachedSettings)
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("organization_settings")
          .select("*")
          .single()

        if (error) throw error

        cachedSettings = data
        cacheTimestamp = Date.now()
        setSettings(data)
      } catch (err) {
        console.error("Erro ao carregar configurações:", err)
        setError("Erro ao carregar configurações")
        // Usar valores padrão em caso de erro
        setSettings(defaultSettings)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  // Função para forçar atualização do cache
  const refreshSettings = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("organization_settings")
        .select("*")
        .single()

      if (error) throw error

      cachedSettings = data
      cacheTimestamp = Date.now()
      setSettings(data)
    } catch (err) {
      console.error("Erro ao atualizar configurações:", err)
      setError("Erro ao atualizar configurações")
    } finally {
      setLoading(false)
    }
  }

  return { settings, loading, error, refreshSettings, defaultSettings }
}

// Função utilitária para formatar o endereço completo
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

// Exportar os valores padrão para uso em server components
export { defaultSettings }
