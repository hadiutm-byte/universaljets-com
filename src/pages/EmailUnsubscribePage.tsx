import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

type Status = "loading" | "valid" | "already" | "invalid" | "success" | "error";

const EmailUnsubscribePage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    const validate = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${token}`,
          { headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY } }
        );
        const data = await res.json();
        if (!res.ok) {
          setStatus("invalid");
        } else if (data.valid === false && data.reason === "already_unsubscribed") {
          setStatus("already");
        } else if (data.valid) {
          setStatus("valid");
        } else {
          setStatus("invalid");
        }
      } catch {
        setStatus("invalid");
      }
    };
    validate();
  }, [token]);

  const handleUnsubscribe = async () => {
    try {
      const { error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      setStatus(error ? "error" : "success");
    } catch {
      setStatus("error");
    }
  };

  const content: Record<Status, { title: string; desc: string; action?: boolean }> = {
    loading: { title: "Processing…", desc: "Verifying your request." },
    valid: { title: "Unsubscribe", desc: "Click below to unsubscribe from future emails.", action: true },
    already: { title: "Already Unsubscribed", desc: "This email address has already been unsubscribed." },
    invalid: { title: "Invalid Link", desc: "This unsubscribe link is invalid or has expired." },
    success: { title: "Unsubscribed", desc: "You have been successfully unsubscribed. You will no longer receive these emails." },
    error: { title: "Something Went Wrong", desc: "Please try again later or contact us directly." },
  };

  const { title, desc, action } = content[status];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Unsubscribe" description="Manage your email preferences." path="/email-unsubscribe" noindex />
      <Navbar />
      <section className="pt-40 pb-20 md:pt-48 md:pb-28">
        <div className="container mx-auto px-8 max-w-sm text-center">
          <p className="text-[9px] tracking-[0.5em] uppercase text-gold/70 mb-6 font-light">
            Email Preferences
          </p>
          <h1 className="text-2xl md:text-3xl font-display font-semibold mb-4">{title}</h1>
          <p className="text-[13px] text-foreground/40 font-light mb-8 leading-relaxed">{desc}</p>
          {action && (
            <button
              onClick={handleUnsubscribe}
              className="px-8 py-3.5 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,85%,58%,0.45)] transition-all duration-500"
            >
              Confirm Unsubscribe
            </button>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default EmailUnsubscribePage;
