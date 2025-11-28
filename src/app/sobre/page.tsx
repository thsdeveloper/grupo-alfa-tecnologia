import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { getOrganizationSettings } from "@/lib/services/organization";

const siteUrl = "https://www.grupoalfatecnologia.com.br";

export const metadata: Metadata = {
  title: "Sobre Nós | Grupo Alfa Tecnologia - História e Missão",
  description:
    "Conheça o Grupo Alfa Tecnologia: mais de 20 anos de experiência em infraestrutura de TI, com atuação em órgãos públicos de 26 estados brasileiros. Nossa história, missão, visão e valores.",
  keywords: [
    "Grupo Alfa Tecnologia",
    "empresa de infraestrutura de TI",
    "história da empresa",
    "missão visão valores",
    "José Orlando Monteiro Silva",
    "engenharia de telecomunicações",
    "órgãos públicos Brasil",
  ],
  alternates: {
    canonical: `${siteUrl}/sobre`,
  },
  openGraph: {
    title: "Sobre Nós | Grupo Alfa Tecnologia",
    description:
      "Conheça nossa história, missão e valores. Mais de 20 anos de experiência em infraestrutura de TI para órgãos públicos.",
    url: `${siteUrl}/sobre`,
    siteName: "Grupo Alfa Tecnologia",
    locale: "pt_BR",
    type: "website",
  },
};

// JSON-LD Schema para a página Sobre
function AboutJsonLd({ settings }: { settings: Awaited<ReturnType<typeof getOrganizationSettings>> }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Grupo Alfa Tecnologia",
    legalName: "Grupo Alfa Tecnologia LTDA",
    url: siteUrl,
    logo: settings.logo_url || `${siteUrl}/logo-alfa-telecon2.png`,
    foundingDate: "2018",
    founders: [
      {
        "@type": "Person",
        name: "José Orlando Monteiro Silva",
        jobTitle: "Administrador e Responsável Técnico",
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rua QN 7 Conjunto 5 Lote 15",
      addressLocality: "Brasília",
      addressRegion: "DF",
      postalCode: "71805-705",
      addressCountry: "BR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55-61-3522-5203",
      contactType: "customer service",
      areaServed: "BR",
      availableLanguage: "Portuguese",
    },
    sameAs: [],
    description:
      "Empresa especializada em infraestrutura de TI com Ata de Registro de Preço vigente para contratação direta por órgãos públicos.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
  );
}

export default async function SobrePage() {
  const settings = await getOrganizationSettings();
  const stats = [
    { number: "20+", label: "Anos de Experiência", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { number: "8+", label: "Anos no Setor Público", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
    { number: "26", label: "Estados Atendidos", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { number: "500+", label: "Projetos Executados", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
  ];

  const timeline = [
    {
      year: "2000",
      title: "Início da Jornada",
      description: "José Orlando Monteiro Silva inicia sua trajetória na área de tecnologia, passando por todos os cargos técnicos até se tornar engenheiro responsável por grandes projetos.",
    },
    {
      year: "2013",
      title: "Fundação da Alfap3",
      description: "Após 13 anos de experiência consolidada, é fundada a Alfap3 Tecnologia, atuando inicialmente para empresas privadas com foco em infraestrutura de TI.",
    },
    {
      year: "2018",
      title: "Migração para o Setor Público",
      description: "A empresa migra totalmente para o segmento público, executando projetos via licitações e adesões a Atas de Registro de Preço.",
    },
    {
      year: "2020",
      title: "Expansão Nacional",
      description: "Início da atuação em projetos de grande porte em todo o Brasil, estabelecendo presença em todos os estados da federação.",
    },
    {
      year: "2024",
      title: "Grupo Alfa Tecnologia",
      description: "Consolidação como referência em infraestrutura de TI para órgãos públicos, com mais de 500 projetos executados e ARP vigente.",
    },
  ];

  const valores = [
    {
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      title: "Integridade",
      description: "Atuamos com transparência e ética em todas as relações, cumprindo rigorosamente os requisitos legais das contratações públicas.",
    },
    {
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      title: "Excelência",
      description: "Buscamos a máxima qualidade em cada projeto, utilizando as melhores práticas e tecnologias disponíveis no mercado.",
    },
    {
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      title: "Compromisso",
      description: "Honramos cada contrato assumido, entregando projetos dentro dos prazos e especificações técnicas acordadas.",
    },
    {
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
      title: "Inovação",
      description: "Investimos continuamente em novas tecnologias e metodologias para oferecer soluções modernas e eficientes.",
    },
  ];

  const diferenciais = [
    {
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      title: "Ata de Registro de Preço Vigente",
      description: "Contratação direta sem necessidade de novo processo licitatório, em conformidade com a Lei 14.133/2021.",
    },
    {
      icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Atuação em Todo o Brasil",
      description: "Equipes capacitadas e estrutura logística para atender projetos em qualquer estado brasileiro.",
    },
    {
      icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
      title: "Equipe Técnica Especializada",
      description: "Profissionais certificados com experiência comprovada em projetos de grande complexidade.",
    },
    {
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Cumprimento de Prazos",
      description: "Histórico de entregas pontuais, mesmo em projetos de longa distância e condições adversas.",
    },
  ];

  return (
    <>
      <AboutJsonLd settings={settings} />

      {/* Header */}
      <header className="bg-[#211915] py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <nav
            className="flex items-center justify-between"
            aria-label="Navegação principal"
          >
            <Link
              href="/"
              className="flex items-center group"
              aria-label="Voltar para página inicial"
            >
              <img
                src={settings.logo_url || "/logo-alfa-telecon2.png"}
                alt="Logo Grupo Alfa Tecnologia"
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
              <Link
                href="/ata-registro-preco"
                className="hidden md:inline-flex bg-[#b6c72c] text-[#211915] px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-[#9eb025] transition-all hover:shadow-lg hover:shadow-[#b6c72c]/20"
              >
                Ver Ata de Registro de Preço
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#211915] via-[#2d231e] to-[#211915] py-24 lg:py-32 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10" aria-hidden="true">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0 50 L100 50 M50 0 L50 100' stroke='%23b6c72c' stroke-width='0.5' fill='none'/%3E%3Ccircle cx='50' cy='50' r='8' fill='none' stroke='%23b6c72c' stroke-width='0.5'/%3E%3Ccircle cx='0' cy='0' r='4' fill='%23b6c72c' opacity='0.3'/%3E%3Ccircle cx='100' cy='0' r='4' fill='%23b6c72c' opacity='0.3'/%3E%3Ccircle cx='0' cy='100' r='4' fill='%23b6c72c' opacity='0.3'/%3E%3Ccircle cx='100' cy='100' r='4' fill='%23b6c72c' opacity='0.3'/%3E%3C/svg%3E")`,
                backgroundSize: "100px 100px",
              }}
            />
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative">
            {/* Breadcrumb */}
            <nav className="mb-8" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-white/60">
                <li>
                  <Link href="/" className="hover:text-[#b6c72c] transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-[#b6c72c]">Sobre Nós</li>
              </ol>
            </nav>

            <div className="max-w-4xl">
              <span className="inline-block bg-[#b6c72c]/20 text-[#b6c72c] px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Conheça Nossa História
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-heading">
                Grupo Alfa <span className="text-[#b6c72c]">Tecnologia</span>
              </h1>

              <p className="text-white/70 text-lg md:text-xl mb-8 max-w-3xl">
                Somos uma empresa especializada em infraestrutura de TI, com mais de 20 anos 
                de experiência e atuação consolidada em órgãos públicos de todo o Brasil. 
                Nossa missão é conectar o país através de soluções tecnológicas de excelência.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#nossa-historia"
                  className="inline-flex items-center gap-2 bg-[#b6c72c] text-[#211915] px-8 py-4 rounded-full font-bold hover:bg-[#9eb025] transition-all hover:shadow-xl hover:shadow-[#b6c72c]/30"
                >
                  Nossa História
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
                <Link
                  href="/#contato"
                  className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all"
                >
                  Fale Conosco
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white relative -mt-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl shadow-black/5 border border-gray-100 text-center hover:shadow-2xl hover:shadow-[#b6c72c]/10 transition-all hover:-translate-y-1"
                >
                  <div className="w-14 h-14 bg-[#b6c72c]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-7 h-7 text-[#b6c72c]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d={stat.icon}
                      />
                    </svg>
                  </div>
                  <span className="text-[#211915] text-3xl lg:text-4xl font-bold block mb-1">
                    {stat.number}
                  </span>
                  <span className="text-[#211915]/60 text-sm">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nossa História */}
        <section id="nossa-historia" className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Texto */}
              <div>
                <span className="text-[#b6c72c] font-semibold text-sm tracking-widest uppercase mb-4 block">
                  Nossa História
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#211915] mb-6 font-heading">
                  Uma Trajetória de <span className="text-[#b6c72c]">Excelência</span>
                </h2>
                
                <div className="space-y-4 text-[#211915]/70 text-lg">
                  <p>
                    O <strong className="text-[#211915]">Grupo Alfa Tecnologia</strong> nasceu
                    através de seu Administrador e Responsável Técnico{" "}
                    <strong className="text-[#211915]">José Orlando Monteiro Silva</strong>,
                    profissional que iniciou na área de tecnologia nos anos 2000,
                    passando por todos os cargos técnicos até se tornar engenheiro responsável
                    por grandes projetos de infraestrutura.
                  </p>

                  <p>
                    Após mais de 15 anos de experiência acumulada em empresas líderes do setor, 
                    foi fundada a Alfap3 Tecnologia, que durante 5 anos atendeu empresas privadas 
                    com excelência. Em 2018, identificando uma grande demanda no setor público, 
                    a empresa migrou totalmente para este segmento.
                  </p>

                  <p>
                    Hoje, o <strong className="text-[#211915]">Grupo Alfa Tecnologia</strong> é 
                    referência em projetos de infraestrutura de TI para órgãos públicos, tendo 
                    atuado em quase todos os estados brasileiros, realizando projetos de alta 
                    complexidade, longas distâncias e sob condições extremas.
                  </p>
                </div>

                {/* Destaque */}
                <div className="mt-8 p-6 bg-gradient-to-r from-[#b6c72c]/10 to-transparent border-l-4 border-[#b6c72c] rounded-r-xl">
                  <p className="text-xl font-semibold text-[#211915]">
                    &ldquo;Nossa missão é conectar o Brasil através de soluções tecnológicas 
                    que transformam a infraestrutura pública.&rdquo;
                  </p>
                  <span className="text-[#211915]/60 text-sm mt-2 block">
                    — José Orlando Monteiro Silva, Fundador
                  </span>
                </div>
              </div>

              {/* Card Visual */}
              <div className="relative">
                <div className="bg-[#211915] rounded-3xl p-8 lg:p-12 relative overflow-hidden">
                  {/* Padrão de fundo */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Cpath d='M0 30 L60 30 M30 0 L30 60' stroke='%23b6c72c' stroke-width='0.5' fill='none'/%3E%3Ccircle cx='30' cy='30' r='4' fill='none' stroke='%23b6c72c' stroke-width='0.5'/%3E%3C/svg%3E")`,
                      backgroundSize: "60px 60px",
                    }}
                  />

                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-[#b6c72c] rounded-2xl flex items-center justify-center mb-6">
                      <svg
                        className="w-10 h-10 text-[#211915]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>

                    <h3 className="text-white text-2xl font-bold mb-2 font-heading">
                      José Orlando Monteiro Silva
                    </h3>
                    <p className="text-[#b6c72c] font-medium mb-4">
                      Administrador & Responsável Técnico
                    </p>

                    <p className="text-white/70 mb-6">
                      Engenheiro com mais de 20 anos de experiência em projetos de 
                      infraestrutura de TI, especializado em soluções para o setor público.
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-white/80">
                        <svg className="w-5 h-5 text-[#b6c72c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Experiência desde 2000</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/80">
                        <svg className="w-5 h-5 text-[#b6c72c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>500+ projetos executados</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/80">
                        <svg className="w-5 h-5 text-[#b6c72c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Atuação em 26 estados</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badge flutuante */}
                <div className="absolute -bottom-6 -left-6 bg-[#b6c72c] rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#211915] rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#b6c72c]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-[#211915] font-bold block">Excelência</span>
                      <span className="text-[#211915]/70 text-sm">Comprovada</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 lg:py-28 bg-[#f8f8f8]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#b6c72c] font-semibold text-sm tracking-widest uppercase mb-4 block">
                Nossa Evolução
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#211915] font-heading">
                Linha do Tempo
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              {timeline.map((item, index) => (
                <div key={index} className="relative flex gap-6 lg:gap-10 pb-12 last:pb-0">
                  {/* Linha vertical */}
                  {index !== timeline.length - 1 && (
                    <div className="absolute left-6 top-14 w-0.5 h-full bg-[#b6c72c]/30" />
                  )}
                  
                  {/* Círculo com ano */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-[#b6c72c] rounded-full flex items-center justify-center text-[#211915] font-bold text-sm shadow-lg shadow-[#b6c72c]/30">
                      {item.year.slice(2)}
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg shadow-black/5 flex-1 hover:shadow-xl transition-shadow">
                    <span className="text-[#b6c72c] font-bold text-lg">{item.year}</span>
                    <h3 className="text-xl font-bold text-[#211915] mt-1 mb-3 font-heading">
                      {item.title}
                    </h3>
                    <p className="text-[#211915]/70">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Missão, Visão e Valores */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Missão e Visão */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* Missão */}
              <div className="bg-gradient-to-br from-[#211915] to-[#2d231e] rounded-3xl p-8 lg:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#b6c72c]/10 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="w-14 h-14 bg-[#b6c72c] rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-7 h-7 text-[#211915]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 font-heading">Nossa Missão</h3>
                  <p className="text-white/70 text-lg">
                    Conectar o Brasil através de soluções de infraestrutura de TI de alta qualidade, 
                    contribuindo para a modernização e eficiência dos órgãos públicos, sempre com 
                    integridade, excelência técnica e compromisso com os prazos.
                  </p>
                </div>
              </div>

              {/* Visão */}
              <div className="bg-gradient-to-br from-[#b6c72c] to-[#9eb025] rounded-3xl p-8 lg:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                <div className="relative">
                  <div className="w-14 h-14 bg-[#211915] rounded-xl flex items-center justify-center mb-6">
                    <svg className="w-7 h-7 text-[#b6c72c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#211915] mb-4 font-heading">Nossa Visão</h3>
                  <p className="text-[#211915]/80 text-lg">
                    Ser a empresa referência em infraestrutura de TI para o setor público brasileiro, 
                    reconhecida pela qualidade dos projetos, capacidade técnica da equipe e 
                    relacionamento de confiança com nossos clientes.
                  </p>
                </div>
              </div>
            </div>

            {/* Valores */}
            <div className="text-center mb-12">
              <span className="text-[#b6c72c] font-semibold text-sm tracking-widest uppercase mb-4 block">
                Princípios que nos guiam
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#211915] font-heading">
                Nossos Valores
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {valores.map((valor, index) => (
                <div
                  key={index}
                  className="bg-[#f8f8f8] rounded-2xl p-6 hover:bg-[#211915] group transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-[#b6c72c]/10 group-hover:bg-[#b6c72c] rounded-xl flex items-center justify-center mb-4 transition-colors">
                    <svg
                      className="w-7 h-7 text-[#b6c72c] group-hover:text-[#211915] transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d={valor.icon}
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-[#211915] group-hover:text-white mb-2 font-heading transition-colors">
                    {valor.title}
                  </h3>
                  <p className="text-[#211915]/60 group-hover:text-white/70 text-sm transition-colors">
                    {valor.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Diferenciais */}
        <section className="py-20 lg:py-28 bg-[#211915]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-[#b6c72c] font-semibold text-sm tracking-widest uppercase mb-4 block">
                Por que nos escolher
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-heading">
                Nossos Diferenciais
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {diferenciais.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-[#b6c72c] rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-7 h-7 text-[#211915]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d={item.icon}
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 font-heading">
                        {item.title}
                      </h3>
                      <p className="text-white/60">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 lg:py-28 bg-gradient-to-br from-[#b6c72c] to-[#9eb025]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#211915] mb-6 font-heading">
                Vamos Construir o Futuro Juntos?
              </h2>
              <p className="text-[#211915]/70 text-lg mb-10 max-w-2xl mx-auto">
                Entre em contato com nossa equipe e descubra como podemos ajudar 
                seu órgão público com soluções de infraestrutura de TI de alta qualidade, 
                com a praticidade da contratação via Ata de Registro de Preço.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="https://wa.me/5561986161961?text=Olá! Gostaria de informações sobre os serviços do Grupo Alfa Tecnologia."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-[#211915] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#2d231e] transition-all hover:shadow-xl"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Fale pelo WhatsApp
                </a>
                <Link
                  href="/ata-registro-preco"
                  className="inline-flex items-center justify-center gap-3 bg-white text-[#211915] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:shadow-xl"
                >
                  Ver Ata de Registro de Preço
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

