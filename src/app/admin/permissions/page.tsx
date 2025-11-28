import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { isSuperAdmin, getAllRoles, getAllPermissions } from "@/lib/permissions"
import { RolesManager } from "./RolesManager"
import { Shield, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function PermissionsPage() {
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
              Apenas super administradores podem gerenciar permissões.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Buscar todos os papéis e permissões
  const [roles, permissions] = await Promise.all([
    getAllRoles(),
    getAllPermissions(),
  ])

  // Buscar permissões de cada papel
  const { data: rolePermissions } = await supabase
    .from('role_permissions')
    .select('role_id, permission_id')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-heading text-preto flex items-center gap-3">
          <Shield className="h-8 w-8 text-verde" />
          Gerenciamento de Permissões
        </h1>
        <p className="text-cinza-escuro">
          Configure os papéis e permissões do sistema
        </p>
      </div>

      {/* Roles Manager Component */}
      <RolesManager 
        initialRoles={roles}
        allPermissions={permissions}
        rolePermissions={rolePermissions || []}
      />
    </div>
  )
}

