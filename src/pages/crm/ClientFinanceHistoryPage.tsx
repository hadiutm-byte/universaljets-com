import { useEffect, useState } from "react";
import { crmInputClass, crmLabelClass, crmFilterClass } from "@/components/crm/crmStyles";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Users, Search } from "lucide-react";

const ClientFinanceHistoryPage = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [history, setHistory] = useState<{ invoices: any[]; payments: any[]; credits: any[] }>({ invoices: [], payments: [], credits: [] });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("clients").select("id, full_name, email, credit_balance").order("full_name");
      setClients(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const loadHistory = async (clientId: string) => {
    setSelected(clientId);
    const [invRes, payRes, crRes] = await Promise.all([
      supabase.from("invoices").select("*, contracts(quotes(request_id, aircraft, flight_requests(departure, destination)))").order("created_at", { ascending: false }),
      supabase.from("payments").select("*").eq("client_id", clientId).order("created_at", { ascending: false }),
      supabase.from("credit_notes").select("*").eq("client_id", clientId).order("created_at", { ascending: false }),
    ]);
    setHistory({ invoices: invRes.data ?? [], payments: payRes.data ?? [], credits: crRes.data ?? [] });
  };

  const filtered = clients.filter(c => c.full_name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()));
  const selectedClient = clients.find(c => c.id === selected);

  const inputClass = crmInputClass;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-display font-semibold">Client Financial History</h1>
        <p className="text-[11px] text-muted-foreground/50 font-light mt-1">Invoices · Payments · Credits by client</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/30" strokeWidth={1.5} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients…" className={`${inputClass} pl-9`} />
          </div>
          <div className="rounded-xl border border-border/20 overflow-hidden max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-10"><div className="w-4 h-4 border border-primary/30 border-t-primary rounded-full animate-spin" /></div>
            ) : filtered.length === 0 ? (
              <p className="text-center py-10 text-[12px] text-muted-foreground/40">No clients</p>
            ) : filtered.map(c => (
              <button key={c.id} onClick={() => loadHistory(c.id)}
                className={`w-full text-left px-4 py-3 border-b border-border/5 hover:bg-secondary/30 transition-colors ${selected === c.id ? "bg-secondary/40" : ""}`}>
                <p className="text-[12px] font-light">{c.full_name}</p>
                <p className="text-[10px] text-muted-foreground/40">{c.email || "—"}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          {!selected ? (
            <div className="text-center py-20">
              <Users className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" strokeWidth={1} />
              <p className="text-[13px] text-muted-foreground/40 font-light">Select a client to view financial history</p>
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-border/20 bg-card/50 p-4 flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-display font-semibold">{selectedClient?.full_name}</p>
                  <p className="text-[10px] text-muted-foreground/40">{selectedClient?.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-[16px] font-display font-semibold">${Number(selectedClient?.credit_balance ?? 0).toLocaleString()}</p>
                  <p className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground/40">Credit Balance</p>
                </div>
              </div>

              {/* Payments */}
              <div className="rounded-xl border border-border/20 bg-card/50 p-4">
                <h3 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light mb-3">Payments ({history.payments.length})</h3>
                {history.payments.length === 0 ? <p className="text-[11px] text-muted-foreground/30">No payments</p> : (
                  <div className="space-y-2">
                    {history.payments.map((p, i) => (
                      <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                        className="flex items-center justify-between py-2 border-b border-border/5">
                        <div>
                          <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full font-medium ${p.payment_type === "incoming" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>{p.payment_type}</span>
                          <span className="text-[11px] text-muted-foreground/40 ml-2">{p.reference || "—"}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[12px] font-medium">${Number(p.amount).toLocaleString()}</span>
                          <span className="text-[10px] text-muted-foreground/30 ml-2">{p.payment_date ? new Date(p.payment_date).toLocaleDateString() : "—"}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Credits */}
              <div className="rounded-xl border border-border/20 bg-card/50 p-4">
                <h3 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light mb-3">Credit Notes ({history.credits.length})</h3>
                {history.credits.length === 0 ? <p className="text-[11px] text-muted-foreground/30">No credit notes</p> : (
                  <div className="space-y-2">
                    {history.credits.map((c, i) => (
                      <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                        className="flex items-center justify-between py-2 border-b border-border/5">
                        <div>
                          <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full font-medium ${c.note_type === "credit" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>{c.note_type}</span>
                          <span className="text-[11px] text-muted-foreground/40 ml-2">{c.reason || "—"}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[12px] font-medium">${Number(c.amount).toLocaleString()}</span>
                          <span className={`text-[9px] ml-2 px-1.5 py-0.5 rounded-full ${c.status === "issued" ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground/50"}`}>{c.status}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientFinanceHistoryPage;
