import { FadeReveal } from "./ui/ScrollEffects";

const SEOContentSection = () => (
  <section className="section-padding section-white">
    <div className="container mx-auto px-8 max-w-5xl">
      <FadeReveal className="text-center mb-14">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-foreground mb-4">
          Private Jet Charter with <span className="text-gradient-gold italic">Universal Jets</span>
        </h2>
        <p className="text-sm text-muted-foreground font-light max-w-2xl mx-auto leading-[2]">
          The smarter way to fly private — access the global market, not just one fleet.
        </p>
      </FadeReveal>

      <div className="grid md:grid-cols-2 gap-10 text-[13px] text-foreground/60 font-light leading-[2.1]">
        <FadeReveal>
          <h3 className="text-[10px] tracking-[0.4em] uppercase text-primary/60 font-medium mb-4">Why Private Jet Charter?</h3>
          <p className="mb-4">
            Private jet charter gives you complete control over your schedule, route, and cabin experience. Unlike commercial aviation, a charter flight operates on your timetable — depart from any of 5,000+ airports worldwide, skip security queues, and arrive closer to your final destination. Universal Jets arranges on-demand charter flights, empty leg deals, and jet card programs for leisure travelers, executives, and corporate teams.
          </p>
          <p>
            Whether you need a light jet for a short European hop, a super-midsize aircraft for transatlantic travel, or a VIP airliner for group movements, we source the right aircraft at competitive rates from a network of 7,000+ vetted aircraft operated by ARGUS- and WYVERN-certified operators.
          </p>
        </FadeReveal>

        <FadeReveal>
          <h3 className="text-[10px] tracking-[0.4em] uppercase text-primary/60 font-medium mb-4">How We Work</h3>
          <p className="mb-4">
            Universal Jets is a Dubai-based private aviation brokerage with 18+ years of experience arranging charter flights across the Middle East, Europe, Africa, Asia, and the Americas. As an independent broker — not an operator — we compare pricing across the entire market to find you the best aircraft at the best price, every time.
          </p>
          <p>
            Our services include on-demand private jet charter, empty leg flights at reduced rates, prepaid jet card programs with fixed hourly rates, ACMI and aircraft leasing, cargo charter, medical evacuation flights, helicopter transfers, and full concierge coordination including ground transport, catering, hotels, and security.
          </p>
        </FadeReveal>
      </div>

      <FadeReveal className="mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { stat: "18+", label: "Years in Private Aviation" },
            { stat: "7,000+", label: "Vetted Aircraft Worldwide" },
            { stat: "190+", label: "Countries Served" },
            { stat: "24/7", label: "Global Concierge Support" },
          ].map((item) => (
            <div key={item.label} className="py-6">
              <p className="text-2xl md:text-3xl font-display font-semibold text-foreground">{item.stat}</p>
              <p className="text-[11px] text-muted-foreground font-light mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </FadeReveal>
    </div>
  </section>
);

export default SEOContentSection;
