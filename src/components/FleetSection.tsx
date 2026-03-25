import { motion } from "framer-motion";
import { Users, ArrowRight } from "lucide-react";

const fleet = [
  { category: "Light Jets", passengers: "6–8 pax", range: "2,500 nm", desc: "Speed and efficiency for regional missions.", examples: "Citation CJ3+  ·  Phenom 300E" },
  { category: "Midsize Jets", passengers: "8–10 pax", range: "3,500 nm", desc: "Comfort, range, and performance in balance.", examples: "Citation XLS+  ·  Hawker 800XP" },
  { category: "Long Range", passengers: "12–16 pax", range: "7,500 nm", desc: "Intercontinental luxury. Boardroom in the sky.", examples: "Global 6000  ·  Falcon 7X" },
];

const FleetSection = () => (
  <section id="fleet" className="section-padding relative">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4%)] to-transparent pointer-events-none" />

    <div className="container mx-auto px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-28"
      >
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Aircraft Categories</p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground">Our Fleet</h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {fleet.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.7 }}
            className="glass rounded-xl p-10 group hover:glow-subtle transition-all duration-700 flex flex-col"
          >
            <div className="flex items-center gap-2 text-primary/50 mb-8">
              <Users size={12} strokeWidth={1.5} />
              <span className="text-[9px] tracking-[0.3em] uppercase font-light">{f.passengers}</span>
            </div>
            <h3 className="font-display text-2xl mb-2 text-foreground">{f.category}</h3>
            <p className="text-[9px] text-foreground/35 tracking-[0.2em] uppercase mb-6">{f.range}</p>
            <p className="text-[12px] text-foreground/40 font-extralight leading-[2] mb-8 flex-1">{f.desc}</p>
            <p className="text-[10px] text-primary/25 font-extralight mb-8">{f.examples}</p>
            <div className="pt-6 border-t border-border">
              <a href="#cta" className="inline-flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase text-primary/50 hover:text-primary transition-all duration-500 group/l">
                Inquire <ArrowRight size={10} className="group-hover/l:translate-x-1 transition-transform duration-300" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FleetSection;
