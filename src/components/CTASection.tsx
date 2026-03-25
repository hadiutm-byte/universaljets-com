import { motion } from "framer-motion";

const CTASection = () => (
  <section id="cta" className="section-padding">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass rounded-2xl p-12 md:p-20 text-center glow-subtle relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

        <p className="text-xs tracking-[0.3em] uppercase text-gold mb-6 font-light">Start Your Journey</p>
        <h2 className="text-4xl md:text-6xl font-display font-semibold mb-6 max-w-3xl mx-auto leading-tight">
          Request Your Flight Today
        </h2>
        <p className="text-muted-foreground font-light max-w-xl mx-auto mb-10 leading-relaxed">
          Speak with our aviation advisors and receive a personalised quote within minutes. Available 24/7.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:charter@universaljets.com"
            className="px-12 py-4 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase font-medium hover:bg-gold-light transition-all duration-300 rounded-sm glow-gold"
          >
            Get a Quote
          </a>
          <a
            href="tel:+442012345678"
            className="px-12 py-4 luxury-border text-foreground text-xs tracking-[0.2em] uppercase font-medium hover:bg-foreground/5 transition-all duration-300 rounded-sm"
          >
            Call Us Now
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
