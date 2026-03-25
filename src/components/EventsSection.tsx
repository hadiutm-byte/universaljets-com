import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const events = [
  "Monaco Grand Prix",
  "Cannes Film Festival",
  "World Economic Forum – Davos",
  "Art Basel – Miami / Basel",
  "Formula 1 Global Calendar",
  "Paris Fashion Week",
  "Milan Fashion Week",
  "Saudi Season – Riyadh",
  "St. Moritz Winter Season",
  "Dubai World Cup",
  "Wimbledon",
  "Oscars – Los Angeles",
];

const EventsSection = () => (
  <section className="section-padding relative">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4.5%)] to-transparent pointer-events-none" />

    <div className="container mx-auto px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Events</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground">
          Where the World's Elite <span className="text-gradient-gold italic">Gather</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {events.map((name, i) => (
          <motion.a
            key={name}
            href="#cta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.6 }}
            className="flex items-center gap-3 p-4 rounded-xl border border-border/8 bg-card/10 hover:border-primary/15 hover:bg-card/15 transition-all duration-500 group"
          >
            <Calendar className="w-3.5 h-3.5 text-primary/40 flex-shrink-0" strokeWidth={1.2} />
            <span className="font-display text-[12px] md:text-[13px] text-foreground/60 group-hover:text-foreground/80 transition-colors">
              {name}
            </span>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

export default EventsSection;
