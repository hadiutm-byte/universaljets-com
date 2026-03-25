import { motion } from "framer-motion";
import { Clock, Globe, Headphones, ShieldCheck } from "lucide-react";
import { FadeReveal } from "./ui/ScrollEffects";

const items = [
  { icon: ShieldCheck, text: "WYVERN Certified" },
  { icon: Clock, text: "18+ Years Experience" },
  { icon: Globe, text: "Global Aircraft Access" },
  { icon: Headphones, text: "24/7 Flight Support" },
];

const TrustStrip = () => (
  <section className="relative z-10 py-20 md:py-24">
    <div className="container mx-auto px-8">
      <div className="divider-shimmer mb-14" />
      <FadeReveal className="flex flex-col items-center gap-10">
        <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-center gap-8 md:gap-16">
          {items.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full glass-panel flex items-center justify-center">
                <item.icon className="w-3.5 h-3.5 text-primary/60" strokeWidth={1.2} />
              </div>
              <span className="text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-foreground/50 font-extralight">
                {item.text}
              </span>
            </motion.div>
          ))}
        </div>

        <p className="text-[9px] tracking-[0.3em] text-foreground/20 font-extralight uppercase text-center">
          Trusted by executives, family offices, and global clients
        </p>
      </FadeReveal>
      <div className="divider-shimmer mt-14" />
    </div>
  </section>
);

export default TrustStrip;
