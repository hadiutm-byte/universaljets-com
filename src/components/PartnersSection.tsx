import { motion } from "framer-motion";
import { CreditCard, Crown, Globe, Star, Gift, ArrowRight, Gem, ShieldCheck, Layers, Handshake } from "lucide-react";
import { FadeReveal } from "./ui/ScrollEffects";

const partnerLogos = [
  "Rolls-Royce", "Bombardier", "Gulfstream", "Embraer",
  "Dassault Aviation", "Textron Aviation", "VistaJet",
  "Jetex", "Universal Aviation", "ExcelAire",
  "Four Seasons", "Bentley", "Aman Hotels",
];

const partnerCards = [
  {
    icon: CreditCard,
    tag: "Featured",
    title: "Co-Branded Card Program",
    subtitle: "Visa Infinite · Mastercard World Elite",
    desc: "Integrated flight credits, priority booking, and exclusive lifestyle rewards linked directly to card activity. Built with leading financial institutions.",
    badges: ["Visa Infinite", "Mastercard World Elite", "Amex"],
    featured: true,
    cta: "Explore Program",
    href: "/partners",
  },
  {
    icon: Globe,
    tag: "Enterprise",
    title: "White-Label Aviation",
    subtitle: "Your Brand. Our Infrastructure.",
    desc: "Full charter operations under your brand identity. For banks, luxury brands, and corporate partners seeking seamless, branded aviation service.",
    badges: [],
    featured: false,
    cta: "Learn More",
    href: "/partners",
  },
  {
    icon: Handshake,
    tag: "Revenue Share",
    title: "Affiliate Program",
    subtitle: "Earn on Every Referral",
    desc: "Refer clients to Universal Jets and earn competitive commissions on charter bookings. Perfect for travel advisors, family offices, and luxury concierge services.",
    badges: [],
    featured: false,
    cta: "Join Program",
    href: "/partners",
  },
  {
    icon: Layers,
    tag: "Members",
    title: "Jet Card & Membership",
    subtitle: "Guaranteed Access. Fixed Rates.",
    desc: "Pre-purchased flight hours with guaranteed availability, fixed pricing, and priority positioning. The ultimate commitment to seamless private aviation.",
    badges: [],
    featured: false,
    cta: "View Plans",
    href: "/jet-card",
  },
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

      {/* Partner Cards — Co-Branded is dominant */}
      <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-24">
        {partnerCards.map((card, i) => (
          <FadeReveal key={card.title} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -6, boxShadow: card.featured
                ? "0 30px 80px -16px hsla(43, 85%, 58%, 0.22), 0 0 0 1px hsla(43, 85%, 58%, 0.15)"
                : "0 20px 60px -16px hsla(0, 0%, 0%, 0.12)"
              }}
              transition={{ duration: 0.35 }}
              className={`relative rounded-2xl p-8 md:p-10 h-full border transition-all duration-500 ${
                card.featured
                  ? "bg-gradient-to-br from-card via-card to-primary/[0.04] border-primary/20 shadow-[0_0_60px_-20px_hsla(43,85%,58%,0.1)]"
                  : "bg-card border-border shadow-sm"
              } ${card.featured ? "lg:col-span-2" : ""}`}
            >
              {/* Tag */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  card.featured ? "bg-primary/12" : "bg-muted"
                }`}>
                  <card.icon className={`w-5 h-5 ${card.featured ? "text-primary" : "text-foreground/40"}`} strokeWidth={1.2} />
                </div>
                <span className={`px-3 py-1 rounded-full text-[8px] tracking-[0.2em] uppercase font-medium ${
                  card.featured
                    ? "bg-primary/10 text-primary border border-primary/15"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {card.tag}
                </span>
              </div>

              <h3 className={`font-display font-semibold text-foreground leading-tight mb-2 ${
                card.featured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
              }`}>
                {card.title}
              </h3>
              <p className="text-[12px] tracking-[0.15em] uppercase text-primary/70 font-medium mb-4">{card.subtitle}</p>
              <p className={`text-muted-foreground font-light leading-[2] mb-6 ${
                card.featured ? "text-[15px] max-w-xl" : "text-[13px]"
              }`}>
                {card.desc}
              </p>

              {card.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {card.badges.map((badge) => (
                    <span key={badge} className="px-4 py-2 rounded-lg border border-border text-[10px] tracking-[0.12em] uppercase font-medium text-foreground/55 bg-card/80">
                      {badge}
                    </span>
                  ))}
                </div>
              )}

              <a
                href={card.href}
                className={`inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-medium transition-all duration-300 group ${
                  card.featured
                    ? "btn-luxury px-8 py-3.5 bg-gradient-gold text-white rounded-xl"
                    : "text-primary hover:text-primary/80"
                }`}
              >
                {card.cta} <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </a>

              {card.featured && (
                <div className="absolute top-0 right-0 w-40 h-40 bg-[radial-gradient(circle,_hsla(43,85%,58%,0.06)_0%,_transparent_70%)] pointer-events-none" />
              )}
            </motion.div>
          </FadeReveal>
        ))}
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
            <motion.div
              whileHover={{ y: -4, boxShadow: "0 16px 40px -12px hsla(0, 0%, 0%, 0.1)" }}
              className="py-8 px-5 text-center h-full rounded-2xl border border-border bg-card card-elevated"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-5"
              >
                <b.icon className="w-5 h-5 text-primary" strokeWidth={1.2} />
              </motion.div>
              <h4 className="font-display text-[14px] text-foreground font-medium mb-2">{b.title}</h4>
              <p className="text-[12px] text-muted-foreground font-light leading-[1.8]">{b.desc}</p>
            </motion.div>
          </FadeReveal>
        ))}
      </div>

      {/* Partner CTA */}
      <FadeReveal delay={0.2} className="text-center">
        <div className="inline-flex flex-col sm:flex-row items-center gap-4">
              <a
                href="/partners"
                className="btn-luxury px-10 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.28em] uppercase font-medium rounded-xl inline-flex items-center gap-2"
              >
                <ShieldCheck size={12} /> Become a Partner
              </a>
              <a
                href="/membership"
            className="btn-luxury px-10 py-4 border border-border bg-card hover:bg-muted text-foreground/70 hover:text-foreground text-[10px] tracking-[0.28em] uppercase font-medium rounded-xl transition-all"
          >
            Member Access
          </a>
        </div>
      </FadeReveal>
    </div>
  </section>
);

export default PartnersSection;
