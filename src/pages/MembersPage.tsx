import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Shield, ArrowRight, MessageCircle, Globe, Clock, Users, Plane, HeartHandshake, UserCheck, Zap, Calendar, Star, Crown, ChevronRight, Award, Lock, Headphones, CreditCard, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

/* ═══ TIER DATA ═══ */
const tiers = [
  {
    name: "Nomad",
    tagline: "For the occasional private flyer",
    monthlyPrice: "$500",
    highlights: ["Regional coverage", "Up to 6 requests / year", "72-hour notice", "Standard concierge", "All-inclusive pricing"],
    cta: "Enroll as Nomad",
  },
  {
    name: "Explorer",
    tagline: "For regular travelers seeking priority",
    monthlyPrice: "$1,200",
    highlights: ["Continental coverage", "Up to 12 requests / year", "48-hour notice", "Priority concierge", "Round-trip transfers"],
    popular: true,
    cta: "Enroll as Explorer",
  },
  {
    name: "Globetrotter",
    tagline: "For frequent global travelers",
    monthlyPrice: "$2,500",
    highlights: ["Worldwide coverage", "Up to 24 requests / year", "24-hour notice", "Dedicated account manager", "Round-trip transfers"],
    cta: "Enroll as Globetrotter",
  },
  {
    name: "Maverick",
    tagline: "The ultimate private aviation experience",
    monthlyPrice: "$5,000",
    highlights: ["Unrestricted worldwide access", "Unlimited charter requests", "12-hour notice guarantee", "Personal manager + private desk", "No overage fees — ever"],
    isMaverick: true,
    cta: "Apply for Maverick",
  },
];

const comparisonRows = [
  { label: "Coverage", values: ["Regional", "Continental", "Worldwide", "Worldwide — unrestricted"] },
  { label: "Notice Period", values: ["72 hours", "48 hours", "24 hours", "12 hours"] },
  { label: "Charter Requests", values: ["Up to 6/year", "Up to 12/year", "Up to 24/year", "Unlimited"] },
  { label: "Airport Transfer", values: ["One-way", "Round-trip", "Round-trip", "Round-trip"] },
  { label: "Support", values: ["Standard", "Priority", "Dedicated manager", "Personal + private desk"] },
  { label: "Overage Fee", values: ["$150/req", "$120/req", "$100/req", "None"] },
];

const trustPillars = [
  { icon: Clock, title: "Under 30 Minutes", desc: "Every inquiry answered by a real advisor — not a chatbot." },
  { icon: Globe, title: "7,000+ Aircraft", desc: "Access to the entire global private jet market, not a single fleet." },
  { icon: Shield, title: "Safety Certified", desc: "ARGUS, WYVERN, and IS-BAO vetted operators exclusively." },
  { icon: Lock, title: "No Lock-In", desc: "Monthly membership with no long-term contracts required." },
  { icon: Headphones, title: "Dedicated Advisors", desc: "Your own aviation specialist — available when you need them." },
  { icon: CreditCard, title: "All-Inclusive Pricing", desc: "Transparent quotes. No hidden fees, surcharges, or surprises." },
];

const howItWorks = [
  { step: "01", title: "Choose Your Tier", desc: "Select the membership level that matches your travel frequency and coverage needs." },
  { step: "02", title: "Meet Your Advisor", desc: "Within 24 hours, your dedicated aviation advisor reaches out to tailor your experience." },
  { step: "03", title: "Fly with Priority", desc: "Request flights, enjoy exclusive rates, and access concierge services — all from your membership." },
];

const benefits = [
  { icon: Plane, title: "Priority Aircraft Access", desc: "Members receive first-priority positioning on aircraft availability and scheduling." },
  { icon: Star, title: "Exclusive Member Rates", desc: "Preferential pricing across charter bookings — locked in for the duration of your membership." },
  { icon: HeartHandshake, title: "Travel Concierge", desc: "From hotel suites to ground transport, your concierge handles every detail beyond the flight." },
  { icon: Calendar, title: "Flexible Cancellation", desc: "Plans change. Cancel or reschedule with minimal notice — terms vary by tier." },
  { icon: Users, title: "Family & Associate Coverage", desc: "Extend your membership benefits to immediate family and designated associates." },
  { icon: Award, title: "Referral Programme", desc: "Refer 3 members, earn $1,000 in flight credit toward your next charter booking." },
];

const faqs = [
  { q: "Can I upgrade or downgrade my membership tier?", a: "Yes. You may upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle. Speak with your advisor to arrange the transition." },
  { q: "What happens if I exceed my annual charter request allowance?", a: "Additional requests beyond your tier allowance are handled at the applicable overage fee. Maverick members enjoy unlimited requests with no overage fees." },
  { q: "Is there a commitment period?", a: "Membership is on a rolling monthly basis with no long-term contract required. You may cancel at any time with 30 days' notice." },
  { q: "Can family members or associates use my membership?", a: "Yes. Benefits extend to immediate family and designated associates traveling under your account." },
  { q: "What's the difference between Membership, Jet Card, and On-Demand?", a: "Membership provides priority access and concierge support on a monthly subscription. The Altus Jet Card lets you purchase flight hours at locked-in rates. On-Demand charter offers maximum flexibility with no commitment." },
];

/* ═══ ANIMATION HELPERS ═══ */
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

/* ═══ TIER CARD ═══ */
const TierCard = ({ tier, index }: { tier: typeof tiers[0]; index: number }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const isMaverick = "isMaverick" in tier && tier.isMaverick;
  const isPopular = "popular" in tier && tier.popular;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setRotateX((y - 0.5) * -8);
    setRotateY((x - 0.5) * 8);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setRotateX(0); setRotateY(0); }}
      className="group relative"
      style={{ perspective: "900px" }}
    >
      {/* Maverick glow */}
      {isMaverick && (
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-primary/30 via-primary/10 to-primary/5 blur-[1px]" />
      )}

      <div
        className={`relative flex flex-col rounded-2xl overflow-hidden transition-transform duration-300 ease-out h-full ${
          isMaverick
            ? "border border-primary/25"
            : isPopular
            ? "border border-primary/15"
            : "border border-[hsl(228,12%,16%)]"
        }`}
        style={{
          background: isMaverick
            ? "linear-gradient(180deg, hsl(228,12%,9%) 0%, hsl(228,15%,5%) 100%)"
            : "linear-gradient(180deg, hsl(228,12%,10%) 0%, hsl(228,15%,7%) 100%)",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        {/* Badge */}
        {(isMaverick || isPopular) && (
          <div className="absolute top-4 right-4 z-20">
            <span className={`px-3 py-1 rounded-full text-[7px] tracking-[0.2em] uppercase font-semibold border ${
              isMaverick
                ? "bg-primary/10 text-primary border-primary/25"
                : "bg-white/5 text-white/60 border-white/10"
            }`}>
              {isMaverick ? "Flagship" : "Most Popular"}
            </span>
          </div>
        )}

        {/* Header */}
        <div className="p-6 pb-4 pt-8">
          <p className="text-[8px] tracking-[0.4em] uppercase text-foreground/30 font-medium mb-1">Universal Jets</p>
          <h3 className={`font-display text-2xl font-semibold mb-1 ${isMaverick ? "text-primary" : "text-foreground/90"}`}>
            {tier.name}
          </h3>
          <p className="text-[11px] text-foreground/35 font-light mb-5">{tier.tagline}</p>

          <div className="flex items-baseline gap-1.5 mb-1">
            <span className={`text-[28px] font-display font-semibold ${isMaverick ? "text-primary" : "text-foreground/85"}`}>
              {tier.monthlyPrice}
            </span>
            <span className="text-[10px] text-foreground/30 font-light">/ month</span>
          </div>
        </div>

        {/* Divider */}
        <div className={`h-[1px] mx-6 ${isMaverick ? "bg-primary/15" : "bg-foreground/[0.06]"}`} />

        {/* Features */}
        <div className="p-6 pt-5 flex flex-col flex-1">
          <div className="space-y-3.5 mb-8 flex-1">
            {tier.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  isMaverick ? "bg-primary/15" : "bg-foreground/[0.05]"
                }`}>
                  <Check className={`w-2.5 h-2.5 ${isMaverick ? "text-primary" : "text-primary/50"}`} strokeWidth={2.5} />
                </div>
                <span className={`text-[12px] leading-[1.6] ${isMaverick ? "text-foreground/80" : "text-foreground/60"} font-light`}>
                  {h}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            to={`/membership/enroll?tier=${tier.name.toLowerCase()}`}
            className={`block text-center py-4 text-[10px] tracking-[0.2em] uppercase font-medium rounded-xl transition-all duration-500 ${
              isMaverick
                ? "bg-gradient-gold text-primary-foreground hover:shadow-[0_0_40px_-10px_hsla(43,74%,49%,0.5)] hover:scale-[1.01]"
                : isPopular
                ? "bg-primary/10 border border-primary/20 text-primary hover:bg-primary/15 hover:shadow-[0_0_25px_-8px_hsla(43,74%,49%,0.3)]"
                : "bg-[hsl(228,10%,15%)] border border-[hsl(228,12%,20%)] text-foreground/60 hover:bg-[hsl(228,10%,18%)] hover:text-foreground hover:border-primary/15"
            }`}
          >
            {tier.cta}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══ PAGE ═══ */
const MembersPage = () => (
  <div className="min-h-screen bg-[hsl(228,20%,4%)]">
    <SEOHead
      title="Membership — Universal Jets"
      description="Priority access, exclusive rates, concierge support, and a more seamless way to charter privately. Four tiers designed around how you fly."
      path="/membership"
    />
    <Navbar />

    {/* ════════════════════════════════════════════════════════
        1. HERO
    ════════════════════════════════════════════════════════ */}
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsl(228,18%,4%) 0%, hsl(228,14%,7%) 50%, hsl(228,18%,4%) 100%)" }} />
      <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse 55% 35% at 50% 40%, hsla(43,74%,49%,0.12) 0%, transparent 70%)" }} />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-8 text-center max-w-3xl relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-primary/15 bg-primary/[0.04] mb-10"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[8px] tracking-[0.4em] uppercase text-primary/70 font-medium">
            Limited Invitations Released Monthly
          </span>
        </motion.div>

        {/* Headline — high contrast */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-5xl lg:text-[3.75rem] font-display font-semibold text-white leading-[1.1] mb-5"
        >
          Private Aviation{" "}
          <span className="text-gradient-gold italic block mt-1">Membership</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-[20px] text-white/35 font-extralight tracking-[0.08em] mb-6"
        >
          By Invitation Only
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="text-[14px] md:text-[15px] text-foreground/45 font-light leading-[2] max-w-lg mx-auto mb-12"
        >
          Priority access. Dedicated advisors. Exclusive rates and concierge services — 
          reserved for members of the Universal Jets network.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/membership/enroll"
            className="px-10 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.3em] uppercase font-semibold rounded-xl hover:shadow-[0_0_50px_-12px_hsla(43,74%,49%,0.5)] transition-all duration-500"
          >
            Request Membership
          </Link>
          <a
            href="https://wa.me/971585918498"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-10 py-4 border border-white/10 text-white/45 hover:text-white/70 hover:border-white/20 text-[10px] tracking-[0.3em] uppercase font-light rounded-xl transition-all duration-500"
          >
            <MessageCircle size={12} />
            Speak to Advisor
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
    </section>

    {/* ════════════════════════════════════════════════════════
        2. TRUST — Why Universal Jets
    ════════════════════════════════════════════════════════ */}
    <section className="py-20 md:py-28 relative">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsl(228,14%,7%) 0%, hsl(228,16%,5.5%) 100%)" }} />
      <div className="container mx-auto px-8 max-w-5xl relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary/50 mb-4 font-light">Why Universal Jets</p>
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground leading-tight">
            Built for Clients Who{" "}
            <span className="text-gradient-gold italic">Expect More</span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {trustPillars.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="rounded-xl border border-[hsl(228,12%,12%)] bg-[hsl(228,14%,7%)] p-6 hover:border-primary/10 transition-colors duration-500"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/[0.06] border border-primary/10 flex items-center justify-center mb-4">
                <p.icon className="w-4.5 h-4.5 text-primary/60" strokeWidth={1.5} />
              </div>
              <h3 className="text-[14px] font-display font-semibold text-foreground/85 mb-2">{p.title}</h3>
              <p className="text-[12px] text-foreground/40 font-light leading-[1.8]">{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ════════════════════════════════════════════════════════
        3. MEMBERSHIP TIERS
    ════════════════════════════════════════════════════════ */}
    <section className="py-20 md:py-28 relative">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsl(228,16%,5.5%) 0%, hsl(228,18%,4.5%) 100%)" }} />
      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary/50 mb-4 font-light">Membership Tiers</p>
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
            Choose Your <span className="text-gradient-gold italic">Level of Access</span>
          </h2>
          <p className="text-[13px] text-foreground/40 font-light max-w-lg mx-auto mt-4 leading-relaxed">
            Each tier is designed around how you fly — from occasional regional trips to unlimited global coverage.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {tiers.map((tier, i) => <TierCard key={tier.name} tier={tier} index={i} />)}
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <p className="text-center text-[9px] tracking-[0.4em] uppercase text-foreground/30 mb-6 font-light">Detailed Comparison</p>
          <div className="rounded-xl border border-[hsl(228,12%,12%)] overflow-hidden bg-[hsl(228,14%,6%)]">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-[hsl(228,12%,12%)]">
                    <th className="text-left py-4 px-5 text-[8px] tracking-[0.25em] uppercase text-foreground/25 font-medium w-[20%]" />
                    {tiers.map((t) => (
                      <th key={t.name} className={`text-center py-4 px-4 text-[9px] tracking-[0.15em] uppercase font-semibold ${
                        t.isMaverick ? "text-primary" : "text-foreground/55"
                      }`}>
                        {t.name}
                        <div className="text-[8px] font-light text-foreground/30 mt-0.5 tracking-normal normal-case">{t.monthlyPrice}/mo</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={i} className="border-t border-[hsl(228,12%,10%)]">
                      <td className="py-3.5 px-5 text-foreground/40 font-medium text-[10px]">{row.label}</td>
                      {row.values.map((val, j) => (
                        <td key={j} className={`py-3.5 px-4 text-center font-light ${
                          j === 3 ? "text-primary/80" : "text-foreground/50"
                        } ${val === "Unlimited" || val === "None" ? "font-medium" : ""}`}>
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ════════════════════════════════════════════════════════
        4. HOW IT WORKS
    ════════════════════════════════════════════════════════ */}
    <section className="py-20 md:py-28 relative border-y border-[hsl(228,12%,10%)]">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsl(228,18%,4.5%) 0%, hsl(228,14%,7%) 100%)" }} />
      <div className="container mx-auto px-8 max-w-4xl relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary/50 mb-4 font-light">How It Works</p>
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
            Three Steps to{" "}
            <span className="text-gradient-gold italic">Priority Access</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-6">
          {howItWorks.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center relative"
            >
              {/* Step number */}
              <div className="w-14 h-14 rounded-full border border-primary/15 flex items-center justify-center mx-auto mb-5 bg-primary/[0.04]">
                <span className="text-[16px] font-display text-primary/70 font-semibold">{s.step}</span>
              </div>

              {/* Connector line (desktop only) */}
              {i < 2 && (
                <div className="hidden md:block absolute top-7 left-[calc(50%+28px)] w-[calc(100%-56px)] h-[1px] bg-gradient-to-r from-primary/15 to-primary/5" />
              )}

              <h3 className="font-display text-[16px] mb-3 text-foreground/90 font-semibold">{s.title}</h3>
              <p className="text-[12px] text-foreground/40 font-light leading-[1.9] max-w-[240px] mx-auto">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ════════════════════════════════════════════════════════
        5. BENEFITS — Scannable blocks
    ════════════════════════════════════════════════════════ */}
    <section className="py-20 md:py-28 relative">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsl(228,14%,7%) 0%, hsl(228,16%,5%) 100%)" }} />
      <div className="container mx-auto px-8 max-w-5xl relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary/50 mb-4 font-light">Member Benefits</p>
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
            Every Membership{" "}
            <span className="text-gradient-gold italic">Includes</span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="flex gap-4 p-5 rounded-xl border border-[hsl(228,12%,11%)] bg-[hsl(228,14%,6.5%)] hover:border-primary/10 transition-colors duration-500"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/[0.06] border border-primary/10 flex items-center justify-center flex-shrink-0">
                <b.icon className="w-4 h-4 text-primary/55" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-[13px] font-display font-semibold text-foreground/80 mb-1.5">{b.title}</h3>
                <p className="text-[11px] text-foreground/40 font-light leading-[1.8]">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ════════════════════════════════════════════════════════
        FAQ
    ════════════════════════════════════════════════════════ */}
    <section className="py-16 md:py-24 border-t border-[hsl(228,12%,10%)]">
      <div className="container mx-auto px-8 max-w-3xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary/50 mb-4 font-light">FAQ</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
            Frequently Asked <span className="text-gradient-gold italic">Questions</span>
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border border-[hsl(228,12%,12%)] rounded-xl px-6 bg-[hsl(228,14%,7%)]">
              <AccordionTrigger className="text-[13px] text-foreground/75 font-medium text-left py-4 hover:no-underline hover:text-foreground transition-colors">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-[12px] text-foreground/45 font-light leading-[1.9] pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>

    {/* ════════════════════════════════════════════════════════
        6. FINAL CTA
    ════════════════════════════════════════════════════════ */}
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsl(228,14%,5%) 0%, hsl(228,18%,3.5%) 100%)" }} />
      <div className="absolute inset-0 opacity-25" style={{ background: "radial-gradient(ellipse 50% 40% at 50% 50%, hsla(43,74%,49%,0.1) 0%, transparent 65%)" }} />

      <div className="container mx-auto px-8 text-center max-w-xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <BadgeCheck className="w-8 h-8 text-primary/40 mx-auto mb-6" strokeWidth={1.2} />
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-white mb-5 leading-tight">
            Your Private Aviation{" "}
            <span className="text-gradient-gold italic">Starts Here</span>
          </h2>
          <p className="text-[13px] text-foreground/45 font-light leading-[1.9] mb-10 max-w-md mx-auto">
            Choose your tier and complete enrollment online. Your dedicated advisor will reach out within 24 hours to tailor your experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/membership/enroll"
              className="px-10 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-semibold rounded-xl hover:shadow-[0_0_50px_-12px_hsla(43,74%,49%,0.5)] transition-all duration-500"
            >
              Enroll in Membership
            </Link>
            <Link
              to="/jet-card"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-[hsl(228,12%,18%)] text-foreground/55 hover:text-foreground/80 hover:border-primary/15 text-[10px] tracking-[0.25em] uppercase font-light rounded-xl transition-all duration-500"
            >
              Explore Jet Card <ArrowRight size={11} />
            </Link>
          </div>

          <p className="text-[10px] text-foreground/20 font-extralight tracking-wide">
            All enquiries are confidential · No long-term commitment required
          </p>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default MembersPage;
