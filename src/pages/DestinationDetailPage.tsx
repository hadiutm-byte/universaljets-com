import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Plane, MapPin, Calendar, Shield, MessageCircle, Globe, Users, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { getDestinationBySlug, destinations as allDestinations } from "@/lib/destinationsData";

const DestinationDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dest = getDestinationBySlug(slug || "");

  if (!dest) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-40 text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">Destination not found</h1>
          <Link to="/destinations" className="text-primary text-sm">← Back to Destinations</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Get 3 other destinations for "Explore More"
  const others = allDestinations.filter((d) => d.slug !== dest.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`${dest.name} — Private Jet Charter | Universal Jets`}
        description={`Fly private to ${dest.name}. ${dest.tagline}. Airports, routes, aircraft, and concierge services for ${dest.name} private aviation.`}
        path={`/destinations/${dest.slug}`}
      />
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="pt-36 pb-14 md:pt-44 md:pb-20">
        <div className="container mx-auto px-8 max-w-4xl">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate("/destinations")}
            className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft size={12} /> All Destinations
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[11px] tracking-[0.5em] uppercase text-primary mb-4 font-medium">{dest.region}</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-semibold text-foreground mb-4">
              {dest.name}
            </h1>
            <p className="text-lg md:text-xl text-primary/70 font-light mb-6 italic">{dest.tagline}</p>
            <p className="text-[15px] text-muted-foreground font-light leading-[1.9] max-w-2xl">{dest.heroDesc}</p>
          </motion.div>
        </div>
      </section>

      {/* ═══ AIRPORTS ═══ */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl border border-border flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary/60" strokeWidth={1.3} />
              </div>
              <h2 className="font-display text-xl font-semibold text-foreground">Airports & Access</h2>
            </div>

            <div className="space-y-4">
              {dest.airports.map((ap, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                      <h3 className="font-display text-base font-medium text-foreground mb-1">{ap.name}</h3>
                      <span className="text-[11px] tracking-[0.15em] uppercase text-primary/60 font-medium">{ap.code}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] tracking-[0.15em] uppercase bg-muted text-muted-foreground font-medium self-start">
                      {ap.type}
                    </span>
                  </div>
                  {ap.note && (
                    <p className="text-[12px] text-muted-foreground/60 font-light mt-3 leading-[1.8]">{ap.note}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ POPULAR ROUTES ═══ */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-8 max-w-4xl">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl border border-border flex items-center justify-center">
                <Plane className="w-4 h-4 text-primary/60" strokeWidth={1.3} />
              </div>
              <h2 className="font-display text-xl font-semibold text-foreground">Popular Routes</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {dest.popularRoutes.map((route, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-xl border border-border bg-card p-5 group hover:border-primary/20 transition-all duration-500"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[14px] font-display font-medium text-foreground">{route.from}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-primary/40" />
                    <span className="text-[14px] font-display font-medium text-foreground">{route.to}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-muted-foreground/40" strokeWidth={1.3} />
                      <span className="text-[11px] text-muted-foreground/60 font-light">{route.time}</span>
                    </div>
                    <span className="text-[10px] text-primary/50 font-light">{route.aircraft}</span>
                  </div>
                  <Link
                    to="/request-flight"
                    className="mt-3 inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-primary/50 font-medium hover:text-primary transition-colors"
                  >
                    Request This Route <ArrowRight size={10} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ AIRCRAFT + SEASONAL ═══ */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-8 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Aircraft Categories */}
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl border border-border flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary/60" strokeWidth={1.3} />
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground">Aircraft Categories</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {dest.aircraftCategories.map((cat) => (
                  <span key={cat} className="px-4 py-2 rounded-full text-[11px] tracking-[0.1em] border border-border bg-card text-foreground/70 font-light">
                    {cat}
                  </span>
                ))}
              </div>
              <Link
                to="/fleet"
                className="mt-5 inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-primary/60 font-medium hover:text-primary transition-colors"
              >
                Browse Full Fleet <ArrowRight size={10} />
              </Link>
            </motion.div>

            {/* Seasonal Insights */}
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl border border-border flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary/60" strokeWidth={1.3} />
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground">When to Fly</h2>
              </div>
              <div className="space-y-3 text-[13px] font-light text-muted-foreground leading-[1.8]">
                <p><span className="text-foreground font-medium">Peak:</span> {dest.seasonalInsights.peak}</p>
                <p><span className="text-foreground font-medium">Shoulder:</span> {dest.seasonalInsights.shoulder}</p>
                <p className="text-[12px] text-muted-foreground/50 italic">{dest.seasonalInsights.note}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ CONCIERGE & LIFESTYLE ═══ */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-8 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Concierge */}
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl border border-border flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary/60" strokeWidth={1.3} />
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground">Concierge Services</h2>
              </div>
              <div className="space-y-3">
                {dest.concierge.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0" />
                    <span className="text-[13px] text-muted-foreground font-light leading-[1.8]">{item}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/concierge"
                className="mt-5 inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-primary/60 font-medium hover:text-primary transition-colors"
              >
                Full Concierge Services <ArrowRight size={10} />
              </Link>
            </motion.div>

            {/* Lifestyle */}
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl border border-border flex items-center justify-center">
                  <Globe className="w-4 h-4 text-primary/60" strokeWidth={1.3} />
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground">Experiences</h2>
              </div>
              <div className="space-y-3">
                {dest.lifestyle.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0" />
                    <span className="text-[13px] text-muted-foreground font-light leading-[1.8]">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ BOOKING TIP ═══ */}
      <section className="py-10">
        <div className="container mx-auto px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="rounded-xl border border-primary/15 bg-primary/[0.03] p-6 md:p-8"
          >
            <p className="text-[10px] tracking-[0.3em] uppercase text-primary/60 font-medium mb-3">Advisory Note</p>
            <p className="text-[14px] text-foreground/70 font-light leading-[1.9]">{dest.bookingTip}</p>
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-8 max-w-xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[11px] tracking-[0.4em] uppercase text-primary mb-6 font-medium">Ready to Fly</p>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Fly Private to {dest.name}
            </h2>
            <p className="text-[14px] text-muted-foreground font-light leading-relaxed mb-10">
              Tell us your dates and requirements — we'll source the best aircraft and handle every detail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/request-flight"
                className="px-10 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.2em] uppercase font-medium rounded-xl hover:shadow-[0_0_30px_-8px_hsla(45,79%,46%,0.4)] transition-all duration-500"
              >
                Request This Trip
              </Link>
              <a
                href="https://wa.me/971585918498"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-10 py-3.5 text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-all duration-500 border border-border rounded-xl"
              >
                <MessageCircle size={12} /> Speak to Advisor
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ EXPLORE MORE ═══ */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-8 max-w-4xl">
          <p className="text-[11px] tracking-[0.4em] uppercase text-primary mb-8 font-medium text-center">Explore More</p>
          <div className="grid sm:grid-cols-3 gap-5">
            {others.map((d) => (
              <Link
                key={d.slug}
                to={`/destinations/${d.slug}`}
                className="rounded-xl border border-border bg-card p-6 group hover:border-primary/20 transition-all duration-500 text-center"
              >
                <h3 className="font-display text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{d.name}</h3>
                <p className="text-[11px] text-muted-foreground/50 font-light">{d.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DestinationDetailPage;
