import { motion } from "framer-motion";
import { Users, ArrowRight, Plane } from "lucide-react";
import { categoryImages } from "@/lib/aircraftImages";

const fleet = [
  {
    category: "Light Jets",
    passengers: "6–8 pax",
    range: "2,500 nm",
    desc: "Speed and efficiency for regional missions. Ideal for short trips with small groups.",
    examples: "Citation CJ3+  ·  Phenom 300E",
    useCase: "City hops, day trips, weekend getaways",
    image: categoryImages.light,
  },
  {
    category: "Midsize Jets",
    passengers: "8–10 pax",
    range: "3,500 nm",
    desc: "Comfort, range, and performance in balance. Stand-up cabin, full connectivity.",
    examples: "Citation XLS+  ·  Hawker 800XP",
    useCase: "Cross-country, Europe-wide, business",
    image: categoryImages.midsize,
  },
  {
    category: "Super Midsize",
    passengers: "9–12 pax",
    range: "4,500 nm",
    desc: "Extended range with a spacious cabin. Transcontinental capability meets comfort.",
    examples: "Challenger 350  ·  Citation Longitude",
    useCase: "Coast-to-coast, transatlantic positioning",
    image: categoryImages.super_midsize,
  },
  {
    category: "Heavy / Long Range",
    passengers: "12–16 pax",
    range: "7,500 nm",
    desc: "Intercontinental luxury. Boardroom in the sky. Full cabin with bedroom and shower.",
    examples: "Global 6000  ·  Falcon 7X  ·  G650",
    useCase: "Transatlantic, transcontinental, VIP",
    image: categoryImages.heavy,
  },
  {
    category: "Ultra Long Range",
    passengers: "14–19 pax",
    range: "8,000+ nm",
    desc: "Non-stop global capability. The pinnacle of private aviation performance.",
    examples: "Gulfstream G700  ·  Global 7500",
    useCase: "Any two cities on Earth, heads of state",
    image: categoryImages.ultra_long_range,
  },
  {
    category: "Turboprops",
    passengers: "6–9 pax",
    range: "1,800 nm",
    desc: "Versatile short-haul access. Ideal for short runways and regional travel.",
    examples: "Pilatus PC-12  ·  King Air 350",
    useCase: "Regional access, island hops, cargo",
    image: categoryImages.turboprop,
  },
];

const FleetSection = () => (
  <section id="fleet" className="section-padding section-alt relative">
    <div className="container mx-auto px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <p className="text-[11px] tracking-[0.5em] uppercase text-primary mb-6 font-medium">Aircraft Categories</p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-6">
          Access to 7,000+ Aircraft <span className="text-gradient-gold italic">Worldwide</span>
        </h2>
        <p className="text-[14px] md:text-[15px] text-muted-foreground font-light leading-[1.9] max-w-xl mx-auto">
          From light jets to ultra long-range aircraft, we work with vetted operators across Europe, the Middle East, the United States, and beyond.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {fleet.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.7 }}
            className="rounded-2xl border border-border bg-card overflow-hidden group hover:shadow-[0_12px_40px_-12px_hsla(0,0%,0%,0.08)] hover:border-primary/20 transition-all duration-500"
          >
            {/* Aircraft image */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={f.image}
                alt={f.category}
                loading="lazy"
                width={1280}
                height={832}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4">
                <h3 className="font-display text-xl text-white font-semibold drop-shadow-lg">{f.category}</h3>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                <Users size={10} className="text-foreground/60" />
                <span className="text-[9px] tracking-[0.15em] uppercase font-medium text-foreground/70">{f.passengers}</span>
              </div>
            </div>

            {/* Details */}
            <div className="p-6">
              <p className="text-[10px] text-primary tracking-[0.2em] uppercase mb-3 font-medium">{f.range} range</p>
              <p className="text-[13px] text-muted-foreground font-light leading-[1.9] mb-4">{f.desc}</p>
              <p className="text-[11px] text-foreground/50 font-light mb-1 italic">{f.useCase}</p>
              <p className="text-[10px] text-muted-foreground/60 font-light mb-5">{f.examples}</p>
              <div className="pt-4 border-t border-border">
                <a href="#cta" className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-primary hover:text-primary/80 transition-all duration-500 font-medium group/l">
                  Inquire <ArrowRight size={10} className="group-hover/l:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FleetSection;
