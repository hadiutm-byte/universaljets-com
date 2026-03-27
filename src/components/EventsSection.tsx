import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { FadeReveal, StaggerContainer, StaggerItem } from "./ui/ScrollEffects";

import monacoGpImg from "@/assets/events/monaco-gp.jpg";
import cannesImg from "@/assets/events/cannes.jpg";
import davosImg from "@/assets/events/davos.jpg";
import artbaselImg from "@/assets/events/artbasel.jpg";

const events = [
  {
    name: "Monaco Grand Prix",
    date: "May 22–25",
    location: "Monte Carlo",
    description: "The pinnacle of motorsport glamour. VIP paddock access and yacht hospitality.",
    img: monacoGpImg,
  },
  {
    name: "Cannes Film Festival",
    date: "May 13–24",
    location: "Côte d'Azur",
    description: "Red carpet premieres and exclusive after-parties on the French Riviera.",
    img: cannesImg,
  },
  {
    name: "World Economic Forum",
    date: "January 20–24",
    location: "Davos",
    description: "Where global leaders converge. Private transfers from Zürich and Samedan.",
    img: davosImg,
  },
  {
    name: "Art Basel",
    date: "June & December",
    location: "Basel / Miami",
    description: "The world's premier modern art fair. Curated gallery tours and collector events.",
    img: artbaselImg,
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
                className="relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer group"
                onClick={openRicky}
              >
                {/* Background photo */}
                <img
                  src={event.img}
                  alt={event.name}
                  loading="lazy"
                  width={400}
                  height={533}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />

                {/* Gold top accent on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                {/* Date badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[9px] tracking-[0.15em] uppercase text-white/80 font-medium border border-white/10">
                    <Calendar className="w-3 h-3" strokeWidth={1.2} />
                    {event.date}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <h3 className="font-display text-[15px] text-white font-semibold mb-1 group-hover:text-primary transition-colors duration-500">
                    {event.name}
                  </h3>
                  <p className="text-[10px] tracking-[0.15em] uppercase text-white/40 mb-3 font-light">{event.location}</p>
                  <p className="text-[11px] text-white/50 font-light leading-[1.7] mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase text-primary/70 font-medium group-hover:text-primary transition-colors duration-500">
                    Request This Trip
                    <ArrowRight size={10} className="transition-transform duration-500 group-hover:translate-x-1" />
                  </div>
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
