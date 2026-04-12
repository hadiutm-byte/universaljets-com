const publications = [
  "Arabian Business",
  "Gulf News",
  "Bloomberg",
  "Forbes Middle East",
  "The National",
  "Aviation Week",
];

const PressStrip = () => (
  <section className="py-10 px-4 border-t border-foreground/5" aria-label="Press mentions">
    <div className="max-w-6xl mx-auto text-center">
      <p className="text-muted-foreground text-[11px] tracking-[0.2em] uppercase mb-6 font-medium">
        As Featured In
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {publications.map((pub) => (
          <span
            key={pub}
            className="text-foreground/25 font-display text-sm md:text-base font-semibold tracking-wide uppercase select-none hover:text-foreground/40 transition-colors"
          >
            {pub}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default PressStrip;
