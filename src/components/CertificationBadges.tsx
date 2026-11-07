import { ShieldCheck, Award, CheckCircle2, Globe, FileCheck } from "lucide-react";
import { onlyVerified, FIGURES } from "@/lib/claims";

const badges = onlyVerified([
  { icon: ShieldCheck, label: "ARGUS Rated", desc: "International safety audit", claim: "argus" as const },
  { icon: Award, label: "WYVERN Wingman", desc: "Operator verification", claim: "wyvern" as const },
  { icon: CheckCircle2, label: "IS-BAO Compliant", desc: "Safety management standard", claim: "isbao" as const },
  { icon: Globe, label: `${FIGURES.countryCount} Countries`, desc: "Global operational reach", claim: "countryCount" as const },
  { icon: FileCheck, label: "DCAA Licensed", desc: "Licence No. 3342665" },
  { icon: Globe, label: "DIEZ Registered", desc: "Licence No. 50370" },
]).slice(0, 4);

const CertificationBadges = () => (
  <section className="py-12 md:py-16 px-4 border-t border-b border-foreground/5" aria-label="Safety certifications">
    <div className="max-w-6xl mx-auto">
      <p className="text-center text-primary font-semibold tracking-[0.25em] uppercase text-[11px] mb-8">
        Licensing & Compliance
      </p>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-8 md:gap-x-20">
        {badges.map((b) => (
          <div key={b.label} className="flex flex-col items-center text-center gap-2 w-[42%] md:w-auto md:min-w-[160px]">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-1">
              <b.icon className="w-6 h-6 text-primary" />
            </div>
            <span className="font-semibold text-sm">{b.label}</span>
            <span className="text-muted-foreground text-[11px]">{b.desc}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CertificationBadges;
