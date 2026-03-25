import { motion } from "framer-motion";
import { Check, ArrowRight, Shield, Clock, Globe, UserCheck, HeartHandshake, Plane } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tiers = [
  {
    name: "Select",
    hours: "50 Hours",
    positioning: "For executives and families who fly regularly and want rate certainty.",
    benefits: [
      "Fixed hourly rates across light & midsize jets",
      "Guaranteed 24-hour availability",
      "Dedicated aviation advisor",
      "Priority booking during peak seasons",
      "Complimentary ground transport coordination",
    ],
  },
  {
    name: "Elite",
    hours: "100 Hours",
    positioning: "For high-frequency travelers who demand priority access and global flexibility.",
    featured: true,
    benefits: [
      "Fixed rates across all aircraft categories",
      "Guaranteed 12-hour availability",
      "Dedicated senior aviation manager",
      "Priority over Select-tier bookings",
      "VIP concierge & catering included",
      "Empty leg matching & route optimization",
    ],
  },
  {
    name: "Chairman",
    hours: "250 Hours",
    positioning: "For principals, family offices, and organizations requiring total control and discretion.",
    benefits: [
      "Bespoke fixed rates — any aircraft, any route",
      "Guaranteed 8-hour availability worldwide",
      "Private aviation director assigned",
      "Absolute booking priority — no exceptions",
      "Full concierge: ground, hotel, security, catering",
      "Custom contract terms & invoicing",
      "Quarterly aviation intelligence briefing",
    ],
  },
];

const JetCardPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden section-white">
      <div className="grid-overlay" />

      <div className="container mx-auto px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="text-center max-w-3xl mx-auto">
          <p className="text-[11px] tracking-[0.5em] uppercase text-primary mb-6 font-medium">Jet Card Membership</p>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground mb-6 leading-tight">
            Guaranteed Access. Fixed Rates.<span className="text-gradient-gold"> Total Control.</span>
          </h1>
          <p className="text-[15px] md:text-[17px] text-muted-foreground font-light leading-[1.9] max-w-xl mx-auto mb-4">
            Lock your hourly rate. Avoid market fluctuations. Fly on your terms.
          </p>
          <p className="text-[13px] md:text-[14px] text-muted-foreground font-light leading-[1.9] max-w-lg mx-auto mb-10">
            Designed for frequent flyers, corporate executives, and UHNW individuals.
          </p>

          <a href="#jet-card-tiers" className="inline-block px-8 py-3.5 bg-gradient-gold text-primary-foreground text-[11px] tracking-[0.25em] uppercase font-medium rounded-xl hover:shadow-[0_0_30px_-8px_hsla(38,52%,50%,0.45)] transition-all duration-500">
            View Programs
          </a>

          <div className="divider-gold mt-14 mb-8" />
          <p className="text-[11px] tracking-[0.2em] text-muted-foreground font-light">
            Priority aircraft access • Fixed hourly rates • No ownership complexity • Global fleet flexibility
          </p>
        </motion.div>
      </div>
    </section>

    {/* Why Jet Card */}
    <section className="py-20 md:py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,4.5%)] to-transparent pointer-events-none" />
      <div className="container mx-auto px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">The Advantage</p>
          <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground mb-5">Why a Jet Card?</h2>
          <p className="text-[13px] text-foreground/45 font-extralight leading-[2] max-w-lg mx-auto">
            Unlike ad-hoc charter, a jet card secures your rate and access before you fly — eliminating market risk and availability anxiety.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: Clock, title: "Guaranteed Availability", desc: "Aircraft confirmed even on short notice — your schedule is never compromised." },
            { icon: Shield, title: "Fixed Hourly Rates", desc: "Predictable pricing with no hidden costs, fuel surcharges, or last-minute adjustments." },
            { icon: UserCheck, title: "Dedicated Aviation Manager", desc: "A single point of contact who knows your preferences and handles every detail." },
            { icon: Globe, title: "Global Coverage", desc: "Access to 7,000+ vetted aircraft worldwide with no geographic limitations." },
            { icon: HeartHandshake, title: "Private Concierge", desc: "End-to-end travel support — ground transport, catering, hotels, and special requests." },
            { icon: Plane, title: "No Fleet Bias", desc: "Your card is not tied to one fleet — we source the best aircraft globally for every mission." },
          ].map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}
              className="text-center group"
            >
              <div className="w-14 h-14 rounded-full luxury-border flex items-center justify-center mx-auto mb-7 group-hover:glow-subtle transition-all duration-700">
                <b.icon className="w-5 h-5 text-primary/60" strokeWidth={1.2} />
              </div>
              <h3 className="font-display text-lg mb-3 text-foreground">{b.title}</h3>
              <p className="text-[12px] text-foreground/40 font-extralight leading-[2]">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Tier Cards */}
    <section id="jet-card-tiers" className="py-20 md:py-28 relative">
      <div className="container mx-auto px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">Programs</p>
          <h2 className="text-2xl md:text-4xl font-display font-semibold text-foreground mb-5">Choose Your Program</h2>
          <p className="text-[13px] text-foreground/45 font-extralight leading-[2] max-w-lg mx-auto">
            Three tiers. One standard of excellence. Programs starting from $150,000.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.7 }}
              className={`relative rounded-xl p-8 md:p-10 backdrop-blur-sm transition-all duration-700 ${
                tier.featured
                  ? "border border-primary/25 bg-gradient-to-b from-card/50 to-card/20 shadow-[0_0_40px_-12px_hsla(38,52%,50%,0.15)]"
                  : "border border-border/20 bg-card/20"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-gradient-gold text-primary-foreground text-[8px] tracking-[0.3em] uppercase font-medium rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <p className="text-[9px] tracking-[0.4em] uppercase text-primary/50 font-light mb-2">{tier.name}</p>
              <p className="font-display text-2xl font-semibold text-foreground mb-3">{tier.hours}</p>
              <p className="text-[11px] text-foreground/35 font-extralight leading-[1.9] mb-8">{tier.positioning}</p>

              <div className="space-y-3 mb-8">
                {tier.benefits.map((benefit, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <Check className="w-3.5 h-3.5 text-primary/50 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <span className="text-[11px] text-foreground/45 font-extralight leading-[1.8]">{benefit}</span>
                  </div>
                ))}
              </div>

              <a href="#jet-card-apply" className={`block text-center py-3.5 text-[10px] tracking-[0.25em] uppercase font-medium rounded-sm transition-all duration-500 ${
                tier.featured
                  ? "bg-gradient-gold text-primary-foreground hover:shadow-[0_0_30px_-8px_hsla(38,52%,50%,0.45)]"
                  : "border border-primary/20 text-primary/70 hover:border-primary/40 hover:text-primary"
              }`}>
                Apply for Jet Card
              </a>
            </motion.div>
          ))}
        </div>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.8 }}
          className="text-center text-[11px] text-foreground/20 font-extralight mt-12 italic"
        >
          This is not a membership. It's a smarter way to fly private.
        </motion.p>
      </div>
    </section>

    {/* Broker Advantage */}
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-8 max-w-2xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="p-10 md:p-14 rounded-xl border border-primary/15 bg-gradient-to-br from-card/30 to-card/10 backdrop-blur-md"
        >
          <p className="text-[13px] text-foreground/40 font-extralight leading-[2] italic mb-1">
            Unlike operators, your jet card is not tied to one fleet.
          </p>
          <p className="text-[14px] text-primary/60 font-light leading-[2] mb-6">
            We source the best aircraft globally for every mission.
          </p>
          <p className="text-[10px] tracking-[0.2em] text-foreground/25 font-extralight">
            7,000+ vetted aircraft • ARGUS/WYVERN safety certified • 160+ countries
          </p>
        </motion.div>
      </div>
    </section>

    {/* CTA */}
    <section id="jet-card-apply" className="py-20 md:py-28">
      <div className="container mx-auto px-8 text-center max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-8 font-light">Get Started</p>
          <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">Apply for Your Jet Card</h2>
          <p className="text-[12px] text-foreground/35 font-extralight leading-[2] mb-3">
            Speak with our team to explore fixed-rate programmes tailored to your travel patterns.
          </p>
          <p className="text-[9px] tracking-[0.3em] uppercase text-foreground/20 font-extralight mb-10">
            Limited availability per region — acceptance subject to client profile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/#cta" className="px-10 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-sm hover:shadow-[0_0_30px_-8px_hsla(38,52%,50%,0.45)] transition-all duration-500">
              Apply for Jet Card
            </Link>
            <Link to="/members" className="inline-flex items-center justify-center gap-2 px-10 py-3.5 text-[10px] tracking-[0.2em] uppercase text-foreground/40 hover:text-foreground/70 transition-all duration-500 border border-border/20 rounded-sm">
              View Membership <ArrowRight size={10} />
            </Link>
          </div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/20 font-extralight mt-8">Typical Response Time: Under 30 minutes</p>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default JetCardPage;
