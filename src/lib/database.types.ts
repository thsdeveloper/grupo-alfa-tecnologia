export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ata_item_imagens: {
        Row: {
          created_at: string | null
          descricao: string | null
          id: string
          item_id: string
          nome_arquivo: string | null
          ordem: number | null
          url: string
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          item_id: string
          nome_arquivo?: string | null
          ordem?: number | null
          url: string
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          item_id?: string
          nome_arquivo?: string | null
          ordem?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "ata_item_imagens_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "ata_itens"
            referencedColumns: ["id"]
          },
        ]
      }
      ata_itens: {
        Row: {
          ata_id: string
          ativo: boolean | null
          created_at: string | null
          descricao: string
          executavel: boolean | null
          id: string
          lote_id: string | null
          numero_item: string
          ordem: number | null
          preco_unitario: number | null
          quantidade: number | null
          unidade: string
          updated_at: string | null
        }
        Insert: {
          ata_id: string
          ativo?: boolean | null
          created_at?: string | null
          descricao: string
          executavel?: boolean | null
          id?: string
          lote_id?: string | null
          numero_item: string
          ordem?: number | null
          preco_unitario?: number | null
          quantidade?: number | null
          unidade?: string
          updated_at?: string | null
        }
        Update: {
          ata_id?: string
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string
          executavel?: boolean | null
          id?: string
          lote_id?: string | null
          numero_item?: string
          ordem?: number | null
          preco_unitario?: number | null
          quantidade?: number | null
          unidade?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ata_itens_ata_id_fkey"
            columns: ["ata_id"]
            isOneToOne: false
            referencedRelation: "atas_registro_preco"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ata_itens_lote_id_fkey"
            columns: ["lote_id"]
            isOneToOne: false
            referencedRelation: "ata_lotes"
            referencedColumns: ["id"]
          },
        ]
      }
      ata_lotes: {
        Row: {
          ata_id: string
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          id: string
          numero: string
          ordem: number | null
        }
        Insert: {
          ata_id: string
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          numero: string
          ordem?: number | null
        }
        Update: {
          ata_id?: string
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          numero?: string
          ordem?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ata_lotes_ata_id_fkey"
            columns: ["ata_id"]
            isOneToOne: false
            referencedRelation: "atas_registro_preco"
            referencedColumns: ["id"]
          },
        ]
      }
      atas_registro_preco: {
        Row: {
          ativo: boolean | null
          base_legal: string | null
          created_at: string | null
          data_fim: string | null
          data_inicio: string | null
          destaque_home: boolean | null
          fornecedor_cnpj: string
          fornecedor_nome: string
          id: string
          modalidade: string
          numero_ata: string
          numero_planejamento: string | null
          objeto: string | null
          orgao_gerenciador: string
          orgao_gerenciador_sigla: string | null
          pdf_ata_nome: string | null
          pdf_ata_url: string | null
          pdf_termo_nome: string | null
          pdf_termo_url: string | null
          slug: string
          status: string
          updated_at: string | null
          vigencia_meses: number | null
        }
        Insert: {
          ativo?: boolean | null
          base_legal?: string | null
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          destaque_home?: boolean | null
          fornecedor_cnpj?: string
          fornecedor_nome?: string
          id?: string
          modalidade?: string
          numero_ata: string
          numero_planejamento?: string | null
          objeto?: string | null
          orgao_gerenciador: string
          orgao_gerenciador_sigla?: string | null
          pdf_ata_nome?: string | null
          pdf_ata_url?: string | null
          pdf_termo_nome?: string | null
          pdf_termo_url?: string | null
          slug: string
          status?: string
          updated_at?: string | null
          vigencia_meses?: number | null
        }
        Update: {
          ativo?: boolean | null
          base_legal?: string | null
          created_at?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          destaque_home?: boolean | null
          fornecedor_cnpj?: string
          fornecedor_nome?: string
          id?: string
          modalidade?: string
          numero_ata?: string
          numero_planejamento?: string | null
          objeto?: string | null
          orgao_gerenciador?: string
          orgao_gerenciador_sigla?: string | null
          pdf_ata_nome?: string | null
          pdf_ata_url?: string | null
          pdf_termo_nome?: string | null
          pdf_termo_url?: string | null
          slug?: string
          status?: string
          updated_at?: string | null
          vigencia_meses?: number | null
        }
        Relationships: []
      }
      candidaturas: {
        Row: {
          cenario_atual: string
          cpf: string
          created_at: string | null
          curriculo_nome_original: string | null
          curriculo_url: string
          data_nascimento: string
          endereco_completo: string
          escolaridade: string
          id: string
          indicacao: string | null
          nome_completo: string
          possui_cnh: boolean | null
          possui_experiencia: boolean | null
          pretensao_salarial: number | null
          status: string | null
          telefone: string
          tipo_cnh: string | null
          vaga_id: string
        }
        Insert: {
          cenario_atual: string
          cpf: string
          created_at?: string | null
          curriculo_nome_original?: string | null
          curriculo_url: string
          data_nascimento: string
          endereco_completo: string
          escolaridade: string
          id?: string
          indicacao?: string | null
          nome_completo: string
          possui_cnh?: boolean | null
          possui_experiencia?: boolean | null
          pretensao_salarial?: number | null
          status?: string | null
          telefone: string
          tipo_cnh?: string | null
          vaga_id: string
        }
        Update: {
          cenario_atual?: string
          cpf?: string
          created_at?: string | null
          curriculo_nome_original?: string | null
          curriculo_url?: string
          data_nascimento?: string
          endereco_completo?: string
          escolaridade?: string
          id?: string
          indicacao?: string | null
          nome_completo?: string
          possui_cnh?: boolean | null
          possui_experiencia?: boolean | null
          pretensao_salarial?: number | null
          status?: string | null
          telefone?: string
          tipo_cnh?: string | null
          vaga_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidaturas_vaga_id_fkey"
            columns: ["vaga_id"]
            isOneToOne: false
            referencedRelation: "vagas"
            referencedColumns: ["id"]
          },
        ]
      }
      equipamentos: {
        Row: {
          ativo: boolean | null
          autonomia_min: number | null
          capacidade_armazenamento_tb: number | null
          caracteristicas_livres: string | null
          categoria: string
          created_at: string | null
          fabricante: string | null
          formato: string | null
          id: string
          ir_metros: number | null
          nome_comercial: string
          poe: boolean | null
          portas: number | null
          potencia_va: number | null
          preco_custo: number | null
          preco_venda: number | null
          ptz: boolean | null
          resolucao_mp: number | null
          tecnologia: string | null
          updated_at: string | null
          varifocal: boolean | null
          velocidade: string | null
        }
        Insert: {
          ativo?: boolean | null
          autonomia_min?: number | null
          capacidade_armazenamento_tb?: number | null
          caracteristicas_livres?: string | null
          categoria: string
          created_at?: string | null
          fabricante?: string | null
          formato?: string | null
          id?: string
          ir_metros?: number | null
          nome_comercial: string
          poe?: boolean | null
          portas?: number | null
          potencia_va?: number | null
          preco_custo?: number | null
          preco_venda?: number | null
          ptz?: boolean | null
          resolucao_mp?: number | null
          tecnologia?: string | null
          updated_at?: string | null
          varifocal?: boolean | null
          velocidade?: string | null
        }
        Update: {
          ativo?: boolean | null
          autonomia_min?: number | null
          capacidade_armazenamento_tb?: number | null
          caracteristicas_livres?: string | null
          categoria?: string
          created_at?: string | null
          fabricante?: string | null
          formato?: string | null
          id?: string
          ir_metros?: number | null
          nome_comercial?: string
          poe?: boolean | null
          portas?: number | null
          potencia_va?: number | null
          preco_custo?: number | null
          preco_venda?: number | null
          ptz?: boolean | null
          resolucao_mp?: number | null
          tecnologia?: string | null
          updated_at?: string | null
          varifocal?: boolean | null
          velocidade?: string | null
        }
        Relationships: []
      }
      organization_settings: {
        Row: {
          accent_color: string | null
          address_city: string | null
          address_complement: string | null
          address_neighborhood: string | null
          address_number: string | null
          address_state: string | null
          address_street: string | null
          address_zipcode: string | null
          business_hours: string | null
          cnpj: string
          company_name: string
          company_short_name: string
          company_slogan: string | null
          created_at: string | null
          email: string | null
          favicon_url: string | null
          id: string
          logo_dark_url: string | null
          logo_url: string | null
          phone: string | null
          primary_color: string | null
          secondary_color: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          social_facebook: string | null
          social_instagram: string | null
          social_linkedin: string | null
          social_youtube: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          accent_color?: string | null
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zipcode?: string | null
          business_hours?: string | null
          cnpj?: string
          company_name?: string
          company_short_name?: string
          company_slogan?: string | null
          created_at?: string | null
          email?: string | null
          favicon_url?: string | null
          id?: string
          logo_dark_url?: string | null
          logo_url?: string | null
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_youtube?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          accent_color?: string | null
          address_city?: string | null
          address_complement?: string | null
          address_neighborhood?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zipcode?: string | null
          business_hours?: string | null
          cnpj?: string
          company_name?: string
          company_short_name?: string
          company_slogan?: string | null
          created_at?: string | null
          email?: string | null
          favicon_url?: string | null
          id?: string
          logo_dark_url?: string | null
          logo_url?: string | null
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          social_facebook?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_youtube?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      permissions: {
        Row: {
          action: string
          created_at: string | null
          id: string
          name: string
          resource: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          name: string
          resource: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          name?: string
          resource?: string
        }
        Relationships: []
      }
      process_logs: {
        Row: {
          created_at: string | null
          detalhes: Json | null
          duracao_ms: number | null
          etapa: string
          id: string
          item_id: string | null
          mensagem: string | null
          status: string
          termo_id: string | null
        }
        Insert: {
          created_at?: string | null
          detalhes?: Json | null
          duracao_ms?: number | null
          etapa: string
          id?: string
          item_id?: string | null
          mensagem?: string | null
          status: string
          termo_id?: string | null
        }
        Update: {
          created_at?: string | null
          detalhes?: Json | null
          duracao_ms?: number | null
          etapa?: string
          id?: string
          item_id?: string | null
          mensagem?: string | null
          status?: string
          termo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "process_logs_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "termo_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "process_logs_termo_id_fkey"
            columns: ["termo_id"]
            isOneToOne: false
            referencedRelation: "termos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          is_super_admin: boolean | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          is_super_admin?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          is_super_admin?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string | null
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string | null
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string | null
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      termo_grupos: {
        Row: {
          created_at: string | null
          id: string
          local: string | null
          nome: string
          numero: number
          observacoes: string | null
          termo_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          local?: string | null
          nome: string
          numero: number
          observacoes?: string | null
          termo_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          local?: string | null
          nome?: string
          numero?: number
          observacoes?: string | null
          termo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "termo_grupos_termo_id_fkey"
            columns: ["termo_id"]
            isOneToOne: false
            referencedRelation: "termos"
            referencedColumns: ["id"]
          },
        ]
      }
      termo_itens: {
        Row: {
          created_at: string | null
          descricao_bruta: string
          grupo_id: string | null
          id: string
          numero_item: number
          quantidade: number | null
          status: string | null
          termo_id: string
          unidade: string | null
          updated_at: string | null
          valor_estimado: number | null
        }
        Insert: {
          created_at?: string | null
          descricao_bruta: string
          grupo_id?: string | null
          id?: string
          numero_item: number
          quantidade?: number | null
          status?: string | null
          termo_id: string
          unidade?: string | null
          updated_at?: string | null
          valor_estimado?: number | null
        }
        Update: {
          created_at?: string | null
          descricao_bruta?: string
          grupo_id?: string | null
          id?: string
          numero_item?: number
          quantidade?: number | null
          status?: string | null
          termo_id?: string
          unidade?: string | null
          updated_at?: string | null
          valor_estimado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "termo_itens_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "termo_grupos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "termo_itens_termo_id_fkey"
            columns: ["termo_id"]
            isOneToOne: false
            referencedRelation: "termos"
            referencedColumns: ["id"]
          },
        ]
      }
      termo_itens_normalizados: {
        Row: {
          capacidade_armazenamento_tb: number | null
          categoria: string | null
          confidence: number | null
          created_at: string | null
          formato: string | null
          id: string
          ir_metros: number | null
          item_id: string
          observacoes: string | null
          poe: boolean | null
          portas: number | null
          potencia_va: number | null
          ptz: boolean | null
          raw_response: Json | null
          resolucao_min_mp: number | null
          tecnologia: string | null
          tipo_lente: string | null
          varifocal: boolean | null
          velocidade: string | null
        }
        Insert: {
          capacidade_armazenamento_tb?: number | null
          categoria?: string | null
          confidence?: number | null
          created_at?: string | null
          formato?: string | null
          id?: string
          ir_metros?: number | null
          item_id: string
          observacoes?: string | null
          poe?: boolean | null
          portas?: number | null
          potencia_va?: number | null
          ptz?: boolean | null
          raw_response?: Json | null
          resolucao_min_mp?: number | null
          tecnologia?: string | null
          tipo_lente?: string | null
          varifocal?: boolean | null
          velocidade?: string | null
        }
        Update: {
          capacidade_armazenamento_tb?: number | null
          categoria?: string | null
          confidence?: number | null
          created_at?: string | null
          formato?: string | null
          id?: string
          ir_metros?: number | null
          item_id?: string
          observacoes?: string | null
          poe?: boolean | null
          portas?: number | null
          potencia_va?: number | null
          ptz?: boolean | null
          raw_response?: Json | null
          resolucao_min_mp?: number | null
          tecnologia?: string | null
          tipo_lente?: string | null
          varifocal?: boolean | null
          velocidade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "termo_itens_normalizados_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: true
            referencedRelation: "termo_itens"
            referencedColumns: ["id"]
          },
        ]
      }
      termo_sugestoes: {
        Row: {
          aderencia_percentual: number | null
          comentario: string | null
          confirmado_por_usuario: boolean | null
          created_at: string | null
          equipamento_id: string
          id: string
          is_principal: boolean | null
          item_id: string
          ranking: number | null
          updated_at: string | null
        }
        Insert: {
          aderencia_percentual?: number | null
          comentario?: string | null
          confirmado_por_usuario?: boolean | null
          created_at?: string | null
          equipamento_id: string
          id?: string
          is_principal?: boolean | null
          item_id: string
          ranking?: number | null
          updated_at?: string | null
        }
        Update: {
          aderencia_percentual?: number | null
          comentario?: string | null
          confirmado_por_usuario?: boolean | null
          created_at?: string | null
          equipamento_id?: string
          id?: string
          is_principal?: boolean | null
          item_id?: string
          ranking?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "termo_sugestoes_equipamento_id_fkey"
            columns: ["equipamento_id"]
            isOneToOne: false
            referencedRelation: "equipamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "termo_sugestoes_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "termo_itens"
            referencedColumns: ["id"]
          },
        ]
      }
      termos: {
        Row: {
          created_at: string | null
          id: string
          nome: string
          numero_edital: string | null
          observacoes: string | null
          orgao: string | null
          pdf_nome_original: string | null
          pdf_url: string | null
          status: string
          total_grupos: number | null
          total_itens: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nome: string
          numero_edital?: string | null
          observacoes?: string | null
          orgao?: string | null
          pdf_nome_original?: string | null
          pdf_url?: string | null
          status?: string
          total_grupos?: number | null
          total_itens?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nome?: string
          numero_edital?: string | null
          observacoes?: string | null
          orgao?: string | null
          pdf_nome_original?: string | null
          pdf_url?: string | null
          status?: string
          total_grupos?: number | null
          total_itens?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "termos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vagas: {
        Row: {
          ativo: boolean | null
          beneficios: string | null
          created_at: string | null
          descricao: string | null
          id: string
          local: string | null
          requisitos: string | null
          tipo_contrato: string
          titulo: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          beneficios?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          local?: string | null
          requisitos?: string | null
          tipo_contrato: string
          titulo: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          beneficios?: string | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          local?: string | null
          requisitos?: string | null
          tipo_contrato?: string
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_permissions: {
        Args: { p_user_id: string }
        Returns: {
          action: string
          name: string
          resource: string
        }[]
      }
      is_super_admin: { Args: { p_user_id: string }; Returns: boolean }
      user_has_permission: {
        Args: { p_action: string; p_resource: string; p_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// Type alias for organization settings
export type OrganizationSettings = Tables<"organization_settings">
