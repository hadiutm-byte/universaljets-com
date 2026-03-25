import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const events = [
  { name: "Monaco Grand Prix", period: "May 2026" },
  { name: "Cannes Film Festival", period: "May 2026" },
  { name: "Art Basel", period: "Jun 2026" },
  { name: "Davos (WEF)", period: "Jan 2027" },
  { name: "Fashion Weeks", period: "Sep–Oct 2026" },
  { name: "World Cup 2026", period: "Jun–Jul 2026" },
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
        className="text-center mb-20"
      >
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Events</p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground">
          Fly for the Moments That <span className="text-gradient-gold italic">Matter</span>
        </h2>
        <p className="text-[12px] text-foreground/35 font-extralight leading-[2] max-w-md mx-auto mt-5">
          High-demand periods — early booking recommended.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {events.map((ev, i) => (
          <motion.a
            key={ev.name}
            href="#cta"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.6 }}
            className="flex items-center gap-4 p-5 rounded-xl border border-border/8 bg-card/10 hover:border-primary/15 transition-all duration-500 group"
          >
            <Calendar className="w-4 h-4 text-primary/40 flex-shrink-0" strokeWidth={1.2} />
            <div>
              <h3 className="font-display text-sm text-foreground group-hover:text-primary/80 transition-colors">{ev.name}</h3>
              <p className="text-[10px] text-foreground/25 font-extralight mt-0.5">{ev.period}</p>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

export default EventsSection;
