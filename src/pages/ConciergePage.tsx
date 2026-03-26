import { motion } from "framer-motion";
import { Car, Hotel, Plane, Shield, Wine, Briefcase, Globe, Heart, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import AirportExperienceSection from "@/components/AirportExperienceSection";

const services = [
  {
    icon: Car,
    title: "Luxury Ground Transport",
    desc: "Chauffeured vehicles, supercars, and armoured transfers arranged at every destination. Seamless tarmac-to-destination connectivity.",
    details: ["Rolls-Royce & Maybach chauffeurs", "Helicopter transfers", "Armoured security vehicles", "Multi-city logistics"],
  },
  {
    icon: Briefcase,
    title: "VIP Airport Handling",
    desc: "Private terminals, fast-track immigration, and tarmac access at major airports worldwide. No queues, no exposure.",
    details: ["Private FBO terminals", "Customs & immigration facilitation", "Meet & assist services", "Diplomatic protocol support"],
  },
  {
    icon: Hotel,
    title: "Hotels & Residences",
    desc: "Preferred access to the world's finest properties. Suite upgrades, late checkouts, and exclusive rates through our network.",
    details: ["Palace-level properties", "Private villa arrangements", "Yacht & estate coordination", "Extended stay management"],
  },
  {
    icon: Wine,
    title: "Lifestyle & Events",
    desc: "From Monaco Grand Prix to Art Basel — exclusive event access, private dining, and curated experiences at every destination.",
    details: ["Exclusive event access", "Private dining reservations", "Cultural & art experiences", "Bespoke itinerary design"],
  },
  {
    icon: Heart,
    title: "Family & Personal",
    desc: "Pet travel arrangements, medical assistance coordination, and specialised support for families and individuals with complex requirements.",
    details: ["Pet-friendly aircraft & logistics", "Medical assistance & evacuation", "Nanny & security coordination", "Special dietary & cabin requests"],
  },
  {
    icon: Shield,
    title: "Security & Privacy",
    desc: "Close protection officers, secure transport, and privacy-first travel planning for high-profile clients and public figures.",
    details: ["Executive protection teams", "Secure airport corridors", "Counter-surveillance protocol", "Anonymous booking procedures"],
  },
];

const ConciergePage = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="Concierge — Beyond Aviation | Universal Jets" description="Universal Jets concierge: luxury ground transport, VIP airport handling, hotel coordination, event access, and bespoke travel services for private aviation clients." path="/concierge" />
    <Navbar />

    {/* ═══ HERO ═══ */}
    <section className="pt-40 pb-16 md:pt-48 md:pb-24">
      <div className="container mx-auto px-8 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1 }}
          className="w-12 h-[1px] bg-gradient-to-r from-transparent via-primary/80 to-transparent mx-auto mb-10 origin-center"
        />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[11px] tracking-[0.5em] uppercase text-primary mb-6 font-medium"
        >
          Concierge Services
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold mb-6 text-foreground"
        >
          Beyond{" "}
          <span className="text-gradient-gold italic">Aviation</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-base text-muted-foreground font-light max-w-xl mx-auto leading-relaxed"
        >
          Every detail before, during, and after your flight — coordinated by a single team that understands what exceptional travel demands.
        </motion.p>
      </div>
    </section>

    {/* ═══ SERVICES GRID ═══ */}
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="rounded-2xl border border-border bg-card p-8 group hover:border-primary/20 transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-xl border border-border bg-muted/30 flex items-center justify-center mb-6 group-hover:border-primary/30 transition-all duration-500">
                <s.icon className="w-5 h-5 text-primary/60" strokeWidth={1.2} />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">{s.title}</h3>
              <p className="text-[13px] text-muted-foreground font-light leading-[1.9] mb-5">{s.desc}</p>
              <div className="space-y-2">
                {s.details.map((d, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary/40" />
                    <span className="text-[11px] text-muted-foreground/60 font-light">{d}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══ HOW IT WORKS ═══ */}
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-8 max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[11px] tracking-[0.4em] uppercase text-primary mb-6 font-medium">How It Works</p>
          <h2 className="font-display text-2xl md:text-4xl font-semibold text-foreground mb-4">
            One Team. <span className="text-gradient-gold italic">Every Detail.</span>
          </h2>
          <p className="text-[14px] text-muted-foreground font-light leading-relaxed max-w-lg mx-auto mb-12">
            Your aviation advisor coordinates all concierge services directly — no separate contacts, no fragmented communication.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          {[
            { n: "01", t: "Brief Your Advisor", d: "Share your full trip requirements — transport, accommodation, events, and preferences." },
            { n: "02", t: "We Coordinate", d: "Your advisor arranges every detail through our vetted partner network worldwide." },
            { n: "03", t: "Travel Seamlessly", d: "Everything is confirmed and briefed before departure. One contact for any changes." },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-[12px] font-display text-primary font-semibold">{s.n}</span>
              </div>
              <h3 className="font-display text-lg mb-2 text-foreground">{s.t}</h3>
              <p className="text-[13px] text-muted-foreground font-light leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══ AIRPORT EXPERIENCE (Live FBO Data) ═══ */}
    <AirportExperienceSection />

    {/* ═══ CTA ═══ */}
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-8 text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-[11px] tracking-[0.4em] uppercase text-primary mb-8 font-medium">Get Started</p>
          <h2 className="font-display text-2xl md:text-3xl mb-6 text-foreground">Plan Your Next Journey</h2>
          <p className="text-[14px] text-muted-foreground font-light leading-relaxed mb-10">
            Whether it's a single transfer or a multi-city itinerary, our concierge team is ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-10 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.2em] uppercase font-medium rounded-xl hover:shadow-[0_0_30px_-8px_hsla(43,74%,49%,0.4)] transition-all duration-500"
            >
              Contact Concierge
            </Link>
            <a
              href="https://wa.me/971585918498"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-3.5 text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-all duration-500 border border-border rounded-xl"
            >
              <MessageCircle size={12} /> WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default ConciergePage;
