"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  User,
  FileText,
  Package,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ScrollText,
  Users,
  Shield,
  LucideIcon,
} from "lucide-react"
import { useState } from "react"
import type { Resource, Action } from "@/lib/permissions/constants"

interface MenuItem {
  title: string
  href: string
  icon: LucideIcon
  permission?: {
    resource: Resource
    action: Action
  }
}

interface SidebarProps {
  className?: string
  userPermissions?: Array<{ resource: string; action: string }>
  isSuperAdmin?: boolean
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    // Dashboard é acessível a todos os usuários autenticados
  },
  {
    title: "Atas de Preço",
    href: "/admin/atas",
    icon: ScrollText,
    permission: { resource: "atas", action: "view" },
  },
  {
    title: "Termos de Referência",
    href: "/admin/termos",
    icon: FileText,
    permission: { resource: "termos", action: "view" },
  },
  {
    title: "Equipamentos",
    href: "/admin/equipamentos",
    icon: Package,
    permission: { resource: "equipamentos", action: "view" },
  },
  {
    title: "Vagas",
    href: "/admin/vagas",
    icon: Briefcase,
    permission: { resource: "vagas", action: "view" },
  },
]

const adminMenuItems: MenuItem[] = [
  {
    title: "Usuários",
    href: "/admin/users",
    icon: Users,
    permission: { resource: "users", action: "view" },
  },
  {
    title: "Permissões",
    href: "/admin/permissions",
    icon: Shield,
    permission: { resource: "permissions", action: "manage" },
  },
]

const profileMenuItem: MenuItem = {
  title: "Meu Perfil",
  href: "/admin/profile",
  icon: User,
}

export function Sidebar({ 
  className, 
  userPermissions = [], 
  isSuperAdmin = false 
}: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  // Função para verificar se o usuário tem permissão para um item
  const hasPermission = (item: MenuItem): boolean => {
    // Super admin tem acesso a tudo
    if (isSuperAdmin) return true
    
    // Itens sem requisito de permissão são acessíveis a todos
    if (!item.permission) return true
    
    // Verificar se o usuário tem a permissão necessária
    return userPermissions.some(
      (p) => p.resource === item.permission!.resource && p.action === item.permission!.action
    )
  }

  // Filtrar itens do menu baseado nas permissões
  const visibleMenuItems = menuItems.filter(hasPermission)
  const visibleAdminItems = adminMenuItems.filter(hasPermission)

  const renderMenuItem = (item: MenuItem) => {
    const isActive = pathname === item.href || 
      (item.href !== "/admin" && pathname.startsWith(item.href))
    const Icon = item.icon

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-verde text-preto shadow-md"
            : "text-cinza-medio hover:bg-preto-light hover:text-branco",
          collapsed && "justify-center px-2"
        )}
      >
        <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-preto")} />
        {!collapsed && <span>{item.title}</span>}
      </Link>
    )
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-preto transition-all duration-300",
        collapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center justify-between border-b border-preto-light px-4 transition-all duration-300",
        collapsed ? "h-16" : "h-32"
      )}>
        <Link href="/admin" className="flex items-center">
          <Image
            src="/logo-alfa-telecon2.png"
            alt="Grupo Alfa Tecnologia"
            width={collapsed ? 50 : 120}
            height={collapsed ? 50 : 120}
            className="drop-shadow-md"
          />
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-cinza-escuro hover:text-branco hover:bg-preto-light transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3 flex-1 overflow-y-auto">
        {/* Menu Principal */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-semibold text-cinza-escuro uppercase tracking-wider">
              Menu
            </p>
          )}

          {visibleMenuItems.map(renderMenuItem)}
        </div>

        {/* Menu de Administração - só aparece se houver itens visíveis */}
        {visibleAdminItems.length > 0 && (
          <div className="mt-6 space-y-1">
            {!collapsed && (
              <p className="px-3 mb-2 text-xs font-semibold text-cinza-escuro uppercase tracking-wider">
                Administração
              </p>
            )}

            {visibleAdminItems.map(renderMenuItem)}
          </div>
        )}

        {/* Perfil - sempre visível */}
        <div className="mt-6 space-y-1">
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-semibold text-cinza-escuro uppercase tracking-wider">
              Conta
            </p>
          )}

          {renderMenuItem(profileMenuItem)}
        </div>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-preto-light">
        {!collapsed ? (
          <div className="text-center">
            <p className="text-xs text-cinza-escuro">
              &copy; {new Date().getFullYear()} Grupo Alfa
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-verde rounded-full" />
          </div>
        )}
      </div>
    </aside>
  )
}
