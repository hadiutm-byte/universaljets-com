import { motion } from "framer-motion";
import { Clock, Globe, Headphones, ShieldCheck } from "lucide-react";

const items = [
  { icon: ShieldCheck, text: "WYVERN Certified Broker" },
  { icon: Clock, text: "18+ Years of Private Aviation Expertise" },
  { icon: Globe, text: "Access to 7,000+ Aircraft Worldwide" },
  { icon: Headphones, text: "24/7 Global Flight Support" },
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
        className="flex flex-col items-center gap-10"
      >
        {/* Trust metrics */}
        <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-center gap-8 md:gap-16">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <item.icon className="w-4 h-4 text-primary/60" strokeWidth={1.2} />
              <span className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-foreground/50 font-extralight">
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <p className="text-[9px] tracking-[0.3em] text-foreground/20 font-extralight uppercase text-center">
          Trusted by global executives, royal families, and private clients
        </p>
      </motion.div>
      <div className="divider-gold mt-14" />
      </motion.div>
      <div className="divider-gold mt-14" />
    </div>
  </section>
);

export default TrustStrip;
