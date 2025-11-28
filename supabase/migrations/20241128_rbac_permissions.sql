-- ============================================
-- RBAC (Role-Based Access Control) System
-- ============================================

-- 1. Adicionar campo is_super_admin na tabela profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT FALSE;

-- 2. Criar tabela de papéis (roles)
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Criar tabela de permissões
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(resource, action)
);

-- 4. Criar tabela de relacionamento role_permissions
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (role_id, permission_id)
);

-- 5. Criar tabela de relacionamento user_roles
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);

-- 6. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_permissions_resource ON permissions(resource);
CREATE INDEX IF NOT EXISTS idx_profiles_is_super_admin ON profiles(is_super_admin);

-- 7. Trigger para atualizar updated_at em roles
CREATE OR REPLACE FUNCTION update_roles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS roles_updated_at ON roles;
CREATE TRIGGER roles_updated_at
  BEFORE UPDATE ON roles
  FOR EACH ROW
  EXECUTE FUNCTION update_roles_updated_at();

-- 8. Popular tabela de permissões padrão
INSERT INTO permissions (resource, action, name) VALUES
  -- Atas de Preço
  ('atas', 'view', 'Visualizar Atas de Preço'),
  ('atas', 'create', 'Criar Atas de Preço'),
  ('atas', 'edit', 'Editar Atas de Preço'),
  ('atas', 'delete', 'Excluir Atas de Preço'),
  ('atas', 'manage', 'Gerenciar Atas de Preço'),
  -- Termos de Referência
  ('termos', 'view', 'Visualizar Termos de Referência'),
  ('termos', 'create', 'Criar Termos de Referência'),
  ('termos', 'edit', 'Editar Termos de Referência'),
  ('termos', 'delete', 'Excluir Termos de Referência'),
  ('termos', 'manage', 'Gerenciar Termos de Referência'),
  -- Equipamentos
  ('equipamentos', 'view', 'Visualizar Equipamentos'),
  ('equipamentos', 'create', 'Criar Equipamentos'),
  ('equipamentos', 'edit', 'Editar Equipamentos'),
  ('equipamentos', 'delete', 'Excluir Equipamentos'),
  ('equipamentos', 'manage', 'Gerenciar Equipamentos'),
  -- Vagas
  ('vagas', 'view', 'Visualizar Vagas'),
  ('vagas', 'create', 'Criar Vagas'),
  ('vagas', 'edit', 'Editar Vagas'),
  ('vagas', 'delete', 'Excluir Vagas'),
  ('vagas', 'manage', 'Gerenciar Vagas'),
  -- Usuários
  ('users', 'view', 'Visualizar Usuários'),
  ('users', 'edit', 'Editar Usuários'),
  ('users', 'manage', 'Gerenciar Usuários'),
  -- Permissões
  ('permissions', 'view', 'Visualizar Permissões'),
  ('permissions', 'manage', 'Gerenciar Permissões')
ON CONFLICT (resource, action) DO NOTHING;

-- 9. Criar papel de Super Administrador
INSERT INTO roles (name, description) VALUES
  ('Super Administrador', 'Acesso total ao sistema, pode gerenciar permissões e usuários'),
  ('Administrador', 'Acesso administrativo completo, exceto gerenciamento de permissões'),
  ('Editor', 'Pode visualizar e editar conteúdos'),
  ('Visualizador', 'Apenas visualização de conteúdos')
ON CONFLICT (name) DO NOTHING;

-- 10. Atribuir todas as permissões ao Super Administrador
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'Super Administrador'
ON CONFLICT DO NOTHING;

-- 11. Atribuir permissões ao Administrador (todas exceto permissions:manage)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'Administrador' 
AND NOT (p.resource = 'permissions' AND p.action = 'manage')
ON CONFLICT DO NOTHING;

-- 12. Atribuir permissões ao Editor (view e edit de todos os recursos)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'Editor' 
AND p.action IN ('view', 'edit', 'create')
AND p.resource NOT IN ('permissions', 'users')
ON CONFLICT DO NOTHING;

-- 13. Atribuir permissões ao Visualizador (apenas view)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'Visualizador' 
AND p.action = 'view'
AND p.resource NOT IN ('permissions', 'users')
ON CONFLICT DO NOTHING;

-- 14. RLS (Row Level Security) policies

-- Habilitar RLS nas novas tabelas
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Policies para roles (leitura para todos autenticados, escrita apenas super admin)
CREATE POLICY "roles_select_policy" ON roles
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "roles_insert_policy" ON roles
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_super_admin = true
    )
  );

CREATE POLICY "roles_update_policy" ON roles
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_super_admin = true
    )
  );

CREATE POLICY "roles_delete_policy" ON roles
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_super_admin = true
    )
  );

-- Policies para permissions (leitura para todos autenticados, escrita apenas super admin)
CREATE POLICY "permissions_select_policy" ON permissions
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "permissions_all_policy" ON permissions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_super_admin = true
    )
  );

-- Policies para role_permissions
CREATE POLICY "role_permissions_select_policy" ON role_permissions
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "role_permissions_all_policy" ON role_permissions
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_super_admin = true
    )
  );

-- Policies para user_roles
CREATE POLICY "user_roles_select_policy" ON user_roles
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "user_roles_all_policy" ON user_roles
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_super_admin = true
    )
  );

-- 15. Função para verificar se usuário tem permissão específica
CREATE OR REPLACE FUNCTION user_has_permission(
  p_user_id UUID,
  p_resource TEXT,
  p_action TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  -- Super admin tem todas as permissões
  IF EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = p_user_id AND is_super_admin = true
  ) THEN
    RETURN true;
  END IF;

  -- Verificar permissões através dos papéis
  RETURN EXISTS (
    SELECT 1 
    FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = p_user_id
    AND p.resource = p_resource
    AND p.action = p_action
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 16. Função para obter todas as permissões de um usuário
CREATE OR REPLACE FUNCTION get_user_permissions(p_user_id UUID)
RETURNS TABLE (
  resource TEXT,
  action TEXT,
  name TEXT
) AS $$
BEGIN
  -- Se super admin, retorna todas as permissões
  IF EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = p_user_id AND is_super_admin = true
  ) THEN
    RETURN QUERY SELECT p.resource, p.action, p.name FROM permissions p;
    RETURN;
  END IF;

  -- Caso contrário, retorna permissões dos papéis
  RETURN QUERY
  SELECT DISTINCT p.resource, p.action, p.name
  FROM user_roles ur
  JOIN role_permissions rp ON ur.role_id = rp.role_id
  JOIN permissions p ON rp.permission_id = p.id
  WHERE ur.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 17. Função para verificar se usuário é super admin
CREATE OR REPLACE FUNCTION is_super_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = p_user_id AND is_super_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

