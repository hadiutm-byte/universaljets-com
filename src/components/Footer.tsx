import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Charter Flights", href: "/#services" },
  { label: "Empty Legs", href: "/#empty-legs" },
  { label: "Fleet", href: "/#fleet" },
  { label: "Experience", href: "/#experience" },
  { label: "Members", href: "/members" },
];

const Footer = () => (
  <footer className="py-24">
    <div className="container mx-auto px-8">
      <div className="divider-gold mb-20" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="text-center lg:text-left">
          <Link to="/" className="font-display text-sm tracking-[0.4em] text-foreground/80 uppercase font-light">
            Universal<span className="text-gradient-gold ml-1">Jets</span>
          </Link>
          <p className="text-[10px] text-foreground/20 mt-3 font-extralight tracking-[0.15em]">
            Fly Smarter. Fly Private.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-7 lg:gap-9">
          {footerLinks.map((l) =>
            l.href.startsWith("/") && !l.href.startsWith("/#") ? (
              <Link
                key={l.label}
                to={l.href}
                className="text-[8.5px] tracking-[0.22em] text-foreground/25 hover:text-foreground/60 transition-colors duration-500 uppercase font-extralight"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.label}
                href={l.href.replace("/", "")}
                className="text-[8.5px] tracking-[0.22em] text-foreground/25 hover:text-foreground/60 transition-colors duration-500 uppercase font-extralight"
              >
                {l.label}
              </a>
            )
          )}
        </div>
      </div>

      <div className="divider-gold mt-20 mb-12" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[8.5px] text-foreground/20 font-extralight tracking-[0.15em]">
          © {new Date().getFullYear()} Universal Jets. All rights reserved.
        </p>
        <p className="text-[8.5px] text-foreground/20 font-extralight tracking-[0.15em]">
          charter@universaljets.com  ·  +44 20 1234 5678
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
