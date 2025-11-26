import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LayoutDashboard, Users, Briefcase, TrendingUp } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single()
    : { data: null }

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Usuário"

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-heading text-preto">
          Bem-vindo, {displayName}! 👋
        </h1>
        <p className="text-cinza-escuro">
          Aqui está um resumo da sua área administrativa.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cinza-escuro">
              Total de Projetos
            </CardTitle>
            <div className="h-10 w-10 rounded-lg bg-verde/10 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-verde" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-preto">12</div>
            <p className="text-xs text-cinza-escuro mt-1">
              <span className="text-verde">+2</span> este mês
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cinza-escuro">
              Clientes Ativos
            </CardTitle>
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-preto">8</div>
            <p className="text-xs text-cinza-escuro mt-1">
              <span className="text-verde">+1</span> novo cliente
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cinza-escuro">
              Taxa de Conclusão
            </CardTitle>
            <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-preto">94%</div>
            <p className="text-xs text-cinza-escuro mt-1">
              <span className="text-verde">+5%</span> vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-cinza-escuro">
              Atividades
            </CardTitle>
            <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-preto">24</div>
            <p className="text-xs text-cinza-escuro mt-1">
              Últimas 24 horas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Atividade Recente</CardTitle>
            <CardDescription>Suas últimas ações na plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Login realizado", time: "Agora mesmo", color: "bg-verde" },
                { action: "Perfil atualizado", time: "Há 2 dias", color: "bg-blue-500" },
                { action: "Conta criada", time: "Há 1 semana", color: "bg-purple-500" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-preto">{item.action}</p>
                    <p className="text-xs text-cinza-escuro">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Informações da Conta</CardTitle>
            <CardDescription>Detalhes do seu perfil</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-cinza-medio">
                <span className="text-sm text-cinza-escuro">Email</span>
                <span className="text-sm font-medium text-preto">{user?.email}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-cinza-medio">
                <span className="text-sm text-cinza-escuro">Nome</span>
                <span className="text-sm font-medium text-preto">{displayName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-cinza-medio">
                <span className="text-sm text-cinza-escuro">Status</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-verde/10 text-verde text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-verde" />
                  Ativo
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-cinza-escuro">Membro desde</span>
                <span className="text-sm font-medium text-preto">
                  {new Date(user?.created_at || "").toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

