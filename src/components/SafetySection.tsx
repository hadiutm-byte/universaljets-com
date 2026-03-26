import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { FadeReveal, StaggerContainer, StaggerItem, GlassCard, FloatingElement } from "./ui/ScrollEffects";

const certifications = [
  { name: "WYVERN", sub: "Wingman Certified" },
  { name: "ARGUS", sub: "Platinum / Gold Rated" },
  { name: "ICAO", sub: "Compliant Operators" },
];

const SafetySection = () => (
  <section id="safety" className="section-padding relative overflow-hidden">
    <div className="grid-overlay" />

    <div className="container mx-auto px-8 relative z-10">
      <FadeReveal className="text-center mb-16">
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/70 mb-6 font-light">
          Safety & Compliance
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground leading-tight">
          Safety First.{" "}
          <span className="text-gradient-gold italic">Always.</span>
        </h2>
      </FadeReveal>

      <StaggerContainer className="max-w-lg mx-auto grid grid-cols-3 gap-4 mb-14">
        {certifications.map((cert, i) => (
          <StaggerItem key={cert.name}>
            <GlassCard breathe className="py-8 px-4 text-center h-full">
              <FloatingElement amplitude={4} speed={4 + i}>
                <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-4 h-4 text-primary/65" strokeWidth={1.2} />
                </div>
              </FloatingElement>
              <p className="text-[11px] tracking-[0.2em] uppercase text-foreground/80 font-medium mb-1">
                {cert.name}
              </p>
              <p className="text-[9px] text-muted-foreground/70 font-light text-center">
                {cert.sub}
              </p>
            </GlassCard>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeReveal delay={0.3}>
        <p className="text-center text-[12px] text-muted-foreground/70 font-light italic">
          Every flight is verified before confirmation.
        </p>
      </FadeReveal>
    </div>
  </section>
);

export default SafetySection;
