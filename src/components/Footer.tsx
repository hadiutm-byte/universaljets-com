const Footer = () => (
  <footer className="py-20">
    <div className="container mx-auto px-8">
      <div className="divider-gold mb-16" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-10">
        <div>
          <a href="#" className="font-display text-lg tracking-[0.25em] text-foreground uppercase">
            Universal<span className="text-gradient-gold ml-2">Jets</span>
          </a>
          <p className="text-[11px] text-muted-foreground mt-3 font-extralight tracking-wider">
            Private Aviation. Perfected.
          </p>
        </div>

        <div className="flex items-center gap-10">
          {["Why Us", "Services", "Fleet", "Empty Legs", "Experience"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(" ", "-")}`}
              className="text-[10px] tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors duration-500 uppercase font-extralight"
            >
              {l}
            </a>
          ))}
        </div>
      </div>

      <div className="divider-gold mt-16 mb-10" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-muted-foreground font-extralight tracking-wider">
          © {new Date().getFullYear()} Universal Jets. All rights reserved.
        </p>
        <p className="text-[10px] text-muted-foreground font-extralight tracking-wider">
          charter@universaljets.com  ·  +44 20 1234 5678
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
