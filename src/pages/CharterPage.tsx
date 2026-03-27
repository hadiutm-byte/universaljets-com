import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const charterData: Record<string, {
  title: string;
  headline: string;
  description: string;
  image: string;
  aircraft: string[];
}> = {
  leisure: {
    title: "Leisure Charter",
    headline: "Your Island Doesn't Have a Runway? We'll Find One Nearby.",
    description: "Ski trips, honeymoons, family escapes — 10,000+ destinations with zero layovers and zero strangers on board. Whether it's a Mediterranean villa, a Caribbean island, or a lodge in the Alps — your leisure charter is built around your schedule, your preferences, and your privacy.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441238946/F94ypwks3ADk2wFrxZVnWB/leisure-travel-luxury-azcFavRQuX4DrgSwWAoAtx.webp",
    aircraft: ["Citation CJ3", "Phenom 300", "Challenger 350", "Global 7500"],
  },
  corporate: {
    title: "Corporate Solutions",
    headline: "Three Cities in One Day. Boardroom at 40,000 Feet.",
    description: "Your NDA starts at the cabin door. Multi-city roadshows, investor meetings, and retreats built around your schedule — not an airline's. We match the aircraft to the mission, whether that's a light jet for a day trip or an ultra-long-range cabin for transatlantic strategy sessions.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441238946/F94ypwks3ADk2wFrxZVnWB/corporate-executive-jet-a3dWZJiLaShszow9sv8fuB.webp",
    aircraft: ["Phenom 300E", "Citation Latitude", "Challenger 650", "Gulfstream G650"],
  },
  medevac: {
    title: "Medical Evacuations",
    headline: "When Minutes Decide Outcomes, We Don't Wait for Morning.",
    description: "ICU-equipped jets, trained medical crews, and clearance through conflict zones — we've brought people home from places others won't fly into. Air ambulance coordination with full medical crew, stretcher configuration, ICU equipment, and bed-to-bed transfers. We operate globally with 24/7 availability for urgent medical repatriation and evacuation missions.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441238946/F94ypwks3ADk2wFrxZVnWB/medical-jet-evacuation_c1c73ba0.png",
    aircraft: ["Learjet 35A", "Citation CJ3", "Challenger 604", "Gulfstream G550"],
  },
  cargo: {
    title: "Cargo & Special Missions",
    headline: "Hazmat-Certified. Government-Cleared.",
    description: "From humanitarian aid drops to classified freight, we move what others can't — or won't. Permits, customs, and compliance handled before you finish your coffee. Oversized freight, hazardous materials, sensitive government shipments, humanitarian aid, and NGO operations — we arrange cargo charters with specialist operators and full customs/logistic coordination.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441238946/F94ypwks3ADk2wFrxZVnWB/cargo-charter-loading-UNLEgPt7hoTHe7qWvdfsRq.webp",
    aircraft: ["Boeing 737F", "Antonov AN-12", "Pilatus PC-12", "Beechcraft 1900D"],
  },
  helicopter: {
    title: "VIP Helicopter Transfers",
    headline: "Dubai Traffic Is Someone Else's Problem.",
    description: "Airport to hotel in minutes, not hours. Premium rotorcraft for executives who treat time like the currency it is. City-to-airport, yacht-to-shore, event transfers, and aerial tours — VIP helicopter movements with executive interiors, noise-reduced cabins, and door-to-door timing precision.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441238946/F94ypwks3ADk2wFrxZVnWB/vip-helicopter-transfer-kAGxmTqso7jNsiQQtZLzEv.webp",
    aircraft: ["Airbus H145", "Bell 429", "AgustaWestland AW139", "Sikorsky S-76"],
  },
  group: {
    title: "Group Charter",
    headline: "50,000+ Passengers Across Six Continents.",
    description: "Corporate delegations, sports teams, concert tours, religious pilgrimages. We've moved 50,000+ passengers across six continents — including FIFA World Cup 2022. We handle group logistics for 12 to 200+ passengers with coordinated scheduling, ground handling, and catering.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441238946/F94ypwks3ADk2wFrxZVnWB/group-charter-boarding_c6a14ad9.jpg",
    aircraft: ["Embraer Lineage 1000", "Boeing BBJ", "Airbus ACJ319", "Challenger 850"],
  },
  evacuation: {
    title: "Emergency Evacuation",
    headline: "When the World Says No, We Say Cleared for Takeoff.",
    description: "Crisis evacuations from conflict zones, natural disaster areas, and politically unstable regions. We coordinate rapid-response flights with diplomatic clearances, overflight permits, and secure ground logistics. From war zones to hurricanes — we get people out when it matters most.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441238946/F94ypwks3ADk2wFrxZVnWB/medical-jet-evacuation_c1c73ba0.png",
    aircraft: ["Gulfstream G550", "Challenger 604", "Global 6000", "Boeing BBJ"],
  },
  government: {
    title: "Government & Diplomatic",
    headline: "State-Level Logistics. Classified Clearance.",
    description: "Diplomatic missions, VIP head-of-state transport, classified cargo movements, and official delegations. We handle government-grade security protocols, sovereign overflight permissions, and full compliance with international aviation regulations for sensitive state operations.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441238946/F94ypwks3ADk2wFrxZVnWB/corporate-executive-jet-a3dWZJiLaShszow9sv8fuB.webp",
    aircraft: ["Boeing BBJ", "Airbus ACJ319", "Gulfstream G650ER", "Global 7500"],
  },
  security: {
    title: "Security & Protection",
    headline: "Discrete Movements. Absolute Confidentiality.",
    description: "High-net-worth individual protection flights, witness relocation, secure asset transport, and confidential executive travel. Aircraft vetted for security specifications, crews cleared for sensitive operations, and full coordination with private security details.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441238946/F94ypwks3ADk2wFrxZVnWB/cargo-charter-loading-UNLEgPt7hoTHe7qWvdfsRq.webp",
    aircraft: ["Gulfstream G550", "Challenger 650", "Global 6000", "Falcon 7X"],
  },
  sports: {
    title: "Sports Team Charter",
    headline: "Your Team Arrives Together. On Time. Game Ready.",
    description: "Professional sports team transport with custom configurations for athletes — extra legroom, recovery zones, equipment handling, and synchronized scheduling across multi-city tournament circuits. From football clubs to Formula 1 teams, we've moved the best in the world.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441238946/F94ypwks3ADk2wFrxZVnWB/group-charter-boarding_c6a14ad9.jpg",
    aircraft: ["Airbus ACJ319", "Boeing 737-800", "Embraer Lineage 1000", "Challenger 850"],
  },
  entertainment: {
    title: "Entertainment & Tours",
    headline: "The Show Must Go On. We Make Sure It Does.",
    description: "Concert tours, film production crews, celebrity movements, and media teams. Multi-leg itineraries with equipment logistics, VIP handling, and absolute discretion. From world tours to film locations — seamless air logistics for the entertainment industry.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441238946/F94ypwks3ADk2wFrxZVnWB/leisure-travel-luxury-azcFavRQuX4DrgSwWAoAtx.webp",
    aircraft: ["Boeing BBJ", "Global 7500", "Challenger 850", "Gulfstream G650"],
  },
  diplomatic: {
    title: "Diplomatic Flights",
    headline: "Sovereign Airspace. Sovereign Service.",
    description: "Embassy evacuations, diplomatic courier flights, UN missions, and international organization transport. We navigate the most complex regulatory environments with full diplomatic clearance coordination, secure communication capabilities, and protocol-compliant cabin configurations.",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663441238946/F94ypwks3ADk2wFrxZVnWB/corporate-executive-jet-a3dWZJiLaShszow9sv8fuB.webp",
    aircraft: ["Gulfstream G650ER", "Global 7500", "Airbus ACJ320", "Boeing BBJ"],
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
      <SEOHead title={`${data.title} — Private Jet Charter`} description={data.description.slice(0, 155)} path={`/charter/${slug}`} />
      <Navbar />

      {/* Hero image */}
      <div className="relative h-[50vh] min-h-[360px] overflow-hidden">
        <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-6 md:px-10 pb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white mb-4 transition-colors">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <p className="text-[11px] tracking-[0.3em] uppercase font-medium text-primary mb-3">
            {data.title}
          </p>
          <h1 className="font-display text-3xl md:text-5xl font-semibold text-white leading-tight">
            {data.headline}
          </h1>
        </div>
      </div>

      <section className="py-16 md:py-24 max-w-4xl mx-auto px-6 md:px-10">
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
              <div key={name} className="rounded-xl border border-border bg-card p-5 text-center hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all">
                <p className="font-display text-sm font-medium text-foreground">{name}</p>
                <Link
                  to="/request-flight"
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
