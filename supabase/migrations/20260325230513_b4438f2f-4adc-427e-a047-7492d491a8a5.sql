-- Payments table: tracks all incoming and outgoing payments
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_type text NOT NULL DEFAULT 'incoming', -- incoming, outgoing
  related_entity_type text, -- invoice, contract, trip, referral, membership
  related_entity_id uuid,
  client_id uuid,
  supplier_name text, -- for outgoing: operator/supplier/partner name
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  payment_method text, -- bank_transfer, card, cash, credit_note
  payment_date timestamptz,
  reference text, -- bank reference / transaction ID
  status text NOT NULL DEFAULT 'pending', -- pending, completed, failed, reversed
  notes text,
  reconciled boolean DEFAULT false,
  reconciled_at timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Finance and Admin can manage payments" ON public.payments
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'finance'::app_role));

-- Credit notes / debit notes / adjustments
CREATE TABLE public.credit_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_type text NOT NULL DEFAULT 'credit', -- credit, debit, refund, adjustment
  client_id uuid,
  supplier_name text,
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  reason text,
  related_invoice_id uuid,
  related_payment_id uuid,
  status text NOT NULL DEFAULT 'draft', -- draft, issued, applied, void
  issued_date timestamptz DEFAULT now(),
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.credit_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Finance and Admin can manage credit notes" ON public.credit_notes
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'finance'::app_role));

-- Bank transactions for reconciliation
CREATE TABLE public.bank_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_account text NOT NULL DEFAULT 'primary',
  transaction_type text NOT NULL DEFAULT 'credit', -- credit, debit
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  description text,
  reference text,
  transaction_date timestamptz NOT NULL DEFAULT now(),
  matched_payment_id uuid,
  reconciled boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bank_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Finance and Admin can manage bank transactions" ON public.bank_transactions
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'finance'::app_role));

-- Indexes
CREATE INDEX idx_payments_type ON public.payments(payment_type);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_client ON public.payments(client_id);
CREATE INDEX idx_payments_date ON public.payments(payment_date DESC);
CREATE INDEX idx_credit_notes_client ON public.credit_notes(client_id);
CREATE INDEX idx_credit_notes_status ON public.credit_notes(status);
CREATE INDEX idx_bank_tx_date ON public.bank_transactions(transaction_date DESC);
CREATE INDEX idx_bank_tx_reconciled ON public.bank_transactions(reconciled);