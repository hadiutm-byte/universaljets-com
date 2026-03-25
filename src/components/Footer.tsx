const Footer = () => (
  <footer className="border-t border-border py-16">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <a href="#" className="font-display text-xl tracking-widest text-foreground uppercase">
            Universal <span className="text-gradient-gold">Jets</span>
          </a>
          <p className="text-xs text-muted-foreground mt-2 font-light">Private Aviation, Elevated.</p>
        </div>

        <div className="flex items-center gap-8">
          {["Services", "Fleet", "Empty Legs", "Concierge"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(" ", "-")}`}
              className="text-xs tracking-wider text-muted-foreground hover:text-foreground transition-colors uppercase font-light"
            >
              {l}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground font-light">
          © {new Date().getFullYear()} Universal Jets. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground font-light">
          charter@universaljets.com · +44 20 1234 5678
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
