import NeuralNetwork from "./NeuralNetwork";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background com overlay */}
      <div className="absolute inset-0 bg-[#211915]">
        {/* Efeito de rede neural interativo */}
        <NeuralNetwork />
        {/* Gradiente overlay - mais forte na parte de baixo */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none" />
      </div>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-20">
        <div className="max-w-5xl mx-auto text-center">

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in-up delay-100 font-heading">
            Soluções em Tecnologia e Infraestrutura para{" "}
            <span className="text-[#b6c72c]">Órgãos Públicos</span> em Todo o
            Brasil
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-10 animate-fade-in-up delay-200">
            Especialistas em redes, fibra óptica, cabeamento estruturado,
            segurança eletrônica e projetos complexos em larga escala.
          </p>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up delay-300">
            <a
              href="#servicos"
              className="bg-[#b6c72c] text-[#211915] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#9eb025] transition-all hover:shadow-xl hover:shadow-[#b6c72c]/30 hover:scale-105"
            >
              Conheça nossas Soluções
            </a>
            <a
              href="#contato"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-[#211915] transition-all hover:scale-105"
            >
              Solicitar Contato
            </a>
          </div>

          {/* Selo */}
          <div className="inline-flex items-center gap-3 bg-[#b6c72c]/10 border border-[#b6c72c]/30 px-6 py-3 rounded-full animate-fade-in-up delay-400">
            <svg
              className="w-6 h-6 text-[#b6c72c]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-white font-medium">
              Atuante em Licitações e Adesões desde 2018
            </span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <a href="#sobre" className="text-white/50 hover:text-[#b6c72c] transition-colors">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
