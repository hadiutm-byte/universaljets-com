import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Why Us", href: "#why" },
    { label: "Services", href: "#services" },
    { label: "Fleet", href: "#fleet" },
    { label: "Empty Legs", href: "#empty-legs" },
    { label: "Experience", href: "#experience" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled ? "glass py-4" : "py-8"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-8">
        <a href="#" className="font-display text-lg md:text-xl tracking-[0.25em] text-foreground uppercase">
          Universal<span className="text-gradient-gold ml-2">Jets</span>
        </a>

        <div className="hidden lg:flex items-center gap-12">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[11px] tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors duration-500 uppercase font-light relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold group-hover:w-full transition-all duration-500" />
            </a>
          ))}
          <a
            href="#cta"
            className="ml-6 px-7 py-2.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium hover:shadow-[0_0_30px_-8px_hsla(38,55%,52%,0.4)] transition-all duration-500 rounded-sm"
          >
            Request a Flight
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-foreground"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass mt-4 mx-6 rounded-lg overflow-hidden"
          >
            <div className="flex flex-col p-8 gap-5">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[11px] tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors uppercase font-light"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#cta"
                onClick={() => setMobileOpen(false)}
                className="mt-4 px-7 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium text-center rounded-sm"
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
