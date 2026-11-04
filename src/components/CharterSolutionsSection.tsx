import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, ArrowRight, X } from "lucide-react";
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
  justification: string;
  differentiators: string[];
  aircraft: { name: string; link: string }[];
}

const charterCategories: CharterCategory[] = [
  {
    title: "Leisure",
    tagline: "10,000+ destinations. Zero layovers.",
    slug: "leisure",
    image: leisureImg,
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
    title: "Corporate",
    tagline: "Three cities. One day. Boardroom at 40,000 ft.",
    slug: "corporate",
    image: corporateImg,
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
    title: "Medevac",
    tagline: "ICU-equipped. 24/7 response. Anywhere.",
    slug: "medevac",
    image: medevacImg,
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
    title: "Cargo",
    tagline: "Hazmat-certified. Government-cleared.",
    slug: "cargo",
    image: cargoImg,
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
    title: "Helicopter",
    tagline: "Airport to hotel in minutes, not hours.",
    slug: "helicopter",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441238946/F94ypwks3ADk2wFrxZVnWB/vip-helicopter-transfer-kAGxmTqso7jNsiQQtZLzEv.webp",
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
    title: "Group",
    tagline: "12 to 200+ passengers. Six continents.",
    slug: "group",
    image: groupImg,
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

/* ── Collapsed tile ─────────────────────────────────────── */
const CategoryTile = ({
  cat,
  index,
  onExpand,
}: {
  cat: CharterCategory;
  index: number;
  onExpand: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-30px" }}
    transition={{ delay: index * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    onClick={onExpand}
    className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
  >
    {/* Full-bleed image */}
    <img
      src={cat.image}
      alt={cat.title}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
      loading="lazy"
    />

    {/* Dark cinematic overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-opacity duration-700 group-hover:from-black/70" />

    {/* Hover gold edge glow */}
    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-[inset_0_0_0_1px_hsla(43,85%,58%,0.25)]" />

    {/* Content pinned to bottom */}
    <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 flex flex-col justify-end">
      <p className="text-[9px] tracking-[0.4em] uppercase text-white/40 font-medium mb-2">
        {String(index + 1).padStart(2, "0")}
      </p>
      <h3 className="font-display text-xl md:text-2xl font-semibold text-white mb-1 tracking-[-0.01em]">
        {cat.title}
      </h3>
      <p className="text-[12px] text-white/50 font-light leading-relaxed mb-4 line-clamp-2">
        {cat.tagline}
      </p>

      {/* CTA row */}
      <div className="flex items-center gap-3">
        <Link
          to="/request-flight"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-[9px] tracking-[0.15em] uppercase font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-400"
        >
          <Plane size={11} strokeWidth={1.5} />
          Book
        </Link>
        <span className="text-[9px] tracking-[0.12em] uppercase text-white/30 font-medium group-hover:text-primary/70 transition-colors duration-500">
          Tap to explore →
        </span>
      </div>
    </div>
  </motion.div>
);

/* ── Expanded detail panel ──────────────────────────────── */
const ExpandedPanel = ({
  cat,
  onClose,
}: {
  cat: CharterCategory;
  onClose: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 10 }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    className="col-span-full rounded-2xl overflow-hidden relative"
  >
    {/* Hero banner */}
    <div className="relative h-64 md:h-80 overflow-hidden">
      <img
        src={cat.image}
        alt={cat.title}
        loading="lazy"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(0,0%,6%)] via-black/50 to-black/20" />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
      >
        <X size={18} />
      </button>

      {/* Title overlay */}
      <div className="absolute bottom-8 left-6 md:left-10">
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/80 font-medium mb-2">
          {cat.title}
        </p>
        <h3 className="font-display text-3xl md:text-4xl font-semibold text-white tracking-[-0.01em]">
          {cat.tagline}
        </h3>
      </div>
    </div>

    {/* Content on dark charcoal */}
    <div className="bg-[hsl(0,0%,6%)] px-6 md:px-10 py-10 md:py-12">
      {/* Justification */}
      <div className="mb-10 max-w-3xl">
        <p className="text-[9px] tracking-[0.35em] uppercase text-primary/60 font-medium mb-3">
          The Advantage
        </p>
        <p className="text-white/55 text-sm md:text-[15px] leading-[1.85] font-light">
          {cat.justification}
        </p>
      </div>

      {/* Differentiators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-10">
        {cat.differentiators.map((diff, di) => (
          <div key={di} className="flex items-start gap-3 py-2.5">
            <div className="w-1 h-1 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
            <span className="text-[13px] text-white/40 font-light leading-relaxed">{diff}</span>
          </div>
        ))}
      </div>

      {/* Aircraft */}
      <div className="mb-10">
        <p className="text-[9px] tracking-[0.35em] uppercase text-primary/60 font-medium mb-5">
          Preferred Aircraft
        </p>
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {cat.aircraft.map((ac) => (
            <Link
              key={ac.name}
              to={ac.link}
              onClick={(e) => e.stopPropagation()}
              className="group/ac rounded-xl overflow-hidden hover:shadow-[0_12px_40px_-12px_hsla(43,85%,58%,0.15)] transition-all duration-500"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                <img
                  src={getAircraftImage(ac.name)}
                  alt={ac.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/ac:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3">
                  <p className="font-display text-[11px] font-medium text-white/90 tracking-tight">{ac.name}</p>
                </div>
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
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground text-[10px] tracking-[0.18em] uppercase font-semibold hover:shadow-[0_10px_30px_-8px_hsla(43,85%,58%,0.45)] transition-all duration-400"
        >
          <Plane size={14} strokeWidth={1.5} />
          Request a Flight
        </Link>
        <a
          href="https://wa.me/447888999944"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-white/40 text-[10px] tracking-[0.18em] uppercase font-medium hover:text-white/70 transition-all duration-400"
        >
          Speak to an Advisor
          <ArrowRight size={12} />
        </a>
      </div>
    </div>
  </motion.div>
);

/* ── Main Section ───────────────────────────────────────── */
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

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
          <AnimatePresence mode="wait">
            {expanded ? (
              <ExpandedPanel
                key={expanded}
                cat={charterCategories.find((c) => c.slug === expanded)!}
                onClose={() => setExpanded(null)}
              />
            ) : (
              charterCategories.map((cat, i) => (
                <CategoryTile
                  key={cat.slug}
                  cat={cat}
                  index={i}
                  onExpand={() => setExpanded(cat.slug)}
                />
              ))
            )}
          </AnimatePresence>
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
