import { motion } from "framer-motion";
import { Send, Globe, Plane } from "lucide-react";
import { FadeReveal, StaggerContainer, StaggerItem, GlassCard, FloatingElement } from "./ui/ScrollEffects";

const steps = [
  { num: "01", icon: Send, title: "Tell Us Your Mission" },
  { num: "02", icon: Globe, title: "We Source the Best Aircraft" },
  { num: "03", icon: Plane, title: "You Fly — Seamlessly" },
];

const HowItWorksSection = () => (
  <section className="section-padding relative overflow-hidden">
    <div className="grid-overlay" />

    <div className="container mx-auto px-8 relative z-10">
      <FadeReveal className="text-center mb-24">
        <p className="text-[10px] tracking-[0.55em] uppercase text-primary mb-7 font-medium">
          The Process
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground leading-tight tracking-[-0.01em]">
          How It <span className="text-gradient-gold italic">Works</span>
        </h2>
      </FadeReveal>

      <StaggerContainer className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 md:gap-12">
        {steps.map((step, i) => (
          <StaggerItem key={step.num}>
            <GlassCard breathe className="p-8 text-center h-full">
              <FloatingElement amplitude={5} speed={4 + i}>
                <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-5 h-5 text-primary" strokeWidth={1.2} />
                </div>
              </FloatingElement>
              <p className="text-[11px] tracking-[0.3em] text-primary/60 font-medium mb-3">
                {step.num}
              </p>
              <h3 className="text-[15px] md:text-[16px] font-display font-medium text-foreground">
                {step.title}
              </h3>
            </GlassCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  </section>
);

export default HowItWorksSection;