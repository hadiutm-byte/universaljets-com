import { motion } from "framer-motion";
import { Check, ArrowRight, Shield, Clock, Globe, UserCheck, HeartHandshake, Plane, CreditCard, Lock, Settings, Repeat } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

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
  { icon: Globe, title: "Access Any Aircraft Class", desc: "From very light jets to ultra long range — your card works across the entire global fleet." },
  { icon: HeartHandshake, title: "Full Concierge Included", desc: "Ground transport, catering, hotels, and lifestyle services included with every flight." },
  { icon: Plane, title: "No Fleet Bias", desc: "We source the best aircraft globally for every mission — not tied to one operator's fleet." },
];

const JetCardPage = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="Altus Jet Card Global — Fixed Rates, Zero Fees | Universal Jets" description="Purchase flight hours at locked-in rates. No membership fees, no hidden costs. Guaranteed availability with hours that carry forward." path="/jet-card" />
    <Navbar />

    {/* ═══ HERO ═══ */}
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
      <div className="container mx-auto px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="text-center max-w-3xl mx-auto">
          <p className="text-[11px] tracking-[0.5em] uppercase text-primary mb-6 font-medium">Altus Jet Card Global</p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-6 leading-tight">
            Pure Flying <span className="text-gradient-gold italic">Freedom</span>
          </h1>
          <p className="text-[15px] md:text-[17px] text-muted-foreground font-light leading-[1.9] max-w-xl mx-auto mb-4">
            No hidden costs. No positioning fees. No membership fees. Just pure flying freedom.
          </p>
          <p className="text-[13px] md:text-[14px] text-muted-foreground font-light leading-[1.9] max-w-lg mx-auto mb-10">
            Purchase flight hours in advance at locked-in rates. Your hours roll over, your aircraft options stay wide open.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/jet-card-inquiry" className="inline-block px-8 py-3.5 bg-gradient-gold text-primary-foreground text-[11px] tracking-[0.25em] uppercase font-medium rounded-xl hover:shadow-[0_0_30px_-8px_hsla(45,79%,46%,0.45)] transition-all duration-500">
              Apply for Your Jet Card
            </Link>
            <a href="#jet-card-features" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-border text-foreground/60 hover:text-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl transition-all duration-500">
              Explore Jet Card <ArrowRight size={10} />
            </a>
          </div>

          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto mt-14 mb-8" />
          <p className="text-[12px] tracking-[0.2em] text-muted-foreground font-light">
            Fixed rates • Zero fees • Hours carry forward • Any aircraft class • Global coverage
          </p>
        </motion.div>
      </div>
    </section>

    {/* ═══ KEY FEATURES ═══ */}
    <section id="jet-card-features" className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-[11px] tracking-[0.5em] uppercase text-primary mb-6 font-medium">What You Get</p>
          <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground mb-5">
            The Altus <span className="text-gradient-gold italic">Advantage</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
          {keyFeatures.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-card">
              <Check className="w-4 h-4 text-primary flex-shrink-0" strokeWidth={1.5} />
              <span className="text-[13px] text-foreground/70 font-light">{f}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══ ADVANTAGES ═══ */}
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-[11px] tracking-[0.5em] uppercase text-primary mb-6 font-medium">Why Altus</p>
          <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground">Built for <span className="text-gradient-gold italic">Simplicity</span></h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {advantages.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }} className="text-center group">
              <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center mx-auto mb-7 group-hover:border-primary/30 group-hover:shadow-[0_0_20px_-5px_hsla(45,79%,46%,0.15)] transition-all duration-700">
                <b.icon className="w-5 h-5 text-primary/60" strokeWidth={1.2} />
              </div>
              <h3 className="font-display text-lg mb-3 text-foreground">{b.title}</h3>
              <p className="text-[13px] text-muted-foreground font-light leading-[1.9]">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══ BROKER ADVANTAGE ═══ */}
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-8 max-w-2xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="p-10 md:p-14 rounded-2xl border border-primary/15 bg-card shadow-sm">
          <p className="text-[14px] text-muted-foreground font-light leading-[2] italic mb-1">
            Unlike operators, your jet card is not tied to one fleet.
          </p>
          <p className="text-[15px] text-primary font-medium leading-[2] mb-6">
            We source the best aircraft globally for every mission.
          </p>
          <p className="text-[11px] tracking-[0.2em] text-muted-foreground font-light">
            7,000+ vetted aircraft • ARGUS/WYVERN safety certified • 160+ countries
          </p>
        </motion.div>
      </div>
    </section>

    {/* ═══ CTA ═══ */}
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-8 text-center max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[11px] tracking-[0.5em] uppercase text-primary mb-8 font-medium">Get Started</p>
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">Apply for Your Altus Jet Card</h2>
          <p className="text-[13px] text-muted-foreground font-light leading-[2] mb-10">
            A tailored proposal prepared around your flying patterns, preferred aircraft category, and annual usage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/jet-card-inquiry" className="px-10 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl hover:shadow-[0_0_30px_-8px_hsla(45,79%,46%,0.45)] transition-all duration-500">
              Apply for Your Jet Card
            </Link>
            <Link to="/membership" className="inline-flex items-center justify-center gap-2 px-10 py-3.5 text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-all duration-500 border border-border rounded-xl">
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
