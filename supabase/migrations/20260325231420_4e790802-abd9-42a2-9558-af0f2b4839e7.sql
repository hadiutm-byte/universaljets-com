CREATE TABLE public.bd_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company_name text,
  contact_name text,
  contact_email text,
  contact_phone text,
  opportunity_type text NOT NULL DEFAULT 'partnership',
  status text NOT NULL DEFAULT 'prospecting',
  market text,
  sector text,
  estimated_value numeric DEFAULT 0,
  source text,
  notes text,
  meeting_notes text,
  last_contact_date timestamptz,
  next_follow_up timestamptz,
  handed_to_sales_at timestamptz,
  handed_to_client_id uuid,
  assigned_to uuid,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.bd_opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "BD and Admin can manage opportunities" ON public.bd_opportunities
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'business_development'::app_role));

CREATE POLICY "Sales can view qualified opportunities" ON public.bd_opportunities
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'sales'::app_role) AND status IN ('qualified', 'handed_to_sales', 'won'));

CREATE INDEX idx_bd_opp_status ON public.bd_opportunities(status);
CREATE INDEX idx_bd_opp_type ON public.bd_opportunities(opportunity_type);
CREATE INDEX idx_bd_opp_market ON public.bd_opportunities(market);
CREATE INDEX idx_bd_opp_follow_up ON public.bd_opportunities(next_follow_up);