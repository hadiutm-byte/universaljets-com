import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, CheckCircle, XCircle, AlertTriangle, Clock, ChevronLeft, ChevronRight, Download, TrendingUp } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface EmailStats {
  total: number;
  sent: number;
  failed: number;
  suppressed: number;
  pending: number;
  bounced: number;
  complained: number;
}

interface EmailLog {
  id: string;
  message_id: string;
  template_name: string;
  recipient_email: string;
  status: string;
  error_message: string | null;
  created_at: string;
}

interface TemplatePerf {
  name: string;
  total: number;
  sent: number;
  failed: number;
  suppressed: number;
  deliveryRate: number;
}

interface Pagination {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}

const TIME_RANGES = [
  { label: "24h", days: 1 },
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
];

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "sent", label: "Sent" },
  { value: "dlq", label: "Failed" },
  { value: "suppressed", label: "Suppressed" },
  { value: "pending", label: "Pending" },
];

const statusColor: Record<string, string> = {
  sent: "bg-emerald-500/20 text-emerald-400",
  pending: "bg-amber-500/20 text-amber-400",
  dlq: "bg-destructive/20 text-destructive",
  failed: "bg-destructive/20 text-destructive",
  suppressed: "bg-yellow-500/20 text-yellow-400",
  bounced: "bg-orange-500/20 text-orange-400",
  complained: "bg-red-500/20 text-red-400",
};

function exportCsv(logs: EmailLog[]) {
  const header = "Template,Recipient,Status,Timestamp,Error\n";
  const rows = logs.map((l) =>
    [
      l.template_name,
      l.recipient_email,
      l.status === "dlq" ? "failed" : l.status,
      l.created_at,
      (l.error_message || "").replace(/,/g, ";"),
    ].join(",")
  );
  const blob = new Blob([header + rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `email-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const EmailAnalyticsPage = () => {
  const call = useCallback(
    async (params: Record<string, string>) => {
      const { data, error } = await supabase.functions.invoke("crm-api", {
        method: "POST",
        body: { _endpoint: "email-analytics", _method: "GET", _params: params },
      });
      if (error) return null;
      return data;
    },
    []
  );

  const [stats, setStats] = useState<EmailStats | null>(null);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [dailyVolume, setDailyVolume] = useState<any[]>([]);
  const [templateNames, setTemplateNames] = useState<string[]>([]);
  const [templatePerformance, setTemplatePerformance] = useState<TemplatePerf[]>([]);
  const [deliveryTrend, setDeliveryTrend] = useState<any[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  const [rangeDays, setRangeDays] = useState(7);
  const [templateFilter, setTemplateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const start = new Date(Date.now() - rangeDays * 86400000).toISOString();
    const end = new Date().toISOString();
    const params: Record<string, string> = { start, end, page: String(page) };
    if (templateFilter) params.template = templateFilter;
    if (statusFilter) params.status = statusFilter;

    const data = await call(params);
    if (data) {
      setStats(data.stats);
      setLogs(data.logs ?? []);
      setDailyVolume(data.dailyVolume ?? []);
      setTemplateNames(data.templateNames ?? []);
      setTemplatePerformance(data.templatePerformance ?? []);
      setDeliveryTrend(data.deliveryTrend ?? []);
      setPagination(data.pagination);
    }
    setLoading(false);
  }, [call, rangeDays, templateFilter, statusFilter, page]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const statCards = stats ? [
    { label: "Total Emails", value: stats.total, icon: Mail, color: "text-blue-400" },
    { label: "Sent", value: stats.sent, icon: CheckCircle, color: "text-emerald-400" },
    { label: "Failed", value: stats.failed, icon: XCircle, color: "text-destructive" },
    { label: "Suppressed", value: stats.suppressed, icon: AlertTriangle, color: "text-yellow-400" },
    { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-400" },
  ] : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl md:text-2xl">Email Analytics</h1>
          <p className="text-[11px] text-muted-foreground/60 mt-1">Monitor email delivery, performance and engagement</p>
        </div>
        {logs.length > 0 && (
          <button
            onClick={() => exportCsv(logs)}
            className="flex items-center gap-2 px-3 py-2 text-[11px] bg-card/50 border border-border/20 rounded-lg hover:bg-secondary/50 transition-colors text-foreground/60 hover:text-foreground"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-1 bg-card/50 border border-border/20 rounded-lg p-1">
          {TIME_RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => { setRangeDays(r.days); setPage(1); }}
              className={`px-3 py-1.5 text-[11px] rounded-md transition-all ${rangeDays === r.days ? "bg-primary/20 text-primary" : "text-muted-foreground/50 hover:text-foreground"}`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <select
          value={templateFilter}
          onChange={(e) => { setTemplateFilter(e.target.value); setPage(1); }}
          className="bg-card/50 border border-border/20 rounded-lg px-3 py-1.5 text-[11px] text-foreground/70"
        >
          <option value="">All Templates</option>
          {templateNames.map((t) => (
            <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-card/50 border border-border/20 rounded-lg px-3 py-1.5 text-[11px] text-foreground/70"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border border-primary/30 border-t-primary/80 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {statCards.map((s) => (
              <div key={s.label} className="rounded-xl border border-border/20 bg-card/50 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <s.icon className={`w-4 h-4 ${s.color} opacity-60`} strokeWidth={1.5} />
                  <span className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground/50">{s.label}</span>
                </div>
                <p className="text-2xl font-display font-semibold">{s.value.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Daily Volume Chart */}
            {dailyVolume.length > 0 && (
              <div className="rounded-xl border border-border/20 bg-card/50 p-5">
                <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light mb-4">Daily Send Volume</p>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyVolume} barGap={2}>
                      <XAxis dataKey="date" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => v.slice(5)} />
                      <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
                      <Bar dataKey="sent" fill="hsl(160, 60%, 45%)" radius={[4, 4, 0, 0]} name="Sent" />
                      <Bar dataKey="failed" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Failed" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Delivery Rate Trend */}
            {deliveryTrend.length > 1 && (
              <div className="rounded-xl border border-border/20 bg-card/50 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-primary/60" />
                  <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light">Delivery Rate Trend</p>
                </div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={deliveryTrend}>
                      <XAxis dataKey="date" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => v.slice(5)} />
                      <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                      <Tooltip
                        contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                        formatter={(v: number) => [`${v}%`, "Delivery Rate"]}
                      />
                      <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--primary))" }} name="Delivery Rate" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Template Performance Breakdown */}
          {templatePerformance.length > 0 && (
            <div className="rounded-xl border border-border/20 bg-card/50 overflow-hidden">
              <div className="p-4 border-b border-border/10">
                <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light">Template Performance</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-border/10 text-muted-foreground/40">
                      <th className="text-left px-4 py-3 font-medium">Template</th>
                      <th className="text-right px-4 py-3 font-medium">Total</th>
                      <th className="text-right px-4 py-3 font-medium">Sent</th>
                      <th className="text-right px-4 py-3 font-medium">Failed</th>
                      <th className="text-right px-4 py-3 font-medium">Suppressed</th>
                      <th className="text-right px-4 py-3 font-medium">Delivery Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {templatePerformance.map((t) => (
                      <tr key={t.name} className="border-b border-border/5 hover:bg-secondary/20 transition-colors">
                        <td className="px-4 py-3 font-medium">{t.name.replace(/_/g, " ")}</td>
                        <td className="px-4 py-3 text-right text-muted-foreground/60">{t.total}</td>
                        <td className="px-4 py-3 text-right text-emerald-400">{t.sent}</td>
                        <td className="px-4 py-3 text-right text-destructive">{t.failed}</td>
                        <td className="px-4 py-3 text-right text-yellow-400">{t.suppressed}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-1.5 bg-secondary/30 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${t.deliveryRate}%`,
                                  background: t.deliveryRate >= 95 ? "hsl(160, 60%, 45%)" : t.deliveryRate >= 80 ? "hsl(43, 85%, 58%)" : "hsl(var(--destructive))",
                                }}
                              />
                            </div>
                            <span className={`font-medium ${t.deliveryRate >= 95 ? "text-emerald-400" : t.deliveryRate >= 80 ? "text-amber-400" : "text-destructive"}`}>
                              {t.deliveryRate}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Email Log Table */}
          <div className="rounded-xl border border-border/20 bg-card/50 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border/10">
              <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light">Email Log</p>
              {logs.length > 0 && (
                <button
                  onClick={() => exportCsv(logs)}
                  className="flex items-center gap-1.5 text-[10px] text-muted-foreground/40 hover:text-foreground/60 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  CSV
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-border/10 text-muted-foreground/40">
                    <th className="text-left px-4 py-3 font-medium">Template</th>
                    <th className="text-left px-4 py-3 font-medium">Recipient</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                    <th className="text-left px-4 py-3 font-medium">Timestamp</th>
                    <th className="text-left px-4 py-3 font-medium">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground/40">
                        No emails found for the selected filters
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="border-b border-border/5 hover:bg-secondary/20 transition-colors">
                        <td className="px-4 py-3 font-medium">{log.template_name?.replace(/_/g, " ")}</td>
                        <td className="px-4 py-3 text-muted-foreground/60">{log.recipient_email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider ${statusColor[log.status] || "bg-secondary text-foreground/40"}`}>
                            {log.status === "dlq" ? "failed" : log.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground/50">
                          {new Date(log.created_at).toLocaleString("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="px-4 py-3 text-destructive/70 max-w-[200px] truncate">
                          {log.error_message || "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border/10">
                <span className="text-[10px] text-muted-foreground/40">
                  {pagination.totalItems} emails · Page {pagination.page} of {pagination.totalPages}
                </span>
                <div className="flex gap-1">
                  <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="p-1.5 rounded hover:bg-secondary/50 disabled:opacity-30 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)} className="p-1.5 rounded hover:bg-secondary/50 disabled:opacity-30 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailAnalyticsPage;
