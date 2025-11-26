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
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
