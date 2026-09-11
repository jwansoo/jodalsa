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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      inquiry_messages: {
        Row: {
          created_at: string
          id: number
          message: string
          sender: string
          thread_id: string
        }
        Insert: {
          created_at?: string
          id?: never
          message: string
          sender: string
          thread_id: string
        }
        Update: {
          created_at?: string
          id?: never
          message?: string
          sender?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inquiry_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "inquiry_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiry_threads: {
        Row: {
          contact: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          contact?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          contact?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      jadal_tests: {
        Row: {
          answer: string
          created_at: string
          da: string
          explanation: string
          ga: string
          id: number
          la: string
          na: string
          no: number
          note: string
          question: string
          round: string
          subject: string
          subtitle: string
        }
        Insert: {
          answer: string
          created_at?: string
          da: string
          explanation: string
          ga: string
          id?: never
          la: string
          na: string
          no: number
          note: string
          question: string
          round: string
          subject: string
          subtitle: string
        }
        Update: {
          answer?: string
          created_at?: string
          da?: string
          explanation?: string
          ga?: string
          id?: never
          la?: string
          na?: string
          no?: number
          note?: string
          question?: string
          round?: string
          subject?: string
          subtitle?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          confirmed_at: string | null
          created_at: string
          depositor_name: string
          id: number
          materials: string[] | null
          product_type: string
          rounds_count: number | null
          status: string
          user_id: string
          username: string
        }
        Insert: {
          amount: number
          confirmed_at?: string | null
          created_at?: string
          depositor_name: string
          id?: never
          materials?: string[] | null
          product_type: string
          rounds_count?: number | null
          status?: string
          user_id: string
          username: string
        }
        Update: {
          amount?: number
          confirmed_at?: string | null
          created_at?: string
          depositor_name?: string
          id?: never
          materials?: string[] | null
          product_type?: string
          rounds_count?: number | null
          status?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      partner_organizations: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: never
          name: string
        }
        Update: {
          created_at?: string
          id?: never
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          birthdate: string | null
          created_at: string
          full_name: string
          id: string
          is_admin: boolean
          mode: string
          phone: string | null
          username: string
          workplace_name: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          birthdate?: string | null
          created_at?: string
          full_name: string
          id: string
          is_admin?: boolean
          mode?: string
          phone?: string | null
          username: string
          workplace_name?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          birthdate?: string | null
          created_at?: string
          full_name?: string
          id?: string
          is_admin?: boolean
          mode?: string
          phone?: string | null
          username?: string
          workplace_name?: string | null
        }
        Relationships: []
      }
      test_results: {
        Row: {
          analysis: string
          average: number
          created_at: string
          first_class: number
          id: number
          round: string
          second_class: number
          third_class: number
          username: string
        }
        Insert: {
          analysis: string
          average: number
          created_at?: string
          first_class: number
          id?: never
          round: string
          second_class: number
          third_class: number
          username: string
        }
        Update: {
          analysis?: string
          average?: number
          created_at?: string
          first_class?: number
          id?: never
          round?: string
          second_class?: number
          third_class?: number
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_results_username_fkey"
            columns: ["username"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["username"]
          },
        ]
      }
      trusted_devices: {
        Row: {
          created_at: string
          device_id: string
          id: number
          last_seen_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_id: string
          id?: never
          last_seen_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_id?: string
          id?: never
          last_seen_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      yesang_tests: {
        Row: {
          answer: string
          created_at: string
          da: string
          explanation: string
          ga: string
          id: number
          la: string
          na: string
          no: number
          note: string
          question: string
          subject: string
          subtitle: string
        }
        Insert: {
          answer: string
          created_at?: string
          da: string
          explanation: string
          ga: string
          id?: never
          la: string
          na: string
          no: number
          note: string
          question: string
          subject: string
          subtitle: string
        }
        Update: {
          answer?: string
          created_at?: string
          da?: string
          explanation?: string
          ga?: string
          id?: never
          la?: string
          na?: string
          no?: number
          note?: string
          question?: string
          subject?: string
          subtitle?: string
        }
        Relationships: []
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
