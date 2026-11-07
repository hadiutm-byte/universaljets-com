import { supabase } from "@/integrations/supabase/client";
import { getTurnstileToken } from "@/lib/turnstile";

/**
 * The only two places the browser posts public submissions to the
 * crm-capture and career-apply functions. Both attach a Turnstile token
 * (when a site key is configured) so the server can tell visitors from bots.
 */

export async function captureLead(body: Record<string, unknown>) {
  const turnstileToken = await getTurnstileToken();
  return supabase.functions.invoke("crm-capture", { body: { ...body, turnstileToken } });
}

export async function applyForJob(body: Record<string, unknown>) {
  const turnstileToken = await getTurnstileToken();
  return supabase.functions.invoke("career-apply", { body: { ...body, turnstileToken } });
}
