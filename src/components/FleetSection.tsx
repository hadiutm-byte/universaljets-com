import { motion } from "framer-motion";
import { Users, ArrowRight } from "lucide-react";

const fleet = [
  {
    category: "Light Jets",
    passengers: "6–8 passengers",
    range: "Up to 2,500 nm",
    desc: "Ideal for short-haul trips with speed and efficiency.",
    examples: "Citation CJ3+, Phenom 300E",
  },
  {
    category: "Midsize Jets",
    passengers: "8–10 passengers",
    range: "Up to 3,500 nm",
    desc: "The perfect balance of comfort, range, and performance.",
    examples: "Citation XLS+, Hawker 800XP",
  },
  {
    category: "Long Range Jets",
    passengers: "12–16 passengers",
    range: "Up to 7,500 nm",
    desc: "Intercontinental capability with full cabin luxury.",
    examples: "Global 6000, Falcon 7X",
  },
];

const FleetSection = () => (
  <section id="fleet" className="section-padding">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4 font-light">Aircraft Categories</p>
        <h2 className="text-4xl md:text-5xl font-display font-semibold">Our Fleet</h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {fleet.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="glass rounded-lg p-8 group hover:glow-subtle transition-all duration-500 flex flex-col"
          >
            <div className="flex items-center gap-2 text-gold mb-6">
              <Users size={16} strokeWidth={1.5} />
              <span className="text-xs tracking-wider uppercase font-light">{f.passengers}</span>
            </div>
            <h3 className="font-display text-2xl mb-2">{f.category}</h3>
            <p className="text-xs text-muted-foreground tracking-wider uppercase mb-4">{f.range}</p>
            <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6 flex-1">{f.desc}</p>
            <p className="text-xs text-gold/70 font-light">{f.examples}</p>
            <div className="mt-6 pt-6 border-t border-border">
              <a href="#cta" className="inline-flex items-center gap-2 text-xs tracking-wider uppercase text-gold hover:text-gold-light transition-colors group/link">
                Inquire <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FleetSection;
