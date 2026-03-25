import { motion } from "framer-motion";
import { ArrowRight, Plane, TrendingUp, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import monacoImg from "@/assets/destinations/monaco.jpg";
import mykonosImg from "@/assets/destinations/mykonos.jpg";
import dubaiImg from "@/assets/destinations/dubai.jpg";
import maldivesImg from "@/assets/destinations/maldives.jpg";
import aspenImg from "@/assets/destinations/aspen.jpg";
import londonImg from "@/assets/destinations/london.jpg";
import stmoritzImg from "@/assets/destinations/stmoritz.jpg";

import monacoGpImg from "@/assets/events/monaco-gp.jpg";
import cannesImg from "@/assets/events/cannes.jpg";
import davosImg from "@/assets/events/davos.jpg";
import artbaselImg from "@/assets/events/artbasel.jpg";
import wimbledonImg from "@/assets/events/wimbledon.jpg";
import f1Img from "@/assets/events/f1.jpg";
import worldcupImg from "@/assets/events/worldcup.jpg";

const destinations = [
  { img: monacoImg, title: "Monaco", desc: "The jewel of the Côte d'Azur — superyachts, casinos, and unmatched exclusivity.", flight: "London → Monaco: 1h 50m", airport: "Nice Côte d'Azur (NCE)" },
  { img: mykonosImg, title: "Mykonos", desc: "Aegean glamour meets barefoot luxury. The Mediterranean's most coveted summer escape.", flight: "Dubai → Mykonos: 5h 30m", airport: "Mykonos (JMK)" },
  { img: dubaiImg, title: "Dubai", desc: "Where ambition meets opulence. A global hub for business, luxury, and year-round sun.", flight: "London → Dubai: 6h 45m", airport: "Al Maktoum (DWC)" },
  { img: maldivesImg, title: "Maldives", desc: "Overwater villas, crystal lagoons, and total seclusion. The ultimate private retreat.", flight: "Dubai → Malé: 4h 15m", airport: "Velana Intl (MLE)" },
  { img: aspenImg, title: "Aspen", desc: "Powder skiing by day, five-star dining by night. America's most exclusive mountain town.", flight: "New York → Aspen: 4h 30m", airport: "Aspen-Pitkin (ASE)" },
  { img: londonImg, title: "London", desc: "The world's financial capital. Culture, power, and privilege in every corner.", flight: "Dubai → London: 7h", airport: "Farnborough (FAB)" },
  { img: stmoritzImg, title: "St. Moritz", desc: "Alpine elegance at its finest. Where royalty and billionaires retreat in winter.", flight: "London → Samedan: 1h 40m", airport: "Engadin (SMV)" },
];

const events = [
  { img: monacoGpImg, title: "Monaco Grand Prix", desc: "The most prestigious race on the F1 calendar. Yachts in the harbour, champagne on the terrace.", flight: "Paris → Nice: 1h 15m", when: "May" },
  { img: cannesImg, title: "Cannes Film Festival", desc: "Red carpets, private screenings, and the French Riviera at its most glamorous.", flight: "London → Cannes: 1h 50m", when: "May" },
  { img: davosImg, title: "Davos (WEF)", desc: "The world's most powerful gathering. Heads of state, CEOs, and global leaders under one roof.", flight: "Zurich → Davos: 30m (heli)", when: "January" },
  { img: artbaselImg, title: "Art Basel", desc: "Three cities. One movement. The global epicentre of contemporary art and culture.", flight: "London → Basel: 1h 30m", when: "June / December" },
  { img: wimbledonImg, title: "Wimbledon", desc: "Strawberries, Centre Court, and centuries of tradition. Sport at its most refined.", flight: "Paris → London: 55m", when: "July" },
  { img: f1Img, title: "Formula 1 Season", desc: "From Abu Dhabi to Singapore — follow the global circuit with seamless aircraft access.", flight: "Multiple global routes", when: "March – December" },
  { img: worldcupImg, title: "World Cup 2026", desc: "The biggest sporting event on earth. USA, Canada, Mexico — multi-city delegation logistics.", flight: "Cross-continental routes", when: "June – July 2026" },
];

const DestinationCard = ({ item, index }: { item: typeof destinations[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08, duration: 0.7 }}
    className="group relative rounded-xl overflow-hidden border border-border/10 bg-card/10"
  >
    <div className="aspect-[4/5] overflow-hidden">
      <img
        src={item.img}
        alt={item.title}
        loading="lazy"
        width={640}
        height={800}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-6">
      <h3 className="font-display text-xl font-semibold text-foreground mb-2">{item.title}</h3>
      <p className="text-[11px] text-foreground/45 font-extralight leading-[1.9] mb-3">{item.desc}</p>
      <div className="flex items-center gap-2 mb-4">
        <Plane className="w-3 h-3 text-primary/50" strokeWidth={1.5} />
        <span className="text-[10px] text-primary/60 font-light">{item.flight}</span>
      </div>
      <Link
        to="/#cta"
        className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-primary/60 font-medium hover:text-primary transition-colors duration-500"
      >
        Request Flight <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
      </Link>
    </div>
  </motion.div>
);

const EventCard = ({ item, index }: { item: typeof events[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08, duration: 0.7 }}
    className="group relative rounded-xl overflow-hidden border border-border/10 bg-card/10"
  >
    <div className="aspect-[4/5] overflow-hidden">
      <img
        src={item.img}
        alt={item.title}
        loading="lazy"
        width={640}
        height={800}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-6">
      <p className="text-[9px] tracking-[0.3em] uppercase text-primary/50 font-light mb-2">{item.when}</p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-2">{item.title}</h3>
      <p className="text-[11px] text-foreground/45 font-extralight leading-[1.9] mb-3">{item.desc}</p>
      <div className="flex items-center gap-2 mb-4">
        <Plane className="w-3 h-3 text-primary/50" strokeWidth={1.5} />
        <span className="text-[10px] text-primary/60 font-light">{item.flight}</span>
      </div>
      <Link
        to="/#cta"
        className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-primary/60 font-medium hover:text-primary transition-colors duration-500"
      >
        Request Flight <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
      </Link>
    </div>
  </motion.div>
);

const DestinationsPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(228,28%,5%)] via-background to-background" />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "linear-gradient(hsla(38,52%,50%,0.3) 1px, transparent 1px), linear-gradient(90deg, hsla(38,52%,50%,0.3) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      <div className="container mx-auto px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="text-center max-w-3xl mx-auto">
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Destinations & Events</p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-6 leading-tight">
            Fly for the Moments<span className="text-gradient-gold"> That Matter</span>
          </h1>
          <p className="text-[14px] md:text-[16px] text-foreground/55 font-light leading-[1.9] max-w-xl mx-auto mb-4">
            From the world's most exclusive destinations to the events that define the season — we get you there.
          </p>
          <p className="text-[12px] md:text-[13px] text-foreground/35 font-extralight leading-[2] max-w-lg mx-auto">
            Strategic access where aircraft availability, slot coordination, and timing are critical.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Top Destinations */}
    <section className="py-20 md:py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4.5%)] to-transparent pointer-events-none" />
      <div className="container mx-auto px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Top Destinations</p>
          <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground mb-5">Where the World's Most Demanding Clients Travel</h2>
          <p className="text-[13px] text-foreground/45 font-extralight leading-[2] max-w-lg mx-auto">
            From Mediterranean summer hotspots to alpine retreats and tropical escapes — we position aircraft where demand is highest.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {destinations.map((d, i) => (
            <DestinationCard key={i} item={d} index={i} />
          ))}
        </div>
      </div>
    </section>

    {/* Events */}
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Global Events</p>
          <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground mb-5">High-Demand Global Events</h2>
          <p className="text-[13px] text-foreground/45 font-extralight leading-[2] max-w-lg mx-auto">
            Peak-demand periods where timing, aircraft access, and precision define the experience.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {events.map((e, i) => (
            <EventCard key={i} item={e} index={i} />
          ))}
        </div>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center text-[11px] tracking-[0.3em] uppercase text-foreground/25 font-extralight mt-16 italic"
        >
          When the world moves — we're already there.
        </motion.p>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-8 max-w-xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="text-center p-10 md:p-14 rounded-xl border border-primary/15 bg-gradient-to-br from-card/30 to-card/10 backdrop-blur-md"
        >
          <h2 className="text-xl md:text-2xl font-display font-semibold text-foreground mb-4">Plan Your Next Journey</h2>
          <p className="text-[12px] text-foreground/35 font-extralight leading-[2] mb-8">
            Tell us your destination or event — we'll handle aircraft, timing, and every detail.
          </p>
          <Link to="/#cta" className="inline-block px-10 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-medium rounded-sm hover:shadow-[0_0_30px_-8px_hsla(38,52%,50%,0.45)] transition-all duration-500">
            Request Flight
          </Link>
          <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/20 font-extralight mt-6">6,000+ aircraft • 40,000 airports • 24/7 global coverage</p>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default DestinationsPage;
