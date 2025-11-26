"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Usuário não autenticado" }
  }

  const fullName = formData.get("fullName") as string
  const username = formData.get("username") as string

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      full_name: fullName,
      username: username || null,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin")
  revalidatePath("/admin/profile")
  
  return { success: true }
}

