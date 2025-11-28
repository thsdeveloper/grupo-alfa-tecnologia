"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string

  let userCreated = false

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
      // Verificar se o usuário foi criado mesmo com erro (pode acontecer em timeouts)
      // Nesse caso, verificar se o usuário existe antes de retornar erro
      if (error.message.includes("timeout") || error.status === 504) {
        // Verificar se o usuário foi criado mesmo com timeout
        const { data: existingUser } = await supabase.auth.getUser()
        if (existingUser?.user) {
          return { 
            success: true,
            message: "Cadastro realizado! Verifique seu email ou tente fazer login.",
            needsConfirmation: true
          }
        }
        return { 
          error: "O servidor está lento. O cadastro pode ter sido feito. Verifique seu email ou tente fazer login.",
          warning: true 
        }
      }
      
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
      return { error: error.message || "Erro ao criar conta. Tente novamente." }
    }

    // Verificar se o usuário foi criado
    if (data?.user) {
      userCreated = true
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

    // Fallback - se chegou aqui e não tem usuário, algo deu errado
    if (!userCreated) {
      return { 
        error: "Erro ao criar conta. Tente novamente." 
      }
    }

    // Fallback - usuário criado mas sem sessão e sem confirmação
    return { 
      success: true,
      message: "Cadastro realizado! Tente fazer login.",
      needsConfirmation: true
    }

  } catch (err: any) {
    // Verificar se é um redirect do Next.js (não é um erro real)
    if (err?.digest?.startsWith("NEXT_REDIRECT") || err?.message?.includes("NEXT_REDIRECT")) {
      throw err // Relançar o redirect
    }

    console.error("Signup error:", err)
    
    // Se o usuário foi criado antes do erro, considerar sucesso
    if (userCreated) {
      return { 
        success: true,
        message: "Cadastro realizado! Verifique seu email ou tente fazer login.",
        needsConfirmation: true
      }
    }
    
    return { 
      error: "Erro inesperado ao criar conta. Tente novamente." 
    }
  }
}
