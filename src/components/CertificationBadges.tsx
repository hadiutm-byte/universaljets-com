import { ShieldCheck, Award, CheckCircle2, Globe, FileCheck } from "lucide-react";
import { CLAIMS, isVerified, type ClaimKey } from "@/lib/claims";

// Only claims with proof on file (src/lib/claims.ts) are shown.
const candidates: { key: ClaimKey; icon: typeof ShieldCheck }[] = [
  { key: "argusBroker", icon: ShieldCheck },
  { key: "wyvernBroker", icon: Award },
  { key: "isbaoOperators", icon: CheckCircle2 },
  { key: "countriesServed", icon: Globe },
  { key: "dcaaLicence", icon: FileCheck },
  { key: "diezLicence", icon: FileCheck },
];
const badges = candidates.filter((c) => isVerified(c.key)).map((c) => ({ icon: c.icon, label: CLAIMS[c.key].label, desc: CLAIMS[c.key].detail }));

const CertificationBadges = () => badges.length === 0 ? null : (
  <section className="py-12 md:py-16 px-4 border-t border-b border-foreground/5" aria-label="Safety certifications">
    <div className="max-w-6xl mx-auto">
      <p className="text-center text-primary font-semibold tracking-[0.25em] uppercase text-[11px] mb-8">
        Safety & Compliance
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {badges.map((b) => (
          <div key={b.label} className="flex flex-col items-center text-center gap-2">
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
