import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/admin/Sidebar"
import { Header } from "@/components/admin/Header"
import { getUserPermissions, isSuperAdmin } from "@/lib/permissions"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user profile com is_super_admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, is_super_admin")
    .eq("id", user.id)
    .single()

  // Buscar permissões do usuário
  const userIsSuperAdmin = profile?.is_super_admin || await isSuperAdmin(user.id)
  const userPermissions = await getUserPermissions(user.id)

  return (
    <div className="min-h-screen bg-cinza-claro">
      {/* Sidebar com permissões */}
      <Sidebar 
        userPermissions={userPermissions.map(p => ({ 
          resource: p.resource, 
          action: p.action 
        }))}
        isSuperAdmin={userIsSuperAdmin}
      />

      {/* Main Content */}
      <div className="pl-64 transition-all duration-300">
        <Header user={user} profile={profile} />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
