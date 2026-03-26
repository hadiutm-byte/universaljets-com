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
    name: "Silver",
    tagline: "Your introduction to private aviation",
    cardGradient: "linear-gradient(160deg, hsl(0 0% 72%) 0%, hsl(0 0% 56%) 40%, hsl(0 0% 64%) 100%)",
    shineColor: "hsla(0, 0%, 100%, 0.35)",
    textAccent: "text-white/60",
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
    name: "Gold",
    tagline: "For distinguished private aviation clients",
    cardGradient: "linear-gradient(160deg, hsl(40 42% 52%) 0%, hsl(40 42% 36%) 40%, hsl(40 42% 46%) 100%)",
    shineColor: "hsla(40, 42%, 70%, 0.4)",
    textAccent: "text-white/70",
    featured: false,
    benefits: [
      "Everything in Silver",
      "Priority support & faster quotes",
      "Member-only empty leg alerts",
      "Concierge coordination included",
      "Guest access for travel companions",
    ],
    cta: "Request Invitation",
  },
  {
    name: "Platinum",
    tagline: "Priority access and elite service",
    cardGradient: "linear-gradient(160deg, hsl(210 8% 62%) 0%, hsl(210 8% 42%) 40%, hsl(210 8% 52%) 100%)",
    shineColor: "hsla(210, 20%, 80%, 0.35)",
    textAccent: "text-white/65",
    featured: true,
    benefits: [
      "Everything in Gold",
      "Best-in-market rate guarantee",
      "24/7 senior aviation director",
      "Global VIP lounge access",
      "Exclusive event invitations",
      "$1,000 referral travel credits",
    ],
    cta: "Apply for Access",
  },
  {
    name: "Black",
    tagline: "The pinnacle — full VIP access",
    cardGradient: "linear-gradient(160deg, hsl(0 0% 12%) 0%, hsl(0 0% 4%) 40%, hsl(0 0% 8%) 100%)",
    shineColor: "hsla(40, 42%, 50%, 0.25)",
    textAccent: "text-primary/60",
    featured: false,
    benefits: [
      "Everything in Platinum",
      "Dedicated personal liaison",
      "Bespoke contract terms",
      "Multi-aircraft coordination",
      "Family office integration",
      "Custom billing structures",
    ],
    cta: "Private Consultation",
  },
];

const referralSteps = [
  { step: "01", title: "Join as a Member", desc: "Receive your personalised referral credential upon membership activation." },
  { step: "02", title: "Refer Trusted Contacts", desc: "Share your referral with colleagues, family, or associates who value private aviation." },
  { step: "03", title: "Earn Travel Credits", desc: "Receive $1,000 in travel credit when 3 referred members complete their first booking." },
];

/* Physical membership card component */
const MembershipCard = ({ tier, index }: { tier: typeof tiers[0]; index: number }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setRotateX((y - 0.5) * -12);
    setRotateY((x - 0.5) * 12);
    setShinePos({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setShinePos({ x: 50, y: 50 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col"
    >
      {/* Physical Card */}
      <div
        className="relative rounded-2xl overflow-hidden aspect-[1.586/1] mb-8 cursor-pointer"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="w-full h-full rounded-2xl relative overflow-hidden transition-transform duration-300 ease-out"
          style={{
            background: tier.cardGradient,
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            boxShadow: tier.name === "Black"
              ? "0 25px 60px -15px rgba(0,0,0,0.7), 0 0 40px -10px hsla(40,42%,42%,0.15)"
              : "0 25px 60px -15px rgba(0,0,0,0.4)",
          }}
        >
          {/* Shine / reflection */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${shinePos.x}% ${shinePos.y}%, ${tier.shineColor} 0%, transparent 60%)`,
              opacity: rotateX !== 0 || rotateY !== 0 ? 1 : 0,
            }}
          />

          {/* Top edge light */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Card content */}
          <div className="relative z-10 p-7 sm:p-8 h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <p className="text-[11px] tracking-[0.4em] uppercase text-white/50 font-medium">Universal Jets</p>
              {tier.featured && (
                <span className="px-2.5 py-1 bg-white/10 rounded-full text-[7px] tracking-[0.2em] uppercase text-white/60 font-medium border border-white/10">
                  Most Popular
                </span>
              )}
            </div>

            <div>
              <h3 className="font-display text-3xl text-white font-semibold tracking-wide">{tier.name}</h3>
              <p className={`text-[11px] mt-1 font-light ${tier.textAccent}`}>{tier.tagline}</p>
            </div>

            <div className="flex items-end justify-between">
              <div className="flex items-center gap-3">
                {/* Chip emboss */}
                <div
                  className="w-10 h-8 rounded-[4px] border border-white/15 relative overflow-hidden"
                  style={{ background: "linear-gradient(145deg, hsla(40,42%,50%,0.25) 0%, hsla(40,42%,42%,0.1) 100%)" }}
                >
                  <div className="absolute inset-[3px] border border-white/10 rounded-[2px]" />
                </div>
              </div>
              <p className="text-[8px] tracking-[0.35em] uppercase text-white/25 font-light">Private Access Network</p>
            </div>
          </div>

          {/* Bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>

      {/* Benefits list below card */}
      <div className="space-y-3 mb-6 flex-1">
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
            ? "bg-gradient-gold text-primary-foreground hover:shadow-[0_0_30px_-8px_hsla(40,42%,42%,0.4)]"
            : "border border-border text-foreground/60 hover:border-primary/30 hover:text-primary"
        }`}
      >
        {tier.cta}
      </Link>
    </motion.div>
  );
};

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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier, i) => (
              <MembershipCard key={tier.name} tier={tier} index={i} />
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
              Invite 3 members → Earn $1,000 in flight credit toward your next charter.
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
                className="px-10 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.2em] uppercase font-medium rounded-xl hover:shadow-[0_0_30px_-8px_hsla(40,42%,42%,0.4)] transition-all duration-500"
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
