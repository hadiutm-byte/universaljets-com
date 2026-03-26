import { motion } from "framer-motion";
import { Hotel, Car, Sparkles } from "lucide-react";
import { FadeReveal, StaggerContainer, StaggerItem, GlassCard, FloatingElement } from "./ui/ScrollEffects";

const privileges = [
  { icon: Hotel, text: "Complimentary suite upgrades at partner hotels" },
  { icon: Car, text: "Discounts on luxury chauffeur services" },
  { icon: Sparkles, text: "Exclusive access to VIP events" },
];

const MemberPrivileges = () => (
  <section className="py-20 relative">
    <div className="container mx-auto px-8 relative z-10">
      <FadeReveal className="text-center mb-14">
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/70 mb-6 font-light">
          Beyond Aviation
        </p>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold text-foreground mb-4">
          Member <span className="text-gradient-gold italic">Privileges</span>
        </h2>
        <p className="text-[13px] text-foreground/55 font-light leading-[2] max-w-lg mx-auto mb-3">
          Your Universal Jets membership comes with more than just flights — enjoy curated luxury experiences worldwide.
        </p>
        <p className="text-[11px] text-foreground/40 font-light leading-[2] max-w-md mx-auto">
          Room upgrades at top-tier hotels, luxury car rental discounts, spa and concierge perks, and tailored experiences — wherever you travel.
        </p>
      </FadeReveal>

      <StaggerContainer className="max-w-md mx-auto space-y-4 mb-12">
        {privileges.map((p, i) => (
          <StaggerItem key={i}>
            <GlassCard hover breathe className="flex items-center gap-4 py-5 px-6">
              <FloatingElement amplitude={4} speed={5 + i}>
                <p.icon className="w-4 h-4 text-primary/65 flex-shrink-0" strokeWidth={1.2} />
              </FloatingElement>
              <span className="text-[12px] text-foreground/70 font-light">{p.text}</span>
            </GlassCard>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeReveal delay={0.3} className="text-center">
        <p className="text-[11px] text-foreground/35 font-extralight italic">
          Wherever you go, your membership travels with you — unlocking a world of added luxury.
        </p>
      </FadeReveal>
    </div>
  </section>
);

export default MemberPrivileges;
