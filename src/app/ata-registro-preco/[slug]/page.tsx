"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useParams, notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AtaApresentacao from "@/components/AtaApresentacao";
import { Play, Loader2, Scale, Calendar, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Ata {
  id: string;
  slug: string;
  numero_ata: string;
  orgao_gerenciador: string;
  orgao_gerenciador_sigla: string | null;
  modalidade: string;
  numero_planejamento: string | null;
  vigencia_meses: number | null;
  data_inicio: string | null;
  data_fim: string | null;
  status: string;
  objeto: string | null;
  fornecedor_nome: string;
  fornecedor_cnpj: string;
  base_legal: string | null;
  pdf_ata_url: string | null;
  pdf_ata_nome: string | null;
  pdf_termo_url: string | null;
  pdf_termo_nome: string | null;
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

export default function AtaDetalhe() {
  const params = useParams();
  const slug = params.slug as string;
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [ata, setAta] = useState<Ata | null>(null);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [itens, setItens] = useState<Item[]>([]);
  const [imagens, setImagens] = useState<ItemImagem[]>([]);
  const [showApresentacao, setShowApresentacao] = useState(false);

  const fetchAta = useCallback(async () => {
    setLoading(true);
    try {
      const { data: ataData, error: ataError } = await supabase
        .from("atas_registro_preco")
        .select("*")
        .eq("slug", slug)
        .eq("ativo", true)
        .single();

      if (ataError || !ataData) {
        notFound();
        return;
      }

      const [{ data: lotesData }, { data: itensData }] = await Promise.all([
        supabase
          .from("ata_lotes")
          .select("*")
          .eq("ata_id", ataData.id)
          .eq("ativo", true)
          .order("ordem"),
        supabase
          .from("ata_itens")
          .select("*")
          .eq("ata_id", ataData.id)
          .eq("ativo", true)
          .eq("executavel", true) // Filtrar apenas serviços que a empresa executa
          .order("ordem"),
      ]);

      // Buscar imagens dos itens
      const itemIds = (itensData || []).map(i => i.id);
      const { data: imagensData } = await supabase
        .from("ata_item_imagens")
        .select("*")
        .in("item_id", itemIds.length > 0 ? itemIds : ['none'])
        .order("ordem");

      setAta(ataData);
      setLotes(lotesData || []);
      setItens(itensData || []);
      setImagens(imagensData || []);
    } catch (error) {
      console.error("Erro ao buscar ATA:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase, slug]);

  useEffect(() => {
    fetchAta();
  }, [fetchAta]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#211915] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-[#b6c72c]" />
      </div>
    );
  }

  if (!ata) {
    notFound();
    return null;
  }

  const documentos = [
    {
      nome: "Ata de Registro de Preço",
      descricao: `Documento completo da ARP ${ata.numero_ata}`,
      url: ata.pdf_ata_url,
    },
    {
      nome: "Termo de Referência",
      descricao: "Especificações técnicas dos serviços",
      url: ata.pdf_termo_url,
    },
  ].filter((doc) => doc.url);

  const etapasAdesao = [
    {
      numero: "01",
      titulo: "Consulta de Disponibilidade",
      descricao:
        "Entre em contato conosco para verificar a disponibilidade de saldo na Ata e os itens desejados.",
    },
    {
      numero: "02",
      titulo: "Solicitação Formal",
      descricao: `O órgão interessado deve enviar ofício ao órgão gerenciador (${ata.orgao_gerenciador_sigla || ata.orgao_gerenciador}) solicitando autorização para adesão.`,
    },
    {
      numero: "03",
      titulo: "Autorização",
      descricao:
        "Após autorização do órgão gerenciador e aceite do fornecedor, a adesão é formalizada.",
    },
    {
      numero: "04",
      titulo: "Contratação",
      descricao:
        "Com a adesão aprovada, o órgão pode emitir a ordem de serviço e iniciar a execução.",
    },
  ];

  // Agrupar itens por lote
  const itensAgrupados = lotes.map((lote) => ({
    ...lote,
    itens: itens.filter((item) => item.lote_id === lote.id),
  }));
  const itensSemLote = itens.filter((item) => !item.lote_id);

  return (
    <>
      {/* Modal de Apresentação */}
      <AtaApresentacao
        isOpen={showApresentacao}
        onClose={() => setShowApresentacao(false)}
        ata={ata}
        itens={itens}
        lotes={lotes}
        imagens={imagens}
      />

      <Header />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#211915] via-[#2d231e] to-[#211915] py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b6c72c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badges de Status e Órgão */}
              <div className="flex flex-wrap justify-center items-center gap-3 mb-8">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    ata.status === "vigente"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      ata.status === "vigente" ? "bg-green-500 animate-pulse" : "bg-yellow-500"
                    }`}
                  />
                  {ata.status}
                </span>

                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#b6c72c]/20 text-[#b6c72c] uppercase tracking-wider">
                  {ata.orgao_gerenciador_sigla || ata.orgao_gerenciador}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 font-heading tracking-tight">
                ATA <span className="text-[#b6c72c]">{ata.numero_ata}</span>
              </h1>

              <p className="text-white/50 text-lg font-light mb-8 tracking-wide uppercase">
                Registro de Preço
              </p>

              {ata.objeto && (
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/10 mb-8 shadow-2xl">
                  <p className="text-white/90 text-lg md:text-xl leading-relaxed font-medium">
                    {ata.objeto}
                  </p>
                </div>
              )}

              {/* Informações Meta */}
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-white/60 mb-10 font-medium">
                {ata.base_legal && (
                  <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                    <Scale className="w-4 h-4 text-[#b6c72c]" />
                    <span className="max-w-[300px] truncate" title={ata.base_legal}>
                      {ata.base_legal}
                    </span>
                  </div>
                )}
                {ata.vigencia_meses && (
                  <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                    <Calendar className="w-4 h-4 text-[#b6c72c]" />
                    <span>Vigência: {ata.vigencia_meses} meses</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                  <FileText className="w-4 h-4 text-[#b6c72c]" />
                  <span>{ata.modalidade}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="#informacoes"
                  className="inline-flex items-center gap-2 bg-[#b6c72c] text-[#211915] px-8 py-4 rounded-full font-bold hover:bg-[#9eb025] transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(182,199,44,0.3)]"
                >
                  Ver Itens e Preços
                </a>
                <button
                  onClick={() => setShowApresentacao(true)}
                  className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-full font-bold hover:bg-white/20 transition-all backdrop-blur-sm border border-white/10 hover:border-white/30"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Apresentação
                </button>
                <a
                  href="#contato-ata"
                  className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all"
                >
                  Solicitar Adesão
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Informações da ATA */}
        <section id="informacoes" className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Card Principal */}
              <article className="bg-gradient-to-br from-[#f8f9f3] to-white rounded-3xl p-8 lg:p-10 border border-[#b6c72c]/20 shadow-xl">
                <h2 className="text-2xl font-bold text-[#211915] mb-6 font-heading">
                  Dados da Ata de Registro de Preço
                </h2>

                <dl className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-[#211915]/10">
                    <dt className="text-[#211915]/60 font-medium">Número da Ata</dt>
                    <dd className="text-[#211915] font-bold">{ata.numero_ata}</dd>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-[#211915]/10">
                    <dt className="text-[#211915]/60 font-medium">Órgão Gerenciador</dt>
                    <dd className="text-[#211915] font-bold text-right">
                      {ata.orgao_gerenciador_sigla || ata.orgao_gerenciador}
                    </dd>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-[#211915]/10">
                    <dt className="text-[#211915]/60 font-medium">Modalidade</dt>
                    <dd className="text-[#211915] font-bold">{ata.modalidade}</dd>
                  </div>
                  {ata.numero_planejamento && (
                    <div className="flex justify-between items-center py-3 border-b border-[#211915]/10">
                      <dt className="text-[#211915]/60 font-medium">Planejamento</dt>
                      <dd className="text-[#211915] font-bold">{ata.numero_planejamento}</dd>
                    </div>
                  )}
                  {lotes.length > 0 && (
                    <div className="flex justify-between items-center py-3 border-b border-[#211915]/10">
                      <dt className="text-[#211915]/60 font-medium">Lotes</dt>
                      <dd className="text-[#211915] font-bold">
                        {lotes.map((l) => l.numero).join(", ")}
                      </dd>
                    </div>
                  )}
                  {ata.vigencia_meses && (
                    <div className="flex justify-between items-center py-3 border-b border-[#211915]/10">
                      <dt className="text-[#211915]/60 font-medium">Vigência</dt>
                      <dd className="text-[#211915] font-bold">{ata.vigencia_meses} meses</dd>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-3">
                    <dt className="text-[#211915]/60 font-medium">Status</dt>
                    <dd className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      {ata.status === "vigente" ? "Vigente" : ata.status}
                    </dd>
                  </div>
                </dl>

                <div className="mt-8 p-4 bg-[#b6c72c]/10 rounded-xl">
                  <p className="text-[#211915]/70 text-sm">
                    <strong className="text-[#211915]">Fornecedor:</strong>{" "}
                    {ata.fornecedor_nome}
                    <br />
                    <strong className="text-[#211915]">CNPJ:</strong> {ata.fornecedor_cnpj}
                  </p>
                </div>
              </article>

              {/* Informações Complementares */}
              <div className="space-y-6">
                <article className="bg-[#211915] rounded-3xl p-8 text-white">
                  <h3 className="text-xl font-bold mb-4 font-heading">
                    Por que aderir à nossa ATA?
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Preços já homologados e competitivos",
                      "Dispensa de novo processo licitatório",
                      "Conformidade com a Lei 14.133/2021",
                      "Empresa com experiência comprovada",
                      "Equipe técnica qualificada",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <svg
                          className="w-5 h-5 text-[#b6c72c] flex-shrink-0 mt-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-white/80">{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>

                {ata.base_legal && (
                  <article className="bg-gradient-to-r from-[#b6c72c]/10 to-[#b6c72c]/5 rounded-3xl p-8 border border-[#b6c72c]/20">
                    <h3 className="text-xl font-bold text-[#211915] mb-4 font-heading">
                      Base Legal
                    </h3>
                    <p className="text-[#211915]/70">{ata.base_legal}</p>
                  </article>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Itens da ATA */}
        {itens.length > 0 && (
          <section className="py-20 bg-[#f5f5f5]">
            <div className="container mx-auto px-4 lg:px-8">
              <header className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#211915] font-heading">
                  Itens da Ata de Registro de Preço
                </h2>
              </header>

              {itensAgrupados.map((lote) =>
                lote.itens.length > 0 ? (
                  <div key={lote.id} className="mb-8">
                    <h3 className="text-xl font-bold text-[#211915] mb-4">
                      Lote {lote.numero}
                      {lote.descricao && (
                        <span className="font-normal text-[#211915]/60">
                          {" "}
                          - {lote.descricao}
                        </span>
                      )}
                    </h3>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-[#211915] text-white">
                            <tr>
                              <th className="px-6 py-4 text-left text-sm font-semibold">Item</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold">Descrição</th>
                              <th className="px-6 py-4 text-center text-sm font-semibold">Unidade</th>
                              <th className="px-6 py-4 text-right text-sm font-semibold">Qtd</th>
                              <th className="px-6 py-4 text-right text-sm font-semibold">Preço Unit.</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {lote.itens.map((item) => (
                              <tr key={item.id} className="hover:bg-[#b6c72c]/5">
                                <td className="px-6 py-4">
                                  <span className="inline-flex items-center justify-center w-10 h-10 bg-[#b6c72c]/10 text-[#b6c72c] font-bold rounded-lg">
                                    {item.numero_item}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-[#211915]">{item.descricao}</td>
                                <td className="px-6 py-4 text-center">
                                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                                    {item.unidade}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right text-[#211915]/70">
                                  {(item.quantidade ?? 0).toLocaleString("pt-BR")}
                                </td>
                                <td className="px-6 py-4 text-right font-semibold text-[#b6c72c]">
                                  {(item.preco_unitario ?? 0).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : null
              )}

              {itensSemLote.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#211915] text-white">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Item</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold">Descrição</th>
                          <th className="px-6 py-4 text-center text-sm font-semibold">Unidade</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold">Qtd</th>
                          <th className="px-6 py-4 text-right text-sm font-semibold">Preço Unit.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {itensSemLote.map((item) => (
                          <tr key={item.id} className="hover:bg-[#b6c72c]/5">
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center justify-center w-10 h-10 bg-[#b6c72c]/10 text-[#b6c72c] font-bold rounded-lg">
                                {item.numero_item}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-[#211915]">{item.descricao}</td>
                            <td className="px-6 py-4 text-center">
                              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                                {item.unidade}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right text-[#211915]/70">
                              {(item.quantidade ?? 0).toLocaleString("pt-BR")}
                            </td>
                            <td className="px-6 py-4 text-right font-semibold text-[#b6c72c]">
                              {(item.preco_unitario ?? 0).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Galeria de Imagens */}
        {imagens.length > 0 && (
          <section className="py-20 bg-white relative z-10">
            <div className="container mx-auto px-4 lg:px-8">
              <header className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-[#211915] font-heading">
                  Galeria de Serviços
                </h2>
                <p className="text-[#211915]/70 mt-4 text-lg">
                  Registros fotográficos dos serviços executados e materiais fornecidos
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {imagens.map((img) => {
                  const item = itens.find((i) => i.id === img.item_id);
                  return (
                    <div
                      key={img.id}
                      className="group relative aspect-video overflow-hidden rounded-2xl bg-gray-100 shadow-lg transition-all hover:shadow-xl"
                    >
                      <Image
                        src={img.url}
                        alt={img.nome_arquivo || item?.descricao || "Imagem do serviço"}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                          {item && (
                            <span className="inline-block bg-[#b6c72c] text-[#211915] text-xs font-bold px-2 py-1 rounded mb-2">
                              Item {item.numero_item}
                            </span>
                          )}
                          <p className="text-white font-medium text-sm leading-relaxed line-clamp-2">
                            {img.nome_arquivo || item?.descricao}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Etapas da Adesão */}
        <section className="py-20 bg-[#f5f5f5]">
          <div className="container mx-auto px-4 lg:px-8">
            <header className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#211915] font-heading">
                Como Realizar a Adesão
              </h2>
            </header>

            <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {etapasAdesao.map((etapa, index) => (
                <li
                  key={index}
                  className="relative bg-gradient-to-br from-[#f8f9f3] to-white rounded-2xl p-6 border border-[#b6c72c]/10 hover:border-[#b6c72c]/30 transition-all hover:shadow-lg"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#b6c72c] rounded-xl flex items-center justify-center text-[#211915] font-bold text-xl shadow-lg">
                    {etapa.numero}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-bold text-[#211915] mb-2">{etapa.titulo}</h3>
                    <p className="text-[#211915]/60 text-sm">{etapa.descricao}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Documentos */}
        {documentos.length > 0 && (
          <section className="py-20 bg-[#211915]">
            <div className="container mx-auto px-4 lg:px-8">
              <header className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white font-heading">
                  Documentos Disponíveis
                </h2>
              </header>

              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                {documentos.map((doc, index) => (
                  <a
                    key={index}
                    href={doc.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#b6c72c]/50 rounded-2xl p-6 transition-all group"
                  >
                    <h3 className="text-white font-bold mb-2">{doc.nome}</h3>
                    <p className="text-white/60 text-sm">{doc.descricao}</p>
                    <div className="mt-4 flex items-center gap-2 text-[#b6c72c] text-sm font-medium">
                      Baixar documento
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA / Contato */}
        <section id="contato-ata" className="py-20 bg-gradient-to-br from-[#b6c72c] to-[#9eb025]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#211915] mb-6 font-heading">
                Pronto para Aderir?
              </h2>
              <p className="text-[#211915]/70 text-lg mb-8 max-w-2xl mx-auto">
                Entre em contato com nossa equipe comercial para obter informações atualizadas
                sobre a ARP {ata.numero_ata} e iniciar o processo de adesão.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href={`https://wa.me/5561986161961?text=Olá! Gostaria de informações sobre a Ata de Registro de Preço ${ata.numero_ata}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-[#211915] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#2d231e] transition-all"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
                <a
                  href={`mailto:licitacoes@grupoalfatelecom.com.br?subject=Solicitação - ARP ${ata.numero_ata}`}
                  className="inline-flex items-center justify-center gap-3 bg-white text-[#211915] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </main>
      <Footer />
    </>
  );
}

