import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UserCheck, Star, MapPin, Plane } from "lucide-react";
import { useCrmApi } from "@/hooks/useCrmApi";

const AccountMgmtPage = () => {
  const { call } = useCrmApi();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await call("clients", "GET", {}, { limit: "100" });
      // Filter for active/member/VIP clients
      const portfolio = (res?.clients ?? []).filter((c: any) =>
        ["active", "member", "vip", "corporate", "family_office"].includes(c.client_type)
      );
      setClients(portfolio);
      setLoading(false);
    };
    load();
  }, []);

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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-display font-semibold">Client Portfolio</h1>
        <p className="text-[11px] text-muted-foreground/50 font-light mt-1">Manage existing relationships, repeat clients, and key accounts</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-20">
          <UserCheck className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" strokeWidth={1} />
          <p className="text-[13px] text-muted-foreground/40 font-light">No active clients in portfolio yet</p>
          <p className="text-[11px] text-muted-foreground/30 font-light mt-1">Clients become active once they complete a booking</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {clients.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="rounded-xl border border-border/20 bg-card/50 p-5 hover:border-border/40 transition-all">
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
                    {c.company && <span>{c.company}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground/30">
                    <div className="w-full bg-border/20 rounded-full h-1.5 w-20">
                      <div className="bg-primary/60 h-1.5 rounded-full" style={{ width: `${c.profile_completeness || 0}%` }} />
                    </div>
                    <span>{c.profile_completeness || 0}%</span>
                  </div>
                  {c.credit_balance > 0 && (
                    <p className="text-[11px] text-primary/60 font-light mt-1">${c.credit_balance} credit</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountMgmtPage;
