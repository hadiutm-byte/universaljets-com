import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Shield, ArrowRight, MessageCircle, Globe, Clock, Users, Plane, HeartHandshake, UserCheck, Zap, Calendar, Star, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

/* ═══ TIER DATA — Source of truth ═══ */
const tiers = [
  {
    name: "Nomad",
    tagline: "For the occasional private flyer",
    coverage: "Regional",
    monthlyPrice: "$500",
    noticePeriod: "72 hours",
    charterRequests: "Up to 6/year",
    airportTransfer: "One-way",
    concierge: "Standard",
    overageFee: "$150/request",
    highlights: ["Regional coverage", "Up to 6 requests/year", "72-hour notice", "Standard concierge", "All-inclusive pricing"],
    cardGradient: "linear-gradient(160deg, hsl(220 10% 16%) 0%, hsl(220 12% 9%) 50%, hsl(220 10% 13%) 100%)",
    shineColor: "hsla(220, 15%, 55%, 0.2)",
    cta: "Enroll as Nomad",
  },
  {
    name: "Explorer",
    tagline: "For regular travelers seeking priority",
    coverage: "Continental",
    monthlyPrice: "$1,200",
    noticePeriod: "48 hours",
    charterRequests: "Up to 12/year",
    airportTransfer: "Round-trip",
    concierge: "Priority",
    overageFee: "$120/request",
    highlights: ["Continental coverage", "Up to 12 requests/year", "48-hour notice", "Priority concierge", "Round-trip transfers"],
    cardGradient: "linear-gradient(160deg, hsl(215 10% 18%) 0%, hsl(215 12% 10%) 50%, hsl(215 10% 14%) 100%)",
    shineColor: "hsla(215, 20%, 60%, 0.25)",
    popular: true,
    cta: "Enroll as Explorer",
  },
  {
    name: "Globetrotter",
    tagline: "For frequent global travelers",
    coverage: "Worldwide",
    monthlyPrice: "$2,500",
    noticePeriod: "24 hours",
    charterRequests: "Up to 24/year",
    airportTransfer: "Round-trip",
    concierge: "Dedicated manager",
    overageFee: "$100/request",
    highlights: ["Worldwide coverage", "Up to 24 requests/year", "24-hour notice", "Dedicated account manager", "Round-trip transfers"],
    cardGradient: "linear-gradient(160deg, hsl(210 8% 20%) 0%, hsl(210 10% 11%) 50%, hsl(210 8% 16%) 100%)",
    shineColor: "hsla(210, 18%, 65%, 0.28)",
    cta: "Enroll as Globetrotter",
  },
  {
    name: "Maverick",
    tagline: "The ultimate private aviation experience",
    coverage: "Worldwide — unrestricted",
    monthlyPrice: "$5,000",
    noticePeriod: "12 hours",
    charterRequests: "Unlimited",
    airportTransfer: "Round-trip",
    concierge: "Personal + private desk",
    overageFee: "None",
    highlights: ["Unrestricted worldwide", "Unlimited requests", "12-hour notice", "Personal account manager", "Private concierge desk", "No overage fees"],
    cardGradient: "linear-gradient(160deg, hsl(0 0% 7%) 0%, hsl(0 0% 3%) 40%, hsl(0 0% 5%) 100%)",
    shineColor: "hsla(43, 74%, 52%, 0.18)",
    isMaverick: true,
    cta: "Apply for Maverick",
  },
];

const comparisonRows = [
  { label: "Coverage", values: ["Regional", "Continental", "Worldwide", "Worldwide — unrestricted"] },
  { label: "Notice Period", values: ["72 hours", "48 hours", "24 hours", "12 hours"] },
  { label: "Charter Requests", values: ["Up to 6/year", "Up to 12/year", "Up to 24/year", "Unlimited"] },
  { label: "Airport Transfer", values: ["One-way", "Round-trip", "Round-trip", "Round-trip"] },
  { label: "Support", values: ["Standard concierge", "Priority concierge", "Dedicated manager", "Personal manager + private desk"] },
  { label: "Overage Fee", values: ["$150/request", "$120/request", "$100/request", "No overage fees"] },
];

const sharedBenefits = [
  { icon: Plane, text: "All-inclusive charter pricing" },
  { icon: HeartHandshake, text: "Travel concierge services" },
  { icon: Globe, text: "Airport transfers" },
  { icon: Users, text: "Dedicated support team" },
  { icon: Zap, text: "Priority booking" },
  { icon: Star, text: "Exclusive rates" },
  { icon: Calendar, text: "Flexible cancellation" },
  { icon: Shield, text: "No long-term contracts" },
];

const faqs = [
  { q: "Can I upgrade or downgrade my membership tier?", a: "Yes. You may upgrade or downgrade your membership tier at any time. Changes take effect at the start of your next billing cycle. Speak with your advisor to arrange the transition." },
  { q: "What happens if I exceed my annual charter request allowance?", a: "Additional charter requests beyond your tier allowance are handled at the applicable overage fee. Maverick members enjoy unlimited requests with no overage fees." },
  { q: "Is there a commitment period?", a: "Membership is on a rolling monthly basis with no long-term contract required. You may cancel at any time with 30 days' notice." },
  { q: "Can family members or associates use my membership?", a: "Yes. Your membership benefits extend to immediate family members and designated associates traveling under your account. Additional travelers can be registered with your advisor." },
  { q: "What is the difference between Membership, Jet Card, and On-Demand?", a: "Membership provides priority access, exclusive rates, and concierge support on a monthly subscription. The Altus Jet Card Global lets you purchase flight hours in advance at locked-in rates. On-Demand charter offers maximum flexibility with no commitment — ideal for occasional travel." },
];

/* ═══ Membership Card ═══ */
const MembershipCard = ({ tier, index }: { tier: typeof tiers[0]; index: number }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });
  const isMaverick = "isMaverick" in tier && tier.isMaverick;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setRotateX((y - 0.5) * -10);
    setRotateY((x - 0.5) * 10);
    setShinePos({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setRotateX(0); setRotateY(0); setShinePos({ x: 50, y: 50 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col rounded-2xl overflow-hidden ${
        isMaverick
          ? "border-2 border-primary/20 bg-gradient-to-b from-[hsl(228,15%,7%)] to-[hsl(228,15%,4%)] shadow-[0_0_60px_-15px_hsla(43,74%,49%,0.15)]"
          : "border border-[hsl(228,12%,14%)] bg-gradient-to-b from-[hsl(228,15%,8%)] to-[hsl(228,15%,5%)]"
      }`}
    >
      {/* Card Visual */}
      <div
        className="relative aspect-[1.7/1] cursor-pointer p-1.5"
        style={{ perspective: "800px" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="w-full h-full rounded-xl relative overflow-hidden transition-transform duration-300 ease-out"
          style={{
            background: tier.cardGradient,
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            boxShadow: isMaverick
              ? "0 20px 50px -12px rgba(0,0,0,0.6), 0 0 30px -8px hsla(43,74%,49%,0.15), inset 0 1px 0 hsla(43,74%,49%,0.1)"
              : "0 20px 50px -12px rgba(0,0,0,0.4), inset 0 1px 0 hsla(0,0%,100%,0.08)",
          }}
        >
          {/* Shine effect */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${shinePos.x}% ${shinePos.y}%, ${tier.shineColor} 0%, transparent 55%)`,
              opacity: rotateX !== 0 || rotateY !== 0 ? 1 : 0,
            }}
          />
          {/* Top edge line */}
          <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent ${isMaverick ? "via-primary/35" : "via-white/15"} to-transparent`} />

          <div className="relative z-10 p-5 sm:p-6 h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <p className="text-[9px] tracking-[0.4em] uppercase text-white/40 font-medium">Universal Jets</p>
              {isMaverick && (
                <span className="px-2.5 py-0.5 bg-primary/12 rounded-full text-[7px] tracking-[0.2em] uppercase text-primary font-semibold border border-primary/20">
                  Premium
                </span>
              )}
              {"popular" in tier && tier.popular && (
                <span className="px-2 py-0.5 bg-white/8 rounded-full text-[7px] tracking-[0.15em] uppercase text-white/50 font-medium border border-white/8">
                  Popular
                </span>
              )}
            </div>

            <div>
              <h3 className={`font-display text-2xl sm:text-3xl text-white font-semibold tracking-wide ${isMaverick ? "text-primary/90" : ""}`}>{tier.name}</h3>
              <p className={`text-[10px] mt-0.5 font-light ${isMaverick ? "text-primary/40" : "text-white/35"}`}>{tier.tagline}</p>
            </div>

            <div className="flex items-end justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-6 rounded-[3px] border border-white/12"
                  style={{ background: isMaverick ? "linear-gradient(145deg, hsla(43,74%,52%,0.25) 0%, hsla(43,74%,49%,0.08) 100%)" : "linear-gradient(145deg, hsla(0,0%,100%,0.1) 0%, hsla(0,0%,100%,0.03) 100%)" }}
                />
                <div>
                  <p className="text-[16px] text-white/75 font-display font-semibold">{tier.monthlyPrice}</p>
                  <p className="text-[7px] text-white/25 tracking-wider uppercase">/ month</p>
                </div>
              </div>
              <p className="text-[7px] tracking-[0.3em] uppercase text-white/20 font-light">Private Access</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 pt-4 flex flex-col flex-1">
        {/* Highlights */}
        <div className="space-y-2.5 mb-6 flex-1">
          {tier.highlights.map((h, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${isMaverick ? "text-primary/60" : "text-foreground/25"}`} strokeWidth={1.5} />
              <span className={`text-[12px] font-light leading-[1.6] ${isMaverick ? "text-foreground/60" : "text-foreground/45"}`}>{h}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          to={`/membership/enroll?tier=${tier.name.toLowerCase()}`}
          className={`block text-center py-3.5 text-[10px] tracking-[0.2em] uppercase font-medium rounded-lg transition-all duration-500 ${
            isMaverick
              ? "bg-gradient-gold text-primary-foreground hover:shadow-[0_0_30px_-8px_hsla(43,74%,49%,0.4)] hover:scale-[1.01]"
              : "border border-[hsl(228,12%,18%)] text-foreground/50 hover:border-primary/25 hover:text-primary/80"
          }`}
        >
          {tier.cta}
        </Link>
      </div>
    </motion.div>
  );
};

const MembersPage = () => (
  <div className="min-h-screen bg-[hsl(228,20%,4%)]">
    <SEOHead title="Membership — Universal Jets" description="Priority access, exclusive rates, concierge support, and a more seamless way to charter privately. Four tiers designed around how you fly." path="/membership" />
    <Navbar />

    {/* ═══ HERO ═══ */}
    <section className="pt-40 pb-16 md:pt-48 md:pb-20 relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 30%, hsla(43,74%,49%,0.4) 0%, transparent 60%)" }} />
      <div className="container mx-auto px-8 text-center max-w-3xl relative z-10">
        <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 1 }}
          className="w-12 h-[1px] bg-gradient-to-r from-transparent via-primary/80 to-transparent mx-auto mb-10 origin-center" />
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/15 bg-primary/5 mb-8">
          <Crown className="w-3 h-3 text-primary/60" strokeWidth={1.5} />
          <span className="text-[8px] tracking-[0.4em] uppercase text-primary/60 font-medium">Private Access Network</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold mb-6 text-foreground leading-[1.1]">
          Priority Access. <span className="text-gradient-gold italic">Elevated Service.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="text-[14px] text-foreground/40 font-light max-w-xl mx-auto leading-[1.9]">
          Four tiers of private aviation membership — each designed around how you fly. Exclusive rates, dedicated support, and concierge services included.
        </motion.p>
      </div>
    </section>

    {/* ═══ TIER CARDS ═══ */}
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-8">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center text-[9px] tracking-[0.5em] uppercase text-primary/50 mb-14 font-light">Choose Your Tier</motion.p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {tiers.map((tier, i) => <MembershipCard key={tier.name} tier={tier} index={i} />)}
        </div>
      </div>
    </section>

    {/* ═══ EVERY PLAN INCLUDES ═══ */}
    <section className="py-16 md:py-24 border-y border-[hsl(228,12%,10%)]">
      <div className="container mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary/50 mb-5 font-light">Included</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">Every Plan <span className="text-gradient-gold italic">Includes</span></h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {sharedBenefits.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }} className="text-center">
              <div className="w-10 h-10 rounded-full border border-[hsl(228,12%,15%)] flex items-center justify-center mx-auto mb-3 bg-[hsl(228,15%,7%)]">
                <b.icon className="w-4 h-4 text-primary/50" strokeWidth={1.2} />
              </div>
              <p className="text-[11px] text-foreground/45 font-light leading-relaxed">{b.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══ DETAILED COMPARISON ═══ */}
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-8 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary/50 mb-5 font-light">Compare Tiers</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
            Tier <span className="text-gradient-gold italic">Comparison</span>
          </h2>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-xl border border-[hsl(228,12%,12%)] overflow-hidden bg-[hsl(228,15%,6%)]">
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-[hsl(228,12%,12%)]">
                  <th className="text-left py-4 px-5 text-[8px] tracking-[0.25em] uppercase text-foreground/25 font-medium w-[20%]" />
                  {tiers.map((t) => (
                    <th key={t.name} className={`text-center py-4 px-4 text-[9px] tracking-[0.2em] uppercase font-semibold ${
                      t.isMaverick ? "text-primary" : "text-foreground/50"
                    }`}>
                      {t.name}
                      <div className="text-[8px] font-light text-foreground/25 mt-0.5 tracking-normal normal-case">{t.monthlyPrice}/mo</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className="border-t border-[hsl(228,12%,10%)]">
                    <td className="py-3 px-5 text-foreground/35 font-medium text-[10px]">{row.label}</td>
                    {row.values.map((val, j) => (
                      <td key={j} className={`py-3 px-4 text-center font-light ${
                        j === 3 ? "text-primary/70" : "text-foreground/40"
                      } ${val === "Unlimited" || val === "No overage fees" ? "font-medium" : ""}`}>
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/membership/enroll" className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,74%,49%,0.4)] transition-all duration-500">
            Enroll in Membership
          </Link>
          <Link to="/jet-card" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-[hsl(228,12%,18%)] text-foreground/50 hover:text-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-lg transition-all duration-500">
            Explore Jet Card <ArrowRight size={10} />
          </Link>
        </div>
      </div>
    </section>

    {/* ═══ FAQ ═══ */}
    <section className="py-16 md:py-24 border-t border-[hsl(228,12%,10%)]">
      <div className="container mx-auto px-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary/50 mb-5 font-light">FAQ</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">Frequently Asked <span className="text-gradient-gold italic">Questions</span></h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border border-[hsl(228,12%,12%)] rounded-xl px-6 bg-[hsl(228,15%,6%)]">
              <AccordionTrigger className="text-[13px] text-foreground/70 font-medium text-left py-4 hover:no-underline hover:text-foreground transition-colors">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-[12px] text-foreground/35 font-light leading-[1.9] pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>

    {/* ═══ REFERRAL ═══ */}
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-8 max-w-4xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary/50 mb-5 font-light">Referral Programme</p>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
            Share the <span className="text-gradient-gold italic">Experience</span>
          </h2>
          <p className="text-[13px] text-foreground/35 font-light max-w-lg mx-auto leading-relaxed mb-10">
            Invite 3 members → Earn $1,000 in flight credit toward your next charter.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { step: "01", title: "Join as a Member", desc: "Receive your personalised referral credential upon activation." },
            { step: "02", title: "Refer Trusted Contacts", desc: "Share with colleagues, family, or associates who value private aviation." },
            { step: "03", title: "Earn Travel Credits", desc: "$1,000 credit when 3 referrals complete their first booking." },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }} className="text-center">
              <div className="w-10 h-10 rounded-full border border-primary/15 flex items-center justify-center mx-auto mb-4 bg-primary/5">
                <span className="text-[12px] font-display text-primary/70 font-semibold">{s.step}</span>
              </div>
              <h3 className="font-display text-[15px] mb-2 text-foreground font-medium">{s.title}</h3>
              <p className="text-[11px] text-foreground/30 font-light leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══ CTA ═══ */}
    <section className="py-16 md:py-24 border-t border-[hsl(228,12%,10%)] relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, hsla(43,74%,49%,0.3) 0%, transparent 60%)" }} />
      <div className="container mx-auto px-8 text-center max-w-lg relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[9px] tracking-[0.5em] uppercase text-primary/50 mb-6 font-light">Get Started</p>
          <h2 className="font-display text-2xl md:text-3xl mb-5 text-foreground">Begin Your <span className="text-gradient-gold italic">Membership</span></h2>
          <p className="text-[13px] text-foreground/35 font-light leading-relaxed mb-10">
            Choose your tier and complete enrollment online. Your dedicated advisor will reach out within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/membership/enroll" className="px-10 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.2em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,74%,49%,0.4)] transition-all duration-500">
              Enroll Now
            </Link>
            <a href="https://wa.me/971585918498" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-3.5 text-[10px] tracking-[0.2em] uppercase text-foreground/40 hover:text-foreground/60 transition-all duration-500 border border-[hsl(228,12%,18%)] rounded-lg">
              <MessageCircle size={12} /> Speak to Advisor
            </a>
          </div>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default MembersPage;