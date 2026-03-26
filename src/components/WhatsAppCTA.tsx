import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { FadeReveal, GlassCard } from "./ui/ScrollEffects";
import { trackWhatsAppClick } from "@/lib/gtmEvents";

const WHATSAPP_NUMBER = "447888999944";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hello, I would like to request a private jet charter."
);

const WhatsAppCTA = () => (
  <section className="py-16 relative">
    <div className="container mx-auto px-8 relative z-10">
      <FadeReveal className="max-w-xl mx-auto text-center">
        <GlassCard hover={false} className="py-12 px-8">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-14 h-14 rounded-full glass-panel flex items-center justify-center mx-auto mb-6"
          >
            <MessageCircle className="w-6 h-6 text-primary/60" strokeWidth={1.2} />
          </motion.div>

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
            className="btn-luxury inline-flex items-center gap-3 px-10 py-4 bg-[hsl(142,70%,35%)] hover:bg-[hsl(142,70%,40%)] text-white text-[10px] tracking-[0.25em] uppercase font-medium rounded-sm"
          >
            <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
            Message on WhatsApp
          </a>

          <p className="text-[9px] text-foreground/20 font-extralight mt-5 tracking-wide">
            Available 24/7 · Typical response under 5 minutes
          </p>
        </GlassCard>
      </FadeReveal>
    </div>
  </section>
);

export default WhatsAppCTA;
