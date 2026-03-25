import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Plane, UserCheck, Tag, Sparkles, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const benefits = [
  { icon: Plane, text: "Priority aircraft access" },
  { icon: UserCheck, text: "Dedicated aviation advisor" },
  { icon: Tag, text: "Exclusive empty legs" },
  { icon: Sparkles, text: "Preferential pricing" },
];

const flightOptions = ["1–5", "6–15", "16–30", "30+"];

const MembershipEnrollment = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    flights: "",
  });
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState<{
    name: string;
    id: string;
    tier: string;
    validUntil: string;
  } | null>(null);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const getTier = (flights: string) => {
    if (flights === "30+") return "Platinum";
    if (flights === "16–30") return "Gold";
    if (flights === "6–15") return "Silver";
    return "Essentials";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setLoading(true);

    try {
      await supabase.functions.invoke("crm-capture", {
        body: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          departure: form.location || "N/A",
          destination: "Membership Application",
          source: "membership_enrollment",
        },
      });

      const memberId = `UJ-${Date.now().toString(36).toUpperCase().slice(-6)}`;
      const valid = new Date();
      valid.setFullYear(valid.getFullYear() + 1);

      setMember({
        name: form.name,
        id: memberId,
        tier: getTier(form.flights),
        validUntil: valid.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
      });
      toast.success("Welcome to the Universal Jets network.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <section id="membership" className="section-padding relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
        backgroundImage: "radial-gradient(ellipse 50% 35% at 50% 20%, hsla(38,52%,50%,0.3) 0%, transparent 70%)",
      }} />

      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">
              Digital Membership
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-5 leading-tight">
              Join the Universal Jets{" "}
              <span className="text-gradient-gold italic">Private Access Network</span>
            </h2>
            <p className="text-[13px] md:text-[14px] text-foreground/40 font-extralight leading-[2] max-w-xl mx-auto">
              Apply online and receive your digital membership card instantly.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!member ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="grid lg:grid-cols-5 gap-12"
              >
                {/* Benefits */}
                <div className="lg:col-span-2 flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                  >
                    <div className="w-12 h-12 rounded-full luxury-border flex items-center justify-center mb-8 glow-subtle">
                      <CreditCard className="w-5 h-5 text-primary/60" strokeWidth={1.2} />
                    </div>
                    <p className="text-[10px] tracking-[0.35em] uppercase text-primary/50 mb-6 font-light">
                      Member Benefits
                    </p>
                    <div className="space-y-5">
                      {benefits.map((b, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <b.icon className="w-4 h-4 text-primary/45 flex-shrink-0" strokeWidth={1.3} />
                          <span className="text-[12px] text-foreground/50 font-extralight leading-[1.8]">
                            {b.text}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 pt-8 border-t border-border/8">
                      <p className="text-[10px] text-foreground/25 font-extralight leading-[2]">
                        Membership is complimentary for qualified applicants. Acceptance is subject to review.
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Form */}
                <div className="lg:col-span-3">
                  <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, x: 15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="rounded-2xl border border-border/10 bg-card/20 backdrop-blur-md p-8 md:p-10 space-y-5"
                  >
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] tracking-[0.2em] uppercase text-foreground/30 mb-2.5 font-light">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => update("name", e.target.value)}
                          className="w-full bg-secondary/30 backdrop-blur-sm rounded-sm px-4 py-3 text-[12px] text-foreground placeholder:text-foreground/15 font-light focus:outline-none focus:ring-1 focus:ring-primary/25 border border-border/10"
                          placeholder="Alexander Hartwell"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-[0.2em] uppercase text-foreground/30 mb-2.5 font-light">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          className="w-full bg-secondary/30 backdrop-blur-sm rounded-sm px-4 py-3 text-[12px] text-foreground placeholder:text-foreground/15 font-light focus:outline-none focus:ring-1 focus:ring-primary/25 border border-border/10"
                          placeholder="alex@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] tracking-[0.2em] uppercase text-foreground/30 mb-2.5 font-light">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => update("phone", e.target.value)}
                          className="w-full bg-secondary/30 backdrop-blur-sm rounded-sm px-4 py-3 text-[12px] text-foreground placeholder:text-foreground/15 font-light focus:outline-none focus:ring-1 focus:ring-primary/25 border border-border/10"
                          placeholder="+971 50 000 0000"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] tracking-[0.2em] uppercase text-foreground/30 mb-2.5 font-light">
                          Location
                        </label>
                        <input
                          type="text"
                          value={form.location}
                          onChange={(e) => update("location", e.target.value)}
                          className="w-full bg-secondary/30 backdrop-blur-sm rounded-sm px-4 py-3 text-[12px] text-foreground placeholder:text-foreground/15 font-light focus:outline-none focus:ring-1 focus:ring-primary/25 border border-border/10"
                          placeholder="Dubai, UAE"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-foreground/30 mb-2.5 font-light">
                        Estimated Flights Per Year
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {flightOptions.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => update("flights", opt)}
                            className={`py-2.5 rounded-sm text-[11px] font-light border transition-all duration-300 ${
                              form.flights === opt
                                ? "border-primary/40 bg-primary/10 text-primary"
                                : "border-border/10 bg-secondary/20 text-foreground/30 hover:border-primary/20 hover:text-foreground/50"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-3 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm transition-all duration-500 hover:shadow-[0_0_40px_-10px_hsla(38,52%,50%,0.4)] hover:scale-[1.01] disabled:opacity-50"
                    >
                      {loading ? "Processing..." : "Apply for Membership"}
                    </button>

                    <p className="text-[9px] text-foreground/20 text-center font-extralight pt-1">
                      No commitment required. Your information is handled with absolute discretion.
                    </p>
                  </motion.form>
                </div>
              </motion.div>
            ) : (
              /* ── Digital Membership Card ── */
              <motion.div
                key="card"
                initial={{ opacity: 0, scale: 0.92, rotateX: 15 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-md mx-auto"
              >
                <p className="text-center text-[10px] tracking-[0.35em] uppercase text-primary/50 mb-8 font-light">
                  Welcome to Universal Jets
                </p>

                {/* Card */}
                <div className="relative rounded-2xl overflow-hidden aspect-[1.586/1]"
                  style={{
                    background: "linear-gradient(145deg, hsl(228 22% 8%) 0%, hsl(228 28% 4%) 50%, hsl(228 22% 6%) 100%)",
                  }}
                >
                  {/* Holographic shimmer */}
                  <div className="absolute inset-0 opacity-[0.06]" style={{
                    backgroundImage: "linear-gradient(135deg, transparent 20%, hsla(38,52%,50%,0.3) 40%, transparent 60%, hsla(38,52%,50%,0.15) 80%, transparent 100%)",
                  }} />

                  {/* Gold edge line */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                  <div className="relative z-10 p-7 h-full flex flex-col justify-between">
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[8px] tracking-[0.4em] uppercase text-primary/50 font-light">
                          Universal Jets
                        </p>
                        <p className="text-[7px] tracking-[0.3em] uppercase text-foreground/20 mt-1 font-extralight">
                          Private Access Network
                        </p>
                      </div>
                      <Shield className="w-5 h-5 text-primary/30" strokeWidth={1} />
                    </div>

                    {/* Chip */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-7 rounded-[3px] border border-primary/20" style={{
                        background: "linear-gradient(135deg, hsla(38,52%,50%,0.15), hsla(38,52%,50%,0.05))",
                      }} />
                      <p className="text-[10px] tracking-[0.15em] text-foreground/25 font-light">
                        {member.id}
                      </p>
                    </div>

                    {/* Bottom */}
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[14px] text-foreground/80 font-display font-medium tracking-wide">
                          {member.name}
                        </p>
                        <p className="text-[9px] text-foreground/25 font-extralight mt-1">
                          Valid through {member.validUntil}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] tracking-[0.35em] uppercase text-primary/60 font-light">
                          {member.tier}
                        </p>
                        <p className="text-[7px] text-foreground/15 font-extralight mt-0.5">
                          Member
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Below card */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center mt-10"
                >
                  <p className="text-[12px] text-foreground/40 font-extralight leading-[2]">
                    Your membership is now active. Our team will reach out within 24 hours.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default MembershipEnrollment;
