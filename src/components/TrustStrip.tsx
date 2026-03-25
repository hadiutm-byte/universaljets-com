import { motion } from "framer-motion";
import { Clock, Globe, Headphones } from "lucide-react";

const items = [
  { icon: Clock, text: "18+ Years Experience" },
  { icon: Globe, text: "Global Coverage" },
  { icon: Headphones, text: "24/7 Concierge" },
];

const TrustStrip = () => (
  <section className="relative z-10 py-20 md:py-24">
    <div className="container mx-auto px-8">
      <div className="divider-gold mb-14" />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20"
      >
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <item.icon className="w-4 h-4 text-gold/60" strokeWidth={1.2} />
            <span className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase text-foreground/40 font-extralight">
              {item.text}
            </span>
          </div>
        ))}
      </motion.div>
      <div className="divider-gold mt-14" />
    </div>
  </section>
);

export default TrustStrip;
