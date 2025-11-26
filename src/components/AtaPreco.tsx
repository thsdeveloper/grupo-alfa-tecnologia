import Link from "next/link";

export default function AtaPreco() {
  // Schema JSON-LD específico para esta seção
  const ataPrecoSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Ata de Registro de Preço - Grupo Alfa Tecnologia",
    description:
      "Serviços de infraestrutura de TI disponíveis via Ata de Registro de Preço para contratação direta por órgãos públicos. Inclui fibra óptica, cabeamento estruturado, CFTV e controle de acesso.",
    provider: {
      "@type": "Organization",
      name: "Grupo Alfa Tecnologia",
    },
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    audience: {
      "@type": "Audience",
      audienceType: "Órgãos Públicos",
    },
  };

  const beneficios = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Agilidade",
      description: "Contratação rápida sem necessidade de novo processo licitatório",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Segurança Jurídica",
      description: "Processo já validado conforme legislação vigente",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Economia",
      description: "Preços já negociados e vantajosos para a administração",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
      title: "Simplicidade",
      description: "Menos burocracia e documentação simplificada",
    },
  ];

  return (
    <section 
      id="ata" 
      className="py-20 lg:py-32 bg-white relative overflow-hidden"
      aria-labelledby="ata-registro-preco-title"
    >
      {/* JSON-LD Schema para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ataPrecoSchema),
        }}
      />
      
      {/* Elemento decorativo */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#b6c72c]/5 to-transparent" aria-hidden="true" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Lado esquerdo - Texto */}
          <article className="animate-fade-in-up">
            <span className="text-[#b6c72c] font-semibold text-sm tracking-widest uppercase mb-4 block">
              Contratação Simplificada para Órgãos Públicos
            </span>

            <h2 id="ata-registro-preco-title" className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#211915] mb-6 font-heading">
              Ata de Registro de <span className="text-[#b6c72c]">Preço</span>
            </h2>

            <p className="text-[#211915]/70 text-lg mb-6">
              O <strong className="text-[#211915]">Grupo Alfa Tecnologia</strong> possui{" "}
              <strong className="text-[#211915]">Ata de Registro de Preço (ARP) vigente</strong>,
              permitindo que órgãos públicos federais, estaduais e municipais realizem adesões de forma rápida,
              segura e econômica para serviços de <em>fibra óptica</em>, <em>cabeamento estruturado</em> e <em>CFTV</em>.
            </p>

            <p className="text-[#211915]/70 text-lg mb-8">
              Com a ARP, sua instituição pode contratar nossos serviços de infraestrutura de TI sem a
              necessidade de realizar um novo processo licitatório, garantindo
              agilidade e conformidade legal com a <strong className="text-[#211915]">Lei 14.133/2021</strong>.
            </p>

            {/* Destaque */}
            <div className="bg-gradient-to-r from-[#b6c72c]/10 to-[#b6c72c]/5 border-l-4 border-[#b6c72c] p-6 rounded-r-xl mb-8">
              <h3 className="text-xl font-bold text-[#211915] mb-2">
                Vantagens da Adesão à Ata de Registro de Preço
              </h3>
              <ul className="text-[#211915]/70 space-y-2" role="list">
                <li className="flex items-center gap-2">
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
                  Contratação direta sem licitação tradicional
                </li>
                <li className="flex items-center gap-2">
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
                <li className="flex items-center gap-2">
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
                  Processo rápido e desburocratizado conforme Lei 14.133
                </li>
                <li className="flex items-center gap-2">
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
                  Execução imediata após adesão aprovada
                </li>
              </ul>
            </div>

            {/* CTA */}
            <Link
              href="/ata-registro-preco"
              className="inline-flex items-center gap-2 bg-[#b6c72c] text-[#211915] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#9eb025] transition-all hover:shadow-xl hover:shadow-[#b6c72c]/30"
              title="Ver informações completas sobre a Ata de Registro de Preço para contratação de serviços de infraestrutura de TI"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Ver Detalhes da Ata de Registro de Preço
            </Link>
          </article>

          {/* Lado direito - Cards */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6 animate-fade-in-up delay-200">
            {beneficios.map((beneficio, index) => (
              <div
                key={index}
                className="bg-[#f5f5f5] rounded-2xl p-6 hover:bg-[#211915] group transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[#b6c72c]/10 group-hover:bg-[#b6c72c] rounded-xl flex items-center justify-center text-[#b6c72c] group-hover:text-[#211915] mb-4 transition-all">
                  {beneficio.icon}
                </div>
                <h3 className="text-lg font-bold text-[#211915] group-hover:text-white mb-2 font-heading">
                  {beneficio.title}
                </h3>
                <p className="text-[#211915]/60 group-hover:text-white/70 text-sm">
                  {beneficio.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
