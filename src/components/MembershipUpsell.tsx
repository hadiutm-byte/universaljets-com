import { motion } from "framer-motion";
import { Crown, Users, Plane, Gift, ArrowRight, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MembershipUpsellProps {
  /** "inline" for embedded blocks, "card" for standalone panels */
  variant?: "inline" | "card";
  /** Show the referral offer section */
  showReferral?: boolean;
  className?: string;
}

const BENEFITS = [
  { icon: Plane, label: "Priority quote handling" },
  { icon: Crown, label: "Exclusive empty leg access" },
  { icon: Users, label: "Dedicated aviation advisor" },
  { icon: Gift, label: "Member-only travel credits" },
];

/**
 * Platform-wide membership upsell component.
 * Place at high-intent touchpoints: quote success, empty leg detail, etc.
 */
const MembershipUpsell = ({ variant = "card", showReferral = true, className = "" }: MembershipUpsellProps) => {
  const navigate = useNavigate();

  if (variant === "inline") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className={`rounded-xl border border-primary/10 bg-primary/[0.03] p-4 space-y-3 ${className}`}
      >
        <div className="flex items-center gap-2">
          <Crown size={12} className="text-primary" />
          <span className="text-[9px] tracking-[0.3em] uppercase text-primary font-medium">Private Access Network</span>
        </div>
        <p className="text-[12px] text-foreground/80 font-light leading-relaxed">
          Join complimentary membership for priority quotes, exclusive availability, and member-only travel credits.
        </p>
        <button
          onClick={() => navigate("/members")}
          className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] uppercase text-primary font-medium hover:text-primary/80 transition-colors"
        >
          Explore Membership <ArrowRight size={10} />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className={`rounded-2xl border border-border/40 bg-card overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Crown size={14} className="text-primary" />
          </div>
          <div>
            <p className="text-[9px] tracking-[0.3em] uppercase text-primary font-medium">Private Access Network</p>
            <p className="text-[10px] text-muted-foreground/60 font-light">Complimentary Membership</p>
          </div>
        </div>
        <p className="text-[13px] text-foreground/80 font-light leading-relaxed">
          Elevate every journey with priority service, exclusive availability, and a dedicated aviation advisor.
        </p>
      </div>

      {/* Benefits */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-2 gap-2">
          {BENEFITS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/20">
              <Icon size={10} className="text-primary/60 shrink-0" />
              <span className="text-[10px] text-foreground/70 font-light">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Referral offer */}
      {showReferral && (
        <div className="mx-6 mb-4 p-3.5 rounded-xl bg-primary/[0.04] border border-primary/10">
          <p className="text-[10px] tracking-[0.15em] uppercase text-primary/80 font-medium mb-1.5">Member Referral Programme</p>
          <p className="text-[11px] text-foreground/70 font-light leading-relaxed">
            Refer three members who complete their first booking and receive <span className="text-primary font-medium">$1,000 travel credit</span> toward your next flight.
          </p>
          <div className="mt-2.5 flex items-start gap-1.5">
            <Shield size={9} className="text-muted-foreground/40 mt-0.5 shrink-0" />
            <p className="text-[8px] text-muted-foreground/40 font-light leading-relaxed">
              Credit issued upon verification of three qualifying bookings. Applies to future flights only. Subject to membership terms and approval.
            </p>
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="px-6 pb-6 space-y-2">
        <button
          onClick={() => navigate("/members")}
          className="w-full flex items-center justify-center gap-2 btn-luxury py-3 text-[9px] tracking-[0.25em] uppercase font-medium rounded-xl"
        >
          Join Membership — Free <ArrowRight size={10} />
        </button>
        {showReferral && (
          <button
            onClick={() => navigate("/members#referral")}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-border/30 text-muted-foreground hover:text-foreground text-[9px] tracking-[0.15em] uppercase font-light rounded-xl transition-colors"
          >
            <Gift size={10} /> Refer & Earn Travel Credit
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default MembershipUpsell;
