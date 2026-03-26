import { motion } from "framer-motion";
import { Car, Utensils, ShieldCheck, MapPin } from "lucide-react";

const conciergeItems = [
  { icon: MapPin, title: "Concierge Services", desc: "We don't just fly you there — we make sure you arrive. Ground transport, hotel suites, dinner reservations, event access. Your trip is orchestrated, not just booked." },
  { icon: Car, title: "Ground Transport", desc: "Chauffeured arrivals and departures — armoured, classic, or electric — coordinated to your landing time, anywhere in the world." },
  { icon: Utensils, title: "In-Flight Catering", desc: "From dietary-specific menus to Michelin-level service at 40,000 feet. Every detail handled before you board." },
  { icon: ShieldCheck, title: "Security & Privacy", desc: "Discreet travel planning with executive protection, NDA protocols, and secure logistics for high-profile movements." },
];

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

const BeyondTheFlightSection = () => (
  <section className="py-28 md:py-36 lg:py-44">
    <div className="max-w-6xl mx-auto px-6 md:px-10">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-[11px] tracking-[0.3em] uppercase font-medium text-primary mb-4"
      >
        Beyond The Flight
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.05 }}
        className="text-center font-display text-3xl md:text-4xl font-semibold text-foreground mb-4 tracking-[-0.01em]"
      >
        Concierge <em className="text-primary font-display">Services</em>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-center text-muted-foreground text-base max-w-xl mx-auto mb-14"
      >
        Everything surrounding your journey — handled with the same precision as the flight itself.
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {conciergeItems.map((item, i) => (
          <motion.div
            key={item.title}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={itemVariants}
            whileTap={{ scale: 0.98 }}
            className="flex gap-5 rounded-2xl border border-border bg-card p-7 card-cinematic cursor-default"
          >
            <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <item.icon size={22} className="text-primary" strokeWidth={1.4} />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default BeyondTheFlightSection;
