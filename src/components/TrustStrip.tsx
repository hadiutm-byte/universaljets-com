import { motion } from "framer-motion";
import { Clock, Globe, Headphones } from "lucide-react";

const items = [
  { icon: Clock, label: "18+ Years Experience" },
  { icon: Globe, label: "Global Coverage" },
  { icon: Headphones, label: "24/7 Concierge" },
];

const TrustStrip = () => (
  <section className="relative z-10 -mt-1">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="glass rounded-lg py-8 px-6"
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <item.icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
              <span className="text-sm tracking-wider text-muted-foreground uppercase font-light">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default TrustStrip;
