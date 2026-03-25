import { motion } from "framer-motion";
import { Globe, TrendingDown, Headphones, Settings } from "lucide-react";

const reasons = [
  {
    icon: Globe,
    title: "Global Fleet Access",
    desc: "Instant access to 5,000+ vetted aircraft across six continents. Any aircraft, any airport, any time.",
  },
  {
    icon: TrendingDown,
    title: "Better Pricing",
    desc: "Real-time market intelligence ensures you never overpay. We negotiate directly with operators worldwide.",
  },
  {
    icon: Headphones,
    title: "24/7 Expert Advisory",
    desc: "Dedicated aviation advisors available around the clock. One call is all it takes.",
  },
  {
    icon: Settings,
    title: "Tailored Solutions",
    desc: "Every mission is unique. We engineer bespoke flight solutions around your exact requirements.",
  },
];

const WhySection = () => (
  <section id="why" className="section-padding">
    <div className="container mx-auto px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-24"
      >
        <p className="text-[10px] tracking-[0.4em] uppercase text-gold mb-6 font-light">The Difference</p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold leading-tight">
          Why Universal Jets
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-x-12 gap-y-16 max-w-4xl mx-auto">
        {reasons.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.7 }}
            className="group"
          >
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-14 h-14 rounded-full luxury-border flex items-center justify-center group-hover:glow-subtle transition-all duration-700">
                <r.icon className="w-5 h-5 text-gold" strokeWidth={1.2} />
              </div>
              <div>
                <h3 className="font-display text-xl mb-3 tracking-wide">{r.title}</h3>
                <p className="text-sm text-muted-foreground font-extralight leading-[1.9]">{r.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhySection;
