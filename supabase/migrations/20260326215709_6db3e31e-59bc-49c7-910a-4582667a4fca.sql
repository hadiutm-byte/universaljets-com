
-- Create operator request status enum
CREATE TYPE public.operator_request_status AS ENUM ('draft', 'requested', 'pending', 'accepted', 'rejected', 'expired');

-- Create operator_requests table
CREATE TABLE public.operator_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.flight_requests(id) ON DELETE SET NULL,
  quote_id UUID REFERENCES public.quotes(id) ON DELETE SET NULL,
  operator_name TEXT NOT NULL,
  aircraft_type TEXT,
  aircraft_identifier TEXT,
  status operator_request_status NOT NULL DEFAULT 'draft',
  requested_at TIMESTAMP WITH TIME ZONE,
  responded_at TIMESTAMP WITH TIME ZONE,
  response_expiry TIMESTAMP WITH TIME ZONE,
  offered_price NUMERIC,
  offered_currency TEXT DEFAULT 'USD',
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.operator_requests ENABLE ROW LEVEL SECURITY;

-- Only internal staff (admin, sales, operations) can manage operator requests
CREATE POLICY "Internal staff can manage operator requests"
  ON public.operator_requests FOR ALL
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'sales'::app_role) OR
    has_role(auth.uid(), 'operations'::app_role)
  )
  WITH CHECK (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'sales'::app_role) OR
    has_role(auth.uid(), 'operations'::app_role)
  );

-- Finance can view operator requests (for payable tracking)
CREATE POLICY "Finance can view operator requests"
  ON public.operator_requests FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'finance'::app_role));
