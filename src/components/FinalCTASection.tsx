import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FadeReveal } from "./ui/ScrollEffects";

const FinalCTASection = () => (
  <section id="cta" className="py-32 md:py-44 relative">
    <div className="container mx-auto px-8 relative z-10">
      <FadeReveal className="text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-12 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mb-12 origin-center"
        />
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-white mb-8 leading-[1.05] tracking-[-0.01em]">
          Request Your{" "}
          <span className="text-gradient-gold italic font-medium">Flight</span>
        </h2>
        <p className="text-[15px] text-white/70 font-light leading-[2.1] mb-12 max-w-md mx-auto tracking-[0.01em]">
          Speak directly with an aviation advisor.
          <br />
          We respond within minutes.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <motion.button
            whileHover={{ scale: 1.03, y: -3 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            onClick={() => document.dispatchEvent(new CustomEvent("open-ricky-booking"))}
            className="group btn-luxury inline-flex items-center gap-3 px-12 py-[1.125rem] bg-gradient-gold text-white text-[11px] tracking-[0.3em] uppercase font-medium rounded-xl cursor-pointer"
          >
            Start with Ricky
            <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5" strokeWidth={1.5} />
          </motion.button>
          <motion.a
            href="https://wa.me/447888999944?text=Hello%2C%20I%20would%20like%20to%20request%20a%20private%20jet%20charter."
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="btn-luxury inline-flex items-center gap-3 px-10 py-[1.125rem] border border-white/[0.1] hover:border-white/[0.2] text-white/50 hover:text-white/90 text-[11px] tracking-[0.3em] uppercase font-light rounded-xl transition-all duration-700"
          >
            Chat on WhatsApp
          </motion.a>
        </div>
      </FadeReveal>
    </div>
  </section>
);

export default FinalCTASection;
