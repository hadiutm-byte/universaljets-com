import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { trackWhatsAppClick } from "@/lib/gtmEvents";

const WHATSAPP_URL = "https://wa.me/447888999944?text=" + encodeURIComponent("Hello, I would like to request a private jet charter.");

const FloatingWhatsApp = () => (
  <motion.a
    href={WHATSAPP_URL}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => trackWhatsAppClick("floating_button")}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 4, duration: 0.5 }}
    whileHover={{ scale: 1.08, y: -2 }}
    whileTap={{ scale: 0.92 }}
    className="fixed bottom-[5.5rem] right-6 z-[39] w-12 h-12 min-h-[48px] min-w-[48px] rounded-full bg-[hsl(220,10%,12%)] border border-white/10 shadow-[0_4px_20px_hsla(0,0%,0%,0.4)] flex items-center justify-center group transition-shadow hover:shadow-[0_0_20px_-4px_hsla(43,74%,49%,0.25)]"
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle className="w-5 h-5 text-primary group-hover:text-primary/80 transition-colors" strokeWidth={1.5} />
  </motion.a>
);

export default FloatingWhatsApp;
