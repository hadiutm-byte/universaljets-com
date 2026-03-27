import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, ArrowRight, ChevronDown, Shield, Clock, Globe, X } from "lucide-react";
import { Link } from "react-router-dom";
import { getAircraftImage } from "@/lib/aircraftImages";
import leisureImg from "@/assets/charter/leisure-charter.jpg";
import corporateImg from "@/assets/charter/corporate-charter.jpg";
import medevacImg from "@/assets/charter/medevac-charter.jpg";
import cargoImg from "@/assets/charter/cargo-charter.jpg";
import groupImg from "@/assets/charter/group-charter.jpg";

interface CharterCategory {
  title: string;
  tagline: string;
  slug: string;
  image: string;
  icon: typeof Plane;
  justification: string;
  differentiators: string[];
  aircraft: { name: string; link: string }[];
}

const charterCategories: CharterCategory[] = [
  {
    title: "Leisure Charter",
    tagline: "10,000+ destinations. Zero layovers.",
    slug: "leisure",
    image: leisureImg,
    icon: Globe,
    justification:
      "Operators sell their own fleet — we source from 7,000+ aircraft globally to find the right jet at the right price for your trip. That means better availability, better positioning, and no hidden fees from fleet-tied operators trying to fill their own planes.",
    differentiators: [
      "Access every aircraft on the market, not just one fleet",
      "Competitive pricing through multi-operator sourcing",
      "24/7 concierge for dining, hotels, and ground transport",
      "18+ years arranging leisure charters worldwide",
    ],
    aircraft: [
      { name: "Bombardier Challenger 350", link: "/fleet" },
      { name: "Gulfstream G550", link: "/fleet" },
      { name: "Global 7500", link: "/fleet" },
    ],
  },
  {
    title: "Corporate Solutions",
    tagline: "Three cities. One day. Boardroom at 40,000 ft.",
    slug: "corporate",
    image: corporateImg,
    icon: Shield,
    justification:
      "Corporate operators lock you into their fleet and schedule. We match the right aircraft to each leg of your trip — light jet for a 90-minute hop, heavy jet for the transatlantic — saving you up to 40% versus booking everything on a single operator's largest plane.",
    differentiators: [
      "Multi-leg itineraries optimized per segment",
      "NDA-grade confidentiality from cabin door",
      "Dedicated account manager for recurring programs",
      "Invoice consolidation and corporate billing",
    ],
    aircraft: [
      { name: "Embraer Praetor 600", link: "/fleet" },
      { name: "Bombardier Challenger 650", link: "/fleet" },
      { name: "Gulfstream G650ER", link: "/fleet" },
    ],
  },
  {
    title: "Medical Evacuations",
    tagline: "ICU-equipped. 24/7 response. Anywhere.",
    slug: "medevac",
    image: medevacImg,
    icon: Clock,
    justification:
      "In a medical emergency, operators quote from their own fleet — which may not be ICU-configured or in the right location. We source air ambulance aircraft globally with stretcher configurations, medical crews, and conflict-zone clearances that single operators simply cannot match.",
    differentiators: [
      "Bed-to-bed transfer coordination worldwide",
      "ICU stretcher and medical crew sourcing",
      "Overflight and conflict-zone permit handling",
      "Response within 2 hours, departure within 6",
    ],
    aircraft: [
      { name: "Learjet 35A Air Ambulance", link: "/fleet" },
      { name: "Challenger 604 ICU", link: "/fleet" },
      { name: "King Air 350 Medevac", link: "/fleet" },
    ],
  },
  {
    title: "Cargo & Special Missions",
    tagline: "Hazmat-certified. Government-cleared.",
    slug: "cargo",
    image: cargoImg,
    icon: Plane,
    justification:
      "Cargo operators specialize in standard freight. We handle what they won't — hazardous materials, oversized machinery, classified government shipments, and humanitarian aid into disaster zones. Full customs, permits, and compliance managed end-to-end.",
    differentiators: [
      "Hazmat and oversized freight specialists",
      "Customs and compliance handled before departure",
      "Government and NGO mission experience",
      "Global freight aircraft sourcing across all categories",
    ],
    aircraft: [
      { name: "Boeing 737-800 Freighter", link: "/fleet" },
      { name: "Antonov AN-12 Cargo", link: "/fleet" },
      { name: "Boeing 747 Cargo", link: "/fleet" },
    ],
  },
  {
    title: "VIP Helicopter Transfers",
    tagline: "Airport to hotel in minutes, not hours.",
    slug: "helicopter",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441238946/F94ypwks3ADk2wFrxZVnWB/vip-helicopter-transfer-kAGxmTqso7jNsiQQtZLzEv.webp",
    icon: Globe,
    justification:
      "Helicopter operators run fixed routes and schedules. We arrange bespoke point-to-point transfers — yacht to shore, airport to city center, event arrivals — with VIP-configured rotorcraft, noise-reduced cabins, and precision timing that scheduled services can't offer.",
    differentiators: [
      "Bespoke point-to-point routing, not fixed schedules",
      "VIP interiors with noise-reduced cabins",
      "Yacht, event, and airport transfer coordination",
      "Premium rotorcraft sourced across the region",
    ],
    aircraft: [
      { name: "Airbus H145", link: "/fleet" },
      { name: "AgustaWestland AW139", link: "/fleet" },
      { name: "Sikorsky S-76", link: "/fleet" },
    ],
  },
  {
    title: "Group Charter",
    tagline: "12 to 200+ passengers. Six continents.",
    slug: "group",
    image: groupImg,
    icon: Shield,
    justification:
      "Airlines sell seats — we sell solutions. Sports teams, corporate delegations, concert tours, and pilgrimages require coordinated scheduling, ground handling, and catering that commercial carriers can't customize. We've moved 50,000+ passengers including FIFA World Cup 2022.",
    differentiators: [
      "50,000+ group passengers moved globally",
      "FIFA World Cup 2022 logistics partner",
      "Full ground handling and catering coordination",
      "VIP airliners configured for team and group travel",
    ],
    aircraft: [
      { name: "Boeing BBJ VIP Airliner", link: "/fleet" },
      { name: "Airbus ACJ320neo", link: "/fleet" },
      { name: "Boeing 767 VIP", link: "/fleet" },
    ],
  },
];

const CharterSolutionsSection = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="py-28 md:py-36 lg:py-44">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center text-[10px] tracking-[0.5em] uppercase font-medium text-primary mb-5"
        >
          Charter Solutions
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05, duration: 0.9 }}
          className="text-center font-display text-4xl md:text-5xl font-semibold text-foreground mb-5 tracking-[-0.01em]"
        >
          Every Mission. <em className="text-primary font-display">One Standard.</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-16"
        >
          Six disciplines. One promise. Wherever you need to be.
        </motion.p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {charterCategories.map((cat, i) => {
            const isExpanded = expanded === cat.slug;

            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                layout
                className={`group relative rounded-xl overflow-hidden transition-all duration-500 ${
                  isExpanded
                    ? "sm:col-span-2 lg:col-span-3 bg-card/95 backdrop-blur-xl border border-primary/20 shadow-[0_0_60px_-15px_hsl(var(--primary)/0.15)]"
                    : "bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] cursor-pointer"
                }`}
                onClick={() => !isExpanded && setExpanded(cat.slug)}
              >
                {/* Collapsed card */}
                {!isExpanded && (
                  <>
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

                      {/* Floating number */}
                      <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20 flex items-center justify-center">
                        <span className="text-[11px] font-display font-semibold text-primary">{String(i + 1).padStart(2, "0")}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-display text-lg font-semibold text-foreground mb-1.5 tracking-[-0.01em]">
                        {cat.title}
                      </h3>
                      <p className="text-[13px] text-muted-foreground font-light leading-relaxed mb-5">
                        {cat.tagline}
                      </p>

                      <div className="flex items-center justify-between">
                        <Link
                          to="/request-flight"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-[10px] tracking-[0.12em] uppercase font-semibold hover:bg-primary/90 transition-all duration-300 hover:shadow-[0_4px_20px_hsl(var(--primary)/0.3)]"
                        >
                          Request a Flight
                        </Link>
                        <button
                          className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.12em] uppercase font-medium text-foreground/50 hover:text-primary transition-colors"
                        >
                          Explore <ChevronDown size={12} />
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Expanded detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="relative"
                    >
                      {/* Close button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); setExpanded(null); }}
                        className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-foreground/10 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-foreground/20 transition-all"
                      >
                        <X size={16} />
                      </button>

                      {/* Hero banner */}
                      <div className="relative h-56 md:h-72 overflow-hidden">
                        <img
                          src={cat.image}
                          alt={cat.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                        <div className="absolute bottom-6 left-6 md:left-10">
                          <p className="text-[10px] tracking-[0.4em] uppercase text-primary font-medium mb-2">
                            {cat.title}
                          </p>
                          <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground tracking-[-0.01em]">
                            {cat.tagline}
                          </h3>
                        </div>
                      </div>

                      {/* Content area */}
                      <div className="px-6 md:px-10 py-8 md:py-10">
                        {/* Why us section */}
                        <div className="mb-10">
                          <p className="text-[10px] tracking-[0.3em] uppercase text-primary/70 font-medium mb-3">
                            The Advantage
                          </p>
                          <p className="text-foreground/70 text-sm md:text-base leading-relaxed max-w-3xl font-light">
                            {cat.justification}
                          </p>
                        </div>

                        {/* Differentiators */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
                          {cat.differentiators.map((diff, di) => (
                            <div key={di} className="flex items-start gap-3 p-3 rounded-lg bg-foreground/[0.03] border border-border/30">
                              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <ArrowRight size={10} className="text-primary" />
                              </div>
                              <span className="text-[13px] text-foreground/60 font-light leading-relaxed">{diff}</span>
                            </div>
                          ))}
                        </div>

                        {/* Aircraft grid */}
                        <div className="mb-10">
                          <p className="text-[10px] tracking-[0.3em] uppercase text-primary/70 font-medium mb-4">
                            Preferred Aircraft
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {cat.aircraft.map((ac) => (
                              <Link
                                key={ac.name}
                                to={ac.link}
                                onClick={(e) => e.stopPropagation()}
                                className="group/ac rounded-xl overflow-hidden border border-border/40 bg-card/50 hover:border-primary/30 hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.2)] transition-all duration-500"
                              >
                                <div className="relative h-28 md:h-32 overflow-hidden">
                                  <img
                                    src={getAircraftImage(ac.name)}
                                    alt={ac.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover/ac:scale-105"
                                    loading="lazy"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                                </div>
                                <div className="p-3 text-center">
                                  <p className="font-display text-[12px] font-medium text-foreground tracking-tight">{ac.name}</p>
                                  <p className="text-[9px] tracking-[0.1em] uppercase text-primary/60 mt-1">Explore →</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-4">
                          <Link
                            to="/request-flight"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground text-[11px] tracking-[0.15em] uppercase font-semibold hover:bg-primary/90 transition-all duration-300 shadow-[0_8px_24px_hsl(var(--primary)/0.25)] hover:shadow-[0_12px_36px_hsl(var(--primary)/0.35)]"
                          >
                            <Plane size={14} strokeWidth={1.5} />
                            Request a Flight
                          </Link>
                          <a
                            href="https://wa.me/447888999944"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-border/50 text-foreground/60 text-[11px] tracking-[0.15em] uppercase font-medium hover:text-foreground hover:border-primary/40 transition-all duration-300"
                          >
                            Speak to an Advisor
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Core message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-20 md:mt-28 max-w-3xl mx-auto text-center"
        >
          <p className="text-[11px] tracking-[0.3em] uppercase font-medium text-primary mb-4">
            The Standard
          </p>
          <h3 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
            Global Access. Uncompromised.
          </h3>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
            Universal Jets sources from 7,000+ vetted aircraft across six continents — every operator
            verified through ARGUS and Wyvern before they reach your itinerary.
          </p>
          <Link
            to="/request-flight"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground text-[12px] tracking-[0.15em] uppercase font-semibold hover:bg-primary/90 transition-colors shadow-[0_8px_24px_hsl(var(--primary)/0.25)]"
          >
            <Plane size={16} strokeWidth={1.5} />
            Request a Flight
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CharterSolutionsSection;
