CREATE POLICY "Clients can log own preference changes"
  ON public.activity_log
  FOR INSERT
  TO authenticated
  WITH CHECK (
    action_by = auth.uid()
    AND entity_type = 'client'
    AND action = 'notification_preferences_updated'
    AND department = 'client'
  );