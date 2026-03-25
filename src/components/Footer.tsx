import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Charter Flights", href: "/#services" },
  { label: "Empty Legs", href: "/#empty-legs" },
  { label: "Fleet", href: "/#fleet" },
  { label: "Experience", href: "/#experience" },
  { label: "Concierge", href: "/#concierge" },
  { label: "Members", href: "/members" },
];

const Footer = () => (
  <footer className="py-24 relative">
    {/* Grain texture overlay */}
    <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat" }} />

    <div className="container mx-auto px-8 relative z-10">
      <div className="divider-gold mb-20" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="text-center lg:text-left">
          <Link to="/" className="font-display text-[13px] tracking-[0.45em] uppercase font-light transition-all duration-500 hover:drop-shadow-[0_0_12px_hsla(38,52%,50%,0.3)]">
            <span className="text-foreground/80">Universal</span>
            <span className="text-gradient-gold ml-1.5 font-normal">Jets</span>
          </Link>
          <p className="text-[10px] text-foreground/25 mt-3 font-extralight tracking-[0.15em]">
            Private Aviation. Perfected.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-7 lg:gap-9">
          {footerLinks.map((l) =>
            l.href.startsWith("/") && !l.href.startsWith("/#") ? (
              <Link
                key={l.label}
                to={l.href}
                className="text-[8.5px] tracking-[0.22em] text-foreground/30 hover:text-foreground/60 transition-colors duration-500 uppercase font-extralight"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={l.href.replace("/", "")}
                className="text-[8.5px] tracking-[0.22em] text-foreground/30 hover:text-foreground/60 transition-colors duration-500 uppercase font-extralight"
              >
                {l.label}
              </a>
            )
          )}
        </div>
      </div>

      <div className="divider-gold mt-20 mb-12" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[8.5px] text-foreground/25 font-extralight tracking-[0.15em]">
          © {new Date().getFullYear()} Universal Jets. All rights reserved.
        </p>
        <p className="text-[8.5px] text-foreground/25 font-extralight tracking-[0.15em]">
          charter@universaljets.com  ·  +44 20 1234 5678
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
