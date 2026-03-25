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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          action_by: string | null
          created_at: string
          department: string | null
          entity_id: string
          entity_type: string
          id: string
          metadata: Json | null
          new_value: Json | null
          notes: string | null
          previous_value: Json | null
        }
        Insert: {
          action: string
          action_by?: string | null
          created_at?: string
          department?: string | null
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json | null
          new_value?: Json | null
          notes?: string | null
          previous_value?: Json | null
        }
        Update: {
          action?: string
          action_by?: string | null
          created_at?: string
          department?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json | null
          new_value?: Json | null
          notes?: string | null
          previous_value?: Json | null
        }
        Relationships: []
      }
      bank_transactions: {
        Row: {
          amount: number
          bank_account: string
          created_at: string
          currency: string
          description: string | null
          id: string
          matched_payment_id: string | null
          reconciled: boolean | null
          reference: string | null
          transaction_date: string
          transaction_type: string
        }
        Insert: {
          amount?: number
          bank_account?: string
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          matched_payment_id?: string | null
          reconciled?: boolean | null
          reference?: string | null
          transaction_date?: string
          transaction_type?: string
        }
        Update: {
          amount?: number
          bank_account?: string
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          matched_payment_id?: string | null
          reconciled?: boolean | null
          reference?: string | null
          transaction_date?: string
          transaction_type?: string
        }
        Relationships: []
      }
      candidates: {
        Row: {
          ai_score: number | null
          created_at: string
          email: string
          full_name: string
          id: string
          interview_answers: Json | null
          phone: string | null
          status: string
        }
        Insert: {
          ai_score?: number | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          interview_answers?: Json | null
          phone?: string | null
          status?: string
        }
        Update: {
          ai_score?: number | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          interview_answers?: Json | null
          phone?: string | null
          status?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          assigned_to: string | null
          billing_address: string | null
          city: string | null
          client_type: string | null
          company: string | null
          company_billing_name: string | null
          company_vat: string | null
          country: string | null
          created_at: string
          credit_balance: number | null
          date_of_birth: string | null
          email: string | null
          email_allowed: boolean | null
          first_name: string | null
          full_name: string
          gender: string | null
          id: string
          industry: string | null
          invitation_status: string | null
          last_name: string | null
          lead_source: string | null
          marketing_optin: boolean | null
          member_status: string | null
          membership_tier: string | null
          nationality: string | null
          notes: string | null
          office_location: string | null
          passport_country: string | null
          phone: string | null
          phone_allowed: boolean | null
          preferred_contact_method: string | null
          preferred_contact_time: string | null
          preferred_language: string | null
          profile_completeness: number | null
          referral_status: string | null
          updated_at: string | null
          user_id: string | null
          verification_status: string | null
          whatsapp: string | null
          whatsapp_allowed: boolean | null
        }
        Insert: {
          address?: string | null
          assigned_to?: string | null
          billing_address?: string | null
          city?: string | null
          client_type?: string | null
          company?: string | null
          company_billing_name?: string | null
          company_vat?: string | null
          country?: string | null
          created_at?: string
          credit_balance?: number | null
          date_of_birth?: string | null
          email?: string | null
          email_allowed?: boolean | null
          first_name?: string | null
          full_name: string
          gender?: string | null
          id?: string
          industry?: string | null
          invitation_status?: string | null
          last_name?: string | null
          lead_source?: string | null
          marketing_optin?: boolean | null
          member_status?: string | null
          membership_tier?: string | null
          nationality?: string | null
          notes?: string | null
          office_location?: string | null
          passport_country?: string | null
          phone?: string | null
          phone_allowed?: boolean | null
          preferred_contact_method?: string | null
          preferred_contact_time?: string | null
          preferred_language?: string | null
          profile_completeness?: number | null
          referral_status?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
          whatsapp?: string | null
          whatsapp_allowed?: boolean | null
        }
        Update: {
          address?: string | null
          assigned_to?: string | null
          billing_address?: string | null
          city?: string | null
          client_type?: string | null
          company?: string | null
          company_billing_name?: string | null
          company_vat?: string | null
          country?: string | null
          created_at?: string
          credit_balance?: number | null
          date_of_birth?: string | null
          email?: string | null
          email_allowed?: boolean | null
          first_name?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          industry?: string | null
          invitation_status?: string | null
          last_name?: string | null
          lead_source?: string | null
          marketing_optin?: boolean | null
          member_status?: string | null
          membership_tier?: string | null
          nationality?: string | null
          notes?: string | null
          office_location?: string | null
          passport_country?: string | null
          phone?: string | null
          phone_allowed?: boolean | null
          preferred_contact_method?: string | null
          preferred_contact_time?: string | null
          preferred_language?: string | null
          profile_completeness?: number | null
          referral_status?: string | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
          whatsapp?: string | null
          whatsapp_allowed?: boolean | null
        }
        Relationships: []
      }
      concierge_preferences: {
        Row: {
          chauffeur: boolean | null
          created_at: string | null
          hotel_preferences: string | null
          id: string
          notes: string | null
          security_escort: boolean | null
          special_assistance: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          chauffeur?: boolean | null
          created_at?: string | null
          hotel_preferences?: string | null
          id?: string
          notes?: string | null
          security_escort?: boolean | null
          special_assistance?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          chauffeur?: boolean | null
          created_at?: string | null
          hotel_preferences?: string | null
          id?: string
          notes?: string | null
          security_escort?: boolean | null
          special_assistance?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          created_at: string
          file_url: string | null
          id: string
          quote_id: string | null
          status: Database["public"]["Enums"]["contract_status"]
        }
        Insert: {
          created_at?: string
          file_url?: string | null
          id?: string
          quote_id?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
        }
        Update: {
          created_at?: string
          file_url?: string | null
          id?: string
          quote_id?: string | null
          status?: Database["public"]["Enums"]["contract_status"]
        }
        Relationships: [
          {
            foreignKeyName: "contracts_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_notes: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string
          created_by: string | null
          currency: string
          id: string
          issued_date: string | null
          note_type: string
          reason: string | null
          related_invoice_id: string | null
          related_payment_id: string | null
          status: string
          supplier_name: string | null
          updated_at: string | null
        }
        Insert: {
          amount?: number
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          id?: string
          issued_date?: string | null
          note_type?: string
          reason?: string | null
          related_invoice_id?: string | null
          related_payment_id?: string | null
          status?: string
          supplier_name?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          id?: string
          issued_date?: string | null
          note_type?: string
          reason?: string | null
          related_invoice_id?: string | null
          related_payment_id?: string | null
          status?: string
          supplier_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      flight_requests: {
        Row: {
          assigned_to: string | null
          baggage_notes: string | null
          budget_range: string | null
          campaign: string | null
          catering_request: string | null
          client_id: string | null
          company_name: string | null
          concierge_needed: boolean | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          date: string | null
          departure: string
          destination: string
          ground_transport: boolean | null
          helicopter_transfer: boolean | null
          id: string
          is_urgent: boolean | null
          lead_id: string | null
          notes: string | null
          passengers: number | null
          pets: boolean | null
          preferred_aircraft_category: string | null
          preferred_contact_method: string | null
          preferred_time: string | null
          priority: string | null
          return_date: string | null
          return_time: string | null
          smoking: boolean | null
          source: string | null
          special_assistance: string | null
          special_requests: string | null
          specific_aircraft: string | null
          status: Database["public"]["Enums"]["request_status"]
          trip_type: string | null
          updated_at: string | null
          vip_terminal: boolean | null
        }
        Insert: {
          assigned_to?: string | null
          baggage_notes?: string | null
          budget_range?: string | null
          campaign?: string | null
          catering_request?: string | null
          client_id?: string | null
          company_name?: string | null
          concierge_needed?: boolean | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          date?: string | null
          departure: string
          destination: string
          ground_transport?: boolean | null
          helicopter_transfer?: boolean | null
          id?: string
          is_urgent?: boolean | null
          lead_id?: string | null
          notes?: string | null
          passengers?: number | null
          pets?: boolean | null
          preferred_aircraft_category?: string | null
          preferred_contact_method?: string | null
          preferred_time?: string | null
          priority?: string | null
          return_date?: string | null
          return_time?: string | null
          smoking?: boolean | null
          source?: string | null
          special_assistance?: string | null
          special_requests?: string | null
          specific_aircraft?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          trip_type?: string | null
          updated_at?: string | null
          vip_terminal?: boolean | null
        }
        Update: {
          assigned_to?: string | null
          baggage_notes?: string | null
          budget_range?: string | null
          campaign?: string | null
          catering_request?: string | null
          client_id?: string | null
          company_name?: string | null
          concierge_needed?: boolean | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          date?: string | null
          departure?: string
          destination?: string
          ground_transport?: boolean | null
          helicopter_transfer?: boolean | null
          id?: string
          is_urgent?: boolean | null
          lead_id?: string | null
          notes?: string | null
          passengers?: number | null
          pets?: boolean | null
          preferred_aircraft_category?: string | null
          preferred_contact_method?: string | null
          preferred_time?: string | null
          priority?: string | null
          return_date?: string | null
          return_time?: string | null
          smoking?: boolean | null
          source?: string | null
          special_assistance?: string | null
          special_requests?: string | null
          specific_aircraft?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          trip_type?: string | null
          updated_at?: string | null
          vip_terminal?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "flight_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flight_requests_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          contract_id: string | null
          created_at: string
          due_date: string | null
          id: string
          status: Database["public"]["Enums"]["invoice_status"]
        }
        Insert: {
          amount: number
          contract_id?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          status?: Database["public"]["Enums"]["invoice_status"]
        }
        Update: {
          amount?: number
          contract_id?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          status?: Database["public"]["Enums"]["invoice_status"]
        }
        Relationships: [
          {
            foreignKeyName: "invoices_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          client_id: string | null
          created_at: string
          id: string
          source: string | null
          status: Database["public"]["Enums"]["lead_status"]
        }
        Insert: {
          assigned_to?: string | null
          client_id?: string | null
          created_at?: string
          id?: string
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
        }
        Update: {
          assigned_to?: string | null
          client_id?: string | null
          created_at?: string
          id?: string
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
        }
        Relationships: [
          {
            foreignKeyName: "leads_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      member_documents: {
        Row: {
          created_at: string | null
          doc_type: string | null
          file_url: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          doc_type?: string | null
          file_url: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          doc_type?: string | null
          file_url?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      membership_applications: {
        Row: {
          aircraft_category_preference: string | null
          billing_details: string | null
          city: string | null
          client_id: string | null
          company: string | null
          country: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          invitation_code: string | null
          invitation_status: string | null
          nationality: string | null
          passenger_count: string | null
          phone: string | null
          preferred_tier: string | null
          reason: string | null
          referral_linkage: string | null
          referral_source: string | null
          source: string | null
          status: string
          terms_accepted: boolean | null
          title: string | null
          travel_frequency: string | null
          typical_routes: string[] | null
          updated_at: string | null
          user_id: string | null
          verification_status: string | null
          whatsapp: string | null
        }
        Insert: {
          aircraft_category_preference?: string | null
          billing_details?: string | null
          city?: string | null
          client_id?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          invitation_code?: string | null
          invitation_status?: string | null
          nationality?: string | null
          passenger_count?: string | null
          phone?: string | null
          preferred_tier?: string | null
          reason?: string | null
          referral_linkage?: string | null
          referral_source?: string | null
          source?: string | null
          status?: string
          terms_accepted?: boolean | null
          title?: string | null
          travel_frequency?: string | null
          typical_routes?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
          whatsapp?: string | null
        }
        Update: {
          aircraft_category_preference?: string | null
          billing_details?: string | null
          city?: string | null
          client_id?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          invitation_code?: string | null
          invitation_status?: string | null
          nationality?: string | null
          passenger_count?: string | null
          phone?: string | null
          preferred_tier?: string | null
          reason?: string | null
          referral_linkage?: string | null
          referral_source?: string | null
          source?: string | null
          status?: string
          terms_accepted?: boolean | null
          title?: string | null
          travel_frequency?: string | null
          typical_routes?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          verification_status?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "membership_applications_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      outreach_templates: {
        Row: {
          body: string
          channel: string
          created_at: string
          id: string
          name: string
          placeholders: string[] | null
          subject: string | null
          updated_at: string
        }
        Insert: {
          body: string
          channel?: string
          created_at?: string
          id?: string
          name: string
          placeholders?: string[] | null
          subject?: string | null
          updated_at?: string
        }
        Update: {
          body?: string
          channel?: string
          created_at?: string
          id?: string
          name?: string
          placeholders?: string[] | null
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string
          created_by: string | null
          currency: string
          id: string
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          payment_type: string
          reconciled: boolean | null
          reconciled_at: string | null
          reference: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          status: string
          supplier_name: string | null
          updated_at: string | null
        }
        Insert: {
          amount?: number
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_type?: string
          reconciled?: boolean | null
          reconciled_at?: string | null
          reference?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          status?: string
          supplier_name?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          currency?: string
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_type?: string
          reconciled?: boolean | null
          reconciled_at?: string | null
          reference?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          status?: string
          supplier_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          available_credit: number | null
          avatar_url: string | null
          billing_address: string | null
          city: string | null
          company: string | null
          country: string | null
          created_at: string
          full_name: string | null
          id: string
          invitation_status: string | null
          member_id: string | null
          membership_tier: string | null
          nationality: string | null
          payment_preference: string | null
          phone: string | null
          referrals_sent: number | null
          title: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          available_credit?: number | null
          avatar_url?: string | null
          billing_address?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          invitation_status?: string | null
          member_id?: string | null
          membership_tier?: string | null
          nationality?: string | null
          payment_preference?: string | null
          phone?: string | null
          referrals_sent?: number | null
          title?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          available_credit?: number | null
          avatar_url?: string | null
          billing_address?: string | null
          city?: string | null
          company?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          invitation_status?: string | null
          member_id?: string | null
          membership_tier?: string | null
          nationality?: string | null
          payment_preference?: string | null
          phone?: string | null
          referrals_sent?: number | null
          title?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          aircraft: string | null
          created_at: string
          created_by: string | null
          id: string
          operator: string | null
          price: number | null
          request_id: string | null
          status: Database["public"]["Enums"]["quote_status"]
          valid_until: string | null
        }
        Insert: {
          aircraft?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          operator?: string | null
          price?: number | null
          request_id?: string | null
          status?: Database["public"]["Enums"]["quote_status"]
          valid_until?: string | null
        }
        Update: {
          aircraft?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          operator?: string | null
          price?: number | null
          request_id?: string | null
          status?: Database["public"]["Enums"]["quote_status"]
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "flight_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string
          credit_issued: boolean | null
          credit_used: boolean | null
          id: string
          notes: string | null
          qualification_date: string | null
          referred_client_id: string | null
          referred_email: string
          referred_name: string
          referred_phone: string | null
          referrer_id: string
          reward_amount: number | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          credit_issued?: boolean | null
          credit_used?: boolean | null
          id?: string
          notes?: string | null
          qualification_date?: string | null
          referred_client_id?: string | null
          referred_email: string
          referred_name: string
          referred_phone?: string | null
          referrer_id: string
          reward_amount?: number | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          credit_issued?: boolean | null
          credit_used?: boolean | null
          id?: string
          notes?: string | null
          qualification_date?: string | null
          referred_client_id?: string | null
          referred_email?: string
          referred_name?: string
          referred_phone?: string | null
          referrer_id?: string
          reward_amount?: number | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      saved_routes: {
        Row: {
          created_at: string | null
          departure: string
          destination: string
          id: string
          name: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          departure: string
          destination: string
          id?: string
          name?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          departure?: string
          destination?: string
          id?: string
          name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      travel_preferences: {
        Row: {
          baggage_profile: string | null
          catering_preference: string | null
          created_at: string | null
          default_passengers: number | null
          ground_transport_preference: string | null
          id: string
          medical_assistance: string | null
          pets: boolean | null
          preferred_aircraft_category: string | null
          preferred_aircraft_models: string[] | null
          preferred_departure_cities: string[] | null
          security_requirements: string | null
          smoking: boolean | null
          travel_pattern: string | null
          trip_type_preference: string | null
          typical_routes: string[] | null
          updated_at: string | null
          urgent_traveler: boolean | null
          user_id: string
          vip_terminal: boolean | null
          wifi_required: boolean | null
        }
        Insert: {
          baggage_profile?: string | null
          catering_preference?: string | null
          created_at?: string | null
          default_passengers?: number | null
          ground_transport_preference?: string | null
          id?: string
          medical_assistance?: string | null
          pets?: boolean | null
          preferred_aircraft_category?: string | null
          preferred_aircraft_models?: string[] | null
          preferred_departure_cities?: string[] | null
          security_requirements?: string | null
          smoking?: boolean | null
          travel_pattern?: string | null
          trip_type_preference?: string | null
          typical_routes?: string[] | null
          updated_at?: string | null
          urgent_traveler?: boolean | null
          user_id: string
          vip_terminal?: boolean | null
          wifi_required?: boolean | null
        }
        Update: {
          baggage_profile?: string | null
          catering_preference?: string | null
          created_at?: string | null
          default_passengers?: number | null
          ground_transport_preference?: string | null
          id?: string
          medical_assistance?: string | null
          pets?: boolean | null
          preferred_aircraft_category?: string | null
          preferred_aircraft_models?: string[] | null
          preferred_departure_cities?: string[] | null
          security_requirements?: string | null
          smoking?: boolean | null
          travel_pattern?: string | null
          trip_type_preference?: string | null
          typical_routes?: string[] | null
          updated_at?: string | null
          urgent_traveler?: boolean | null
          user_id?: string
          vip_terminal?: boolean | null
          wifi_required?: boolean | null
        }
        Relationships: []
      }
      trips: {
        Row: {
          aircraft: string | null
          client_id: string | null
          contract_id: string | null
          created_at: string
          date: string | null
          departure: string
          destination: string
          id: string
          status: Database["public"]["Enums"]["trip_status"]
        }
        Insert: {
          aircraft?: string | null
          client_id?: string | null
          contract_id?: string | null
          created_at?: string
          date?: string | null
          departure: string
          destination: string
          id?: string
          status?: Database["public"]["Enums"]["trip_status"]
        }
        Update: {
          aircraft?: string | null
          client_id?: string | null
          contract_id?: string | null
          created_at?: string
          date?: string | null
          departure?: string
          destination?: string
          id?: string
          status?: Database["public"]["Enums"]["trip_status"]
        }
        Relationships: [
          {
            foreignKeyName: "trips_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "sales"
        | "operations"
        | "finance"
        | "account_management"
        | "client"
        | "hr"
      contract_status: "draft" | "sent" | "signed" | "cancelled"
      invoice_status: "pending" | "paid"
      lead_status:
        | "new"
        | "contacted"
        | "quote_sent"
        | "negotiation"
        | "confirmed"
        | "lost"
      quote_status: "draft" | "sent" | "accepted" | "rejected" | "expired"
      request_status: "pending" | "quoted" | "confirmed" | "cancelled"
      trip_status: "scheduled" | "in_progress" | "completed" | "cancelled"
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
    Enums: {
      app_role: [
        "admin",
        "sales",
        "operations",
        "finance",
        "account_management",
        "client",
        "hr",
      ],
      contract_status: ["draft", "sent", "signed", "cancelled"],
      invoice_status: ["pending", "paid"],
      lead_status: [
        "new",
        "contacted",
        "quote_sent",
        "negotiation",
        "confirmed",
        "lost",
      ],
      quote_status: ["draft", "sent", "accepted", "rejected", "expired"],
      request_status: ["pending", "quoted", "confirmed", "cancelled"],
      trip_status: ["scheduled", "in_progress", "completed", "cancelled"],
    },
  },
} as const
