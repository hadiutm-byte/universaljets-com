import { motion } from "framer-motion";
import { ShieldCheck, Globe, Award } from "lucide-react";

const pillars = [
  { icon: ShieldCheck, label: "Trusted Standards" },
  { icon: Globe, label: "Verified Operators" },
  { icon: Award, label: "Zero Compromise" },
];

const TrustedNetworkSection = () => (
  <section className="relative py-16 md:py-20 overflow-hidden">
    <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
      backgroundImage: "radial-gradient(ellipse 50% 40% at 50% 50%, hsla(38,52%,50%,0.2) 0%, transparent 70%)",
    }} />

    <div className="container mx-auto px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto text-center"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-10 h-[1px] bg-primary/25 mx-auto mb-10 origin-center"
        />

        <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-foreground leading-[1.4] mb-4">
          Trusted standards. Verified operators.
        </h2>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold leading-[1.4]">
          <span className="text-gradient-gold italic">Zero compromise.</span>
        </h2>

        {/* Pillars */}
        <div className="flex items-center justify-center gap-8 md:gap-12 mt-12">
          {pillars.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              className="flex items-center gap-2.5"
            >
              <p.icon className="w-4 h-4 text-primary/40" strokeWidth={1.2} />
              <span className="text-[10px] tracking-[0.15em] uppercase text-foreground/35 font-light">
                {p.label}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-10 h-[1px] bg-primary/25 mx-auto mt-12 origin-center"
        />
      </motion.div>
    </div>
  </section>
);

export default TrustedNetworkSection;
