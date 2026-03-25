import { motion } from "framer-motion";
import { Tag, Plane, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const points = [
  { icon: Tag, title: "Up to 75% Savings", desc: "Repositioning flights priced well below standard charter rates." },
  { icon: Plane, title: "Same Aircraft, Same Experience", desc: "Identical jets, crews, and service — just a smarter price." },
  { icon: Clock, title: "Limited Availability", desc: "Empty legs are time-sensitive. Act fast to secure the best deals." },
];

const EmptyLegsSection = () => (
  <section className="section-padding relative">
    <div className="container mx-auto px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Empty Legs</p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground">
          Fly Private for <span className="text-gradient-gold italic">Less</span>
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto mb-14">
        {points.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.7 }}
            className="text-center group"
          >
            <div className="w-14 h-14 rounded-full luxury-border flex items-center justify-center mx-auto mb-6 group-hover:glow-subtle transition-all duration-700">
              <p.icon className="w-5 h-5 text-primary/60" strokeWidth={1.2} />
            </div>
            <h3 className="font-display text-base mb-3 text-foreground">{p.title}</h3>
            <p className="text-[11px] text-foreground/35 font-extralight leading-[1.9]">{p.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <a
          href="#cta"
          className="inline-block px-12 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm transition-all duration-500 hover:shadow-[0_0_40px_-8px_hsla(38,52%,50%,0.5)] hover:scale-[1.02]"
        >
          Browse Empty Legs
        </a>
      </motion.div>
    </div>
  </section>
);

export default EmptyLegsSection;
