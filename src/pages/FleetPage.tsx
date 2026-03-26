import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import FleetAircraftCard from "@/components/fleet/FleetAircraftCard";
import FleetDetailModal from "@/components/fleet/FleetDetailModal";
import QuoteRequestModal from "@/components/QuoteRequestModal";
import { useAircraftTypes, type AircraftType } from "@/hooks/useAviapages";
import { Loader2 } from "lucide-react";

/** Categories to show — ordered by ascending size. Excludes propellers/turboprops. */
const JET_CATEGORIES = [
  { label: "All Jets", classId: "" },
  { label: "Light Jets", classId: "12" },
  { label: "Midsize Jets", classId: "7" },
  { label: "Super Midsize", classId: "1" },
  { label: "Heavy / Long Range", classId: "6" },
  { label: "Ultra Long Range", classId: "13" },
];

/** Class IDs & keywords to exclude non-jet aircraft (propellers + helicopters) */
const EXCLUDED_CLASS_IDS = ["3", "4", "5", "9", "10", "11"];
const EXCLUDED_KEYWORDS = /turbo\s*prop|piston|propeller|king\s*air|pilatus|pc-?12|beech|tbm|dornier|atr|saab|dash|caravan|piaggio|helicopter|heli|rotary|rotor|ec135|ec145|ec155|ec175|h125|h130|h135|h145|h155|h160|h175|h215|h225|aw109|aw119|aw139|aw169|aw189|bell\s*\d|s-?76|s-?92|sikorsky|eurocopter|airbus\s*heli/i;

function isJetAircraft(ac: AircraftType): boolean {
  if (ac.class_id && EXCLUDED_CLASS_IDS.includes(String(ac.class_id))) return false;
  if (EXCLUDED_KEYWORDS.test(ac.name)) return false;
  if (ac.class_name && (EXCLUDED_KEYWORDS.test(ac.class_name) || /helicopter/i.test(ac.class_name))) return false;
  if (ac.engine_type && /piston|turboprop/i.test(ac.engine_type)) return false;
  return true;
}

const FleetPage = () => {
  const [activeCategory, setActiveCategory] = useState("");
  const [selectedAircraft, setSelectedAircraft] = useState<AircraftType | null>(null);
  const [quoteAircraft, setQuoteAircraft] = useState<AircraftType | null>(null);

  // Fetch a large set — API supports page_size
  const { data, isLoading } = useAircraftTypes(undefined, activeCategory || undefined);

  const filteredAircraft = useMemo(() => {
    if (!data?.results) return [];
    return data.results.filter(isJetAircraft);
  }, [data]);

  const handleRequestQuote = (ac: AircraftType) => {
    setSelectedAircraft(null);
    setQuoteAircraft(ac);
  };

  return (
    <>
      <SEOHead
        title="Fleet — Private Jet Aircraft | Universal Jets"
        description="Explore our global fleet of private jet aircraft. Light jets, midsize, heavy, and ultra long-range — full specs, cabin details, and instant quote requests."
        path="/fleet"
      />
      <Navbar />

      <main className="min-h-screen bg-background pt-24 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-6 md:px-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <p className="text-[11px] tracking-[0.5em] uppercase text-primary mb-5 font-medium">Our Fleet</p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-6">
              Aircraft <span className="text-gradient-gold italic">Collection</span>
            </h1>
            <p className="text-[14px] md:text-[15px] text-muted-foreground font-light leading-[1.9] max-w-xl mx-auto">
              Access 7,000+ vetted aircraft worldwide. Every jet in our network is selected for safety, comfort, and performance.
            </p>
          </motion.div>
        </section>

        {/* Category tabs */}
        <section className="container mx-auto px-6 md:px-8 mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {JET_CATEGORIES.map((cat) => (
              <button
                key={cat.classId}
                onClick={() => setActiveCategory(cat.classId)}
                className={`px-5 py-2 rounded-full text-[10px] tracking-[0.2em] uppercase font-medium transition-all duration-300 ${
                  activeCategory === cat.classId
                    ? "bg-selection text-selection-foreground"
                    : "border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Grid */}
        <section className="container mx-auto px-6 md:px-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filteredAircraft.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-muted-foreground text-sm">No aircraft found for this category.</p>
            </div>
          ) : (
            <>
              <p className="text-center text-[11px] text-muted-foreground/50 tracking-wider mb-8">
                {filteredAircraft.length} aircraft{filteredAircraft.length !== 1 ? "" : ""} available
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {filteredAircraft.map((ac, i) => (
                  <FleetAircraftCard
                    key={ac.id}
                    aircraft={ac}
                    index={i}
                    onClick={() => setSelectedAircraft(ac)}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      {/* Detail modal */}
      <FleetDetailModal
        aircraft={selectedAircraft}
        open={!!selectedAircraft}
        onClose={() => setSelectedAircraft(null)}
        onRequestQuote={handleRequestQuote}
      />

      {/* Quote modal */}
      <QuoteRequestModal
        open={!!quoteAircraft}
        onClose={() => setQuoteAircraft(null)}
        flightData={{
          fromLabel: "",
          toLabel: "",
          fromIcao: "",
          toIcao: "",
          aircraft: quoteAircraft?.name,
        }}
      />

      <Footer />
    </>
  );
};

export default FleetPage;
