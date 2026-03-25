import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, UserCheck, Tag, Sparkles, CreditCard, Download, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const benefits = [
  { icon: Plane, text: "Priority aircraft access worldwide" },
  { icon: UserCheck, text: "Dedicated aviation advisor" },
  { icon: Tag, text: "Exclusive empty leg opportunities" },
  { icon: Sparkles, text: "Preferential market pricing" },
];

const flightOptions = ["1–2", "3–10", "10+"];

const inputClass =
  "w-full bg-card rounded-lg px-4 py-3.5 text-[13px] text-foreground placeholder:text-muted-foreground/60 font-light focus:outline-none focus:ring-1 focus:ring-primary/30 border border-border";

const MembershipEnrollment = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "", flights: "" });
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState<{ name: string; id: string; memberSince: string } | null>(null);

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setLoading(true);
    try {
      await supabase.functions.invoke("crm-capture", {
        body: { name: form.name, email: form.email, phone: form.phone, departure: form.location || "N/A", destination: "Membership Application", source: "membership_enrollment" },
      });
      const seq = Math.floor(1000 + Math.random() * 9000);
      setMember({ name: form.name.toUpperCase(), id: `5000 ${seq.toString().padStart(4, "0")}`, memberSince: String(new Date().getFullYear()) });
      toast.success("Welcome to the Universal Jets network.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <section id="membership" className="section-padding relative overflow-hidden">
      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <p className="text-[11px] tracking-[0.5em] uppercase text-primary mb-6 font-medium">Digital Membership</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-5 leading-tight">
              Join the Universal Jets{" "}
              <span className="text-gradient-gold italic">Private Access Network</span>
            </h2>
            <p className="text-[15px] text-muted-foreground font-light leading-[1.9] max-w-xl mx-auto">
              Apply online and receive your digital membership card instantly.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {!member ? (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.6 }} className="grid lg:grid-cols-5 gap-12">
                {/* Benefits */}
                <div className="lg:col-span-2 flex flex-col justify-center">
                  <motion.div initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
                    <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center mb-8 bg-card">
                      <CreditCard className="w-5 h-5 text-primary" strokeWidth={1.2} />
                    </div>
                    <p className="text-[11px] tracking-[0.35em] uppercase text-primary mb-6 font-medium">Member Benefits</p>
                    <div className="space-y-5">
                      {benefits.map((b, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <b.icon className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.3} />
                          <span className="text-[13px] text-foreground/70 font-light leading-[1.8]">{b.text}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 pt-8 border-t border-border">
                      <p className="text-[12px] text-muted-foreground font-light leading-[1.9]">
                        Membership is complimentary for qualified applicants. Acceptance is subject to review.
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Form */}
                <div className="lg:col-span-3">
                  <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, x: 15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}
                    className="rounded-2xl border border-border bg-card p-8 md:p-10 space-y-5 shadow-sm"
                  >
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] tracking-[0.2em] uppercase text-foreground/60 mb-2.5 font-medium">Full Name *</label>
                        <input type="text" required value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} placeholder="Alexander Hartwell" />
                      </div>
                      <div>
                        <label className="block text-[11px] tracking-[0.2em] uppercase text-foreground/60 mb-2.5 font-medium">Email *</label>
                        <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} placeholder="alex@example.com" />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] tracking-[0.2em] uppercase text-foreground/60 mb-2.5 font-medium">Phone / WhatsApp</label>
                        <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} placeholder="+971 50 000 0000" />
                      </div>
                      <div>
                        <label className="block text-[11px] tracking-[0.2em] uppercase text-foreground/60 mb-2.5 font-medium">Location</label>
                        <input type="text" value={form.location} onChange={(e) => update("location", e.target.value)} className={inputClass} placeholder="Dubai, UAE" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] tracking-[0.2em] uppercase text-foreground/60 mb-2.5 font-medium">Estimated Flights Per Year</label>
                      <div className="grid grid-cols-3 gap-2">
                        {flightOptions.map((opt) => (
                          <button key={opt} type="button" onClick={() => update("flights", opt)}
                            className={`py-2.5 rounded-lg text-[12px] font-medium border transition-all duration-300 ${
                              form.flights === opt
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-card text-foreground/50 hover:border-primary/30 hover:text-foreground"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button type="submit" disabled={loading}
                      className="w-full mt-3 py-4 bg-gradient-gold text-primary-foreground text-[11px] tracking-[0.3em] uppercase font-medium rounded-xl transition-all duration-500 hover:shadow-[0_0_40px_-10px_hsla(38,52%,50%,0.4)] hover:scale-[1.01] disabled:opacity-50"
                    >
                      {loading ? "Processing..." : "Apply for Membership"}
                    </button>

                    <p className="text-[11px] text-muted-foreground text-center font-light pt-1">
                      No commitment required. Your information is handled with absolute discretion.
                    </p>
                  </motion.form>
                </div>
              </motion.div>
            ) : (
              /* ── Digital Membership Card ── */
              <motion.div key="card" initial={{ opacity: 0, scale: 0.92, rotateX: 15 }} animate={{ opacity: 1, scale: 1, rotateX: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="max-w-md mx-auto">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center mb-8">
                  <p className="text-[11px] tracking-[0.35em] uppercase text-primary mb-2 font-medium">Welcome to Universal Jets</p>
                  <p className="text-[13px] text-muted-foreground font-light">Your Private Access is now active.</p>
                </motion.div>

                <div className="relative rounded-2xl overflow-hidden aspect-[1.586/1] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)]" style={{ background: "linear-gradient(160deg, hsl(240 3% 15%) 0%, hsl(240 3% 8%) 40%, hsl(240 2% 12%) 100%)" }}>
                  <motion.div className="absolute inset-0 opacity-[0.07]" animate={{ backgroundPosition: ["0% 0%", "200% 200%"] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} style={{ backgroundImage: "linear-gradient(135deg, transparent 25%, hsla(38,52%,50%,0.4) 35%, transparent 45%, hsla(38,52%,50%,0.2) 55%, transparent 65%)", backgroundSize: "200% 200%" }} />
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

                  <div className="relative z-10 p-7 sm:p-8 h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <p className="text-[11px] tracking-[0.4em] uppercase text-primary/70 font-medium">Universal Jets</p>
                      <p className="text-[9px] tracking-[0.3em] uppercase text-primary/40 font-light">Founder Circle</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-8 rounded-[4px] border border-primary/25 relative overflow-hidden" style={{ background: "linear-gradient(145deg, hsla(38,52%,50%,0.2) 0%, hsla(38,52%,50%,0.08) 100%)" }}>
                        <div className="absolute inset-[3px] border border-primary/15 rounded-[2px]" />
                      </div>
                      <p className="text-[16px] tracking-[0.2em] text-white/60 font-light font-mono">{member.id}</p>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[16px] text-white/85 font-display font-medium tracking-[0.05em] uppercase">{member.name}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[8px] tracking-[0.15em] uppercase text-white/30 font-light leading-tight">Member<br />Since</span>
                          <span className="text-[13px] text-white/50 font-light tracking-wider">{member.memberSince}</span>
                        </div>
                      </div>
                      <p className="text-[9px] tracking-[0.35em] uppercase text-primary/50 font-light">Private Access Network</p>
                    </div>
                  </div>
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 space-y-6">
                  <p className="text-center text-[13px] text-muted-foreground font-light leading-[1.9]">A dedicated aviation advisor will contact you shortly.</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button onClick={() => toast.success("Card saved to your device.")} className="flex items-center gap-2 px-8 py-3.5 border border-border text-foreground/60 hover:text-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-lg transition-all duration-500">
                      <Download className="w-3.5 h-3.5" strokeWidth={1.3} /> Save Card
                    </button>
                    <button onClick={() => document.dispatchEvent(new CustomEvent("open-ricky"))} className="flex items-center gap-2 px-8 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-lg transition-all duration-500 hover:shadow-[0_0_40px_-8px_hsla(38,52%,50%,0.5)]">
                      <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.3} /> Contact Advisor
                    </button>
                  </div>
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