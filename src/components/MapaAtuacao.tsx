"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { estadosInfo, coresRegiao } from "@/data/estadosBrasil";

// Importar o mapa dinamicamente para evitar problemas com SSR
const MapaLeaflet = dynamic(() => import("./MapaLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square max-w-xl mx-auto bg-[#3a3330] rounded-2xl flex items-center justify-center">
      <div className="text-white/60 text-sm">Carregando mapa...</div>
    </div>
  ),
});

export default function MapaAtuacao() {
  const [estadoSelecionado, setEstadoSelecionado] = useState<string | null>(null);
  const [estadoHover, setEstadoHover] = useState<string | null>(null);

  const estadosAtivos = Object.keys(estadosInfo);

  const handleEstadoClick = (sigla: string) => {
    setEstadoSelecionado(estadoSelecionado === sigla ? null : sigla);
  };

  const infoEstado = estadoSelecionado ? estadosInfo[estadoSelecionado] : null;

  return (
    <section id="mapa-atuacao" className="py-20 lg:py-32 bg-[#211915] relative overflow-hidden">
      {/* Padrão de fundo */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' stroke='%23b6c72c' stroke-width='0.5' fill='none'/%3E%3Ccircle cx='50' cy='50' r='30' stroke='%23b6c72c' stroke-width='0.3' fill='none'/%3E%3Ccircle cx='50' cy='50' r='20' stroke='%23b6c72c' stroke-width='0.2' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Lado esquerdo - Mapa Interativo com Leaflet */}
          <div className="relative animate-fade-in-up order-2 lg:order-1">
            <div className="relative w-full max-w-xl mx-auto">
              {/* Título do mapa */}
              <div className="text-center mb-4">
                <span className="text-white/60 text-sm">
                  {estadoHover
                    ? `${estadosInfo[estadoHover]?.nome || estadoHover}`
                    : "Clique em um estado para ver detalhes"}
                </span>
              </div>

              {/* Mapa Leaflet */}
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <MapaLeaflet
                  estadoSelecionado={estadoSelecionado}
                  onEstadoClick={handleEstadoClick}
                  onEstadoHover={setEstadoHover}
                />
              </div>

              {/* Legenda de regiões */}
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {Object.entries(coresRegiao).map(([regiao, cor]) => (
                  <div key={regiao} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cor }}
                    />
                    <span className="text-white/60 text-xs">{regiao}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Lado direito - Informações */}
          <div className="animate-fade-in-up delay-200 order-1 lg:order-2">
            <span className="text-[#b6c72c] font-semibold text-sm tracking-widest uppercase mb-4 block">
              Abrangência Nacional
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 font-heading">
              Atuação em <span className="text-[#b6c72c]">Todo o Brasil</span>
            </h2>

            <p className="text-white/70 text-lg mb-8">
              Projetos realizados em quase todos os estados da federação. Nossa
              equipe possui experiência em executar obras em diferentes regiões,
              adaptando-se às condições locais e superando desafios logísticos.
            </p>

            {/* Painel de informações do estado selecionado */}
            {infoEstado ? (
              <div className="bg-gradient-to-br from-[#b6c72c]/20 to-transparent border border-[#b6c72c]/30 rounded-2xl p-6 mb-8 animate-fade-in-up">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: coresRegiao[infoEstado.regiao] }}
                  >
                    {infoEstado.sigla}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl">
                      {infoEstado.nome}
                    </h3>
                    <span className="text-white/60 text-sm">
                      {infoEstado.regiao} • Capital: {infoEstado.capital}
                    </span>
                  </div>
                </div>

                {infoEstado.destaque && (
                  <div className="bg-[#b6c72c]/10 rounded-lg p-3 mb-4">
                    <span className="text-[#b6c72c] text-sm font-medium">
                      ⭐ {infoEstado.destaque}
                    </span>
                  </div>
                )}

                <div>
                  <h4 className="text-white/80 font-semibold text-sm mb-2">
                    Projetos realizados:
                  </h4>
                  <ul className="space-y-2">
                    {infoEstado.projetos.map((projeto, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-white/70 text-sm"
                      >
                        <svg
                          className="w-4 h-4 text-[#b6c72c] flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {projeto}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setEstadoSelecionado(null)}
                  className="mt-4 text-[#b6c72c] text-sm hover:underline"
                >
                  ← Voltar para visão geral
                </button>
              </div>
            ) : (
              <>
                {/* Grid de estados quando nenhum está selecionado */}
                <div className="mb-8">
                  <h3 className="text-white font-semibold mb-4">
                    Estados atendidos:{" "}
                    <span className="text-[#b6c72c]">{estadosAtivos.length}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {estadosAtivos.map((estado) => (
                      <button
                        key={estado}
                        onClick={() => handleEstadoClick(estado)}
                        onMouseEnter={() => setEstadoHover(estado)}
                        onMouseLeave={() => setEstadoHover(null)}
                        className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-sm hover:bg-[#b6c72c] hover:text-[#211915] transition-all cursor-pointer"
                      >
                        {estado}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Destaques */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <span className="text-[#b6c72c] text-2xl font-bold block">
                  Norte a Sul
                </span>
                <span className="text-white/60 text-sm">
                  Cobertura de todas as regiões
                </span>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <span className="text-[#b6c72c] text-2xl font-bold block">
                  Condições Extremas
                </span>
                <span className="text-white/60 text-sm">
                  Experiência em locais remotos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
