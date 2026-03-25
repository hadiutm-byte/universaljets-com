
-- Extend profiles with member fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS nationality text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS company text,
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS whatsapp text,
  ADD COLUMN IF NOT EXISTS membership_tier text DEFAULT 'founder_circle',
  ADD COLUMN IF NOT EXISTS member_id text,
  ADD COLUMN IF NOT EXISTS available_credit numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS billing_address text,
  ADD COLUMN IF NOT EXISTS payment_preference text,
  ADD COLUMN IF NOT EXISTS referrals_sent integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS invitation_status text DEFAULT 'active';

-- Travel preferences
CREATE TABLE IF NOT EXISTS public.travel_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  typical_routes text[] DEFAULT '{}',
  preferred_departure_cities text[] DEFAULT '{}',
  default_passengers integer DEFAULT 1,
  preferred_aircraft_category text,
  smoking boolean DEFAULT false,
  pets boolean DEFAULT false,
  wifi_required boolean DEFAULT true,
  catering_preference text,
  vip_terminal boolean DEFAULT false,
  ground_transport_preference text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.travel_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own travel prefs" ON public.travel_preferences
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can view all travel prefs" ON public.travel_preferences
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Concierge preferences
CREATE TABLE IF NOT EXISTS public.concierge_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  hotel_preferences text,
  chauffeur boolean DEFAULT false,
  security_escort boolean DEFAULT false,
  special_assistance text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.concierge_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own concierge prefs" ON public.concierge_preferences
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can view all concierge prefs" ON public.concierge_preferences
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Saved routes
CREATE TABLE IF NOT EXISTS public.saved_routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text,
  departure text NOT NULL,
  destination text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.saved_routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own saved routes" ON public.saved_routes
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Member documents
CREATE TABLE IF NOT EXISTS public.member_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  file_url text NOT NULL,
  doc_type text DEFAULT 'other',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.member_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own documents" ON public.member_documents
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can view all documents" ON public.member_documents
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('member-documents', 'member-documents', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own docs" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'member-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view own docs" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'member-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete own docs" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'member-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Admin can view all member docs" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'member-documents' AND public.has_role(auth.uid(), 'admin'));
