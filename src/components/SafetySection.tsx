import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { FadeReveal, GlassCard } from "./ui/ScrollEffects";

const certifications = [
  { name: "WYVERN", sub: "Wingman Certified" },
  { name: "ARGUS", sub: "Platinum / Gold Rated" },
  { name: "ICAO", sub: "Compliant Operators" },
];

const SafetySection = () => (
  <section id="safety" className="section-padding relative overflow-hidden">
    <div className="grid-overlay" />
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4%)] to-transparent pointer-events-none" />

    <div className="container mx-auto px-8 relative z-10">
      <FadeReveal className="text-center mb-16">
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">
          Safety & Compliance
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground leading-tight">
          Safety First.{" "}
          <span className="text-gradient-gold italic">Always.</span>
        </h2>
      </FadeReveal>

      <div className="max-w-lg mx-auto grid grid-cols-3 gap-4 mb-14">
        {certifications.map((cert, i) => (
          <FadeReveal key={cert.name} delay={0.1 + i * 0.1}>
            <GlassCard className="py-8 px-4 text-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-10 h-10 rounded-full glass-panel flex items-center justify-center mx-auto mb-4"
              >
                <ShieldCheck className="w-4 h-4 text-foreground/30" strokeWidth={1.2} />
              </motion.div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-foreground/50 font-medium mb-1">
                {cert.name}
              </p>
              <p className="text-[9px] text-foreground/20 font-extralight text-center">
                {cert.sub}
              </p>
            </GlassCard>
          </FadeReveal>
        ))}
      </div>

      <FadeReveal delay={0.3}>
        <p className="text-center text-[11px] text-foreground/25 font-extralight italic">
          Every flight is verified before confirmation.
        </p>
      </FadeReveal>
    </div>
  </section>
);

export default SafetySection;
