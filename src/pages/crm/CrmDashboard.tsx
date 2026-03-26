import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Users, Target, Plane, FileText, Receipt, Map, Kanban, TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import ClientIdentifier from "@/components/crm/ClientIdentifier";

interface StatCard {
  label: string;
  count: number;
  icon: any;
  href: string;
  color: string;
}

const CrmDashboard = () => {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { roles, user } = useAuth();

  const isAdmin = roles.includes("admin");
  const isSales = roles.includes("sales") || isAdmin;
  const isOps = roles.includes("operations") || isAdmin;
  const isFinance = roles.includes("finance") || isAdmin;

  useEffect(() => {
    const fetchStats = async () => {
      const tables = [
        { name: "clients", label: "Clients", icon: Users, href: "/crm/clients", color: "text-blue-400", show: true },
        { name: "leads", label: "Leads", icon: Target, href: "/crm/leads", color: "text-cyan-400", show: isSales },
        { name: "flight_requests", label: "Requests", icon: Plane, href: "/crm/requests", color: "text-amber-400", show: isSales || isOps },
        { name: "quotes", label: "Quotes", icon: FileText, href: "/crm/quotes", color: "text-purple-400", show: isSales || isFinance },
        { name: "invoices", label: "Invoices", icon: Receipt, href: "/crm/invoices", color: "text-emerald-400", show: isFinance },
        { name: "trips", label: "Trips", icon: Map, href: "/crm/trips", color: "text-primary", show: isOps },
      ] as const;

      const visible = tables.filter(t => t.show);
      const results = await Promise.all(
        visible.map(async (t) => {
          const { count } = await supabase.from(t.name).select("*", { count: "exact", head: true });
          return { label: t.label, count: count ?? 0, icon: t.icon, href: t.href, color: t.color };
        })
      );
      setStats(results);

      // Recent activity
      if (isSales) {
        const { data: leads } = await supabase.from("leads").select("*, clients(full_name)").order("created_at", { ascending: false }).limit(5);
        setRecentLeads(leads ?? []);
      }
      const { data: requests } = await supabase.from("flight_requests").select("*, clients(full_name)").order("created_at", { ascending: false }).limit(5);
      setRecentRequests(requests ?? []);

      setLoading(false);
    };
    fetchStats();
  }, [isSales, isOps, isFinance]);

  const greeting = user?.user_metadata?.full_name?.split(" ")[0] || "Team";

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-xl md:text-2xl">Welcome, {greeting}</h1>
        <p className="text-[11px] text-muted-foreground/60 mt-1">
          {roles.map(r => r.replace("_", " ")).join(", ")} · Universal Jets Operations
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border border-primary/30 border-t-primary/80 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.map((s) => (
              <Link
                key={s.label}
                to={s.href}
                className="rounded-xl border border-border/20 bg-card/50 p-5 hover:bg-secondary/30 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <s.icon className={`w-5 h-5 ${s.color} opacity-60 group-hover:opacity-100 transition-opacity`} strokeWidth={1.5} />
                </div>
                <p className="text-2xl font-display font-semibold">{s.count}</p>
                <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50 font-light mt-1">{s.label}</p>
              </Link>
            ))}
            {isSales && (
              <Link to="/crm/pipeline" className="rounded-xl border border-border/20 bg-card/50 p-5 hover:bg-secondary/30 transition-all duration-300 group">
                <Kanban className="w-5 h-5 text-gold/60 group-hover:text-gold mb-4 transition-colors" strokeWidth={1.5} />
                <p className="text-sm font-display font-medium">Pipeline</p>
                <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50 font-light mt-1">Kanban View</p>
              </Link>
            )}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isSales && recentLeads.length > 0 && (
              <div className="rounded-xl border border-border/20 bg-card/50 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-cyan-400/60" />
                  <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light">Recent Leads</p>
                </div>
                <div className="space-y-2">
                  {recentLeads.map((l: any) => (
                    <div key={l.id} className="flex items-center justify-between py-1.5 border-b border-border/10 last:border-0">
                      <p className="text-[12px] font-light">{l.clients?.full_name ?? "Unknown"}</p>
                      <span className="text-[9px] tracking-[0.1em] uppercase bg-secondary/50 text-foreground/40 px-2 py-0.5 rounded">{l.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recentRequests.length > 0 && (
              <div className="rounded-xl border border-border/20 bg-card/50 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-amber-400/60" />
                  <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light">Recent Requests</p>
                </div>
                <div className="space-y-2">
                  {recentRequests.map((r: any) => (
                    <div key={r.id} className="flex items-center justify-between py-1.5 border-b border-border/10 last:border-0">
                      <div>
                        <p className="text-[12px] font-light">{r.departure} → {r.destination}</p>
                        <p className="text-[9px] text-foreground/30">{r.clients?.full_name ?? "—"}</p>
                      </div>
                      <span className="text-[9px] tracking-[0.1em] uppercase bg-secondary/50 text-foreground/40 px-2 py-0.5 rounded">{r.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CrmDashboard;
