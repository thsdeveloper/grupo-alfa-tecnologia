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
  ScrollText
} from "lucide-react"
import { useState } from "react"

interface SidebarProps {
  className?: string
}

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Atas de Preço",
    href: "/admin/atas",
    icon: ScrollText,
  },
  {
    title: "Termos de Referência",
    href: "/admin/termos",
    icon: FileText,
  },
  {
    title: "Equipamentos",
    href: "/admin/equipamentos",
    icon: Package,
  },
  {
    title: "Vagas",
    href: "/admin/vagas",
    icon: Briefcase,
  },
  {
    title: "Meu Perfil",
    href: "/admin/profile",
    icon: User,
  },
]

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

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
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 mb-2 text-xs font-semibold text-cinza-escuro uppercase tracking-wider">
              Menu
            </p>
          )}

          {menuItems.map((item) => {
            const isActive = pathname === item.href
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
          })}
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

