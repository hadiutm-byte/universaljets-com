-- Remove Sales from trips management — only Operations and Admin
DROP POLICY IF EXISTS "Internal staff can manage trips" ON public.trips;
CREATE POLICY "Operations and Admin can manage trips" ON public.trips
  FOR ALL TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'operations'::app_role)
  );

-- Allow Finance to view trips (for billing reconciliation)
CREATE POLICY "Finance can view trips" ON public.trips
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'finance'::app_role));

-- Remove Sales from contracts management — only Operations and Admin
DROP POLICY IF EXISTS "Internal staff can manage contracts" ON public.contracts;
CREATE POLICY "Operations and Admin can manage contracts" ON public.contracts
  FOR ALL TO authenticated
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'operations'::app_role)
  );

-- Allow Finance to view contracts (for payment/billing records)
CREATE POLICY "Finance can view contracts" ON public.contracts
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'finance'::app_role));

-- Allow Sales to view contracts in read-only mode (limited summary)
CREATE POLICY "Sales can view contracts" ON public.contracts
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'sales'::app_role));