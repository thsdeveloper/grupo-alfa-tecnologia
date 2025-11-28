import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { servicos, getServicoBySlug, getAllServicosSlug } from "@/data/servicos";
import Footer from "@/components/Footer";
import { getOrganizationSettings } from "@/lib/services/organization";

const siteUrl = "https://www.grupoalfatecnologia.com.br";

// Gerar todas as páginas estáticas
export function generateStaticParams() {
  return getAllServicosSlug().map((slug) => ({ slug }));
}

// Metadados dinâmicos para SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const servico = getServicoBySlug(slug);

  if (!servico) {
    return {
      title: "Serviço não encontrado",
    };
  }

  return {
    title: `${servico.title} | Ata de Registro de Preço`,
    description: `${servico.longDescription.substring(0, 155)}... Serviço disponível via Ata de Registro de Preço para contratação direta por órgãos públicos.`,
    keywords: [
      ...servico.keywords,
      "ata de registro de preço",
      "órgãos públicos",
      "licitação",
      "contratação direta",
      "Lei 14.133/2021",
    ],
    alternates: {
      canonical: `${siteUrl}/servicos/${servico.slug}`,
    },
    openGraph: {
      title: `${servico.title} | Grupo Alfa Tecnologia`,
      description: `${servico.description} Disponível via Ata de Registro de Preço para órgãos públicos.`,
      url: `${siteUrl}/servicos/${servico.slug}`,
      siteName: "Grupo Alfa Tecnologia",
      locale: "pt_BR",
      type: "website",
      images: [
        {
          url: `${siteUrl}/og-servicos.png`,
          width: 1200,
          height: 630,
          alt: `${servico.title} - Grupo Alfa Tecnologia`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${servico.title} | Ata de Registro de Preço`,
      description: servico.description,
    },
  };
}

// JSON-LD Schema para a página de serviço
function ServiceJsonLd({ servico }: { servico: typeof servicos[0] }) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/servicos/${servico.slug}#service`,
    name: servico.title,
    description: servico.longDescription,
    provider: {
      "@type": "Organization",
      name: "Grupo Alfa Tecnologia",
      url: siteUrl,
    },
    serviceType: servico.shortTitle,
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    audience: {
      "@type": "Audience",
      audienceType: "Órgãos Públicos",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Serviços de ${servico.shortTitle} via Ata de Registro de Preço`,
      itemListElement: servico.features.map((feature, index) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: feature,
        },
        position: index + 1,
      })),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
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
        name: "Serviços",
        item: `${siteUrl}/#servicos`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: servico.shortTitle,
        item: `${siteUrl}/servicos/${servico.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

export default async function ServicoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const servico = getServicoBySlug(slug);
  const settings = await getOrganizationSettings();

  if (!servico) {
    notFound();
  }

  // Obter outros serviços para seção de relacionados
  const outrosServicos = servicos.filter((s) => s.slug !== servico.slug).slice(0, 3);

  return (
    <>
      <ServiceJsonLd servico={servico} />

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
                alt="Logo Grupo Alfa Tecnologia - Empresa de Infraestrutura de TI"
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
        <section className="relative bg-gradient-to-br from-[#211915] via-[#2d231e] to-[#211915] py-20 lg:py-28 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0" aria-hidden="true">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
              style={{
                backgroundImage: `url("${servico.backgroundImage}")`,
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
                <li>
                  <Link href="/#servicos" className="hover:text-[#b6c72c] transition-colors">
                    Serviços
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-[#b6c72c]">{servico.shortTitle}</li>
              </ol>
            </nav>

            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#b6c72c] rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-[#211915]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={servico.icon}
                    />
                  </svg>
                </div>
                <span className="inline-block bg-[#b6c72c]/20 text-[#b6c72c] px-4 py-2 rounded-full text-sm font-semibold">
                  Disponível via Ata de Registro de Preço
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-heading">
                {servico.title}
              </h1>

              <p className="text-white/70 text-lg md:text-xl mb-8">
                {servico.subtitle}
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#servico-detalhes"
                  className="inline-flex items-center gap-2 bg-[#b6c72c] text-[#211915] px-8 py-4 rounded-full font-bold hover:bg-[#9eb025] transition-all hover:shadow-xl hover:shadow-[#b6c72c]/30"
                >
                  Conhecer o Serviço
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
                  href="/ata-registro-preco"
                  className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all"
                >
                  Ver ARP
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Descrição Detalhada */}
        <section id="servico-detalhes" className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Texto */}
              <article>
                <span className="text-[#b6c72c] font-semibold text-sm tracking-widest uppercase mb-4 block">
                  Sobre o Serviço
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#211915] mb-6 font-heading">
                  {servico.shortTitle}
                </h2>
                <div className="prose prose-lg text-[#211915]/70">
                  <p>{servico.longDescription}</p>
                </div>

                {/* Features */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-[#211915] mb-4 font-heading">
                    O que oferecemos:
                  </h3>
                  <ul className="grid grid-cols-2 gap-3">
                    {servico.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-[#b6c72c] flex-shrink-0"
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
                        <span className="text-[#211915]/70">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>

              {/* Benefícios */}
              <div>
                <span className="text-[#b6c72c] font-semibold text-sm tracking-widest uppercase mb-4 block">
                  Benefícios
                </span>
                <h3 className="text-2xl font-bold text-[#211915] mb-6 font-heading">
                  Por que escolher nosso serviço?
                </h3>
                <div className="space-y-4">
                  {servico.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="bg-[#f5f5f5] rounded-2xl p-6 hover:bg-[#b6c72c]/10 transition-colors"
                    >
                      <h4 className="text-lg font-bold text-[#211915] mb-2">
                        {benefit.title}
                      </h4>
                      <p className="text-[#211915]/60">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Aplicações */}
        <section className="py-20 bg-[#f5f5f5]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[#b6c72c] font-semibold text-sm tracking-widest uppercase mb-4 block">
                Onde Aplicamos
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#211915] font-heading">
                Aplicações do Serviço
              </h2>
              <p className="text-[#211915]/60 mt-4 max-w-2xl mx-auto">
                Nossos serviços de {servico.shortTitle.toLowerCase()} são aplicados em
                diversos tipos de órgãos e instituições públicas.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {servico.applications.map((app, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-shadow"
                >
                  <span className="text-[#211915]/80 text-sm">{app}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seção ARP - DESTAQUE */}
        <section className="py-20 bg-[#211915]" id="ata-servico">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-[#b6c72c] font-semibold text-sm tracking-widest uppercase mb-4 block">
                  Contratação Simplificada
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-heading">
                  Contrate via <span className="text-[#b6c72c]">Ata de Registro de Preço</span>
                </h2>
                <p className="text-white/70 text-lg mb-6">
                  Nossos serviços de <strong className="text-white">{servico.shortTitle}</strong> estão
                  disponíveis através de <strong className="text-[#b6c72c]">Ata de Registro de Preço
                    vigente</strong>, permitindo que órgãos públicos realizem a contratação de forma
                  rápida, segura e sem necessidade de novo processo licitatório.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-white/80">
                    <svg
                      className="w-5 h-5 text-[#b6c72c] flex-shrink-0"
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
                    Dispensa de novo processo licitatório
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <svg
                      className="w-5 h-5 text-[#b6c72c] flex-shrink-0"
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
                    Preços já homologados e competitivos
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <svg
                      className="w-5 h-5 text-[#b6c72c] flex-shrink-0"
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
                    Conformidade com a Lei 14.133/2021
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <svg
                      className="w-5 h-5 text-[#b6c72c] flex-shrink-0"
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
                    Execução imediata após adesão
                  </li>
                </ul>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/ata-registro-preco"
                    className="inline-flex items-center gap-2 bg-[#b6c72c] text-[#211915] px-8 py-4 rounded-full font-bold hover:bg-[#9eb025] transition-all hover:shadow-xl hover:shadow-[#b6c72c]/30"
                  >
                    Ver Detalhes da ARP
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
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                  <a
                    href="https://wa.me/5561986161961?text=Olá! Gostaria de informações sobre a Ata de Registro de Preço para serviços de <?= servico.shortTitle ?>."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all"
                  >
                    Falar com Especialista
                  </a>
                </div>
              </div>

              {/* Itens da ARP relacionados */}
              {servico.arpItems.length > 0 && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                  <h3 className="text-xl font-bold text-white mb-6 font-heading">
                    Itens Disponíveis na ARP
                  </h3>
                  <div className="space-y-4">
                    {servico.arpItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 bg-white/5 rounded-xl p-4"
                      >
                        <span className="w-10 h-10 bg-[#b6c72c] rounded-lg flex items-center justify-center text-[#211915] font-bold text-sm">
                          {item.item}
                        </span>
                        <div className="flex-1">
                          <p className="text-white font-medium">{item.descricao}</p>
                          <span className="text-white/50 text-sm">
                            Unidade: {item.unidade}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-white/50 text-sm mt-6">
                    * Para valores e disponibilidade, consulte a ARP completa.
                  </p>
                </div>
              )}

              {servico.arpItems.length === 0 && (
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center">
                  <div className="w-16 h-16 bg-[#b6c72c]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-[#b6c72c]"
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
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 font-heading">
                    Consultoria Personalizada
                  </h3>
                  <p className="text-white/70 mb-6">
                    Este serviço pode ser contratado através de proposta personalizada
                    ou incluído em projetos via Ata de Registro de Preço.
                  </p>
                  <Link
                    href="/ata-registro-preco"
                    className="text-[#b6c72c] font-semibold hover:underline"
                  >
                    Consultar disponibilidade →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Contato */}
        <section className="py-20 bg-gradient-to-br from-[#b6c72c] to-[#9eb025]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-[#211915] mb-6 font-heading">
                Precisa de {servico.shortTitle}?
              </h2>
              <p className="text-[#211915]/70 text-lg mb-8">
                Entre em contato com nossa equipe comercial para obter um orçamento
                personalizado ou informações sobre a Ata de Registro de Preço.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href={`https://wa.me/5561986161961?text=Olá! Gostaria de informações sobre ${servico.shortTitle}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-[#211915] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#2d231e] transition-all hover:shadow-xl"
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
                  href={`mailto:comercial@grupoalfatelecom.com.br?subject=Orçamento - ${servico.shortTitle}`}
                  className="inline-flex items-center justify-center gap-3 bg-white text-[#211915] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:shadow-xl"
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
            </div>
          </div>
        </section>

        {/* Outros Serviços */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[#b6c72c] font-semibold text-sm tracking-widest uppercase mb-4 block">
                Conheça Também
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#211915] font-heading">
                Outros Serviços
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {outrosServicos.map((outroServico) => (
                <Link
                  key={outroServico.slug}
                  href={`/servicos/${outroServico.slug}`}
                  className="group bg-[#f5f5f5] rounded-2xl p-6 hover:bg-[#211915] transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-[#b6c72c]/10 group-hover:bg-[#b6c72c] rounded-xl flex items-center justify-center text-[#b6c72c] group-hover:text-[#211915] mb-4 transition-all">
                    <svg
                      className="w-7 h-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d={outroServico.icon}
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-[#211915] group-hover:text-white mb-2 font-heading">
                    {outroServico.shortTitle}
                  </h3>
                  <p className="text-[#211915]/60 group-hover:text-white/70 text-sm mb-4">
                    {outroServico.description}
                  </p>
                  <span className="inline-flex items-center text-[#b6c72c] font-semibold text-sm group-hover:text-white transition-colors">
                    Saiba mais
                    <svg
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
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
                  </span>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/#servicos"
                className="inline-flex items-center gap-2 text-[#211915] font-semibold hover:text-[#b6c72c] transition-colors"
              >
                Ver todos os serviços
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

