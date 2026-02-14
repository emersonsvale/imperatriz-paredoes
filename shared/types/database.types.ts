export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.1'
  }
  public: {
    Tables: {
      banner: {
        Row: {
          created_at: string
          id: string
          image_alt: string | null
          image_url: string
          link: string | null
          ordem: number
        }
        Insert: {
          created_at?: string
          id?: string
          image_alt?: string | null
          image_url: string
          link?: string | null
          ordem?: number
        }
        Update: {
          created_at?: string
          id?: string
          image_alt?: string | null
          image_url?: string
          link?: string | null
          ordem?: number
        }
        Relationships: []
      }
      cd: {
        Row: {
          capa_url: string | null
          created_at: string
          descricao: string | null
          downloads_count: number
          genero: string | null
          id: string
          perfil_id: string
          plays_count: number
          titulo: string
        }
        Insert: {
          capa_url?: string | null
          created_at?: string
          descricao?: string | null
          downloads_count?: number
          genero?: string | null
          id?: string
          perfil_id: string
          plays_count?: number
          titulo: string
        }
        Update: {
          capa_url?: string | null
          created_at?: string
          descricao?: string | null
          downloads_count?: number
          genero?: string | null
          id?: string
          perfil_id?: string
          plays_count?: number
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: 'cd_perfil_id_fkey'
            columns: ['perfil_id']
            isOneToOne: false
            referencedRelation: 'perfil'
            referencedColumns: ['id']
          },
        ]
      }
      faixa: {
        Row: {
          arquivo_url: string | null
          artista: string | null
          cd_id: string
          downloads_count: number
          duracao: string | null
          id: string
          ordem: number
          plays_count: number
          titulo: string
        }
        Insert: {
          arquivo_url?: string | null
          artista?: string | null
          cd_id: string
          downloads_count?: number
          duracao?: string | null
          id?: string
          ordem?: number
          plays_count?: number
          titulo: string
        }
        Update: {
          arquivo_url?: string | null
          artista?: string | null
          cd_id?: string
          downloads_count?: number
          duracao?: string | null
          id?: string
          ordem?: number
          plays_count?: number
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: 'faixa_cd_id_fkey'
            columns: ['cd_id']
            isOneToOne: false
            referencedRelation: 'cd'
            referencedColumns: ['id']
          },
        ]
      }
      parceiro: {
        Row: {
          created_at: string
          href: string | null
          id: string
          logo_url: string | null
          nome: string
          ordem: number
        }
        Insert: {
          created_at?: string
          href?: string | null
          id?: string
          logo_url?: string | null
          nome: string
          ordem?: number
        }
        Update: {
          created_at?: string
          href?: string | null
          id?: string
          logo_url?: string | null
          nome?: string
          ordem?: number
        }
        Relationships: []
      }
      hero_slide: {
        Row: {
          created_at: string
          id: string
          ordem: number
          reference_id: string
          type: Database['public']['Enums']['hero_slide_type']
        }
        Insert: {
          created_at?: string
          id?: string
          ordem?: number
          reference_id: string
          type: Database['public']['Enums']['hero_slide_type']
        }
        Update: {
          created_at?: string
          id?: string
          ordem?: number
          reference_id?: string
          type?: Database['public']['Enums']['hero_slide_type']
        }
        Relationships: []
      }
      perfil: {
        Row: {
          bio: string | null
          created_at: string
          email: string | null
          facebook: string | null
          foto_perfil: string | null
          id: string
          instagram: string | null
          nome: string | null
          telefone: string | null
          tipo_user: Database['public']['Enums']['tipo_user'] | null
          twitter: string | null
          whatsapp: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email?: string | null
          facebook?: string | null
          foto_perfil?: string | null
          id?: string
          instagram?: string | null
          nome?: string | null
          telefone?: string | null
          tipo_user?: Database['public']['Enums']['tipo_user'] | null
          twitter?: string | null
          whatsapp?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string | null
          facebook?: string | null
          foto_perfil?: string | null
          id?: string
          instagram?: string | null
          nome?: string | null
          telefone?: string | null
          tipo_user?: Database['public']['Enums']['tipo_user'] | null
          twitter?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_cd_downloads: { Args: { p_cd_id: string }; Returns: undefined }
      increment_faixa_downloads: {
        Args: { p_cd_id: string; p_faixa_id: string }
        Returns: undefined
      }
      increment_faixa_plays: {
        Args: { p_cd_id: string; p_faixa_id: string }
        Returns: undefined
      }
    }
    Enums: {
      hero_slide_type: 'banner' | 'cd' | 'dj'
      tipo_user: 'Admin' | 'DJ' | 'Ouvinte'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      hero_slide_type: ['banner', 'cd', 'dj'] as const,
      tipo_user: ['Admin', 'DJ', 'Ouvinte'] as const,
    },
  },
} as const
