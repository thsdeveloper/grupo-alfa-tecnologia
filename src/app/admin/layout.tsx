import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/admin/Sidebar"
import { Header } from "@/components/admin/Header"

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

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single()

  return (
    <div className="min-h-screen bg-cinza-claro">
      {/* Sidebar */}
      <Sidebar />

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

