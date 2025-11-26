import { MetadataRoute } from "next";
import { servicos } from "@/data/servicos";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.grupoalfatecnologia.com.br";

  // Páginas de serviços dinâmicas
  const servicoPages = servicos.map((servico) => ({
    url: `${baseUrl}/servicos/${servico.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ata-registro-preco`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95, // Alta prioridade - foco principal de SEO
    },
    // Páginas de serviços
    ...servicoPages,
    // Âncoras da página principal para SEO
    {
      url: `${baseUrl}/#sobre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#servicos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#portfolio`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#ata`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#contato`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
