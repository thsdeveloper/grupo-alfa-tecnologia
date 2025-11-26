export default function JsonLdSchema() {
  const siteUrl = "https://www.grupoalfatecnologia.com.br";

  // Schema da Organização
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Grupo Alfa Tecnologia",
    alternateName: ["Alfa Telecon", "Grupo Alfa", "Alfap3 Tecnologia"],
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/logo-alfa-telecon2.png`,
      width: 300,
      height: 100,
    },
    image: `${siteUrl}/logo-alfa-telecon2.png`,
    description:
      "Empresa especializada em infraestrutura de TI para órgãos públicos com Ata de Registro de Preço vigente. Serviços de fibra óptica, cabeamento estruturado, CFTV e segurança eletrônica.",
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
      addressCountry: "BR",
      addressRegion: "DF",
      addressLocality: "Brasília",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -15.7801,
      longitude: -47.9292,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+55-61-3522-5203",
        contactType: "sales",
        areaServed: "BR",
        availableLanguage: "Portuguese",
      },
      {
        "@type": "ContactPoint",
        telephone: "+55-61-98616-1961",
        contactType: "customer service",
        areaServed: "BR",
        availableLanguage: "Portuguese",
        contactOption: "WhatsApp",
      },
    ],
    email: "comercial@grupoalfatelecom.com.br",
    sameAs: [],
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    knowsAbout: [
      "Ata de Registro de Preço",
      "Fibra Óptica",
      "Cabeamento Estruturado",
      "CFTV",
      "Segurança Eletrônica",
      "Infraestrutura de TI",
      "Licitações Públicas",
      "Lei 14.133/2021",
    ],
    slogan:
      "Soluções em Tecnologia e Infraestrutura para Órgãos Públicos em Todo o Brasil",
  };

  // Schema de LocalBusiness
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#localbusiness`,
    name: "Grupo Alfa Tecnologia",
    image: `${siteUrl}/logo-alfa-telecon2.png`,
    telephone: "+55-61-3522-5203",
    email: "comercial@grupoalfatelecom.com.br",
    url: siteUrl,
    address: {
      "@type": "PostalAddress",
      addressCountry: "BR",
      addressRegion: "DF",
      addressLocality: "Brasília",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -15.7801,
      longitude: -47.9292,
    },
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
  };

  // Schema dos Serviços - Focado em ARP
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/#service-arp`,
    name: "Ata de Registro de Preço - Serviços de Infraestrutura de TI",
    alternateName: [
      "ARP Fibra Óptica",
      "ARP Cabeamento Estruturado",
      "ARP CFTV",
      "Ata de Registro de Preço Tecnologia",
    ],
    description:
      "Serviços de infraestrutura de TI disponíveis via Ata de Registro de Preço para contratação direta por órgãos públicos. Inclui instalação de fibra óptica, cabeamento estruturado, CFTV, controle de acesso e mais.",
    provider: {
      "@type": "Organization",
      name: "Grupo Alfa Tecnologia",
      url: siteUrl,
    },
    serviceType: [
      "Instalação de Fibra Óptica",
      "Fusão de Fibra Óptica",
      "Cabeamento Estruturado Cat6/Cat6A",
      "Instalação de CFTV",
      "Controle de Acesso",
      "Infraestrutura de Rede",
    ],
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    audience: {
      "@type": "Audience",
      audienceType: "Órgãos Públicos",
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "BRL",
      },
    },
    url: `${siteUrl}/ata-registro-preco`,
  };

  // Schema específico para Fibra Óptica
  const fiberOpticServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/#service-fibra`,
    name: "Instalação de Fibra Óptica via Ata de Registro de Preço",
    description:
      "Serviço de instalação, fusão e certificação de fibra óptica para órgãos públicos. Disponível via Ata de Registro de Preço para contratação direta sem licitação.",
    provider: {
      "@type": "Organization",
      name: "Grupo Alfa Tecnologia",
    },
    serviceType: "Instalação de Fibra Óptica",
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
  };

  // Schema para Cabeamento Estruturado
  const cablingServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/#service-cabeamento`,
    name: "Cabeamento Estruturado via Ata de Registro de Preço",
    description:
      "Instalação de cabeamento estruturado categoria 6 e 6A para órgãos públicos. Contratação simplificada via Ata de Registro de Preço.",
    provider: {
      "@type": "Organization",
      name: "Grupo Alfa Tecnologia",
    },
    serviceType: "Cabeamento Estruturado",
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
  };

  // Schema para CFTV
  const cctvServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/#service-cftv`,
    name: "CFTV e Segurança Eletrônica via Ata de Registro de Preço",
    description:
      "Instalação de sistemas de CFTV, câmeras IP, DVR/NVR e monitoramento para órgãos públicos. Disponível via Ata de Registro de Preço.",
    provider: {
      "@type": "Organization",
      name: "Grupo Alfa Tecnologia",
    },
    serviceType: "Instalação de CFTV",
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
  };

  // Schema WebSite
  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Grupo Alfa Tecnologia",
    description:
      "Site oficial do Grupo Alfa Tecnologia - Ata de Registro de Preço para serviços de infraestrutura de TI",
    publisher: {
      "@type": "Organization",
      name: "Grupo Alfa Tecnologia",
    },
    inLanguage: "pt-BR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/?s={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // Schema WebPage principal
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}/#webpage`,
    url: siteUrl,
    name: "Grupo Alfa Tecnologia | Ata de Registro de Preço - Fibra Óptica, CFTV e Cabeamento",
    description:
      "Empresa com Ata de Registro de Preço para contratação direta por órgãos públicos. Serviços de fibra óptica, cabeamento estruturado, CFTV e infraestrutura de TI.",
    isPartOf: {
      "@id": `${siteUrl}/#website`,
    },
    about: {
      "@id": `${siteUrl}/#organization`,
    },
    inLanguage: "pt-BR",
    mainEntity: {
      "@id": `${siteUrl}/#organization`,
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
      ],
    },
  };

  // Schema FAQPage para perguntas frequentes sobre ARP
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "O que é Ata de Registro de Preço?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A Ata de Registro de Preço (ARP) é um documento vinculativo que formaliza preços registrados para contratação futura de bens e serviços pela Administração Pública, permitindo adesões de forma rápida e sem necessidade de novo processo licitatório.",
        },
      },
      {
        "@type": "Question",
        name: "Como aderir a uma Ata de Registro de Preço?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Para aderir à ARP, o órgão interessado deve: 1) Verificar a disponibilidade de saldo; 2) Enviar ofício ao órgão gerenciador solicitando autorização; 3) Aguardar autorização do órgão gerenciador e aceite do fornecedor; 4) Formalizar a contratação e emitir ordem de serviço.",
        },
      },
      {
        "@type": "Question",
        name: "Quais serviços estão disponíveis na Ata de Registro de Preço do Grupo Alfa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nossa ARP inclui: instalação de fibra óptica, fusão de fibra óptica, certificação de enlace óptico, instalação de ponto de rede lógica Cat6 e Cat6A, instalação de câmera CFTV IP, configuração de NVR/DVR, instalação de controle de acesso e passagem de infraestrutura.",
        },
      },
      {
        "@type": "Question",
        name: "Quais as vantagens de contratar via Ata de Registro de Preço?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "As principais vantagens são: agilidade na contratação sem novo processo licitatório, preços já homologados e competitivos, segurança jurídica com processo validado, conformidade com a Lei 14.133/2021, e economia de tempo e recursos para a administração pública.",
        },
      },
      {
        "@type": "Question",
        name: "O Grupo Alfa Tecnologia atende em todo o Brasil?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sim, o Grupo Alfa Tecnologia atende órgãos públicos em todos os 26 estados brasileiros e no Distrito Federal, com mais de 500 projetos executados em todo o território nacional.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(fiberOpticServiceSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(cablingServiceSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(cctvServiceSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webSiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </>
  );
}

