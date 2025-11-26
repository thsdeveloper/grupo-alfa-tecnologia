"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Save, User, Mail, AtSign, AlertCircle, CheckCircle2 } from "lucide-react"
import { updateProfile } from "./actions"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface ProfileFormProps {
  user: SupabaseUser
  profile: {
    full_name: string | null
    username: string | null
    avatar_url: string | null
  } | null
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const displayName = profile?.full_name || user.email?.split("@")[0] || "Usuário"
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(false)
    
    const result = await updateProfile(formData)
    
    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    
    setLoading(false)
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Profile Card */}
      <Card className="border-0 shadow-md md:col-span-1">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 border-4 border-verde mb-4">
              <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
              <AvatarFallback className="bg-verde text-preto font-bold text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <h3 className="text-xl font-bold font-heading text-preto mb-1">
              {displayName}
            </h3>
            <p className="text-sm text-cinza-escuro mb-4">
              {user.email}
            </p>
            
            {profile?.username && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-verde/10 text-verde text-sm font-medium">
                @{profile.username}
              </span>
            )}

            <div className="w-full mt-6 pt-6 border-t border-cinza-medio">
              <div className="flex justify-between items-center text-sm">
                <span className="text-cinza-escuro">Status</span>
                <span className="inline-flex items-center gap-1.5 text-verde font-medium">
                  <span className="w-2 h-2 rounded-full bg-verde" />
                  Ativo
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mt-3">
                <span className="text-cinza-escuro">Membro desde</span>
                <span className="text-preto font-medium">
                  {new Date(user.created_at || "").toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Card className="border-0 shadow-md md:col-span-2">
        <CardHeader>
          <CardTitle className="text-xl font-heading">Editar Perfil</CardTitle>
          <CardDescription>
            Atualize suas informações pessoais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span className="text-sm">Perfil atualizado com sucesso!</span>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-preto">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cinza-escuro" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Seu nome completo"
                    defaultValue={profile?.full_name || ""}
                    className="pl-10 h-11 border-cinza-medio focus:border-verde"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-preto">
                  Nome de usuário
                  <span className="text-cinza-escuro text-xs ml-1">(opcional)</span>
                </Label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cinza-escuro" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="seu_username"
                    defaultValue={profile?.username || ""}
                    minLength={3}
                    className="pl-10 h-11 border-cinza-medio focus:border-verde"
                  />
                </div>
                <p className="text-xs text-cinza-escuro">
                  Mínimo de 3 caracteres
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-preto">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cinza-escuro" />
                <Input
                  id="email"
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="pl-10 h-11 border-cinza-medio bg-cinza-claro cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-cinza-escuro">
                O email não pode ser alterado
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                className="h-11 px-6"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Salvando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Salvar alterações
                  </span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

