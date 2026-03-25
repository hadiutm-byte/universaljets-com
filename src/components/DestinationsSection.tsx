import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { FadeReveal, StaggerContainer, StaggerItem, GlassCard, FloatingElement } from "./ui/ScrollEffects";

const destinations = [
  { name: "Dubai", desc: "Global business hub" },
  { name: "Riyadh", desc: "Power and government travel" },
  { name: "London", desc: "Financial capital" },
  { name: "Geneva", desc: "Private banking and wealth" },
  { name: "Nice / Monaco", desc: "Mediterranean elite access" },
  { name: "Maldives", desc: "Ultra-luxury escape" },
  { name: "Mykonos", desc: "Summer lifestyle" },
  { name: "Ibiza", desc: "Entertainment and nightlife" },
  { name: "St. Moritz", desc: "Winter exclusivity" },
  { name: "New York", desc: "Corporate and private travel" },
  { name: "Los Angeles", desc: "Entertainment industry" },
  { name: "Paris", desc: "Fashion and luxury" },
];

const DestinationsSection = () => (
  <section className="section-padding relative">
    <div className="container mx-auto px-8 relative z-10">
      <FadeReveal className="text-center mb-16">
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Destinations</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground">
          Where the World <span className="text-gradient-gold italic">Flies</span>
        </h2>
      </FadeReveal>

      <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {destinations.map((d, i) => (
          <StaggerItem key={d.name}>
            <GlassCard breathe className="text-center py-6 px-4 h-full">
              <FloatingElement amplitude={5} speed={4 + (i % 3)}>
                <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-4 h-4 text-primary/50" strokeWidth={1.2} />
                </div>
              </FloatingElement>
              <h3 className="font-display text-sm text-foreground mb-1">{d.name}</h3>
              <p className="text-[10px] text-foreground/30 font-extralight">{d.desc}</p>
            </GlassCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  </section>
);

export default DestinationsSection;
