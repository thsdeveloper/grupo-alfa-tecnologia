import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/Footer";

const siteUrl = "https://www.grupoalfatecnologia.com.br";

export const metadata: Metadata = {
  title:
    "Ata de Registro de Preço | Fibra Óptica, CFTV e Cabeamento para Órgãos Públicos",
  description:
    "Ata de Registro de Preço (ARP) do Grupo Alfa Tecnologia para contratação direta de serviços de fibra óptica, cabeamento estruturado, CFTV e infraestrutura de TI. Adesão rápida e segura conforme Lei 14.133/2021. Atendemos órgãos públicos em todo o Brasil.",
  keywords: [
    // Keywords principais
    "ata de registro de preço",
    "ata de registro de preços",
    "ARP",
    "adesão ata de registro de preço",
    "como aderir ata de registro de preço",
    "consultar ata de registro de preço",
    // Keywords específicas de serviços
    "ata de registro de preço fibra óptica",
    "ata de registro de preço cabeamento estruturado",
    "ata de registro de preço CFTV",
    "ata de registro de preço rede lógica",
    "ata de registro de preço câmeras",
    "ata de registro de preço segurança eletrônica",
    "ata de registro de preço controle de acesso",
    "ata de registro de preço infraestrutura TI",
    // Keywords de licitação
    "contratação direta órgãos públicos",
    "dispensa de licitação",
    "Lei 14.133/2021",
    "nova lei de licitações",
    "sistema de registro de preços",
    "SRP",
    "pregão eletrônico",
    "adesão ARP órgãos públicos",
    // Keywords de benefícios
    "contratação sem licitação",
    "preços homologados",
    "contratação rápida governo",
    // Keywords geográficas
    "ata de registro de preço Brasil",
    "ata de registro de preço federal",
    "ata de registro de preço estadual",
    "ata de registro de preço municipal",
  ],
  alternates: {
    canonical: `${siteUrl}/ata-registro-preco`,
  },
  openGraph: {
    title:
      "Ata de Registro de Preço | Fibra Óptica, CFTV e Cabeamento - Grupo Alfa Tecnologia",
    description:
      "Contrate serviços de infraestrutura de TI via Ata de Registro de Preço. Processo rápido, seguro e conforme a Lei 14.133/2021 para órgãos públicos.",
    url: `${siteUrl}/ata-registro-preco`,
    siteName: "Grupo Alfa Tecnologia",
    images: [
      {
        url: `${siteUrl}/og-ata-registro-preco.png`,
        width: 1200,
        height: 630,
        alt: "Ata de Registro de Preço - Grupo Alfa Tecnologia",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ata de Registro de Preço | Grupo Alfa Tecnologia",
    description:
      "Serviços de fibra óptica, cabeamento estruturado e CFTV via ARP para órgãos públicos.",
    images: [`${siteUrl}/og-ata-registro-preco.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD específico para a página de ARP
function ArpJsonLd() {
  const arpPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/ata-registro-preco#webpage`,
    url: `${siteUrl}/ata-registro-preco`,
    name: "Ata de Registro de Preço | Fibra Óptica, CFTV e Cabeamento para Órgãos Públicos",
    description:
      "Informações completas sobre a Ata de Registro de Preço do Grupo Alfa Tecnologia para contratação direta de serviços de infraestrutura de TI por órgãos públicos.",
    isPartOf: {
      "@id": `${siteUrl}/#website`,
    },
    about: {
      "@type": "Service",
      name: "Ata de Registro de Preço - Infraestrutura de TI",
    },
    mainEntity: {
      "@type": "Service",
      name: "Ata de Registro de Preço",
      provider: {
        "@type": "Organization",
        name: "Grupo Alfa Tecnologia",
      },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Ata de Registro de Preço",
          item: `${siteUrl}/ata-registro-preco`,
        },
      ],
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", ".speakable"],
    },
    inLanguage: "pt-BR",
  };

  const serviceOfferSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Serviços disponíveis na Ata de Registro de Preço",
    description:
      "Catálogo de serviços de infraestrutura de TI disponíveis para contratação via ARP",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Instalação de Fibra Óptica",
          description:
            "Serviço de instalação de fibra óptica por metro linear",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Fusão de Fibra Óptica",
          description: "Serviço de fusão de fibra óptica por unidade",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Certificação de Enlace Óptico",
          description: "Certificação de enlace óptico por ponto",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Instalação de Ponto de Rede Lógica Cat6",
          description: "Instalação de ponto de rede categoria 6",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Instalação de Ponto de Rede Lógica Cat6A",
          description: "Instalação de ponto de rede categoria 6A",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Instalação de Câmera CFTV IP",
          description: "Instalação de câmera de monitoramento IP",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Configuração de NVR/DVR",
          description:
            "Configuração de gravadores de vídeo digital e em rede",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Instalação de Controle de Acesso",
          description: "Instalação de sistemas de controle de acesso",
        },
      },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Como aderir à Ata de Registro de Preço do Grupo Alfa Tecnologia",
    description:
      "Guia passo a passo para órgãos públicos realizarem adesão à nossa ARP de serviços de infraestrutura de TI",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Consulta de Disponibilidade",
        text: "Entre em contato conosco para verificar a disponibilidade de saldo na Ata e os itens desejados.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Solicitação Formal",
        text: "O órgão interessado deve enviar ofício ao órgão gerenciador solicitando autorização para adesão.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Autorização",
        text: "Após autorização do órgão gerenciador e aceite do fornecedor, a adesão é formalizada.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Contratação",
        text: "Com a adesão aprovada, o órgão pode emitir a ordem de serviço e iniciar a execução.",
      },
    ],
    totalTime: "P7D",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(arpPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceOfferSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(howToSchema),
        }}
      />
    </>
  );
}

export default function AtaRegistroPrecoPage() {
  const itensAta = [
    {
      item: "01",
      descricao: "Instalação de Fibra Óptica (por metro)",
      unidade: "Metro",
    },
    {
      item: "02",
      descricao: "Fusão de Fibra Óptica",
      unidade: "Unidade",
    },
    {
      item: "03",
      descricao: "Certificação de Enlace Óptico",
      unidade: "Ponto",
    },
    {
      item: "04",
      descricao: "Instalação de Ponto de Rede Lógica Cat6",
      unidade: "Ponto",
    },
    {
      item: "05",
      descricao: "Instalação de Ponto de Rede Lógica Cat6A",
      unidade: "Ponto",
    },
    {
      item: "06",
      descricao: "Certificação de Ponto de Rede",
      unidade: "Ponto",
    },
    {
      item: "07",
      descricao: "Instalação de Câmera CFTV IP",
      unidade: "Unidade",
    },
    {
      item: "08",
      descricao: "Configuração de NVR/DVR",
      unidade: "Unidade",
    },
    {
      item: "09",
      descricao: "Instalação de Controle de Acesso",
      unidade: "Ponto",
    },
    {
      item: "10",
      descricao: "Passagem de Infraestrutura (eletroduto/eletrocalha)",
      unidade: "Metro",
    },
  ];

  const etapasAdesao = [
    {
      numero: "01",
      titulo: "Consulta de Disponibilidade",
      descricao:
        "Entre em contato conosco para verificar a disponibilidade de saldo na Ata e os itens desejados.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      numero: "02",
      titulo: "Solicitação Formal",
      descricao:
        "O órgão interessado deve enviar ofício ao órgão gerenciador solicitando autorização para adesão.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      numero: "03",
      titulo: "Autorização",
      descricao:
        "Após autorização do órgão gerenciador e aceite do fornecedor, a adesão é formalizada.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      numero: "04",
      titulo: "Contratação",
      descricao:
        "Com a adesão aprovada, o órgão pode emitir a ordem de serviço e iniciar a execução.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
  ];

  const documentos = [
    {
      nome: "Ata de Registro de Preço",
      descricao: "Documento completo da ARP vigente",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      nome: "Termo de Referência",
      descricao: "Especificações técnicas dos serviços",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      nome: "Modelo de Ofício para Adesão",
      descricao: "Template para solicitação de adesão",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      <ArpJsonLd />

      {/* Header Interno */}
      <header className="bg-[#211915] py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <nav
            className="flex items-center justify-between"
            aria-label="Navegação principal"
          >
            <Link
              href="/"
              className="flex items-center group"
              aria-label="Voltar para página inicial do Grupo Alfa Tecnologia"
            >
              <img
                src="/logo-alfa-telecon2.png"
                alt="Logo Grupo Alfa Tecnologia - Empresa de Infraestrutura de TI com Ata de Registro de Preço"
                className="h-16 md:h-20 w-auto transition-transform group-hover:scale-105"
                width={200}
                height={80}
              />
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-white/80 hover:text-[#b6c72c] transition-colors text-sm font-medium flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Voltar ao Site
              </Link>
              <a
                href="#contato-ata"
                className="hidden md:inline-flex bg-[#b6c72c] text-[#211915] px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-[#9eb025] transition-all hover:shadow-lg hover:shadow-[#b6c72c]/20"
              >
                Solicitar Adesão à ARP
              </a>
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section - Otimizado para SEO */}
        <section
          className="relative bg-gradient-to-br from-[#211915] via-[#2d231e] to-[#211915] py-20 lg:py-28 overflow-hidden"
          aria-labelledby="arp-hero-title"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5" aria-hidden="true">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b6c72c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block bg-[#b6c72c]/20 text-[#b6c72c] px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Contratação Simplificada para Órgãos Públicos
              </span>

              <h1
                id="arp-hero-title"
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-heading speakable"
              >
                Ata de Registro de <span className="text-[#b6c72c]">Preço</span>
              </h1>

              <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto mb-4 speakable">
                Contrate serviços de{" "}
                <strong className="text-white">fibra óptica</strong>,{" "}
                <strong className="text-white">cabeamento estruturado</strong>,{" "}
                <strong className="text-white">CFTV</strong> e{" "}
                <strong className="text-white">infraestrutura de TI</strong> de
                forma rápida e segura através da nossa ARP vigente.
              </p>

              <p className="text-white/60 text-base max-w-2xl mx-auto mb-8">
                Processo em conformidade com a{" "}
                <strong className="text-[#b6c72c]">Lei 14.133/2021</strong> -
                Dispensa de licitação para órgãos públicos federais, estaduais e
                municipais em todo o Brasil.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="#informacoes"
                  className="inline-flex items-center gap-2 bg-[#b6c72c] text-[#211915] px-8 py-4 rounded-full font-bold hover:bg-[#9eb025] transition-all hover:shadow-xl hover:shadow-[#b6c72c]/30"
                >
                  Ver Informações da ARP
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </a>
                <a
                  href="#contato-ata"
                  className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all"
                >
                  Solicitar Adesão
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Benefícios - Novo para SEO */}
        <section
          className="py-12 bg-[#b6c72c]"
          aria-labelledby="beneficios-arp"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <h2 id="beneficios-arp" className="sr-only">
              Benefícios da Ata de Registro de Preço
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4">
                <span className="text-3xl md:text-4xl font-bold text-[#211915] block">
                  Sem
                </span>
                <span className="text-[#211915]/70 text-sm md:text-base">
                  Nova Licitação
                </span>
              </div>
              <div className="p-4">
                <span className="text-3xl md:text-4xl font-bold text-[#211915] block">
                  100%
                </span>
                <span className="text-[#211915]/70 text-sm md:text-base">
                  Legal (Lei 14.133)
                </span>
              </div>
              <div className="p-4">
                <span className="text-3xl md:text-4xl font-bold text-[#211915] block">
                  26
                </span>
                <span className="text-[#211915]/70 text-sm md:text-base">
                  Estados Atendidos
                </span>
              </div>
              <div className="p-4">
                <span className="text-3xl md:text-4xl font-bold text-[#211915] block">
                  500+
                </span>
                <span className="text-[#211915]/70 text-sm md:text-base">
                  Projetos Executados
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Informações da ARP */}
        <section
          id="informacoes"
          className="py-20 bg-white"
          aria-labelledby="informacoes-arp-title"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Card Principal */}
              <article className="bg-gradient-to-br from-[#f8f9f3] to-white rounded-3xl p-8 lg:p-10 border border-[#b6c72c]/20 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-12 h-12 bg-[#b6c72c] rounded-xl flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <svg
                      className="w-6 h-6 text-[#211915]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h2
                    id="informacoes-arp-title"
                    className="text-2xl font-bold text-[#211915] font-heading"
                  >
                    Dados da Ata de Registro de Preço
                  </h2>
                </div>

                <dl className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-[#211915]/10">
                    <dt className="text-[#211915]/60 font-medium">
                      Número da Ata
                    </dt>
                    <dd className="text-[#211915] font-bold">ARP Nº XXX/2024</dd>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-[#211915]/10">
                    <dt className="text-[#211915]/60 font-medium">
                      Órgão Gerenciador
                    </dt>
                    <dd className="text-[#211915] font-bold">A definir</dd>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-[#211915]/10">
                    <dt className="text-[#211915]/60 font-medium">
                      Modalidade
                    </dt>
                    <dd className="text-[#211915] font-bold">
                      Pregão Eletrônico
                    </dd>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-[#211915]/10">
                    <dt className="text-[#211915]/60 font-medium">UASG</dt>
                    <dd className="text-[#211915] font-bold">A definir</dd>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-[#211915]/10">
                    <dt className="text-[#211915]/60 font-medium">Vigência</dt>
                    <dd className="text-[#211915] font-bold">12 meses</dd>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <dt className="text-[#211915]/60 font-medium">Status</dt>
                    <dd className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      <span
                        className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                        aria-hidden="true"
                      />
                      Vigente
                    </dd>
                  </div>
                </dl>

                <div
                  className="mt-8 p-4 bg-[#b6c72c]/10 rounded-xl"
                  role="note"
                >
                  <p className="text-[#211915]/70 text-sm">
                    <strong className="text-[#211915]">Importante:</strong> Para
                    informações atualizadas sobre saldo disponível e vigência,
                    entre em contato conosco através dos canais abaixo.
                  </p>
                </div>
              </article>

              {/* Informações Complementares */}
              <div className="space-y-6">
                <article className="bg-[#211915] rounded-3xl p-8 text-white">
                  <h3 className="text-xl font-bold mb-4 font-heading">
                    Por que aderir à nossa Ata de Registro de Preço?
                  </h3>
                  <ul className="space-y-3" role="list">
                    <li className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-[#b6c72c] flex-shrink-0 mt-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-white/80">
                        Preços já homologados e competitivos
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-[#b6c72c] flex-shrink-0 mt-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-white/80">
                        Dispensa de novo processo licitatório
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-[#b6c72c] flex-shrink-0 mt-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-white/80">
                        Conformidade com a Lei 14.133/2021 (Nova Lei de
                        Licitações)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-[#b6c72c] flex-shrink-0 mt-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-white/80">
                        Empresa com experiência comprovada no setor público
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-[#b6c72c] flex-shrink-0 mt-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-white/80">
                        Equipe técnica qualificada e certificada
                      </span>
                    </li>
                  </ul>
                </article>

                <article className="bg-gradient-to-r from-[#b6c72c]/10 to-[#b6c72c]/5 rounded-3xl p-8 border border-[#b6c72c]/20">
                  <h3 className="text-xl font-bold text-[#211915] mb-4 font-heading">
                    Base Legal - Sistema de Registro de Preços
                  </h3>
                  <p className="text-[#211915]/70 mb-4">
                    A adesão à Ata de Registro de Preços está prevista na{" "}
                    <strong className="text-[#211915]">
                      Lei nº 14.133/2021
                    </strong>{" "}
                    (Nova Lei de Licitações), que regulamenta o Sistema de
                    Registro de Preços (SRP) e permite que órgãos não
                    participantes realizem adesões mediante autorização.
                  </p>
                  <blockquote className="text-[#211915]/70 text-sm italic border-l-4 border-[#b6c72c] pl-4">
                    &ldquo;Art. 86. O órgão ou entidade gerenciadora poderá, nas
                    hipóteses previstas nesta Lei, autorizar a adesão à ata de
                    registro de preços por órgãos e entidades não
                    participantes.&rdquo;
                  </blockquote>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* Itens da ATA */}
        <section
          className="py-20 bg-[#f5f5f5]"
          aria-labelledby="itens-arp-title"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <header className="text-center mb-12">
              <span className="text-[#b6c72c] font-semibold text-sm tracking-widest uppercase mb-4 block">
                Serviços Disponíveis via ARP
              </span>
              <h2
                id="itens-arp-title"
                className="text-3xl md:text-4xl font-bold text-[#211915] font-heading speakable"
              >
                Itens da Ata de Registro de Preço
              </h2>
              <p className="text-[#211915]/60 mt-4 max-w-2xl mx-auto">
                Confira os principais serviços de{" "}
                <strong>fibra óptica, cabeamento estruturado e CFTV</strong>{" "}
                contemplados em nossa ARP. Para valores atualizados e
                disponibilidade, entre em contato.
              </p>
            </header>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full" role="table">
                  <caption className="sr-only">
                    Lista de serviços disponíveis na Ata de Registro de Preço
                  </caption>
                  <thead className="bg-[#211915] text-white">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-sm font-semibold"
                      >
                        Item
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-sm font-semibold"
                      >
                        Descrição do Serviço
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-center text-sm font-semibold"
                      >
                        Unidade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {itensAta.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-[#b6c72c]/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-10 h-10 bg-[#b6c72c]/10 text-[#b6c72c] font-bold rounded-lg">
                            {item.item}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#211915]">
                          {item.descricao}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-block bg-gray-100 text-[#211915]/70 px-3 py-1 rounded-full text-sm">
                            {item.unidade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-[#f8f9f3] p-6 text-center">
                <p className="text-[#211915]/60 text-sm">
                  * Esta é uma lista resumida. Para a lista completa de itens e
                  valores, solicite a Ata de Registro de Preço atualizada.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Etapas da Adesão */}
        <section
          className="py-20 bg-white"
          aria-labelledby="como-aderir-title"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <header className="text-center mb-12">
              <span className="text-[#b6c72c] font-semibold text-sm tracking-widest uppercase mb-4 block">
                Processo Simplificado
              </span>
              <h2
                id="como-aderir-title"
                className="text-3xl md:text-4xl font-bold text-[#211915] font-heading speakable"
              >
                Como Realizar a Adesão à Ata de Registro de Preço
              </h2>
              <p className="text-[#211915]/60 mt-4 max-w-2xl mx-auto">
                O processo de adesão à nossa ARP é simples e rápido. Siga as
                etapas abaixo para contratar serviços de infraestrutura de TI:
              </p>
            </header>

            <ol
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
              role="list"
            >
              {etapasAdesao.map((etapa, index) => (
                <li
                  key={index}
                  className="relative bg-gradient-to-br from-[#f8f9f3] to-white rounded-2xl p-6 border border-[#b6c72c]/10 hover:border-[#b6c72c]/30 transition-all hover:shadow-lg group"
                >
                  <div
                    className="absolute -top-4 -left-4 w-12 h-12 bg-[#b6c72c] rounded-xl flex items-center justify-center text-[#211915] font-bold text-xl shadow-lg"
                    aria-hidden="true"
                  >
                    {etapa.numero}
                  </div>
                  <div className="mt-4">
                    <div
                      className="w-12 h-12 bg-[#211915]/5 group-hover:bg-[#b6c72c]/20 rounded-xl flex items-center justify-center text-[#211915] mb-4 transition-all"
                      aria-hidden="true"
                    >
                      {etapa.icon}
                    </div>
                    <h3 className="text-lg font-bold text-[#211915] mb-2 font-heading">
                      {etapa.titulo}
                    </h3>
                    <p className="text-[#211915]/60 text-sm">
                      {etapa.descricao}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Documentos */}
        <section
          className="py-20 bg-[#211915]"
          aria-labelledby="documentos-title"
        >
          <div className="container mx-auto px-4 lg:px-8">
            <header className="text-center mb-12">
              <span className="text-[#b6c72c] font-semibold text-sm tracking-widest uppercase mb-4 block">
                Documentação da ARP
              </span>
              <h2
                id="documentos-title"
                className="text-3xl md:text-4xl font-bold text-white font-heading"
              >
                Documentos Disponíveis para Adesão
              </h2>
              <p className="text-white/60 mt-4 max-w-2xl mx-auto">
                Solicite os documentos necessários para realizar a adesão à
                nossa Ata de Registro de Preço.
              </p>
            </header>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {documentos.map((doc, index) => (
                <a
                  key={index}
                  href="#contato-ata"
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#b6c72c]/50 rounded-2xl p-6 transition-all group"
                >
                  <div
                    className="w-12 h-12 bg-[#b6c72c]/20 group-hover:bg-[#b6c72c] rounded-xl flex items-center justify-center text-[#b6c72c] group-hover:text-[#211915] mb-4 transition-all"
                    aria-hidden="true"
                  >
                    {doc.icon}
                  </div>
                  <h3 className="text-white font-bold mb-2">{doc.nome}</h3>
                  <p className="text-white/60 text-sm">{doc.descricao}</p>
                  <div className="mt-4 flex items-center gap-2 text-[#b6c72c] text-sm font-medium">
                    Solicitar documento
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA / Contato */}
        <section
          id="contato-ata"
          className="py-20 bg-gradient-to-br from-[#b6c72c] to-[#9eb025] relative overflow-hidden"
          aria-labelledby="contato-ata-title"
        >
          {/* Pattern */}
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23211915' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative">
            <div className="max-w-4xl mx-auto text-center">
              <h2
                id="contato-ata-title"
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#211915] mb-6 font-heading"
              >
                Pronto para Aderir à nossa Ata de Registro de Preço?
              </h2>
              <p className="text-[#211915]/70 text-lg mb-8 max-w-2xl mx-auto">
                Entre em contato com nossa equipe comercial para obter
                informações atualizadas sobre a ARP, verificar disponibilidade
                de saldo e iniciar o processo de adesão para{" "}
                <strong>fibra óptica, cabeamento estruturado ou CFTV</strong>.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
                <a
                  href="https://wa.me/5561986161961?text=Olá! Gostaria de informações sobre a Ata de Registro de Preço para contratação de serviços de infraestrutura de TI."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-[#211915] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#2d231e] transition-all hover:shadow-xl"
                  aria-label="Entrar em contato via WhatsApp para informações sobre Ata de Registro de Preço"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
                <a
                  href="mailto:comercial@grupoalfatelecom.com.br?subject=Solicitação de Informações - Ata de Registro de Preço - Infraestrutura de TI"
                  className="inline-flex items-center justify-center gap-3 bg-white text-[#211915] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:shadow-xl"
                  aria-label="Enviar e-mail para solicitar informações sobre Ata de Registro de Preço"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  E-mail
                </a>
              </div>

              <address className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left not-italic">
                <div className="bg-[#211915]/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <svg
                      className="w-5 h-5 text-[#211915]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="text-[#211915] font-bold">Telefone</span>
                  </div>
                  <a
                    href="tel:+556135225203"
                    className="text-[#211915]/70 hover:text-[#211915]"
                  >
                    (61) 3522-5203
                  </a>
                </div>

                <div className="bg-[#211915]/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <svg
                      className="w-5 h-5 text-[#211915]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span className="text-[#211915] font-bold">WhatsApp</span>
                  </div>
                  <a
                    href="https://wa.me/5561986161961"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#211915]/70 hover:text-[#211915]"
                  >
                    (61) 98616-1961
                  </a>
                </div>

                <div className="bg-[#211915]/10 backdrop-blur-sm rounded-2xl p-6 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center gap-3 mb-2">
                    <svg
                      className="w-5 h-5 text-[#211915]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-[#211915] font-bold">E-mail</span>
                  </div>
                  <a
                    href="mailto:comercial@grupoalfatelecom.com.br"
                    className="text-[#211915]/70 hover:text-[#211915] text-sm"
                  >
                    comercial@grupoalfatelecom.com.br
                  </a>
                </div>
              </address>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
