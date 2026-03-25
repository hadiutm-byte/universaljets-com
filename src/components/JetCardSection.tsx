import { motion } from "framer-motion";
import { CreditCard, Clock, Lock, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  { icon: CreditCard, title: "Prepaid Hours" },
  { icon: Clock, title: "Priority Access" },
  { icon: Lock, title: "Fixed Rates" },
  { icon: Settings, title: "Tailored Programs" },
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
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground">
          Fly on <span className="text-gradient-gold italic">Your Terms</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto mb-14">
        {benefits.map((b, i) => (
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
        className="text-center"
      >
        <Link
          to="/jet-card"
          className="inline-block px-12 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm transition-all duration-500 hover:shadow-[0_0_40px_-8px_hsla(38,52%,50%,0.5)] hover:scale-[1.02]"
        >
          Explore Jet Card
        </Link>
      </motion.div>
    </div>
  </section>
);

export default JetCardSection;
