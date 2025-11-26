"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      // Tratar erros conhecidos
      if (error.message.includes("already registered")) {
        return { error: "Este email já está cadastrado. Tente fazer login." }
      }
      if (error.message.includes("Invalid email")) {
        return { error: "Email inválido. Verifique o formato." }
      }
      if (error.message.includes("Password")) {
        return { error: "Senha deve ter pelo menos 6 caracteres." }
      }
      // Erro de timeout do Supabase (504)
      if (error.message.includes("timeout") || error.status === 504) {
        return { 
          error: "O servidor está lento. O cadastro pode ter sido feito. Verifique seu email ou tente fazer login.",
          warning: true 
        }
      }
      return { error: error.message || "Erro ao criar conta. Tente novamente." }
    }

    // Verificar se o usuário foi criado mas precisa confirmar email
    if (data?.user && !data?.session) {
      // Usuário criado mas precisa confirmar email
      return { 
        success: true,
        message: "Conta criada! Verifique seu email para confirmar o cadastro.",
        needsConfirmation: true
      }
    }

    // Se temos sessão, o usuário está logado (confirmação de email desabilitada)
    if (data?.session) {
      revalidatePath("/", "layout")
      redirect("/admin")
    }

    // Fallback
    return { 
      success: true,
      message: "Cadastro realizado! Tente fazer login.",
      needsConfirmation: true
    }

  } catch (err) {
    console.error("Signup error:", err)
    return { 
      error: "Erro inesperado. O cadastro pode ter sido feito. Verifique seu email ou tente fazer login." 
    }
  }
}
