import { motion } from "framer-motion";
import { CreditCard, Clock, Lock, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const pillars = [
  { icon: Clock, title: "Guaranteed Availability" },
  { icon: Lock, title: "Fixed Hourly Rates" },
  { icon: CreditCard, title: "Dedicated Fleet Access" },
  { icon: Settings, title: "Bespoke Programs" },
];

const JetCardSection = () => (
  <section className="section-padding relative">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4%)] to-transparent pointer-events-none" />

    <div className="container mx-auto px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Jet Card</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-5">
          Jet Card <span className="text-gradient-gold italic">Membership</span>
        </h2>
        <p className="text-[13px] md:text-[14px] text-foreground/40 font-extralight leading-[2] max-w-lg mx-auto mb-2">
          Access tailored flight hours with priority availability and fixed structure.
        </p>
        <p className="text-[11px] text-foreground/25 font-extralight tracking-wide italic">
          Available by consultation only.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto mb-14">
        {pillars.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            className="text-center group"
          >
            <div className="w-14 h-14 rounded-full luxury-border flex items-center justify-center mx-auto mb-4 group-hover:glow-subtle transition-all duration-700">
              <b.icon className="w-5 h-5 text-primary/60" strokeWidth={1.2} />
            </div>
            <h3 className="font-display text-[13px] text-foreground">{b.title}</h3>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <a
          href="#cta"
          className="px-10 py-4 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.28em] uppercase font-medium rounded-sm transition-all duration-500 hover:shadow-[0_0_40px_-8px_hsla(38,52%,50%,0.5)] hover:scale-[1.02]"
        >
          Request Proposal
        </a>
        <button
          type="button"
          onClick={() => document.dispatchEvent(new CustomEvent("open-ricky"))}
          className="px-10 py-4 luxury-border text-foreground/50 hover:text-foreground/80 text-[9px] tracking-[0.28em] uppercase font-light rounded-sm transition-all duration-500 hover:border-[hsla(0,0%,100%,0.15)] hover:scale-[1.02]"
        >
          Speak to an Advisor
        </button>
      </motion.div>
    </div>
  </section>
);

export default JetCardSection;
