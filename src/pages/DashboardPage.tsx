import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User, Shield, Send, Bookmark, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ReferralSection from "@/components/ReferralSection";

const DashboardPage = () => {
  const { user, roles, signOut } = useAuth();

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-40 pb-10 md:pt-48 md:pb-16">
        <div className="container mx-auto px-8 max-w-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <p className="text-[9px] tracking-[0.5em] uppercase text-gold/70 mb-6 font-light">
              Member Portal
            </p>
            <h1 className="text-2xl md:text-4xl font-display font-semibold mb-4">
              Welcome back, {user?.user_metadata?.full_name?.split(" ")[0] || "Member"}
            </h1>
            <p className="text-[13px] text-foreground/40 font-extralight">
              {user?.email}
            </p>
          </motion.div>

          {/* Membership Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="rounded-2xl p-8 mb-6 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsl(220, 15%, 12%) 0%, hsl(220, 10%, 18%) 50%, hsl(45, 30%, 22%) 100%)",
            }}
          >
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <p className="text-[9px] tracking-[0.5em] uppercase text-white/40 font-light">
                  Founder's Circle
                </p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                  <span className="text-[9px] tracking-[0.15em] uppercase text-white/40 font-light">Active</span>
                </div>
              </div>

              <p className="text-lg md:text-xl font-display text-white/90 font-semibold mb-1">
                {user?.user_metadata?.full_name || "Member"}
              </p>
              <p className="text-[11px] text-white/30 font-extralight tracking-wide mb-8">
                Member since {memberSince}
              </p>

              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-gold/60" strokeWidth={1.2} />
                <p className="text-[10px] tracking-[0.15em] uppercase text-white/40 font-light">
                  {roles.length > 0 ? roles.map(r => r.replace("_", " ")).join(", ") : "Private Member"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          >
            {[
              { icon: Bookmark, label: "Saved Routes", desc: "Your preferred itineraries", href: "#" },
              { icon: Send, label: "Quick Booking", desc: "Request a flight in seconds", href: "/#search" },
              { icon: Sparkles, label: "Exclusive Access", desc: "Member-only opportunities", href: "#" },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.href}
                className="glass rounded-xl p-6 group hover:border-gold/20 transition-all duration-500"
              >
                <item.icon className="w-5 h-5 text-gold/50 mb-4 group-hover:text-gold/80 transition-colors" strokeWidth={1.2} />
                <p className="font-display text-sm mb-1">{item.label}</p>
                <p className="text-[11px] text-foreground/30 font-extralight">{item.desc}</p>
              </Link>
            ))}
          </motion.div>

          {/* Sign out */}
          <div className="flex justify-between items-center mb-4">
            <Link
              to="/"
              className="text-[9px] tracking-[0.2em] uppercase text-foreground/25 hover:text-foreground/50 transition-colors font-light"
            >
              ← Home
            </Link>
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase text-foreground/25 hover:text-destructive/70 transition-colors font-light"
            >
              <LogOut size={12} /> Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* Referral Section */}
      <ReferralSection />
    </div>
  );
};

export default DashboardPage;
