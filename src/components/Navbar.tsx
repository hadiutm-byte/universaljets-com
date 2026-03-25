import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useAuth, type AppRole } from "@/hooks/useAuth";

const centerLinks = [
  { label: "Home", href: "/" },
  { label: "Charter Flights", href: "/#services" },
  { label: "Empty Legs", href: "/#empty-legs" },
  { label: "Aircraft", href: "/aircraft" },
  { label: "Experience", href: "/#experience" },
  { label: "About", href: "/#why" },
  { label: "Contact", href: "/#cta" },
];

const overlayLinks = [
  { label: "Home", href: "/" },
  { label: "Charter Flights", href: "/#services" },
  { label: "Empty Legs", href: "/#empty-legs" },
  { label: "Fleet", href: "/#fleet" },
  { label: "Experience", href: "/#experience" },
  { label: "ACMI & Leasing", href: "/acmi-leasing" },
  { label: "Membership", href: "/members" },
  { label: "Jet Card", href: "/members" },
  { label: "Concierge", href: "/#concierge" },
  { label: "About", href: "/#why" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/#cta" },
];

const CRM_ROLES: AppRole[] = ["admin", "sales", "operations", "finance", "account_management"];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const location = useLocation();
  const { user, roles, loading } = useAuth();
  const isHome = location.pathname === "/";
  const showCrmLink = !!user && !loading && CRM_ROLES.some((role) => roles.includes(role));
  const menuLinks = showCrmLink ? [...overlayLinks, { label: "CRM", href: "/crm" }] : overlayLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = overlayOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [overlayOpen]);

  const handleNavClick = (href: string) => {
    setOverlayOpen(false);
    if (href.startsWith("/#") && isHome) {
      const el = document.querySelector(href.replace("/", ""));
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const NavLink = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => {
    if (href === "/" && !href.includes("#")) {
      return (
        <Link to="/" onClick={() => setOverlayOpen(false)} className={className}>
          {children}
        </Link>
      );
    }
    if (href.startsWith("/#")) {
      return isHome ? (
        <a href={href.replace("/", "")} onClick={() => handleNavClick(href)} className={className}>
          {children}
        </a>
      ) : (
        <Link to={href.replace("/#", "/?scrollTo=")} className={className}>
          {children}
        </Link>
      );
    }
    return (
      <Link to={href} onClick={() => setOverlayOpen(false)} className={className}>
        {children}
      </Link>
    );
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-9 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled ? "py-3 shadow-sm" : "bg-transparent py-5"
        }`}
        style={
          scrolled
            ? {
                background: "hsla(0, 0%, 100%, 0.92)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: "1px solid hsla(0, 0%, 0%, 0.05)",
              }
            : undefined
        }
      >
        <div className="container mx-auto flex items-center justify-between px-6 lg:px-8">
          <Link to="/" className="group font-display text-[13px] md:text-[15px] tracking-[0.45em] uppercase select-none font-light flex-shrink-0 transition-all duration-500 hover:drop-shadow-[0_0_12px_hsla(45,79%,46%,0.3)]">
            <span className={scrolled ? "text-foreground/90" : "text-white/90"}>Universal</span>
            <span className="text-gradient-gold ml-1.5 font-normal">Jets</span>
          </Link>

          <div className="hidden xl:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
            {centerLinks.map((l) => (
              <NavLink
                key={l.label}
                href={l.href}
                className={`text-[10px] tracking-[0.22em] hover:text-primary transition-colors duration-500 uppercase font-light relative group whitespace-nowrap ${scrolled ? "text-foreground/50" : "text-white/50"}`}
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-primary/60 group-hover:w-full transition-all duration-500" />
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {showCrmLink && (
              <Link
                to="/crm"
                className={`inline-flex items-center rounded-xl border px-3 py-2 text-[10px] tracking-[0.22em] uppercase font-medium transition-all duration-500 ${
                  scrolled
                    ? "border-primary/20 bg-background/80 text-foreground/80 hover:border-primary/40 hover:text-primary"
                    : "border-white/15 bg-background/10 text-white/80 hover:border-primary/40 hover:text-primary"
                }`}
              >
                CRM
              </Link>
            )}

            <Link
              to="/auth"
              className={`hidden xl:inline-block text-[10px] tracking-[0.2em] hover:text-primary/70 transition-colors duration-500 uppercase font-light ${scrolled ? "text-foreground/40" : "text-white/40"}`}
            >
              Members Login
            </Link>

            <NavLink
              href="/#cta"
              className="hidden xl:inline-block px-6 py-2.5 bg-gradient-gold text-white text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl hover:shadow-[0_0_30px_-8px_hsla(45,79%,46%,0.45)] transition-all duration-500 hover:scale-[1.01]"
            >
              Request a Flight
            </NavLink>

            <button
              onClick={() => setOverlayOpen(!overlayOpen)}
              className="relative w-10 h-10 flex items-center justify-center transition-colors duration-300 text-foreground/60 hover:text-foreground"
              aria-label="Menu"
            >
              <AnimatePresence mode="wait">
                {overlayOpen ? (
                  <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.25 }}>
                    <X size={20} strokeWidth={1.5} />
                  </motion.div>
                ) : (
                  <motion.div key="open" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.25 }}>
                    <Menu size={20} strokeWidth={1.5} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {overlayOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[45] flex"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 backdrop-blur-2xl"
              style={{ background: "hsla(0, 0%, 100%, 0.97)" }}
            />

            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-8">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-16 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-10 origin-center"
              />

              <nav className="flex flex-col items-center gap-1">
                {menuLinks.map((l, i) => (
                  <motion.div
                    key={l.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, delay: 0.15 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <NavLink
                      href={l.href}
                      className="block py-2.5 text-[15px] md:text-[18px] tracking-[0.25em] text-foreground/40 hover:text-foreground transition-all duration-500 uppercase font-extralight relative group"
                    >
                      {l.label}
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-[0.5px] bg-primary/50 group-hover:w-full transition-all duration-500" />
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="flex flex-col items-center gap-5 mt-12"
              >
                <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <Link
                  to="/auth"
                  onClick={() => setOverlayOpen(false)}
                  className="text-[10px] tracking-[0.3em] text-muted-foreground hover:text-primary/70 uppercase font-extralight transition-colors duration-500"
                >
                  Members Login
                </Link>
                <NavLink
                  href="/#cta"
                  className="px-10 py-3.5 bg-gradient-gold text-white text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl hover:shadow-[0_0_40px_-8px_hsla(45,79%,46%,0.5)] transition-all duration-500"
                >
                  Request a Flight
                </NavLink>
              </motion.div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle,_hsla(45,79%,46%,0.03)_0%,_transparent_70%)] pointer-events-none" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
