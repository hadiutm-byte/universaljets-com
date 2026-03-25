import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plane, Users, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AircraftRequestModal from "@/components/AircraftRequestModal";
import { toast } from "sonner";

interface Aircraft {
  name: string;
  category: string;
  image: string;
  passengers: string;
  range: string;
  description: string;
  missions: string[];
}

const categories = ["All", "Light Jet", "Midsize", "Super Midsize", "Heavy Jet", "Ultra Long Range", "VIP Airliner"];

const aircraft: Aircraft[] = [
  {
    name: "Cessna Citation CJ4",
    category: "Light Jet",
    image: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80",
    passengers: "7-9",
    range: "2,165 nm",
    description: "Ideal for short hops and regional travel. Perfect for executives needing speed and efficiency on routes under 3 hours.",
    missions: ["City hops", "Day trips", "Regional business"],
  },
  {
    name: "Cessna Citation XLS+",
    category: "Midsize",
    image: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=800&q=80",
    passengers: "8-9",
    range: "2,100 nm",
    description: "The workhorse of private aviation. Stand-up cabin, excellent baggage capacity, and coast-to-coast range for the most popular routes.",
    missions: ["Cross-country", "Family travel", "Corporate shuttles"],
  },
  {
    name: "Bombardier Challenger 350",
    category: "Super Midsize",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=800&q=80",
    passengers: "8-10",
    range: "3,200 nm",
    description: "Wide-cabin comfort meets transcontinental range. The Challenger 350 delivers a seamless blend of performance and luxury.",
    missions: ["Transcontinental", "Group travel", "VIP transport"],
  },
  {
    name: "Gulfstream G650ER",
    category: "Ultra Long Range",
    image: "https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=800&q=80",
    passengers: "13-19",
    range: "7,500 nm",
    description: "The pinnacle of private aviation. Fly nonstop between virtually any two cities on earth in a cabin that rivals the finest hotels.",
    missions: ["Intercontinental", "Head-of-state", "Ultra VIP"],
  },
  {
    name: "Dassault Falcon 7X",
    category: "Heavy Jet",
    image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&q=80",
    passengers: "12-16",
    range: "5,950 nm",
    description: "French engineering excellence. The trijet design offers unmatched approach capabilities and access to challenging airports worldwide.",
    missions: ["Long-haul", "Short runways", "Global connectivity"],
  },
  {
    name: "Bombardier Global 7500",
    category: "Ultra Long Range",
    image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80",
    passengers: "17-19",
    range: "7,700 nm",
    description: "Four distinct living spaces. A dedicated crew suite. The Global 7500 redefines what's possible in private aviation.",
    missions: ["Global travel", "Corporate flagship", "Government"],
  },
  {
    name: "Embraer Lineage 1000E",
    category: "VIP Airliner",
    image: "https://images.unsplash.com/photo-1583202075688-881a2e039715?w=800&q=80",
    passengers: "19-50",
    range: "4,600 nm",
    description: "When a jet isn't enough. The Lineage transforms a commercial airframe into an airborne palace for groups, sports teams, and delegations.",
    missions: ["Group charter", "Sports teams", "Diplomatic missions"],
  },
  {
    name: "Embraer Phenom 300E",
    category: "Light Jet",
    image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80",
    passengers: "7-10",
    range: "2,010 nm",
    description: "The best-selling light jet in the world. Exceptional speed, a refined cabin, and the reliability that discerning travelers demand.",
    missions: ["Weekend getaways", "Regional business", "Quick transfers"],
  },
];

const AircraftGuidePage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedAircraft, setSelectedAircraft] = useState("");

  const filtered = activeCategory === "All" ? aircraft : aircraft.filter(a => a.category === activeCategory);

  const handleRequestAircraft = (aircraftName: string) => {
    setSelectedAircraft(aircraftName);
    setRequestModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-16 md:pt-44 md:pb-20">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/70 mb-6 font-light">Aircraft Guide</p>
            <h1 className="text-3xl md:text-5xl font-display font-semibold mb-4">
              Find Your <span className="text-gradient-gold italic">Perfect Aircraft</span>
            </h1>
            <p className="text-[14px] text-muted-foreground font-light leading-[1.8]">
              Access 7,000+ aircraft worldwide. From light jets for quick hops to VIP airliners for global delegations.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-[10px] tracking-[0.15em] uppercase font-medium border transition-all duration-300 ${
                  activeCategory === cat
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/30 bg-card/50 text-muted-foreground/50 hover:border-primary/20 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Aircraft Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filtered.map((ac, i) => (
              <motion.div
                key={ac.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.05 }}
                className="rounded-2xl border border-border/20 bg-card/50 overflow-hidden group hover:border-primary/15 transition-all duration-500"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={ac.image}
                    alt={ac.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-[8px] tracking-[0.2em] uppercase bg-background/70 backdrop-blur-sm text-primary px-2.5 py-1 rounded font-medium">
                    {ac.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-[15px] font-display font-semibold mb-2">{ac.name}</h3>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-primary/50" strokeWidth={1.3} />
                      <span className="text-[10px] text-muted-foreground/60 font-light">{ac.passengers} pax</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-primary/50" strokeWidth={1.3} />
                      <span className="text-[10px] text-muted-foreground/60 font-light">{ac.range}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground/50 font-light leading-[1.8] mb-4 line-clamp-3">
                    {ac.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {ac.missions.map((m) => (
                      <span key={m} className="text-[8px] tracking-[0.1em] uppercase bg-secondary/50 text-muted-foreground/50 px-2 py-0.5 rounded font-light">
                        {m}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRequestAircraft(ac.name)}
                      className="flex-1 py-2.5 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.2em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(45,79%,46%,0.4)] transition-all duration-500"
                    >
                      Request This Aircraft
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="text-center mt-16"
          >
            <p className="text-[13px] text-muted-foreground/50 font-light mb-4">
              Can't find what you're looking for? We have access to 7,000+ aircraft.
            </p>
            <Link
              to="/#cta"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl hover:shadow-[0_0_40px_-8px_hsla(45,79%,46%,0.5)] transition-all duration-500"
            >
              <Plane className="w-3.5 h-3.5" strokeWidth={1.3} />
              Speak to an Advisor
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
      <AircraftRequestModal open={requestModalOpen} onOpenChange={setRequestModalOpen} aircraftName={selectedAircraft} />
    </div>
  );
};

export default AircraftGuidePage;
