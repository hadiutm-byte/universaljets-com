import { FadeReveal } from "./ui/ScrollEffects";

const partners = [
  "Rolls-Royce", "Bombardier", "Gulfstream", "Embraer",
  "Dassault Aviation", "Textron Aviation", "VistaJet",
  "Jetex", "Universal Aviation", "ExcelAire",
];

const PartnersSection = () => (
  <section className="py-24 md:py-32 relative overflow-hidden">
    <div className="container mx-auto px-8 relative z-10">
      <FadeReveal className="text-center mb-16">
        <p className="text-[11px] tracking-[0.5em] uppercase text-primary mb-6 font-medium">Our Network</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-5">
          Trusted <span className="text-gradient-gold italic">Partners</span>
        </h2>
        <p className="text-[15px] text-muted-foreground font-light leading-[1.9] max-w-md mx-auto">
          Members enjoy exclusive benefits and global privileges through our curated partner network.
        </p>
      </FadeReveal>

      {/* Scrolling logo strip */}
      <div className="relative overflow-hidden py-8">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[hsl(0,0%,97%)] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[hsl(0,0%,97%)] to-transparent z-10" />

        <div className="animate-scroll-logos flex gap-16 items-center whitespace-nowrap">
          {[...partners, ...partners].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-[14px] tracking-[0.3em] uppercase text-foreground/30 font-medium select-none flex-shrink-0 hover:text-primary transition-colors duration-500"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default PartnersSection;