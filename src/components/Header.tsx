"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, LayoutDashboard, LogIn } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useOrganizationSettings } from "@/lib/hooks/useOrganizationSettings";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<{ full_name: string | null; avatar_url: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useOrganizationSettings();

  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check initial auth state
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .single();
        setProfile(profile);
      }
      setLoading(false);
    };

    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", session.user.id)
          .single();
        setProfile(profile);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Usuário";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const navLinks = [
    { href: "/#sobre", label: "Sobre", title: `Conheça o ${settings.company_short_name}` },
    { href: "/#servicos", label: "Serviços", title: "Serviços de Fibra Óptica, CFTV e Cabeamento Estruturado" },
    { href: "/#portfolio", label: "Portfólio", title: "Projetos executados em órgãos públicos" },
    { href: "/ata-registro-preco", label: "Ata de Preço", title: "Ata de Registro de Preço para contratação direta" },
    { href: "/#diferenciais", label: "Diferenciais", title: `Por que escolher o ${settings.company_short_name}` },
    { href: "/#contato", label: "Contato", title: "Entre em contato conosco" },
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
          <Link
            href="/"
            className="flex items-center group"
            aria-label={`${settings.company_short_name} - Voltar ao início`}
            title={`${settings.company_short_name} - Ata de Registro de Preço`}
          >
            <img
              src={settings.logo_url || "/logo-alfa-telecon2.png"}
              alt={`Logo ${settings.company_short_name} - Empresa de Infraestrutura de TI com Ata de Registro de Preço para Órgãos Públicos`}
              className="h-20 w-auto transition-transform group-hover:scale-105"
              width={200}
              height={80}
              loading="eager"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8" role="navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                title={link.title}
                className="text-white/90 hover:text-[#b6c72c] transition-colors text-sm font-medium relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#b6c72c] after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#contato"
              className="bg-[#b6c72c] text-[#211915] px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-[#9eb025] transition-all hover:shadow-lg hover:shadow-[#b6c72c]/20"
              title="Solicite um orçamento para serviços via Ata de Registro de Preço"
            >
              Solicitar Contato
            </Link>

            {/* Auth Section */}
            {!loading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-[#b6c72c]/50 transition-all focus:outline-none focus:ring-2 focus:ring-[#b6c72c]">
                      <Avatar className="h-9 w-9 border-2 border-[#b6c72c]">
                        <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
                        <AvatarFallback className="bg-[#b6c72c] text-[#211915] font-semibold text-sm">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{displayName}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Painel Admin</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Meu Perfil</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sair</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 text-white/90 hover:text-[#b6c72c] transition-colors text-sm font-medium border border-white/20 hover:border-[#b6c72c]/50 px-4 py-2 rounded-full"
                    title="Acessar área administrativa"
                  >
                    <LogIn className="h-4 w-4" />
                    Entrar
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Mobile Auth */}
            {!loading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center rounded-full hover:ring-2 hover:ring-[#b6c72c]/50 transition-all focus:outline-none focus:ring-2 focus:ring-[#b6c72c]">
                      <Avatar className="h-8 w-8 border-2 border-[#b6c72c]">
                        <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
                        <AvatarFallback className="bg-[#b6c72c] text-[#211915] font-semibold text-xs">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{displayName}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Painel Admin</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Meu Perfil</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sair</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href="/login"
                    className="text-white/90 hover:text-[#b6c72c] transition-colors p-2"
                    title="Acessar área administrativa"
                  >
                    <LogIn className="h-5 w-5" />
                  </Link>
                )}
              </>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2"
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
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
            }`}
        >
          <div className="bg-[#211915]/95 backdrop-blur-md rounded-2xl p-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/90 hover:text-[#b6c72c] transition-colors py-3 px-4 rounded-lg hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#contato"
              onClick={() => setIsMobileMenuOpen(false)}
              className="bg-[#b6c72c] text-[#211915] px-6 py-3 rounded-full font-semibold text-center hover:bg-[#9eb025] transition-colors mt-2"
            >
              Solicitar Contato
            </Link>

            {/* Mobile Login Link */}
            {!loading && !user && (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 text-white/90 hover:text-[#b6c72c] transition-colors py-3 px-4 rounded-lg hover:bg-white/5 border border-white/20 mt-2"
              >
                <LogIn className="h-4 w-4" />
                Entrar na Área Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
