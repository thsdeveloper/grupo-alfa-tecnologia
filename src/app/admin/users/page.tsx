import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { isSuperAdmin, getAllRoles } from "@/lib/permissions"
import { UsersManager } from "./UsersManager"
import { Users, AlertTriangle } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function UsersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Verificar se é super admin
  const userIsSuperAdmin = await isSuperAdmin(user.id)

  if (!userIsSuperAdmin) {
    return (
      <div className="space-y-6">
        <Card className="border-yellow-500 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <AlertTriangle className="h-5 w-5" />
              Acesso Restrito
            </CardTitle>
            <CardDescription className="text-yellow-600">
              Você não tem permissão para acessar esta página.
              Apenas super administradores podem gerenciar usuários.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Buscar todos os papéis
  const roles = await getAllRoles()

  // Buscar todos os profiles com seus papéis
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, is_super_admin, username')
    .order('full_name')

  // Buscar papéis de todos os usuários
  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('user_id, role_id')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-heading text-preto flex items-center gap-3">
          <Users className="h-8 w-8 text-verde" />
          Gerenciamento de Usuários
        </h1>
        <p className="text-cinza-escuro">
          Atribua papéis e gerencie permissões dos usuários
        </p>
      </div>

      {/* Users Manager Component */}
      <UsersManager 
        initialUsers={profiles || []}
        allRoles={roles}
        userRoles={userRoles || []}
        currentUserId={user.id}
      />
    </div>
  )
}

