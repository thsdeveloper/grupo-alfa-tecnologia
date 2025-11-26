"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, Settings } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface UserDropdownProps {
  user: SupabaseUser
  profile?: {
    full_name?: string | null
    avatar_url?: string | null
  } | null
}

export function UserDropdown({ user, profile }: UserDropdownProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const displayName = profile?.full_name || user.email?.split("@")[0] || "Usuário"
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-cinza-claro transition-colors focus:outline-none focus:ring-2 focus:ring-verde focus:ring-offset-2">
        <Avatar className="h-9 w-9 border-2 border-verde">
          <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
          <AvatarFallback className="bg-verde text-preto font-semibold text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-preto">{displayName}</p>
          <p className="text-xs text-cinza-escuro">{user.email}</p>
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 border-cinza-medio/30 shadow-lg bg-branco rounded-xl p-2">
        <DropdownMenuLabel className="font-normal px-3 py-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold text-preto">{displayName}</p>
            <p className="text-xs text-cinza-escuro">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-cinza-medio/30 my-2" />
        <DropdownMenuItem asChild className="rounded-lg hover:bg-verde/10 focus:bg-verde/10 cursor-pointer">
          <Link href="/admin/profile" className="flex items-center px-3 py-2">
            <User className="mr-3 h-4 w-4 text-cinza-escuro" />
            <span className="text-preto">Meu Perfil</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-cinza-medio/30 my-2" />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="rounded-lg cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600 px-3 py-2"
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

