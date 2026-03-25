import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UserCheck, Star, MapPin, Users, RefreshCw, AlertCircle, TrendingUp, Heart, Clock } from "lucide-react";
import { useCrmApi } from "@/hooks/useCrmApi";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const AccountMgmtPage = () => {
  const { getClients } = useCrmApi();
  const [clients, setClients] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "key" | "repeat" | "membership" | "inactive" | "upsell">("all");

  useEffect(() => {
    const load = async () => {
      const [clientRes, tripRes] = await Promise.all([
        getClients(),
        supabase.from("trips").select("client_id, status").eq("status", "completed"),
      ]);
      const all = clientRes?.data?.clients ?? [];
      setClients(all);
      setTrips(tripRes.data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const tripCountByClient = (id: string) => trips.filter(t => t.client_id === id).length;

  const filtered = clients.filter(c => {
    if (filter === "all") return ["active", "member", "vip", "corporate", "family_office"].includes(c.client_type);
    if (filter === "key") return ["vip", "corporate", "family_office"].includes(c.client_type);
    if (filter === "repeat") return tripCountByClient(c.id) >= 2;
    if (filter === "membership") return !!c.membership_tier;
    if (filter === "inactive") return c.client_type === "active" && tripCountByClient(c.id) === 0;
    if (filter === "upsell") return tripCountByClient(c.id) >= 1 && !c.membership_tier;
    return true;
  });

  const stats = {
    total: clients.filter(c => ["active", "member", "vip", "corporate", "family_office"].includes(c.client_type)).length,
    key: clients.filter(c => ["vip", "corporate", "family_office"].includes(c.client_type)).length,
    repeat: clients.filter(c => tripCountByClient(c.id) >= 2).length,
    members: clients.filter(c => !!c.membership_tier).length,
  };

  const filterTabs = [
    { key: "all" as const, label: "Portfolio", count: stats.total, icon: Users },
    { key: "key" as const, label: "Key Accounts", count: stats.key, icon: Star },
    { key: "repeat" as const, label: "Repeat", count: stats.repeat, icon: RefreshCw },
    { key: "membership" as const, label: "Members", count: stats.members, icon: Heart },
    { key: "inactive" as const, label: "Reactivation", count: null, icon: Clock },
    { key: "upsell" as const, label: "Upsell", count: null, icon: TrendingUp },
  ];

  const typeColor = (t: string) => {
    const map: Record<string, string> = {
      member: "bg-primary/20 text-primary",
      vip: "bg-amber-500/20 text-amber-400",
      corporate: "bg-blue-500/20 text-blue-400",
      active: "bg-emerald-500/20 text-emerald-400",
      family_office: "bg-purple-500/20 text-purple-400",
    };
    return map[t] || "bg-secondary text-muted-foreground";
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-display font-semibold">Account Management</h1>
        <p className="text-[11px] text-muted-foreground/50 font-light mt-1">
          Retain · Grow · Service — Long-term client relationships
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Portfolio", value: stats.total, color: "text-foreground" },
          { label: "Key Accounts", value: stats.key, color: "text-amber-400" },
          { label: "Repeat Clients", value: stats.repeat, color: "text-emerald-400" },
          { label: "Members", value: stats.members, color: "text-primary" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border/20 bg-card/50 p-4">
            <p className={`text-2xl font-display font-semibold ${s.color}`}>{s.value}</p>
            <p className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground/40 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {filterTabs.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] tracking-[0.1em] uppercase font-medium transition-all border ${
              filter === t.key
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border/20 text-muted-foreground/40 hover:text-foreground hover:border-border/40"
            }`}>
            <t.icon size={12} strokeWidth={1.5} />
            {t.label}
            {t.count !== null && <span className="text-[9px] opacity-60">({t.count})</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <UserCheck className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" strokeWidth={1} />
          <p className="text-[13px] text-muted-foreground/40 font-light">No clients in this view</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((c, i) => {
            const tc = tripCountByClient(c.id);
            return (
              <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Link to={`/crm/account-mgmt/${c.id}`}
                  className="block rounded-xl border border-border/20 bg-card/50 p-5 hover:border-border/40 hover:bg-secondary/20 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-[14px] font-medium">{c.full_name}</h3>
                        <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full font-medium ${typeColor(c.client_type)}`}>
                          {c.client_type?.replace(/_/g, " ")}
                        </span>
                        {c.membership_tier && (
                          <span className="text-[9px] tracking-[0.1em] uppercase text-primary/50 flex items-center gap-1">
                            <Star size={10} /> {c.membership_tier.replace(/_/g, " ")}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-muted-foreground/40 font-light">
                        <span>{c.email}</span>
                        {c.phone && <span>{c.phone}</span>}
                        {(c.city || c.country) && (
                          <span className="flex items-center gap-1">
                            <MapPin size={10} /> {[c.city, c.country].filter(Boolean).join(", ")}
                          </span>
                        )}
                        {tc > 0 && (
                          <span className="flex items-center gap-1 text-emerald-400/60">
                            <RefreshCw size={10} /> {tc} trip{tc > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground/30">
                        <div className="bg-border/20 rounded-full h-1.5 w-20">
                          <div className="bg-primary/60 h-1.5 rounded-full" style={{ width: `${c.profile_completeness || 0}%` }} />
                        </div>
                        <span>{c.profile_completeness || 0}%</span>
                      </div>
                      {c.credit_balance > 0 && (
                        <p className="text-[11px] text-primary/60 font-light">${c.credit_balance} credit</p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AccountMgmtPage;
