import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const DashboardPage = () => {
  const { user, roles, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-40 pb-20 md:pt-48 md:pb-28">
        <div className="container mx-auto px-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <p className="text-[9px] tracking-[0.5em] uppercase text-gold/70 mb-6 font-light">
              Dashboard
            </p>
            <h1 className="text-2xl md:text-4xl font-display font-semibold mb-4">
              Welcome back
            </h1>
            <p className="text-[13px] text-foreground/40 font-extralight">
              {user?.email}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glass rounded-2xl p-8 mb-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full luxury-border flex items-center justify-center">
                <User className="w-5 h-5 text-gold/60" strokeWidth={1.2} />
              </div>
              <div>
                <p className="font-display text-sm">{user?.user_metadata?.full_name || "Member"}</p>
                <p className="text-[11px] text-foreground/40 font-extralight">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-3.5 h-3.5 text-gold/50" strokeWidth={1.2} />
              <p className="text-[10px] tracking-[0.15em] uppercase text-foreground/40 font-light">
                {roles.length > 0 ? roles.map(r => r.replace("_", " ")).join(", ") : "No roles assigned"}
              </p>
            </div>

            <div className="divider-gold mb-6" />

            <p className="text-[12px] text-foreground/35 font-extralight leading-[2]">
              Your dashboard is being built. CRM, trip management, and client portal features are coming in Phase 1.
            </p>
          </motion.div>

          <div className="flex justify-between items-center">
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
    </div>
  );
};

export default DashboardPage;
