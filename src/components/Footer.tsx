import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Award, FileCheck, Globe } from "lucide-react";

const companyLinks = [
  { label: "About", href: "/#cta" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/#cta" },
];

const serviceLinks = [
  { label: "Private Charter", href: "/#cta" },
  { label: "Jet Card", href: "/jet-card" },
  { label: "ACMI Leasing", href: "/acmi-leasing" },
];

const exploreLinks = [
  { label: "Empty Legs", href: "/#empty-legs" },
  { label: "Destinations", href: "/destinations" },
  { label: "Membership", href: "/members" },
];

const certifications = [
  { icon: ShieldCheck, text: "ARGUS Registered Broker" },
  { icon: Award, text: "WYVERN Certified" },
  { icon: FileCheck, text: "DCAA License No. 3342665" },
  { icon: Globe, text: "DIEZ License No. 50370" },
];

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/universaljets", path: "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" },
  { label: "Facebook", href: "https://www.facebook.com/universaljets", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/universaljets", path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" },
  { label: "WhatsApp", href: "https://wa.me/971501234567", path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" },
];

const LinkItem = ({ label, href }: { label: string; href: string }) =>
  href.startsWith("/") && !href.startsWith("/#") ? (
    <Link to={href} className="block text-[11px] tracking-[0.15em] uppercase text-foreground/35 hover:text-primary transition-colors duration-400 font-light">
      {label}
    </Link>
  ) : (
    <a href={href} className="block text-[11px] tracking-[0.15em] uppercase text-foreground/35 hover:text-primary transition-colors duration-400 font-light">
      {label}
    </a>
  );

const Footer = () => (
  <footer className="relative pt-24 pb-8">
    {/* Noise */}
    <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat" }} />

    <div className="container mx-auto px-8 relative z-10">

      {/* ─── TOP: Brand + Nav ─── */}
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-0 justify-between mb-16">

        {/* Brand */}
        <div className="max-w-sm">
          <Link to="/" className="inline-block mb-4">
            <span className="font-display text-[15px] tracking-[0.45em] uppercase font-light">
              <span className="text-foreground/80">Universal</span>
              <span className="text-gradient-gold ml-1.5 font-normal">Jets</span>
            </span>
          </Link>
          <p className="text-[12px] leading-[1.8] text-foreground/30 font-light">
            Private aviation, redefined.<br />
            Seamless global charter solutions for those who expect more.
          </p>
        </div>

        {/* Nav Columns */}
        <div className="grid grid-cols-3 gap-12 lg:gap-20">
          <div className="space-y-4">
            <h4 className="text-[9px] tracking-[0.35em] uppercase text-primary/60 font-semibold mb-5">Company</h4>
            {companyLinks.map((l) => <LinkItem key={l.label} {...l} />)}
          </div>
          <div className="space-y-4">
            <h4 className="text-[9px] tracking-[0.35em] uppercase text-primary/60 font-semibold mb-5">Services</h4>
            {serviceLinks.map((l) => <LinkItem key={l.label} {...l} />)}
          </div>
          <div className="space-y-4">
            <h4 className="text-[9px] tracking-[0.35em] uppercase text-primary/60 font-semibold mb-5">Explore</h4>
            {exploreLinks.map((l) => <LinkItem key={l.label} {...l} />)}
          </div>
        </div>
      </div>

      {/* ─── TRUST STRIP ─── */}
      <div className="border-t border-b border-primary/15 py-6 mb-10">
        <div className="flex flex-wrap items-center justify-center lg:justify-between gap-6 lg:gap-4">
          {certifications.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex items-center gap-2.5"
            >
              <cert.icon className="w-4 h-4 text-primary/70" strokeWidth={1.4} />
              <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/40 font-light">{cert.text}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── PARTNERS / PAYMENTS ─── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <div className="flex items-center gap-3">
          {["Visa", "Mastercard", "Amex"].map((name) => (
            <span key={name} className="px-3 py-1.5 rounded border border-foreground/10 text-[9px] tracking-[0.2em] uppercase text-foreground/30 font-light">
              {name}
            </span>
          ))}
        </div>
        <span className="text-[9px] tracking-[0.15em] text-foreground/20 font-extralight">
          Co-branded & White Label Card Programs Available
        </span>
      </div>

      {/* ─── SOCIAL ─── */}
      <div className="flex items-center justify-center gap-4 mb-12">
        {socials.map((s) => (
          <motion.a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex items-center justify-center"
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(200,169,106,0.15)",
              color: "#C8A96A",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              el.style.background = "#C8A96A";
              el.style.color = "#000";
              el.style.boxShadow = "0 8px 25px rgba(200,169,106,0.4)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              el.style.background = "rgba(255,255,255,0.05)";
              el.style.color = "#C8A96A";
              el.style.boxShadow = "none";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d={s.path} />
            </svg>
          </motion.a>
        ))}
      </div>

      {/* ─── BOTTOM ─── */}
      <div className="border-t border-foreground/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-[9px] text-foreground/20 font-extralight tracking-[0.15em]">
          © {new Date().getFullYear()} Universal Jets Aviation Brokerage FZCO. All rights reserved.
        </p>
        <div className="flex items-center gap-5">
          {[
            { label: "Terms", href: "/terms" },
            { label: "Privacy", href: "/privacy" },
            { label: "Cookies", href: "/cookies" },
          ].map((l) => (
            <Link key={l.label} to={l.href} className="text-[8px] tracking-[0.15em] text-foreground/15 hover:text-foreground/35 transition-colors duration-500 uppercase font-extralight">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
