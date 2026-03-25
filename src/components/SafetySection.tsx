import { motion } from "framer-motion";
import { ShieldCheck, CheckCircle } from "lucide-react";

const points = [
  "We only work with audited, certified operators",
  "Compliance with global aviation safety standards",
  "Multi-layer safety checks on every flight",
  "WYVERN, ARGUS, and IS-BAO verified partners",
];

const SafetySection = () => (
  <section className="section-padding relative">
    <div className="container mx-auto px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="w-16 h-16 rounded-full luxury-border flex items-center justify-center mx-auto mb-10">
          <ShieldCheck className="w-6 h-6 text-primary/50" strokeWidth={1.2} />
        </div>
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Safety & Compliance</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-12">
          Your Safety Is <span className="text-gradient-gold italic">Non-Negotiable</span>
        </h2>

        <div className="space-y-5">
          {points.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="flex items-center gap-4 justify-center"
            >
              <CheckCircle className="w-3.5 h-3.5 text-primary/40 flex-shrink-0" strokeWidth={1.5} />
              <span className="text-[12px] text-foreground/45 font-extralight">{p}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default SafetySection;
