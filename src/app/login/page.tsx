"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react"
import { login } from "./actions"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    
    const result = await login(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
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
              src="/logo-alfa-telecon2.png"
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
            Área administrativa para gestão de serviços e acompanhamento de projetos.
          </p>
          
          <div className="mt-16 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-verde text-3xl font-bold font-heading">100+</div>
              <div className="text-cinza-escuro text-sm">Projetos</div>
            </div>
            <div>
              <div className="text-verde text-3xl font-bold font-heading">50+</div>
              <div className="text-cinza-escuro text-sm">Clientes</div>
            </div>
            <div>
              <div className="text-verde text-3xl font-bold font-heading">10+</div>
              <div className="text-cinza-escuro text-sm">Anos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-cinza-claro">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Image
              src="/logo-alfa-telecon2.png"
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
                Bem-vindo de volta!
              </CardTitle>
              <CardDescription className="text-cinza-escuro">
                Entre com suas credenciais para acessar o painel
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form action={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-preto">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cinza-escuro" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      className="pl-10 h-11 border-cinza-medio focus:border-verde"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-preto">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cinza-escuro" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="pl-10 h-11 border-cinza-medio focus:border-verde"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 text-base font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Entrando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      Entrar
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 pt-2">
              <div className="text-center text-sm text-cinza-escuro">
                Não tem uma conta?{" "}
                <Link href="/register" className="text-verde hover:text-verde-hover font-semibold transition-colors">
                  Criar conta
                </Link>
              </div>
            </CardFooter>
          </Card>

          <p className="text-center text-xs text-cinza-escuro mt-6">
            &copy; {new Date().getFullYear()} Grupo Alfa Tecnologia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}

