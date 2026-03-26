import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const COOKIE_KEY = "uj_cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = (value: string) => {
    localStorage.setItem(COOKIE_KEY, value);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[42] rounded-xl border border-border/15 bg-card/95 backdrop-blur-xl p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
        >
          <p className="text-[12px] text-foreground/60 font-extralight leading-[1.8] mb-1">
            We use cookies to enhance your experience.
          </p>
          <p className="text-[10px] text-foreground/30 font-extralight leading-[1.8] mb-5">
            By continuing, you agree to our{" "}
            <Link to="/cookies" className="text-primary/60 hover:text-primary/80 transition-colors underline underline-offset-2">
              Cookies Policy
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary/60 hover:text-primary/80 transition-colors underline underline-offset-2">
              Privacy Policy
            </Link>.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => accept("all")}
              className="flex-1 py-2.5 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-sm transition-all duration-500 hover:shadow-[0_0_30px_-8px_hsla(45,79%,46%,0.4)]"
            >
              Accept All
            </button>
            <button
              onClick={() => accept("essential")}
              className="flex-1 py-2.5 border border-border/15 text-foreground/40 hover:text-foreground/60 text-[9px] tracking-[0.25em] uppercase font-light rounded-sm transition-all duration-500 hover:border-border/25"
            >
              Essential Only
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
