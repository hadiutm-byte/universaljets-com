import { Link } from "react-router-dom";

const partnerLogos = [
  "Four Seasons",
  "Ritz-Carlton",
  "Mandarin Oriental",
  "Rolls-Royce",
  "Hertz Prestige",
  "Aman Resorts",
];

const footerLinks = [
  { label: "Charter Flights", href: "/#cta" },
  { label: "Jet Card", href: "/jet-card" },
  { label: "Members", href: "/members" },
  { label: "Destinations", href: "/destinations" },
  { label: "Partners", href: "/partners" },
  { label: "ACMI Leasing", href: "/acmi-leasing" },
];

const Footer = () => (
  <footer className="py-24 relative">
    <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat" }} />

    <div className="container mx-auto px-8 relative z-10">
      {/* Partner Logos */}
      <div className="mb-16">
        <p className="text-center text-[8px] tracking-[0.4em] uppercase text-foreground/15 font-extralight mb-8">
          Trusted Partners
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partnerLogos.map((name) => (
            <span
              key={name}
              className="text-[10px] tracking-[0.2em] uppercase text-foreground/15 font-extralight hover:text-foreground/30 transition-colors duration-500"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

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
