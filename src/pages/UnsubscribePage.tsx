import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export default function UnsubscribePage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<"loading" | "valid" | "already" | "invalid" | "success" | "error">("loading");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!token) { setState("invalid"); return; }
    fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${token}`, {
      headers: { apikey: SUPABASE_KEY },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.valid === false && d.reason === "already_unsubscribed") setState("already");
        else if (d.valid) setState("valid");
        else setState("invalid");
      })
      .catch(() => setState("invalid"));
  }, [token]);

  const handleUnsubscribe = async () => {
    setProcessing(true);
    try {
      const { data } = await supabase.functions.invoke("handle-email-unsubscribe", { body: { token } });
      if (data?.success) setState("success");
      else if (data?.reason === "already_unsubscribed") setState("already");
      else setState("error");
    } catch { setState("error"); }
    setProcessing(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <p className="text-[10px] tracking-[0.35em] uppercase text-primary/60 font-medium">Universal Jets</p>
        <h1 className="font-display text-2xl font-semibold text-foreground">Email Preferences</h1>

        {state === "loading" && <p className="text-muted-foreground text-sm">Verifying…</p>}

        {state === "valid" && (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">Click below to unsubscribe from future emails.</p>
            <button
              onClick={handleUnsubscribe}
              disabled={processing}
              className="w-full py-3 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {processing ? "Processing…" : "Confirm Unsubscribe"}
            </button>
          </div>
        )}

        {state === "success" && (
          <p className="text-muted-foreground text-sm">You have been successfully unsubscribed. You will no longer receive emails from us.</p>
        )}

        {state === "already" && (
          <p className="text-muted-foreground text-sm">You are already unsubscribed from our emails.</p>
        )}

        {state === "invalid" && (
          <p className="text-muted-foreground text-sm">This unsubscribe link is invalid or has expired.</p>
        )}

        {state === "error" && (
          <p className="text-destructive text-sm">Something went wrong. Please try again or contact our team.</p>
        )}
      </div>
    </div>
  );
}
