import Link from "next/link";
import { servicos } from "@/data/servicos";

export default function Servicos() {
  return (
    <section id="servicos" className="py-20 lg:py-32 bg-[#211915] relative overflow-hidden">
      {/* Padrão de fundo */}
      <div
        className="absolute inset-0 opacity-5"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Cpath d='M0 40 L80 40 M40 0 L40 80' stroke='%23b6c72c' stroke-width='0.5' fill='none'/%3E%3Ccircle cx='40' cy='40' r='2' fill='%23b6c72c'/%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Header */}
        <header className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#b6c72c] font-semibold text-sm tracking-widest uppercase mb-4 block animate-fade-in-up">
            Nossos Serviços
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 font-heading animate-fade-in-up delay-100">
            Soluções Completas em{" "}
            <span className="text-[#b6c72c]">Infraestrutura de TI</span>
          </h2>
          <p className="text-white/70 text-lg animate-fade-in-up delay-200">
            Oferecemos um portfólio completo de serviços disponíveis via{" "}
            <strong className="text-[#b6c72c]">Ata de Registro de Preço</strong> para atender 
            todas as necessidades de infraestrutura tecnológica do seu órgão.
          </p>
        </header>

        {/* Grid de serviços */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {servicos.map((servico, index) => (
            <article
              key={servico.slug}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8 hover:bg-[#b6c72c]/10 hover:border-[#b6c72c]/30 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              {/* Ícone */}
              <div className="w-16 h-16 bg-[#b6c72c]/10 rounded-xl flex items-center justify-center text-[#b6c72c] mb-6 group-hover:bg-[#b6c72c] group-hover:text-[#211915] transition-all duration-300">
                <svg
                  className="w-8 h-8"
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

              {/* Título */}
              <h3 className="text-xl font-bold text-white mb-3 font-heading">
                {servico.shortTitle}
              </h3>

              {/* Descrição */}
              <p className="text-white/60 mb-6 leading-relaxed">
                {servico.description}
              </p>

              {/* Features tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {servico.features.slice(0, 4).map((feature, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 bg-white/5 text-white/70 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={`/servicos/${servico.slug}`}
                className="inline-flex items-center text-[#b6c72c] font-semibold text-sm group-hover:text-white transition-colors"
                title={`Saiba mais sobre ${servico.shortTitle} via Ata de Registro de Preço`}
              >
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
              </Link>
            </article>
          ))}
        </div>

        {/* Badge ARP */}
        <div className="text-center mt-12 animate-fade-in-up delay-500">
          <div className="inline-flex items-center gap-3 bg-[#b6c72c]/10 border border-[#b6c72c]/30 px-6 py-3 rounded-full">
            <svg
              className="w-5 h-5 text-[#b6c72c]"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-white font-medium">
              Todos os serviços disponíveis via Ata de Registro de Preço
            </span>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center mt-8 animate-fade-in-up delay-600">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ata-registro-preco"
              className="inline-flex items-center justify-center gap-2 bg-[#b6c72c] text-[#211915] px-8 py-4 rounded-full font-bold hover:bg-[#9eb025] transition-all hover:shadow-xl hover:shadow-[#b6c72c]/20"
            >
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
              Ver Ata de Registro de Preço
            </Link>
            <a
              href="#contato"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all"
            >
              Solicitar Orçamento
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
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
