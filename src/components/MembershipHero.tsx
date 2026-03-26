import { motion } from "framer-motion";
import { Shield, Plane, UserCheck, Sparkles } from "lucide-react";
import { trackMembershipRequest } from "@/lib/gtmEvents";

const privileges = [
  { icon: Shield, text: "Priority aircraft access" },
  { icon: Plane, text: "Exclusive empty leg alerts" },
  { icon: UserCheck, text: "Dedicated aviation advisor" },
  { icon: Sparkles, text: "Preferential member pricing" },
];

const staggerChildren = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.5 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

interface MembershipHeroProps {
  onRequestInvitation: () => void;
  onSpeakToAdvisor: () => void;
}

const MembershipHero = ({ onRequestInvitation, onSpeakToAdvisor }: MembershipHeroProps) => (
  <section className="relative overflow-hidden py-28 md:py-40 lg:py-48">
    {/* Dark cinematic background */}
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(180deg, hsl(220, 12%, 6%) 0%, hsl(220, 8%, 10%) 50%, hsl(220, 12%, 6%) 100%)",
      }}
    />

    {/* Subtle radial glow */}
    <div
      className="absolute inset-0 opacity-30"
      style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 45%, hsla(45, 79%, 46%, 0.08) 0%, transparent 70%)",
      }}
    />

    {/* Noise */}
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')" }} />

    {/* Top shimmer line */}
    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(45,79%,46%,0.2)] to-transparent" />

    <div className="container mx-auto px-8 relative z-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={staggerChildren}
        className="max-w-3xl mx-auto text-center"
      >
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[hsl(45,79%,46%,0.15)] bg-[hsl(45,79%,46%,0.04)] mb-10"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[hsl(45,79%,46%)] animate-pulse" />
          <span className="text-[9px] tracking-[0.4em] uppercase text-[hsl(45,79%,46%,0.7)] font-light">
            Limited invitations released monthly
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          variants={fadeUp}
          className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-white/95 leading-[1.1] mb-4"
        >
          Private Access
          <br />
          <span className="text-gradient-gold italic font-display">Membership</span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="text-[20px] md:text-[22px] text-white/30 font-extralight tracking-[0.1em] mb-8"
        >
          By Invitation Only
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="text-[14px] md:text-[15px] text-white/35 font-extralight leading-[2] max-w-lg mx-auto mb-12"
        >
          An exclusive network for those who expect more from private aviation.
          Priority access, dedicated advisors, and privileges reserved for members only.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 0 50px -12px hsla(45,79%,46%,0.5)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { trackMembershipRequest(); onRequestInvitation(); }}
            className="px-10 py-4 bg-gradient-gold text-white text-[10px] tracking-[0.3em] uppercase font-semibold rounded-xl transition-all duration-500 cursor-pointer"
          >
            Request Invitation
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, borderColor: "hsla(0,0%,100%,0.25)" }}
            onClick={onSpeakToAdvisor}
            className="px-10 py-4 border border-white/10 text-white/40 hover:text-white/70 text-[10px] tracking-[0.3em] uppercase font-light rounded-xl transition-all duration-500 cursor-pointer"
          >
            Speak to Advisor
          </motion.button>
        </motion.div>

        {/* Privileges grid — staggered */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.6 } },
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {privileges.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="text-center"
            >
              <div className="w-11 h-11 rounded-full border border-white/[0.06] bg-white/[0.02] flex items-center justify-center mx-auto mb-4">
                <p.icon className="w-4 h-4 text-[hsl(45,79%,46%,0.5)]" strokeWidth={1.2} />
              </div>
              <p className="text-[11px] text-white/40 font-light tracking-wide">{p.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>

    {/* Bottom shimmer line */}
    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(45,79%,46%,0.15)] to-transparent" />
  </section>
);

export default MembershipHero;
