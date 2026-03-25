import { motion } from "framer-motion";

interface MembershipBannerProps {
  onRequestInvitation: () => void;
}

const MembershipBanner = ({ onRequestInvitation }: MembershipBannerProps) => (
  <motion.div
    id="membership-banner"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.1 }}
    className="fixed top-0 left-0 right-0 z-[60] bg-[hsl(220,10%,10%)] h-9 flex items-center justify-center px-4 border-b border-[hsl(45,79%,46%,0.15)]"
  >
    {/* Mobile: tappable */}
    <button onClick={onRequestInvitation} className="flex items-center gap-3 sm:hidden cursor-pointer">
      <span className="text-[8px] tracking-[0.2em] uppercase font-medium text-white/70">
        Invitation Only — Request Access
      </span>
    </button>

    {/* Desktop */}
    <div className="hidden sm:flex items-center gap-6">
      <span className="text-[10px] tracking-[0.35em] uppercase font-light text-white/50">
        Private Access Membership — Invitation Only
      </span>
      <button
        onClick={onRequestInvitation}
        className="text-[9px] tracking-[0.2em] uppercase font-medium text-[hsl(45,79%,46%)] hover:text-[hsl(45,79%,56%)] transition-colors duration-300 cursor-pointer"
      >
        Request Invitation →
      </button>
    </div>
  </motion.div>
);

export default MembershipBanner;
