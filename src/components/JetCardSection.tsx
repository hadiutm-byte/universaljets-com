import { motion } from "framer-motion";
import { CreditCard, Clock, Lock, Settings } from "lucide-react";
import { FadeReveal, GlassCard } from "./ui/ScrollEffects";

const pillars = [
  { icon: Clock, title: "Guaranteed Availability" },
  { icon: Lock, title: "Fixed Hourly Rates" },
  { icon: CreditCard, title: "Dedicated Fleet Access" },
  { icon: Settings, title: "Bespoke Programs" },
];

const JetCardSection = () => (
  <section className="section-padding relative">
    <div className="grid-overlay" />

    <div className="container mx-auto px-8 relative z-10">
      <FadeReveal className="text-center mb-16">
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Jet Card</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-5">
          Jet Card <span className="text-gradient-gold italic">Membership</span>
        </h2>
        <p className="text-[14px] md:text-[15px] text-muted-foreground font-light leading-[2] max-w-lg mx-auto mb-2">
          Access tailored flight hours with priority availability and fixed structure.
        </p>
        <p className="text-[12px] text-muted-foreground/70 font-extralight tracking-wide italic">
          Available by consultation only.
        </p>
      </FadeReveal>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-14">
        {pillars.map((b, i) => (
          <FadeReveal key={i} delay={i * 0.1}>
            <GlassCard className="py-8 px-4 text-center">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-14 h-14 rounded-full glass-panel flex items-center justify-center mx-auto mb-4"
              >
                <b.icon className="w-5 h-5 text-primary/60" strokeWidth={1.2} />
              </motion.div>
              <h3 className="font-display text-[13px] text-foreground">{b.title}</h3>
            </GlassCard>
          </FadeReveal>
        ))}
      </div>

      <FadeReveal delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="#cta"
          className="btn-luxury px-10 py-4 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.28em] uppercase font-medium rounded-xl"
        >
          Request Proposal
        </a>
        <button
          type="button"
          onClick={() => document.dispatchEvent(new CustomEvent("open-ricky"))}
          className="btn-luxury px-10 py-4 glass-panel text-foreground/60 hover:text-foreground/80 text-[9px] tracking-[0.28em] uppercase font-light rounded-xl"
        >
          Speak to an Advisor
        </button>
      </FadeReveal>
    </div>
  </section>
);

export default JetCardSection;
