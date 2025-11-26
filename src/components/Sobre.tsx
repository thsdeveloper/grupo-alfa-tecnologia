import Link from "next/link";

export default function Sobre() {
  const stats = [
    { number: "20+", label: "Anos de experiência" },
    { number: "8+", label: "Anos em órgãos públicos" },
    { number: "26", label: "Estados atendidos" },
    { number: "500+", label: "Projetos executados" },
  ];

  return (
    <section id="sobre" className="py-20 lg:py-32 bg-white relative overflow-hidden">
      {/* Elemento decorativo */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#b6c72c]/5 to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Lado esquerdo - Imagem/Visual */}
          <div className="relative animate-fade-in-up">
            <div className="relative">
              {/* Card principal */}
              <div className="bg-[#211915] rounded-3xl p-8 lg:p-12 relative overflow-hidden">
                {/* Padrão de circuito */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Cpath d='M0 30 L60 30 M30 0 L30 60' stroke='%23b6c72c' stroke-width='0.5' fill='none'/%3E%3Ccircle cx='30' cy='30' r='4' fill='none' stroke='%23b6c72c' stroke-width='0.5'/%3E%3C/svg%3E")`,
                    backgroundSize: "60px 60px",
                  }}
                />

                <div className="relative z-10">
                  {/* Ícone */}
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
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                  </div>

                  <h3 className="text-white text-2xl font-bold mb-4 font-heading">
                    Engenharia de Excelência
                  </h3>

                  <p className="text-white/70 mb-6">
                    Projetos de alta complexidade executados com precisão,
                    qualidade e dentro dos prazos estabelecidos.
                  </p>

                  {/* Stats mini */}
                  <div className="grid grid-cols-2 gap-4">
                    {stats.slice(0, 2).map((stat, index) => (
                      <div key={index} className="text-center p-4 bg-white/5 rounded-xl">
                        <span className="text-[#b6c72c] text-3xl font-bold block">
                          {stat.number}
                        </span>
                        <span className="text-white/60 text-sm">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card flutuante */}
              <div className="absolute -bottom-6 -right-6 bg-[#b6c72c] rounded-2xl p-6 shadow-xl animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#211915] rounded-full flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-[#b6c72c]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[#211915] font-bold text-lg block">
                      Qualidade
                    </span>
                    <span className="text-[#211915]/70 text-sm">Garantida</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lado direito - Texto */}
          <div className="animate-fade-in-up delay-200">
            <span className="text-[#b6c72c] font-semibold text-sm tracking-widest uppercase mb-4 block">
              Sobre Nós
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#211915] mb-6 font-heading">
              Grupo Alfa Tecnologia
            </h2>

            <div className="space-y-4 text-[#211915]/70 text-lg">
              <p>
                O <strong className="text-[#211915]">Grupo Alfa Tecnologia</strong> nasceu
                através de seu Administrador e Responsável Técnico{" "}
                <strong className="text-[#211915]">José Orlando Monteiro Silva</strong>,
                profissional que iniciou na área de tecnologia nos anos 2000,
                passando por todos os cargos até se tornar engenheiro responsável
                por grandes projetos.
              </p>

              <p>
                Após 15 anos de experiência, fundou a Alfap3 Tecnologia, atuando
                por 5 anos para empresas privadas. Desde 2018 migrou totalmente
                para o segmento público, executando projetos via licitações e
                adesões.
              </p>

              <p>
                Já atuou em quase todos os estados brasileiros, realizando
                projetos de alta complexidade, longas distâncias e condições
                extremas.
              </p>
            </div>

            {/* Destaque */}
            <div className="mt-8 p-6 bg-gradient-to-r from-[#b6c72c]/10 to-transparent border-l-4 border-[#b6c72c] rounded-r-xl">
              <p className="text-xl font-semibold text-[#211915]">
                Mais de 8 anos de atuação em órgãos públicos do Brasil inteiro.
              </p>
            </div>

            {/* Link para página completa */}
            <div className="mt-6">
              <Link
                href="/sobre"
                className="inline-flex items-center gap-2 text-[#b6c72c] font-semibold hover:text-[#9eb025] transition-colors group"
              >
                Conheça nossa história completa
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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

            {/* Stats horizontal */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-4 rounded-xl bg-[#f5f5f5] hover:bg-[#b6c72c]/10 transition-colors"
                >
                  <span className="text-[#b6c72c] text-2xl md:text-3xl font-bold block">
                    {stat.number}
                  </span>
                  <span className="text-[#211915]/60 text-xs md:text-sm">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
