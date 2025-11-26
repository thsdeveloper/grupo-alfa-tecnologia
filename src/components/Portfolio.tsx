"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface Projeto {
  id: string;
  local: string;
  titulo: string;
  descricao: string;
  categoria: string;
  destaque: string;
  imagens: string[];
  imagemCapa: string;
}

const projetos: Projeto[] = [
  {
    id: "base-aerea-anapolis",
    local: "Base Aérea de Anápolis",
    titulo: "Força Aérea Brasileira",
    descricao: "Backbone óptico subterrâneo com 70 km de fibra óptica.",
    categoria: "Rede Óptica",
    destaque: "70 km fibra",
    imagemCapa: "/obras/base-aerea-anapolis/capa.jpeg",
    imagens: [
      "/obras/base-aerea-anapolis/01.jpeg",
      "/obras/base-aerea-anapolis/02.jpeg",
      "/obras/base-aerea-anapolis/03.jpeg",
    ],
  },
  {
    id: "parnamirim",
    local: "Parnamirim – RN",
    titulo: "Prefeitura Municipal",
    descricao: "Instalação de cabeamento estruturado cat. 6 com 430 pontos de rede.",
    categoria: "Rede Lógica",
    destaque: "430 pontos",
    imagemCapa: "",
    imagens: [],
  },
  {
    id: "gsi",
    local: "GSI – Presidência da República",
    titulo: "Gabinete de Segurança Institucional",
    descricao: "Cabeamento estruturado e organização completa de racks.",
    categoria: "Rede Lógica",
    destaque: "Alta Segurança",
    imagemCapa: "",
    imagens: [],
  },
  {
    id: "ufrr",
    local: "UFRR – Roraima",
    titulo: "Universidade Federal de Roraima",
    descricao: "Cabeamento lógico e óptico em vários campi da universidade.",
    categoria: "Infraestrutura",
    destaque: "Multi-campus",
    imagemCapa: "",
    imagens: [],
  },
  {
    id: "ufsc",
    local: "UFSC – Santa Catarina",
    titulo: "Universidade Federal de Santa Catarina",
    descricao: "Milhares de pontos de rede e dezenas de km de fibra óptica.",
    categoria: "Rede Óptica",
    destaque: "Grande Escala",
    imagemCapa: "",
    imagens: [],
  },
  {
    id: "ufsm",
    local: "UFSM – Rio Grande do Sul",
    titulo: "Universidade Federal de Santa Maria",
    descricao: "Infraestrutura completa de rede lógica e óptica.",
    categoria: "Infraestrutura",
    destaque: "Projeto Completo",
    imagemCapa: "",
    imagens: [],
  },
  {
    id: "tjdft",
    local: "TJDFT – Brasília",
    titulo: "Tribunal de Justiça do DF e Territórios",
    descricao: "Modernização da infraestrutura de rede do tribunal.",
    categoria: "Rede Lógica",
    destaque: "Modernização",
    imagemCapa: "",
    imagens: [],
  },
  {
    id: "pinhalzinho",
    local: "Pinhalzinho – SC",
    titulo: "Prefeitura Municipal",
    descricao: "Implantação de rede de fibra óptica municipal.",
    categoria: "Rede Óptica",
    destaque: "Rede Municipal",
    imagemCapa: "",
    imagens: [],
  },
  {
    id: "dct",
    local: "DCT – Exército Brasileiro",
    titulo: "Departamento de Ciência e Tecnologia",
    descricao: "Projeto de infraestrutura de alta segurança e performance.",
    categoria: "Infraestrutura",
    destaque: "Alta Performance",
    imagemCapa: "",
    imagens: [],
  },
];

// Componente Lightbox
function Lightbox({
  imagens,
  indiceAtual,
  onClose,
  onPrev,
  onNext,
  titulo,
}: {
  imagens: string[];
  indiceAtual: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  titulo: string;
}) {
  // Fechar com ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
      {/* Botão Fechar */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
        aria-label="Fechar"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Título */}
      <div className="absolute top-4 left-4 text-white">
        <h3 className="text-lg font-bold">{titulo}</h3>
        <p className="text-white/60 text-sm">
          {indiceAtual + 1} de {imagens.length}
        </p>
      </div>

      {/* Botão Anterior */}
      <button
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-white/10 hover:bg-[#b6c72c] rounded-full flex items-center justify-center transition-all hover:scale-110"
        aria-label="Anterior"
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Imagem */}
      <div className="relative w-full h-full max-w-6xl max-h-[85vh] mx-16 flex items-center justify-center">
        <Image
          src={imagens[indiceAtual]}
          alt={`${titulo} - Imagem ${indiceAtual + 1}`}
          fill
          className="object-contain"
          sizes="(max-width: 1200px) 100vw, 1200px"
          priority
        />
      </div>

      {/* Botão Próximo */}
      <button
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-white/10 hover:bg-[#b6c72c] rounded-full flex items-center justify-center transition-all hover:scale-110"
        aria-label="Próximo"
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Miniaturas */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4 py-2">
        {imagens.map((img, idx) => (
          <button
            key={idx}
            onClick={() => {
              const diff = idx - indiceAtual;
              if (diff > 0) for (let i = 0; i < diff; i++) onNext();
              else for (let i = 0; i < Math.abs(diff); i++) onPrev();
            }}
            className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all ${idx === indiceAtual
                ? "ring-2 ring-[#b6c72c] scale-110"
                : "opacity-50 hover:opacity-100"
              }`}
          >
            <Image src={img} alt="" fill className="object-cover" sizes="64px" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [showAll, setShowAll] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [projetoAtual, setProjetoAtual] = useState<Projeto | null>(null);
  const [indiceImagem, setIndiceImagem] = useState(0);

  const displayedProjetos = showAll ? projetos : projetos.slice(0, 6);

  const abrirGaleria = (projeto: Projeto) => {
    if (projeto.imagens.length > 0) {
      setProjetoAtual(projeto);
      setIndiceImagem(0);
      setLightboxOpen(true);
    }
  };

  const fecharGaleria = useCallback(() => {
    setLightboxOpen(false);
    setProjetoAtual(null);
  }, []);

  const proximaImagem = useCallback(() => {
    if (projetoAtual) {
      setIndiceImagem((prev) =>
        prev === projetoAtual.imagens.length - 1 ? 0 : prev + 1
      );
    }
  }, [projetoAtual]);

  const imagemAnterior = useCallback(() => {
    if (projetoAtual) {
      setIndiceImagem((prev) =>
        prev === 0 ? projetoAtual.imagens.length - 1 : prev - 1
      );
    }
  }, [projetoAtual]);

  return (
    <>
      <section id="portfolio" className="py-20 lg:py-32 bg-[#f5f5f5] relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#b6c72c] font-semibold text-sm tracking-widest uppercase mb-4 block animate-fade-in-up">
              Portfólio
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#211915] mb-6 font-heading animate-fade-in-up delay-100">
              Obras <span className="text-[#b6c72c]">Realizadas</span>
            </h2>
            <p className="text-[#211915]/70 text-lg animate-fade-in-up delay-200">
              Conheça alguns dos projetos executados pelo Grupo Alfa Tecnologia em
              órgãos públicos de todo o Brasil.
            </p>
          </div>

          {/* Grid de projetos */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {displayedProjetos.map((projeto, index) => (
              <div
                key={projeto.id}
                className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in-up ${projeto.imagens.length > 0 ? "cursor-pointer" : ""
                  }`}
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
                onClick={() => abrirGaleria(projeto)}
              >
                {/* Imagem */}
                <div className="relative h-48 bg-gradient-to-br from-[#211915] to-[#3a3330] overflow-hidden">
                  {projeto.imagemCapa ? (
                    <Image
                      src={projeto.imagemCapa}
                      alt={projeto.titulo}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M0 50 L100 50 M50 0 L50 100 M25 25 L75 25 L75 75 L25 75 Z' stroke='%23b6c72c' stroke-width='0.5' fill='none'/%3E%3Ccircle cx='25' cy='25' r='3' fill='%23b6c72c'/%3E%3Ccircle cx='75' cy='25' r='3' fill='%23b6c72c'/%3E%3Ccircle cx='75' cy='75' r='3' fill='%23b6c72c'/%3E%3Ccircle cx='25' cy='75' r='3' fill='%23b6c72c'/%3E%3Ccircle cx='50' cy='50' r='5' fill='%23b6c72c'/%3E%3C/svg%3E")`,
                        backgroundSize: "100px 100px",
                      }}
                    />
                  )}

                  {/* Badge categoria */}
                  <span className="absolute top-4 left-4 bg-[#b6c72c] text-[#211915] text-xs font-bold px-3 py-1 rounded-full z-10">
                    {projeto.categoria}
                  </span>

                  {/* Badge quantidade de fotos */}
                  {projeto.imagens.length > 0 && (
                    <span className="absolute top-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full z-10 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {projeto.imagens.length}
                    </span>
                  )}

                  {/* Overlay com ícone */}
                  <div className="absolute inset-0 bg-[#211915]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-[#b6c72c] rounded-full flex items-center justify-center">
                      {projeto.imagens.length > 0 ? (
                        <svg className="w-8 h-8 text-[#211915]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 text-[#211915]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-6">
                  {/* Local */}
                  <div className="flex items-center gap-2 text-[#b6c72c] text-sm font-medium mb-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {projeto.local}
                  </div>

                  {/* Título */}
                  <h3 className="text-xl font-bold text-[#211915] mb-2 font-heading">
                    {projeto.titulo}
                  </h3>

                  {/* Descrição */}
                  <p className="text-[#211915]/60 text-sm mb-4">{projeto.descricao}</p>

                  {/* Destaque */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#b6c72c] font-bold text-sm">
                      {projeto.destaque}
                    </span>
                    <div className="flex items-center gap-1 text-[#211915]/40">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs">Concluído</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botão Ver Mais */}
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 bg-[#211915] text-white px-8 py-4 rounded-full font-bold hover:bg-[#3a3330] transition-all"
            >
              {showAll ? "Ver Menos" : "Ver Portfólio Completo"}
              <svg
                className={`w-5 h-5 transition-transform ${showAll ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && projetoAtual && (
        <Lightbox
          imagens={projetoAtual.imagens}
          indiceAtual={indiceImagem}
          onClose={fecharGaleria}
          onPrev={imagemAnterior}
          onNext={proximaImagem}
          titulo={projetoAtual.titulo}
        />
      )}
    </>
  );
}
