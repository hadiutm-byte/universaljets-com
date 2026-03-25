import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "971501234567"; // Replace with actual number
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi, I just joined the Universal Jets Private Access Network. I'd like to discuss my travel needs."
);

const WhatsAppCTA = () => (
  <section className="py-16 relative">
    <div className="container mx-auto px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-xl mx-auto text-center"
      >
        <div className="w-14 h-14 rounded-full luxury-border flex items-center justify-center mx-auto mb-6 glow-subtle">
          <MessageCircle className="w-6 h-6 text-primary/60" strokeWidth={1.2} />
        </div>

        <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-3">
          Speak Directly with Your Advisor
        </h3>
        <p className="text-[12px] text-foreground/35 font-extralight leading-[2] mb-8">
          Skip the forms. Message us on WhatsApp for immediate, personal assistance.
        </p>

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-10 py-4 bg-[hsl(142,70%,35%)] hover:bg-[hsl(142,70%,40%)] text-white text-[10px] tracking-[0.25em] uppercase font-medium rounded-sm transition-all duration-500 hover:shadow-[0_0_40px_-8px_hsla(142,70%,35%,0.4)] hover:scale-[1.02]"
        >
          <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
          Message on WhatsApp
        </a>

        <p className="text-[9px] text-foreground/20 font-extralight mt-5 tracking-wide">
          Available 24/7 · Typical response under 5 minutes
        </p>
      </motion.div>
    </div>
  </section>
);

export default WhatsAppCTA;
