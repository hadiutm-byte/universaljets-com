import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { FadeReveal, StaggerContainer, StaggerItem } from "./ui/ScrollEffects";

const events = [
  {
    name: "Monaco Grand Prix",
    date: "May 22–25",
    location: "Monte Carlo",
    description: "The pinnacle of motorsport glamour. VIP paddock access and yacht hospitality.",
  },
  {
    name: "Cannes Film Festival",
    date: "May 13–24",
    location: "Côte d'Azur",
    description: "Red carpet premieres and exclusive after-parties on the French Riviera.",
  },
  {
    name: "World Economic Forum",
    date: "January 20–24",
    location: "Davos",
    description: "Where global leaders converge. Private transfers from Zürich and Samedan.",
  },
  {
    name: "Art Basel",
    date: "June & December",
    location: "Basel / Miami",
    description: "The world's premier modern art fair. Curated gallery tours and collector events.",
  },
  {
    name: "Saudi Season",
    date: "October–March",
    location: "Riyadh",
    description: "Entertainment, culture, and sport in the Kingdom's flagship events programme.",
  },
  {
    name: "Formula 1 Calendar",
    date: "March–December",
    location: "Global",
    description: "Follow the grid from Bahrain to Abu Dhabi with seamless multi-leg coordination.",
  },
  {
    name: "Paris Fashion Week",
    date: "February & September",
    location: "Paris",
    description: "Front row access and private showroom appointments at the world's fashion capital.",
  },
  {
    name: "Dubai World Cup",
    date: "March",
    location: "Dubai",
    description: "The richest horse race day in the world. VIP hospitality and helicopter transfers.",
  },
];

const EventsSection = () => {
  const openRicky = () => document.dispatchEvent(new CustomEvent("open-ricky"));

  return (
    <section className="section-padding relative">
      <div className="container mx-auto px-8 relative z-10">
        <FadeReveal className="text-center mb-16">
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Experiences</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-4">
            Where the World's Elite <span className="text-gradient-gold italic">Gather</span>
          </h2>
          <p className="text-[14px] text-muted-foreground font-light max-w-lg mx-auto leading-relaxed">
            We coordinate private aviation around the world's most exclusive events — from logistics to lifestyle.
          </p>
        </FadeReveal>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {events.map((event) => (
            <StaggerItem key={event.name}>
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative rounded-xl overflow-hidden border border-border/50 bg-card p-6 h-full flex flex-col group cursor-pointer card-elevated"
                onClick={openRicky}
              >
                {/* Gold top accent on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-3.5 h-3.5 text-primary/50" strokeWidth={1.2} />
                  <span className="text-[10px] tracking-[0.2em] uppercase text-primary/60 font-medium">{event.date}</span>
                </div>

                <h3 className="font-display text-[15px] text-foreground font-semibold mb-1 group-hover:text-primary transition-colors duration-500">
                  {event.name}
                </h3>
                <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50 mb-3 font-light">{event.location}</p>

                <p className="text-[12px] text-muted-foreground font-light leading-[1.7] mb-5 flex-1">
                  {event.description}
                </p>

                <div className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase text-primary/60 font-medium group-hover:text-primary transition-colors duration-500">
                  Request This Trip
                  <ArrowRight size={10} className="transition-transform duration-500 group-hover:translate-x-1" />
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default EventsSection;
