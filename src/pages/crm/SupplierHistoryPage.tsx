import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

const SupplierHistoryPage = () => {
  const [suppliers, setSuppliers] = useState<{ name: string; totalPaid: number; totalPending: number; payments: any[]; credits: any[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const [payRes, crRes] = await Promise.all([
        supabase.from("payments").select("*").eq("payment_type", "outgoing").order("created_at", { ascending: false }),
        supabase.from("credit_notes").select("*").not("supplier_name", "is", null).order("created_at", { ascending: false }),
      ]);

      const payments = payRes.data ?? [];
      const credits = crRes.data ?? [];

      const map = new Map<string, { totalPaid: number; totalPending: number; payments: any[]; credits: any[] }>();

      for (const p of payments) {
        const name = p.supplier_name || "Unknown";
        if (!map.has(name)) map.set(name, { totalPaid: 0, totalPending: 0, payments: [], credits: [] });
        const entry = map.get(name)!;
        entry.payments.push(p);
        if (p.status === "completed") entry.totalPaid += Number(p.amount);
        else if (p.status === "pending") entry.totalPending += Number(p.amount);
      }

      for (const c of credits) {
        const name = c.supplier_name || "Unknown";
        if (!map.has(name)) map.set(name, { totalPaid: 0, totalPending: 0, payments: [], credits: [] });
        map.get(name)!.credits.push(c);
      }

      setSuppliers(Array.from(map.entries()).map(([name, data]) => ({ name, ...data })).sort((a, b) => a.name.localeCompare(b.name)));
      setLoading(false);
    };
    load();
  }, []);

  const sel = suppliers.find(s => s.name === selected);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-display font-semibold">Supplier / Operator History</h1>
        <p className="text-[11px] text-muted-foreground/50 font-light mt-1">Outgoing payments · Credit notes by supplier</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="w-4 h-4 border border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : suppliers.length === 0 ? (
        <div className="text-center py-20">
          <Building2 className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" strokeWidth={1} />
          <p className="text-[13px] text-muted-foreground/40 font-light">No supplier records yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-border/20 overflow-hidden max-h-[60vh] overflow-y-auto">
            {suppliers.map(s => (
              <button key={s.name} onClick={() => setSelected(s.name)}
                className={`w-full text-left px-4 py-3 border-b border-border/5 hover:bg-secondary/30 transition-colors ${selected === s.name ? "bg-secondary/40" : ""}`}>
                <p className="text-[12px] font-light">{s.name}</p>
                <div className="flex gap-3 mt-1">
                  <span className="text-[9px] text-emerald-400">Paid: ${s.totalPaid.toLocaleString()}</span>
                  {s.totalPending > 0 && <span className="text-[9px] text-amber-400">Pending: ${s.totalPending.toLocaleString()}</span>}
                </div>
              </button>
            ))}
          </div>

          <div className="md:col-span-2 space-y-4">
            {!sel ? (
              <div className="text-center py-20">
                <Building2 className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" strokeWidth={1} />
                <p className="text-[13px] text-muted-foreground/40 font-light">Select a supplier to view history</p>
              </div>
            ) : (
              <>
                <div className="rounded-xl border border-border/20 bg-card/50 p-4 flex items-center justify-between">
                  <p className="text-[14px] font-display font-semibold">{sel.name}</p>
                  <div className="flex gap-4">
                    <div className="text-right">
                      <p className="text-[14px] font-display font-semibold text-emerald-400">${sel.totalPaid.toLocaleString()}</p>
                      <p className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground/40">Paid</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-display font-semibold text-amber-400">${sel.totalPending.toLocaleString()}</p>
                      <p className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground/40">Pending</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border/20 bg-card/50 p-4">
                  <h3 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light mb-3">Payments ({sel.payments.length})</h3>
                  {sel.payments.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="flex items-center justify-between py-2 border-b border-border/5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full font-medium ${p.status === "completed" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>{p.status}</span>
                        <span className="text-[11px] text-muted-foreground/40">{p.reference || "—"}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[12px] font-medium">${Number(p.amount).toLocaleString()}</span>
                        <span className="text-[10px] text-muted-foreground/30 ml-2">{p.payment_date ? new Date(p.payment_date).toLocaleDateString() : "—"}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {sel.credits.length > 0 && (
                  <div className="rounded-xl border border-border/20 bg-card/50 p-4">
                    <h3 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light mb-3">Credit Notes ({sel.credits.length})</h3>
                    {sel.credits.map((c, i) => (
                      <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                        className="flex items-center justify-between py-2 border-b border-border/5">
                        <span className="text-[11px] text-muted-foreground/40">{c.reason || "—"}</span>
                        <span className="text-[12px] font-medium">${Number(c.amount).toLocaleString()}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierHistoryPage;
