import { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { MapPin, Briefcase, Clock, ChevronRight, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Trabalhe Conosco | Carreiras",
  description:
    "Faça parte da equipe Grupo Alfa Tecnologia. Confira nossas vagas disponíveis em fibra óptica, CFTV, cabeamento estruturado e infraestrutura de TI.",
  keywords: [
    "vagas de emprego tecnologia",
    "trabalhe conosco Brasília",
    "emprego fibra óptica",
    "vaga técnico CFTV",
    "carreira tecnologia",
    "emprego TI Brasília",
  ],
}

const tipoContratoLabels: Record<string, string> = {
  clt: "CLT",
  pj: "PJ",
  estagio: "Estágio",
}

const tipoContratoColors: Record<string, string> = {
  clt: "bg-blue-100 text-blue-700",
  pj: "bg-purple-100 text-purple-700",
  estagio: "bg-green-100 text-green-700",
}

export default async function CarreirasPage() {
  const supabase = await createClient()

  const { data: vagas } = await supabase
    .from("vagas")
    .select("*")
    .eq("ativo", true)
    .order("created_at", { ascending: false })

  const vagasAtivas = vagas || []

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-[#211915] py-20 lg:py-32 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="container mx-auto px-4 lg:px-8 relative">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block text-[#b6c72c] font-semibold text-sm tracking-widest uppercase mb-4">
                Trabalhe Conosco
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-heading">
                Construa sua <span className="text-[#b6c72c]">carreira</span> conosco
              </h1>
              <p className="text-white/70 text-lg md:text-xl leading-relaxed">
                Faça parte de uma equipe que está transformando a infraestrutura de tecnologia
                do Brasil. Buscamos profissionais comprometidos e apaixonados por inovação.
              </p>

              {/* Stats */}
              <div className="flex justify-center gap-8 mt-10">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#b6c72c]">{vagasAtivas.length}</p>
                  <p className="text-white/60 text-sm">Vagas Abertas</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#b6c72c]">50+</p>
                  <p className="text-white/60 text-sm">Colaboradores</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#b6c72c]">10+</p>
                  <p className="text-white/60 text-sm">Anos de Mercado</p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
            >
              <path
                d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                fill="white"
              />
            </svg>
          </div>
        </section>

        {/* Por que trabalhar conosco */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#211915] mb-4 font-heading">
                Por que fazer parte do <span className="text-[#b6c72c]">Grupo Alfa</span>?
              </h2>
              <p className="text-[#211915]/70 max-w-2xl mx-auto">
                Oferecemos um ambiente de trabalho dinâmico, oportunidades de crescimento e
                benefícios competitivos para nossos colaboradores.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: "🚀",
                  title: "Crescimento Profissional",
                  desc: "Oportunidades de desenvolvimento e capacitação contínua",
                },
                {
                  icon: "💰",
                  title: "Benefícios Competitivos",
                  desc: "Salários atrativos, VT, VR e plano de saúde",
                },
                {
                  icon: "🤝",
                  title: "Ambiente Colaborativo",
                  desc: "Equipe unida trabalhando em projetos desafiadores",
                },
                {
                  icon: "🏆",
                  title: "Projetos de Destaque",
                  desc: "Trabalhe em grandes projetos públicos e privados",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-[#f5f5f5] rounded-2xl p-6 hover:bg-[#b6c72c]/10 transition-colors"
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-bold text-[#211915] mb-2">{item.title}</h3>
                  <p className="text-[#211915]/70 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vagas Disponíveis */}
        <section className="py-16 lg:py-24 bg-[#f5f5f5]">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#211915] mb-4 font-heading">
                Vagas <span className="text-[#b6c72c]">Disponíveis</span>
              </h2>
              <p className="text-[#211915]/70 max-w-2xl mx-auto">
                Confira as oportunidades abertas e encontre a vaga ideal para você
              </p>
            </div>

            {vagasAtivas.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl">
                <Users className="h-16 w-16 text-[#211915]/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#211915] mb-2">
                  Nenhuma vaga disponível no momento
                </h3>
                <p className="text-[#211915]/70 max-w-md mx-auto">
                  No momento não temos vagas abertas, mas fique atento! Novas oportunidades
                  podem surgir a qualquer momento.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {vagasAtivas.map((vaga) => (
                  <Link
                    key={vaga.id}
                    href={`/carreiras/${vaga.id}`}
                    className="group bg-white rounded-2xl p-6 hover:shadow-lg transition-all border border-transparent hover:border-[#b6c72c]/30"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-[#211915] group-hover:text-[#b6c72c] transition-colors">
                            {vaga.titulo}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              tipoContratoColors[vaga.tipo_contrato] || "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {tipoContratoLabels[vaga.tipo_contrato] || vaga.tipo_contrato}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-[#211915]/60">
                          {vaga.local && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {vaga.local}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" />
                            {tipoContratoLabels[vaga.tipo_contrato] || vaga.tipo_contrato}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(vaga.created_at!).toLocaleDateString("pt-BR")}
                          </span>
                        </div>

                        {vaga.descricao && (
                          <p className="text-[#211915]/70 mt-3 line-clamp-2">
                            {vaga.descricao}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[#b6c72c] font-semibold">
                        Ver Detalhes
                        <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-[#211915]">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-heading">
              Não encontrou a vaga <span className="text-[#b6c72c]">ideal</span>?
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto mb-8">
              Envie seu currículo para nosso banco de talentos. Quando surgir uma oportunidade
              compatível com seu perfil, entraremos em contato.
            </p>
            <a
              href="mailto:rh@grupoalfatelecom.com.br"
              className="inline-flex items-center gap-2 bg-[#b6c72c] text-[#211915] px-8 py-4 rounded-full font-bold hover:bg-[#9eb025] transition-all hover:shadow-xl"
            >
              Enviar Currículo por E-mail
              <ChevronRight className="h-5 w-5" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

