import { useState } from "react";
import { motion } from "framer-motion";
import { Handshake, Hotel, Car, Gem, Check, CreditCard, Building2, Globe, Shield, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const partnerTypes = [
  { icon: Hotel, title: "Luxury Hotels", desc: "Connect your property with our global UHNW clientele for exclusive room upgrades and amenity packages." },
  { icon: Car, title: "Premium Ground Transport", desc: "Offer chauffeur, luxury car rental, and helicopter transfer services to private jet travelers." },
  { icon: Gem, title: "Luxury Brands", desc: "Position your brand within an ultra-premium aviation ecosystem — fashion, watches, jewelry, lifestyle." },
  { icon: Globe, title: "Travel Management", desc: "Integrate private aviation into your global travel management offering — seamless end-to-end luxury travel." },
];

const partnerLogos = [
  "Universal Travel Management & Network",
  "Four Seasons Hotels",
  "Rolls-Royce Motor Cars",
  "Mandarin Oriental",
  "Bulgari Hotels",
  "Aman Resorts",
  "The Ritz-Carlton",
  "Bentley Motors",
];

const coBrandedCards = [
  {
    type: "Visa Infinite",
    desc: "Co-branded Visa Infinite card with aviation rewards, lounge access, and flight credit accumulation.",
    features: ["Flight hour credits on every purchase", "Global airport lounge access", "Priority aircraft booking", "Dedicated concierge line"],
  },
  {
    type: "Mastercard World Elite",
    desc: "Premium Mastercard program with travel insurance, lifestyle benefits, and jet card integration.",
    features: ["Integrated jet card balance", "Travel insurance & protection", "Luxury hotel partner rates", "24/7 emergency assistance"],
  },
];

const whiteLabelBenefits = [
  { icon: Building2, title: "Your Brand, Our Network", desc: "Launch a private aviation service under your brand powered by our global operator network." },
  { icon: Globe, title: "Global Coverage", desc: "Access 7,000+ vetted aircraft worldwide without fleet investment or operational complexity." },
  { icon: Shield, title: "Full Compliance", desc: "ARGUS/WYVERN certified operators, insurance, and regulatory compliance handled end-to-end." },
];

const inputClass =
  "w-full bg-secondary/30 backdrop-blur-sm rounded-lg px-4 py-3 text-[12px] text-foreground placeholder:text-foreground/20 font-light focus:outline-none focus:ring-1 focus:ring-primary/25 border border-border/10";

const PartnerPage = () => {
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.company) return;
    setLoading(true);
    try {
      await supabase.functions.invoke("crm-capture", {
        body: { name: form.name, email: form.email, phone: form.phone, departure: form.company, destination: "Partnership Inquiry", source: "partner_inquiry" },
      });
      setSubmitted(true);
      toast.success("Partnership inquiry received.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 opacity-[0.012] pointer-events-none z-[1]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat" }} />
      <div className="relative z-[2]">
        <Navbar />

        {/* Hero */}
        <section className="pt-40 pb-24 relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse 50% 40% at 50% 30%, hsla(45,79%,46%,0.3) 0%, transparent 70%)" }} />
          <div className="container mx-auto px-8 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="w-16 h-16 rounded-full luxury-border flex items-center justify-center mx-auto mb-8 glow-subtle">
                <Handshake className="w-6 h-6 text-primary/60" strokeWidth={1.2} />
              </div>
              <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Strategic Partnerships</p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-6 leading-tight">
                Partner With <span className="text-gradient-gold italic">Universal Jets</span>
              </h1>
              <p className="text-[13px] md:text-[15px] text-foreground/50 font-extralight leading-[2] max-w-xl mx-auto">
                Join an exclusive network that connects luxury brands, financial institutions, and hospitality leaders with our UHNW clientele.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Partner Types */}
        <section className="pb-24">
          <div className="container mx-auto px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto mb-24">
              {partnerTypes.map((b, i) => (
                <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="text-center py-10 px-6 rounded-xl border border-border/10 bg-card/10 hover:border-primary/15 hover:bg-card/15 transition-all duration-500 group">
                  <div className="w-14 h-14 rounded-full luxury-border flex items-center justify-center mx-auto mb-5 group-hover:glow-subtle transition-all duration-700">
                    <b.icon className="w-5 h-5 text-primary/60" strokeWidth={1.2} />
                  </div>
                  <h3 className="font-display text-[14px] text-foreground mb-2">{b.title}</h3>
                  <p className="text-[11px] text-foreground/40 font-extralight leading-[1.9]">{b.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* ── Partner Logos Carousel ── */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }}
              className="max-w-5xl mx-auto mb-24 overflow-hidden">
              <div className="text-center mb-10">
                <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-4 font-light">Our Network</p>
                <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-4">
                  Trusted <span className="text-gradient-gold italic">Partners</span>
                </h2>
              </div>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
                <div className="flex animate-scroll-logos">
                  {[...partnerLogos, ...partnerLogos].map((name, i) => (
                    <div key={i} className="flex-shrink-0 px-10 py-6 flex items-center justify-center">
                      <span className="text-[11px] tracking-[0.2em] uppercase text-foreground/25 font-light whitespace-nowrap hover:text-foreground/50 transition-colors duration-500">
                        {name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ── Co-Branded Card Programs ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="max-w-5xl mx-auto mb-24">
              <div className="text-center mb-14">
                <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Financial Partnerships</p>
                <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground mb-5">
                  Co-Branded <span className="text-gradient-gold italic">Card Programs</span>
                </h2>
                <p className="text-[13px] text-foreground/45 font-extralight leading-[2] max-w-lg mx-auto">
                  Partner with Universal Jets to offer your clients exclusive aviation benefits through co-branded payment card programs.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {coBrandedCards.map((card, i) => (
                  <motion.div key={card.type} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.7 }}
                    className="rounded-2xl border border-border/15 bg-card/15 p-8 md:p-10 hover:border-primary/15 transition-all duration-500 group">
                    {/* Visual card */}
                    <div className="relative rounded-xl overflow-hidden aspect-[1.586/1] mb-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]"
                      style={{ background: i === 0 ? "linear-gradient(135deg, hsl(222,22%,12%) 0%, hsl(222,25%,8%) 50%, hsl(222,20%,14%) 100%)" : "linear-gradient(135deg, hsl(222,20%,14%) 0%, hsl(222,18%,10%) 50%, hsl(222,22%,12%) 100%)" }}>
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
                      <motion.div className="absolute inset-0 opacity-[0.08]" animate={{ backgroundPosition: ["0% 0%", "200% 200%"] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        style={{ backgroundImage: "linear-gradient(135deg, transparent 25%, hsla(45,79%,46%,0.4) 35%, transparent 45%)", backgroundSize: "200% 200%" }} />
                      <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <p className="text-[10px] tracking-[0.4em] uppercase text-primary/70 font-medium">Universal Jets</p>
                          <p className="text-[8px] tracking-[0.25em] uppercase text-foreground/30 font-light">{card.type}</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-6 rounded-[3px] border border-primary/20" style={{ background: "linear-gradient(145deg, hsla(45,79%,46%,0.2) 0%, hsla(45,79%,46%,0.08) 100%)" }}>
                              <div className="absolute inset-[2px] border border-primary/10 rounded-[2px]" />
                            </div>
                            <p className="text-[13px] tracking-[0.15em] text-foreground/50 font-light font-mono">•••• •••• •••• ••••</p>
                          </div>
                          <p className="text-[9px] tracking-[0.2em] uppercase text-foreground/30 font-extralight">Aviation Rewards Card</p>
                        </div>
                      </div>
                    </div>

                    <h3 className="font-display text-lg text-foreground mb-2">{card.type}</h3>
                    <p className="text-[12px] text-foreground/45 font-extralight leading-[1.9] mb-6">{card.desc}</p>
                    <div className="space-y-2.5">
                      {card.features.map((f, j) => (
                        <div key={j} className="flex items-start gap-3">
                          <Check className="w-3.5 h-3.5 text-primary/50 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                          <span className="text-[11px] text-foreground/50 font-extralight">{f}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── White Label Programs ── */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="max-w-5xl mx-auto mb-24">
              <div className="text-center mb-14">
                <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Enterprise Solutions</p>
                <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground mb-5">
                  White Label <span className="text-gradient-gold italic">Aviation</span>
                </h2>
                <p className="text-[13px] text-foreground/45 font-extralight leading-[2] max-w-lg mx-auto">
                  Launch a private aviation service under your brand — powered by our global infrastructure, technology, and operator network.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                {whiteLabelBenefits.map((b, i) => (
                  <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                    className="text-center py-8 px-6 rounded-xl border border-border/10 bg-card/8 group">
                    <div className="w-12 h-12 rounded-full luxury-border flex items-center justify-center mx-auto mb-5 group-hover:glow-subtle transition-all duration-700">
                      <b.icon className="w-5 h-5 text-primary/60" strokeWidth={1.2} />
                    </div>
                    <h3 className="font-display text-[14px] text-foreground mb-2">{b.title}</h3>
                    <p className="text-[11px] text-foreground/40 font-extralight leading-[1.9]">{b.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-card/20 to-card/5 backdrop-blur-md p-8 md:p-12 text-center">
                <CreditCard className="w-8 h-8 text-primary/40 mx-auto mb-5" strokeWidth={1.2} />
                <h3 className="font-display text-lg text-foreground mb-3">How It Works</h3>
                <div className="grid sm:grid-cols-3 gap-8 max-w-2xl mx-auto mt-8">
                  {[
                    { step: "01", text: "We provide the technology, fleet access, and operational backbone." },
                    { step: "02", text: "You brand the experience — client-facing UI, communications, and service layer." },
                    { step: "03", text: "Your clients fly private under your brand with our global network." },
                  ].map((s) => (
                    <div key={s.step}>
                      <p className="text-[24px] font-display font-semibold text-primary/25 mb-3">{s.step}</p>
                      <p className="text-[11px] text-foreground/45 font-extralight leading-[1.9]">{s.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Partner Contact Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="max-w-lg mx-auto rounded-2xl border border-border/10 bg-card/20 backdrop-blur-md p-8 md:p-10">
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-14 h-14 rounded-full border border-primary/20 flex items-center justify-center mx-auto mb-5">
                    <Check className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-lg mb-2 text-foreground">Inquiry Received</h3>
                  <p className="text-[11px] text-foreground/40 font-extralight">Our partnerships team will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light text-center mb-2">Become a Partner</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-foreground/35 mb-2 font-light">Contact Name *</label>
                      <input required value={form.name} onChange={set("name")} placeholder="Jane Smith" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-foreground/35 mb-2 font-light">Company *</label>
                      <input required value={form.company} onChange={set("company")} placeholder="Four Seasons" className={inputClass} />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-foreground/35 mb-2 font-light">Email *</label>
                      <input type="email" required value={form.email} onChange={set("email")} placeholder="jane@company.com" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-foreground/35 mb-2 font-light">Phone</label>
                      <input value={form.phone} onChange={set("phone")} placeholder="+44 20 1234 5678" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-foreground/35 mb-2 font-light">Message</label>
                    <textarea value={form.message} onChange={set("message")} placeholder="Tell us about your brand and the partnership you envision..." rows={3} className={`${inputClass} resize-none`} />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-lg transition-all duration-500 hover:shadow-[0_0_40px_-10px_hsla(45,79%,46%,0.4)] hover:scale-[1.01] disabled:opacity-50">
                    {loading ? "Submitting..." : "Submit Partnership Inquiry"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default PartnerPage;