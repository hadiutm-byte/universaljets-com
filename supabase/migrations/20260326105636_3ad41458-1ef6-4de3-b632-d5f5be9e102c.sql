
-- 1) Fix: HR role can insert candidates but cannot read or manage them
DROP POLICY IF EXISTS "Internal staff can manage candidates" ON public.candidates;
CREATE POLICY "Internal staff can manage candidates"
  ON public.candidates
  FOR ALL
  TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role)
    OR has_role(auth.uid(), 'sales'::app_role)
    OR has_role(auth.uid(), 'hr'::app_role)
  );

-- 2) Fix: Add client INSERT policy for flight_requests with ownership check
CREATE POLICY "Clients can insert own flight requests"
  ON public.flight_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    client_id IN (
      SELECT id FROM public.clients WHERE user_id = auth.uid()
    )
  );
