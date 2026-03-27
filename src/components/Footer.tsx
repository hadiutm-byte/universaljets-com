import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Award, FileCheck, Globe } from "lucide-react";

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

const serviceLinks = [
  { label: "Private Charter", href: "/#cta" },
  { label: "Fleet", href: "/fleet" },
  { label: "Jet Card", href: "/jet-card" },
  { label: "ACMI Leasing", href: "/acmi-leasing" },
];

const exploreLinks = [
  { label: "Empty Legs", href: "/#empty-legs" },
  { label: "Membership", href: "/members" },
  { label: "Concierge", href: "/concierge" },
  { label: "Destinations", href: "/destinations" },
];

const certifications = [
  { icon: ShieldCheck, text: "ARGUS Registered Broker" },
  { icon: Award, text: "WYVERN Certified" },
  { icon: FileCheck, text: "DCAA License No. 3342665" },
  { icon: Globe, text: "DIEZ License No. 50370" },
];

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/universaljetsfzco", path: "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" },
  { label: "Facebook", href: "https://www.facebook.com/share/1CNWNni3gE/", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/universal-travel-management-&-network/", path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" },
  { label: "WhatsApp", href: "https://wa.me/447888999944", path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" },
];

/* Curated luxury ecosystem partners — monochrome text logos */
const partnerNames = [
  /* Payment */ "Visa", "Mastercard", "American Express",
  /* Hotels */ "Four Seasons", "Ritz-Carlton", "Mandarin Oriental", "Aman",
  /* Mobility */ "Sixt", "Blacklane",
  /* Yachting */ "MSC Yacht Club", "Explora Journeys",
  /* Events */ "Formula 1", "Art Basel",
];

const LinkItem = ({ label, href }: { label: string; href: string }) => {
  const cls = "block text-[13px] mb-2 text-white/65 hover:text-white hover:translate-x-[5px] transition-all duration-300 focus-visible:text-white";
  return href.startsWith("/") && !href.startsWith("/#") ? (
    <Link to={href} className={cls}>{label}</Link>
  ) : (
    <a href={href} className={cls}>{label}</a>
  );
};

const Footer = () => (
  <footer
    className="relative"
    style={{
      background: "linear-gradient(180deg, hsl(240, 2%, 12%) 0%, hsl(240, 3%, 8%) 100%)",
      padding: "80px 60px 40px",
    }}
  >
    {/* TOP: Brand + Nav */}
    <div className="flex flex-col lg:flex-row justify-between mb-[60px] gap-12 lg:gap-0">
      <div>
        <Link to="/">
          <h2 className="text-[22px] tracking-[4px] font-light mb-2.5 uppercase">
            <span className="text-white/80">Universal</span>{" "}
            <span className="text-gradient-gold font-normal">Jets</span>
          </h2>
        </Link>
        <p className="text-[14px] text-white/65 max-w-[300px] leading-[1.6] font-light mb-4">
          Private aviation, redefined.<br />
          Seamless global charter solutions for those who expect more.
        </p>
        <div className="space-y-2">
          <a href="mailto:sales@universaljets.com" className="block text-[13px] text-white/70 hover:text-primary transition-colors" aria-label="Email Universal Jets sales team">sales@universaljets.com</a>
          <a href="https://wa.me/447888999944" target="_blank" rel="noopener noreferrer" className="block text-[13px] text-white/70 hover:text-primary transition-colors" aria-label="Contact Universal Jets on WhatsApp">WhatsApp</a>
        </div>
      </div>

      <div className="flex flex-wrap gap-12 lg:gap-20">
        <div>
          <h4 className="text-[13px] tracking-[2px] mb-4 font-semibold text-primary">Company</h4>
          {companyLinks.map((l) => <LinkItem key={l.label} {...l} />)}
        </div>
        <div>
          <h4 className="text-[13px] tracking-[2px] mb-4 font-semibold text-primary">Services</h4>
          {serviceLinks.map((l) => <LinkItem key={l.label} {...l} />)}
        </div>
        <div>
          <h4 className="text-[13px] tracking-[2px] mb-4 font-semibold text-primary">Explore</h4>
          {exploreLinks.map((l) => <LinkItem key={l.label} {...l} />)}
        </div>
      </div>
    </div>

    {/* TRUST STRIP */}
    <div className="flex flex-wrap justify-between gap-4 py-[25px] mb-10 border-t border-white/10 border-b border-b-white/10">
      {certifications.map((cert, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.1 }}
          className="flex items-center gap-2.5"
        >
          <cert.icon className="w-4 h-4 flex-shrink-0 text-primary" strokeWidth={1.4} />
          <span className="text-[12px] text-white/50">{cert.text}</span>
        </motion.div>
      ))}
    </div>

    {/* PARTNER ECOSYSTEM — subtle rotating strip */}
    <div className="relative overflow-hidden py-6 mb-10">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[hsl(240,3%,10%)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[hsl(240,3%,10%)] to-transparent z-10 pointer-events-none" />
      <div className="animate-scroll-logos flex gap-14 items-center whitespace-nowrap" style={{ animationDuration: "50s" }}>
        {[...partnerNames, ...partnerNames].map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="text-[11px] tracking-[0.25em] uppercase text-white/20 font-light select-none flex-shrink-0"
          >
            {name}
          </span>
        ))}
      </div>
    </div>

    {/* SOCIAL */}
    <div className="flex gap-4 mb-8">
      {socials.map((s) => (
        <motion.a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.label}
          whileHover={{ y: -3, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-primary hover:bg-primary hover:text-white hover:shadow-[0_8px_25px_-5px_hsla(43,85%,58%,0.3)] transition-all duration-300"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d={s.path} />
          </svg>
        </motion.a>
      ))}
    </div>

    {/* BOTTOM */}
    <div className="pt-8 flex flex-col items-center gap-6 border-t border-white/[0.06]">
      <div className="flex items-center gap-6">
        {[
          { label: "Terms", href: "/terms" },
          { label: "Privacy", href: "/privacy" },
          { label: "Cookies", href: "/cookies" },
        ].map((l, i) => (
          <span key={l.label} className="flex items-center gap-6">
            {i > 0 && <span className="text-white/10">·</span>}
            <Link to={l.href} className="text-[10px] tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors uppercase">
              {l.label}
            </Link>
          </span>
        ))}
      </div>

      <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="text-center space-y-2">
        <p className="text-[11px] tracking-[0.35em] uppercase text-white/25 font-light">
          Universal Jets F.Z.C.O.
        </p>
        <p className="text-[10px] tracking-[0.15em] text-white/20 font-light">
          © {new Date().getFullYear()} Universal Jets. All Rights Reserved.
        </p>
      </div>

      <p className="text-[9px] tracking-[0.2em] uppercase text-white/15 font-light pb-2">
        Designed and Developed by Universal Jets
      </p>
    </div>
  </footer>
);

export default Footer;
