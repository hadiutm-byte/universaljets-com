import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const charterData: Record<string, { title: string; headline: string; description: string; aircraft: string[] }> = {
  leisure: {
    title: "Leisure Charter",
    headline: "Travel on Your Terms",
    description: "Whether it's a Mediterranean villa, a Caribbean island, or a ski resort in the Alps — your leisure charter is built around your schedule, your preferences, and your privacy. We source the ideal aircraft for families, couples, and groups seeking seamless holiday travel.",
    aircraft: ["Citation XLS", "Learjet 75", "Challenger 350", "Global 7500"],
  },
  corporate: {
    title: "Corporate Charter",
    headline: "Precision for Business",
    description: "Multi-city roadshows, board meetings across borders, and last-minute executive travel — all with total discretion and maximum efficiency. We match the aircraft to the mission, whether that's a light jet for a day trip or an ultra-long-range cabin for transatlantic strategy sessions.",
    aircraft: ["Phenom 300E", "Citation Latitude", "Challenger 650", "Gulfstream G650"],
  },
  group: {
    title: "Group Charter",
    headline: "Move Teams. Seamlessly.",
    description: "Sports franchises, incentive travel programmes, concert tours, and corporate retreats. We handle group logistics for 12 to 200+ passengers with coordinated scheduling, ground handling, and catering.",
    aircraft: ["Embraer Lineage 1000", "Boeing BBJ", "Airbus ACJ319", "Challenger 850"],
  },
  medevac: {
    title: "Medical Evacuation",
    headline: "When Every Minute Counts",
    description: "Air ambulance coordination with full medical crew, stretcher configuration, ICU equipment, and bed-to-bed transfers. We operate globally with 24/7 availability for urgent medical repatriation and evacuation missions.",
    aircraft: ["Learjet 45", "King Air 350", "Challenger 604", "Gulfstream G550"],
  },
  cargo: {
    title: "Cargo & Special Missions",
    headline: "Beyond Passengers",
    description: "Oversized freight, hazardous materials, sensitive government shipments, humanitarian aid, and NGO operations. We arrange cargo charters with specialist operators and full customs/logistic coordination.",
    aircraft: ["Boeing 737F", "Antonov AN-12", "Pilatus PC-12", "Beechcraft 1900D"],
  },
  helicopter: {
    title: "Helicopter Transfers",
    headline: "The First & Last Mile",
    description: "City-to-airport, yacht-to-shore, event transfers, and aerial tours. VIP helicopter movements with executive interiors, noise-reduced cabins, and door-to-door timing precision.",
    aircraft: ["Airbus H145", "Bell 429", "AgustaWestland AW139", "Sikorsky S-76"],
  },
};

const CharterPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const data = charterData[slug || ""];

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-32 text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">Charter category not found</h1>
          <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 max-w-4xl mx-auto px-6 md:px-10">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to Home
        </Link>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] tracking-[0.3em] uppercase font-medium text-primary mb-3"
        >
          {data.title}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-6"
        >
          {data.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-base md:text-lg leading-relaxed mb-12 max-w-2xl"
        >
          {data.description}
        </motion.p>

        {/* Recommended aircraft */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h3 className="text-[11px] tracking-[0.2em] uppercase font-medium text-foreground/60 mb-4">
            Recommended Aircraft
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {data.aircraft.map((name) => (
              <div key={name} className="rounded-xl border border-border bg-card p-5 text-center">
                <p className="font-display text-sm font-medium text-foreground">{name}</p>
                <Link
                  to="/contact"
                  className="mt-3 inline-block text-[9px] tracking-[0.12em] uppercase text-primary hover:underline"
                >
                  Request This Aircraft
                </Link>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <div className="flex flex-wrap gap-4">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground text-[12px] tracking-[0.15em] uppercase font-semibold hover:bg-primary/90 transition-colors shadow-[0_8px_24px_hsl(var(--primary)/0.25)]"
          >
            <Plane size={16} strokeWidth={1.5} />
            Request a Flight
          </Link>
          <a
            href="https://wa.me/447888999944"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-border text-foreground/70 text-[12px] tracking-[0.15em] uppercase font-medium hover:text-foreground hover:border-primary/40 transition-colors"
          >
            Speak to an Advisor
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CharterPage;
