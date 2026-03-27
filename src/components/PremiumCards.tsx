import { motion } from "framer-motion";

/* ═══ SHARED CHIP PATTERN ═══ */
const chipPattern = "url(\"data:image/svg+xml,%3Csvg width='40' height='30' viewBox='0 0 40 30' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='2' y='2' width='36' height='26' rx='4' fill='none' stroke='%23FFD700' stroke-width='0.5' opacity='0.6'/%3E%3Cline x1='14' y1='2' x2='14' y2='28' stroke='%23FFD700' stroke-width='0.3' opacity='0.4'/%3E%3Cline x1='26' y1='2' x2='26' y2='28' stroke='%23FFD700' stroke-width='0.3' opacity='0.4'/%3E%3Cline x1='2' y1='10' x2='40' y2='10' stroke='%23FFD700' stroke-width='0.3' opacity='0.4'/%3E%3Cline x1='2' y1='20' x2='40' y2='20' stroke='%23FFD700' stroke-width='0.3' opacity='0.4'/%3E%3C/svg%3E\")";

const UJLogo = ({ className = "text-white/80" }: { className?: string }) => (
  <span className={`font-display text-[11px] tracking-[0.35em] uppercase font-semibold ${className}`}>
    Universal Jets
  </span>
);

const VisaLogo = () => (
  <span className="font-display text-[16px] tracking-[0.05em] font-bold italic text-white/90">VISA</span>
);

const MastercardLogo = () => (
  <div className="flex items-center gap-[-4px]">
    <div className="w-5 h-5 rounded-full bg-[hsl(0,80%,55%)] opacity-90" />
    <div className="w-5 h-5 rounded-full bg-[hsl(40,90%,55%)] opacity-90 -ml-2" />
  </div>
);

/* ═══ TIER COLOR MAP ═══ */
const tierStyles: Record<string, { bg: string; accent: string; border: string; text: string }> = {
  nomad: {
    bg: "linear-gradient(135deg, hsl(220, 15%, 12%) 0%, hsl(215, 20%, 18%) 50%, hsl(210, 15%, 14%) 100%)",
    accent: "hsl(210, 40%, 55%)",
    border: "hsl(210, 30%, 28%)",
    text: "text-[hsl(210,40%,70%)]",
  },
  explorer: {
    bg: "linear-gradient(135deg, hsl(220, 12%, 10%) 0%, hsl(260, 18%, 16%) 50%, hsl(280, 15%, 12%) 100%)",
    accent: "hsl(270, 45%, 60%)",
    border: "hsl(270, 25%, 30%)",
    text: "text-[hsl(270,40%,72%)]",
  },
  globetrotter: {
    bg: "linear-gradient(135deg, hsl(160, 12%, 10%) 0%, hsl(165, 20%, 15%) 50%, hsl(170, 15%, 11%) 100%)",
    accent: "hsl(165, 50%, 45%)",
    border: "hsl(165, 25%, 25%)",
    text: "text-[hsl(165,40%,60%)]",
  },
  maverick: {
    bg: "linear-gradient(135deg, hsl(35, 15%, 10%) 0%, hsl(40, 25%, 16%) 50%, hsl(43, 20%, 12%) 100%)",
    accent: "hsl(43, 85%, 58%)",
    border: "hsl(43, 40%, 28%)",
    text: "text-primary",
  },
};

/* ═══ MEMBERSHIP CARD ═══ */
export const MembershipCard = ({
  tier = "maverick",
  name = "Mr. Ricky Smith",
  cardNumber = "4217  8400  5591  0037",
  validThru = "12/28",
  delay = 0,
}: {
  tier?: string;
  name?: string;
  cardNumber?: string;
  validThru?: string;
  delay?: number;
}) => {
  const style = tierStyles[tier] || tierStyles.maverick;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateY: -8 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.03, rotateY: 3, boxShadow: `0 25px 60px -15px ${style.accent}33` }}
      className="relative w-full max-w-[380px] aspect-[1.586/1] rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Subtle texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }} />

      {/* Holographic stripe */}
      <div className="absolute top-0 right-0 w-[45%] h-full opacity-[0.06]" style={{
        background: `linear-gradient(135deg, transparent 30%, ${style.accent} 50%, transparent 70%)`,
      }} />

      <div className="relative z-10 flex flex-col justify-between h-full p-5 md:p-6">
        {/* Top: Brand + Tier */}
        <div className="flex items-start justify-between">
          <div>
            <UJLogo className={style.text} />
            <p className="text-[7px] tracking-[0.5em] uppercase mt-1 font-light" style={{ color: style.accent }}>
              {tier.charAt(0).toUpperCase() + tier.slice(1)} Member
            </p>
          </div>
          <div className="w-[38px] h-[28px] mt-1" style={{ backgroundImage: chipPattern, backgroundSize: "contain", backgroundRepeat: "no-repeat" }} />
        </div>

        {/* Card Number */}
        <div className="my-auto">
          <p className="text-[15px] md:text-[17px] tracking-[0.22em] text-white/85 font-light font-mono">
            {cardNumber}
          </p>
        </div>

        {/* Bottom: Name + Valid */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[7px] tracking-[0.2em] uppercase text-white/35 font-light mb-0.5">Card Holder</p>
            <p className="text-[11px] tracking-[0.15em] uppercase text-white/80 font-medium">{name}</p>
          </div>
          <div className="text-right">
            <p className="text-[7px] tracking-[0.2em] uppercase text-white/35 font-light mb-0.5">Valid Thru</p>
            <p className="text-[11px] tracking-[0.1em] text-white/80 font-medium">{validThru}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══ JET CARD ═══ */
export const JetCard = ({
  name = "Mr. Ricky Smith",
  cardNumber = "6011  7200  4488  1256",
  memberSince = "2016",
  delay = 0,
}: {
  name?: string;
  cardNumber?: string;
  memberSince?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30, rotateY: -8 }}
    whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ scale: 1.03, rotateY: 3, boxShadow: "0 30px 80px -15px hsla(43, 85%, 58%, 0.25)" }}
    className="relative w-full max-w-[380px] aspect-[1.586/1] rounded-2xl overflow-hidden cursor-pointer"
    style={{
      background: "linear-gradient(145deg, hsl(35, 20%, 8%) 0%, hsl(40, 30%, 14%) 35%, hsl(43, 40%, 18%) 65%, hsl(38, 25%, 10%) 100%)",
      border: "1px solid hsl(43, 50%, 25%)",
    }}
  >
    {/* Gold foil texture */}
    <div className="absolute inset-0 opacity-[0.08]" style={{
      background: "radial-gradient(ellipse 80% 60% at 70% 30%, hsl(43, 85%, 58%) 0%, transparent 60%)",
    }} />
    <div className="absolute inset-0 opacity-[0.04]" style={{
      backgroundImage: "repeating-linear-gradient(135deg, transparent, transparent 2px, hsla(43,74%,49%,0.15) 2px, hsla(43,74%,49%,0.15) 3px)",
    }} />

    {/* Diagonal gold accent */}
    <div className="absolute -top-10 -right-10 w-[200px] h-[200px] opacity-[0.06] rounded-full" style={{
      background: "radial-gradient(circle, hsl(43, 85%, 58%) 0%, transparent 70%)",
    }} />

    <div className="relative z-10 flex flex-col justify-between h-full p-5 md:p-6">
      {/* Top */}
      <div className="flex items-start justify-between">
        <div>
          <UJLogo className="text-primary/80" />
          <p className="text-[7px] tracking-[0.5em] uppercase text-primary/50 mt-1 font-light">
            Altus Jet Card Global
          </p>
        </div>
        <div className="w-[38px] h-[28px] mt-1" style={{ backgroundImage: chipPattern, backgroundSize: "contain", backgroundRepeat: "no-repeat" }} />
      </div>

      {/* Number */}
      <div className="my-auto">
        <p className="text-[15px] md:text-[17px] tracking-[0.22em] text-white/85 font-light font-mono">
          {cardNumber}
        </p>
      </div>

      {/* Bottom */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[7px] tracking-[0.2em] uppercase text-white/35 font-light mb-0.5">Card Holder</p>
          <p className="text-[11px] tracking-[0.15em] uppercase text-white/80 font-medium">{name}</p>
        </div>
        <div className="text-right">
          <p className="text-[7px] tracking-[0.2em] uppercase text-white/35 font-light mb-0.5">Member Since</p>
          <p className="text-[14px] tracking-[0.1em] text-primary/80 font-display font-semibold">{memberSince}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

/* ═══ CO-BRANDED CARD (Visa / Mastercard) ═══ */
export const CoBrandedCard = ({
  network = "visa",
  name = "Mr. Ricky Smith",
  cardNumber = "4000  1234  5678  9010",
  validThru = "09/29",
  delay = 0,
}: {
  network?: "visa" | "mastercard";
  name?: string;
  cardNumber?: string;
  validThru?: string;
  delay?: number;
}) => {
  const isVisa = network === "visa";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateY: -8 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.03, rotateY: 3, boxShadow: isVisa ? "0 25px 60px -15px hsla(220,60%,50%,0.2)" : "0 25px 60px -15px hsla(0,60%,50%,0.15)" }}
      className="relative w-full max-w-[380px] aspect-[1.586/1] rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: isVisa
          ? "linear-gradient(145deg, hsl(225, 25%, 10%) 0%, hsl(228, 30%, 16%) 50%, hsl(230, 20%, 12%) 100%)"
          : "linear-gradient(145deg, hsl(0, 8%, 10%) 0%, hsl(350, 12%, 15%) 50%, hsl(355, 10%, 11%) 100%)",
        border: `1px solid ${isVisa ? "hsl(225, 25%, 25%)" : "hsl(350, 15%, 25%)"}`,
      }}
    >
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: isVisa
          ? "radial-gradient(ellipse 60% 50% at 80% 20%, hsl(225, 50%, 50%) 0%, transparent 60%)"
          : "radial-gradient(ellipse 60% 50% at 80% 20%, hsl(350, 50%, 45%) 0%, transparent 60%)",
      }} />

      <div className="relative z-10 flex flex-col justify-between h-full p-5 md:p-6">
        {/* Top: UJ logo + Network */}
        <div className="flex items-start justify-between">
          <div>
            <UJLogo className="text-white/70" />
            <p className="text-[7px] tracking-[0.4em] uppercase text-white/30 mt-1 font-light">
              {isVisa ? "Visa Infinite" : "World Elite"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-[38px] h-[28px]" style={{ backgroundImage: chipPattern, backgroundSize: "contain", backgroundRepeat: "no-repeat" }} />
          </div>
        </div>

        {/* Number */}
        <div className="my-auto">
          <p className="text-[15px] md:text-[17px] tracking-[0.22em] text-white/85 font-light font-mono">
            {cardNumber}
          </p>
        </div>

        {/* Bottom */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[7px] tracking-[0.2em] uppercase text-white/35 font-light mb-0.5">Card Holder</p>
            <p className="text-[11px] tracking-[0.15em] uppercase text-white/80 font-medium">{name}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[7px] tracking-[0.2em] uppercase text-white/35 font-light mb-0.5">Valid Thru</p>
              <p className="text-[11px] tracking-[0.1em] text-white/80 font-medium">{validThru}</p>
            </div>
            <div className="ml-1">
              {isVisa ? <VisaLogo /> : <MastercardLogo />}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ═══ WHITE LABEL CARD (no UJ logo) ═══ */
export const WhiteLabelCard = ({
  name = "Mr. Ricky Smith",
  cardNumber = "5200  8300  1100  4477",
  validThru = "03/30",
  partnerName = "Your Brand",
  delay = 0,
}: {
  name?: string;
  cardNumber?: string;
  validThru?: string;
  partnerName?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30, rotateY: -8 }}
    whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ scale: 1.03, rotateY: 3, boxShadow: "0 25px 60px -15px hsla(0, 0%, 100%, 0.08)" }}
    className="relative w-full max-w-[380px] aspect-[1.586/1] rounded-2xl overflow-hidden cursor-pointer"
    style={{
      background: "linear-gradient(145deg, hsl(0, 0%, 7%) 0%, hsl(0, 0%, 13%) 50%, hsl(0, 0%, 9%) 100%)",
      border: "1px solid hsl(0, 0%, 20%)",
    }}
  >
    {/* Subtle silver sheen */}
    <div className="absolute inset-0 opacity-[0.04]" style={{
      background: "radial-gradient(ellipse 50% 40% at 30% 70%, hsl(0, 0%, 80%) 0%, transparent 60%)",
    }} />
    {/* Fine line texture */}
    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 4px, hsla(0,0%,100%,0.1) 4px, hsla(0,0%,100%,0.1) 5px)",
    }} />

    <div className="relative z-10 flex flex-col justify-between h-full p-5 md:p-6">
      {/* Top: Partner brand placeholder (no UJ logo) */}
      <div className="flex items-start justify-between">
        <div>
          <span className="font-display text-[11px] tracking-[0.35em] uppercase font-semibold text-white/50">
            {partnerName}
          </span>
          <p className="text-[7px] tracking-[0.4em] uppercase text-white/25 mt-1 font-light">
            White Label Aviation
          </p>
        </div>
        <div className="w-[38px] h-[28px] mt-1" style={{ backgroundImage: chipPattern, backgroundSize: "contain", backgroundRepeat: "no-repeat" }} />
      </div>

      {/* Number */}
      <div className="my-auto">
        <p className="text-[15px] md:text-[17px] tracking-[0.22em] text-white/80 font-light font-mono">
          {cardNumber}
        </p>
      </div>

      {/* Bottom */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[7px] tracking-[0.2em] uppercase text-white/30 font-light mb-0.5">Card Holder</p>
          <p className="text-[11px] tracking-[0.15em] uppercase text-white/70 font-medium">{name}</p>
        </div>
        <div className="text-right">
          <p className="text-[7px] tracking-[0.2em] uppercase text-white/30 font-light mb-0.5">Valid Thru</p>
          <p className="text-[11px] tracking-[0.1em] text-white/70 font-medium">{validThru}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

/* ═══ ALL 4 MEMBERSHIP CARDS SHOWCASE ═══ */
export const MembershipCardsShowcase = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 justify-items-center">
    <MembershipCard tier="nomad" cardNumber="4217  8400  1001  0037" validThru="06/27" delay={0} />
    <MembershipCard tier="explorer" cardNumber="4217  8400  2002  0037" validThru="09/28" delay={0.1} />
    <MembershipCard tier="globetrotter" cardNumber="4217  8400  3003  0037" validThru="03/29" delay={0.2} />
    <MembershipCard tier="maverick" cardNumber="4217  8400  5591  0037" validThru="12/28" delay={0.3} />
  </div>
);
