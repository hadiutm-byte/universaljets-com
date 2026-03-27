import { motion } from "framer-motion";
import { ArrowRight, Plane, TrendingUp, AlertTriangle, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { destinations } from "@/lib/destinationsData";
import { destinationImages } from "@/lib/destinationImages";

import monacoGpImg from "@/assets/events/monaco-gp.jpg";
import cannesImg from "@/assets/events/cannes.jpg";
import davosImg from "@/assets/events/davos.jpg";
import artbaselImg from "@/assets/events/artbasel.jpg";
import wimbledonImg from "@/assets/events/wimbledon.jpg";
import f1Img from "@/assets/events/f1.jpg";
import worldcupImg from "@/assets/events/worldcup.jpg";

const events = [
  { img: monacoGpImg, title: "Monaco Grand Prix", desc: "The most prestigious race on the F1 calendar.", flight: "Paris → Nice: 1h 15m", when: "May" },
  { img: cannesImg, title: "Cannes Film Festival", desc: "Red carpets, private screenings, and the French Riviera at its most glamorous.", flight: "London → Cannes: 1h 50m", when: "May" },
  { img: davosImg, title: "Davos (WEF)", desc: "The world's most powerful gathering — heads of state, CEOs, and global leaders.", flight: "Zurich → Davos: 30m (heli)", when: "January" },
  { img: artbaselImg, title: "Art Basel", desc: "The global epicentre of contemporary art and culture.", flight: "London → Basel: 1h 30m", when: "June / December" },
  { img: wimbledonImg, title: "Wimbledon", desc: "Strawberries, Centre Court, and centuries of tradition.", flight: "Paris → London: 55m", when: "July" },
  { img: f1Img, title: "Formula 1 Season", desc: "From Abu Dhabi to Singapore — follow the global circuit.", flight: "Multiple global routes", when: "March – December" },
  { img: worldcupImg, title: "World Cup 2026", desc: "USA, Canada, Mexico — multi-city delegation logistics.", flight: "Cross-continental routes", when: "June – July 2026" },
];

const popularRoutes = [
  { from: "Dubai", to: "Mykonos", time: "5h 30m", demand: "Very High" },
  { from: "Riyadh", to: "London", time: "6h 45m", demand: "High" },
  { from: "Paris", to: "Nice", time: "1h 15m", demand: "High" },
  { from: "Dubai", to: "Maldives", time: "4h 15m", demand: "High" },
  { from: "New York", to: "Miami", time: "2h 45m", demand: "Very High" },
];

const DestinationsPage = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="Destinations & Events — Private Jet Travel" description="Fly private to Dubai, London, Monaco, Maldives, Mykonos and more. Airports, routes, aircraft, and concierge services for every destination." path="/destinations" />
    <Navbar />

    {/* Hero */}
    <section className="pt-40 pb-16 md:pt-48 md:pb-24">
      <div className="container mx-auto px-8 text-center max-w-3xl">
        <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 1 }} className="w-12 h-[1px] bg-gradient-to-r from-transparent via-primary/80 to-transparent mx-auto mb-10 origin-center" />
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-[11px] tracking-[0.5em] uppercase text-primary mb-6 font-medium">
          Destinations & Events
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-6">
          Fly for the Moments <span className="text-gradient-gold italic">That Matter</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="text-base text-muted-foreground font-light max-w-xl mx-auto leading-relaxed">
          From the world's most exclusive destinations to the events that define the season — strategic access where aircraft availability, slot coordination, and timing are critical.
        </motion.p>
      </div>
    </section>

    {/* ═══ DESTINATIONS GRID ═══ */}
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-8">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-[11px] tracking-[0.4em] uppercase text-primary mb-12 font-medium">
          Top Destinations
        </motion.p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {destinations.map((d, i) => (
            <motion.div
              key={d.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.6 }}
            >
              <Link
                to={`/destinations/${d.slug}`}
                className="group relative block rounded-2xl overflow-hidden aspect-[3/4] hover:shadow-[0_20px_60px_-15px_hsla(0,0%,0%,0.35)] transition-all duration-700"
              >
                {/* Background photo */}
                <img
                  src={destinationImages[d.slug]}
                  alt={d.name}
                  loading="lazy"
                  width={800}
                  height={1024}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Region badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[9px] tracking-[0.2em] uppercase text-white/80 font-medium border border-white/10">
                    {d.region}
                  </span>
                </div>

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-2xl font-semibold text-white mb-1 group-hover:text-primary transition-colors duration-500">
                    {d.name}
                  </h3>
                  <p className="text-[11px] text-white/50 font-light leading-[1.8] mb-4 line-clamp-2">
                    {d.tagline}
                  </p>

                  {/* Airport tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {d.airports.slice(0, 2).map((ap) => (
                      <span key={ap.code} className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-sm text-[8px] tracking-[0.1em] text-white/60 font-light">
                        {ap.code.split(" / ")[1] || ap.code}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-sm text-[8px] tracking-[0.1em] text-white/60 font-light">
                      {d.popularRoutes.length} routes
                    </span>
                  </div>

                  <span className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-primary/80 font-medium group-hover:text-primary transition-colors">
                    Explore <ArrowRight size={10} className="transition-transform duration-500 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══ POPULAR ROUTES ═══ */}
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-8">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-[11px] tracking-[0.4em] uppercase text-primary mb-10 font-medium">
          Most Requested Routes
        </motion.p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {popularRoutes.map((route, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-border bg-card p-5 text-center group hover:border-primary/15 transition-all duration-500"
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-[13px] font-display font-medium text-foreground/70">{route.from}</span>
                <ArrowRight className="w-3 h-3 text-primary/40" strokeWidth={1.5} />
                <span className="text-[13px] font-display font-medium text-foreground/70">{route.to}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 mb-3">
                <Plane className="w-3 h-3 text-primary/40" strokeWidth={1.5} />
                <span className="text-[10px] text-muted-foreground/50 font-light">{route.time}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 mb-3">
                <TrendingUp className="w-3 h-3 text-primary/50" strokeWidth={1.5} />
                <span className="text-[9px] tracking-[0.15em] uppercase text-primary/45 font-light">{route.demand}</span>
              </div>
              <Link to="/request-flight" className="text-[9px] tracking-[0.2em] uppercase text-primary/40 font-medium hover:text-primary transition-colors duration-500">
                Request Flight
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══ DEMAND NOTICE ═══ */}
    <section className="py-10">
      <div className="container mx-auto px-8 max-w-3xl">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center justify-center gap-4 py-5 px-8 rounded-xl border border-primary/10 bg-card">
          <AlertTriangle className="w-4 h-4 text-primary/50 flex-shrink-0" strokeWidth={1.5} />
          <p className="text-[11px] text-muted-foreground/60 font-light leading-[1.8]">
            <span className="text-primary/60 font-medium">High demand periods</span> — early booking recommended. Aircraft availability during peak events is limited. Typical lead time: 2–4 weeks.
          </p>
        </motion.div>
      </div>
    </section>

    {/* ═══ EVENTS ═══ */}
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-8">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-[11px] tracking-[0.4em] uppercase text-primary mb-10 font-medium">
          High-Demand Global Events
        </motion.p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {events.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                to="/request-flight"
                className="group relative block rounded-2xl overflow-hidden aspect-[3/4] hover:shadow-[0_20px_60px_-15px_hsla(0,0%,0%,0.35)] transition-all duration-700"
              >
                {/* Background photo */}
                <img
                  src={e.img}
                  alt={e.title}
                  loading="lazy"
                  width={640}
                  height={800}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Date badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[9px] tracking-[0.15em] uppercase text-white/80 font-medium border border-white/10">
                    <Calendar className="w-3 h-3" strokeWidth={1.2} />
                    {e.when}
                  </span>
                </div>

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors duration-500">
                    {e.title}
                  </h3>
                  <p className="text-[11px] text-white/50 font-light leading-[1.8] mb-4 line-clamp-2">
                    {e.desc}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <Plane className="w-3 h-3 text-primary/60" strokeWidth={1.5} />
                    <span className="text-[10px] text-white/50 font-light">{e.flight}</span>
                  </div>

                  <span className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-primary/80 font-medium group-hover:text-primary transition-colors">
                    Request Flight <ArrowRight size={10} className="transition-transform duration-500 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══ CTA ═══ */}
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-8 max-w-xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">Plan Your Next Journey</h2>
          <p className="text-[14px] text-muted-foreground font-light leading-relaxed mb-10">
            Tell us your destination or event — we'll handle aircraft, timing, and every detail.
          </p>
          <Link to="/request-flight" className="inline-block px-10 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl hover:shadow-[0_0_30px_-8px_hsla(43,74%,49%,0.4)] transition-all duration-500">
            Request Flight
          </Link>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default DestinationsPage;
