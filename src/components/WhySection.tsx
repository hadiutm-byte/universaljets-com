import { motion } from "framer-motion";
import { Globe, TrendingDown, Headphones, Settings } from "lucide-react";

const reasons = [
  { icon: Globe, title: "Global Fleet Access", desc: "Instant access to 5,000+ vetted aircraft across every continent, every airport class." },
  { icon: TrendingDown, title: "Better Pricing", desc: "Market intelligence and operator relationships ensure you never overpay for a charter." },
  { icon: Headphones, title: "24/7 Expert Advisory", desc: "Dedicated aviation advisors available around the clock. One call is all it takes." },
  { icon: Settings, title: "Tailored Solutions", desc: "Every mission is unique. We engineer bespoke flight solutions around your exact needs." },
];

const WhySection = () => (
  <section id="why" className="section-padding">
    <div className="container mx-auto px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-28"
      >
        <p className="text-[9px] tracking-[0.5em] uppercase text-gold/70 mb-6 font-light">The Difference</p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold">Why Universal Jets</h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-x-16 gap-y-20 max-w-4xl mx-auto">
        {reasons.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.7 }}
            className="group"
          >
            <div className="w-14 h-14 rounded-full luxury-border flex items-center justify-center mb-8 group-hover:glow-subtle transition-all duration-700">
              <r.icon className="w-5 h-5 text-gold/70" strokeWidth={1.2} />
            </div>
            <h3 className="font-display text-xl mb-4 tracking-wide">{r.title}</h3>
            <p className="text-[13px] text-muted-foreground font-extralight leading-[2]">{r.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhySection;
