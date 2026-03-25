import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const centerLinks = [
  { label: "Charter Flights", href: "/#services" },
  { label: "Empty Legs", href: "/#empty-legs" },
  { label: "Fleet", href: "/#fleet" },
  { label: "Experience", href: "/#experience" },
  { label: "About", href: "/#why" },
];

const mobileLinks = [
  { label: "Charter Flights", href: "/#services" },
  { label: "Empty Legs", href: "/#empty-legs" },
  { label: "Fleet", href: "/#fleet" },
  { label: "Membership", href: "/members" },
  { label: "Contact", href: "/#cta" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Handle hash links
  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/#") && isHome) {
      const el = document.querySelector(href.replace("/", ""));
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const NavLink = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => {
    if (href.startsWith("/#")) {
      return isHome ? (
        <a href={href.replace("/", "")} onClick={() => handleNavClick(href)} className={className}>{children}</a>
      ) : (
        <Link to={href.replace("/#", "/?scrollTo=")} className={className}>{children}</Link>
      );
    }
    return <Link to={href} className={className}>{children}</Link>;
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled ? "glass-strong py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 lg:px-8">
        {/* Logo - Left */}
        <Link to="/" className="font-display text-sm md:text-[15px] tracking-[0.4em] text-foreground/90 uppercase select-none font-light flex-shrink-0">
          Universal<span className="text-gradient-gold ml-1">Jets</span>
        </Link>

        {/* Center Nav - Desktop */}
        <div className="hidden xl:flex items-center gap-9 absolute left-1/2 -translate-x-1/2">
          {centerLinks.map((l) => (
            <NavLink
              key={l.label}
              href={l.href}
              className="text-[9.5px] tracking-[0.22em] text-foreground/40 hover:text-foreground/90 transition-colors duration-500 uppercase font-light relative group whitespace-nowrap"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-gold/60 group-hover:w-full transition-all duration-500" />
            </NavLink>
          ))}
        </div>

        {/* Right side - Desktop */}
        <div className="hidden xl:flex items-center gap-5 flex-shrink-0">
          <Link
            to="/members"
            className="text-[9.5px] tracking-[0.2em] text-foreground/35 hover:text-foreground/80 transition-colors duration-500 uppercase font-light"
          >
            Members Login
          </Link>
          <Link
            to="/members"
            className="text-[9.5px] tracking-[0.2em] text-foreground/35 hover:text-foreground/80 transition-colors duration-500 uppercase font-light luxury-border px-4 py-1.5 rounded-sm luxury-border-hover"
          >
            Sign Up
          </Link>
          <NavLink
            href="/#cta"
            className="px-6 py-2.5 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-sm hover:shadow-[0_0_30px_-8px_hsla(38,52%,50%,0.45)] transition-all duration-500 hover:scale-[1.01]"
          >
            Request a Flight
          </NavLink>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="xl:hidden text-foreground/80">
          {mobileOpen ? <X size={20} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile menu - Full screen */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="xl:hidden fixed inset-0 bg-background/[0.98] backdrop-blur-2xl z-40 flex flex-col items-center justify-center"
          >
            <button onClick={() => setMobileOpen(false)} className="absolute top-5 right-6 text-foreground/60">
              <X size={20} strokeWidth={1.5} />
            </button>

            {/* Logo in mobile */}
            <div className="absolute top-5 left-6 font-display text-sm tracking-[0.4em] text-foreground/90 uppercase font-light">
              Universal<span className="text-gradient-gold ml-1">Jets</span>
            </div>

            <div className="flex flex-col items-center gap-8">
              {mobileLinks.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  <NavLink
                    href={l.href}
                    className="text-[13px] tracking-[0.3em] text-foreground/70 hover:text-foreground transition-colors uppercase font-extralight"
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center gap-5 mt-6"
              >
                <div className="divider-gold w-12" />
                <Link
                  to="/members"
                  onClick={() => setMobileOpen(false)}
                  className="text-[10px] tracking-[0.25em] text-foreground/40 uppercase font-extralight"
                >
                  Members Login
                </Link>
                <NavLink
                  href="/#cta"
                  className="px-10 py-3.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-sm"
                >
                  Request a Flight
                </NavLink>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
