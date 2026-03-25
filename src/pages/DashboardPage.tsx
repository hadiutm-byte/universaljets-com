import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  LogOut, User, Plane, Search, Tag, MessageCircle, MapPin, CreditCard,
  Shield, ChevronRight, Sparkles, Gift, Clock, Activity
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const STAFF_ROLES = ["admin", "sales", "operations", "finance", "account_management"];

const DashboardPage = () => {
  const { user, roles, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [savedRoutes, setSavedRoutes] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const uid = user?.id;
  const isStaff = roles.some((role) => STAFF_ROLES.includes(role));

  const fetchData = useCallback(async () => {
    if (!uid) return;
    setLoading(true);

    const [pRes, rRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
      supabase.from("saved_routes").select("*").eq("user_id", uid).order("created_at", { ascending: false }).limit(5),
    ]);

    setProfile(pRes.data);
    setSavedRoutes(rRes.data ?? []);

    // Client-linked data
    const { data: clientData } = await supabase.from("clients").select("id").eq("user_id", uid).maybeSingle();
    if (clientData) {
      const [trRes, frRes] = await Promise.all([
        supabase.from("trips").select("*").eq("client_id", clientData.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("flight_requests").select("*").eq("client_id", clientData.id).order("created_at", { ascending: false }).limit(5),
      ]);
      setTrips(trRes.data ?? []);
      setRequests(frRes.data ?? []);
    }

    setLoading(false);
  }, [uid]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (isStaff) return <Navigate to="/crm" replace />;

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "Member";
  const credit = profile?.available_credit ?? 0;
  const referrals = profile?.referrals_sent ?? 0;
  const activeRequests = requests.filter(r => r.status === "pending").length;
  const completedTrips = trips.filter(t => t.status === "completed").length;

  const quickActions = [
    { icon: Plane, label: "Request a Flight", desc: "Get a quote in minutes", href: "/#cta", color: "text-primary" },
    { icon: Search, label: "Search Aircraft", desc: "Browse our fleet", href: "/aircraft", color: "text-blue-400" },
    { icon: Tag, label: "Empty Leg Deals", desc: "Up to 75% savings", href: "/#empty-legs", color: "text-emerald-400" },
    { icon: MessageCircle, label: "Speak to Advisor", desc: "Available 24/7", onClick: () => document.dispatchEvent(new CustomEvent("open-ricky")), color: "text-amber-400" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-36 pb-16 md:pt-44">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-10">
            <p className="text-[9px] tracking-[0.5em] uppercase text-primary/70 mb-4 font-light">Private Aviation Hub</p>
            <h1 className="text-2xl md:text-4xl font-display font-semibold mb-2">
              Welcome back, {firstName}
            </h1>
            <p className="text-[13px] text-muted-foreground font-light">{user?.email}</p>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border border-primary/30 border-t-primary/80 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Membership Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, hsl(220, 15%, 12%) 0%, hsl(220, 10%, 18%) 50%, hsl(45, 30%, 22%) 100%)" }}
              >
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[9px] tracking-[0.5em] uppercase text-white/40 font-light">
                      {(profile?.membership_tier ?? "founder_circle").replace("_", " ")}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                      <span className="text-[9px] tracking-[0.15em] uppercase text-white/40 font-light">
                        {profile?.invitation_status ?? "Active"}
                      </span>
                    </div>
                  </div>

                  <p className="text-lg md:text-xl font-display text-white/90 font-semibold mb-0.5">
                    {profile?.full_name || user?.user_metadata?.full_name || "Member"}
                  </p>
                  <p className="text-[10px] text-white/30 font-light tracking-wide mb-6">
                    Member since {memberSince} · ID: {profile?.member_id ?? uid?.slice(0, 8).toUpperCase()}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Credit Balance", value: `$${credit.toLocaleString()}`, icon: CreditCard },
                      { label: "Referral Progress", value: `${Math.min(referrals, 3)}/3`, icon: Gift },
                      { label: "Active Requests", value: activeRequests, icon: Activity },
                      { label: "Completed Trips", value: completedTrips, icon: Plane },
                    ].map((s) => (
                      <div key={s.label}>
                        <p className="text-lg md:text-xl font-display text-white/90 font-semibold">{s.value}</p>
                        <p className="text-[8px] tracking-[0.15em] uppercase text-white/30 font-light">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                <p className="text-[9px] tracking-[0.4em] uppercase text-muted-foreground/50 font-light mb-4">Quick Actions</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {quickActions.map((a, i) => {
                    const content = (
                      <div className="rounded-xl border border-border/30 bg-card/50 p-5 group hover:border-primary/20 transition-all duration-500 cursor-pointer h-full">
                        <a.icon className={`w-5 h-5 ${a.color} opacity-60 group-hover:opacity-100 mb-3 transition-opacity`} strokeWidth={1.2} />
                        <p className="text-[12px] font-display font-medium mb-1">{a.label}</p>
                        <p className="text-[10px] text-muted-foreground/50 font-light">{a.desc}</p>
                      </div>
                    );
                    if (a.onClick) return <div key={i} onClick={a.onClick}>{content}</div>;
                    return <Link key={i} to={a.href!}>{content}</Link>;
                  })}
                </div>
              </motion.div>

              {/* Two columns: Recent Activity + Saved Routes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recent Requests */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
                  className="rounded-xl border border-border/20 bg-card/50 p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary/50" strokeWidth={1.2} />
                      <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light">Recent Requests</p>
                    </div>
                    <Link to="/profile" className="text-[9px] text-primary/50 hover:text-primary transition-colors">View All</Link>
                  </div>
                  {requests.length > 0 ? (
                    <div className="space-y-2">
                      {requests.slice(0, 4).map((r) => (
                        <div key={r.id} className="flex items-center justify-between py-2 border-b border-border/10 last:border-0">
                          <div>
                            <p className="text-[12px] font-light">{r.departure} → {r.destination}</p>
                            <p className="text-[9px] text-muted-foreground/40">{r.date ? new Date(r.date).toLocaleDateString() : "Flexible"}</p>
                          </div>
                          <span className="text-[9px] tracking-[0.1em] uppercase bg-secondary/50 text-muted-foreground/60 px-2 py-0.5 rounded">{r.status}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-muted-foreground/30 font-light py-6 text-center">No requests yet</p>
                  )}
                </motion.div>

                {/* Saved Routes */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }}
                  className="rounded-xl border border-border/20 bg-card/50 p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary/50" strokeWidth={1.2} />
                      <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light">Saved Routes</p>
                    </div>
                    <Link to="/profile" className="text-[9px] text-primary/50 hover:text-primary transition-colors">Manage</Link>
                  </div>
                  {savedRoutes.length > 0 ? (
                    <div className="space-y-2">
                      {savedRoutes.slice(0, 4).map((r) => (
                        <div key={r.id} className="flex items-center gap-3 py-2 border-b border-border/10 last:border-0">
                          <Plane className="w-3 h-3 text-primary/40 flex-shrink-0" strokeWidth={1.2} />
                          <div>
                            <p className="text-[12px] font-light">{r.departure} → {r.destination}</p>
                            {r.name && <p className="text-[9px] text-muted-foreground/40">{r.name}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-muted-foreground/30 font-light py-6 text-center">No saved routes</p>
                  )}
                </motion.div>
              </div>

              {/* Membership Perks Banner */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
                className="rounded-xl border border-primary/10 bg-primary/[0.03] p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-primary/60" strokeWidth={1.2} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[12px] font-display font-medium mb-1">Referral Reward Program</p>
                    <p className="text-[11px] text-muted-foreground/50 font-light mb-3">
                      Invite 3 qualified members and unlock a $1,000 flight credit. You've referred {referrals} so far.
                    </p>
                    <div className="flex gap-1 mb-2">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < referrals ? "bg-primary/60" : "bg-secondary"}`} />
                      ))}
                    </div>
                    <p className="text-[9px] text-muted-foreground/40 font-light">
                      {referrals >= 3 ? "🎉 $1,000 credit unlocked!" : `${3 - referrals} more referral${3 - referrals === 1 ? "" : "s"} to unlock reward`}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Bottom Actions */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="flex flex-wrap items-center justify-between gap-4 pt-4"
              >
                <div className="flex items-center gap-4">
                  <Link to="/profile" className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-muted-foreground/40 hover:text-foreground transition-colors font-light">
                    <User size={14} strokeWidth={1.2} /> My Profile <ChevronRight size={10} />
                  </Link>
                  <Link to="/" className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/40 hover:text-foreground transition-colors font-light">
                    ← Home
                  </Link>
                </div>
                <button onClick={signOut} className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-muted-foreground/40 hover:text-destructive/70 transition-colors font-light">
                  <LogOut size={14} strokeWidth={1.2} /> Sign Out
                </button>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DashboardPage;
