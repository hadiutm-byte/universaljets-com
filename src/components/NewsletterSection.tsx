import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.functions.invoke("crm-capture", {
      body: { email, name: "", source: "newsletter" },
    });
    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      setSubmitted(true);
      toast.success("Welcome to Jet Charter Secrets.");
    }
    setLoading(false);
  };

  return (
    <section className="section-padding relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4%)] to-transparent pointer-events-none" />

      <div className="container mx-auto px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-lg mx-auto text-center"
        >
          <Mail className="w-5 h-5 text-primary/40 mx-auto mb-6" strokeWidth={1.2} />
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Newsletter</p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-foreground mb-4">
            Jet Charter <span className="text-gradient-gold italic">Secrets</span>
          </h2>
          <p className="text-[12px] text-foreground/35 font-extralight leading-[2] mb-10">
            Insider insights on pricing, empty legs, and private aviation opportunities — delivered to your inbox.
          </p>

          {submitted ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-3">
              <Check className="w-4 h-4 text-primary/60" strokeWidth={1.5} />
              <span className="text-[12px] text-foreground/50 font-light">You're in. Watch your inbox.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 bg-secondary/30 backdrop-blur-sm rounded-sm px-5 py-3.5 text-[12px] text-foreground placeholder:text-foreground/20 font-light focus:outline-none focus:ring-1 focus:ring-primary/25 border border-border/10"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-sm transition-all duration-500 hover:shadow-[0_0_30px_-8px_hsla(38,52%,50%,0.4)] disabled:opacity-50"
              >
                {loading ? "..." : "Subscribe"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
