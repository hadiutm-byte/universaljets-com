-- Fix membership_applications: remove user_id IS NULL allowance
DROP POLICY IF EXISTS "Authenticated users can insert membership applications" ON public.membership_applications;
CREATE POLICY "Authenticated users can insert own membership applications"
ON public.membership_applications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);