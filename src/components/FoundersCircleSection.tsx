import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Plane, UserCheck, TrendingDown, Tag, Gift, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const benefits = [
  { icon: Plane, text: "Priority aircraft access worldwide" },
  { icon: UserCheck, text: "Dedicated aviation advisor" },
  { icon: TrendingDown, text: "Preferential pricing across global operators" },
  { icon: Tag, text: "Access to exclusive empty legs and off-market flights" },
];

const referralRewards = [
  { icon: Gift, text: "$1,000 flight credit" },
  { icon: Star, text: "Priority booking status upgrade" },
];

const FoundersCircleSection = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    setLoading(true);
    const { error } = await supabase.functions.invoke("crm-capture", {
      body: { email, name, source: "founders_circle" },
    });
    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      setSubmitted(true);
      toast.success("Your invitation request has been received.");
    }
    setLoading(false);
  };

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4%)] to-transparent pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 50% 30%, hsla(38,52%,50%,0.25) 0%, transparent 70%)",
        }}
      />

      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Crown badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center mb-10"
          >
            <div className="w-16 h-16 rounded-full luxury-border flex items-center justify-center glow-subtle">
              <Crown className="w-6 h-6 text-primary/70" strokeWidth={1.2} />
            </div>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-center mb-14"
          >
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">
              Exclusive Membership
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-5 leading-tight">
              Priority Access{" "}
              <span className="text-gradient-gold italic">Membership</span>
            </h2>
            <p className="text-[13px] md:text-[14px] text-foreground/40 font-extralight leading-[2] max-w-xl mx-auto mb-6">
              Designed for frequent private flyers who require speed, consistency, and priority access.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <p className="text-[11px] text-foreground/45 font-light">Lock in preferential rates.</p>
              <p className="text-[11px] text-foreground/45 font-light">Access guaranteed availability.</p>
              <p className="text-[11px] text-foreground/45 font-light">Fly with flexibility across global fleets.</p>
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid sm:grid-cols-2 gap-5 mb-16"
          >
            {benefits.map((b, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-5 rounded-xl border border-border/8 bg-card/10"
              >
                <b.icon
                  className="w-4 h-4 text-primary/50 flex-shrink-0 mt-0.5"
                  strokeWidth={1.3}
                />
                <span className="text-[12px] text-foreground/50 font-extralight leading-[1.8]">
                  {b.text}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Referral program */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="rounded-2xl border border-primary/10 bg-gradient-to-br from-card/20 to-card/5 backdrop-blur-md p-8 md:p-10 mb-16"
          >
            <p className="text-[9px] tracking-[0.4em] uppercase text-primary/50 mb-4 font-light text-center">
              Referral Program
            </p>
            <p className="text-[13px] text-foreground/45 font-extralight text-center leading-[2] mb-8 max-w-md mx-auto">
              Introduce 3 qualified members to the network and receive:
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {referralRewards.map((r, i) => (
                <div key={i} className="flex items-center gap-3">
                  <r.icon className="w-4 h-4 text-primary/50" strokeWidth={1.3} />
                  <span className="text-[12px] text-foreground/60 font-light">
                    {r.text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-center"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8"
              >
                <Crown className="w-8 h-8 text-primary/50 mx-auto mb-4" strokeWidth={1.2} />
                <h3 className="font-display text-lg text-foreground mb-2">
                  Invitation Requested
                </h3>
                <p className="text-[12px] text-foreground/35 font-extralight">
                  Our membership team will be in touch shortly.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  required
                  className="flex-1 bg-secondary/30 backdrop-blur-sm rounded-sm px-5 py-3.5 text-[12px] text-foreground placeholder:text-foreground/20 font-light focus:outline-none focus:ring-1 focus:ring-primary/25 border border-border/10"
                />
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
                  className="px-8 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-sm transition-all duration-500 hover:shadow-[0_0_30px_-8px_hsla(38,52%,50%,0.4)] hover:scale-[1.02] disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? "Submitting..." : "Request Invitation"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FoundersCircleSection;
