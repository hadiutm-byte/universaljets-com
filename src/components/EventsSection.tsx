import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { FadeReveal, StaggerContainer, StaggerItem } from "./ui/ScrollEffects";

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
    <div className="container mx-auto px-8 relative z-10">
      <FadeReveal className="text-center mb-16">
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Events</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground">
          Where the World's Elite <span className="text-gradient-gold italic">Gather</span>
        </h2>
      </FadeReveal>

      <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {events.map((name) => (
          <StaggerItem key={name}>
            <motion.a
              href="#cta"
              whileHover={{ scale: 1.04, y: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center gap-3 p-4 rounded-xl glass-panel hover:border-primary/15 transition-all duration-500 group block"
            >
              <Calendar className="w-3.5 h-3.5 text-primary/50 flex-shrink-0" strokeWidth={1.2} />
              <span className="font-display text-[12px] md:text-[13px] text-foreground/70 group-hover:text-foreground transition-colors">
                {name}
              </span>
            </motion.a>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  </section>
);

export default EventsSection;
