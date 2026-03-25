import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Charter Flights", href: "#services" },
  { label: "Empty Legs", href: "#empty-legs" },
  { label: "Fleet", href: "#fleet" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#why" },
  { label: "Contact", href: "#cta" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.4 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled ? "glass-strong py-3" : "py-6"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <a href="#" className="font-display text-base md:text-lg tracking-[0.3em] text-foreground uppercase select-none">
          Universal<span className="text-gradient-gold ml-1.5">Jets</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden xl:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.href + l.label}
              href={l.href}
              className="text-[10px] tracking-[0.22em] text-muted-foreground hover:text-foreground transition-colors duration-500 uppercase font-light relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-gold group-hover:w-full transition-all duration-500" />
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden xl:flex items-center gap-6">
          <a href="#" className="text-[10px] tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-500 uppercase font-light">
            Members Login
          </a>
          <a
            href="#cta"
            className="px-6 py-2.5 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-sm hover:shadow-[0_0_30px_-8px_hsla(38,52%,50%,0.45)] transition-all duration-500"
          >
            Request a Flight
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="xl:hidden text-foreground">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="xl:hidden fixed inset-0 top-0 bg-background/98 backdrop-blur-xl z-40 flex flex-col items-center justify-center"
          >
            <button onClick={() => setMobileOpen(false)} className="absolute top-6 right-6 text-foreground">
              <X size={22} />
            </button>
            <div className="flex flex-col items-center gap-7">
              {navLinks.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="text-xs tracking-[0.3em] text-foreground/80 hover:text-foreground transition-colors uppercase font-light"
                >
                  {l.label}
                </motion.a>
              ))}
              <div className="divider-gold w-16 my-4" />
              <a href="#" className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase font-light">
                Members Login
              </a>
              <a
                href="#cta"
                onClick={() => setMobileOpen(false)}
                className="mt-2 px-8 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-sm"
              >
                Request a Flight
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
