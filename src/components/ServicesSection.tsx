import { motion } from "framer-motion";
import { Plane, CreditCard, Tag, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { FadeReveal, StaggerContainer, StaggerItem, GlassCard, FloatingElement } from "./ui/ScrollEffects";

const services = [
  { icon: Plane, title: "Charter Flights", desc: "Any aircraft, anywhere, anytime. On-demand access to the global fleet.", link: "#cta" },
  { icon: CreditCard, title: "Jet Card", desc: "Prepaid hours with fixed rates and guaranteed availability.", link: "/jet-card" },
  { icon: Tag, title: "Empty Legs", desc: "Repositioning flights at up to 75% below standard charter rates.", link: "#cta" },
  { icon: Settings, title: "ACMI & Leasing", desc: "Wet leases, fleet replacement, and capacity solutions for airlines and governments.", link: "/acmi-leasing" },
];

const ServicesSection = () => (
  <section id="services" className="section-padding relative">
    <div className="grid-overlay" />

    <div className="container mx-auto px-8 relative z-10">
      <FadeReveal className="text-center mb-28">
        <p className="text-[10px] tracking-[0.5em] uppercase text-primary/70 mb-6 font-light">What We Do</p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-6">Charter Services</h2>
        <div className="max-w-xl mx-auto space-y-4 mt-4">
          <p className="text-[14px] md:text-[15px] text-muted-foreground font-light leading-[2]">
            We don't rely on a single fleet.
          </p>
          <p className="text-[14px] md:text-[15px] text-muted-foreground font-light leading-[2]">
            We operate across a global network of trusted partners, giving our clients access to better aircraft, better availability, and better pricing.
          </p>
          <p className="text-[15px] md:text-[16px] text-foreground/70 font-normal leading-[2]">
            Every partnership is built on one principle:
          </p>
          <p className="text-[16px] md:text-[17px] text-foreground/80 font-medium leading-[2] italic">
            Control of access.
          </p>
        </div>
      </FadeReveal>

      <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {services.map((s, i) => {
          const Wrapper = s.link.startsWith("/") ? Link : "a";
          const linkProps = s.link.startsWith("/") ? { to: s.link } : { href: s.link };
          return (
            <StaggerItem key={i}>
              <GlassCard breathe className="p-8 text-center h-full">
                <Wrapper {...(linkProps as any)} className="block">
                  <FloatingElement amplitude={5} speed={4 + (i % 3)}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8 bg-muted/60 border border-border">
                      <s.icon className="w-5 h-5 text-primary/70" strokeWidth={1.2} />
                    </div>
                  </FloatingElement>
                  <h3 className="font-display text-lg mb-4 text-foreground">{s.title}</h3>
                  <p className="text-[13px] text-muted-foreground font-light leading-[2]">{s.desc}</p>
                </Wrapper>
              </GlassCard>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </div>
  </section>
);

export default ServicesSection;
