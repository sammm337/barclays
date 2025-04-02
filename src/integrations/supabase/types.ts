export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          badge_url: string | null
          description: string | null
          earned_at: string
          id: string
          title: string
          user_id: string | null
        }
        Insert: {
          badge_url?: string | null
          description?: string | null
          earned_at?: string
          id?: string
          title: string
          user_id?: string | null
        }
        Update: {
          badge_url?: string | null
          description?: string | null
          earned_at?: string
          id?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          created_at: string
          id: string
          title: string
          type: string
          url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          title: string
          type: string
          url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          type?: string
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_progress: {
        Row: {
          completed: boolean | null
          created_at: string
          id: string
          last_quiz_attempt: string | null
          quiz_passed: boolean | null
          quiz_score: number | null
          updated_at: string
          user_id: string | null
          video_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          id?: string
          last_quiz_attempt?: string | null
          quiz_passed?: boolean | null
          quiz_score?: number | null
          updated_at?: string
          user_id?: string | null
          video_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          id?: string
          last_quiz_attempt?: string | null
          quiz_passed?: boolean | null
          quiz_score?: number | null
          updated_at?: string
          user_id?: string | null
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_quizzes: {
        Row: {
          correct_answer: string
          course_id: string | null
          created_at: string
          id: string
          options: string[]
          question: string
        }
        Insert: {
          correct_answer: string
          course_id?: string | null
          created_at?: string
          id?: string
          options: string[]
          question: string
        }
        Update: {
          correct_answer?: string
          course_id?: string | null
          created_at?: string
          id?: string
          options?: string[]
          question?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_videos: {
        Row: {
          course_id: string | null
          description: string | null
          duration: number | null
          id: string
          sequence_number: number
          title: string
          video_url: string
        }
        Insert: {
          course_id?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          sequence_number: number
          title: string
          video_url: string
        }
        Update: {
          course_id?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          sequence_number?: number
          title?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_videos_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          difficulty_level: string
          id: string
          is_free: boolean | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty_level: string
          id?: string
          is_free?: boolean | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty_level?: string
          id?: string
          is_free?: boolean | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_id?: string | null
        }
        Relationships: []
      }
      notes: {
        Row: {
          content: string | null
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_responses: {
        Row: {
          completed_at: string
          daily_time: string | null
          domain_interests: string[] | null
          id: string
          learning_goals: string[] | null
          learning_style: string[] | null
          specific_goals: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string
          daily_time?: string | null
          domain_interests?: string[] | null
          id?: string
          learning_goals?: string[] | null
          learning_style?: string[] | null
          specific_goals?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string
          daily_time?: string | null
          domain_interests?: string[] | null
          id?: string
          learning_goals?: string[] | null
          learning_style?: string[] | null
          specific_goals?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_status: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          is_completed: boolean | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_status_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          full_name: string | null
          id: string
          last_username_change: string | null
          subjects_of_interest: string[] | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          id: string
          last_username_change?: string | null
          subjects_of_interest?: string[] | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          id?: string
          last_username_change?: string | null
          subjects_of_interest?: string[] | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      research_papers: {
        Row: {
          created_at: string
          file_url: string
          id: string
          summary: string | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          file_url: string
          id?: string
          summary?: string | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          file_url?: string
          id?: string
          summary?: string | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "research_papers_user_id_fkey"
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
