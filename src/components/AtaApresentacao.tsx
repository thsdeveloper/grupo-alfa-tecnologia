"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Play, Download, Loader2, Building2, UserCheck, TrendingUp, Zap, Users, Truck } from "lucide-react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { servicos } from "@/data/servicos";
import dynamic from "next/dynamic";
import { useOrganizationSettings } from "@/lib/hooks/useOrganizationSettings";

// Importar Leaflet dinamicamente para evitar problemas de SSR
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

// CSS do Leaflet será importado dinamicamente quando necessário

interface Ata {
  id: string;
  slug: string;
  numero_ata: string;
  orgao_gerenciador: string;
  orgao_gerenciador_sigla: string | null;
  modalidade: string;
  numero_planejamento: string | null;
  vigencia_meses: number | null;
  status: string;
  objeto: string | null;
  fornecedor_nome: string;
  fornecedor_cnpj: string;
  base_legal: string | null;
}

interface Lote {
  id: string;
  ata_id: string;
  numero: string;
  descricao: string | null;
  ativo: boolean | null;
  ordem: number | null;
  created_at: string | null;
}

interface Item {
  id: string;
  ata_id: string;
  lote_id: string | null;
  numero_item: string;
  descricao: string;
  unidade: string;
  quantidade: number | null;
  preco_unitario: number | null;
  ativo: boolean | null;
  ordem: number | null;
  executavel: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

interface ItemImagem {
  id: string;
  item_id: string;
  url: string;
  nome_arquivo: string | null;
  ordem: number | null;
  created_at: string | null;
}

interface AtaApresentacaoProps {
  isOpen: boolean;
  onClose: () => void;
  ata?: Ata | null;
  itens?: Item[];
  lotes?: Lote[];
  imagens?: ItemImagem[];
}

// Dados default para uso quando não houver props
const defaultAta: Ata = {
  id: "default",
  slug: "264-2025-seplag-mg",
  numero_ata: "264/2025 - I",
  orgao_gerenciador: "Secretaria de Estado de Planejamento e Gestão de Minas Gerais",
  orgao_gerenciador_sigla: "SEPLAG-MG",
  modalidade: "Pregão Eletrônico",
  numero_planejamento: "396/2024",
  vigencia_meses: 12,
  status: "vigente",
  objeto: "Contratação de empresa especializada para prestação de serviços técnicos de elaboração de projetos executivos e execução de infraestrutura de rede de comunicação.",
  fornecedor_nome: "Alfa Tecnologia em Engenharia e Infraestrutura de Redes Ltda.",
  fornecedor_cnpj: "31.837.899/0001-25",
  base_legal: "Lei Federal nº 14.133/2021 e Decreto nº 48.779/2024",
};

const defaultItens: Item[] = [
  { id: "1", ata_id: "default", lote_id: "lote2", numero_item: "23", descricao: "Execução de ponto de rede CAT.6, instalado incluindo fornecimento e instalação de materiais", unidade: "Unidade", quantidade: 66147, preco_unitario: 201.99, ativo: true, ordem: 1, executavel: true, created_at: null, updated_at: null },
  { id: "2", ata_id: "default", lote_id: "lote2", numero_item: "24", descricao: "Execução de ponto de rede CAT5E, instalado incluindo fornecimento e instalação de materiais", unidade: "Unidade", quantidade: 24892, preco_unitario: 181.84, ativo: true, ordem: 2, executavel: true, created_at: null, updated_at: null },
  { id: "3", ata_id: "default", lote_id: "lote2", numero_item: "25", descricao: "Eletroduto de ferro galvanizado ou flexível corrugado tipo 'Seal Tube', até 1 polegada", unidade: "Metro Linear", quantidade: 846005, preco_unitario: 19.66, ativo: true, ordem: 3, executavel: true, created_at: null, updated_at: null },
  { id: "4", ata_id: "default", lote_id: "lote2", numero_item: "26", descricao: "Eletroduto de ferro galvanizado ou flexível corrugado tipo 'Seal Tube', de 1 1/4 até 3 polegadas", unidade: "Metro Linear", quantidade: 235097, preco_unitario: 41.50, ativo: true, ordem: 4, executavel: true, created_at: null, updated_at: null },
  { id: "5", ata_id: "default", lote_id: "lote2", numero_item: "27", descricao: "Eletrocalha metálica galvanizada de 25mm até 400mm (L) x 25mm até 100mm (H)", unidade: "Metro Linear", quantidade: 186374, preco_unitario: 117.95, ativo: true, ordem: 5, executavel: true, created_at: null, updated_at: null },
  { id: "6", ata_id: "default", lote_id: "lote2", numero_item: "28", descricao: "Canaleta em material metálico galvanizado/alumínio, tampada e septada", unidade: "Metro Linear", quantidade: 164455, preco_unitario: 129.74, ativo: true, ordem: 6, executavel: true, created_at: null, updated_at: null },
  { id: "7", ata_id: "default", lote_id: "lote2", numero_item: "29", descricao: "Canaleta de piso em PVC rígido autoextinguível", unidade: "Metro Linear", quantidade: 99040, preco_unitario: 87.15, ativo: true, ordem: 7, executavel: true, created_at: null, updated_at: null },
  { id: "8", ata_id: "default", lote_id: "lote2", numero_item: "30", descricao: "Cabo UTP CAT6, 4 pares em eletroduto", unidade: "Metro Linear", quantidade: 1408850, preco_unitario: 9.31, ativo: true, ordem: 8, executavel: true, created_at: null, updated_at: null },
  { id: "9", ata_id: "default", lote_id: "lote2", numero_item: "31", descricao: "Cabo UTP CAT5E, 4 pares em eletroduto", unidade: "Metro Linear", quantidade: 229305, preco_unitario: 8.51, ativo: true, ordem: 9, executavel: true, created_at: null, updated_at: null },
  { id: "10", ata_id: "default", lote_id: "lote2", numero_item: "32", descricao: "Ponto de rede óptico, 6 fibras, 3 pares", unidade: "Metro Linear", quantidade: 23952, preco_unitario: 20.64, ativo: true, ordem: 10, executavel: true, created_at: null, updated_at: null },
];

const defaultLotes: Lote[] = [
  { id: "lote2", ata_id: "default", numero: "2", descricao: "Cabeamento Estruturado e Infraestrutura", ativo: true, ordem: 1, created_at: null },
  { id: "lote4", ata_id: "default", numero: "4", descricao: null, ativo: true, ordem: 2, created_at: null },
  { id: "lote5", ata_id: "default", numero: "5", descricao: null, ativo: true, ordem: 3, created_at: null },
];

export default function AtaApresentacao({
  isOpen,
  onClose,
  ata: propAta,
  itens: propItens,
  lotes: propLotes,
  imagens: propImagens
}: AtaApresentacaoProps) {
  // Use props ou defaults
  const ata = propAta || defaultAta;
  const itens = propItens && propItens.length > 0 ? propItens : defaultItens;
  const lotes = propLotes && propLotes.length > 0 ? propLotes : defaultLotes;
  const imagens = propImagens || [];
  const { settings } = useOrganizationSettings();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [leafletModule, setLeafletModule] = useState<any>(null);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  // Garantir que o mapa só seja renderizado no cliente
  useEffect(() => {
    setIsMapReady(true);
    // Carregar Leaflet dinamicamente apenas no cliente
    if (typeof window !== "undefined") {
      // Importar CSS do Leaflet
      // @ts-expect-error CSS import doesn't have types
      import("leaflet/dist/leaflet.css");
      // Importar módulo Leaflet
      import("leaflet").then((L) => {
        setLeafletModule(L.default || L);
      });
    }
  }, []);

  // Função para criar ícone customizado (apenas no cliente)
  const createCustomIcon = useCallback(() => {
    if (!leafletModule || typeof window === "undefined") return undefined;
    return leafletModule.divIcon({
      className: "custom-marker",
      html: `<div style="
        width: 24px;
        height: 24px;
        background-color: #b6c72c;
        border: 3px solid #211915;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(182, 199, 44, 0.6);
        position: relative;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          background-color: #211915;
          border-radius: 50%;
        "></div>
      </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  }, [leafletModule]);

  // Função para gerar descrição de como podemos ajudar baseada no tipo de item
  const gerarDescricaoAjuda = (item: Item): string => {
    const descLower = item.descricao.toLowerCase();
    
    if (descLower.includes('ponto de rede') || descLower.includes('cat.6') || descLower.includes('cat6') || descLower.includes('cat5e')) {
      return "Oferecemos instalação completa de pontos de rede estruturada, incluindo fornecimento e instalação de todos os materiais necessários. Nossa equipe técnica certificada garante instalações de alta qualidade, seguindo rigorosamente as normas técnicas vigentes. Realizamos testes de certificação e documentação completa do projeto.";
    }
    
    if (descLower.includes('eletroduto') || descLower.includes('seal tube')) {
      return "Executamos a instalação de eletrodutos com precisão e qualidade, garantindo a proteção adequada dos cabos. Utilizamos materiais de primeira linha e seguimos todas as normas técnicas de instalação. Nossa experiência em projetos públicos garante execuções rápidas e eficientes.";
    }
    
    if (descLower.includes('eletrocalha') || descLower.includes('canaleta')) {
      return "Instalamos eletrocalhas e canaletas metálicas com expertise técnica, garantindo organização e proteção da infraestrutura de cabos. Oferecemos soluções personalizadas conforme as necessidades do projeto, com materiais de alta qualidade e instalação profissional.";
    }
    
    if (descLower.includes('cabo utp') || descLower.includes('cabo cat')) {
      return "Fornecemos e instalamos cabos de rede de alta qualidade, seguindo as especificações técnicas mais rigorosas. Realizamos a instalação com cuidado e precisão, garantindo desempenho otimizado da rede. Nossa equipe está preparada para projetos de qualquer escala.";
    }
    
    if (descLower.includes('fibra óptica') || descLower.includes('óptico')) {
      return "Somos especialistas em instalação de infraestrutura de fibra óptica. Oferecemos serviços completos desde a instalação até a fusão e certificação, garantindo enlaces de alta qualidade. Nossa experiência em projetos governamentais assegura execuções dentro dos prazos e especificações técnicas.";
    }
    
    if (descLower.includes('cftv') || descLower.includes('câmera')) {
      return "Instalamos sistemas de CFTV completos, incluindo câmeras, cabeamento e infraestrutura necessária. Nossa equipe técnica garante instalações profissionais que atendem às necessidades de segurança e monitoramento. Oferecemos suporte técnico e documentação completa do projeto.";
    }
    
    if (descLower.includes('controle de acesso')) {
      return "Implementamos sistemas completos de controle de acesso, incluindo toda a infraestrutura necessária. Nossa experiência em projetos públicos garante soluções seguras e confiáveis, com instalação profissional e suporte técnico especializado.";
    }
    
    // Descrição genérica para outros tipos de item
    return "Oferecemos execução completa deste serviço com equipe técnica especializada e materiais de alta qualidade. Nossa experiência em projetos públicos garante execuções dentro dos prazos estabelecidos, seguindo rigorosamente as especificações técnicas e normas vigentes. Fornecemos documentação completa e suporte técnico durante todo o projeto.";
  };

  // Filtrar itens executáveis
  const itensExecutaveis = itens.filter(item => item.executavel === true);
  
  // Dividir itens em grupos para slides (mantendo para slides de catálogo)
  const itemGroups: Item[][] = [];
  for (let i = 0; i < itens.length; i += 5) {
    itemGroups.push(itens.slice(i, i + 5));
  }

  // Calcular número base de slides (sem itens e imagens dinâmicos)
  // Slides base: capa-institucional, empresa, diferenciais, servicos, abrangencia, capa-ata, partes, objeto, vigencia, adesao, contato = 11
  const baseSlides = 11;
  // Adicionar slides de itens executáveis individuais + slides de catálogo de itens
  const totalSlides = baseSlides + itemGroups.length + itensExecutaveis.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString("pt-BR");
  };

  const slides = [
    // Slide 1 - Capa Institucional (Logo Grande)
    <div key="capa-institucional" className="flex flex-col items-center justify-center h-full p-8 lg:p-16 text-center relative overflow-hidden">
      {/* Background com gradiente animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#211915] via-[#2d231e] to-[#1a1411]" />

      {/* Círculos decorativos */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#b6c72c]/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#b6c72c]/10 rounded-full blur-2xl" />

      {/* Padrão de fundo */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b6c72c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Elementos decorativos de canto */}
      <div className="absolute top-0 left-0 w-48 h-48 border-l-4 border-t-4 border-[#b6c72c]/30 rounded-tl-[3rem] m-6"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 border-r-4 border-b-4 border-[#b6c72c]/30 rounded-br-[3rem] m-6"></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Principal - BEM GRANDE */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-[#b6c72c]/20 blur-3xl rounded-full scale-150" />
          <img
            src={settings.logo_url || "/logo-alfa-telecon2.png"}
            alt="Grupo Alfa Tecnologia"
            className="h-40 md:h-52 lg:h-64 w-auto relative z-10 drop-shadow-2xl"
          />
        </div>

        {/* Nome da Empresa */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white font-heading mb-4 tracking-tight">
          Grupo <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b6c72c] to-[#d4e157]">Alfa Tecnologia</span>
        </h1>

        {/* Tagline */}
        <p className="text-white/70 text-xl md:text-2xl font-light mb-8 max-w-2xl">
          Engenharia e Infraestrutura de Redes
        </p>

        {/* Linha decorativa */}
        <div className="h-1 w-32 bg-gradient-to-r from-transparent via-[#b6c72c] to-transparent mb-8" />

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-4">
          <div className="bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
            <span className="text-white/80 text-sm font-medium">🏛️ Especialistas em Órgãos Públicos</span>
          </div>
          <div className="bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
            <span className="text-white/80 text-sm font-medium">📍 Atuação Nacional</span>
          </div>
          <div className="bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
            <span className="text-white/80 text-sm font-medium">✅ +20 Anos de Experiência</span>
          </div>
        </div>
      </div>
    </div>,

    // Slide 2 - Sobre a Empresa
    <div key="empresa" className="flex flex-col h-full p-6 lg:p-12 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#b6c72c]/5 to-transparent" />

      <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 font-heading relative z-10">
        Sobre a <span className="text-[#b6c72c]">Alfa Tecnologia</span>
      </h2>

      <div className="grid md:grid-cols-2 gap-12 items-center flex-1 relative z-10">
        <div className="space-y-8">
          <p className="text-white/80 text-xl leading-relaxed">
            Somos especialistas em soluções de engenharia e infraestrutura de redes, comprometidos com a excelência técnica e a inovação.
          </p>

          <div className="grid gap-6">
            {[
              { title: "Experiência Comprovada", desc: "Atuação consolidada em grandes projetos governamentais e privados." },
              { title: "Equipe Qualificada", desc: "Profissionais certificados e constantemente atualizados." },
              { title: "Conformidade Legal", desc: "Total aderência às normas técnicas e legislação vigente." }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-[#b6c72c]/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-[#b6c72c] rounded-full" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-white/60">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-sm">
          <div className="text-center mb-8">
            <img src={settings.logo_url || "/logo-alfa-telecon2.png"} alt="Alfa Tecnologia" className="h-16 mx-auto mb-4" />
            <p className="text-white font-bold text-xl">Dados Cadastrais</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-white/60">Razão Social</span>
              <span className="text-white font-medium text-right max-w-[60%]">{ata.fornecedor_nome}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-white/60">CNPJ</span>
              <span className="text-white font-medium text-[#b6c72c]">{ata.fornecedor_cnpj}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-white/60">Sede</span>
              <span className="text-white font-medium">Brasília - DF</span>
            </div>
          </div>
        </div>
      </div>
    </div>,

    // Slide - Diferenciais (Novo)
    <div key="diferenciais" className="flex flex-col h-full p-6 lg:p-12 bg-[#f5f5f5] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b6c72c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="text-center mb-10 relative z-10">
        <span className="text-[#b6c72c] font-bold text-sm tracking-widest uppercase mb-2 block">Por que nos escolher</span>
        <h2 className="text-3xl md:text-5xl font-bold text-[#211915] font-heading">
          Nossos <span className="text-[#b6c72c]">Diferenciais</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 relative z-10">
        {[
          { icon: Building2, title: "Especialização em Órgãos Públicos", desc: "Atuação focada exclusivamente no segmento público, com profundo conhecimento das exigências." },
          { icon: UserCheck, title: "Engenheiro com 20+ Anos", desc: "Responsável técnico com mais de duas décadas de experiência liderando grandes projetos." },
          { icon: TrendingUp, title: "Projetos de Alta Complexidade", desc: "Capacidade técnica para executar projetos complexos e de grande escala." },
          { icon: Zap, title: "Execuções Rápidas", desc: "Equipe preparada para mobilização ágil e execução dentro dos prazos." },
          { icon: Users, title: "Equipe Capacitada", desc: "Profissionais treinados e certificados em infraestrutura de TI." },
          { icon: Truck, title: "Infraestrutura Completa", desc: "Frota e equipamentos próprios para atender em qualquer região." },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg border border-transparent hover:border-[#b6c72c]/30 transition-all">
            <div className="w-12 h-12 bg-[#b6c72c]/10 rounded-xl flex items-center justify-center text-[#b6c72c] mb-4">
              <item.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#211915] mb-2">{item.title}</h3>
            <p className="text-[#211915]/60 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>,

    // Slide - Nossos Serviços (Novo)
    <div key="servicos" className="flex flex-col h-full p-6 lg:p-12 bg-[#211915] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Cpath d='M0 40 L80 40 M40 0 L40 80' stroke='%23b6c72c' stroke-width='0.5' fill='none'/%3E%3Ccircle cx='40' cy='40' r='2' fill='%23b6c72c'/%3E%3C/svg%3E")`,
        backgroundSize: "80px 80px",
      }} />

      <div className="text-center mb-8 relative z-10">
        <span className="text-[#b6c72c] font-bold text-sm tracking-widest uppercase mb-2 block">Portfólio Completo</span>
        <h2 className="text-3xl md:text-5xl font-bold text-white font-heading mb-4">
          Soluções em <span className="text-[#b6c72c]">Infraestrutura</span>
        </h2>
        <p className="text-white/60 max-w-3xl mx-auto">
          Oferecemos um portfólio completo de serviços disponíveis via Ata de Registro de Preço.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 relative z-10">
        {servicos.slice(0, 6).map((servico, idx) => (
          <div key={idx} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#b6c72c]/10 rounded-lg flex items-center justify-center text-[#b6c72c] flex-shrink-0 group-hover:bg-[#b6c72c] group-hover:text-[#211915] transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={servico.icon} />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1 group-hover:text-[#b6c72c] transition-colors">{servico.shortTitle}</h3>
                <p className="text-white/50 text-xs leading-relaxed line-clamp-3">{servico.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>,

    // Slide - Abrangência (Novo)
    <div key="abrangencia" className="flex flex-col h-full p-6 lg:p-12 bg-gradient-to-br from-[#211915] to-[#1a1411] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' stroke='%23b6c72c' stroke-width='0.5' fill='none'/%3E%3Ccircle cx='50' cy='50' r='30' stroke='%23b6c72c' stroke-width='0.3' fill='none'/%3E%3Ccircle cx='50' cy='50' r='20' stroke='%23b6c72c' stroke-width='0.2' fill='none'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }} />

      <div className="flex flex-col md:flex-row items-center h-full gap-12 relative z-10">
        <div className="flex-1 space-y-8">
          <div>
            <span className="text-[#b6c72c] font-bold text-sm tracking-widest uppercase mb-2 block">Abrangência Nacional</span>
            <h2 className="text-4xl md:text-6xl font-bold text-white font-heading leading-tight">
              Atuação em <br />
              <span className="text-[#b6c72c]">Todo o Brasil</span>
            </h2>
          </div>

          <p className="text-white/70 text-xl leading-relaxed border-l-4 border-[#b6c72c] pl-6">
            Projetos realizados em quase todos os estados da federação. Nossa equipe possui mobilidade para atender demandas em qualquer localidade do território nacional.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <p className="text-4xl font-bold text-[#b6c72c] mb-1">26+</p>
              <p className="text-white/60 text-sm uppercase tracking-wider">Estados Atendidos</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <p className="text-4xl font-bold text-[#b6c72c] mb-1">500+</p>
              <p className="text-white/60 text-sm uppercase tracking-wider">Projetos Executados</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          {/* Mapa Real com Marcadores de Obras */}
          <div className="relative w-full h-full max-w-2xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style={{ minHeight: "400px", height: "100%" }}>
            {isMapReady ? (
              <MapContainer
                center={[-14.235, -51.9253]} // Centro do Brasil
                zoom={4}
                style={{ height: "100%", width: "100%", zIndex: 0, minHeight: "400px" }}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                dragging={false}
                touchZoom={false}
                boxZoom={false}
                keyboard={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* Marcadores de obras em diferentes estados */}
                {[
                  { lat: -15.7942, lng: -47.8822, cidade: "Brasília - DF", regiao: "Centro-Oeste" },
                  { lat: -23.5505, lng: -46.6333, cidade: "São Paulo - SP", regiao: "Sudeste" },
                  { lat: -22.9068, lng: -43.1729, cidade: "Rio de Janeiro - RJ", regiao: "Sudeste" },
                  { lat: -19.9167, lng: -43.9345, cidade: "Belo Horizonte - MG", regiao: "Sudeste" },
                  { lat: -25.4284, lng: -49.2733, cidade: "Curitiba - PR", regiao: "Sul" },
                  { lat: -30.0346, lng: -51.2177, cidade: "Porto Alegre - RS", regiao: "Sul" },
                  { lat: -12.9714, lng: -38.5014, cidade: "Salvador - BA", regiao: "Nordeste" },
                  { lat: -8.0476, lng: -34.8770, cidade: "Recife - PE", regiao: "Nordeste" },
                  { lat: -3.7172, lng: -38.5433, cidade: "Fortaleza - CE", regiao: "Nordeste" },
                  { lat: -5.7950, lng: -35.2094, cidade: "Natal - RN", regiao: "Nordeste" },
                  { lat: -1.4558, lng: -48.5044, cidade: "Belém - PA", regiao: "Norte" },
                  { lat: -3.1190, lng: -60.0217, cidade: "Manaus - AM", regiao: "Norte" },
                  { lat: -16.6864, lng: -49.2643, cidade: "Goiânia - GO", regiao: "Centro-Oeste" },
                  { lat: -20.4428, lng: -54.6458, cidade: "Campo Grande - MS", regiao: "Centro-Oeste" },
                ].map((obra, index) => (
                  <Marker
                    key={index}
                    position={[obra.lat, obra.lng]}
                    icon={createCustomIcon()}
                  >
                    <Popup>
                      <div className="text-sm font-bold text-[#211915]">
                        {obra.cidade}
                        <br />
                        <span className="text-xs text-gray-600">{obra.regiao}</span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-[#211915]/50">
                <div className="text-white/50 text-sm">Carregando mapa...</div>
              </div>
            )}
            {/* Overlay com gradiente para melhorar legibilidade */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#211915]/20 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </div>,

    // Slide - Capa da ATA (Apresentação da Ata Específica)
    <div key="capa-ata" className="flex flex-col items-center justify-center h-full p-8 lg:p-16 text-center relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b6c72c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-[#b6c72c] opacity-50 rounded-tl-3xl m-8"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-[#b6c72c] opacity-50 rounded-br-3xl m-8"></div>

      <div className="relative z-10 max-w-5xl">
        {/* Logo pequena */}
        <div className="mb-8">
          <img
            src={settings.logo_url || "/logo-alfa-telecon2.png"}
            alt="Logo Grupo Alfa Tecnologia"
            className="h-16 md:h-20 w-auto mx-auto drop-shadow-xl opacity-80"
          />
        </div>

        <div className="space-y-6">
          {/* Badge de status */}
          <div className="inline-flex items-center gap-3 bg-[#b6c72c]/10 border border-[#b6c72c]/20 px-6 py-2 rounded-full backdrop-blur-sm">
            <span className={`w-2.5 h-2.5 rounded-full ${ata.status === 'vigente' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
            <span className="text-[#b6c72c] font-bold uppercase tracking-widest text-sm">
              {ata.status === "vigente" ? "Ata Vigente" : ata.status}
            </span>
          </div>

          {/* Título Principal */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white font-heading leading-tight tracking-tight">
            Ata de Registro de <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b6c72c] to-[#d4e157]">
              Preço
            </span>
          </h1>

          {/* Número da ATA */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-3xl md:text-4xl text-white font-light tracking-wide">
              Nº <span className="font-bold text-white">{ata.numero_ata}</span>
            </p>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#b6c72c] to-transparent mt-4"></div>
          </div>
        </div>

        {/* Cards de informação */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-3xl mx-auto text-left">
          <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
            <p className="text-[#b6c72c] text-xs font-bold uppercase tracking-wider mb-1">Órgão Gerenciador</p>
            <p className="text-white font-medium text-lg leading-tight">
              {ata.orgao_gerenciador_sigla || ata.orgao_gerenciador}
            </p>
          </div>
          {ata.base_legal && (
            <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <p className="text-[#b6c72c] text-xs font-bold uppercase tracking-wider mb-1">Base Legal</p>
              <p className="text-white font-medium text-lg leading-tight">{ata.base_legal}</p>
            </div>
          )}
        </div>
      </div>
    </div>,

    // Slide - Partes da Contratação
    <div key="partes" className="flex flex-col h-full p-6 lg:p-12 bg-gradient-to-br from-[#211915] to-[#1a1411]">
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 font-heading text-center">
        Partes da <span className="text-[#b6c72c]">Contratação</span>
      </h2>

      <div className="flex-1 grid grid-cols-2 gap-8 max-w-6xl mx-auto w-full items-center">
        {/* Card Órgão Gerenciador */}
        <div className="relative group h-full">
          <div className="absolute inset-0 bg-[#b6c72c] rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
          <div className="h-full bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-[#b6c72c]/50 transition-all duration-300 flex flex-col">
            <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-[#b6c72c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>

            <h3 className="text-[#b6c72c] text-sm font-bold uppercase tracking-widest mb-2">Órgão Gerenciador</h3>
            <p className="text-3xl font-bold text-white mb-2 font-heading">
              {ata.orgao_gerenciador_sigla || "Órgão Público"}
            </p>
            <p className="text-white/70 text-lg leading-relaxed flex-1">
              {ata.orgao_gerenciador}
            </p>

            {ata.numero_planejamento && (
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-3">
                <div className="w-2 h-2 bg-[#b6c72c] rounded-full animate-pulse" />
                <p className="text-white/90 text-sm font-medium">
                  Planejamento: <span className="text-white">{ata.numero_planejamento}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Card Fornecedor */}
        <div className="relative group h-full">
          <div className="absolute inset-0 bg-[#b6c72c] rounded-3xl opacity-5" />
          <div className="h-full bg-[#b6c72c]/10 backdrop-blur-sm rounded-3xl p-8 border border-[#b6c72c]/30 hover:border-[#b6c72c] transition-all duration-300 flex flex-col">
            <div className="w-16 h-16 bg-[#b6c72c] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-[#211915]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h3 className="text-[#b6c72c] text-sm font-bold uppercase tracking-widest mb-2">Fornecedor Beneficiário</h3>
            <p className="text-2xl font-bold text-white mb-2 font-heading">
              {ata.fornecedor_nome}
            </p>
            <div className="flex-1">
              <p className="text-white/70 text-sm mb-4">
                Empresa especializada e habilitada para execução dos serviços.
              </p>
              {lotes.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {lotes.map(l => (
                    <span key={l.id} className="bg-[#211915] text-[#b6c72c] text-xs font-bold px-3 py-1 rounded-full border border-[#b6c72c]/20">
                      Lote {l.numero}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-[#b6c72c]/20">
              <p className="text-white/90 text-sm font-medium flex justify-between items-center">
                <span>CNPJ</span>
                <span className="font-mono text-[#b6c72c] text-base">{ata.fornecedor_cnpj}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,

    // Slide 3 - Objeto
    <div key="objeto" className="flex flex-col h-full p-6 lg:p-12 bg-gradient-to-br from-[#211915] to-[#1a1411]">
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 font-heading text-center">
        Objeto da <span className="text-[#b6c72c]">Contratação</span>
      </h2>

      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-5xl">
          {/* Aspas decorativas */}
          <div className="absolute -top-8 -left-8 text-[#b6c72c]/20 font-serif text-9xl font-bold">“</div>
          <div className="absolute -bottom-8 -right-8 text-[#b6c72c]/20 font-serif text-9xl font-bold rotate-180">“</div>

          <div className="bg-white/5 backdrop-blur-md rounded-[2rem] p-8 lg:p-14 border border-white/10 shadow-2xl relative z-10">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-24 h-24 bg-[#b6c72c] rounded-3xl flex items-center justify-center flex-shrink-0 shadow-[0_0_30px_rgba(182,199,44,0.3)] transform -rotate-3">
                <svg className="w-12 h-12 text-[#211915]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="mb-4">
                  <span className="text-[#b6c72c] font-bold uppercase tracking-widest text-sm">
                    {ata.modalidade}
                  </span>
                </div>
                <p className="text-white/90 text-xl md:text-2xl leading-relaxed font-medium">
                  {ata.objeto || "Contratação de serviços de infraestrutura de TI e cabeamento estruturado."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,

    // Slides de Itens
    ...itemGroups.map((group, groupIndex) => (
      <div key={`itens-${groupIndex}`} className="flex flex-col h-full p-6 lg:p-10 bg-[#1a1411]">
        <div className="flex justify-between items-end mb-8 pb-4 border-b border-white/10">
          <div>
            <span className="text-[#b6c72c] font-bold text-sm uppercase tracking-wider mb-1 block">
              Catálogo de Serviços
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-heading">
              Itens Registrados
              {itemGroups.length > 1 && (
                <span className="text-white/30 text-xl font-light ml-3">
                  Pág. {groupIndex + 1} de {itemGroups.length}
                </span>
              )}
            </h2>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-white/50 text-sm">Lote</p>
            <p className="text-white font-bold text-xl">{lotes[0]?.numero || "Único"}</p>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="bg-white rounded-2xl overflow-hidden shadow-2xl flex-1 border border-white/10">
            <table className="w-full">
              <thead className="bg-[#211915] text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#b6c72c] w-20">Item</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#b6c72c]">Descrição do Serviço</th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-[#b6c72c] w-32">Unid.</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#b6c72c] w-32">Preço Unit.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {group.map((item, idx) => (
                  <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 align-top">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-[#211915] text-white rounded-lg font-bold text-sm">
                        {item.numero_item}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <p className="text-[#211915] font-medium text-sm leading-relaxed">
                        {item.descricao}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center align-top">
                      <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium uppercase">
                        {item.unidade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right align-top">
                      <p className="text-[#211915] font-bold text-base">
                        {formatCurrency(item.preco_unitario ?? 0)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center text-white/40 text-xs">
            <span>* Valores expressos em Reais (R$)</span>
            <span>Grupo Alfa Tecnologia</span>
          </div>
        </div>
      </div>
    )),

    // Slide - Vigência
    <div key="vigencia" className="flex flex-col h-full p-6 lg:p-12 bg-gradient-to-br from-[#211915] to-[#1a1411]">
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 font-heading text-center">
        Vigência e <span className="text-[#b6c72c]">Condições</span>
      </h2>

      <div className="flex-1 grid grid-cols-2 gap-6 max-w-5xl mx-auto w-full">
        {/* Card Vigência */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group flex flex-col justify-center items-center text-center">
          <div className="w-20 h-20 bg-[#b6c72c]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#b6c72c] transition-colors duration-300">
            <svg className="w-10 h-10 text-[#b6c72c] group-hover:text-[#211915] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Prazo de Vigência</h3>
          <p className="text-5xl font-bold text-[#b6c72c] mb-3 font-heading">{ata.vigencia_meses || 12} <span className="text-2xl font-medium text-white/50">meses</span></p>
          <p className="text-white/60 text-sm max-w-xs">A partir da publicação no Diário Oficial</p>
        </div>

        {/* Card Base Legal */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group flex flex-col justify-center items-center text-center">
          <div className="w-20 h-20 bg-[#b6c72c]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#b6c72c] transition-colors duration-300">
            <svg className="w-10 h-10 text-[#b6c72c] group-hover:text-[#211915] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-4">Base Legal</h3>
          <p className="text-white/90 text-lg leading-relaxed font-medium">
            {ata.base_legal || "Lei nº 14.133/2021"}
          </p>
        </div>

        {/* Card Abrangência */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group flex flex-col justify-center items-center text-center">
          <div className="w-20 h-20 bg-[#b6c72c]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#b6c72c] transition-colors duration-300">
            <svg className="w-10 h-10 text-[#b6c72c] group-hover:text-[#211915] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Abrangência</h3>
          <p className="text-white/90 font-medium text-lg mb-1">Nacional</p>
          <p className="text-white/60 text-sm">Órgãos da Administração Pública Federal, Estadual e Municipal</p>
        </div>

        {/* Card Modalidade */}
        <div className="bg-[#b6c72c] rounded-3xl p-8 border border-[#b6c72c] shadow-[0_0_30px_rgba(182,199,44,0.2)] group flex flex-col justify-center items-center text-center">
          <div className="w-20 h-20 bg-[#211915]/10 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-[#211915]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[#211915] mb-2">Modalidade</h3>
          <p className="text-[#211915] font-bold text-xl mb-2">{ata.modalidade}</p>
          <div className="bg-[#211915]/10 px-4 py-2 rounded-full">
            <p className="text-[#211915] text-sm font-bold uppercase tracking-wider">Adesão Simplificada</p>
          </div>
        </div>
      </div>
    </div>,

    // Slides individuais para cada item executável com suas fotos
    ...itensExecutaveis.map((item) => {
      const imagensDoItem = imagens.filter(img => img.item_id === item.id);
      
      return (
        <div key={`item-${item.id}`} className="flex flex-col h-full p-6 lg:p-12 bg-gradient-to-br from-[#211915] to-[#1a1411] relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b6c72c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />

          <div className="relative z-10 flex flex-col h-full">
            {/* Cabeçalho do Item */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#b6c72c] text-[#211915] text-lg font-bold px-4 py-2 rounded-lg">
                  ITEM {item.numero_item}
                </span>
                <span className="text-white/50 text-sm font-medium">
                  {item.unidade}
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-white font-heading leading-tight mb-4">
                {item.descricao}
              </h2>
              {item.preco_unitario && (
                <p className="text-[#b6c72c] text-xl font-bold">
                  {formatCurrency(item.preco_unitario)} / {item.unidade}
                </p>
              )}
            </div>

            {/* Grid de Fotos */}
            {imagensDoItem.length > 0 ? (
              <div className="flex-1 min-h-0 mb-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-full overflow-y-auto pr-2">
                  {imagensDoItem.map((img) => (
                    <div key={img.id} className="relative group rounded-xl overflow-hidden bg-white/5 border border-white/10 shadow-lg">
                      <div className="aspect-video relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url}
                          alt={img.nome_arquivo || `Item ${item.numero_item} - ${item.descricao}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#211915]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-white/40 text-sm">Nenhuma foto disponível para este item</p>
                </div>
              </div>
            )}

            {/* Descrição de Como Podemos Ajudar */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mt-auto">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#b6c72c]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#b6c72c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[#b6c72c] font-bold text-lg mb-2">Como Podemos Ajudar</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {gerarDescricaoAjuda(item)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }),

    // Slide - Como Aderir
    <div key="adesao" className="flex flex-col h-full p-6 lg:p-12 bg-gradient-to-br from-[#211915] to-[#1a1411] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-[#b6c72c]/5 rounded-full blur-3xl"></div>

      <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 font-heading text-center relative z-10">
        Fluxo de <span className="text-[#b6c72c]">Adesão</span>
      </h2>

      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl w-full">
          {[
            { num: "01", titulo: "Consulta", desc: "Verifique a disponibilidade de saldo e os itens de interesse na Ata.", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
            { num: "02", titulo: "Solicitação", desc: "Envie ofício ao órgão gerenciador solicitando autorização.", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
            { num: "03", titulo: "Autorização", desc: "Aguarde a liberação do órgão e o aceite do fornecedor.", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
            { num: "04", titulo: "Contratação", desc: "Emita a nota de empenho e ordem de serviço.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
          ].map((etapa, index) => (
            <div key={index} className="relative group">
              {/* Linha conectora */}
              {index < 3 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-white/10 -z-10 group-hover:bg-[#b6c72c]/30 transition-colors duration-500" />
              )}

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-[#b6c72c]/50 hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-[#211915] rounded-full flex items-center justify-center border-2 border-[#b6c72c] shadow-[0_0_20px_rgba(182,199,44,0.2)] group-hover:shadow-[0_0_30px_rgba(182,199,44,0.4)] transition-all">
                    <span className="text-[#b6c72c] font-bold text-xl">{etapa.num}</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-[#b6c72c] rounded-full p-1.5 text-[#211915]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={etapa.icon} />
                    </svg>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#b6c72c] transition-colors">{etapa.titulo}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{etapa.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,

    // Slide - Contato
    <div key="contato" className="flex flex-col items-center justify-center h-full p-6 lg:p-12 text-center bg-gradient-to-br from-[#211915] to-[#1a1411] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-5"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#b6c72c]/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-4xl w-full">
        <div className="mb-10">
          <img
            src={settings.logo_url || "/logo-alfa-telecon2.png"}
            alt="Logo Grupo Alfa Tecnologia"
            className="h-24 md:h-32 w-auto mx-auto mb-8 drop-shadow-2xl"
          />
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 font-heading">
            Vamos <span className="text-[#b6c72c]">Trabalhar Juntos?</span>
          </h2>
          <p className="text-white/80 text-xl max-w-2xl mx-auto leading-relaxed">
            Nossa equipe técnica está à disposição para auxiliar em todo o processo de adesão, garantindo agilidade e segurança jurídica.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {/* Telefone */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-[#b6c72c]/50 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 bg-[#b6c72c]/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#b6c72c] transition-colors">
              <svg className="w-7 h-7 text-[#b6c72c] group-hover:text-[#211915]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <p className="text-white/50 text-sm font-bold uppercase tracking-wider mb-1">Telefone</p>
            <p className="text-white font-bold text-lg">(61) 3522-5203</p>
          </div>

          {/* WhatsApp */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-[#b6c72c]/50 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 bg-[#b6c72c]/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#b6c72c] transition-colors">
              <svg className="w-7 h-7 text-[#b6c72c] group-hover:text-[#211915]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <p className="text-white/50 text-sm font-bold uppercase tracking-wider mb-1">WhatsApp</p>
            <p className="text-white font-bold text-lg">(61) 98616-1961</p>
          </div>

          {/* E-mail */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:bg-white/10 hover:border-[#b6c72c]/50 hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-14 h-14 bg-[#b6c72c]/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#b6c72c] transition-colors">
              <svg className="w-7 h-7 text-[#b6c72c] group-hover:text-[#211915]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-white/50 text-sm font-bold uppercase tracking-wider mb-1">E-mail</p>
            <p className="text-white font-bold text-sm break-words">licitacoes@grupoalfatelecom.com.br</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="h-1 w-24 bg-[#b6c72c] rounded-full"></div>
          <p className="text-white/40 text-sm font-medium">
            Brasília - DF • www.grupoalfatecnologia.com.br
          </p>
        </div>
      </div>
    </div>,
  ];

  const generatePDF = useCallback(async () => {
    if (isGeneratingPdf) return;

    if (!slideContainerRef.current) {
      alert("Erro: Container da apresentação não encontrado.");
      return;
    }

    setIsGeneratingPdf(true);
    const originalSlide = currentSlide;

    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [297, 167],
      });

      const slideContainer = slideContainerRef.current;

      for (let i = 0; i < totalSlides; i++) {
        setCurrentSlide(i);
        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
          const imgData = await toPng(slideContainer, {
            quality: 0.95,
            pixelRatio: 2,
            backgroundColor: "#211915",
            cacheBust: true,
            skipFonts: false,
          });

          if (i > 0) {
            pdf.addPage([297, 167], "landscape");
          }

          pdf.addImage(imgData, "PNG", 0, 0, 297, 167);
        } catch (slideError) {
          console.error(`Erro ao capturar slide ${i + 1}:`, slideError);
        }
      }

      const fileName = `ATA-${ata.numero_ata.replace(/[^a-zA-Z0-9]/g, "-")}-Apresentacao.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar o PDF. Por favor, tente novamente.");
    } finally {
      setCurrentSlide(originalSlide);
      setIsGeneratingPdf(false);
    }
  }, [currentSlide, isGeneratingPdf, totalSlides, ata.numero_ata]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
        case " ":
          e.preventDefault();
          nextSlide();
          break;
        case "ArrowLeft":
          e.preventDefault();
          prevSlide();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, nextSlide, prevSlide]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCurrentSlide(0);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const actualTotalSlides = slides.length;

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-[#211915] via-[#2d231e] to-[#211915]" />

      {/* Top Buttons */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <button
          onClick={generatePDF}
          disabled={isGeneratingPdf}
          className="p-3 bg-[#b6c72c] hover:bg-[#9eb025] disabled:bg-[#b6c72c]/50 rounded-full transition-all group flex items-center gap-2"
          aria-label="Baixar PDF da apresentação"
        >
          {isGeneratingPdf ? (
            <>
              <Loader2 className="w-5 h-5 text-[#211915] animate-spin" />
              <span className="text-[#211915] text-sm font-medium pr-1 hidden sm:inline">Gerando...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5 text-[#211915]" />
              <span className="text-[#211915] text-sm font-medium pr-1 hidden sm:inline">Baixar PDF</span>
            </>
          )}
        </button>

        <button
          onClick={onClose}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all group"
          aria-label="Fechar apresentação"
        >
          <X className="w-6 h-6 text-white group-hover:text-[#b6c72c]" />
        </button>
      </div>

      {/* Slide Container - 16:9 */}
      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
        <div
          ref={slideContainerRef}
          className="relative w-full max-w-7xl bg-gradient-to-br from-[#211915] via-[#2d231e] to-[#211915] rounded-2xl shadow-2xl overflow-hidden border border-white/10"
          style={{ aspectRatio: '16/9' }}
        >
          <div className="absolute inset-0 transition-opacity duration-300">
            {slides[currentSlide]}
          </div>

          {/* Navigation Arrows - Oculto durante geração de PDF */}
          {!isGeneratingPdf && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-[#b6c72c] rounded-full transition-all group z-10"
                aria-label="Slide anterior"
              >
                <ChevronLeft className="w-6 h-6 text-white group-hover:text-[#211915]" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-[#b6c72c] rounded-full transition-all group z-10"
                aria-label="Próximo slide"
              >
                <ChevronRight className="w-6 h-6 text-white group-hover:text-[#211915]" />
              </button>
            </>
          )}

          {/* Slide Indicators - Oculto durante geração de PDF */}
          {!isGeneratingPdf && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
                    ? 'w-8 bg-[#b6c72c]'
                    : 'bg-white/30 hover:bg-white/50'
                    }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Slide Counter */}
          <div className="absolute bottom-4 right-4 text-white/40 text-sm z-10">
            {currentSlide + 1} / {actualTotalSlides}
          </div>
        </div>
      </div>
    </div>
  );
}

// Export button component for easy integration
export function AtaApresentacaoButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 border-2 border-[#b6c72c] text-[#b6c72c] px-8 py-4 rounded-full font-bold hover:bg-[#b6c72c] hover:text-[#211915] transition-all"
    >
      <Play className="w-5 h-5" />
      Abrir Apresentação
    </button>
  );
}
