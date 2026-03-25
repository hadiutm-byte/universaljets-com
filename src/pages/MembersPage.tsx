import { motion } from "framer-motion";
import { Zap, Clock, UserCheck, Globe, HeartHandshake, Shield, ArrowRight, Check, Crown, Star, Award } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const benefits = [
  { icon: Zap, title: "Net & Preferential Pricing", desc: "Access charter rates typically reserved for high-volume operators and repeat clients." },
  { icon: Clock, title: "Priority Response", desc: "Faster aircraft sourcing and dedicated response times for every request." },
  { icon: UserCheck, title: "Dedicated Support Team", desc: "A personal team on standby, familiar with your preferences and standards." },
  { icon: Globe, title: "Global Aircraft Access", desc: "Full flexibility across the worldwide fleet with no geographic restrictions." },
  { icon: HeartHandshake, title: "Concierge Services", desc: "Included with every trip — ground transport, catering, hotels, and more." },
  { icon: Shield, title: "Personalized Profiles", desc: "Travel preferences, dietary needs, and cabin configurations stored and applied automatically." },
];

const tiers = [
  {
    icon: Star,
    name: "Private Access",
    tagline: "Flexible charter with insider benefits",
    color: "from-[hsl(38,52%,60%)] to-[hsl(38,47%,52%)]",
    cardBg: "bg-gradient-to-br from-[hsl(38,52%,60%)] to-[hsl(38,47%,45%)]",
    benefits: [
      "Net pricing on every flight",
      "Priority aircraft sourcing",
      "Dedicated aviation advisor",
      "Complimentary concierge services",
      "Digital membership card",
    ],
  },
  {
    icon: Crown,
    name: "Founders Circle",
    tagline: "Elite access for distinguished clients",
    color: "from-[hsl(220,10%,15%)] to-[hsl(220,10%,8%)]",
    cardBg: "bg-gradient-to-br from-charcoal to-[hsl(220,10%,5%)]",
    featured: true,
    benefits: [
      "Everything in Private Access",
      "Best-in-market rate guarantee",
      "24/7 senior aviation director",
      "Global VIP lounge access",
      "Exclusive event invitations",
      "$1,000 referral flight credits",
    ],
  },
  {
    icon: Award,
    name: "Corporate",
    tagline: "Tailored solutions for organizations",
    color: "from-muted-foreground to-foreground",
    cardBg: "bg-gradient-to-br from-[hsl(210,17%,93%)] to-[hsl(210,14%,89%)]",
    benefits: [
      "Multi-user corporate accounts",
      "Consolidated billing & reporting",
      "Custom contract terms",
      "Dedicated operations team",
      "Fleet management advisory",
    ],
  },
];

const idealPoints = [
  "Fly occasionally to frequently",
  "Want preferential pricing without prepaid hours",
  "Value speed, discretion, and flexibility",
  "Expect a refined, responsive charter experience",
];

const MembersPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <section className="pt-40 pb-16 md:pt-48 md:pb-24 section-white">
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
          Membership
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold mb-6 text-foreground"
        >
          Flexible Access.{" "}
          <span className="text-gradient-gold italic">Elevated Service.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-[15px] text-muted-foreground font-light max-w-xl mx-auto leading-[2]"
        >
          Preferential pricing, faster response times, and a personalised service approach — without committing to prepaid hours.
        </motion.p>
      </div>
    </section>

    {/* Membership Tier Cards */}
    <section className="py-20 md:py-28 section-alt">
      <div className="container mx-auto px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-[11px] tracking-[0.5em] uppercase text-primary mb-16 font-medium"
        >
          Membership Tiers
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.7 }}
              className={`relative rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-15px_hsla(0,0%,0%,0.12)] ${
                tier.featured ? "ring-2 ring-primary/30 scale-[1.02]" : ""
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-0 left-0 right-0 z-10">
                  <div className="mx-auto w-fit px-5 py-1.5 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.3em] uppercase font-medium rounded-b-lg">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Card visual */}
              <div className={`${tier.cardBg} p-8 pt-10 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <tier.icon className={`w-8 h-8 mb-4 ${tier.featured ? "text-primary" : "text-foreground/30"}`} strokeWidth={1.2} />
                <h3 className={`font-display text-2xl font-semibold mb-2 ${tier.featured ? "text-white" : "text-foreground"}`}>
                  {tier.name}
                </h3>
                <p className={`text-[12px] font-light ${tier.featured ? "text-white/70" : "text-muted-foreground"}`}>
                  {tier.tagline}
                </p>
              </div>

              {/* Benefits */}
              <div className="bg-card p-8 border border-t-0 border-border rounded-b-2xl">
                <div className="space-y-3 mb-8">
                  {tier.benefits.map((benefit, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                      <span className="text-[13px] text-foreground/70 font-light leading-[1.7]">{benefit}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/contact"
                  className={`block text-center py-3.5 text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl transition-all duration-500 ${
                    tier.featured
                      ? "bg-gradient-gold text-primary-foreground hover:shadow-[0_0_30px_-8px_hsla(45,79%,46%,0.45)]"
                      : "border border-primary/20 text-primary hover:border-primary/40 hover:bg-primary/5"
                  }`}
                >
                  Request Access
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Key Benefits */}
    <section className="py-20 md:py-28 section-white">
      <div className="container mx-auto px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-[11px] tracking-[0.5em] uppercase text-primary mb-16 font-medium"
        >
          Key Benefits
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
              <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center mx-auto mb-7 group-hover:border-primary/30 group-hover:shadow-[0_0_20px_-5px_hsla(45,79%,46%,0.15)] transition-all duration-700">
                <b.icon className="w-5 h-5 text-primary/60" strokeWidth={1.2} />
              </div>
              <h3 className="font-display text-lg mb-3 text-foreground">{b.title}</h3>
              <p className="text-[13px] text-muted-foreground font-light leading-[1.9]">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Ideal For */}
    <section className="py-20 md:py-28 section-alt">
      <div className="container mx-auto px-8 max-w-2xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-[11px] tracking-[0.5em] uppercase text-primary mb-12 font-medium"
        >
          Ideal For
        </motion.p>

        <div className="rounded-2xl border border-border bg-card p-10 md:p-14 shadow-sm">
          <ul className="space-y-6">
            {idealPoints.map((point, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex items-start gap-4"
              >
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-[14px] text-foreground/70 font-light leading-[1.8]">{point}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 md:py-28 section-white">
      <div className="container mx-auto px-8 text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[11px] tracking-[0.5em] uppercase text-primary mb-8 font-medium">Get Started</p>
          <h2 className="font-display text-2xl md:text-3xl mb-6 text-foreground">Request Membership</h2>
          <p className="text-[14px] text-muted-foreground font-light leading-[2] mb-10">
            Speak with our team to learn how membership can enhance your charter experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-10 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl hover:shadow-[0_0_30px_-8px_hsla(45,79%,46%,0.45)] transition-all duration-500"
            >
              Contact Us
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-10 py-3.5 text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-all duration-500 border border-border rounded-xl"
            >
              Back to Home <ArrowRight size={10} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    <Footer />
  </div>
);

export default MembersPage;
