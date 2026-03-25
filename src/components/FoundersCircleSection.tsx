import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Plane, UserCheck, TrendingDown, Tag, Gift, Star, Check, CreditCard, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

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

const membershipTiers = [
  {
    name: "Access",
    tagline: "Pay As You Go",
    desc: "Instant access to the global private jet market with no commitment.",
    features: ["Market-rate pricing", "Airport search & comparison", "Concierge support", "Empty leg access"],
    accent: false,
  },
  {
    name: "Private Access",
    tagline: "Digital Membership",
    desc: "Priority access, preferential rates, and a dedicated aviation advisor.",
    features: ["Dedicated advisor", "Preferential pricing", "Priority booking", "Exclusive empty legs", "Member privileges"],
    accent: true,
  },
  {
    name: "Jet Card",
    tagline: "Fixed-Rate Program",
    desc: "Guaranteed availability and locked hourly rates for frequent flyers.",
    features: ["Fixed hourly rates", "Guaranteed availability", "Senior aviation manager", "Full concierge", "Route optimization"],
    accent: false,
  },
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
    <section className="py-28 md:py-36 relative overflow-hidden">
      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <p className="text-[11px] tracking-[0.4em] uppercase text-primary mb-5 font-medium">
              Membership
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-5 leading-tight">
              Choose Your <span className="text-gradient-gold italic">Access Level</span>
            </h2>
            <p className="text-base text-muted-foreground font-light leading-relaxed max-w-xl mx-auto">
              From single flights to fixed-rate programs — find the model that fits your travel.
            </p>
          </motion.div>

          {/* ── Membership Tier Cards — Light Luxury ── */}
          <div className="grid md:grid-cols-3 gap-6 mb-24">
            {membershipTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`relative rounded-2xl overflow-hidden transition-all duration-500 group ${
                  tier.accent
                    ? "shadow-[0_20px_60px_-15px_hsla(0,0%,0%,0.1)] scale-[1.02]"
                    : "hover:shadow-[0_16px_40px_-12px_hsla(0,0%,0%,0.08)]"
                }`}
              >
                {/* Top accent bar */}
                {tier.accent && (
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-gold z-10" />
                )}

                {/* Card header */}
                <div className={`px-8 pt-9 pb-6 ${
                  tier.accent
                    ? "bg-gradient-to-b from-charcoal to-charcoal-deep"
                    : "bg-muted"
                }`}>
                  {tier.accent && (
                    <span className="inline-block px-3 py-1 bg-primary/15 text-primary text-[8px] tracking-[0.25em] uppercase font-medium rounded-full mb-5">
                      Most Popular
                    </span>
                  )}
                  <p className={`text-[10px] tracking-[0.35em] uppercase font-medium mb-1.5 ${
                    tier.accent ? "text-primary/70" : "text-muted-foreground"
                  }`}>
                    {tier.tagline}
                  </p>
                  <h3 className={`font-display text-2xl font-semibold ${
                    tier.accent ? "text-white" : "text-foreground"
                  }`}>
                    {tier.name}
                  </h3>
                  <p className={`text-[13px] font-light leading-relaxed mt-3 ${
                    tier.accent ? "text-white/60" : "text-muted-foreground"
                  }`}>
                    {tier.desc}
                  </p>
                </div>

                {/* Features */}
                <div className="bg-card border border-t-0 border-border px-8 py-7 rounded-b-2xl">
                  <div className="space-y-3 mb-7">
                    {tier.features.map((f, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                        <span className="text-[13px] text-foreground/65 font-light leading-[1.7]">{f}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/contact"
                    className={`block text-center py-3.5 text-[10px] tracking-[0.2em] uppercase font-medium rounded-xl transition-all duration-500 ${
                      tier.accent
                        ? "bg-gradient-gold text-primary-foreground hover:shadow-[0_0_30px_-8px_hsla(45,79%,46%,0.4)]"
                        : "border border-border text-foreground/60 hover:border-primary/30 hover:text-primary"
                    }`}
                  >
                    {tier.accent ? "Apply Now" : "Learn More"}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Benefits row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20 max-w-4xl mx-auto"
          >
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 p-5 rounded-xl border border-border bg-card">
                <b.icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={1.3} />
                <span className="text-[12px] text-foreground/60 font-light leading-[1.8]">{b.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Referral */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl border border-border bg-muted p-10 md:p-12 mb-20 max-w-3xl mx-auto text-center"
          >
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-4 font-medium">Referral Program</p>
            <p className="text-[14px] text-muted-foreground font-light leading-relaxed mb-8 max-w-md mx-auto">
              Introduce 3 qualified members to the network and receive:
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {referralRewards.map((r, i) => (
                <div key={i} className="flex items-center gap-3">
                  <r.icon className="w-4 h-4 text-primary" strokeWidth={1.3} />
                  <span className="text-[13px] text-foreground/70 font-light">{r.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA form */}
          <motion.div
            id="membership-cta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-lg mx-auto"
          >
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8">
                <Crown className="w-8 h-8 text-primary mx-auto mb-4" strokeWidth={1.2} />
                <h3 className="font-display text-lg text-foreground mb-2">Invitation Requested</h3>
                <p className="text-[13px] text-muted-foreground font-light">Our membership team will be in touch shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  required
                  className="flex-1 bg-card rounded-xl px-5 py-3.5 text-[13px] text-foreground placeholder:text-muted-foreground/50 font-light focus:outline-none focus:ring-1 focus:ring-primary/30 border border-border"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 bg-card rounded-xl px-5 py-3.5 text-[13px] text-foreground placeholder:text-muted-foreground/50 font-light focus:outline-none focus:ring-1 focus:ring-primary/30 border border-border"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.2em] uppercase font-medium rounded-xl transition-all duration-500 hover:shadow-[0_0_30px_-8px_hsla(45,79%,46%,0.4)] disabled:opacity-50 whitespace-nowrap"
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
