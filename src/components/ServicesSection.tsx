import { motion } from "framer-motion";
import { Plane, Tag, Package, Star } from "lucide-react";

const services = [
  {
    icon: Plane,
    title: "On-Demand Charter",
    desc: "Any aircraft, anywhere in the world. Fly on your schedule with guaranteed availability.",
  },
  {
    icon: Tag,
    title: "Empty Legs",
    desc: "Exclusive access to repositioning flights at up to 75% below standard charter rates.",
  },
  {
    icon: Package,
    title: "Cargo & Special Missions",
    desc: "Time-critical freight, medical evacuations, and bespoke aviation solutions.",
  },
  {
    icon: Star,
    title: "Concierge",
    desc: "End-to-end travel curation — ground transport, accommodations, and VIP services.",
  },
];

const ServicesSection = () => (
  <section id="services" className="section-padding">
    <div className="container mx-auto px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-24"
      >
        <p className="text-[10px] tracking-[0.4em] uppercase text-gold mb-6 font-light">What We Do</p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold">Our Services</h2>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {services.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.7 }}
            className="group text-center p-8"
          >
            <div className="w-16 h-16 rounded-full luxury-border flex items-center justify-center mx-auto mb-8 group-hover:glow-subtle transition-all duration-700">
              <s.icon className="w-6 h-6 text-gold" strokeWidth={1.2} />
            </div>
            <h3 className="font-display text-lg mb-4 tracking-wide">{s.title}</h3>
            <p className="text-[13px] text-muted-foreground font-extralight leading-[1.9]">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
