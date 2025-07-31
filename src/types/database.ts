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
      candidates: {
        Row: {
          id: string
          email: string
          linkedin_id: string | null
          full_name: string
          current_employment_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          linkedin_id?: string | null
          full_name: string
          current_employment_status: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          linkedin_id?: string | null
          full_name?: string
          current_employment_status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      employment_history: {
        Row: {
          id: string
          candidate_id: string
          company_name: string
          job_title: string
          start_date: string
          end_date: string | null
          is_current: boolean
          achievements: string[]
          documents_urls: string[]
          created_at: string
        }
        Insert: {
          id?: string
          candidate_id: string
          company_name: string
          job_title: string
          start_date: string
          end_date?: string | null
          is_current?: boolean
          achievements?: string[]
          documents_urls?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          candidate_id?: string
          company_name?: string
          job_title?: string
          start_date?: string
          end_date?: string | null
          is_current?: boolean
          achievements?: string[]
          documents_urls?: string[]
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employment_history_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          }
        ]
      }
      referees: {
        Row: {
          id: string
          candidate_id: string
          employment_id: string
          name: string
          email: string
          company: string
          role: string | null
          relationship: string | null
          email_domain: string
          is_verified: boolean
          created_at: string
        }
        Insert: {
          id?: string
          candidate_id: string
          employment_id: string
          name: string
          email: string
          company: string
          role?: string | null
          relationship?: string | null
          email_domain: string
          is_verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          candidate_id?: string
          employment_id?: string
          name?: string
          email?: string
          company?: string
          role?: string | null
          relationship?: string | null
          email_domain?: string
          is_verified?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referees_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referees_employment_id_fkey"
            columns: ["employment_id"]
            isOneToOne: false
            referencedRelation: "employment_history"
            referencedColumns: ["id"]
          }
        ]
      }
      reference_responses: {
        Row: {
          id: string
          referee_id: string
          token: string
          relationship: string | null
          role_confirmation: string | null
          duration_confirmation: string | null
          would_rehire: boolean | null
          returned_property: boolean | null
          left_on_good_terms: boolean | null
          achievements_aligned: boolean | null
          concerns: string | null
          additional_comments: string | null
          submitted_at: string | null
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          referee_id: string
          token: string
          relationship?: string | null
          role_confirmation?: string | null
          duration_confirmation?: string | null
          would_rehire?: boolean | null
          returned_property?: boolean | null
          left_on_good_terms?: boolean | null
          achievements_aligned?: boolean | null
          concerns?: string | null
          additional_comments?: string | null
          submitted_at?: string | null
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          referee_id?: string
          token?: string
          relationship?: string | null
          role_confirmation?: string | null
          duration_confirmation?: string | null
          would_rehire?: boolean | null
          returned_property?: boolean | null
          left_on_good_terms?: boolean | null
          achievements_aligned?: boolean | null
          concerns?: string | null
          additional_comments?: string | null
          submitted_at?: string | null
          expires_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reference_responses_referee_id_fkey"
            columns: ["referee_id"]
            isOneToOne: false
            referencedRelation: "referees"
            referencedColumns: ["id"]
          }
        ]
      }
      ai_scores: {
        Row: {
          id: string
          candidate_id: string
          credibility_score: number
          integrity_score: number
          achievement_score: number
          rehire_score: number
          summary: string
          analysis_date: string
        }
        Insert: {
          id?: string
          candidate_id: string
          credibility_score: number
          integrity_score: number
          achievement_score: number
          rehire_score: number
          summary: string
          analysis_date?: string
        }
        Update: {
          id?: string
          candidate_id?: string
          credibility_score?: number
          integrity_score?: number
          achievement_score?: number
          rehire_score?: number
          summary?: string
          analysis_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_scores_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          }
        ]
      }
      admin_users: {
        Row: {
          id: string
          email: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          created_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          resource_type: string
          resource_id: string | null
          details: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          resource_type: string
          resource_id?: string | null
          details: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          resource_type?: string
          resource_id?: string | null
          details?: Json
          created_at?: string
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