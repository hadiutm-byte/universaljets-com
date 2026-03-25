import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const tiers = [
  {
    label: "Pay As You Go",
    tagline: "Best for occasional flights",
    features: [
      "Market pricing per trip",
      "No commitment",
      "Standard response time",
    ],
    cta: { text: "Request a Flight", href: "/#cta" },
    highlighted: false,
  },
  {
    label: "Membership",
    tagline: "Best for flexible frequent flyers",
    features: [
      "Preferential pricing",
      "Priority handling",
      "Personalized service",
    ],
    cta: { text: "Learn More", href: "/members" },
    highlighted: true,
  },
  {
    label: "Jet Card",
    tagline: "Best for high-frequency clients",
    features: [
      "Fixed hourly rates",
      "Guaranteed availability",
      "Dedicated account management",
    ],
    cta: { text: "Learn More", href: "/jet-card" },
    highlighted: false,
  },
];

const FlyYourWaySection = () => (
  <section className="section-padding relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(228,22%,5%)] to-transparent pointer-events-none" />

    <div className="container mx-auto px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">
          Tailored To You
        </p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold mb-6 text-foreground">
          Choose Your Way to Fly
        </h2>
        <p className="text-[13px] text-foreground/40 font-extralight max-w-md mx-auto leading-[2]">
          From one-off charters to fixed-rate programmes — find the model that fits your lifestyle.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className={`relative rounded-2xl p-8 md:p-10 flex flex-col transition-all duration-700 group ${
              tier.highlighted
                ? "glass border border-gold/20 shadow-[0_0_40px_-12px_hsla(45,79%,46%,0.15)]"
                : "glass luxury-border luxury-border-hover"
            }`}
          >
            {tier.highlighted && (
              <div className="absolute -top-px left-1/2 -translate-x-1/2 w-16 h-[2px] bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
            )}

            <p className="text-[9px] tracking-[0.4em] uppercase text-gold/70 mb-3 font-light">
              {tier.label}
            </p>
            <p className="text-[11px] text-foreground/40 font-extralight mb-8 leading-[1.8]">
              {tier.tagline}
            </p>

            <ul className="space-y-4 mb-10 flex-1">
              {tier.features.map((f, fi) => (
                <li key={fi} className="flex items-start gap-3">
                  <Check className="w-3.5 h-3.5 text-gold/60 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <span className="text-[12px] text-foreground/55 font-extralight leading-[1.8]">
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              to={tier.cta.href}
              className={`inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-sm text-[9px] tracking-[0.25em] uppercase font-medium transition-all duration-500 ${
                tier.highlighted
                  ? "bg-gradient-gold text-primary-foreground hover:shadow-[0_0_30px_-8px_hsla(45,79%,46%,0.45)]"
                  : "luxury-border text-foreground/50 hover:text-foreground/80 luxury-border-hover"
              }`}
            >
              {tier.cta.text} <ArrowRight size={10} />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Advisor guidance CTA */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-center mt-20 max-w-lg mx-auto"
      >
        <p className="text-[13px] text-foreground/50 font-extralight leading-[2] mb-2">
          Not sure which option fits you best?
        </p>
        <p className="text-[11px] text-foreground/30 font-extralight leading-[2] mb-8">
          Our advisors will guide you based on your travel frequency, routes, and preferences.
        </p>
        <Link
          to="/#cta"
          className="inline-flex items-center gap-2 px-10 py-3.5 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-sm hover:shadow-[0_0_30px_-8px_hsla(45,79%,46%,0.45)] transition-all duration-500"
        >
          Speak to an Advisor <ArrowRight size={10} />
        </Link>
      </motion.div>
    </div>
  </section>
);

export default FlyYourWaySection;
