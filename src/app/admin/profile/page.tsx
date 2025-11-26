import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "./ProfileForm"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, username, avatar_url")
    .eq("id", user.id)
    .single()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-heading text-preto">
          Meu Perfil
        </h1>
        <p className="text-cinza-escuro">
          Gerencie suas informações pessoais e preferências
        </p>
      </div>

      {/* Profile Form */}
      <ProfileForm user={user} profile={profile} />
    </div>
  )
}

