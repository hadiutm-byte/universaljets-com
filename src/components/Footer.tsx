const navLinks = [
  { label: "Home", href: "#" },
  { label: "Charter Flights", href: "#services" },
  { label: "Empty Legs", href: "#empty-legs" },
  { label: "Fleet", href: "#fleet" },
  { label: "Experience", href: "#experience" },
  { label: "Concierge", href: "#concierge" },
  { label: "Contact", href: "#cta" },
];

const Footer = () => (
  <footer className="py-20">
    <div className="container mx-auto px-8">
      <div className="divider-gold mb-16" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="text-center lg:text-left">
          <a href="#" className="font-display text-base tracking-[0.3em] text-foreground uppercase">
            Universal<span className="text-gradient-gold ml-1.5">Jets</span>
          </a>
          <p className="text-[10px] text-muted-foreground/50 mt-3 font-extralight tracking-wider">
            Private Aviation. Perfected.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-8">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[9px] tracking-[0.2em] text-muted-foreground/50 hover:text-foreground transition-colors duration-500 uppercase font-extralight"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>

      <div className="divider-gold mt-16 mb-10" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[9px] text-muted-foreground/40 font-extralight tracking-wider">
          © {new Date().getFullYear()} Universal Jets. All rights reserved.
        </p>
        <p className="text-[9px] text-muted-foreground/40 font-extralight tracking-wider">
          charter@universaljets.com  ·  +44 20 1234 5678
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
