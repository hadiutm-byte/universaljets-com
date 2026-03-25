import { motion } from "framer-motion";
import { Users, ArrowRight } from "lucide-react";

const fleet = [
  {
    category: "Light Jets",
    passengers: "6–8 passengers",
    range: "Up to 2,500 nm",
    desc: "Speed and efficiency for short-haul missions. Ideal for regional travel.",
    examples: "Citation CJ3+  ·  Phenom 300E",
  },
  {
    category: "Midsize Jets",
    passengers: "8–10 passengers",
    range: "Up to 3,500 nm",
    desc: "The perfect balance of cabin comfort, range, and performance.",
    examples: "Citation XLS+  ·  Hawker 800XP",
  },
  {
    category: "Long Range",
    passengers: "12–16 passengers",
    range: "Up to 7,500 nm",
    desc: "Intercontinental range with full cabin luxury. Boardroom in the sky.",
    examples: "Global 6000  ·  Falcon 7X",
  },
];

const FleetSection = () => (
  <section id="fleet" className="section-padding">
    <div className="container mx-auto px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-24"
      >
        <p className="text-[10px] tracking-[0.4em] uppercase text-gold mb-6 font-light">Aircraft Categories</p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold">Our Fleet</h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {fleet.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.7 }}
            className="glass rounded-lg p-10 group hover:glow-subtle transition-all duration-700 flex flex-col"
          >
            <div className="flex items-center gap-2 text-gold mb-8">
              <Users size={14} strokeWidth={1.5} />
              <span className="text-[10px] tracking-[0.3em] uppercase font-light">{f.passengers}</span>
            </div>
            <h3 className="font-display text-2xl mb-2">{f.category}</h3>
            <p className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase mb-6">{f.range}</p>
            <p className="text-[13px] text-muted-foreground font-extralight leading-[1.9] mb-8 flex-1">{f.desc}</p>
            <p className="text-[11px] text-gold/50 font-extralight tracking-wide mb-8">{f.examples}</p>
            <div className="pt-6 border-t border-border">
              <a href="#cta" className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-gold hover:text-gold-light transition-all duration-500 group/link">
                Inquire <ArrowRight size={12} className="group-hover/link:translate-x-1.5 transition-transform duration-300" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FleetSection;
