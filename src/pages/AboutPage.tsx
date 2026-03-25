import { motion } from "framer-motion";
import { Shield, Globe, Clock, Plane, Users, Target, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FadeReveal } from "@/components/ui/ScrollEffects";

const stats = [
  { value: "18+", label: "Years of Experience" },
  { value: "7,000+", label: "Aircraft Network" },
  { value: "24/7", label: "Global Availability" },
  { value: "<30min", label: "Response Time" },
];

const capabilities = [
  { icon: Plane, title: "Private Jet Charter", desc: "Executive and leisure flights worldwide with certified operators." },
  { icon: Target, title: "Corporate Aviation", desc: "Tailored solutions for businesses demanding consistency and discretion." },
  { icon: Shield, title: "Cargo & Special Missions", desc: "Time-critical cargo, medical evacuations, and complex operations." },
  { icon: Users, title: "Client Advisory", desc: "Strategic guidance on aircraft selection, routing, and cost optimization." },
];

const AboutPage = () => (
  <div className="min-h-screen bg-background relative">
    <div className="noise-overlay" />
    <div className="relative z-[2]">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 text-center section-white">
        <div className="container mx-auto px-6">
          <FadeReveal>
            <p className="text-[11px] tracking-[0.5em] uppercase text-primary mb-6 font-medium">About Universal Jets</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-6 leading-[1.1]">
              Private Aviation.{" "}
              <span className="text-gradient-gold italic font-medium">Redefined.</span>
            </h1>
            <p className="text-[16px] text-muted-foreground font-light leading-[1.9] max-w-2xl mx-auto">
              Universal Jets is a global aviation brokerage built on experience, precision, and access.
              For over 18 years, we have operated at the center of private aviation — connecting clients
              to a worldwide network of certified operators, aircraft, and mission-critical solutions.
            </p>
          </FadeReveal>
        </div>
      </section>

      {/* Stats */}
      <section className="section-light">
        <div className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((s, i) => (
              <FadeReveal key={s.label} delay={i * 0.1}>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-display font-semibold text-gradient-gold mb-2">{s.value}</p>
                  <p className="text-[12px] text-muted-foreground tracking-[0.2em] uppercase font-medium">{s.label}</p>
                </div>
              </FadeReveal>
            ))}
          </div>
        </div>
      </section>

      {/* We Operate Access */}
      <section className="section-white">
        <div className="container mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl mx-auto">
            <FadeReveal>
              <p className="text-[11px] tracking-[0.4em] uppercase text-primary font-medium mb-6">Our Philosophy</p>
              <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-8 leading-[1.2]">
                We don't operate aircraft.<br />
                We operate <span className="text-gradient-gold italic">access.</span>
              </h2>
              <div className="space-y-5 text-[16px] text-muted-foreground font-light leading-[1.9]">
                <p>Access to the right aircraft. Access to the right operators. Access to the best possible solution — every time.</p>
                <p>Unlike single-fleet providers, Universal Jets works across the entire market. This allows us to source aircraft worldwide, optimize availability and pricing, and adapt to complex missions instantly.</p>
                <p>From executive travel to urgent cargo and special operations, every flight is handled with precision and discretion.</p>
              </div>
            </FadeReveal>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="section-light">
        <div className="container mx-auto px-6 py-24 md:py-32">
          <FadeReveal className="text-center mb-16">
            <p className="text-[11px] tracking-[0.4em] uppercase text-primary font-medium mb-4">Experience That Matters</p>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground">
              Nearly Two Decades in <span className="text-gradient-gold italic">Aviation</span>
            </h2>
          </FadeReveal>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {capabilities.map((cap, i) => (
              <FadeReveal key={cap.title} delay={i * 0.1}>
                <div className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                    <cap.icon className="w-5 h-5 text-primary" strokeWidth={1.3} />
                  </div>
                  <h3 className="text-[17px] font-display font-semibold text-foreground mb-2">{cap.title}</h3>
                  <p className="text-[14px] text-muted-foreground font-light leading-[1.8]">{cap.desc}</p>
                </div>
              </FadeReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="section-white">
        <div className="container mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl mx-auto">
            <FadeReveal>
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-5 h-5 text-primary" strokeWidth={1.3} />
                <p className="text-[11px] tracking-[0.4em] uppercase text-primary font-medium">Safety. Always First.</p>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-8 leading-[1.2]">
                Every flight meets the highest<br />
                <span className="text-gradient-gold italic">operational standards.</span>
              </h2>
              <p className="text-[16px] text-muted-foreground font-light leading-[1.9]">
                We work exclusively with audited and certified operators. Every flight is evaluated through
                multiple layers of safety checks, ensuring the highest operational standards are met.
                Our partnerships with ARGUS and WYVERN reflect our commitment to safety without compromise.
              </p>
            </FadeReveal>
          </div>
        </div>
      </section>

      {/* A Different Approach */}
      <section className="section-light">
        <div className="container mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl mx-auto">
            <FadeReveal>
              <p className="text-[11px] tracking-[0.4em] uppercase text-primary font-medium mb-6">A Different Approach</p>
              <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-8 leading-[1.2]">
                Not a booking platform.<br />
                An aviation <span className="text-gradient-gold italic">advisory.</span>
              </h2>
              <p className="text-[16px] text-muted-foreground font-light leading-[1.9] mb-6">
                Universal Jets is not a marketplace. We guide, structure, and execute every flight
                based on the client's needs — not inventory limitations.
              </p>
              <p className="text-[16px] text-muted-foreground font-light leading-[1.9]">
                Clients demand more flexibility, more transparency, and more control.
                Universal Jets is built for that future.
              </p>
            </FadeReveal>
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="section-white">
        <div className="container mx-auto px-6 py-24 md:py-32 text-center">
          <FadeReveal>
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Globe className="w-6 h-6 text-primary" strokeWidth={1.3} />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-6">
              Global <span className="text-gradient-gold italic">Presence</span>
            </h2>
            <p className="text-[16px] text-muted-foreground font-light leading-[1.9] max-w-xl mx-auto">
              Headquartered in Dubai, United Arab Emirates, Universal Jets serves clients
              across Europe, the Middle East, Africa, and beyond.
            </p>
          </FadeReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section-dark">
        <div className="container mx-auto px-6 py-24 md:py-32 text-center">
          <FadeReveal>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-white mb-4 leading-[1.2]">
              Universal <span className="text-gradient-gold italic">Jets</span>
            </h2>
            <p className="text-[16px] text-white/60 font-light mb-10">Private Aviation. Perfected.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => document.dispatchEvent(new CustomEvent("open-ricky-booking"))}
                className="inline-flex items-center gap-3 px-12 py-4 bg-gradient-gold text-white text-[12px] tracking-[0.25em] uppercase font-medium rounded-xl cursor-pointer"
              >
                Request a Flight
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </motion.button>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-10 py-4 border border-white/15 text-white/60 hover:text-white text-[12px] tracking-[0.25em] uppercase font-light rounded-xl transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </FadeReveal>
        </div>
      </section>

      <Footer />
    </div>
  </div>
);

export default AboutPage;
