import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * Password reset page — handles the recovery link from email.
 * Users land here after clicking the password reset link.
 * The page detects the recovery session and allows setting a new password.
 */
const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if this is a recovery flow from the URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    // Listen for PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsRecovery(true);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully.");
      navigate("/dashboard");
    }
    setLoading(false);
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-40 pb-20 md:pt-48 md:pb-28">
          <div className="container mx-auto px-8 max-w-sm text-center">
            <h1 className="text-2xl font-display font-semibold mb-4">Invalid Reset Link</h1>
            <p className="text-foreground/50 text-sm mb-6">
              This link is invalid or has expired. Please request a new password reset.
            </p>
            <Link
              to="/auth"
              className="text-gold/70 hover:text-gold text-sm transition-colors"
            >
              ← Back to Sign In
            </Link>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-40 pb-20 md:pt-48 md:pb-28">
        <div className="container mx-auto px-8 max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <p className="text-[9px] tracking-[0.5em] uppercase text-gold/70 mb-6 font-light">
              Account Security
            </p>
            <h1 className="text-2xl md:text-3xl font-display font-semibold">
              Set New Password
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glass rounded-2xl p-8"
          >
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="text-[9px] tracking-[0.25em] uppercase text-gold/50 mb-2 block font-light">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-secondary/50 rounded-lg px-4 py-3 text-[13px] text-foreground placeholder:text-foreground/20 font-light focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all luxury-border"
                />
              </div>

              <div>
                <label className="text-[9px] tracking-[0.25em] uppercase text-gold/50 mb-2 block font-light">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-secondary/50 rounded-lg px-4 py-3 text-[13px] text-foreground placeholder:text-foreground/20 font-light focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all luxury-border"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,85%,58%,0.45)] transition-all duration-500 mt-2 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <Link
              to="/"
              className="text-[9px] tracking-[0.2em] uppercase text-foreground/25 hover:text-foreground/50 transition-colors font-light"
            >
              ← Back to Home
            </Link>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
