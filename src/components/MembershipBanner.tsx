import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MembershipBanner = () => (
  <motion.div
    id="membership-banner"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.1 }}
    className="fixed top-0 left-0 right-0 z-[60] bg-[hsl(45,79%,46%)] h-9 flex items-center justify-center px-4"
  >
    {/* Mobile: entire banner is a link */}
    <Link to="/auth" className="flex items-center gap-3 sm:hidden">
      <span className="text-[8px] tracking-[0.2em] uppercase font-medium text-white/90">
        Private Access — Apply Now
      </span>
    </Link>

    {/* Desktop: text + button */}
    <div className="hidden sm:flex items-center gap-6">
      <span className="text-[10px] tracking-[0.35em] uppercase font-medium text-white/90">
        Private Access Membership — Limited Invitations Available
      </span>
      <Link
        to="/auth"
        className="text-[9px] tracking-[0.2em] uppercase font-semibold text-white bg-white/15 hover:bg-white/25 px-4 py-1 rounded-full transition-all duration-300 border border-white/20 whitespace-nowrap"
      >
        Apply Now
      </Link>
    </div>
  </motion.div>
);

export default MembershipBanner;
