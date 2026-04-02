-- Fix: Restrict client activity log entity_id to the user's own client record
DROP POLICY IF EXISTS "Clients can log own preference changes" ON public.activity_log;

CREATE POLICY "Clients can log own preference changes"
ON public.activity_log
FOR INSERT
TO authenticated
WITH CHECK (
  (action_by = auth.uid())
  AND (entity_type = 'client')
  AND (action = 'notification_preferences_updated')
  AND (department = 'client')
  AND (entity_id IN (
    SELECT id FROM public.clients WHERE user_id = auth.uid()
  ))
);