import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const linksServicos = [
    { label: "Fibra Óptica", href: "/servicos/rede-optica", title: "Instalação de Fibra Óptica via Ata de Registro de Preço" },
    { label: "Cabeamento Estruturado", href: "/servicos/rede-logica", title: "Cabeamento Estruturado Cat6 e Cat6A para Órgãos Públicos" },
    { label: "CFTV e Câmeras", href: "/servicos/cftv-seguranca", title: "Instalação de CFTV e Câmeras IP via ARP" },
    { label: "Controle de Acesso", href: "/servicos/controle-acesso", title: "Sistemas de Controle de Acesso para Órgãos Públicos" },
    { label: "Rede Elétrica", href: "/servicos/rede-eletrica", title: "Infraestrutura Elétrica para TI" },
    { label: "Consultoria", href: "/servicos/consultoria-projetos", title: "Consultoria em Infraestrutura de TI" },
  ];

  const linksEmpresa = [
    { label: "Sobre Nós", href: "/sobre", title: "Conheça o Grupo Alfa Tecnologia", isPage: true },
    { label: "Portfólio", href: "/#portfolio", title: "Projetos executados em órgãos públicos", isPage: false },
    { label: "Diferenciais", href: "/#diferenciais", title: "Por que escolher o Grupo Alfa", isPage: false },
    { label: "Ata de Registro de Preço", href: "/ata-registro-preco", title: "Informações sobre ARP para contratação direta", isPage: true },
    { label: "Contato", href: "/#contato", title: "Entre em contato conosco", isPage: false },
  ];

  return (
    <footer className="bg-[#211915] pt-16 pb-8" role="contentinfo" aria-label="Rodapé do site">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Grid principal */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-white/10">
          {/* Logo e descrição */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center mb-6"
              aria-label="Grupo Alfa Tecnologia - Ir para o topo"
              title="Grupo Alfa Tecnologia - Ata de Registro de Preço"
            >
              <img
                src="/logo-alfa-telecon2.png"
                alt="Logo Grupo Alfa Tecnologia - Empresa de Infraestrutura de TI com Ata de Registro de Preço para Órgãos Públicos"
                className="h-24 w-auto"
                width={240}
                height={96}
                loading="lazy"
              />
            </Link>
            <p className="text-white/60 text-sm mb-6">
              Empresa especializada em <strong className="text-white/80">infraestrutura de TI</strong> com <strong className="text-white/80">Ata de Registro de Preço</strong> vigente para contratação direta por órgãos públicos. Serviços de fibra óptica, cabeamento estruturado e CFTV em todo o Brasil.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[#b6c72c] text-sm font-medium">
                ✓ Desde 2018 no setor público
              </span>
            </div>
          </div>

          {/* Links - Serviços */}
          <nav aria-label="Nossos serviços">
            <h3 className="text-white font-bold mb-4 font-heading">
              Serviços via ARP
            </h3>
            <ul className="space-y-2" role="list">
              {linksServicos.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    title={link.title}
                    className="text-white/60 hover:text-[#b6c72c] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Links - Empresa */}
          <nav aria-label="Links institucionais">
            <h3 className="text-white font-bold mb-4 font-heading">
              Empresa
            </h3>
            <ul className="space-y-2" role="list">
              {linksEmpresa.map((link, index) => (
                <li key={index}>
                  {link.isPage ? (
                    <Link
                      href={link.href}
                      title={link.title}
                      className="text-white/60 hover:text-[#b6c72c] transition-colors text-sm font-medium"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      title={link.title}
                      className="text-white/60 hover:text-[#b6c72c] transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Contato */}
          <address className="not-italic">
            <h3 className="text-white font-bold mb-4 font-heading">
              Contato
            </h3>
            <ul className="space-y-3" role="list">
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-[#b6c72c] flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
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
                <span className="text-white/60 text-sm">
                  Rua QN 7 Conjunto 5 Lote 15
                  <br />
                  Riacho Fundo I - Brasília/DF
                  <br />
                  CEP: 71.805-705
                </span>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-[#b6c72c] flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href="tel:+556135225203"
                  className="text-white/60 hover:text-[#b6c72c] text-sm transition-colors"
                  title="Ligar para o Grupo Alfa Tecnologia"
                >
                  (61) 3522-5203
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-[#b6c72c] flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                  />
                </svg>
                <a
                  href="https://wa.me/5561986161961?text=Olá! Gostaria de informações sobre a Ata de Registro de Preço."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-[#b6c72c] text-sm transition-colors"
                  title="Contato via WhatsApp para informações sobre Ata de Registro de Preço"
                >
                  (61) 98616-1961
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-[#b6c72c] flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:comercial@grupoalfatelecom.com.br?subject=Informações sobre Ata de Registro de Preço"
                  className="text-white/60 hover:text-[#b6c72c] text-sm transition-colors"
                  title="Enviar e-mail para o setor comercial"
                >
                  comercial@grupoalfatelecom.com.br
                </a>
              </li>
            </ul>
          </address>
        </div>

        {/* Seção de keywords para SEO (hidden but crawlable) */}
        <div className="py-8 border-b border-white/10">
          <p className="text-white/40 text-xs text-center max-w-4xl mx-auto leading-relaxed">
            Grupo Alfa Tecnologia - Empresa especializada em <strong className="text-white/50">Ata de Registro de Preço</strong> para serviços de infraestrutura de TI. Oferecemos instalação de <strong className="text-white/50">fibra óptica</strong>, <strong className="text-white/50">cabeamento estruturado</strong> categoria 6 e 6A, <strong className="text-white/50">CFTV</strong> e câmeras IP, <strong className="text-white/50">controle de acesso</strong> e <strong className="text-white/50">segurança eletrônica</strong> para órgãos públicos federais, estaduais e municipais em todo o Brasil. Contratação simplificada via ARP conforme <strong className="text-white/50">Lei 14.133/2021</strong>.
          </p>
        </div>

        {/* Rodapé inferior */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm text-center md:text-left">
            © {currentYear} Grupo Alfa Tecnologia. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <span className="text-white/40 text-sm">CNPJ: 31.837.899/0001-25</span>
            <Link
              href="/ata-registro-preco"
              className="text-[#b6c72c] text-sm hover:underline"
              title="Ver informações da Ata de Registro de Preço"
            >
              Ata de Registro de Preço
            </Link>
          </div>
        </div>

        {/* Créditos do desenvolvedor */}
        <div className="pt-4 mt-4 border-t border-white/5 text-center">
          <span className="text-white/25 text-xs">
            Desenvolvido por{" "}
            <a
              href="https://wa.me/5561996617935"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/40 transition-colors"
            >
              NetCritiva
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
