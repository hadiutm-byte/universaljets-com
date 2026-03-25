import { motion } from "framer-motion";
import { Users } from "lucide-react";

const ReferralSection = () => (
  <section className="py-20 relative">
    <div className="container mx-auto px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-lg mx-auto text-center"
      >
        <div className="w-14 h-14 rounded-full luxury-border flex items-center justify-center mx-auto mb-8 glow-subtle">
          <Users className="w-5 h-5 text-primary/60" strokeWidth={1.2} />
        </div>

        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-6 font-light">
          Referral Program
        </p>
        <h3 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-5 leading-tight">
          Extend Your <span className="text-gradient-gold italic">Access</span>
        </h3>
        <p className="text-[13px] text-foreground/40 font-extralight leading-[2] mb-3">
          Introduce 3 qualified members to the network and receive a{" "}
          <span className="text-primary/70 font-light">$1,000 flight credit</span>{" "}
          toward your next booking.
        </p>
        <p className="text-[10px] text-foreground/20 font-extralight tracking-wide italic">
          By invitation only. Acceptance is subject to review.
        </p>
      </motion.div>
    </div>
  </section>
);

export default ReferralSection;
