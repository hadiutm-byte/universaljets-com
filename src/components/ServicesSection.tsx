import { motion } from "framer-motion";
import { Plane, CreditCard, Tag, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { FadeReveal, GlassCard } from "./ui/ScrollEffects";

const services = [
  { icon: Plane, title: "Charter Flights", desc: "Any aircraft, anywhere, anytime. On-demand access to the global fleet.", link: "#cta" },
  { icon: CreditCard, title: "Jet Card", desc: "Prepaid hours with fixed rates and guaranteed availability.", link: "/jet-card" },
  { icon: Tag, title: "Empty Legs", desc: "Repositioning flights at up to 75% below standard charter rates.", link: "#cta" },
  { icon: Settings, title: "ACMI & Leasing", desc: "Wet leases, fleet replacement, and capacity solutions for airlines and governments.", link: "/acmi-leasing" },
];

const ServicesSection = () => (
  <section id="services" className="section-padding relative">
    <div className="grid-overlay" />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4.5%)] to-transparent pointer-events-none" />

    <div className="container mx-auto px-8 relative z-10">
      <FadeReveal className="text-center mb-28">
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">What We Do</p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-6">Charter Services</h2>
        <div className="max-w-xl mx-auto space-y-4 mt-4">
          <p className="text-[12px] md:text-[13px] text-foreground/40 font-extralight leading-[2]">
            We don't rely on a single fleet.
          </p>
          <p className="text-[12px] md:text-[13px] text-foreground/40 font-extralight leading-[2]">
            We operate across a global network of trusted partners, giving our clients access to better aircraft, better availability, and better pricing.
          </p>
          <p className="text-[12px] md:text-[13px] text-foreground/45 font-light leading-[2]">
            Every partnership is built on one principle:
          </p>
          <p className="text-[13px] md:text-[14px] text-foreground/55 font-medium leading-[2] italic">
            Control of access.
          </p>
        </div>
      </FadeReveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {services.map((s, i) => {
          const Wrapper = s.link.startsWith("/") ? Link : "a";
          const linkProps = s.link.startsWith("/") ? { to: s.link } : { href: s.link };
          return (
            <FadeReveal key={i} delay={i * 0.1}>
              <GlassCard className="p-8 text-center h-full">
                <Wrapper {...(linkProps as any)} className="block">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-16 h-16 rounded-full glass-panel flex items-center justify-center mx-auto mb-8"
                  >
                    <s.icon className="w-5 h-5 text-primary/70" strokeWidth={1.2} />
                  </motion.div>
                  <h3 className="font-display text-lg mb-4 text-foreground">{s.title}</h3>
                  <p className="text-[12px] text-foreground/40 font-extralight leading-[2]">{s.desc}</p>
                </Wrapper>
              </GlassCard>
            </FadeReveal>
          );
        })}
      </div>
    </div>
  </section>
);

export default ServicesSection;
