import { motion } from "framer-motion";
import { Clock, Globe, Headphones, ShieldCheck } from "lucide-react";

const items = [
  { icon: Clock, text: "18+ Years Experience" },
  { icon: Globe, text: "Global Operator Network" },
  { icon: Headphones, text: "24/7 Availability" },
  { icon: ShieldCheck, text: "Safety-First Sourcing" },
];

const badges = ["WYVERN", "ARGUS", "DCAA"];

const TrustStrip = () => (
  <section className="relative z-10 py-20 md:py-24">
    <div className="container mx-auto px-8">
      <div className="divider-gold mb-14" />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center gap-10"
      >
        {/* Trust metrics */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <item.icon className="w-4 h-4 text-primary/60" strokeWidth={1.2} />
              <span className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-foreground/50 font-extralight">
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Safety badges */}
        <div className="flex items-center gap-8">
          {badges.map((badge) => (
            <div key={badge} className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-primary/40" strokeWidth={1.2} />
              <span className="text-[8px] tracking-[0.4em] uppercase text-foreground/25 font-extralight">
                {badge}
              </span>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <p className="text-[9px] tracking-[0.3em] text-foreground/20 font-extralight uppercase text-center">
          Trusted by global executives, family offices, and UHNW clients
        </p>
      </motion.div>
      <div className="divider-gold mt-14" />
    </div>
  </section>
);

export default TrustStrip;
