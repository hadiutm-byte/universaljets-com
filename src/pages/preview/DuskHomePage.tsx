/**
 * Dusk: the direction-D homepage from the design canvas, built as real code.
 *
 * Reached at /preview/dusk, noindex, so it can be reviewed on the live
 * preview builds without touching the home page. Copy and figures are the
 * design's placeholders: aircraft figures are indicative, photos are the
 * current site's stand-ins until licensed photography arrives, and the
 * bracketed contact details are still to be confirmed.
 */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SEOHead from "@/components/SEOHead";
import { verified } from "@/lib/claims";
import "./dusk.css";

import heroImg from "@/assets/hero-jet-v3.jpg";
import heroAltImg from "@/assets/hero-jet.jpg";
import cabinImg from "@/assets/jet-interior.jpg";
import turbopropImg from "@/assets/aircraft/turboprop.jpg";
import lightImg from "@/assets/aircraft/light-jet.jpg";
import midsizeImg from "@/assets/aircraft/midsize-jet.jpg";
import superMidImg from "@/assets/aircraft/super-midsize-jet.jpg";
import heavyImg from "@/assets/aircraft/heavy-jet.jpg";
import ulrImg from "@/assets/aircraft/ultra-long-range.jpg";
import dubaiImg from "@/assets/destinations/dubai.jpg";
import londonImg from "@/assets/destinations/london.jpg";
import cargoImg from "@/assets/charter/cargo-charter.jpg";
import medevacImg from "@/assets/charter/medevac-charter.jpg";
import groupImg from "@/assets/charter/group-charter.jpg";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap";

const useSerifFont = () => {
  useEffect(() => {
    if (document.querySelector(`link[href="${FONT_HREF}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }, []);
};

/* ── Content ──────────────────────────────────────────────────────── */

const NAV = [
  { label: "Charter", to: "/services" },
  { label: "Aircraft", to: "/fleet" },
  { label: "Empty legs", to: "/empty-legs" },
  { label: "Jet Card", to: "/jet-card" },
  { label: "Membership", to: "/membership" },
  { label: "Destinations", to: "/destinations" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

type Category = {
  id: string;
  name: string;
  type: string;
  pax: string;
  range: string;
  img: string;
  blurb: string;
};

// Figures are indicative category examples, to be checked before launch.
const CATEGORIES: Category[] = [
  { id: "turboprop", name: "Turboprop", type: "Pilatus PC-12 NGX", pax: "Up to 9", range: "1,800 nm", img: turbopropImg, blurb: "Short strips and short hops. The most economical way to reach places a jet cannot." },
  { id: "light", name: "Light", type: "Embraer Phenom 300E", pax: "Up to 9", range: "2,010 nm", img: lightImg, blurb: "Two to three hours in the air. Gulf and Levant routes, European city pairs." },
  { id: "midsize", name: "Midsize", type: "Citation Latitude", pax: "Up to 9", range: "2,700 nm", img: midsizeImg, blurb: "A flat floor and a proper lavatory. Dubai to the Mediterranean non-stop." },
  { id: "supermid", name: "Super-midsize", type: "Challenger 350", pax: "Up to 10", range: "3,200 nm", img: superMidImg, blurb: "Wide cabin, long legs. Dubai to London with room to work." },
  { id: "heavy", name: "Heavy", type: "Falcon 2000LXS", pax: "Up to 10", range: "4,000 nm", img: heavyImg, blurb: "Separate seating zones, full galley. Intercontinental without a stop." },
  { id: "ulr", name: "Ultra-long-range", type: "Gulfstream G650", pax: "Up to 14", range: "6,533 nm", img: ulrImg, blurb: "Fourteen hours non-stop. Dubai to New York, or anywhere else, in one leg." },
];

const DESTINATIONS = [
  { name: "London", slug: "london", note: "Farnborough, Luton, Biggin Hill" },
  { name: "Geneva", slug: "geneva", note: "Winter season" },
  { name: "Riyadh", slug: "riyadh", note: "Same-day return" },
  { name: "Maldives", slug: "maldives", note: "Seaplane connection arranged" },
  { name: "Monaco", slug: "monaco", note: "Via Nice, helicopter transfer" },
];

const MISSIONS = [
  { name: "Cargo and special missions", to: "/charter/cargo", img: cargoImg, text: "Freighters, outsize loads, time-critical parts." },
  { name: "Medical evacuation", to: "/evacuation", img: medevacImg, text: "Air ambulance with medical crew, any hour." },
  { name: "Group and corporate", to: "/charter/corporate", img: groupImg, text: "Twelve to two hundred seats, one contract." },
];

const Chevron = () => (
  <svg width="10" height="16" viewBox="0 0 10 16" aria-hidden="true" style={{ fill: "none", stroke: "currentColor", strokeWidth: 1.6 }}>
    <path d="M2 1l6 7-6 7" />
  </svg>
);

/* ── Page ─────────────────────────────────────────────────────────── */

const DuskHomePage = () => {
  useSerifFont();
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [trip, setTrip] = useState<"one" | "round" | "multi">("one");
  const [catId, setCatId] = useState("supermid");
  const [heroFrame, setHeroFrame] = useState(0);
  const cat = CATEGORIES.find((c) => c.id === catId) ?? CATEGORIES[0];
  const licences = verified(["dcaaLicence", "diezLicence"]);

  // A slow cross-fade between two frames stands in for the hero film.
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setHeroFrame((f) => (f + 1) % 2), 9000);
    return () => clearInterval(t);
  }, [reduce]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const reveal = {
    initial: reduce ? undefined : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.8, ease: EASE },
  };

  return (
    <div className="dusk">
      <SEOHead
        title="Dusk homepage preview"
        description="Design preview of the new Universal Jets homepage."
        path="/preview/dusk"
        noindex
      />

      {/* Header */}
      <header className="header">
        <div className="header__row">
          <div className="header__left">
            <button type="button" className="menu-btn" aria-expanded={menuOpen} aria-controls="dusk-menu" onClick={() => setMenuOpen(true)}>
              <span className="menu-btn__lines" aria-hidden="true"><i /><i /><i /></span>
              <span className="label">Menu</span>
            </button>
            <nav className="nav label" aria-label="Primary">
              {NAV.slice(0, 4).map((n) => (
                <Link key={n.to} to={n.to}>{n.label}</Link>
              ))}
            </nav>
          </div>
          <Link to="/" className="wordmark" aria-label="Universal Jets home">Universal <b>Jets</b></Link>
          <div className="header__right">
            <nav className="nav label" aria-label="Secondary">
              {NAV.slice(4, 7).map((n) => (
                <Link key={n.to} to={n.to}>{n.label}</Link>
              ))}
            </nav>
          </div>
        </div>
        <Link to="/request-flight" className="cta-bar label">Request a flight <Chevron /></Link>
      </header>

      {/* Full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="dusk-menu"
            className="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="menu__row">
              <span className="wordmark">Universal <b>Jets</b></span>
              <button type="button" className="menu-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <span className="label">Close</span>
              </button>
            </div>
            <div className="menu__links">
              {NAV.map((n, i) => (
                <motion.div
                  key={n.to}
                  initial={reduce ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                >
                  <Link to={n.to} onClick={() => setMenuOpen(false)}>
                    {n.label}
                    <Chevron />
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="menu__foot">
              <Link to="/request-flight" className="btn btn--gold">Request a flight</Link>
              <a href="mailto:sales@universaljets.com">sales@universaljets.com</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="hero" aria-labelledby="dusk-hero-title">
        <div className="hero__media" aria-hidden="true">
          <AnimatePresence initial={false}>
            <motion.img
              key={heroFrame}
              src={heroFrame === 0 ? heroImg : heroAltImg}
              alt=""
              initial={reduce ? false : { opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: reduce ? 1 : 1.0 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.6 }, scale: { duration: 9, ease: "linear" } }}
            />
          </AnimatePresence>
        </div>
        <div className="hero__inner">
          <motion.p
            className="label"
            style={{ color: "var(--gold)", margin: 0 }}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Private jet charter from Dubai, worldwide
          </motion.p>
          <motion.h1
            id="dusk-hero-title"
            className="serif display"
            style={{ margin: 0, maxWidth: "14ch" }}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35 }}
          >
            Private aviation, <em>arranged with precision.</em>
          </motion.h1>
          <motion.p
            className="hero__lede"
            style={{ margin: 0 }}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
          >
            An independent broker. We source the right aircraft from licensed operators for every trip, and one advisor stays with you from first call to landing.
          </motion.p>
          <motion.div
            className="hero__actions"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Link to="/request-flight" className="btn btn--gold">Request a flight</Link>
            <Link to="/fleet" className="btn btn--light">The aircraft guide</Link>
          </motion.div>
        </div>
      </section>

      {/* Request strip */}
      <section className="request" aria-labelledby="dusk-request-title">
        <form
          className="request__inner"
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/request-flight");
          }}
        >
          <div className="request__head">
            <h2 id="dusk-request-title" className="serif h3" style={{ margin: 0 }}>Where to?</h2>
            <div className="trip-types" role="group" aria-label="Trip type">
              {([
                ["one", "One way"],
                ["round", "Round trip"],
                ["multi", "Multi-city"],
              ] as const).map(([id, label]) => (
                <button key={id} type="button" aria-pressed={trip === id} onClick={() => setTrip(id)}>{label}</button>
              ))}
            </div>
          </div>
          <div className="fields">
            <div className="field">
              <label htmlFor="dusk-from">From</label>
              <input id="dusk-from" type="text" placeholder="Dubai" autoComplete="off" />
            </div>
            <div className="field">
              <label htmlFor="dusk-to">To</label>
              <input id="dusk-to" type="text" placeholder="London" autoComplete="off" />
            </div>
            <div className="field">
              <label htmlFor="dusk-date">Departure</label>
              <input id="dusk-date" type="text" placeholder="Date and time" autoComplete="off" />
            </div>
            {trip === "round" && (
              <div className="field">
                <label htmlFor="dusk-return">Return</label>
                <input id="dusk-return" type="text" placeholder="Date and time" autoComplete="off" />
              </div>
            )}
            <div className="field">
              <label htmlFor="dusk-pax">Passengers</label>
              <input id="dusk-pax" type="text" inputMode="numeric" placeholder="4" autoComplete="off" />
            </div>
            <button type="submit" className="btn btn--dark" style={{ minHeight: 50 }}>Get options</button>
          </div>
          <p className="request__note" style={{ margin: 0 }}>
            {trip === "multi" ? "Add the remaining legs on the next step. " : ""}
            A broker replies with aircraft options and a written quote. Nothing is charged at this stage.
          </p>
        </form>
      </section>

      {/* Pillars */}
      <section className="band band--sand" aria-labelledby="dusk-pillars-title">
        <div className="band__inner">
          <motion.div className="band__head" {...reveal}>
            <p className="label" style={{ margin: 0 }}>Why Universal Jets</p>
            <h2 id="dusk-pillars-title" className="serif h2" style={{ margin: 0 }}>One broker, <em>any mission.</em></h2>
          </motion.div>
          <div className="pillars">
            {[
              {
                title: "Independent",
                text: "We own no aircraft, so every recommendation is the right aircraft for your trip, not the one we need to fill.",
                icon: <path d="M6 30 L22 14 L38 30 M22 14 V38" />,
              },
              {
                title: licences.length ? "Licensed in Dubai" : "Based in Dubai",
                text: licences.length ? licences.map((l) => l.label).join(" · ") : "Universal Jets Aviation Brokerage FZCO.",
                icon: <><circle cx="22" cy="22" r="16" /><path d="M14 22 l6 6 l10 -12" /></>,
              },
              {
                title: "Beyond leisure",
                text: "Medical evacuation, cargo, group movements and government work, arranged by the same desk.",
                icon: <><path d="M6 24 h32" /><path d="M14 16 l-8 8 8 8" /><path d="M30 16 l8 8 -8 8" /></>,
              },
            ].map((p, i) => (
              <motion.div className="pillar" key={p.title} {...reveal} transition={{ ...reveal.transition, delay: 0.1 * i }}>
                <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">{p.icon}</svg>
                <h3 className="serif h3" style={{ margin: 0 }}>{p.title}</h3>
                <p>{p.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Aircraft */}
      <section className="band band--espresso" aria-labelledby="dusk-aircraft-title">
        <div className="band__inner">
          <motion.div className="band__head" {...reveal}>
            <p className="label" style={{ margin: 0 }}>The aircraft</p>
            <h2 id="dusk-aircraft-title" className="serif h2" style={{ margin: 0 }}>Every category, <em>one standard.</em></h2>
          </motion.div>
          <div className="cats" role="tablist" aria-label="Aircraft category">
            {CATEGORIES.map((c) => (
              <button key={c.id} type="button" role="tab" aria-selected={c.id === catId} onClick={() => setCatId(c.id)}>
                {c.name}
              </button>
            ))}
          </div>
          <div className="aircraft">
            <div className="aircraft__media">
              <AnimatePresence initial={false}>
                <motion.img
                  key={cat.id}
                  src={cat.img}
                  alt={`${cat.type}, ${cat.name} category`}
                  initial={reduce ? false : { opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                />
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={cat.id}
                className="aircraft__copy"
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                <p className="label" style={{ margin: 0, color: "var(--gold)" }}>{cat.name}</p>
                <h3 className="serif h2" style={{ margin: 0 }}>{cat.type}</h3>
                <p style={{ margin: 0, color: "var(--light)" }}>{cat.blurb}</p>
                <dl className="specs">
                  <div><dt>Passengers</dt><dd>{cat.pax}</dd></div>
                  <div><dt>Range</dt><dd>{cat.range}</dd></div>
                  <div><dt>Availability</dt><dd style={{ fontSize: 22 }}>On request</dd></div>
                </dl>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, paddingTop: 8 }}>
                  <Link to="/request-flight" className="btn btn--gold">Request this category</Link>
                  <Link to="/fleet" className="btn btn--light">Compare aircraft</Link>
                </div>
                <p className="aircraft__note" style={{ margin: 0 }}>
                  Example aircraft and indicative figures for the category. Universal Jets is a broker; flights are operated by licensed third-party operators.
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="band band--stone" aria-labelledby="dusk-dest-title">
        <div className="band__inner">
          <motion.div className="band__head" {...reveal}>
            <p className="label" style={{ margin: 0 }}>Destinations</p>
            <h2 id="dusk-dest-title" className="serif h2" style={{ margin: 0 }}>Where our clients <em>fly this season.</em></h2>
          </motion.div>
          <div className="dest">
            <motion.div {...reveal}>
              <Link to="/destinations/dubai" className="dest__feature">
                <img src={dubaiImg} alt="" />
                <p className="label" style={{ margin: "0 0 10px", color: "var(--gold)" }}>Featured</p>
                <h3 className="serif" style={{ margin: 0, fontSize: "clamp(40px, 5vw, 64px)" }}>Dubai</h3>
                <p style={{ margin: "8px 0 20px", maxWidth: "40ch", color: "var(--light)" }}>
                  Al Maktoum for heavy jets and quick departures, Dubai International for the city. We handle slots, permits and the chauffeur to the aircraft door.
                </p>
                <span className="btn btn--light" style={{ justifySelf: "start" }}>Explore Dubai</span>
              </Link>
            </motion.div>
            <motion.div className="dest__list" {...reveal} transition={{ ...reveal.transition, delay: 0.1 }}>
              {DESTINATIONS.map((d) => (
                <Link key={d.slug} to={`/destinations/${d.slug}`}>
                  {d.name}
                  <span>{d.note}</span>
                </Link>
              ))}
              <div style={{ paddingTop: 20 }}>
                <Link to="/destinations" className="btn btn--dark">All destinations</Link>
              </div>
            </motion.div>
          </div>
          <div style={{ marginTop: 56, display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", alignItems: "center" }}>
            <motion.img src={cabinImg} alt="Cabin of a heavy jet, stand-in image" style={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover" }} {...reveal} />
            <motion.img src={londonImg} alt="London, stand-in image" style={{ width: "100%", aspectRatio: "16 / 10", objectFit: "cover" }} {...reveal} transition={{ ...reveal.transition, delay: 0.1 }} />
          </div>
        </div>
      </section>

      {/* Programmes */}
      <section className="band band--espresso" aria-labelledby="dusk-prog-title">
        <div className="band__inner">
          <motion.div className="band__head" {...reveal}>
            <p className="label" style={{ margin: 0 }}>Programmes</p>
            <h2 id="dusk-prog-title" className="serif h2" style={{ margin: 0 }}>Fly often? <em>Two ways to simplify.</em></h2>
          </motion.div>
          <div className="programmes">
            {[
              {
                name: "Altus Jet Card",
                text: "Prepaid hours at a fixed hourly rate, by aircraft category. Hours carry forward.",
                points: ["Fixed hourly rate per category", "No membership fee", "Hours carry forward", "Book with one message"],
                to: "/jet-card",
                cta: "Jet Card details",
              },
              {
                name: "Membership",
                text: "A monthly plan with a dedicated advisor and priority handling, for clients who fly regularly on demand.",
                points: ["Dedicated advisor", "Priority handling", "Monthly, no long-term contract", "Four tiers"],
                to: "/membership",
                cta: "Membership tiers",
              },
            ].map((p, i) => (
              <motion.div className="programme" key={p.name} {...reveal} transition={{ ...reveal.transition, delay: 0.1 * i }}>
                <h3 className="serif h3" style={{ margin: 0 }}>{p.name}</h3>
                <p style={{ margin: 0, color: "var(--light)" }}>{p.text}</p>
                <ul>{p.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
                <div style={{ paddingTop: 8 }}>
                  <Link to={p.to} className="btn btn--light">{p.cta}</Link>
                </div>
              </motion.div>
            ))}
          </div>
          <p style={{ margin: "28px 0 0", textAlign: "center", color: "var(--light)", fontSize: 13 }}>
            Jet Card and Membership are separate programmes. Terms for each are on their own pages.
          </p>
        </div>
      </section>

      {/* Missions */}
      <section className="band band--sand" aria-labelledby="dusk-missions-title">
        <div className="band__inner">
          <motion.div className="band__head" {...reveal}>
            <p className="label" style={{ margin: 0 }}>Beyond leisure</p>
            <h2 id="dusk-missions-title" className="serif h2" style={{ margin: 0 }}>When the flight <em>is the mission.</em></h2>
          </motion.div>
          <div className="missions">
            {MISSIONS.map((m, i) => (
              <motion.div key={m.to} {...reveal} transition={{ ...reveal.transition, delay: 0.08 * i }}>
                <Link to={m.to} className="mission">
                  <img src={m.img} alt="" />
                  <h3 className="serif h3" style={{ margin: 0 }}>{m.name}</h3>
                  <p>{m.text}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="foot">
        <div className="foot__inner">
          <div>
            <h2 className="serif h2">Contact</h2>
            <address>
              Universal Jets Aviation Brokerage FZCO<br />
              [Office address, Dubai]<br />
              <a href="mailto:sales@universaljets.com">sales@universaljets.com</a><br />
              [Primary number] · WhatsApp
            </address>
            <div style={{ paddingTop: 20 }}>
              <Link to="/request-flight" className="btn btn--gold">Request a flight</Link>
            </div>
          </div>
          <nav className="foot__links label" aria-label="Footer">
            {NAV.map((n) => <Link key={n.to} to={n.to}>{n.label}</Link>)}
          </nav>
          <nav className="foot__links label" aria-label="Legal">
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/cookies">Cookies</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/partners">Partners</Link>
          </nav>
          <p className="foot__legal">
            Universal Jets Aviation Brokerage FZCO acts as a charter broker and arranges flights on behalf of clients with third-party licensed operators. It does not own or operate aircraft.
            {licences.length ? ` ${licences.map((l) => l.label).join(" · ")}.` : ""}
            {" "}Photographs are stand-ins pending licensed photography; aircraft figures are indicative.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DuskHomePage;
