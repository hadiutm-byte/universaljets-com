-- Activity log table for full platform history
CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  action text NOT NULL,
  action_by uuid,
  department text,
  previous_value jsonb,
  new_value jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view activity logs" ON public.activity_log
  FOR SELECT TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'sales'::app_role) OR
    has_role(auth.uid(), 'operations'::app_role) OR
    has_role(auth.uid(), 'finance'::app_role) OR
    has_role(auth.uid(), 'account_management'::app_role) OR
    has_role(auth.uid(), 'hr'::app_role)
  );

CREATE POLICY "Staff can insert activity logs" ON public.activity_log
  FOR INSERT TO authenticated
  WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'sales'::app_role) OR
    has_role(auth.uid(), 'operations'::app_role) OR
    has_role(auth.uid(), 'finance'::app_role) OR
    has_role(auth.uid(), 'account_management'::app_role) OR
    has_role(auth.uid(), 'hr'::app_role)
  );

-- Referrals table with credit tracking
CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL,
  referred_name text NOT NULL,
  referred_email text NOT NULL,
  referred_phone text,
  referred_client_id uuid,
  status text NOT NULL DEFAULT 'invite_sent',
  qualification_date timestamptz,
  reward_amount numeric DEFAULT 0,
  credit_issued boolean DEFAULT false,
  credit_used boolean DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can manage referrals" ON public.referrals
  FOR ALL TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'sales'::app_role) OR
    has_role(auth.uid(), 'account_management'::app_role)
  );

CREATE POLICY "Clients can view own referrals" ON public.referrals
  FOR SELECT TO authenticated
  USING (
    referrer_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
  );

-- Enable realtime for activity_log
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log;

-- Indexes
CREATE INDEX idx_activity_log_entity ON public.activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_created ON public.activity_log(created_at DESC);
CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_email ON public.referrals(referred_email);