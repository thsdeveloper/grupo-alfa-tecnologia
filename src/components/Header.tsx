"use client";

import { useState, useEffect } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#sobre", label: "Sobre", title: "Conheça o Grupo Alfa Tecnologia" },
    { href: "#servicos", label: "Serviços", title: "Serviços de Fibra Óptica, CFTV e Cabeamento Estruturado" },
    { href: "#portfolio", label: "Portfólio", title: "Projetos executados em órgãos públicos" },
    { href: "#ata", label: "Ata de Preço", title: "Ata de Registro de Preço para contratação direta" },
    { href: "#diferenciais", label: "Diferenciais", title: "Por que escolher o Grupo Alfa" },
    { href: "#contato", label: "Contato", title: "Entre em contato conosco" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-[#211915]/95 backdrop-blur-md shadow-lg py-2"
        : "bg-[#211915] py-4"
        }`}
      role="banner"
    >
      <div className="container mx-auto px-4 lg:px-8">
        <nav className="flex items-center justify-between" aria-label="Navegação principal">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center group"
            aria-label="Grupo Alfa Tecnologia - Voltar ao início"
            title="Grupo Alfa Tecnologia - Ata de Registro de Preço"
          >
            <img
              src="/logo-alfa-telecon2.png"
              alt="Logo Grupo Alfa Tecnologia - Empresa de Infraestrutura de TI com Ata de Registro de Preço para Órgãos Públicos"
              className="h-20 w-auto transition-transform group-hover:scale-105"
              width={200}
              height={80}
              loading="eager"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8" role="navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                title={link.title}
                className="text-white/90 hover:text-[#b6c72c] transition-colors text-sm font-medium relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#b6c72c] after:transition-all hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contato"
              className="bg-[#b6c72c] text-[#211915] px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-[#9eb025] transition-all hover:shadow-lg hover:shadow-[#b6c72c]/20"
              title="Solicite um orçamento para serviços via Ata de Registro de Preço"
            >
              Solicitar Contato
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-2"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
            }`}
        >
          <div className="bg-[#211915]/95 backdrop-blur-md rounded-2xl p-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/90 hover:text-[#b6c72c] transition-colors py-3 px-4 rounded-lg hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contato"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-[#b6c72c] text-[#211915] px-6 py-3 rounded-full font-semibold text-center hover:bg-[#9eb025] transition-colors mt-2"
            >
              Solicitar Contato
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
