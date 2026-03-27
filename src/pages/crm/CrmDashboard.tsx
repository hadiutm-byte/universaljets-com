import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Users, Target, Plane, FileText, Receipt, Map, Kanban, TrendingUp, Clock, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import ClientIdentifier from "@/components/crm/ClientIdentifier";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface StatCard {
  label: string;
  count: number;
  icon: any;
  href: string;
  color: string;
}

const CHART_COLORS = ["hsl(43,74%,49%)", "hsl(217,91%,60%)", "hsl(160,60%,45%)", "hsl(280,65%,60%)", "hsl(340,75%,55%)", "hsl(45,93%,47%)"];

const CrmDashboard = () => {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
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

      if (isSales) {
        const { data: leads } = await supabase.from("leads").select("*, clients(full_name)").order("created_at", { ascending: false }).limit(5);
        setRecentLeads(leads ?? []);
      }
      const { data: requests } = await supabase.from("flight_requests").select("*, clients(full_name)").order("created_at", { ascending: false }).limit(5);
      setRecentRequests(requests ?? []);

      // Fetch analytics
      const { data: analyticsData } = await call("dashboard-analytics", { method: "GET" });
      if (analyticsData) setAnalytics(analyticsData);

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

      {isSales && <ClientIdentifier />}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border border-primary/30 border-t-primary/80 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.map((s) => (
              <Link key={s.label} to={s.href} className="rounded-xl border border-border/20 bg-card/50 p-5 hover:bg-secondary/30 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <s.icon className={`w-5 h-5 ${s.color} opacity-60 group-hover:opacity-100 transition-opacity`} strokeWidth={1.5} />
                </div>
                <p className="text-2xl font-display font-semibold">{s.count}</p>
                <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50 font-light mt-1">{s.label}</p>
              </Link>
            ))}
            {isSales && (
              <Link to="/crm/pipeline" className="rounded-xl border border-border/20 bg-card/50 p-5 hover:bg-secondary/30 transition-all duration-300 group">
                <Kanban className="w-5 h-5 text-primary/60 group-hover:text-primary mb-4 transition-colors" strokeWidth={1.5} />
                <p className="text-sm font-display font-medium">Pipeline</p>
                <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/50 font-light mt-1">Kanban View</p>
              </Link>
            )}
          </div>

          {/* Analytics Section */}
          {analytics && (
            <>
              {/* Conversion Funnel & Revenue */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Conversion Funnel */}
                <div className="rounded-xl border border-border/20 bg-card/50 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-4 h-4 text-primary/60" />
                    <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light">Sales Funnel</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Leads", value: analytics.funnel.totalLeads, pct: 100 },
                      { label: "Contacted", value: analytics.funnel.contactedLeads, pct: analytics.funnel.totalLeads ? Math.round((analytics.funnel.contactedLeads / analytics.funnel.totalLeads) * 100) : 0 },
                      { label: "Quoted", value: analytics.funnel.quotedLeads, pct: analytics.funnel.totalLeads ? Math.round((analytics.funnel.quotedLeads / analytics.funnel.totalLeads) * 100) : 0 },
                      { label: "Confirmed", value: analytics.funnel.confirmedLeads, pct: analytics.funnel.totalLeads ? Math.round((analytics.funnel.confirmedLeads / analytics.funnel.totalLeads) * 100) : 0 },
                    ].map((step) => (
                      <div key={step.label} className="flex items-center gap-3">
                        <span className="text-[10px] text-muted-foreground/50 w-16 flex-shrink-0">{step.label}</span>
                        <div className="flex-1 h-5 bg-secondary/30 rounded-full overflow-hidden">
                          <div className="h-full bg-primary/40 rounded-full transition-all" style={{ width: `${step.pct}%` }} />
                        </div>
                        <span className="text-[11px] font-medium w-8 text-right">{step.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-border/10 flex justify-between text-[10px] text-muted-foreground/40">
                    <span>Conversion: <span className="text-primary font-medium">{analytics.conversionRate}%</span></span>
                    <span>Lost: {analytics.funnel.lostLeads}</span>
                  </div>
                </div>

                {/* Revenue Summary */}
                <div className="rounded-xl border border-border/20 bg-card/50 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-emerald-400/60" />
                    <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light">Revenue</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[9px] text-muted-foreground/40 uppercase tracking-wider">Total Quoted</p>
                      <p className="text-lg font-display font-semibold mt-1">${analytics.revenue.totalQuoteValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground/40 uppercase tracking-wider">Won</p>
                      <p className="text-lg font-display font-semibold text-emerald-400 mt-1">${analytics.revenue.acceptedQuoteValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground/40 uppercase tracking-wider">Collected</p>
                      <p className="text-lg font-display font-semibold text-primary mt-1">${analytics.revenue.totalCollected.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground/40 uppercase tracking-wider">Avg Deal</p>
                      <p className="text-lg font-display font-semibold mt-1">${analytics.avgDealSize.toLocaleString()}</p>
                    </div>
                  </div>
                  {analytics.revenue.overdueInvoices > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/10 text-[10px] text-destructive">
                      ⚠ {analytics.revenue.overdueInvoices} overdue invoice{analytics.revenue.overdueInvoices > 1 ? "s" : ""} · ${analytics.revenue.totalPending.toLocaleString()} pending
                    </div>
                  )}
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Monthly Revenue Chart */}
                {analytics.monthlyRevenue?.length > 0 && (
                  <div className="rounded-xl border border-border/20 bg-card/50 p-5">
                    <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light mb-4">Monthly Revenue</p>
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.monthlyRevenue} barGap={2}>
                          <XAxis dataKey="month" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} formatter={(v: number) => `$${v.toLocaleString()}`} />
                          <Bar dataKey="invoiced" fill="hsl(var(--primary) / 0.3)" radius={[4, 4, 0, 0]} name="Invoiced" />
                          <Bar dataKey="collected" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Collected" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Lead Sources */}
                {analytics.leadSources?.length > 0 && (
                  <div className="rounded-xl border border-border/20 bg-card/50 p-5">
                    <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light mb-4">Lead Sources</p>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-32 flex-shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={analytics.leadSources} dataKey="count" nameKey="source" cx="50%" cy="50%" outerRadius={55} innerRadius={30} strokeWidth={0}>
                              {analytics.leadSources.map((_: any, i: number) => (
                                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        {analytics.leadSources.slice(0, 5).map((s: any, i: number) => (
                          <div key={s.source} className="flex items-center gap-2 text-[10px]">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                            <span className="text-muted-foreground/60 truncate">{s.source.replace(/_/g, " ")}</span>
                            <span className="font-medium ml-auto flex-shrink-0">{s.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

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
