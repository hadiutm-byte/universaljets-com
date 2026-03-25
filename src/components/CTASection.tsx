import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Check, Plane, CreditCard, Tag, Headphones,
  MessageCircle, Globe, ShieldCheck, Clock, Users,
  ChevronRight, Send, ArrowRight,
} from "lucide-react";
import { FadeReveal, GlassCard } from "./ui/ScrollEffects";

const WHATSAPP_NUMBER = "971501234567";
const WHATSAPP_MSG = encodeURIComponent("Hi, I'd like to speak with an aviation advisor at Universal Jets.");

/* ─── Ricky Quick‑Option Chip ─── */
const QuickOption = ({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.04, y: -2 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className="flex items-center gap-2.5 px-5 py-3 rounded-lg glass-panel border border-border/10 hover:border-primary/20 transition-all duration-300 cursor-pointer group"
  >
    <Icon className="w-4 h-4 text-primary/50 group-hover:text-primary/80 transition-colors" strokeWidth={1.3} />
    <span className="text-[11px] tracking-[0.15em] uppercase text-foreground/50 group-hover:text-foreground/80 font-light transition-colors">
      {label}
    </span>
  </motion.button>
);

/* ─── Form field classes ─── */
const inputClass =
  "w-full bg-card/50 backdrop-blur-sm rounded-lg px-4 py-3.5 text-[13px] text-foreground placeholder:text-muted-foreground/60 font-light focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all duration-300 border border-border hover:border-primary/20";
const labelClass = "text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1.5 block font-light";

/* ─── Authority items ─── */
const authorityItems = [
  { icon: Clock, text: "18+ Years Experience" },
  { icon: Globe, text: "Global Aircraft Network" },
  { icon: Headphones, text: "24/7 Availability" },
  { icon: Users, text: "Trusted by UHNW Clients" },
];

/* ─── What Happens Next steps ─── */
const nextSteps = [
  { num: "01", text: "We analyze availability across global operators" },
  { num: "02", text: "We optimize aircraft, routing, and pricing" },
  { num: "03", text: "You receive tailored options within minutes" },
];

const CTASection = () => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", departure: "", destination: "",
    date: "", returnDate: "", passengers: "", aircraft: "", budget: "", notes: "",
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.departure || !form.destination) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.functions.invoke("crm-capture", { body: form });
    if (error) toast.error("Something went wrong. Please try again.");
    else { setSubmitted(true); toast.success("Your flight request has been received."); }
    setLoading(false);
  };

  const openRicky = () => document.dispatchEvent(new CustomEvent("open-ricky"));

  return (
    <section id="cta" className="relative">
      {/* Ambient glow */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse at 50% 30%, hsla(38,52%,50%,0.2) 0%, transparent 60%)" }} />

      {/* ═══════ SECTION 1 — HERO ═══════ */}
      <div className="py-28 md:py-40 relative">
        <div className="container mx-auto px-8 relative z-10">
          <FadeReveal className="text-center max-w-3xl mx-auto">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/45 mb-8 font-light">Your Journey Starts Here</p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-semibold text-foreground mb-6 leading-[1.1]">
              Request Your <span className="text-gradient-gold italic font-medium">Flight</span>
            </h2>
            <p className="text-[12px] md:text-[13px] tracking-[0.12em] text-foreground/30 font-extralight leading-[2] mb-10 max-w-lg mx-auto">
              Speak directly with an aviation advisor.<br />We respond within minutes.
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={openRicky}
              className="btn-luxury inline-flex items-center gap-3 px-10 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm cursor-pointer"
            >
              Start with Ricky
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </motion.button>
          </FadeReveal>
        </div>
      </div>

      <div className="divider-shimmer" />

      {/* ═══════ SECTION 2 — RICKY FIRST CONTACT ═══════ */}
      <div className="py-20 md:py-28">
        <div className="container mx-auto px-8">
          <FadeReveal className="max-w-2xl mx-auto">
            <GlassCard hover={false} className="p-8 md:p-12">
              {/* Ricky message */}
              <div className="flex items-start gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-display font-semibold text-primary/70">R</span>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-primary/40 font-light mb-2">Ricky — Senior Aviation Advisor</p>
                  <p className="text-[13px] text-foreground/60 font-light leading-[1.9]">
                    "You don't need to fill forms.<br />Tell me what you need — I'll handle the rest."
                  </p>
                </div>
              </div>

              {/* Quick options */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <QuickOption icon={Plane} label="Request a Flight" onClick={openRicky} />
                <QuickOption icon={CreditCard} label="Explore Jet Card" onClick={openRicky} />
                <QuickOption icon={Tag} label="Find Empty Legs" onClick={openRicky} />
                <QuickOption icon={Headphones} label="Speak to Advisor" onClick={openRicky} />
              </div>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-border/10" />
                <span className="text-[9px] tracking-[0.3em] uppercase text-foreground/15 font-light">or fill in details</span>
                <div className="flex-1 h-px bg-border/10" />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(true)}
                className="w-full py-3.5 text-[10px] tracking-[0.25em] uppercase text-primary/50 hover:text-primary/80 font-light border border-border/10 hover:border-primary/15 rounded-lg transition-all duration-300 cursor-pointer"
              >
                Continue to Form <ChevronRight className="inline w-3 h-3 ml-1" strokeWidth={1.5} />
              </motion.button>
            </GlassCard>
          </FadeReveal>
        </div>
      </div>

      {/* ═══════ SECTION 3 — SMART FORM ═══════ */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-20 md:pb-28">
              <div className="container mx-auto px-8">
                <div className="max-w-3xl mx-auto">
                  <GlassCard hover={false} className="p-8 md:p-12">
                    {submitted ? (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-16 text-center">
                        <div className="w-16 h-16 rounded-full border border-primary/20 flex items-center justify-center mx-auto mb-6">
                          <Check className="w-7 h-7 text-primary" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-display text-xl mb-3 text-foreground">Request Received</h3>
                        <p className="text-[12px] text-foreground/35 font-extralight">Expect a personalised quote within minutes.</p>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit}>
                        {/* Trip Details */}
                        <div className="mb-8">
                          <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/20 font-light mb-5">Trip Details</p>
                          <div className="grid md:grid-cols-2 gap-5 mb-5">
                            <div><label className={labelClass}>From *</label><input value={form.departure} onChange={set("departure")} placeholder="City or airport" required className={inputClass} /></div>
                            <div><label className={labelClass}>To *</label><input value={form.destination} onChange={set("destination")} placeholder="City or airport" required className={inputClass} /></div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                            <div><label className={labelClass}>Departure Date</label><input type="date" value={form.date} onChange={set("date")} className={inputClass} /></div>
                            <div><label className={labelClass}>Return Date</label><input type="date" value={form.returnDate} onChange={set("returnDate")} className={inputClass} /></div>
                            <div><label className={labelClass}>Passengers</label><input type="number" min={1} max={50} value={form.passengers} onChange={set("passengers")} placeholder="4" className={inputClass} /></div>
                          </div>
                        </div>

                        {/* Preferences */}
                        <div className="mb-8">
                          <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/20 font-light mb-5">Preferences</p>
                          <div className="grid md:grid-cols-2 gap-5 mb-5">
                            <div>
                              <label className={labelClass}>Aircraft Type</label>
                              <select value={form.aircraft} onChange={set("aircraft")} className={inputClass}>
                                <option value="">No preference</option>
                                <option value="Light Jet">Light Jet</option>
                                <option value="Midsize Jet">Midsize Jet</option>
                                <option value="Super Midsize">Super Midsize</option>
                                <option value="Heavy Jet">Heavy Jet</option>
                                <option value="Ultra Long Range">Ultra Long Range</option>
                                <option value="VIP Airliner">VIP Airliner</option>
                              </select>
                            </div>
                            <div>
                              <label className={labelClass}>Budget Range</label>
                              <select value={form.budget} onChange={set("budget")} className={inputClass}>
                                <option value="">Flexible</option>
                                <option value="Under $25K">Under $25K</option>
                                <option value="$25K – $50K">$25K – $50K</option>
                                <option value="$50K – $100K">$50K – $100K</option>
                                <option value="$100K+">$100K+</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className={labelClass}>Special Requests</label>
                            <textarea value={form.notes} onChange={set("notes")} placeholder="Catering, ground transport, specific requirements..." rows={3} className={`${inputClass} resize-none`} />
                          </div>
                        </div>

                        {/* Contact */}
                        <div className="mb-10">
                          <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/20 font-light mb-5">Contact</p>
                          <div className="grid md:grid-cols-3 gap-5">
                            <div><label className={labelClass}>Full Name *</label><input value={form.name} onChange={set("name")} placeholder="John Smith" required className={inputClass} /></div>
                            <div><label className={labelClass}>Email *</label><input type="email" value={form.email} onChange={set("email")} placeholder="john@company.com" required className={inputClass} /></div>
                            <div><label className={labelClass}>Phone / WhatsApp</label><input value={form.phone} onChange={set("phone")} placeholder="+44 20 1234 5678" className={inputClass} /></div>
                          </div>
                        </div>

                        {/* Submit */}
                        <div className="text-center">
                          <button type="submit" disabled={loading} className="w-full md:w-auto px-16 py-4.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm transition-all duration-500 hover:shadow-[0_0_40px_-8px_hsla(38,52%,50%,0.5)] hover:scale-[1.02] disabled:opacity-50 cursor-pointer">
                            {loading ? "Submitting..." : "Get My Options"}
                          </button>
                        </div>
                      </form>
                    )}
                  </GlassCard>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="divider-shimmer" />

      {/* ═══════ SECTION 4 — WHAT HAPPENS NEXT ═══════ */}
      <div className="py-20 md:py-28">
        <div className="container mx-auto px-8">
          <FadeReveal className="max-w-3xl mx-auto">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/40 mb-6 font-light text-center">Transparent Process</p>
            <h3 className="text-2xl md:text-4xl font-display font-semibold text-foreground text-center mb-14">
              What Happens <span className="text-gradient-gold italic font-medium">Next</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {nextSteps.map((step, i) => (
                <FadeReveal key={i} delay={i * 0.15}>
                  <GlassCard hover={false} className="p-8 text-center h-full">
                    <span className="text-3xl font-display font-bold text-primary/10 block mb-4">{step.num}</span>
                    <p className="text-[12px] text-foreground/40 font-extralight leading-[2]">{step.text}</p>
                  </GlassCard>
                </FadeReveal>
              ))}
            </div>
          </FadeReveal>
        </div>
      </div>

      <div className="divider-shimmer" />

      {/* ═══════ SECTION 5 — AUTHORITY ═══════ */}
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-8">
          <FadeReveal className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
            {authorityItems.map((item, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05 }} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full glass-panel flex items-center justify-center">
                  <item.icon className="w-3.5 h-3.5 text-primary/50" strokeWidth={1.2} />
                </div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/40 font-extralight">{item.text}</span>
              </motion.div>
            ))}
          </FadeReveal>
        </div>
      </div>

      <div className="divider-shimmer" />

      {/* ═══════ SECTION 6 — WHATSAPP FAST TRACK ═══════ */}
      <div className="py-20 md:py-28">
        <div className="container mx-auto px-8">
          <FadeReveal className="max-w-xl mx-auto text-center">
            <GlassCard hover={false} className="py-12 px-8">
              <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }} className="w-14 h-14 rounded-full glass-panel flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-6 h-6 text-primary/50" strokeWidth={1.2} />
              </motion.div>
              <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-3">
                Need Immediate Assistance?
              </h3>
              <p className="text-[12px] text-foreground/30 font-extralight leading-[2] mb-8">
                Skip the forms. Message us directly for immediate, personal assistance.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
                target="_blank" rel="noopener noreferrer"
                className="btn-luxury inline-flex items-center gap-3 px-10 py-4 bg-[hsl(142,70%,35%)] hover:bg-[hsl(142,70%,40%)] text-white text-[10px] tracking-[0.25em] uppercase font-medium rounded-sm"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                Chat on WhatsApp
              </a>
              <p className="text-[9px] text-foreground/20 font-extralight mt-5 tracking-wide">Available 24/7 · Typical response under 5 minutes</p>
            </GlassCard>
          </FadeReveal>
        </div>
      </div>

      <div className="divider-shimmer" />

      {/* ═══════ SECTION 7 — FINAL CTA ═══════ */}
      <div className="py-24 md:py-36">
        <div className="container mx-auto px-8">
          <FadeReveal className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-display font-semibold text-foreground mb-6 leading-tight">
              Your Aircraft Is One <span className="text-gradient-gold italic font-medium">Message</span> Away
            </h2>
            <p className="text-[11px] text-foreground/25 font-extralight tracking-[0.15em] mb-10">
              6,000+ aircraft • 40,000 airports • 24/7 global coverage
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setShowForm(true); document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" }); }}
              className="btn-luxury inline-flex items-center gap-3 px-14 py-4.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" strokeWidth={1.5} />
              Request Now
            </motion.button>
          </FadeReveal>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
