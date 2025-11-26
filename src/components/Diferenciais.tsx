const diferenciais = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
    title: "Especialização em Órgãos Públicos",
    description:
      "Atuação focada exclusivamente no segmento público, com profundo conhecimento das necessidades, processos e exigências deste setor.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
        />
      </svg>
    ),
    title: "Engenheiro com 20+ Anos",
    description:
      "Responsável técnico com mais de duas décadas de experiência, tendo passado por todos os cargos da área até liderar grandes projetos.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: "Projetos de Alta Complexidade",
    description:
      "Capacidade técnica para executar projetos complexos envolvendo longas distâncias, grandes volumes e condições adversas.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Execuções Rápidas",
    description:
      "Equipe preparada para mobilização ágil e execução dentro dos prazos, mesmo em localidades remotas do território nacional.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    title: "Equipe Altamente Capacitada",
    description:
      "Profissionais treinados e certificados, com experiência comprovada em projetos de infraestrutura de TI.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
        />
      </svg>
    ),
    title: "Infraestrutura Completa",
    description:
      "Estrutura própria com equipamentos, veículos e ferramentas para atender projetos de grande porte em qualquer região.",
  },
];

export default function Diferenciais() {
  return (
    <section id="diferenciais" className="py-20 lg:py-32 bg-[#f5f5f5] relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#b6c72c] font-semibold text-sm tracking-widest uppercase mb-4 block animate-fade-in-up">
            Por que nos escolher
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#211915] mb-6 font-heading animate-fade-in-up delay-100">
            Nossos <span className="text-[#b6c72c]">Diferenciais</span>
          </h2>
          <p className="text-[#211915]/70 text-lg animate-fade-in-up delay-200">
            O que faz do Grupo Alfa Tecnologia a escolha certa para o seu projeto
            de infraestrutura.
          </p>
        </div>

        {/* Grid de diferenciais */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {diferenciais.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-[#b6c72c]/30 animate-fade-in-up"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              {/* Ícone */}
              <div className="w-16 h-16 bg-[#b6c72c]/10 rounded-xl flex items-center justify-center text-[#b6c72c] mb-6 group-hover:bg-[#b6c72c] group-hover:text-[#211915] transition-all duration-300">
                {item.icon}
              </div>

              {/* Título */}
              <h3 className="text-xl font-bold text-[#211915] mb-3 font-heading">
                {item.title}
              </h3>

              {/* Descrição */}
              <p className="text-[#211915]/60 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 animate-fade-in-up delay-600">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-[#211915] rounded-2xl p-8">
            <div className="text-center sm:text-left">
              <h3 className="text-white text-xl font-bold mb-2">
                Pronto para começar seu projeto?
              </h3>
              <p className="text-white/70">
                Entre em contato e solicite um orçamento sem compromisso.
              </p>
            </div>
            <a
              href="#contato"
              className="bg-[#b6c72c] text-[#211915] px-8 py-4 rounded-full font-bold whitespace-nowrap hover:bg-[#9eb025] transition-all hover:shadow-xl hover:shadow-[#b6c72c]/30"
            >
              Fale Conosco
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
