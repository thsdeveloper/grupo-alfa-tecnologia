"use client"

import { Bell, Search, Menu, Sparkles, Calendar } from "lucide-react"
import { UserDropdown } from "./UserDropdown"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { User } from "@supabase/supabase-js"

interface HeaderProps {
  user: User
  profile?: {
    full_name?: string | null
    avatar_url?: string | null
  } | null
  onMenuClick?: () => void
}

export function Header({ user, profile, onMenuClick }: HeaderProps) {
  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Usuário"
  
  // Formatar data atual
  const today = new Date()
  const formattedDate = today.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-branco/80 border-b border-cinza-medio/30">
      <div className="flex h-20 items-center justify-between px-6">
        {/* Left side - Greeting & Date */}
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-verde/10 hover:text-verde transition-all"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="hidden md:block">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-preto font-heading">
                Olá, {displayName}!
              </h2>
              <Sparkles className="h-5 w-5 text-verde animate-pulse" />
            </div>
            <div className="flex items-center gap-2 text-sm text-cinza-escuro">
              <Calendar className="h-3.5 w-3.5" />
              <span className="capitalize">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full group">
            <div className="absolute inset-0 bg-gradient-to-r from-verde/20 to-verde/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative flex items-center bg-cinza-claro/80 rounded-xl px-4 py-2.5 border border-transparent hover:border-verde/30 focus-within:border-verde focus-within:ring-2 focus-within:ring-verde/20 transition-all duration-300">
              <Search className="h-4 w-4 text-cinza-escuro mr-3" />
              <Input
                type="search"
                placeholder="Buscar projetos, clientes..."
                className="border-0 bg-transparent h-6 w-full focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-cinza-escuro/70 text-sm"
              />
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-cinza-medio/50 bg-branco px-1.5 font-mono text-[10px] font-medium text-cinza-escuro">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-10 w-10 rounded-xl hover:bg-verde/10 hover:text-verde transition-all duration-200 group"
          >
            <Bell className="h-5 w-5 text-cinza-escuro group-hover:text-verde transition-colors" />
            <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-verde opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-verde" />
            </span>
          </Button>
          
          {/* Divider */}
          <div className="h-10 w-px bg-gradient-to-b from-transparent via-cinza-medio/50 to-transparent mx-1" />
          
          {/* User Dropdown */}
          <UserDropdown user={user} profile={profile} />
        </div>
      </div>
    </header>
  )
}
