import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FadeReveal } from "./ui/ScrollEffects";

const FinalCTASection = () => (
  <section className="py-28 md:py-40 relative">
    <div className="container mx-auto px-8 relative z-10">
      <FadeReveal className="text-center max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-white mb-6 leading-[1.1]">
          Request Your{" "}
          <span className="text-gradient-gold italic font-medium">Flight</span>
        </h2>
        <p className="text-[16px] text-white/60 font-light leading-[2] mb-10 max-w-md mx-auto">
          Speak directly with an aviation advisor.
          <br />
          We respond within minutes.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => document.dispatchEvent(new CustomEvent("open-ricky-booking"))}
            className="btn-luxury inline-flex items-center gap-3 px-12 py-4 bg-gradient-gold text-white text-[12px] tracking-[0.25em] uppercase font-medium rounded-xl cursor-pointer"
          >
            Start with Ricky
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </motion.button>
          <a
            href="https://wa.me/971501234567"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-luxury inline-flex items-center gap-3 px-10 py-4 border border-white/15 text-white/60 hover:text-white text-[12px] tracking-[0.25em] uppercase font-light rounded-xl transition-all duration-300"
          >
            Chat on WhatsApp
          </a>
        </div>
      </FadeReveal>
    </div>
  </section>
);

export default FinalCTASection;