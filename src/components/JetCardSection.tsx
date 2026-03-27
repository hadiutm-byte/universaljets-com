import { motion } from "framer-motion";
import { CreditCard, Clock, Lock, Repeat, Globe, Shield, ArrowRight } from "lucide-react";
import { FadeReveal, GlassCard } from "./ui/ScrollEffects";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const pillars = [
  { icon: Lock, title: "Rates Locked at Purchase" },
  { icon: Clock, title: "Guaranteed Availability" },
  { icon: Repeat, title: "Hours Carry Forward" },
  { icon: Globe, title: "Any Aircraft Class" },
];

const JetCardSection = () => (
  <section className="section-padding relative">
    <div className="grid-overlay" />

    <div className="container mx-auto px-8 relative z-10">
      <FadeReveal className="text-center mb-16">
        <p className="text-[11px] tracking-[0.5em] uppercase text-primary mb-6 font-medium">Altus Jet Card Global</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-5">
          Pure Flying <span className="text-gradient-gold italic">Freedom</span>
        </h2>
        <p className="text-[15px] md:text-[16px] text-muted-foreground font-light leading-[1.9] max-w-lg mx-auto mb-2">
          No hidden costs. No positioning fees. No membership fees. Just pure flying freedom.
        </p>
        <p className="text-[13px] text-muted-foreground font-light tracking-wide italic">
          Purchase flight hours at locked-in rates.
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
                <b.icon className="w-5 h-5 text-primary" strokeWidth={1.2} />
              </motion.div>
              <h3 className="font-display text-[14px] text-foreground font-medium">{b.title}</h3>
            </GlassCard>
          </FadeReveal>
        ))}
      </div>

      <FadeReveal delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button variant="ctaGold" asChild className="px-10 py-4 text-[10px] tracking-[0.28em] uppercase rounded-xl h-auto">
          <Link to="/jet-card">Explore Jet Card</Link>
        </Button>
        <Button variant="ctaDark" asChild className="px-10 py-4 text-[10px] tracking-[0.28em] uppercase rounded-xl h-auto">
          <Link to="/jet-card-inquiry">Apply for Your Jet Card</Link>
        </Button>
      </FadeReveal>
    </div>
  </section>
);

export default JetCardSection;
