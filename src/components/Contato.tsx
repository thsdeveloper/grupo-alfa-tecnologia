export default function Contato() {
  const contatos = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      title: "Endereço",
      info: "QN 07 conjunto 05 lote 15",
      subinfo: "Riacho Fundo I, Brasília - DF",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      title: "Telefones",
      info: "(61) 3522-5203",
      subinfo: "(61) 98315-5525",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      ),
      title: "Site",
      info: "www.grupoalfatelecom.com.br",
      subinfo: "",
      link: "https://www.grupoalfatelecom.com.br",
    },
  ];

  return (
    <section id="contato" className="py-20 lg:py-32 bg-white relative overflow-hidden">
      {/* Elemento decorativo */}
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-[#b6c72c]/5 to-transparent" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Lado esquerdo - Informações */}
          <div className="animate-fade-in-up">
            <span className="text-[#b6c72c] font-semibold text-sm tracking-widest uppercase mb-4 block">
              Entre em Contato
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#211915] mb-6 font-heading">
              Fale com a <span className="text-[#b6c72c]">Nossa Equipe</span>
            </h2>

            <p className="text-[#211915]/70 text-lg mb-10">
              Estamos prontos para atender sua demanda. Entre em contato para
              solicitar um orçamento, tirar dúvidas ou agendar uma reunião.
            </p>

            {/* Cards de contato */}
            <div className="space-y-4">
              {contatos.map((contato, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-[#f5f5f5] rounded-xl hover:bg-[#b6c72c]/10 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#b6c72c] rounded-xl flex items-center justify-center text-[#211915] flex-shrink-0">
                    {contato.icon}
                  </div>
                  <div>
                    <h3 className="text-[#211915] font-bold mb-1">{contato.title}</h3>
                    {contato.link ? (
                      <a
                        href={contato.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#b6c72c] hover:underline"
                      >
                        {contato.info}
                      </a>
                    ) : (
                      <p className="text-[#211915]/70">{contato.info}</p>
                    )}
                    {contato.subinfo && (
                      <p className="text-[#211915]/70">{contato.subinfo}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Botão WhatsApp */}
            <a
              href="https://wa.me/5561983155525"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-bold mt-8 hover:bg-[#20bd5a] transition-all hover:shadow-xl"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Entrar em Contato Agora
            </a>
          </div>

          {/* Lado direito - Formulário */}
          <div className="animate-fade-in-up delay-200">
            <div className="bg-[#211915] rounded-3xl p-8 lg:p-10">
              <h3 className="text-white text-2xl font-bold mb-6 font-heading">
                Solicite um Orçamento
              </h3>

              <form className="space-y-4">
                <div>
                  <label className="text-white/70 text-sm mb-2 block">Nome completo</label>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:border-[#b6c72c] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-white/70 text-sm mb-2 block">E-mail</label>
                  <input
                    type="email"
                    placeholder="seu@email.gov.br"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:border-[#b6c72c] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-white/70 text-sm mb-2 block">Telefone</label>
                  <input
                    type="tel"
                    placeholder="(00) 00000-0000"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:border-[#b6c72c] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-white/70 text-sm mb-2 block">Órgão/Instituição</label>
                  <input
                    type="text"
                    placeholder="Nome do órgão"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:border-[#b6c72c] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-white/70 text-sm mb-2 block">Mensagem</label>
                  <textarea
                    rows={4}
                    placeholder="Descreva sua necessidade..."
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:border-[#b6c72c] focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#b6c72c] text-[#211915] py-4 rounded-xl font-bold hover:bg-[#9eb025] transition-all hover:shadow-xl hover:shadow-[#b6c72c]/30"
                >
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
