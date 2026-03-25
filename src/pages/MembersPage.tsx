import { motion } from "framer-motion";
import { Zap, Clock, UserCheck, Globe, HeartHandshake, Shield, ArrowRight, Check } from "lucide-react";
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
    <section className="pt-40 pb-16 md:pt-48 md:pb-24">
      <div className="container mx-auto px-8 text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1 }}
          className="w-12 h-[1px] bg-gradient-to-r from-transparent via-gold/80 to-transparent mx-auto mb-10 origin-center"
        />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[9px] tracking-[0.5em] uppercase text-gold/70 mb-6 font-light"
        >
          Membership
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold mb-6"
        >
          Flexible Access.{" "}
          <span className="text-gradient-gold italic">Elevated Service.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-[13px] text-foreground/50 font-extralight max-w-xl mx-auto leading-[2.2]"
        >
          Preferential pricing, faster response times, and a personalised service approach — without committing to prepaid hours.
        </motion.p>
      </div>
    </section>

    {/* Tagline */}
    <section className="pb-20">
      <div className="container mx-auto px-8 max-w-2xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-[12px] text-foreground/35 font-extralight leading-[2.4] italic"
        >
          "The Universal Jets Membership is tailored for clients who seek flexibility with enhanced benefits, aligned with their travel preferences."
        </motion.p>
      </div>
    </section>

    {/* Key Benefits */}
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-8">
        <div className="divider-gold mb-20" />
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-[9px] tracking-[0.5em] uppercase text-gold/60 mb-16 font-light"
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
              <div className="w-14 h-14 rounded-full luxury-border flex items-center justify-center mx-auto mb-7 group-hover:glow-subtle transition-all duration-700">
                <b.icon className="w-5 h-5 text-gold/60" strokeWidth={1.2} />
              </div>
              <h3 className="font-display text-lg mb-3">{b.title}</h3>
              <p className="text-[12px] text-muted-foreground font-extralight leading-[2]">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Ideal For */}
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-8 max-w-2xl">
        <div className="divider-gold mb-20" />
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-[9px] tracking-[0.5em] uppercase text-gold/60 mb-12 font-light"
        >
          Ideal For
        </motion.p>

        <div className="glass rounded-2xl p-10 md:p-14">
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
                <Check className="w-4 h-4 text-gold/70 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-[13px] text-foreground/60 font-extralight leading-[1.8]">{point}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-8 text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[9px] tracking-[0.5em] uppercase text-gold/60 mb-8 font-light">Get Started</p>
          <h2 className="font-display text-2xl md:text-3xl mb-6">Request Membership</h2>
          <p className="text-[12px] text-foreground/40 font-extralight leading-[2] mb-10">
            Speak with our team to learn how membership can enhance your charter experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/#cta"
              className="px-10 py-3.5 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-sm hover:shadow-[0_0_30px_-8px_hsla(38,52%,50%,0.45)] transition-all duration-500"
            >
              Contact Us
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-10 py-3.5 text-[9px] tracking-[0.2em] uppercase text-foreground/40 hover:text-foreground/70 transition-all duration-500 luxury-border rounded-sm"
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
