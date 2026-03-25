import { motion } from "framer-motion";
import { Shield, Award, FileCheck, Globe, ArrowRight, MessageCircle, Compass, Target, Zap, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { FadeReveal } from "@/components/ui/ScrollEffects";
import ceoPhoto from "@/assets/ceo-portrait.jpg";
import RickyAvatar from "@/components/ricky/RickyAvatar";

const certifications = [
  { icon: Shield, text: "ARGUS Registered Broker" },
  { icon: Award, text: "WYVERN Certified" },
  { icon: FileCheck, text: "DCAA License No. 3342665" },
  { icon: Globe, text: "DIEZ Registered No. 50370" },
];

const howCards = [
  { num: "01", title: "Access", desc: "We analyze the entire global market — not just one fleet.", icon: Compass },
  { num: "02", title: "Precision", desc: "We match aircraft, routing, and pricing intelligently.", icon: Target },
  { num: "03", title: "Execution", desc: "You receive tailored options within minutes.", icon: Zap },
];

const regions = [
  { name: "Dubai", sub: "Global HQ", primary: true },
  { name: "Europe", sub: "Charter & Corporate", primary: false },
  { name: "GCC", sub: "Executive Aviation", primary: false },
  { name: "Africa", sub: "Cargo & Special Ops", primary: false },
];

const AboutPage = () => (
  <div className="min-h-screen bg-background relative">
    <div className="noise-overlay" />
    <div className="relative z-[2]">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={ceoPhoto} alt="Universal Jets" className="w-full h-full object-cover object-top" style={{ filter: "blur(2px) brightness(0.4)" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#121416]/95 via-[#121416]/70 to-transparent" />
        </div>
        <div className="container mx-auto px-6 relative z-10 py-32">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[11px] tracking-[0.5em] uppercase text-primary mb-6 font-medium"
            >
              About Universal Jets
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-white mb-6 leading-[1.1]"
            >
              Private Aviation.{" "}
              <span className="text-gradient-gold italic font-medium">Perfected.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-[16px] text-white/60 font-light leading-[1.9] mb-10 max-w-lg"
            >
              Built on experience. Driven by precision. Designed for those who expect more.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => document.dispatchEvent(new CustomEvent("open-ricky"))}
                className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-gold text-white text-[11px] tracking-[0.25em] uppercase font-medium rounded-xl hover:shadow-[0_0_40px_-10px_hsla(45,79%,46%,0.4)] transition-all duration-500"
              >
                Start With Ricky <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => document.dispatchEvent(new CustomEvent("open-ricky-booking"))}
                className="inline-flex items-center gap-3 px-10 py-4 border border-white/15 text-white/70 hover:text-white text-[11px] tracking-[0.25em] uppercase font-light rounded-xl transition-all duration-300"
              >
                Request a Flight
              </button>
            </motion.div>
          </div>
        </div>
        {/* Ricky floating bottom-right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6, type: "spring" }}
          className="absolute bottom-8 right-8 md:bottom-12 md:right-16 z-20 hidden lg:block"
        >
          <div className="w-28 h-28">
            <RickyAvatar pose="wave" />
          </div>
        </motion.div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <section className="section-white border-b border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {certifications.map((cert, i) => (
              <motion.div
                key={cert.text}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <cert.icon className="w-5 h-5 text-primary flex-shrink-0" strokeWidth={1.3} />
                <span className="text-[12px] text-muted-foreground tracking-[0.1em] uppercase font-medium">{cert.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CEO SECTION ===== */}
      <section className="section-white">
        <div className="container mx-auto px-6 py-24 md:py-32">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-16 items-center">
            {/* Left — Photo */}
            <FadeReveal className="lg:col-span-2">
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={ceoPhoto}
                    alt="Hadi Abdel Hadi — Founder & CEO"
                    className="w-full aspect-[3/4] object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-primary/10 blur-2xl" />
              </div>
            </FadeReveal>

            {/* Right — Text */}
            <FadeReveal delay={0.15} className="lg:col-span-3">
              <p className="text-[11px] tracking-[0.4em] uppercase text-primary font-medium mb-5">A Word from Our Founder</p>
              <div className="space-y-5 text-[15px] text-muted-foreground font-light leading-[2]">
                <p>At Universal Jets, we don't just arrange flights — we design experiences around the people who trust us with their time.</p>
                <p>After nearly two decades in private aviation, I've learned one thing: clients don't want options — they want clarity, precision, and trust.</p>
                <p className="text-foreground font-normal italic text-[17px]">That's what we deliver.</p>
                <p>Every flight we arrange is built around one principle — it should feel effortless. No friction. No uncertainty. Just the right aircraft, at the right time.</p>
                <p>This is not about jets. This is about how you move through the world.</p>
              </div>
              <div className="mt-10 pt-8 border-t border-border">
                <p className="font-display text-[17px] font-semibold text-foreground">— Hadi Abdel Hadi</p>
                <p className="text-[13px] text-muted-foreground font-light mt-1">Founder & CEO</p>
                <p className="text-[11px] text-primary/70 tracking-[0.1em] mt-1">18+ Years in Private Aviation · Europe · GCC</p>
              </div>
            </FadeReveal>
          </div>
        </div>
      </section>

      {/* ===== HOW WE OPERATE ===== */}
      <section className="section-light">
        <div className="container mx-auto px-6 py-24 md:py-32">
          <FadeReveal className="text-center mb-16">
            <p className="text-[11px] tracking-[0.4em] uppercase text-primary font-medium mb-4">How We Operate</p>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground">
              Three Pillars of <span className="text-gradient-gold italic">Excellence</span>
            </h2>
          </FadeReveal>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howCards.map((card, i) => (
              <FadeReveal key={card.num} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: "0 20px 50px -15px hsla(38, 52%, 50%, 0.15)" }}
                  transition={{ duration: 0.3 }}
                  className="bg-card rounded-2xl border border-border p-8 shadow-sm text-center group cursor-default"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    <card.icon className="w-6 h-6 text-primary" strokeWidth={1.3} />
                  </div>
                  <p className="text-[11px] tracking-[0.3em] text-primary font-medium mb-2">{card.num}</p>
                  <h3 className="text-[20px] font-display font-semibold text-foreground mb-3">{card.title}</h3>
                  <p className="text-[14px] text-muted-foreground font-light leading-[1.8]">{card.desc}</p>
                </motion.div>
              </FadeReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RICKY SECTION ===== */}
      <section className="section-white">
        <div className="container mx-auto px-6 py-24 md:py-32">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <FadeReveal>
              <p className="text-[11px] tracking-[0.4em] uppercase text-primary font-medium mb-5">Your Digital Concierge</p>
              <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-6 leading-[1.2]">
                Meet Ricky — Your Private Aviation{" "}
                <span className="text-gradient-gold italic">Concierge</span>
              </h2>
              <p className="text-[16px] text-muted-foreground font-light leading-[1.9] mb-8">
                No forms. No waiting. Just tell Ricky what you need.
              </p>
              <div className="space-y-4 mb-10">
                {["Live conversation with an AI advisor", "Smart aircraft recommendations", "Instant booking flow"].map((feat) => (
                  <div key={feat} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-[14px] text-foreground/80 font-light">{feat}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => document.dispatchEvent(new CustomEvent("open-ricky"))}
                className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-gold text-white text-[11px] tracking-[0.25em] uppercase font-medium rounded-xl hover:shadow-[0_0_40px_-10px_hsla(45,79%,46%,0.4)] transition-all duration-500"
              >
                Start With Ricky <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </FadeReveal>
            <FadeReveal delay={0.2} className="flex justify-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-64 h-64 md:w-72 md:h-72"
              >
                <RickyAvatar pose="idle" />
              </motion.div>
            </FadeReveal>
          </div>
        </div>
      </section>

      {/* ===== GLOBAL PRESENCE ===== */}
      <section className="section-light">
        <div className="container mx-auto px-6 py-24 md:py-32">
          <FadeReveal className="text-center mb-16">
            <p className="text-[11px] tracking-[0.4em] uppercase text-primary font-medium mb-4">Where We Operate</p>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground">
              Global <span className="text-gradient-gold italic">Presence</span>
            </h2>
          </FadeReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {regions.map((r, i) => (
              <FadeReveal key={r.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className={`rounded-2xl border p-8 text-center transition-all duration-300 ${
                    r.primary
                      ? "bg-card border-primary/20 shadow-md"
                      : "bg-card border-border shadow-sm"
                  }`}
                >
                  <MapPin className={`w-5 h-5 mx-auto mb-3 ${r.primary ? "text-primary" : "text-muted-foreground"}`} strokeWidth={1.3} />
                  <h3 className="text-[17px] font-display font-semibold text-foreground mb-1">{r.name}</h3>
                  <p className="text-[12px] text-muted-foreground font-light">{r.sub}</p>
                </motion.div>
              </FadeReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="section-dark">
        <div className="container mx-auto px-6 py-24 md:py-32 text-center">
          <FadeReveal>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-white mb-4 leading-[1.1]">
              Your time deserves <span className="text-gradient-gold italic">precision.</span>
            </h2>
            <p className="text-[16px] text-white/50 font-light mb-12">Your journey deserves more.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.dispatchEvent(new CustomEvent("open-ricky-booking"))}
                className="inline-flex items-center gap-3 px-12 py-4 bg-gradient-gold text-white text-[12px] tracking-[0.25em] uppercase font-medium rounded-xl"
              >
                Request a Flight <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </motion.button>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-10 py-4 border border-white/15 text-white/60 hover:text-white text-[12px] tracking-[0.25em] uppercase font-light rounded-xl transition-all duration-300"
              >
                Speak to an Advisor
              </Link>
              <a
                href="https://wa.me/447888999944?text=Hello%2C%20I%20would%20like%20to%20request%20a%20private%20jet%20charter."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-4 border border-white/15 text-white/60 hover:text-white text-[12px] tracking-[0.25em] uppercase font-light rounded-xl transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                WhatsApp
              </a>
            </div>
          </FadeReveal>
        </div>
      </section>

      <Footer />
    </div>
  </div>
);

export default AboutPage;
