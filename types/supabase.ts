export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      rooms: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      room_images: {
        Row: {
          id: string
          room_id: string
          reference_image: string
          comparison_image: string | null
          results: string | null
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          reference_image: string
          comparison_image?: string | null
          results?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          reference_image?: string
          comparison_image?: string | null
          results?: string | null
          created_at?: string
        }
      }
    }
  }
}