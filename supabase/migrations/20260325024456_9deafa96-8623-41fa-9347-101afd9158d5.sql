-- Lead status enum
CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'quote_sent', 'negotiation', 'confirmed', 'lost');

-- Flight request status enum
CREATE TYPE public.request_status AS ENUM ('pending', 'quoted', 'confirmed', 'cancelled');

-- Quote status enum
CREATE TYPE public.quote_status AS ENUM ('draft', 'sent', 'accepted', 'rejected', 'expired');

-- Contract status enum
CREATE TYPE public.contract_status AS ENUM ('draft', 'sent', 'signed', 'cancelled');

-- Invoice status enum
CREATE TYPE public.invoice_status AS ENUM ('pending', 'paid');

-- Trip status enum
CREATE TYPE public.trip_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');

-- 1. Clients
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- 2. Leads
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  status lead_status NOT NULL DEFAULT 'new',
  source TEXT,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 3. Flight Requests
CREATE TABLE public.flight_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  departure TEXT NOT NULL,
  destination TEXT NOT NULL,
  date TIMESTAMPTZ,
  passengers INT DEFAULT 1,
  notes TEXT,
  status request_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.flight_requests ENABLE ROW LEVEL SECURITY;

-- 4. Quotes
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.flight_requests(id) ON DELETE CASCADE,
  aircraft TEXT,
  operator TEXT,
  price NUMERIC(12,2),
  valid_until TIMESTAMPTZ,
  status quote_status NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- 5. Contracts
CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES public.quotes(id) ON DELETE CASCADE,
  file_url TEXT,
  status contract_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- 6. Invoices
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID REFERENCES public.contracts(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  status invoice_status NOT NULL DEFAULT 'pending',
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- 7. Trips
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL,
  aircraft TEXT,
  departure TEXT NOT NULL,
  destination TEXT NOT NULL,
  date TIMESTAMPTZ,
  status trip_status NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- ========== RLS POLICIES ==========

-- Internal roles can access all CRM data
-- Clients can only see their own records

-- Clients table
CREATE POLICY "Internal staff can manage clients" ON public.clients FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'sales') OR public.has_role(auth.uid(), 'operations') OR public.has_role(auth.uid(), 'account_management'));

CREATE POLICY "Clients can view own record" ON public.clients FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Leads table
CREATE POLICY "Internal staff can manage leads" ON public.leads FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'sales'));

CREATE POLICY "Ops can view leads" ON public.leads FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'operations'));

-- Flight Requests
CREATE POLICY "Internal staff can manage flight requests" ON public.flight_requests FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'sales') OR public.has_role(auth.uid(), 'operations'));

CREATE POLICY "Clients can view own flight requests" ON public.flight_requests FOR SELECT TO authenticated
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));

-- Quotes
CREATE POLICY "Internal staff can manage quotes" ON public.quotes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'sales') OR public.has_role(auth.uid(), 'finance'));

CREATE POLICY "Clients can view own quotes" ON public.quotes FOR SELECT TO authenticated
  USING (request_id IN (SELECT fr.id FROM public.flight_requests fr JOIN public.clients c ON fr.client_id = c.id WHERE c.user_id = auth.uid()));

-- Contracts
CREATE POLICY "Internal staff can manage contracts" ON public.contracts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'sales') OR public.has_role(auth.uid(), 'operations'));

CREATE POLICY "Clients can view own contracts" ON public.contracts FOR SELECT TO authenticated
  USING (quote_id IN (SELECT q.id FROM public.quotes q JOIN public.flight_requests fr ON q.request_id = fr.id JOIN public.clients c ON fr.client_id = c.id WHERE c.user_id = auth.uid()));

-- Invoices
CREATE POLICY "Internal staff can manage invoices" ON public.invoices FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'finance'));

CREATE POLICY "Clients can view own invoices" ON public.invoices FOR SELECT TO authenticated
  USING (contract_id IN (SELECT co.id FROM public.contracts co JOIN public.quotes q ON co.quote_id = q.id JOIN public.flight_requests fr ON q.request_id = fr.id JOIN public.clients c ON fr.client_id = c.id WHERE c.user_id = auth.uid()));

-- Trips
CREATE POLICY "Internal staff can manage trips" ON public.trips FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'operations') OR public.has_role(auth.uid(), 'sales'));

CREATE POLICY "Clients can view own trips" ON public.trips FOR SELECT TO authenticated
  USING (client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()));
