
CREATE TABLE public.candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  interview_answers jsonb DEFAULT '[]'::jsonb,
  ai_score numeric,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'passed', 'failed', 'scheduled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internal staff can manage candidates"
ON public.candidates FOR ALL TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'sales'::app_role)
);

CREATE POLICY "Anon can insert candidates"
ON public.candidates FOR INSERT TO anon
WITH CHECK (true);
