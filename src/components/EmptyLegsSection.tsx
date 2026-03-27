import { motion } from "framer-motion";
import { Tag, Plane, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const points = [
  { icon: Tag, title: "Significant Savings", desc: "Repositioning flights priced well below standard charter rates — same service, smarter pricing." },
  { icon: Plane, title: "Same Aircraft, Same Experience", desc: "Identical jets, crews, and service — simply a more efficient way to fly privately." },
  { icon: Clock, title: "Limited Availability", desc: "Empty legs are time-sensitive. Speak to your advisor to secure the best opportunities." },
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
          Fly Private, <span className="text-gradient-gold italic">Fly Smarter</span>
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
            <p className="text-[11px] text-muted-foreground font-light leading-[1.9]">{p.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Link
          to="/#empty-legs"
          className="inline-block px-12 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-xl transition-all duration-500 hover:shadow-[0_0_40px_-8px_hsla(43,85%,58%,0.5)] hover:scale-[1.02]"
        >
          Browse Empty Legs
        </Link>
      </motion.div>
    </div>
  </section>
);

export default EmptyLegsSection;
