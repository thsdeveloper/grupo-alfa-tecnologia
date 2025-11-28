"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ScrollText,
  Building,
  Calendar,
  ArrowRight,
  Loader2,
  CheckCircle,
  Search,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Ata {
  id: string;
  slug: string;
  numero_ata: string;
  orgao_gerenciador: string;
  orgao_gerenciador_sigla: string | null;
  modalidade: string;
  vigencia_meses: number | null;
  status: string;
  objeto: string | null;
  created_at: string | null;
}

export default function AtasRegistroPrecoPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [atas, setAtas] = useState<Ata[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAtas = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("atas_registro_preco")
        .select("*")
        .eq("ativo", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAtas(data || []);
    } catch (error) {
      console.error("Erro ao buscar ATAs:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAtas();
  }, [fetchAtas]);

  const filteredAtas = atas.filter(
    (ata) =>
      ata.numero_ata.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ata.orgao_gerenciador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ata.orgao_gerenciador_sigla?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ata.objeto?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const atasVigentes = filteredAtas.filter((a) => a.status === "vigente");
  const atasExpiradas = filteredAtas.filter((a) => a.status !== "vigente");

  return (
    <>
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
              <span className="inline-block bg-[#b6c72c]/20 text-[#b6c72c] px-4 py-2 rounded-full text-sm font-semibold mb-6">
                CONTRATAÇÃO SIMPLIFICADA PARA ÓRGÃOS PÚBLICOS
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-heading">
                Ata de Registro de <span className="text-[#b6c72c]">Preço</span>
              </h1>

              <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto mb-8">
                O Grupo Alfa Tecnologia possui Ata de Registro de Preço (ARP) vigente,
                permitindo que órgãos públicos federais, estaduais e municipais contratem
                nossos serviços de forma rápida e segura, sem necessidade de novo processo
                licitatório.
              </p>

              <div className="inline-flex items-center gap-2 text-[#b6c72c] text-sm">
                <CheckCircle className="w-5 h-5" />
                <span>Em conformidade com a Lei 14.133/2021</span>
              </div>
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section className="py-12 bg-[#b6c72c]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4">
                <span className="text-3xl md:text-4xl font-bold text-[#211915] block">Sem</span>
                <span className="text-[#211915]/70 text-sm md:text-base">Nova Licitação</span>
              </div>
              <div className="p-4">
                <span className="text-3xl md:text-4xl font-bold text-[#211915] block">100%</span>
                <span className="text-[#211915]/70 text-sm md:text-base">Legal (Lei 14.133)</span>
              </div>
              <div className="p-4">
                <span className="text-3xl md:text-4xl font-bold text-[#211915] block">26</span>
                <span className="text-[#211915]/70 text-sm md:text-base">Estados Atendidos</span>
              </div>
              <div className="p-4">
                <span className="text-3xl md:text-4xl font-bold text-[#211915] block">500+</span>
                <span className="text-[#211915]/70 text-sm md:text-base">Projetos Executados</span>
              </div>
            </div>
          </div>
        </section>

        {/* Lista de ATAs */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <header className="text-center mb-12">
              <span className="text-[#b6c72c] font-semibold text-sm tracking-widest uppercase mb-4 block">
                Nossas ATAs
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#211915] font-heading mb-4">
                Atas de Registro de Preço Disponíveis
              </h2>
              <p className="text-[#211915]/60 max-w-2xl mx-auto">
                Selecione uma ATA para ver todos os detalhes, itens disponíveis e iniciar
                o processo de adesão.
              </p>
            </header>

            {/* Search */}
            <div className="max-w-xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#211915]/40" />
                <input
                  type="text"
                  placeholder="Buscar por número, órgão ou objeto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[#211915]/10 focus:border-[#b6c72c] focus:ring-2 focus:ring-[#b6c72c]/20 outline-none transition-all"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-[#b6c72c]" />
              </div>
            ) : filteredAtas.length === 0 ? (
              <div className="text-center py-20">
                <ScrollText className="h-16 w-16 text-[#211915]/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#211915] mb-2">
                  {searchTerm ? "Nenhuma ATA encontrada" : "Nenhuma ATA disponível"}
                </h3>
                <p className="text-[#211915]/60">
                  {searchTerm
                    ? "Tente ajustar sua busca"
                    : "Em breve teremos novas ATAs disponíveis"}
                </p>
              </div>
            ) : (
              <>
                {/* ATAs Vigentes */}
                {atasVigentes.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-xl font-bold text-[#211915] mb-6 flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      ATAs Vigentes
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {atasVigentes.map((ata) => (
                        <Link
                          key={ata.id}
                          href={`/ata-registro-preco/${ata.slug}`}
                          className="group bg-gradient-to-br from-[#f8f9f3] to-white rounded-2xl p-6 border border-[#b6c72c]/10 hover:border-[#b6c72c]/30 transition-all hover:shadow-xl"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="h-12 w-12 rounded-xl bg-[#b6c72c]/20 flex items-center justify-center group-hover:bg-[#b6c72c] transition-colors">
                              <ScrollText className="h-6 w-6 text-[#b6c72c] group-hover:text-[#211915] transition-colors" />
                            </div>
                            <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                              Vigente
                            </span>
                          </div>

                          <h4 className="text-lg font-bold text-[#211915] mb-2 group-hover:text-[#b6c72c] transition-colors">
                            ARP Nº {ata.numero_ata}
                          </h4>

                          <div className="space-y-2 mb-4">
                            <p className="text-sm text-[#211915]/60 flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              {ata.orgao_gerenciador_sigla || ata.orgao_gerenciador}
                            </p>
                            {ata.vigencia_meses && (
                              <p className="text-sm text-[#211915]/60 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Vigência: {ata.vigencia_meses} meses
                              </p>
                            )}
                          </div>

                          {ata.objeto && (
                            <p className="text-sm text-[#211915]/70 line-clamp-2 mb-4">
                              {ata.objeto}
                            </p>
                          )}

                          <div className="flex items-center gap-2 text-[#b6c72c] text-sm font-semibold group-hover:gap-3 transition-all">
                            Ver detalhes
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* ATAs Expiradas */}
                {atasExpiradas.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-[#211915]/60 mb-6">ATAs Anteriores</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                      {atasExpiradas.map((ata) => (
                        <Link
                          key={ata.id}
                          href={`/ata-registro-preco/${ata.slug}`}
                          className="group bg-gray-50 rounded-2xl p-6 border border-gray-200 transition-all hover:shadow-md"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="h-12 w-12 rounded-xl bg-gray-200 flex items-center justify-center">
                              <ScrollText className="h-6 w-6 text-gray-500" />
                            </div>
                            <span className="inline-flex items-center gap-1.5 bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                              {ata.status === "expirada" ? "Expirada" : "Suspensa"}
                            </span>
                          </div>

                          <h4 className="text-lg font-bold text-[#211915] mb-2">
                            ARP Nº {ata.numero_ata}
                          </h4>

                          <p className="text-sm text-[#211915]/60 flex items-center gap-2 mb-4">
                            <Building className="h-4 w-4" />
                            {ata.orgao_gerenciador_sigla || ata.orgao_gerenciador}
                          </p>

                          <div className="flex items-center gap-2 text-[#211915]/50 text-sm font-semibold">
                            Ver histórico
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Como Funciona */}
        <section className="py-20 bg-[#f5f5f5]">
          <div className="container mx-auto px-4 lg:px-8">
            <header className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#211915] font-heading">
                Como Funciona a Adesão
              </h2>
            </header>

            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                {
                  numero: "01",
                  titulo: "Escolha a ATA",
                  descricao: "Selecione a Ata de Registro de Preço que atende suas necessidades",
                },
                {
                  numero: "02",
                  titulo: "Verifique os Itens",
                  descricao: "Confira os serviços disponíveis, quantidades e preços registrados",
                },
                {
                  numero: "03",
                  titulo: "Solicite Autorização",
                  descricao: "Envie ofício ao órgão gerenciador solicitando adesão à ATA",
                },
                {
                  numero: "04",
                  titulo: "Contrate",
                  descricao: "Com a autorização, emita a ordem de serviço e inicie o projeto",
                },
              ].map((etapa, index) => (
                <div
                  key={index}
                  className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="absolute -top-4 left-6 w-10 h-10 bg-[#b6c72c] rounded-xl flex items-center justify-center text-[#211915] font-bold text-lg shadow-lg">
                    {etapa.numero}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-bold text-[#211915] mb-2">{etapa.titulo}</h3>
                    <p className="text-[#211915]/60 text-sm">{etapa.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-[#b6c72c] to-[#9eb025]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-[#211915] mb-6 font-heading">
                Dúvidas sobre Adesão?
              </h2>
              <p className="text-[#211915]/70 text-lg mb-8">
                Nossa equipe está pronta para esclarecer todas as suas dúvidas sobre nossas
                Atas de Registro de Preço e auxiliar no processo de adesão.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="https://wa.me/5561986161961?text=Olá! Gostaria de informações sobre Atas de Registro de Preço."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-[#211915] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#2d231e] transition-all hover:shadow-xl"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
                <a
                  href="mailto:licitacoes@grupoalfatelecom.com.br?subject=Informações sobre ATAs de Registro de Preço"
                  className="inline-flex items-center justify-center gap-3 bg-white text-[#211915] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:shadow-xl"
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
