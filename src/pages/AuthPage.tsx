import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const STAFF_ROLES = ["admin", "sales", "operations", "finance", "account_management"];

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  const routeSignedInUser = async (userId: string) => {
    const { data: roleRows } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    const roles = roleRows?.map((row) => row.role) ?? [];
    const isStaff = roles.some((role) => STAFF_ROLES.includes(role));

    navigate(isStaff ? "/crm" : "/dashboard");
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else if (data.user) {
        toast.success("Welcome back.");
        await routeSignedInUser(data.user.id);
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Check your email to verify your account.");
      }
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) toast.error("Google sign-in failed.");
  };

  const handleAppleLogin = async () => {
    const { error } = await lovable.auth.signInWithOAuth("apple", {
      redirect_uri: window.location.origin,
    });
    if (error) toast.error("Apple sign-in failed.");
  };

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
              {isLogin ? "Welcome Back" : "Private Access"}
            </p>
            <h1 className="text-2xl md:text-3xl font-display font-semibold">
              {isLogin ? "Sign In" : "Apply for Membership"}
            </h1>
            {!isLogin && (
              <p className="text-[11px] text-foreground/30 font-extralight mt-3 leading-relaxed max-w-xs mx-auto">
                Join an exclusive network of discerning travelers with access to private aviation worldwide.
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glass rounded-2xl p-8"
          >
            <div className="space-y-3 mb-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full py-3 luxury-border rounded-lg text-[11px] tracking-[0.15em] uppercase font-light text-foreground/60 hover:text-foreground/90 hover:border-gold/30 transition-all duration-500 flex items-center justify-center gap-3"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              <button
                onClick={handleAppleLogin}
                className="w-full py-3 luxury-border rounded-lg text-[11px] tracking-[0.15em] uppercase font-light text-foreground/60 hover:text-foreground/90 hover:border-gold/30 transition-all duration-500 flex items-center justify-center gap-3"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Continue with Apple
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-[0.5px] bg-foreground/10" />
              <span className="text-[9px] tracking-[0.2em] uppercase text-foreground/25 font-light">or</span>
              <div className="flex-1 h-[0.5px] bg-foreground/10" />
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="text-[9px] tracking-[0.25em] uppercase text-gold/50 mb-2 block font-light">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full bg-secondary/50 rounded-lg px-4 py-3 text-[13px] text-foreground placeholder:text-foreground/20 font-light focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all luxury-border"
                  />
                </div>
              )}

              <div>
                <label className="text-[9px] tracking-[0.25em] uppercase text-gold/50 mb-2 block font-light">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full bg-secondary/50 rounded-lg px-4 py-3 text-[13px] text-foreground placeholder:text-foreground/20 font-light focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all luxury-border"
                />
              </div>

              <div>
                <label className="text-[9px] tracking-[0.25em] uppercase text-gold/50 mb-2 block font-light">
                  Password
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,85%,58%,0.45)] transition-all duration-500 mt-2 disabled:opacity-50"
              >
                {loading ? "Please wait..." : isLogin ? "Sign In" : "Apply for Access"}
              </button>
            </form>

            <p className="text-center text-[10px] text-foreground/30 font-extralight mt-6">
              {isLogin ? "Don't have an account?" : "Already a member?"}{" "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-gold/60 hover:text-gold transition-colors"
              >
                {isLogin ? "Apply Now" : "Sign In"}
              </button>
            </p>
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

export default AuthPage;
