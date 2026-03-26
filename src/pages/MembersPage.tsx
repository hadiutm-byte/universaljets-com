import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Shield, ArrowRight, MessageCircle, Globe, Clock, Users, Plane, HeartHandshake, UserCheck, Zap, Calendar, Star } from "lucide-react";
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
    charterRequests: "Up to 6 confirmed requests/year",
    airportTransfer: "One-way airport transfer",
    concierge: "Standard concierge support",
    overageFee: "$150 per additional request",
    cardGradient: "linear-gradient(160deg, hsl(220 10% 22%) 0%, hsl(220 8% 14%) 40%, hsl(220 10% 18%) 100%)",
    shineColor: "hsla(220, 15%, 60%, 0.25)",
    featured: false,
    benefits: [
      "All-inclusive charter pricing",
      "Up to 6 confirmed requests/year",
      "72-hour notice period",
      "One-way airport transfer",
      "Standard concierge support",
      "Regional coverage",
    ],
    cta: "Enroll as Nomad",
  },
  {
    name: "Explorer",
    tagline: "For regular travelers seeking priority access",
    coverage: "Continental",
    monthlyPrice: "$1,200",
    noticePeriod: "48 hours",
    charterRequests: "Up to 12 confirmed requests/year",
    airportTransfer: "Round-trip airport transfer",
    concierge: "Priority concierge support",
    overageFee: "$120 per additional request",
    cardGradient: "linear-gradient(160deg, hsl(210 8% 26%) 0%, hsl(210 6% 16%) 40%, hsl(210 8% 20%) 100%)",
    shineColor: "hsla(210, 20%, 65%, 0.3)",
    featured: false,
    benefits: [
      "All-inclusive charter pricing",
      "Up to 12 confirmed requests/year",
      "48-hour notice period",
      "Round-trip airport transfer",
      "Priority concierge support",
      "Continental coverage",
    ],
    cta: "Enroll as Explorer",
  },
  {
    name: "Globetrotter",
    tagline: "For frequent global travelers",
    coverage: "Worldwide",
    monthlyPrice: "$2,500",
    noticePeriod: "24 hours",
    charterRequests: "Up to 24 confirmed requests/year",
    airportTransfer: "Round-trip airport transfer",
    concierge: "Dedicated account manager",
    overageFee: "$100 per additional request",
    cardGradient: "linear-gradient(160deg, hsl(200 6% 28%) 0%, hsl(200 5% 16%) 40%, hsl(200 6% 22%) 100%)",
    shineColor: "hsla(200, 15%, 70%, 0.3)",
    featured: true,
    benefits: [
      "All-inclusive charter pricing",
      "Up to 24 confirmed requests/year",
      "24-hour notice period",
      "Round-trip airport transfer",
      "Dedicated account manager",
      "Worldwide coverage",
    ],
    cta: "Enroll as Globetrotter",
  },
  {
    name: "Maverick",
    tagline: "The ultimate private aviation experience",
    coverage: "Worldwide — unrestricted",
    monthlyPrice: "$5,000",
    noticePeriod: "12 hours",
    charterRequests: "Unlimited confirmed requests",
    airportTransfer: "Round-trip airport transfer",
    concierge: "Personal account manager + private concierge desk",
    overageFee: "No overage fees",
    cardGradient: "linear-gradient(160deg, hsl(0 0% 8%) 0%, hsl(0 0% 3%) 40%, hsl(0 0% 6%) 100%)",
    shineColor: "hsla(40, 42%, 50%, 0.2)",
    featured: false,
    isMaverick: true,
    benefits: [
      "All-inclusive charter pricing",
      "Unlimited confirmed charter requests",
      "12-hour notice period",
      "Round-trip airport transfer",
      "Personal account manager",
      "Private concierge desk",
      "No overage fees",
      "Worldwide — unrestricted coverage",
    ],
    cta: "Apply for Maverick",
  },
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
  {
    q: "Can I upgrade or downgrade my membership tier?",
    a: "Yes. You may upgrade or downgrade your membership tier at any time. Changes take effect at the start of your next billing cycle. Speak with your advisor to arrange the transition.",
  },
  {
    q: "What happens if I exceed my annual charter request allowance?",
    a: "Additional charter requests beyond your tier allowance are handled at the applicable overage fee. Maverick members enjoy unlimited requests with no overage fees.",
  },
  {
    q: "Is there a commitment period?",
    a: "Membership is on a rolling monthly basis with no long-term contract required. You may cancel at any time with 30 days' notice.",
  },
  {
    q: "Can family members or associates use my membership?",
    a: "Yes. Your membership benefits extend to immediate family members and designated associates traveling under your account. Additional travelers can be registered with your advisor.",
  },
  {
    q: "What is the difference between Membership, Jet Card, and On-Demand?",
    a: "Membership provides priority access, exclusive rates, and concierge support on a monthly subscription. The Altus Jet Card Global lets you purchase flight hours in advance at locked-in rates. On-Demand charter offers maximum flexibility with no commitment — ideal for occasional travel.",
  },
];

const comparisonData = [
  { feature: "Commitment", membership: "Monthly subscription", jetCard: "Prepaid hours", onDemand: "None" },
  { feature: "Pricing", membership: "Exclusive member rates", jetCard: "Locked-in hourly rates", onDemand: "Market rates" },
  { feature: "Availability", membership: "Priority booking", jetCard: "Guaranteed availability", onDemand: "Subject to availability" },
  { feature: "Concierge", membership: "Included", jetCard: "Included", onDemand: "Available" },
  { feature: "Best for", membership: "Frequent flyers", jetCard: "Predictable budgeting", onDemand: "Maximum flexibility" },
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
    setRotateX((y - 0.5) * -12);
    setRotateY((x - 0.5) * 12);
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
      transition={{ delay: index * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`flex flex-col ${isMaverick ? "lg:col-span-1 relative" : ""}`}
    >
      {/* Maverick glow ring */}
      {isMaverick && (
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-primary/20 via-primary/5 to-transparent pointer-events-none -z-10 blur-sm" />
      )}

      {/* Physical Card */}
      <div
        className="relative rounded-2xl overflow-hidden aspect-[1.586/1] mb-8 cursor-pointer"
        style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="w-full h-full rounded-2xl relative overflow-hidden transition-transform duration-300 ease-out"
          style={{
            background: tier.cardGradient,
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            boxShadow: isMaverick
              ? "0 25px 60px -15px rgba(0,0,0,0.7), 0 0 40px -10px hsla(40,42%,42%,0.2)"
              : "0 25px 60px -15px rgba(0,0,0,0.4)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${shinePos.x}% ${shinePos.y}%, ${tier.shineColor} 0%, transparent 60%)`,
              opacity: rotateX !== 0 || rotateY !== 0 ? 1 : 0,
            }}
          />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Maverick gold edge */}
          {isMaverick && (
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          )}

          <div className="relative z-10 p-7 sm:p-8 h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <p className="text-[11px] tracking-[0.4em] uppercase text-white/50 font-medium">Universal Jets</p>
              {isMaverick && (
                <span className="px-2.5 py-1 bg-primary/15 rounded-full text-[7px] tracking-[0.2em] uppercase text-primary font-medium border border-primary/20">
                  Top Tier
                </span>
              )}
              {tier.featured && !isMaverick && (
                <span className="px-2.5 py-1 bg-white/10 rounded-full text-[7px] tracking-[0.2em] uppercase text-white/60 font-medium border border-white/10">
                  Popular
                </span>
              )}
            </div>

            <div>
              <h3 className="font-display text-3xl text-white font-semibold tracking-wide">{tier.name}</h3>
              <p className={`text-[11px] mt-1 font-light ${isMaverick ? "text-primary/60" : "text-white/50"}`}>{tier.tagline}</p>
            </div>

            <div className="flex items-end justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-8 rounded-[4px] border border-white/15 relative overflow-hidden"
                  style={{ background: isMaverick ? "linear-gradient(145deg, hsla(40,42%,50%,0.3) 0%, hsla(40,42%,42%,0.1) 100%)" : "linear-gradient(145deg, hsla(40,42%,50%,0.15) 0%, hsla(40,42%,42%,0.05) 100%)" }}
                >
                  <div className="absolute inset-[3px] border border-white/10 rounded-[2px]" />
                </div>
                <div>
                  <p className="text-[18px] text-white/80 font-display font-semibold">{tier.monthlyPrice}</p>
                  <p className="text-[8px] text-white/30 tracking-wider uppercase">/ month</p>
                </div>
              </div>
              <p className="text-[8px] tracking-[0.35em] uppercase text-white/25 font-light">Private Access</p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>

      {/* Key specs */}
      <div className="space-y-2.5 mb-5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground/60 font-light">Coverage</span>
          <span className="text-foreground/70 font-medium">{tier.coverage}</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground/60 font-light">Notice Period</span>
          <span className="text-foreground/70 font-medium">{tier.noticePeriod}</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground/60 font-light">Charter Requests</span>
          <span className="text-foreground/70 font-medium text-right">{tier.charterRequests}</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground/60 font-light">Airport Transfer</span>
          <span className="text-foreground/70 font-medium">{tier.airportTransfer}</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground/60 font-light">Support</span>
          <span className="text-foreground/70 font-medium text-right max-w-[60%]">{tier.concierge}</span>
        </div>
        {tier.overageFee !== "No overage fees" && (
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground/60 font-light">Overage</span>
            <span className="text-foreground/70 font-medium">{tier.overageFee}</span>
          </div>
        )}
        {tier.overageFee === "No overage fees" && (
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground/60 font-light">Overage</span>
            <span className="text-primary font-medium">No overage fees</span>
          </div>
        )}
      </div>

      <Link
        to={`/membership/enroll?tier=${tier.name.toLowerCase()}`}
        className={`block text-center py-3.5 text-[10px] tracking-[0.2em] uppercase font-medium rounded-xl transition-all duration-500 mt-auto ${
          isMaverick
            ? "bg-gradient-gold text-primary-foreground hover:shadow-[0_0_30px_-8px_hsla(40,42%,42%,0.4)]"
            : tier.featured
            ? "bg-gradient-gold text-primary-foreground hover:shadow-[0_0_30px_-8px_hsla(40,42%,42%,0.4)]"
            : "border border-border text-foreground/60 hover:border-primary/30 hover:text-primary"
        }`}
      >
        {tier.cta}
      </Link>
    </motion.div>
  );
};

const MembersPage = () => (
  <div className="min-h-screen bg-background">
    <SEOHead title="Membership — Universal Jets" description="Priority access, exclusive rates, concierge support, and a more seamless way to charter privately. Four tiers designed around how you fly." path="/membership" />
    <Navbar />

    {/* ═══ HERO ═══ */}
    <section className="pt-40 pb-16 md:pt-48 md:pb-24">
      <div className="container mx-auto px-8 text-center max-w-3xl">
        <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 1 }}
          className="w-12 h-[1px] bg-gradient-to-r from-transparent via-primary/80 to-transparent mx-auto mb-10 origin-center" />
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[11px] tracking-[0.5em] uppercase text-primary mb-6 font-medium">Membership</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold mb-6 text-foreground">
          Priority Access. <span className="text-gradient-gold italic">Elevated Service.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
          className="text-base text-muted-foreground font-light max-w-xl mx-auto leading-relaxed">
          Priority access, exclusive rates, concierge support, and a more seamless way to charter privately.
        </motion.p>
      </div>
    </section>

    {/* ═══ TIER CARDS ═══ */}
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-8">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center text-[11px] tracking-[0.4em] uppercase text-primary mb-16 font-medium">Choose Your Tier</motion.p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {tiers.map((tier, i) => <MembershipCard key={tier.name} tier={tier} index={i} />)}
        </div>
      </div>
    </section>

    {/* ═══ EVERY PLAN INCLUDES ═══ */}
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-[11px] tracking-[0.4em] uppercase text-primary mb-6 font-medium">Included</p>
          <h2 className="font-display text-2xl md:text-4xl font-semibold text-foreground">Every Plan <span className="text-gradient-gold italic">Includes</span></h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {sharedBenefits.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }} className="text-center group">
              <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center mx-auto mb-4 group-hover:border-primary/30 transition-all duration-500">
                <b.icon className="w-4.5 h-4.5 text-primary/60" strokeWidth={1.2} />
              </div>
              <p className="text-[12px] text-foreground/70 font-light leading-relaxed">{b.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══ COMPARISON TABLE ═══ */}
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-8 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-[11px] tracking-[0.4em] uppercase text-primary mb-6 font-medium">Compare</p>
          <h2 className="font-display text-2xl md:text-4xl font-semibold text-foreground mb-4">
            Membership vs Jet Card vs <span className="text-gradient-gold italic">On-Demand</span>
          </h2>
          <p className="text-[13px] text-muted-foreground font-light max-w-lg mx-auto leading-relaxed">
            Choose the model that fits how you fly.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="bg-muted/40">
                  <th className="text-left py-4 px-6 text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium">Feature</th>
                  <th className="text-left py-4 px-6 text-[10px] tracking-[0.2em] uppercase text-primary font-medium">Membership</th>
                  <th className="text-left py-4 px-6 text-[10px] tracking-[0.2em] uppercase text-primary font-medium">Jet Card</th>
                  <th className="text-left py-4 px-6 text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium">On-Demand</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr key={i} className="border-t border-border/50">
                    <td className="py-3.5 px-6 text-foreground/70 font-medium">{row.feature}</td>
                    <td className="py-3.5 px-6 text-foreground/60 font-light">{row.membership}</td>
                    <td className="py-3.5 px-6 text-foreground/60 font-light">{row.jetCard}</td>
                    <td className="py-3.5 px-6 text-foreground/60 font-light">{row.onDemand}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/membership/enroll" className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl hover:shadow-[0_0_30px_-8px_hsla(40,42%,42%,0.4)] transition-all duration-500">
            Enroll in Membership
          </Link>
          <Link to="/jet-card" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-border text-foreground/60 hover:text-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl transition-all duration-500">
            Explore Jet Card <ArrowRight size={10} />
          </Link>
        </div>
      </div>
    </section>

    {/* ═══ FAQ ═══ */}
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-8 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-[11px] tracking-[0.4em] uppercase text-primary mb-6 font-medium">FAQ</p>
          <h2 className="font-display text-2xl md:text-4xl font-semibold text-foreground">Frequently Asked <span className="text-gradient-gold italic">Questions</span></h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border border-border/50 rounded-xl px-6 bg-card">
              <AccordionTrigger className="text-[13px] text-foreground font-medium text-left py-5 hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-[13px] text-muted-foreground font-light leading-[1.9] pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>

    {/* ═══ REFERRAL ═══ */}
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-8 max-w-4xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[11px] tracking-[0.4em] uppercase text-primary mb-6 font-medium">Referral Programme</p>
          <h2 className="font-display text-2xl md:text-4xl font-semibold text-foreground mb-4">
            Share the <span className="text-gradient-gold italic">Experience</span>
          </h2>
          <p className="text-[14px] text-muted-foreground font-light max-w-lg mx-auto leading-relaxed mb-10">
            Invite 3 members → Earn $1,000 in flight credit toward your next charter.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {[
            { step: "01", title: "Join as a Member", desc: "Receive your personalised referral credential upon membership activation." },
            { step: "02", title: "Refer Trusted Contacts", desc: "Share your referral with colleagues, family, or associates who value private aviation." },
            { step: "03", title: "Earn Travel Credits", desc: "Receive $1,000 in travel credit when 3 referred members complete their first booking." },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }} className="text-center">
              <div className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center mx-auto mb-5">
                <span className="text-[13px] font-display text-primary font-semibold">{s.step}</span>
              </div>
              <h3 className="font-display text-lg mb-2 text-foreground">{s.title}</h3>
              <p className="text-[13px] text-muted-foreground font-light leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="p-5 rounded-xl bg-muted/30 border border-border/30 max-w-2xl mx-auto">
          <div className="flex items-start gap-3">
            <Shield className="w-4 h-4 text-primary/50 mt-0.5 flex-shrink-0" strokeWidth={1.3} />
            <p className="text-[11px] text-muted-foreground/60 font-light leading-[1.8]">
              Travel credit is issued upon completion of three qualifying bookings by referred members. Credits apply to future charter flights and are subject to review and approval. Programme terms may be updated at any time.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* ═══ CTA ═══ */}
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-8 text-center max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[11px] tracking-[0.4em] uppercase text-primary mb-8 font-medium">Get Started</p>
          <h2 className="font-display text-2xl md:text-3xl mb-6 text-foreground">Begin Your Membership</h2>
          <p className="text-[14px] text-muted-foreground font-light leading-relaxed mb-10">
            Choose your tier and complete your enrollment online. Your dedicated advisor will reach out within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/membership/enroll" className="px-10 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.2em] uppercase font-medium rounded-xl hover:shadow-[0_0_30px_-8px_hsla(40,42%,42%,0.4)] transition-all duration-500">
              Enroll Now
            </Link>
            <a href="https://wa.me/971585918498" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-3.5 text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-all duration-500 border border-border rounded-xl">
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
