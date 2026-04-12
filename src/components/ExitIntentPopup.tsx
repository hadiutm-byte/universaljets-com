import { useState, useEffect, useCallback } from "react";
import { X, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const STORAGE_KEY = "uj_exit_popup_dismissed";

const ExitIntentPopup = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const dismiss = useCallback(() => {
    setShow(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const handler = (e: MouseEvent) => {
      if (e.clientY < 5) {
        setShow(true);
        document.removeEventListener("mouseout", handler);
      }
    };

    // Delay attaching to avoid triggering on page load
    const timer = setTimeout(() => {
      document.addEventListener("mouseout", handler);
    }, 15000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseout", handler);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await supabase.functions.invoke("crm-capture", {
        body: {
          type: "newsletter",
          email: email.trim(),
          source: "exit_intent_popup",
          notes: "Signed up for empty leg alerts via exit-intent popup",
        },
      });
      toast.success("You're in! We'll send you the best empty leg deals.");
      dismiss();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-card border border-primary/20 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
          <Plane className="w-7 h-7 text-primary" />
        </div>

        <h3 className="font-display text-xl font-bold mb-2">
          Don't Miss Our Best Deals
        </h3>
        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
          Get exclusive empty leg alerts — save up to <span className="text-primary font-semibold">75% off</span> standard charter rates. Delivered to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={loading} size="sm">
            {loading ? "…" : "Subscribe"}
          </Button>
        </form>

        <p className="text-muted-foreground text-[10px] mt-4">
          No spam. Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
