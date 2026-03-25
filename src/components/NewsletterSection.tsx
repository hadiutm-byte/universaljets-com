import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const insights = [
  "Private aviation insights",
  "Pricing strategies",
  "Exclusive empty legs",
];

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.functions.invoke("crm-capture", {
      body: { email, name: "", departure: "Newsletter", destination: "Jet Charter Secrets", source: "newsletter" },
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
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4%)] to-transparent pointer-events-none" />

      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-2xl border border-border/8 bg-card/10 backdrop-blur-md p-8 md:p-12"
          >
            {/* Top row */}
            <div className="flex items-start gap-5 mb-8">
              <div className="w-11 h-11 rounded-full border border-border/12 bg-card/20 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4.5 h-4.5 text-primary/50" strokeWidth={1.2} />
              </div>
              <div>
                <p className="text-[9px] tracking-[0.4em] uppercase text-primary/50 mb-3 font-light">
                  Newsletter
                </p>
                <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground leading-tight">
                  Jet Charter{" "}
                  <span className="text-gradient-gold italic">Secrets</span>
                </h2>
              </div>
            </div>

            <p className="text-[12px] md:text-[13px] text-foreground/40 font-extralight leading-[2] mb-8">
              Stay ahead of the market.
            </p>

            <div className="w-full h-[1px] bg-border/8 mb-8" />

            {/* Insights list */}
            <div className="space-y-4 mb-10">
              {insights.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-1 h-1 rounded-full bg-primary/35 flex-shrink-0" />
                  <span className="text-[12px] text-foreground/50 font-extralight">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Form / Success */}
            {submitted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 py-3"
              >
                <Check className="w-4 h-4 text-primary/60" strokeWidth={1.5} />
                <span className="text-[12px] text-foreground/50 font-light">
                  You're in. Watch your inbox.
                </span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 bg-secondary/30 backdrop-blur-sm rounded-sm px-5 py-3.5 text-[12px] text-foreground placeholder:text-foreground/15 font-light focus:outline-none focus:ring-1 focus:ring-primary/25 border border-border/10"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-sm transition-all duration-500 hover:shadow-[0_0_30px_-8px_hsla(45,79%,46%,0.4)] hover:scale-[1.01] disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? "..." : "Get Insider Access"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
