import { motion } from "framer-motion";
import { CreditCard, Crown, Globe, Star, Gift, ArrowRight, Gem, ShieldCheck } from "lucide-react";
import { FadeReveal, GlassCard } from "./ui/ScrollEffects";

const partnerLogos = [
  "Rolls-Royce", "Bombardier", "Gulfstream", "Embraer",
  "Dassault Aviation", "Textron Aviation", "VistaJet",
  "Jetex", "Universal Aviation", "ExcelAire",
  "Four Seasons", "Bentley", "Aman Hotels",
];

const memberBenefits = [
  { icon: Crown, title: "Hotel Upgrades", desc: "Complimentary suite upgrades at partner luxury hotels worldwide" },
  { icon: Gem, title: "Spa & Wellness", desc: "Priority access and exclusive rates at premium spas and retreats" },
  { icon: Star, title: "Premium Transport", desc: "Luxury ground transport and yacht charters at preferential rates" },
  { icon: Gift, title: "Travel Privileges", desc: "VIP lounge access, fast-track, and curated travel experiences" },
];

const PartnersSection = () => (
  <section className="py-28 md:py-36 relative overflow-hidden">
    <div className="container mx-auto px-8 relative z-10">
      {/* Header */}
      <FadeReveal className="text-center mb-20">
        <p className="text-[11px] tracking-[0.5em] uppercase text-primary mb-6 font-medium">Partner Ecosystem</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-5">
          A Network of <span className="text-gradient-gold italic">Excellence</span>
        </h2>
        <p className="text-[15px] text-muted-foreground font-light leading-[1.9] max-w-lg mx-auto">
          Universal Jets members enjoy exclusive privileges through our curated network of luxury partners and financial programs.
        </p>
      </FadeReveal>

      {/* Scrolling logo strip */}
      <div className="relative overflow-hidden py-6 mb-20">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="animate-scroll-logos flex gap-16 items-center whitespace-nowrap">
          {[...partnerLogos, ...partnerLogos].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-[13px] tracking-[0.3em] uppercase text-foreground/25 font-medium select-none flex-shrink-0 hover:text-primary transition-colors duration-500"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* Co-Branded Card Program */}
      <div className="grid lg:grid-cols-2 gap-14 max-w-5xl mx-auto mb-24">
        <FadeReveal>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-primary" strokeWidth={1.2} />
              <p className="text-[11px] tracking-[0.4em] uppercase text-primary font-medium">Co-Branded Card Program</p>
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-semibold text-foreground leading-tight">
              Visa Infinite &<br />
              Mastercard World Elite
            </h3>
            <p className="text-[14px] text-muted-foreground font-light leading-[2]">
              Universal Jets offers co-branded card programs in partnership with leading financial institutions. Members benefit from integrated flight credits, priority booking, and exclusive lifestyle rewards linked directly to their card activity.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {["Visa Infinite", "Mastercard World Elite", "Amex"].map((card) => (
                <span key={card} className="px-4 py-2 rounded-lg border border-border text-[11px] tracking-[0.15em] uppercase font-medium text-foreground/60 bg-card">
                  {card}
                </span>
              ))}
            </div>
          </div>
        </FadeReveal>

        <FadeReveal delay={0.15}>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-primary" strokeWidth={1.2} />
              <p className="text-[11px] tracking-[0.4em] uppercase text-primary font-medium">White-Label Aviation</p>
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-semibold text-foreground leading-tight">
              Your Brand.<br />
              Our Infrastructure.
            </h3>
            <p className="text-[14px] text-muted-foreground font-light leading-[2]">
              For financial institutions, luxury brands, and corporate partners — Universal Jets provides white-label charter solutions under your brand identity. Full operational support with your clients experiencing seamless, branded service.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-primary hover:text-primary/80 font-medium transition-colors group"
            >
              Explore Partnership <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </FadeReveal>
      </div>

      {/* Member Benefits */}
      <FadeReveal className="text-center mb-12">
        <p className="text-[11px] tracking-[0.4em] uppercase text-primary mb-4 font-medium">Member Privileges</p>
        <h3 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
          Exclusive Benefits Through Our Partners
        </h3>
      </FadeReveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto mb-16">
        {memberBenefits.map((b, i) => (
          <FadeReveal key={i} delay={i * 0.1}>
            <GlassCard className="py-8 px-5 text-center h-full">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-14 h-14 rounded-full glass-panel flex items-center justify-center mx-auto mb-5"
              >
                <b.icon className="w-5 h-5 text-primary" strokeWidth={1.2} />
              </motion.div>
              <h4 className="font-display text-[14px] text-foreground font-medium mb-2">{b.title}</h4>
              <p className="text-[12px] text-muted-foreground font-light leading-[1.8]">{b.desc}</p>
            </GlassCard>
          </FadeReveal>
        ))}
      </div>

      {/* Partner CTA */}
      <FadeReveal delay={0.2} className="text-center">
        <div className="inline-flex flex-col sm:flex-row items-center gap-4">
          <a
            href="/contact"
            className="btn-luxury px-10 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.28em] uppercase font-medium rounded-xl inline-flex items-center gap-2"
          >
            <ShieldCheck size={12} /> Become a Partner
          </a>
          <a
            href="/members"
            className="btn-luxury px-10 py-4 glass-panel text-foreground/70 hover:text-foreground text-[10px] tracking-[0.28em] uppercase font-medium rounded-xl"
          >
            Member Access
          </a>
        </div>
      </FadeReveal>
    </div>
  </section>
);

export default PartnersSection;
