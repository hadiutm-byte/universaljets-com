import { motion } from "framer-motion";
import { Plane, Tag, Package, Star } from "lucide-react";

const services = [
  {
    icon: Plane,
    title: "On-Demand Charter",
    desc: "Instant access to thousands of aircraft worldwide. Fly anywhere, anytime, on your schedule.",
  },
  {
    icon: Tag,
    title: "Empty Legs",
    desc: "Exclusive access to repositioning flights at up to 75% off standard charter rates.",
  },
  {
    icon: Package,
    title: "Cargo & Special Missions",
    desc: "Time-critical cargo, medical evacuations, and bespoke aviation solutions.",
  },
  {
    icon: Star,
    title: "Concierge Services",
    desc: "End-to-end travel curation — from ground transport to luxury accommodations.",
  },
];

const ServicesSection = () => (
  <section id="services" className="section-padding">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4 font-light">What We Do</p>
        <h2 className="text-4xl md:text-5xl font-display font-semibold">
          Our Services
        </h2>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-lg p-8 group hover:glow-subtle transition-all duration-500"
          >
            <s.icon className="w-8 h-8 text-gold mb-6 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.2} />
            <h3 className="font-display text-lg mb-3">{s.title}</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
