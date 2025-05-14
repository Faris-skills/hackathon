export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      comparisons: {
        Row: {
          id: string
          user_id: string
          reference_image: string
          comparison_image: string
          results: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          reference_image: string
          comparison_image: string
          results: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          reference_image?: string
          comparison_image?: string
          results?: string
          created_at?: string
        }
      }
    }
  }
}
