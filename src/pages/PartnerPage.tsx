import { useState } from "react";
import { motion } from "framer-motion";
import {
  Handshake, Hotel, Car, Gem, Check, CreditCard, Building2, Globe, Shield,
  ArrowRight, Crown, Landmark, Heart, Wine, Briefcase, Star, Users, Sparkles
} from "lucide-react";
import { CoBrandedCard, WhiteLabelCard } from "@/components/PremiumCards";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

/* ─── Data ─── */

const ecosystemPartners = [
  "Four Seasons Hotels", "Mandarin Oriental", "Aman Resorts", "The Ritz-Carlton",
  "Bulgari Hotels", "Rolls-Royce Motor Cars", "Bentley Motors", "Chopard",
  "Graff Diamonds", "Universal Travel Management", "Jetex", "ExcelAire",
];

const partnerCategories = [
  {
    id: "luxury",
    icon: Crown,
    label: "Luxury & Lifestyle",
    title: "Luxury Partnerships",
    subtitle: "Hotels · Fashion · Automotive · Experiences",
    desc: "Position your luxury brand within an ultra-premium aviation ecosystem. Our UHNW clientele expects the finest — and they discover it through Universal Jets.",
    partners: [
      { name: "Five-Star Hotels", detail: "Complimentary suite upgrades, late checkout, and curated arrival experiences for Universal Jets members." },
      { name: "Premium Automotive", detail: "Luxury ground transport integration — chauffeur services, supercar access, and branded airport transfers." },
      { name: "Fashion & Jewellery", detail: "In-flight trunk shows, private shopping experiences, and VIP access to collections and events." },
      { name: "Wellness & Spa", detail: "Priority access to world-class wellness retreats, spa treatments, and holistic travel wellness programs." },
    ],
  },
  {
    id: "financial",
    icon: Landmark,
    label: "Financial & Banking",
    title: "Financial Partnerships",
    subtitle: "Co-Branded Cards · Wealth Management · Family Offices",
    desc: "Partner with Universal Jets to offer your HNW clients exclusive aviation benefits. Co-branded card programs, integrated flight credits, and wealth-management synergies.",
    partners: [
      { name: "Co-Branded Cards", detail: "Visa Infinite and Mastercard World Elite programs with flight credit accumulation and lounge access." },
      { name: "Family Offices", detail: "Structured aviation solutions for family offices — dedicated account management and consolidated billing." },
      { name: "Private Banks", detail: "Exclusive aviation privileges for private banking clients — seamless integration into wealth management platforms." },
      { name: "Insurance Partners", detail: "Comprehensive travel and aviation insurance solutions tailored for UHNW clients and corporate travelers." },
    ],
  },
  {
    id: "enterprise",
    icon: Building2,
    label: "Enterprise & White Label",
    title: "Enterprise Solutions",
    subtitle: "White Label · Corporate · Travel Management",
    desc: "Launch a private aviation service under your brand. Full operational support, global fleet access, and technology infrastructure — powered by Universal Jets.",
    partners: [
      { name: "White-Label Aviation", detail: "Your brand, our network. Launch a complete private aviation offering without fleet investment or operational complexity." },
      { name: "Corporate Programs", detail: "Structured corporate travel solutions with volume pricing, consolidated reporting, and dedicated account teams." },
      { name: "Travel Management", detail: "Seamless private aviation integration for TMCs — API access, booking tools, and operator network." },
      { name: "Concierge Services", detail: "Referral and revenue-share programs for luxury concierge firms, personal assistants, and lifestyle managers." },
    ],
  },
];

const coBrandedCards = [
  {
    type: "Visa Infinite",
    gradient: "linear-gradient(135deg, hsl(222,22%,12%) 0%, hsl(222,25%,8%) 50%, hsl(222,20%,14%) 100%)",
    features: ["Flight hour credits on every purchase", "Global airport lounge access", "Priority aircraft booking", "Dedicated concierge line"],
  },
  {
    type: "Mastercard World Elite",
    gradient: "linear-gradient(135deg, hsl(222,20%,14%) 0%, hsl(222,18%,10%) 50%, hsl(222,22%,12%) 100%)",
    features: ["Integrated jet card balance", "Travel insurance & protection", "Luxury hotel partner rates", "24/7 emergency assistance"],
  },
];

const memberBenefits = [
  { icon: Hotel, title: "Hotel Upgrades", desc: "Suite upgrades at partner luxury hotels" },
  { icon: Car, title: "Ground Transport", desc: "Luxury chauffeur & supercar access" },
  { icon: Wine, title: "Dining & Lifestyle", desc: "Priority reservations & VIP access" },
  { icon: Heart, title: "Wellness", desc: "Premium spa & wellness retreats" },
  { icon: Briefcase, title: "Business Services", desc: "Boardroom access & meeting facilities" },
  { icon: Star, title: "Events & Culture", desc: "VIP passes to exclusive events" },
];

const inputClass =
  "w-full bg-secondary/30 backdrop-blur-sm rounded-lg px-4 py-3 text-[12px] text-foreground placeholder:text-foreground/20 font-light focus:outline-none focus:ring-1 focus:ring-primary/25 border border-border/10";

/* ─── Component ─── */

const PartnerPage = () => {
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "", partnerType: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("luxury");

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.company) return;
    setLoading(true);
    try {
      await supabase.functions.invoke("crm-capture", {
        body: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          departure: "N/A",
          destination: `Partnership: ${form.partnerType || "General"}`,
          source: "partner_inquiry",
          notes: form.message,
        },
      });
      setSubmitted(true);
      toast.success("Partnership inquiry received.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const activeCat = partnerCategories.find((c) => c.id === activeCategory) || partnerCategories[0];

  return (
    <div className="min-h-screen bg-background relative">
      <SEOHead
        title="Partner With Universal Jets — Luxury & Financial Collaborations"
        description="Join the Universal Jets partner ecosystem. Luxury hotels, financial institutions, lifestyle brands, and enterprise clients — elevate your offering through private aviation."
        path="/partners"
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Partners", path: "/partners" }]}
      />
      <div className="relative">
        <Navbar />

        {/* ── Hero ── */}
        <section className="pt-40 pb-28 relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse 50% 40% at 50% 30%, hsla(43,85%,58%,0.3) 0%, transparent 70%)" }} />
          <div className="container mx-auto px-8 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="w-16 h-16 rounded-full luxury-border flex items-center justify-center mx-auto mb-8 glow-subtle">
                <Handshake className="w-6 h-6 text-primary/60" strokeWidth={1.2} />
              </div>
              <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Partner Ecosystem</p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-6 leading-tight">
                A Network of <span className="text-gradient-gold italic">Excellence</span>
              </h1>
              <p className="text-[13px] md:text-[15px] text-foreground/50 font-extralight leading-[2] max-w-xl mx-auto">
                Universal Jets connects luxury brands, financial institutions, and enterprise partners with our global UHNW clientele through private aviation.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Scrolling Partner Logos ── */}
        <section className="pb-20">
          <div className="container mx-auto px-8">
            <div className="relative overflow-hidden py-6">
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
              <div className="flex animate-scroll-logos">
                {[...ecosystemPartners, ...ecosystemPartners].map((name, i) => (
                  <div key={i} className="flex-shrink-0 px-10 py-4 flex items-center justify-center">
                    <span className="text-[11px] tracking-[0.25em] uppercase text-foreground/20 font-light whitespace-nowrap hover:text-primary/50 transition-colors duration-500">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Partnership Categories (Tabbed) ── */}
        <section className="pb-28">
          <div className="container mx-auto px-8">
            <div className="text-center mb-14">
              <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Partnership Programs</p>
              <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground mb-5">
                Three Pillars of <span className="text-gradient-gold italic">Partnership</span>
              </h2>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {partnerCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-500 border ${
                    activeCategory === cat.id
                      ? "bg-primary/10 border-primary/25 text-primary shadow-[0_0_30px_-10px_hsla(43,85%,58%,0.2)]"
                      : "bg-card/20 border-border/15 text-foreground/40 hover:text-foreground/60 hover:border-border/25"
                  }`}
                >
                  <cat.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Active Category Content */}
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-5xl mx-auto"
            >
              <div className="rounded-2xl border border-border/15 bg-card/10 p-8 md:p-12 mb-10">
                <div className="flex items-start gap-5 mb-8">
                  <div className="w-14 h-14 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                    <activeCat.icon className="w-6 h-6 text-primary/70" strokeWidth={1.2} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-display font-semibold text-foreground mb-1">{activeCat.title}</h3>
                    <p className="text-[11px] tracking-[0.15em] uppercase text-primary/60 font-medium">{activeCat.subtitle}</p>
                  </div>
                </div>
                <p className="text-[13px] text-foreground/50 font-extralight leading-[2] mb-10 max-w-2xl">{activeCat.desc}</p>

                <div className="grid md:grid-cols-2 gap-6">
                  {activeCat.partners.map((p, i) => (
                    <motion.div
                      key={p.name}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      className="rounded-xl border border-border/10 bg-card/15 p-6 hover:border-primary/15 transition-all duration-500 group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Sparkles className="w-3.5 h-3.5 text-primary/40" strokeWidth={1.5} />
                        <h4 className="font-display text-[14px] text-foreground font-medium">{p.name}</h4>
                      </div>
                      <p className="text-[11px] text-foreground/40 font-extralight leading-[1.9]">{p.detail}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── Co-Branded Card Programs ── */}
        <section className="pb-28">
          <div className="container mx-auto px-8">
            <div className="text-center mb-14">
              <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Featured Program</p>
              <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground mb-5">
                Co-Branded <span className="text-gradient-gold italic">Card Programs</span>
              </h2>
              <p className="text-[13px] text-foreground/45 font-extralight leading-[2] max-w-lg mx-auto">
                Exclusive aviation rewards linked directly to card activity. Built with leading financial institutions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {coBrandedCards.map((card, i) => (
                <motion.div
                  key={card.type}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.7 }}
                  className="rounded-2xl border border-border/15 bg-card/15 p-8 md:p-10 hover:border-primary/15 transition-all duration-500"
                >
                  {/* Premium Card Visual */}
                  <div className="flex justify-center mb-8">
                    <CoBrandedCard
                      network={i === 0 ? "visa" : "mastercard"}
                      cardNumber={i === 0 ? "4000  1234  5678  9010" : "5400  8800  2211  6633"}
                      delay={i * 0.15}
                    />
                  </div>

                  <h3 className="font-display text-lg text-foreground mb-2">{card.type}</h3>
                  <div className="space-y-2.5 mt-5">
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

            {/* White Label Card */}
            <div className="mt-16 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <p className="text-[9px] tracking-[0.5em] uppercase text-white/40 mb-3 font-light">Enterprise Solution</p>
                <h3 className="font-display text-xl text-foreground font-semibold">
                  White Label <span className="text-gradient-gold italic">Aviation Card</span>
                </h3>
                <p className="text-[12px] text-foreground/40 font-light mt-2 max-w-md mx-auto">
                  Your brand identity. Our aviation infrastructure. No Universal Jets branding.
                </p>
              </div>
              <div className="flex justify-center">
                <WhiteLabelCard delay={0.2} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Member Privileges Through Partners ── */}
        <section className="pb-28">
          <div className="container mx-auto px-8">
            <div className="text-center mb-14">
              <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Member Privileges</p>
              <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-5">
                Exclusive Benefits Through Our <span className="text-gradient-gold italic">Partners</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {memberBenefits.map((b, i) => (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="text-center py-8 px-6 rounded-xl border border-border/10 bg-card/10 hover:border-primary/10 transition-all duration-500 group"
                >
                  <div className="w-12 h-12 rounded-full luxury-border flex items-center justify-center mx-auto mb-4 group-hover:glow-subtle transition-all duration-700">
                    <b.icon className="w-5 h-5 text-primary/60" strokeWidth={1.2} />
                  </div>
                  <h4 className="font-display text-[14px] text-foreground mb-2 font-medium">{b.title}</h4>
                  <p className="text-[11px] text-foreground/40 font-extralight leading-[1.9]">{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── White Label Block ── */}
        <section className="pb-28">
          <div className="container mx-auto px-8">
            <div className="max-w-4xl mx-auto rounded-2xl border border-primary/10 bg-gradient-to-br from-card/20 to-card/5 backdrop-blur-md p-8 md:p-14">
              <div className="text-center mb-10">
                <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-4 font-light">Enterprise</p>
                <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-4">
                  White Label <span className="text-gradient-gold italic">Aviation</span>
                </h2>
                <p className="text-[13px] text-foreground/45 font-extralight leading-[2] max-w-lg mx-auto">
                  Launch a private aviation service under your brand — powered by our global infrastructure and operator network.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
                {[
                  { step: "01", icon: Building2, text: "We provide the technology, fleet access, and operational backbone." },
                  { step: "02", icon: Globe, text: "You brand the experience — client-facing UI, communications, and service." },
                  { step: "03", icon: Users, text: "Your clients fly private under your brand with our global network." },
                ].map((s) => (
                  <div key={s.step} className="text-center">
                    <p className="text-[28px] font-display font-semibold text-primary/20 mb-3">{s.step}</p>
                    <s.icon className="w-5 h-5 text-primary/40 mx-auto mb-3" strokeWidth={1.2} />
                    <p className="text-[11px] text-foreground/45 font-extralight leading-[1.9]">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Partnership Inquiry Form ── */}
        <section className="pb-28">
          <div className="container mx-auto px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="max-w-lg mx-auto rounded-2xl border border-border/10 bg-card/20 backdrop-blur-md p-8 md:p-10"
            >
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-14 h-14 rounded-full border border-primary/20 flex items-center justify-center mx-auto mb-5">
                    <Check className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-lg mb-2 text-foreground">Inquiry Received</h3>
                  <p className="text-[11px] text-foreground/40 font-extralight">Our partnerships team will contact you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="text-center mb-4">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-primary/50 font-light mb-2">Become a Partner</p>
                    <p className="text-[12px] text-foreground/35 font-extralight">Tell us about your brand and how we can collaborate.</p>
                  </div>
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
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-foreground/35 mb-2 font-light">Partnership Type</label>
                    <select value={form.partnerType} onChange={set("partnerType")} className={inputClass}>
                      <option value="">Select category...</option>
                      <option value="Luxury & Lifestyle">Luxury & Lifestyle</option>
                      <option value="Financial & Banking">Financial & Banking</option>
                      <option value="Enterprise & White Label">Enterprise & White Label</option>
                      <option value="Affiliate / Referral">Affiliate / Referral</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-foreground/35 mb-2 font-light">Message</label>
                    <textarea value={form.message} onChange={set("message")} placeholder="Tell us about your brand and the partnership you envision..." rows={3} className={`${inputClass} resize-none`} />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-lg transition-all duration-500 hover:shadow-[0_0_40px_-10px_hsla(43,85%,58%,0.4)] hover:scale-[1.01] disabled:opacity-50"
                  >
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
