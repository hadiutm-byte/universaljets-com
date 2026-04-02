
-- 1. CRITICAL: Harden membership_applications INSERT policy to reject null user_id
DROP POLICY IF EXISTS "Authenticated users can insert own membership applications" ON public.membership_applications;
CREATE POLICY "Authenticated users can insert own membership applications"
  ON public.membership_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 2. Add finance SELECT policy on flight_requests for invoice reconciliation
CREATE POLICY "Finance can view flight requests"
  ON public.flight_requests
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'finance'::app_role));

-- 3. Add admin SELECT policy on suppressed_emails for staff visibility
CREATE POLICY "Admin can view suppressed emails"
  ON public.suppressed_emails
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
