
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "categories": {
                  Row: {
                    "created_at": string,"description": string | null,"id": string,"name": string,"slug": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"description"?: string | null,"id"?: string,"name": string,"slug": string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"description"?: string | null,"id"?: string,"name"?: string,"slug"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"placements": {
                  Row: {
                    "created_at": string,"description": string | null,"id": string,"name": string,"slug": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"description"?: string | null,"id"?: string,"name": string,"slug": string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"description"?: string | null,"id"?: string,"name"?: string,"slug"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"profiles": {
                  Row: {
                    "created_at": string,"display_name": string | null,"id": string,"role": Database["public"]['Enums']["user_role"],"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"display_name"?: string | null,"id": string,"role"?: Database["public"]['Enums']["user_role"],"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"display_name"?: string | null,"id"?: string,"role"?: Database["public"]['Enums']["user_role"],"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"styles": {
                  Row: {
                    "created_at": string,"description": string | null,"id": string,"name": string,"slug": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"description"?: string | null,"id"?: string,"name": string,"slug": string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"description"?: string | null,"id"?: string,"name"?: string,"slug"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"tags": {
                  Row: {
                    "created_at": string,"id": string,"name": string,"slug": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "created_at"?: string,"id"?: string,"name": string,"slug": string,"updated_at"?: string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"name"?: string,"slug"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"tattoo_placements": {
                  Row: {
                    "placement_id": string,"tattoo_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "placement_id": string,"tattoo_id": string
                  }
                  Update: {
                    "placement_id"?: string,"tattoo_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "tattoo_placements_placement_id_fkey"
      columns: ["placement_id"]
isOneToOne: false
      referencedRelation: "placements"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "tattoo_placements_tattoo_id_fkey"
      columns: ["tattoo_id"]
isOneToOne: false
      referencedRelation: "tattoos"
      referencedColumns: ["id"]
    }
                  ]
                },"tattoo_styles": {
                  Row: {
                    "style_id": string,"tattoo_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "style_id": string,"tattoo_id": string
                  }
                  Update: {
                    "style_id"?: string,"tattoo_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "tattoo_styles_style_id_fkey"
      columns: ["style_id"]
isOneToOne: false
      referencedRelation: "styles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "tattoo_styles_tattoo_id_fkey"
      columns: ["tattoo_id"]
isOneToOne: false
      referencedRelation: "tattoos"
      referencedColumns: ["id"]
    }
                  ]
                },"tattoo_tags": {
                  Row: {
                    "tag_id": string,"tattoo_id": string
                  }
                  ComputedFields: never
                  Insert: {
                    "tag_id": string,"tattoo_id": string
                  }
                  Update: {
                    "tag_id"?: string,"tattoo_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "tattoo_tags_tag_id_fkey"
      columns: ["tag_id"]
isOneToOne: false
      referencedRelation: "tags"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "tattoo_tags_tattoo_id_fkey"
      columns: ["tattoo_id"]
isOneToOne: false
      referencedRelation: "tattoos"
      referencedColumns: ["id"]
    }
                  ]
                },"tattoos": {
                  Row: {
                    "attribution": string | null,"category_id": string | null,"created_at": string,"description": string | null,"id": string,"image_alt": string | null,"image_height": number | null,"image_path": string,"image_width": number | null,"is_demo": boolean,"is_featured": boolean,"is_published": boolean,"license": string | null,"search_vector": unknown,"slug": string,"source": string | null,"title": string,"updated_at": string
                  }
                  ComputedFields: never
                  Insert: {
                    "attribution"?: string | null,"category_id"?: string | null,"created_at"?: string,"description"?: string | null,"id"?: string,"image_alt"?: string | null,"image_height"?: number | null,"image_path": string,"image_width"?: number | null,"is_demo"?: boolean,"is_featured"?: boolean,"is_published"?: boolean,"license"?: string | null,"search_vector"?: never,"slug": string,"source"?: string | null,"title": string,"updated_at"?: string
                  }
                  Update: {
                    "attribution"?: string | null,"category_id"?: string | null,"created_at"?: string,"description"?: string | null,"id"?: string,"image_alt"?: string | null,"image_height"?: number | null,"image_path"?: string,"image_width"?: number | null,"is_demo"?: boolean,"is_featured"?: boolean,"is_published"?: boolean,"license"?: string | null,"search_vector"?: never,"slug"?: string,"source"?: string | null,"title"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "tattoos_category_id_fkey"
      columns: ["category_id"]
isOneToOne: false
      referencedRelation: "categories"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "is_admin":
{ Args: Record<PropertyKey, never>; Returns: boolean
                           }
          }
          Enums: {
            "user_role": "user"|"admin"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            "user_role": ["user", "admin"]
          }
        }
} as const
