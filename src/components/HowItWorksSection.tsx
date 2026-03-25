import { motion } from "framer-motion";
import { Send, Globe, Plane } from "lucide-react";

const steps = [
  { num: "01", icon: Send, title: "Tell Us Your Mission" },
  { num: "02", icon: Globe, title: "We Source the Best Aircraft" },
  { num: "03", icon: Plane, title: "You Fly — Seamlessly" },
];

const HowItWorksSection = () => (
  <section className="section-padding relative overflow-hidden">
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.03]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 55% 35% at 50% 50%, hsla(38,52%,50%,0.2) 0%, transparent 70%)",
      }}
    />

    <div className="container mx-auto px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">
          The Process
        </p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground leading-tight">
          How It <span className="text-gradient-gold italic">Works</span>
        </h2>
      </motion.div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 md:gap-12">
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            className="text-center group"
          >
            <div className="w-16 h-16 rounded-full luxury-border flex items-center justify-center mx-auto mb-6 group-hover:glow-subtle transition-all duration-700">
              <step.icon className="w-5 h-5 text-primary/55" strokeWidth={1.2} />
            </div>
            <p className="text-[10px] tracking-[0.3em] text-primary/40 font-light mb-3">
              {step.num}
            </p>
            <h3 className="text-[14px] md:text-[15px] font-display font-medium text-foreground/80">
              {step.title}
            </h3>
          </motion.div>
        ))}
      </div>

      {/* Connecting line — desktop */}
      <div className="hidden md:block max-w-4xl mx-auto -mt-[88px] mb-[88px] px-[100px]">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-border/15 to-transparent" />
      </div>
    </div>
  </section>
);

export default HowItWorksSection;
