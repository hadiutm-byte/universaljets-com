import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Users, Plane, Shield, Zap, Globe, ArrowRight, CheckCircle, TrendingUp, FileText, HeadphonesIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";

const stats = [
  { label: "Active Corporate Accounts", value: "340+", icon: Users },
  { label: "Flights Operated (YTD)", value: "12,800+", icon: Plane },
  { label: "Countries Covered", value: "78", icon: Globe },
  { label: "Average Response Time", value: "< 4 min", icon: Zap },
];

const features = [
  {
    icon: BarChart3,
    title: "Real-Time Performance Dashboard",
    description:
      "Live KPI tracking, spend analytics, and usage trends across your entire travel programme — all in one view.",
  },
  {
    icon: FileText,
    title: "Contract & Invoice Management",
    description:
      "Centralized contract repository, automated invoicing, and reconciliation tools built for finance teams.",
  },
  {
    icon: TrendingUp,
    title: "Predictive Demand Insights",
    description:
      "AI-powered analytics surface upcoming travel peaks, route optimisations, and cost-saving opportunities.",
  },
  {
    icon: Shield,
    title: "Dedicated Account Management",
    description:
      "A senior aviation advisor assigned exclusively to your account — available 24/7 via direct line.",
  },
  {
    icon: Globe,
    title: "API Integration",
    description:
      "Connect Universal Jets directly into your travel management system via our RESTful API for seamless booking.",
  },
  {
    icon: HeadphonesIcon,
    title: "White-Glove Concierge",
    description:
      "Ground transport, catering, FBO coordination, and crew briefings handled end-to-end by our ops team.",
  },
];

const tiers = [
  {
    name: "Corporate Access",
    price: "Custom",
    description: "For companies with occasional private travel needs.",
    features: ["On-demand charter access", "24/7 ops support", "Dedicated account manager", "Consolidated monthly billing"],
  },
  {
    name: "Enterprise Platinum",
    price: "Custom",
    description: "For high-frequency travel programmes with complex routing.",
    features: [
      "Everything in Corporate Access",
      "Guaranteed aircraft availability",
      "Real-time performance dashboard",
      "API integration",
      "Predictive travel analytics",
      "Quarterly business reviews",
    ],
    highlighted: true,
  },
  {
    name: "ACMI & Leasing",
    price: "Custom",
    description: "Structured leasing solutions for operators and airlines.",
    features: ["Aircraft on dry/wet lease", "Crew supply options", "Maintenance coordination", "CAMO oversight support"],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

const B2BPortalPage = () => {
  const [hoveredTier, setHoveredTier] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-charcoal-deep text-foreground overflow-x-hidden">
      <SEOHead
        title="B2B Corporate Aviation Portal — Universal Jets"
        description="Streamline your corporate travel with Universal Jets' B2B portal. Real-time dashboards, API integration, dedicated account management, and predictive analytics for enterprise clients."
        path="/b2b"
      />
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative pt-36 pb-24 px-6 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-radial-gradient rounded-full opacity-20"
            style={{ background: "radial-gradient(ellipse, hsla(43,85%,58%,0.12) 0%, transparent 70%)" }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <span className="inline-block text-[10px] tracking-[0.3em] uppercase text-primary/80 font-medium mb-5 px-4 py-1.5 glass-gold rounded-full">
            B2B Corporate Portal
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            Enterprise Aviation,{" "}
            <span className="text-primary text-glow-gold">Reimagined</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground/80 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            A fully integrated B2B aviation platform giving corporate clients real-time transparency, 
            predictive insights, and white-glove operations — all from a single dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              Request Corporate Access
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/acmi-leasing"
              className="inline-flex items-center gap-2 glass border border-border/30 text-white/80 font-medium px-8 py-3.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              ACMI &amp; Leasing
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="border-y border-border/10 bg-black/20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-border/10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="flex flex-col items-center justify-center py-8 px-4 text-center gap-2"
            >
              <stat.icon className="w-5 h-5 text-primary/60 mb-1" strokeWidth={1.5} />
              <p className="font-display text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50 font-light">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Built for Corporate Travel Programmes
            </h2>
            <p className="text-muted-foreground/70 max-w-xl mx-auto">
              Every tool your team needs to manage, optimise, and report on private aviation spend.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="glass-card p-6 group hover:border-primary/20 transition-colors duration-300"
              >
                <feature.icon
                  className="w-7 h-7 text-primary mb-4 group-hover:scale-110 transition-transform duration-300"
                  strokeWidth={1.5}
                />
                <h3 className="font-display text-base font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground/60 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING / TIERS ─── */}
      <section className="py-24 px-6 border-t border-border/10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Partnership Tiers
            </h2>
            <p className="text-muted-foreground/70 max-w-xl mx-auto">
              Tailored structures for every scale of corporate aviation commitment.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                onHoverStart={() => setHoveredTier(i)}
                onHoverEnd={() => setHoveredTier(null)}
                className={`relative rounded-2xl p-7 border transition-all duration-300 cursor-default ${
                  tier.highlighted
                    ? "border-primary/30 glass-gold holo-border"
                    : "border-border/15 glass-dark"
                } ${hoveredTier === i ? "scale-[1.02]" : "scale-100"}`}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.2em] uppercase bg-primary text-primary-foreground px-3 py-1 rounded-full font-semibold">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-lg font-bold text-white mb-1">{tier.name}</h3>
                <p className="text-xs text-muted-foreground/60 mb-5">{tier.description}</p>
                <ul className="space-y-3 mb-7">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                      <CheckCircle className="w-4 h-4 text-primary/70 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`block text-center py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    tier.highlighted
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "border border-border/30 text-white/70 hover:bg-white/5"
                  }`}
                >
                  Contact Us
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 px-6 border-t border-border/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Elevate Your Corporate Travel?
          </h2>
          <p className="text-muted-foreground/70 mb-8">
            Speak with our corporate aviation team to design a programme tailored to your business.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-10 py-4 rounded-lg text-base hover:opacity-90 transition-opacity"
          >
            Schedule a Consultation
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default B2BPortalPage;
