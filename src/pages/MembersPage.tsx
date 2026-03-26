import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Clock, UserCheck, Globe, HeartHandshake, Shield, ArrowRight, Check, Crown, Star, Award, Gem, Users, Plane, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const benefits = [
  { icon: Zap, title: "Preferential Pricing", desc: "Access charter rates typically reserved for high-volume operators and repeat clients." },
  { icon: Clock, title: "Priority Response", desc: "Faster aircraft sourcing and dedicated response times for every request." },
  { icon: UserCheck, title: "Dedicated Advisory", desc: "A personal team on standby, familiar with your preferences and standards." },
  { icon: Globe, title: "Global Fleet Access", desc: "Full flexibility across 7,000+ aircraft with no geographic restrictions." },
  { icon: HeartHandshake, title: "Concierge Integration", desc: "Ground transport, catering, hotels, and lifestyle services included with every trip." },
  { icon: Shield, title: "Personalised Profiles", desc: "Travel preferences, dietary needs, and cabin configurations stored and applied automatically." },
];

const tiers = [
  {
    icon: Star,
    name: "Elevate",
    tagline: "Your introduction to private aviation",
    accent: "from-white/10 to-white/5",
    cardBg: "bg-card",
    headerBg: "bg-gradient-to-br from-[hsl(0,0%,96%)] to-[hsl(0,0%,92%)]",
    textColor: "text-foreground",
    featured: false,
    benefits: [
      "Preferential charter pricing",
      "Dedicated aviation advisor",
      "Priority aircraft sourcing",
      "Complimentary concierge coordination",
      "Digital membership credential",
    ],
    cta: "Request Invitation",
  },
  {
    icon: Crown,
    name: "Founders Circle",
    tagline: "For distinguished private aviation clients",
    accent: "from-primary/30 to-primary/10",
    cardBg: "bg-gradient-to-b from-[hsl(var(--charcoal))] to-[hsl(var(--charcoal-deep))]",
    headerBg: "bg-gradient-to-br from-[hsl(var(--charcoal))] to-[hsl(var(--charcoal-deep))]",
    textColor: "text-white",
    featured: true,
    benefits: [
      "Everything in Elevate",
      "Best-in-market rate guarantee",
      "24/7 senior aviation director",
      "Global VIP lounge access",
      "Exclusive event invitations",
      "$1,000 referral travel credits",
    ],
    cta: "Apply for Access",
  },
  {
    icon: Gem,
    name: "Private Office",
    tagline: "Ultra-high-net-worth individuals & families",
    accent: "from-primary/20 to-primary/5",
    cardBg: "bg-card",
    headerBg: "bg-gradient-to-br from-[hsl(220,10%,8%)] to-[hsl(220,10%,5%)]",
    textColor: "text-white",
    featured: false,
    benefits: [
      "Everything in Founders Circle",
      "Bespoke contract terms",
      "Family office integration",
      "Multi-aircraft coordination",
      "Discreet personal liaison",
      "Custom billing structures",
    ],
    cta: "Private Consultation",
  },
  {
    icon: Award,
    name: "Corporate",
    tagline: "Tailored fleet solutions for organisations",
    accent: "from-white/10 to-white/5",
    cardBg: "bg-card",
    headerBg: "bg-gradient-to-br from-[hsl(0,0%,96%)] to-[hsl(0,0%,92%)]",
    textColor: "text-foreground",
    featured: false,
    benefits: [
      "Multi-user corporate accounts",
      "Consolidated billing & reporting",
      "Custom contract terms",
      "Dedicated operations team",
      "Fleet management advisory",
    ],
    cta: "Corporate Inquiry",
  },
];

const referralSteps = [
  { step: "01", title: "Join as a Member", desc: "Receive your personalised referral credential upon membership activation." },
  { step: "02", title: "Refer Trusted Contacts", desc: "Share your referral with colleagues, family, or associates who value private aviation." },
  { step: "03", title: "Earn Travel Credits", desc: "Receive $1,000 in travel credit when 3 referred members complete their first booking." },
];

const MembersPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Membership — Invitation Only | Universal Jets" description="Join Universal Jets membership for preferential pricing, priority aircraft sourcing, dedicated advisory, and concierge services on every private jet charter." path="/members" />
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
            Invitation Only
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold mb-6 text-foreground"
          >
            Private Access.{" "}
            <span className="text-gradient-gold italic">Elevated Service.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-base text-muted-foreground font-light max-w-xl mx-auto leading-relaxed"
          >
            Preferential pricing, faster response times, and a personalised service approach — without committing to prepaid hours. Limited invitations released monthly.
          </motion.p>
        </div>
      </section>

      {/* ═══ MEMBERSHIP TIER CARDS ═══ */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-8">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-[11px] tracking-[0.4em] uppercase text-primary mb-16 font-medium"
          >
            Membership Tiers
          </motion.p>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {tiers.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`relative rounded-2xl overflow-hidden transition-all duration-500 group ${
                  tier.featured
                    ? "shadow-[0_20px_60px_-15px_hsla(45,79%,46%,0.15)] ring-1 ring-primary/20"
                    : "shadow-[0_8px_30px_-12px_hsla(0,0%,0%,0.08)] hover:shadow-[0_16px_40px_-12px_hsla(0,0%,0%,0.12)]"
                } border border-border/50`}
              >
                {tier.featured && (
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-gold z-10" />
                )}

                {/* Card header — dark for featured tiers */}
                <div className={`${tier.headerBg} px-8 pt-10 pb-7 relative overflow-hidden`}>
                  {/* Subtle accent glow */}
                  <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${tier.accent} rounded-full blur-3xl -translate-y-1/2 translate-x-1/4`} />

                  <div className="relative z-10">
                    {tier.featured && (
                      <span className="inline-block px-3 py-1 bg-primary/15 text-primary text-[8px] tracking-[0.25em] uppercase font-medium rounded-full mb-5 border border-primary/20">
                        Most Popular
                      </span>
                    )}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl ${tier.featured ? "bg-primary/15 border border-primary/20" : "bg-primary/[0.06] border border-border/30"} flex items-center justify-center`}>
                        <tier.icon className={`w-5 h-5 ${tier.featured ? "text-primary" : "text-primary/50"}`} strokeWidth={1.2} />
                      </div>
                    </div>
                    <h3 className={`font-display text-2xl font-semibold mb-1 ${tier.textColor}`}>
                      {tier.name}
                    </h3>
                    <p className={`text-[13px] font-light ${tier.textColor === "text-white" ? "text-white/50" : "text-muted-foreground"}`}>
                      {tier.tagline}
                    </p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="bg-card px-8 py-7">
                  <div className="space-y-3 mb-8">
                    {tier.benefits.map((benefit, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                        <span className="text-[13px] text-foreground/65 font-light leading-[1.7]">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/contact"
                    className={`block text-center py-3.5 text-[10px] tracking-[0.2em] uppercase font-medium rounded-xl transition-all duration-500 ${
                      tier.featured
                        ? "bg-gradient-gold text-primary-foreground hover:shadow-[0_0_30px_-8px_hsla(45,79%,46%,0.4)]"
                        : "border border-border text-foreground/60 hover:border-primary/30 hover:text-primary"
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ KEY BENEFITS ═══ */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-8">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-[11px] tracking-[0.4em] uppercase text-primary mb-16 font-medium"
          >
            Member Privileges
          </motion.p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className="text-center group"
              >
                <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center mx-auto mb-7 group-hover:border-primary/30 transition-all duration-500">
                  <b.icon className="w-5 h-5 text-primary/60" strokeWidth={1.2} />
                </div>
                <h3 className="font-display text-lg mb-3 text-foreground">{b.title}</h3>
                <p className="text-[13px] text-muted-foreground font-light leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ REFERRAL PROGRAMME ═══ */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[11px] tracking-[0.4em] uppercase text-primary mb-6 font-medium">Referral Programme</p>
            <h2 className="font-display text-2xl md:text-4xl font-semibold text-foreground mb-4">
              Share the <span className="text-gradient-gold italic">Experience</span>
            </h2>
            <p className="text-[14px] text-muted-foreground font-light max-w-lg mx-auto leading-relaxed">
              Introduce trusted contacts to Universal Jets and earn travel credits toward your next charter.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {referralSteps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center mx-auto mb-5">
                  <span className="text-[13px] font-display text-primary font-semibold">{s.step}</span>
                </div>
                <h3 className="font-display text-lg mb-2 text-foreground">{s.title}</h3>
                <p className="text-[13px] text-muted-foreground font-light leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Terms */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 p-5 rounded-xl bg-muted/30 border border-border/30"
          >
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-primary/50 mt-0.5 flex-shrink-0" strokeWidth={1.3} />
              <p className="text-[11px] text-muted-foreground/60 font-light leading-[1.8]">
                Travel credit is issued upon completion of three qualifying bookings by referred members. Credits apply to future charter flights and are subject to review and approval by Universal Jets. Programme terms may be updated at any time.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container mx-auto px-8 text-center max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[11px] tracking-[0.4em] uppercase text-primary mb-8 font-medium">Limited Invitations</p>
            <h2 className="font-display text-2xl md:text-3xl mb-6 text-foreground">Request Membership Access</h2>
            <p className="text-[14px] text-muted-foreground font-light leading-relaxed mb-10">
              Speak with our advisory team to discuss which membership tier is right for your travel profile.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="px-10 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.2em] uppercase font-medium rounded-xl hover:shadow-[0_0_30px_-8px_hsla(45,79%,46%,0.4)] transition-all duration-500"
              >
                Request Invitation
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

      <Footer />
    </div>
  );
};

export default MembersPage;
