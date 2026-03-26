import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useAuth, type AppRole } from "@/hooks/useAuth";

const centerLinks = [
  { label: "Charter", href: "/#services" },
  { label: "Empty Legs", href: "/#empty-legs" },
  { label: "Fleet", href: "/fleet" },
  { label: "Membership", href: "/membership" },
  { label: "About", href: "/about" },
];

const overlayLinks = [
  { label: "Home", href: "/" },
  { label: "Charter Flights", href: "/#services" },
  { label: "Empty Legs", href: "/#empty-legs" },
  { label: "Fleet", href: "/fleet" },
  { label: "Membership", href: "/membership" },
  { label: "Concierge", href: "/concierge" },
  { label: "ACMI & Leasing", href: "/acmi-leasing" },
  { label: "Jet Card", href: "/jet-card" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const CRM_ROLES: AppRole[] = ["admin", "sales", "operations", "finance", "account_management"];

/* ─── Internal NavLink ─── */
const NavLinkInner = ({
  href,
  children,
  className,
  isHome,
  onNav,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  isHome: boolean;
  onNav: (href: string) => void;
}) => {
  if (href === "/" && !href.includes("#")) {
    return (
      <Link to="/" onClick={() => onNav(href)} className={className}>
        {children}
      </Link>
    );
  }
  if (href.startsWith("/#")) {
    return isHome ? (
      <a href={href.replace("/", "")} onClick={() => onNav(href)} className={className}>
        {children}
      </a>
    ) : (
      <Link to={href.replace("/#", "/?scrollTo=")} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <Link to={href} onClick={() => onNav(href)} className={className}>
      {children}
    </Link>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const location = useLocation();
  const { user, roles, loading } = useAuth();
  const isHome = location.pathname === "/";
  const showCrmLink = !!user && !loading && CRM_ROLES.some((role) => roles.includes(role));
  const menuLinks = showCrmLink ? [...overlayLinks, { label: "CRM", href: "/crm" }] : overlayLinks;

  // Logo micro-interaction: subtle parallax on cursor
  const logoRef = useRef<HTMLAnchorElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const logoX = useSpring(useTransform(mouseX, [-200, 200], [1.5, -1.5]), { stiffness: 150, damping: 25 });
  const logoY = useSpring(useTransform(mouseY, [-200, 200], [1, -1]), { stiffness: 150, damping: 25 });

  const handleLogoMouseMove = (e: React.MouseEvent) => {
    if (!logoRef.current) return;
    const rect = logoRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleLogoMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = overlayOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [overlayOpen]);

  const handleNavClick = (href: string) => {
    setOverlayOpen(false);
    if (href.startsWith("/#") && isHome) {
      const id = href.replace("/#", "");
      window.scrollTo({ top: 0, behavior: "instant" });
      requestAnimationFrame(() => {
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      });
    }
  };

  return (
    <>
      {/* ═══ NAVBAR ═══ */}
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-9 left-0 right-0 z-[56] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled ? "py-2.5" : "py-5"
        }`}
        style={{
          background: scrolled
            ? "hsl(220 10% 6% / 0.97)"
            : "linear-gradient(to bottom, hsla(220,10%,5%,0.9), hsla(220,10%,5%,0))",
          borderBottom: scrolled ? "1px solid hsla(43,74%,49%,0.08)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(12px) saturate(1.2)" : "none",
        }}
      >
        <div className="container mx-auto flex items-center justify-between px-6 lg:px-8">
          {/* Logo — luxury micro-animation */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ x: logoX, y: logoY }}
            onMouseMove={handleLogoMouseMove}
            onMouseLeave={handleLogoMouseLeave}
          >
            <Link
              ref={logoRef}
              to="/"
              className="group font-display text-[13px] md:text-[15px] tracking-[0.5em] uppercase select-none font-light flex-shrink-0 transition-all duration-500 relative"
            >
              <span className="text-white/90">Universal</span>
              <span className="logo-gold-shimmer ml-1.5 font-normal relative">Jets</span>
            </Link>
          </motion.div>

          {/* Center links — desktop only */}
          <div className="hidden xl:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
            {centerLinks.map((l) => (
              <NavLinkInner
                key={l.label}
                href={l.href}
                isHome={isHome}
                onNav={handleNavClick}
                className="text-[10px] tracking-[0.28em] text-white/40 hover:text-primary transition-colors duration-500 uppercase font-light relative group whitespace-nowrap"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 w-0 h-[1px] bg-primary/60 group-hover:w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              </NavLinkInner>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {showCrmLink && (
              <Link
                to="/crm"
                className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] tracking-[0.25em] uppercase font-medium text-white/70 hover:border-primary/30 hover:text-primary transition-all duration-500"
              >
                CRM
              </Link>
            )}
            <Link
              to="/auth"
              className="hidden xl:inline-block text-[10px] tracking-[0.25em] text-white/30 hover:text-primary/70 transition-colors duration-500 uppercase font-light"
            >
              Members Login
            </Link>
            <NavLinkInner
              href="/#cta"
              isHome={isHome}
              onNav={handleNavClick}
              className="hidden xl:inline-block px-6 py-2.5 bg-gradient-gold text-white text-[10px] tracking-[0.28em] uppercase font-medium rounded-xl hover:shadow-[0_0_30px_-8px_hsla(43,74%,49%,0.45)] transition-all duration-500 hover:scale-[1.02]"
            >
              Request a Flight
            </NavLinkInner>

            {/* Hamburger */}
            <button
              onClick={() => setOverlayOpen(!overlayOpen)}
              className="relative w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors duration-300"
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

      {/* ═══ FULLSCREEN OVERLAY ═══ */}
      <AnimatePresence>
        {overlayOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[55] flex"
          >
            {/* Opaque dark background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-[hsl(220,10%,5%)]"
            />

            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-8">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-16 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-10 origin-center"
              />

              <nav className="flex flex-col items-center gap-1">
                {menuLinks.map((l, i) => (
                  <motion.div
                    key={l.label}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.18 + i * 0.045,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <NavLinkInner
                      href={l.href}
                      isHome={isHome}
                      onNav={handleNavClick}
                      className="block py-2.5 text-[15px] md:text-[18px] tracking-[0.3em] text-white/35 hover:text-white transition-all duration-500 uppercase font-extralight relative group"
                    >
                      {l.label}
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-primary/50 group-hover:w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                    </NavLinkInner>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-5 mt-14"
              >
                <div className="w-10 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <Link
                  to="/auth"
                  onClick={() => setOverlayOpen(false)}
                  className="text-[10px] tracking-[0.35em] text-white/30 hover:text-primary/70 uppercase font-extralight transition-colors duration-500"
                >
                  Members Login
                </Link>
                <NavLinkInner
                  href="/#cta"
                  isHome={isHome}
                  onNav={handleNavClick}
                  className="px-10 py-3.5 bg-gradient-gold text-white text-[10px] tracking-[0.28em] uppercase font-medium rounded-xl hover:shadow-[0_0_40px_-8px_hsla(43,74%,49%,0.5)] transition-all duration-500 hover:scale-[1.02]"
                >
                  Request a Flight
                </NavLinkInner>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
