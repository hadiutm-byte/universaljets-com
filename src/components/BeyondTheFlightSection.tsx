import { motion } from "framer-motion";
import { Gem, Car, Utensils, ShieldCheck } from "lucide-react";

const conciergeItems = [
  { icon: Gem, title: "Luxury Concierge", desc: "Hotels, villas, yacht charters, and bespoke experiences arranged alongside your flight." },
  { icon: Car, title: "Ground Transport", desc: "Chauffeured arrivals and departures — armoured, classic, or electric — anywhere in the world." },
  { icon: Utensils, title: "In-Flight Catering", desc: "From dietary-specific menus to Michelin-level service at 40,000 feet." },
  { icon: ShieldCheck, title: "Security & Privacy", desc: "Discreet travel planning with executive protection, NDA protocols, and secure logistics." },
];

const BeyondTheFlightSection = () => (
  <section className="py-24 md:py-32">
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
        className="text-center font-display text-3xl md:text-4xl font-semibold text-foreground mb-4"
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="flex gap-5 rounded-2xl border border-border bg-card p-7 hover:shadow-[0_14px_32px_rgba(0,0,0,0.06)] transition-all duration-300"
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
