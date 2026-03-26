
-- Fix: Tighten client flight request INSERT to also enforce lead_id is null for clients
DROP POLICY IF EXISTS "Clients can insert own flight requests" ON public.flight_requests;
CREATE POLICY "Clients can insert own flight requests"
  ON public.flight_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- client_id must belong to the authenticated user
    client_id IN (
      SELECT id FROM public.clients WHERE user_id = auth.uid()
    )
    -- clients cannot set lead_id (staff-only field)
    AND lead_id IS NULL
    -- clients cannot set assigned_to (staff-only field)
    AND assigned_to IS NULL
  );
