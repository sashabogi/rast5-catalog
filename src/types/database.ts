export interface Connector {
  id: string
  model: string
  display_name: string | null

  // Classification
  category: string
  pole_count: number

  // Type & Orientation
  connector_type: string
  gender: string
  orientation: string | null
  mounting_type: string | null
  terminal_suffix: string

  // Terminal Information
  terminal_specs: string[] | null
  terminal_description: string | null

  // Compatibility
  compatible_with: string[] | null
  mates_with: string[] | null
  assembly_variants: string[] | null

  // Media (360° video)
  video_360_url: string
  video_thumbnail_time: number | null

  // Documentation
  technical_drawing_url: string | null
  keying_pdf: string | null
  is_special_version: boolean
  special_notes: string | null

  // Metadata
  created_at: string
  updated_at: string
}

export interface Terminal {
  id: number
  spec_number: string
  terminal_type: string
  gender: string
  description: string | null
  image_url: string | null
  used_in_suffix: string[] | null
  created_at: string
}

export interface KeyingDocument {
  id: number
  pole_count: number
  document_type: string
  filename: string
  file_url: string
  description: string | null
  created_at: string
}

// Gender badge colors
export type GenderType = 'Female' | 'Male' | 'PCB'

export const GENDER_COLORS: Record<GenderType, string> = {
  Female: 'blue',
  Male: 'orange',
  PCB: 'green'
}

// Category display names
export const CATEGORY_NAMES: Record<string, string> = {
  'X-For socket terminals': 'Socket Connectors (Female)',
  'X-For tab terminals': 'Tab Connectors (Male)',
  'X-Printed circuit board headers': 'PCB Headers'
}

// Supabase Database Types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'admin' | 'editor' | 'viewer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role?: 'admin' | 'editor' | 'viewer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'admin' | 'editor' | 'viewer'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      user_role: 'admin' | 'editor' | 'viewer'
    }
  }
}
