CREATE TABLE public.outreach_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  channel text NOT NULL DEFAULT 'linkedin',
  subject text,
  body text NOT NULL,
  placeholders text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.outreach_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internal staff can manage outreach templates"
ON public.outreach_templates
FOR ALL
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  OR has_role(auth.uid(), 'sales'::app_role)
);

INSERT INTO public.outreach_templates (name, channel, subject, body, placeholders)
VALUES (
  'LinkedIn - Initial Outreach',
  'linkedin',
  NULL,
  E'Hi [Name],\n\nCame across your profile — impressive background.\n\nOut of curiosity, do you ever handle private travel internally or through external partners?\n\nI run Universal Jets — we specialize in sourcing aircraft globally (not tied to one fleet), which allows us to optimize both availability and pricing depending on the mission.\n\nHappy to connect either way.\n\nBest,\nHadi',
  ARRAY['[Name]']
);