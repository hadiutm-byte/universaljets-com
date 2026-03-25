
-- ═══════════════════════════════════════════════════════════
-- 1. EXPAND CLIENTS TABLE — Full CRM profile fields
-- ═══════════════════════════════════════════════════════════
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS whatsapp text,
  ADD COLUMN IF NOT EXISTS nationality text,
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS industry text,
  ADD COLUMN IF NOT EXISTS office_location text,
  ADD COLUMN IF NOT EXISTS company_billing_name text,
  ADD COLUMN IF NOT EXISTS company_vat text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS billing_address text,
  ADD COLUMN IF NOT EXISTS passport_country text,
  ADD COLUMN IF NOT EXISTS client_type text DEFAULT 'lead',
  ADD COLUMN IF NOT EXISTS preferred_contact_method text DEFAULT 'email',
  ADD COLUMN IF NOT EXISTS preferred_contact_time text,
  ADD COLUMN IF NOT EXISTS email_allowed boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS whatsapp_allowed boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS phone_allowed boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS marketing_optin boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS member_status text,
  ADD COLUMN IF NOT EXISTS membership_tier text,
  ADD COLUMN IF NOT EXISTS invitation_status text,
  ADD COLUMN IF NOT EXISTS referral_status text,
  ADD COLUMN IF NOT EXISTS credit_balance numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'unverified',
  ADD COLUMN IF NOT EXISTS lead_source text,
  ADD COLUMN IF NOT EXISTS assigned_to uuid,
  ADD COLUMN IF NOT EXISTS profile_completeness integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- ═══════════════════════════════════════════════════════════
-- 2. EXPAND FLIGHT_REQUESTS — Full request intake fields
-- ═══════════════════════════════════════════════════════════
ALTER TABLE public.flight_requests
  ADD COLUMN IF NOT EXISTS trip_type text DEFAULT 'one_way',
  ADD COLUMN IF NOT EXISTS return_date timestamptz,
  ADD COLUMN IF NOT EXISTS preferred_time text,
  ADD COLUMN IF NOT EXISTS return_time text,
  ADD COLUMN IF NOT EXISTS preferred_aircraft_category text,
  ADD COLUMN IF NOT EXISTS specific_aircraft text,
  ADD COLUMN IF NOT EXISTS helicopter_transfer boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS concierge_needed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS vip_terminal boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS ground_transport boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS pets boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS smoking boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS catering_request text,
  ADD COLUMN IF NOT EXISTS baggage_notes text,
  ADD COLUMN IF NOT EXISTS special_assistance text,
  ADD COLUMN IF NOT EXISTS special_requests text,
  ADD COLUMN IF NOT EXISTS contact_name text,
  ADD COLUMN IF NOT EXISTS contact_email text,
  ADD COLUMN IF NOT EXISTS contact_phone text,
  ADD COLUMN IF NOT EXISTS company_name text,
  ADD COLUMN IF NOT EXISTS budget_range text,
  ADD COLUMN IF NOT EXISTS is_urgent boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS preferred_contact_method text DEFAULT 'email',
  ADD COLUMN IF NOT EXISTS source text,
  ADD COLUMN IF NOT EXISTS campaign text,
  ADD COLUMN IF NOT EXISTS assigned_to uuid,
  ADD COLUMN IF NOT EXISTS priority text DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- ═══════════════════════════════════════════════════════════
-- 3. EXPAND TRAVEL_PREFERENCES — Missing aviation fields
-- ═══════════════════════════════════════════════════════════
ALTER TABLE public.travel_preferences
  ADD COLUMN IF NOT EXISTS preferred_aircraft_models text[],
  ADD COLUMN IF NOT EXISTS trip_type_preference text,
  ADD COLUMN IF NOT EXISTS urgent_traveler boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS travel_pattern text,
  ADD COLUMN IF NOT EXISTS baggage_profile text,
  ADD COLUMN IF NOT EXISTS security_requirements text,
  ADD COLUMN IF NOT EXISTS medical_assistance text;

-- ═══════════════════════════════════════════════════════════
-- 4. CREATE MEMBERSHIP_APPLICATIONS TABLE
-- ═══════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.membership_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  user_id uuid,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  whatsapp text,
  city text,
  country text,
  nationality text,
  company text,
  title text,
  travel_frequency text,
  typical_routes text[],
  passenger_count text,
  aircraft_category_preference text,
  reason text,
  invitation_code text,
  referral_source text,
  preferred_tier text,
  billing_details text,
  terms_accepted boolean DEFAULT false,
  status text NOT NULL DEFAULT 'applied',
  invitation_status text DEFAULT 'pending',
  verification_status text DEFAULT 'unverified',
  referral_linkage uuid,
  source text DEFAULT 'membership_page',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage membership applications"
  ON public.membership_applications FOR ALL TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'account_management'::app_role)
    OR has_role(auth.uid(), 'sales'::app_role)
  );

CREATE POLICY "Anon can insert membership applications"
  ON public.membership_applications FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view own applications"
  ON public.membership_applications FOR SELECT TO authenticated
  USING (user_id = auth.uid());
