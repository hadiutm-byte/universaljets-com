import { motion } from "framer-motion";
import { Check, ArrowRight, Shield, Clock, Globe, HeartHandshake, Plane, Lock, Repeat, CreditCard, Zap, Star, Users } from "lucide-react";
import { JetCard as JetCardVisual } from "@/components/PremiumCards";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import JsonLd from "@/components/JsonLd";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const keyFeatures = [
  "Rates locked at purchase",
  "Zero membership fees",
  "Guaranteed aircraft availability",
  "Unused hours carry forward",
  "Access any aircraft class",
  "Priority over on-demand bookings",
  "No positioning costs",
  "No hidden costs",
  "No fine print",
];

const advantages = [
  { icon: Lock, title: "Rates Locked at Purchase", desc: "Your hourly rate is fixed the moment you purchase — no market fluctuations, no surprises." },
  { icon: Clock, title: "Guaranteed Availability", desc: "Aircraft confirmed even on short notice. Your schedule is never compromised." },
  { icon: Repeat, title: "Hours Carry Forward", desc: "Unused hours roll over. Your investment is protected and never wasted." },
  { icon: Globe, title: "Any Aircraft Class", desc: "From very light jets to ultra long range — your card works across the entire global fleet." },
  { icon: HeartHandshake, title: "Full Concierge Included", desc: "Ground transport, catering, hotels, and lifestyle services included with every flight." },
  { icon: Plane, title: "No Fleet Bias", desc: "We source the best aircraft globally for every mission — not tied to one operator's fleet." },
];

const whyChoose = [
  { icon: Shield, title: "Safety Certified", desc: "Every operator vetted through ARGUS and WYVERN standards." },
  { icon: Zap, title: "Rapid Response", desc: "Aircraft confirmed within hours, not days. Priority positioning." },
  { icon: Star, title: "Transparent Pricing", desc: "No hidden fees, no surprises. What you see is what you pay." },
  { icon: Users, title: "Dedicated Team", desc: "Personal aviation advisor for all your jet card needs." },
];

const faqs = [
  { q: "How do I purchase a Jet Card?", a: "Complete the inquiry form and our team will prepare a tailored proposal based on your flying patterns, preferred aircraft category, and estimated annual usage. Cards are activated upon payment." },
  { q: "What aircraft can I access?", a: "Your Altus Jet Card provides access to the full range of aircraft classes — from very light jets to ultra long range. There are no fleet restrictions." },
  { q: "Do unused hours expire?", a: "No. Unused hours carry forward and never expire. Your investment is fully protected." },
  { q: "Can I use the card for international flights?", a: "Yes. The Altus Jet Card Global provides worldwide coverage across 160+ countries. All positioning, permits, and handling are managed end-to-end." },
  { q: "How is the Jet Card different from Membership?", a: "The Jet Card is a prepaid hour balance with locked-in rates and no recurring fees. Membership is a monthly subscription that provides priority access, exclusive rates, and concierge support. Both include full concierge services." },
];

const JetCardPage = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="Altus Jet Card — Fixed Rates, Zero Fees" description="Purchase private jet flight hours at locked-in rates. No membership fees, no hidden costs. Guaranteed availability with hours that carry forward." path="/jet-card" breadcrumbs={[{ name: "Home", path: "/" }, { name: "Jet Card", path: "/jet-card" }]} />
    <JsonLd data={{
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Altus Jet Card",
      description: "Prepaid private jet flight hours at locked-in rates. Zero membership fees, guaranteed availability, hours carry forward.",
      brand: { "@type": "Organization", name: "Universal Jets" },
      url: "https://universaljets.com/jet-card",
      category: "Private Aviation",
    }} />
    <Navbar />

    {/* ═══ HERO ═══ */}
    <section className="relative pt-32 pb-16 md:pt-44 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(hsla(0,0%,100%,0.06) 1px, transparent 1px), linear-gradient(90deg, hsla(0,0%,100%,0.06) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] opacity-[0.08] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, hsla(43,85%,58%,1) 0%, transparent 70%)" }} />

      <div className="container mx-auto px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8">
                <CreditCard className="w-3 h-3 text-primary" strokeWidth={1.5} />
                <span className="text-[8px] tracking-[0.4em] uppercase text-primary font-medium">Altus Jet Card Global</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-2 leading-[1.1] tracking-[-0.01em]">
                Pure Flying
              </h1>
              <p className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold italic mb-6 leading-[1.1] tracking-[-0.01em] text-gradient-gold" aria-hidden="true">
                Freedom.
              </p>

              <p className="text-[15px] md:text-[16px] text-muted-foreground font-light leading-[1.9] mb-3 max-w-md">
                No hidden costs. No positioning fees. No membership fees. Just pure flying freedom.
              </p>
              <p className="text-[13px] text-muted-foreground/80 font-light leading-[2] mb-8 max-w-sm">
                Purchase flight hours at locked-in rates. Hours carry forward. Access any aircraft class worldwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/jet-card-inquiry" className="px-8 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-sm hover:shadow-[0_0_35px_-8px_hsla(43,85%,58%,0.5)] transition-all duration-500 inline-flex items-center gap-2">
                  Apply for Your Jet Card <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <a href="#jet-card-features" className="px-6 py-3.5 border border-border text-muted-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-sm hover:border-primary/30 hover:text-foreground transition-all duration-500 text-center">
                  Learn More
                </a>
              </div>
            </div>

            {/* Right: Visual Jet Card */}
            <div className="hidden lg:block">
              <JetCardVisual delay={0.3} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ═══ TRUST STRIP ═══ */}
    <section className="py-5 border-y border-border bg-muted/30">
      <div className="container mx-auto px-8">
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2">
          {["Fixed rates", "Zero fees", "Hours carry forward", "Any aircraft class", "Global coverage", "160+ countries"].map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Check className="w-3 h-3 text-primary" strokeWidth={2} />
              <span className="text-[8px] tracking-[0.15em] uppercase text-muted-foreground font-light whitespace-nowrap">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══ KEY FEATURES ═══ */}
    <section id="jet-card-features" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary mb-4 font-light">What You Get</p>
          <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground">
            The Altus <span className="text-gradient-gold italic">Advantage</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
          {keyFeatures.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="flex items-center gap-3 p-4 rounded-lg border border-white/[0.12] bg-white/[0.06]">
              <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" strokeWidth={2} />
              <span className="text-[12px] text-foreground/85 font-light">{f}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══ ADVANTAGES ═══ */}
    <section className="py-16 md:py-24 border-t border-border">
      <div className="container mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary mb-4 font-light">Why Altus</p>
          <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground">Built for <span className="text-gradient-gold italic">Simplicity</span></h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {advantages.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="group rounded-xl border border-border bg-card p-7 hover:border-primary/20 transition-all duration-500">
              <div className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-all duration-500">
                <b.icon className="w-5 h-5 text-primary" strokeWidth={1.2} />
              </div>
              <h3 className="font-display text-[15px] font-semibold mb-2 text-foreground">{b.title}</h3>
              <p className="text-[12px] text-muted-foreground/85 font-light leading-[1.9]">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══ WHY CHOOSE ═══ */}
    <section className="py-14 md:py-18 border-y border-border bg-muted/30">
      <div className="container mx-auto px-8 max-w-4xl">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChoose.map((w, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }} className="text-center">
              <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center mx-auto mb-3 bg-card">
                <w.icon className="w-4 h-4 text-primary" strokeWidth={1.3} />
              </div>
              <h4 className="font-display text-[13px] font-semibold text-foreground mb-1">{w.title}</h4>
              <p className="text-[11px] text-muted-foreground/85 font-light leading-[1.8]">{w.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══ BROKER ADVANTAGE ═══ */}
    <section className="py-14 md:py-20">
      <div className="container mx-auto px-8 max-w-2xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="p-10 md:p-14 rounded-2xl border border-primary/15 bg-card">
          <p className="text-[14px] text-muted-foreground font-light leading-[2] italic mb-1">
            Unlike operators, your jet card is not tied to one fleet.
          </p>
          <p className="text-[15px] text-primary font-medium leading-[2] mb-6">
            We source the best aircraft globally for every mission.
          </p>
          <p className="text-[10px] tracking-[0.15em] text-muted-foreground font-light">
            7,000+ vetted aircraft • ARGUS/WYVERN certified • 160+ countries
          </p>
        </motion.div>
      </div>
    </section>

    {/* ═══ FAQ ═══ */}
    <section className="py-14 md:py-20 border-t border-border">
      <div className="container mx-auto px-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary mb-4 font-light">FAQ</p>
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground">Frequently Asked <span className="text-gradient-gold italic">Questions</span></h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-xl px-6 bg-card">
              <AccordionTrigger className="text-[13px] text-foreground font-medium text-left py-4 hover:no-underline hover:text-primary transition-colors">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-[12px] text-muted-foreground font-light leading-[1.9] pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>

    {/* ═══ CTA ═══ */}
    <section className="py-16 md:py-24 border-t border-border relative">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, hsla(43,85%,58%,0.3) 0%, transparent 60%)" }} />
      <div className="container mx-auto px-8 text-center max-w-lg relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary mb-5 font-light">Get Started</p>
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">Apply for Your <span className="text-gradient-gold italic">Altus Jet Card</span></h2>
          <p className="text-[13px] text-muted-foreground font-light leading-[2] mb-10">
            A tailored proposal prepared around your flying patterns, preferred aircraft category, and annual usage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/jet-card-inquiry" className="px-10 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-sm hover:shadow-[0_0_35px_-8px_hsla(43,85%,58%,0.5)] transition-all duration-500 inline-flex items-center justify-center gap-2">
              Apply for Your Jet Card <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/membership" className="inline-flex items-center justify-center gap-2 px-10 py-4 text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-all duration-500 border border-border rounded-sm">
              View Membership <ArrowRight size={10} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default JetCardPage;
