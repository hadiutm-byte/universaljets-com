import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { trackAuth } from "@/lib/gtmEvents";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Welcome back.");
        trackAuth("login");
        onClose();
        navigate("/dashboard");
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        toast.error(error.message);
      } else {
      toast.success("Please check your email to verify your account.");
        trackAuth("signup");
        onClose();
      }
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) toast.error("Google sign-in failed.");
  };

  const handleApple = async () => {
    const { error } = await lovable.auth.signInWithOAuth("apple", {
      redirect_uri: window.location.origin,
    });
    if (error) toast.error("Apple sign-in failed.");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[400px] mx-4 rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(180deg, hsl(220, 10%, 12%) 0%, hsl(220, 8%, 8%) 100%)",
            }}
          >
            {/* Top gold line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(43,85%,58%,0.4)] to-transparent" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-white/30 hover:text-white/60 transition-colors cursor-pointer"
            >
              <X size={16} strokeWidth={1.5} />
            </button>

            <div className="p-8 pt-10">
              {/* Header */}
              <div className="text-center mb-8">
                <p className="text-[9px] tracking-[0.5em] uppercase text-[hsl(43,85%,58%,0.6)] mb-4 font-light">
                  Private Access Network
                </p>
                <h3 className="text-xl font-display font-semibold text-white/90 mb-2">
                  {mode === "signup" ? "Request Invitation" : "Welcome Back"}
                </h3>
                <p className="text-[11px] text-white/30 font-extralight">
                  {mode === "signup"
                    ? "Join an exclusive network of discerning travelers."
                    : "Sign in to your private account."}
                </p>
              </div>

              {/* OAuth */}
              <div className="space-y-2.5 mb-6">
                <button
                  onClick={handleGoogle}
                  className="w-full py-3 rounded-xl border border-white/8 bg-white/[0.03] text-[11px] tracking-[0.15em] uppercase font-light text-white/50 hover:text-white/80 hover:border-white/15 transition-all duration-400 flex items-center justify-center gap-3 cursor-pointer"
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
                  onClick={handleApple}
                  className="w-full py-3 rounded-xl border border-white/8 bg-white/[0.03] text-[11px] tracking-[0.15em] uppercase font-light text-white/50 hover:text-white/80 hover:border-white/15 transition-all duration-400 flex items-center justify-center gap-3 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  Continue with Apple
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-[0.5px] bg-white/8" />
                <span className="text-[8px] tracking-[0.3em] uppercase text-white/15 font-light">or</span>
                <div className="flex-1 h-[0.5px] bg-white/8" />
              </div>

              {/* Email form */}
              <form onSubmit={handleEmailAuth} className="space-y-3.5">
                {mode === "signup" && (
                  <div>
                    <label className="text-[8px] tracking-[0.3em] uppercase text-[hsl(43,85%,58%,0.5)] mb-1.5 block font-light">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name"
                      required
                      className="w-full bg-white/[0.04] border border-white/8 rounded-lg px-4 py-3 text-[13px] text-white/90 placeholder:text-white/15 font-light focus:outline-none focus:border-[hsl(43,85%,58%,0.3)] transition-colors"
                    />
                  </div>
                )}
                <div>
                  <label className="text-[8px] tracking-[0.3em] uppercase text-[hsl(43,85%,58%,0.5)] mb-1.5 block font-light">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full bg-white/[0.04] border border-white/8 rounded-lg px-4 py-3 text-[13px] text-white/90 placeholder:text-white/15 font-light focus:outline-none focus:border-[hsl(43,85%,58%,0.3)] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[8px] tracking-[0.3em] uppercase text-[hsl(43,85%,58%,0.5)] mb-1.5 block font-light">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full bg-white/[0.04] border border-white/8 rounded-lg px-4 py-3 text-[13px] text-white/90 placeholder:text-white/15 font-light focus:outline-none focus:border-[hsl(43,85%,58%,0.3)] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-gold text-white text-[10px] tracking-[0.25em] uppercase font-semibold rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,85%,58%,0.45)] transition-all duration-500 mt-1 disabled:opacity-50 cursor-pointer"
                >
                  {loading
                    ? "Please wait..."
                    : mode === "signup"
                    ? "Request Invitation"
                    : "Sign In"}
                </button>
              </form>

              {/* Toggle */}
              <p className="text-center text-[10px] text-white/25 font-extralight mt-5">
                {mode === "signup" ? "Already a member?" : "Don't have access?"}{" "}
                <button
                  onClick={() => setMode(mode === "signup" ? "login" : "signup")}
                  className="text-[hsl(43,85%,58%,0.6)] hover:text-[hsl(43,85%,58%,0.9)] transition-colors cursor-pointer"
                >
                  {mode === "signup" ? "Sign In" : "Request Invitation"}
                </button>
              </p>
            </div>

            {/* Bottom gold line */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[hsl(43,85%,58%,0.15)] to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
