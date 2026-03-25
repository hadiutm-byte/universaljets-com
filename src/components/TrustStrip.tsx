import { motion } from "framer-motion";
import { ShieldCheck, Award, FileCheck, Globe } from "lucide-react";
import { FadeReveal } from "./ui/ScrollEffects";

const certifications = [
  { icon: ShieldCheck, name: "ARGUS", detail: "Registered Broker" },
  { icon: Award, name: "WYVERN", detail: "Certified" },
  { icon: FileCheck, name: "DCAA", detail: "License No. 3342665" },
  { icon: Globe, name: "DIEZ", detail: "License No. 50370" },
];

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/universaljets", path: "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" },
  { label: "Facebook", href: "https://www.facebook.com/universaljets", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/universaljets", path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" },
  { label: "WhatsApp", href: "https://wa.me/971501234567", path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" },
];

const TrustStrip = () => (
  <section className="relative z-10">
    <FadeReveal>
      <div
        className="py-8 md:py-10 px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-6"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(10px)",
          borderTop: "1px solid hsla(38,52%,53%,0.2)",
          borderBottom: "1px solid hsla(38,52%,53%,0.2)",
        }}
      >
        {/* Left: Certifications */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 md:gap-10">
          {certifications.map((cert, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-center gap-2.5 cursor-default group"
            >
              <cert.icon
                className="w-[18px] h-[18px] flex-shrink-0 transition-all duration-400 group-hover:drop-shadow-[0_0_8px_hsla(38,52%,53%,0.4)]"
                strokeWidth={1.4}
                style={{ color: "hsl(38,52%,53%)" }}
              />
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold tracking-[1px] uppercase text-foreground/90 leading-tight">
                  {cert.name}
                </span>
                <small className="text-[9px] text-foreground/40 font-light leading-snug">
                  {cert.detail}
                </small>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Divider (desktop) */}
        <div className="hidden md:block w-px h-8 bg-white/[0.08]" />

        {/* Right: Social */}
        <div className="flex items-center gap-4">
          {socials.map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center text-foreground/40 hover:text-primary hover:border-primary/30 hover:shadow-[0_0_16px_-4px_hsla(38,52%,53%,0.3)] transition-all duration-400"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d={s.path} />
              </svg>
            </motion.a>
          ))}
        </div>
      </div>
    </FadeReveal>
  </section>
);

export default TrustStrip;