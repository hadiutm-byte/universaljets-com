-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own applications" ON public.membership_applications;
DROP POLICY IF EXISTS "Authenticated users can insert own membership applications" ON public.membership_applications;
DROP POLICY IF EXISTS "Staff can manage membership applications" ON public.membership_applications;

-- Recreate: users can only see their own (user_id must match, NULL excluded)
CREATE POLICY "Users can view own applications"
ON public.membership_applications
FOR SELECT TO authenticated
USING (user_id IS NOT NULL AND user_id = auth.uid());

-- Insert: must set user_id to own uid (non-null enforced by equality)
CREATE POLICY "Authenticated users can insert own membership applications"
ON public.membership_applications
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Staff: full access with WITH CHECK for writes
CREATE POLICY "Staff can manage membership applications"
ON public.membership_applications
FOR ALL TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'sales'::app_role)
  OR has_role(auth.uid(), 'account_management'::app_role)
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'sales'::app_role)
  OR has_role(auth.uid(), 'account_management'::app_role)
);