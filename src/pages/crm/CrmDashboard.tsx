import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Target, Plane, FileText, Receipt, Map } from "lucide-react";
import { Link } from "react-router-dom";

interface StatCard {
  label: string;
  count: number;
  icon: any;
  href: string;
  color: string;
}

const CrmDashboard = () => {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const tables = [
        { name: "clients", label: "Clients", icon: Users, href: "/crm/clients", color: "text-blue-400" },
        { name: "leads", label: "Leads", icon: Target, href: "/crm/leads", color: "text-cyan-400" },
        { name: "flight_requests", label: "Requests", icon: Plane, href: "/crm/requests", color: "text-amber-400" },
        { name: "quotes", label: "Quotes", icon: FileText, href: "/crm/quotes", color: "text-purple-400" },
        { name: "invoices", label: "Invoices", icon: Receipt, href: "/crm/invoices", color: "text-emerald-400" },
        { name: "trips", label: "Trips", icon: Map, href: "/crm/trips", color: "text-primary" },
      ] as const;

      const results = await Promise.all(
        tables.map(async (t) => {
          const { count } = await supabase.from(t.name).select("*", { count: "exact", head: true });
          return { label: t.label, count: count ?? 0, icon: t.icon, href: t.href, color: t.color };
        })
      );
      setStats(results);
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-xl md:text-2xl">Dashboard</h1>
        <p className="text-[11px] text-muted-foreground/60 mt-1">Universal Jets Operations Overview</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border border-primary/30 border-t-primary/80 rounded-full animate-spin" />
        </div>
      ) : (
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
        </div>
      )}
    </div>
  );
};

export default CrmDashboard;
