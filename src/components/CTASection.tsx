import { motion } from "framer-motion";

const CTASection = () => (
  <section id="cta" className="section-padding">
    <div className="container mx-auto px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="glass rounded-2xl py-20 md:py-28 px-8 md:px-16 text-center glow-subtle relative overflow-hidden"
      >
        {/* Top gold line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

        <p className="text-[10px] tracking-[0.4em] uppercase text-gold mb-8 font-light">Start Your Journey</p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold mb-8 max-w-2xl mx-auto leading-tight">
          Request Your Flight
          <br />
          <span className="text-gradient-gold italic font-medium">Today</span>
        </h2>
        <p className="text-sm text-muted-foreground font-extralight max-w-md mx-auto mb-14 leading-[1.8]">
          Speak with our aviation advisors and receive a personalised quote within minutes. Available 24/7.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <a
            href="mailto:charter@universaljets.com"
            className="px-12 py-4 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-sm transition-all duration-500 hover:shadow-[0_0_40px_-8px_hsla(38,55%,52%,0.5)] hover:scale-[1.02]"
          >
            Get a Quote
          </a>
          <a
            href="tel:+442012345678"
            className="px-12 py-4 luxury-border luxury-border-hover text-foreground/80 hover:text-foreground text-[10px] tracking-[0.25em] uppercase font-light rounded-sm transition-all duration-500 hover:scale-[1.02]"
          >
            Call Us Now
          </a>
        </div>

        {/* Bottom gold line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      </motion.div>
    </div>
  </section>
);

export default CTASection;
