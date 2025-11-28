import { Metadata } from "next"
import { notFound } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { ArrowLeft, MapPin, Briefcase, CheckCircle, Gift } from "lucide-react"
import { CandidaturaForm } from "./CandidaturaForm"

interface Props {
  params: Promise<{ id: string }>
}

const tipoContratoLabels: Record<string, string> = {
  clt: "CLT",
  pj: "PJ",
  estagio: "Estágio",
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: vaga } = await supabase
    .from("vagas")
    .select("titulo, descricao, local")
    .eq("id", id)
    .eq("ativo", true)
    .single()

  if (!vaga) {
    return {
      title: "Vaga não encontrada",
    }
  }

  return {
    title: `${vaga.titulo} | Trabalhe Conosco`,
    description: vaga.descricao || `Candidate-se para a vaga de ${vaga.titulo} no Grupo Alfa Tecnologia`,
  }
}

export default async function VagaDetalhePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: vaga, error } = await supabase
    .from("vagas")
    .select("*")
    .eq("id", id)
    .eq("ativo", true)
    .single()

  if (error || !vaga) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f5f5f5]">
        {/* Header da Vaga */}
        <section className="bg-[#211915] py-12 lg:py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <Link
              href="/carreiras"
              className="inline-flex items-center text-white/60 hover:text-white text-sm mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar para Vagas
            </Link>

            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-[#b6c72c] text-[#211915]">
                  {tipoContratoLabels[vaga.tipo_contrato] || vaga.tipo_contrato}
                </span>
                {vaga.local && (
                  <span className="flex items-center gap-1 text-white/60 text-sm">
                    <MapPin className="h-4 w-4" />
                    {vaga.local}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 font-heading">
                {vaga.titulo}
              </h1>

              {vaga.descricao && (
                <p className="text-white/70 text-lg leading-relaxed">
                  {vaga.descricao}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Conteúdo */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Detalhes da Vaga */}
              <div className="lg:col-span-2 space-y-8">
                {/* Requisitos */}
                {vaga.requisitos && (
                  <div className="bg-white rounded-2xl p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-[#b6c72c]/20 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-[#b6c72c]" />
                      </div>
                      <h2 className="text-xl font-bold text-[#211915] font-heading">
                        Requisitos
                      </h2>
                    </div>
                    <div className="text-[#211915]/70 whitespace-pre-line leading-relaxed">
                      {vaga.requisitos}
                    </div>
                  </div>
                )}

                {/* Benefícios */}
                {vaga.beneficios && (
                  <div className="bg-white rounded-2xl p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-[#b6c72c]/20 flex items-center justify-center">
                        <Gift className="h-5 w-5 text-[#b6c72c]" />
                      </div>
                      <h2 className="text-xl font-bold text-[#211915] font-heading">
                        Benefícios
                      </h2>
                    </div>
                    <div className="text-[#211915]/70 whitespace-pre-line leading-relaxed">
                      {vaga.beneficios}
                    </div>
                  </div>
                )}

                {/* Informações da Vaga */}
                <div className="bg-white rounded-2xl p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-[#b6c72c]/20 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-[#b6c72c]" />
                    </div>
                    <h2 className="text-xl font-bold text-[#211915] font-heading">
                      Informações da Vaga
                    </h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#f5f5f5] rounded-xl">
                      <p className="text-sm text-[#211915]/60 mb-1">Tipo de Contrato</p>
                      <p className="font-semibold text-[#211915]">
                        {tipoContratoLabels[vaga.tipo_contrato] || vaga.tipo_contrato}
                      </p>
                    </div>
                    <div className="p-4 bg-[#f5f5f5] rounded-xl">
                      <p className="text-sm text-[#211915]/60 mb-1">Local de Trabalho</p>
                      <p className="font-semibold text-[#211915]">
                        {vaga.local || "A definir"}
                      </p>
                    </div>
                    <div className="p-4 bg-[#f5f5f5] rounded-xl">
                      <p className="text-sm text-[#211915]/60 mb-1">Publicada em</p>
                      <p className="font-semibold text-[#211915]">
                        {new Date(vaga.created_at!).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulário de Candidatura */}
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <CandidaturaForm vagaId={vaga.id} vagaTitulo={vaga.titulo} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

