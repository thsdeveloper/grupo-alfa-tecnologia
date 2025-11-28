"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle2, Info } from "lucide-react"
import { signup } from "./actions"
import { useOrganizationSettings } from "@/lib/hooks/useOrganizationSettings"

const registerSchema = z.object({
  fullName: z
    .string()
    .min(1, "Nome completo é obrigatório")
    .min(3, "Nome completo deve ter pelo menos 3 caracteres")
    .max(100, "Nome completo deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z
    .string()
    .min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const { settings } = useOrganizationSettings()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterFormData) {
    setError(null)
    setSuccess(null)
    setWarning(null)

    const formData = new FormData()
    formData.append("fullName", data.fullName)
    formData.append("email", data.email)
    formData.append("password", data.password)
    formData.append("confirmPassword", data.confirmPassword)
    
    const result = await signup(formData)
    
    if (result?.error) {
      if (result.warning) {
        setWarning(result.error)
      } else {
        setError(result.error)
      }
    } else if (result?.success) {
      setSuccess(result.message || "Conta criada com sucesso!")
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-preto relative overflow-hidden">
        <div className="absolute inset-0 circuit-pattern opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-preto via-preto-light to-preto opacity-90" />
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <div className="mb-8">
            <Image
              src={settings.logo_url || "/logo-alfa-telecon2.png"}
              alt="Grupo Alfa Tecnologia"
              width={180}
              height={180}
              className="drop-shadow-lg"
              priority
            />
          </div>
          
          <h1 className="text-4xl font-bold text-branco font-heading text-center mb-4">
            Grupo Alfa Tecnologia
          </h1>
          <p className="text-cinza-medio text-center text-lg max-w-md">
            Crie sua conta e tenha acesso completo à nossa plataforma administrativa.
          </p>
          
          <div className="mt-16 space-y-4 text-left max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-verde/20 rounded-full flex items-center justify-center">
                <span className="text-verde text-sm">✓</span>
              </div>
              <span className="text-cinza-medio">Gestão completa de projetos</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-verde/20 rounded-full flex items-center justify-center">
                <span className="text-verde text-sm">✓</span>
              </div>
              <span className="text-cinza-medio">Acompanhamento em tempo real</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-verde/20 rounded-full flex items-center justify-center">
                <span className="text-verde text-sm">✓</span>
              </div>
              <span className="text-cinza-medio">Suporte técnico dedicado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-cinza-claro">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Image
              src={settings.logo_url || "/logo-alfa-telecon2.png"}
              alt="Grupo Alfa Tecnologia"
              width={100}
              height={100}
              className="drop-shadow-lg"
              priority
            />
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold font-heading text-preto">
                Criar conta
              </CardTitle>
              <CardDescription className="text-cinza-escuro">
                Preencha os dados abaixo para criar sua conta
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {success ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-lg flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium">Cadastro realizado!</p>
                      <p className="text-sm mt-1">{success}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <Link 
                      href="/login" 
                      className="inline-flex items-center gap-2 text-verde hover:text-verde-hover font-semibold transition-colors"
                    >
                      Ir para o Login
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  {warning && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg flex items-start gap-2">
                      <Info className="h-4 w-4 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-sm">{warning}</span>
                        <div className="mt-2">
                          <Link 
                            href="/login" 
                            className="text-amber-800 hover:text-amber-900 font-semibold underline text-sm"
                          >
                            Tentar fazer login
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-preto">Nome completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cinza-escuro" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Seu nome completo"
                        className={`pl-10 h-11 border-cinza-medio focus:border-verde ${
                          errors.fullName ? "border-red-500 focus:border-red-500" : ""
                        }`}
                        aria-invalid={errors.fullName ? "true" : "false"}
                        {...register("fullName")}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-preto">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cinza-escuro" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        className={`pl-10 h-11 border-cinza-medio focus:border-verde ${
                          errors.email ? "border-red-500 focus:border-red-500" : ""
                        }`}
                        aria-invalid={errors.email ? "true" : "false"}
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-preto">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cinza-escuro" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className={`pl-10 h-11 border-cinza-medio focus:border-verde ${
                          errors.password ? "border-red-500 focus:border-red-500" : ""
                        }`}
                        aria-invalid={errors.password ? "true" : "false"}
                        {...register("password")}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-preto">Confirmar senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cinza-escuro" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className={`pl-10 h-11 border-cinza-medio focus:border-verde ${
                          errors.confirmPassword ? "border-red-500 focus:border-red-500" : ""
                        }`}
                        aria-invalid={errors.confirmPassword ? "true" : "false"}
                        {...register("confirmPassword")}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-11 text-base font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Criando conta...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Criar conta
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
            
            {!success && (
              <CardFooter className="flex flex-col space-y-4 pt-2">
                <div className="text-center text-sm text-cinza-escuro">
                  Já tem uma conta?{" "}
                  <Link href="/login" className="text-verde hover:text-verde-hover font-semibold transition-colors">
                    Entrar
                  </Link>
                </div>
              </CardFooter>
            )}
          </Card>

          <p className="text-center text-xs text-cinza-escuro mt-6">
            &copy; {new Date().getFullYear()} Grupo Alfa Tecnologia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
