import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Landmark, Plus, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const BankReconciliationPage = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ transaction_type: "credit", amount: "", description: "", reference: "", transaction_date: "" });

  const load = async () => {
    const { data } = await supabase.from("bank_transactions").select("*").order("transaction_date", { ascending: false }).limit(100);
    setTransactions(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("bank_transactions").insert({
      transaction_type: form.transaction_type,
      amount: parseFloat(form.amount),
      description: form.description || null,
      reference: form.reference || null,
      transaction_date: form.transaction_date || new Date().toISOString(),
    });
    if (error) toast.error(error.message);
    else { toast.success("Transaction added"); load(); setFormOpen(false); }
  };

  const markReconciled = async (id: string) => {
    const { error } = await supabase.from("bank_transactions").update({ reconciled: true }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Reconciled"); load(); }
  };

  const unreconciledCount = transactions.filter(t => !t.reconciled).length;
  const inputClass = "w-full bg-secondary/50 rounded-lg px-3 py-2.5 text-[13px] text-foreground font-light focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all border border-border/20";
  const labelClass = "text-[9px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-1.5 block font-light";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-display font-semibold">Bank Reconciliation</h1>
          <p className="text-[11px] text-muted-foreground/50 font-light mt-1">
            {unreconciledCount > 0 ? `${unreconciledCount} unreconciled transactions` : "All transactions reconciled"}
          </p>
        </div>
        <button onClick={() => { setForm({ transaction_type: "credit", amount: "", description: "", reference: "", transaction_date: "" }); setFormOpen(true); }}
          className="p-2.5 rounded-lg border border-border/20 text-muted-foreground/40 hover:text-foreground hover:border-primary/30 transition-all">
          <Plus size={16} strokeWidth={1.5} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="w-5 h-5 border border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-20">
          <Landmark className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" strokeWidth={1} />
          <p className="text-[13px] text-muted-foreground/40 font-light">No bank transactions</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/20 overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-border/10">
              {["Type", "Amount", "Description", "Reference", "Date", "Status", ""].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.2em] uppercase text-muted-foreground/40 font-medium">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {transactions.map((t, i) => (
                <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className={`border-b border-border/5 hover:bg-secondary/30 transition-colors ${!t.reconciled ? "bg-amber-500/5" : ""}`}>
                  <td className="px-4 py-3">
                    <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full font-medium ${t.transaction_type === "credit" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>{t.transaction_type}</span>
                  </td>
                  <td className="px-4 py-3 text-[12px] font-medium">${Number(t.amount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-[11px] text-muted-foreground/40 font-light">{t.description || "—"}</td>
                  <td className="px-4 py-3 text-[11px] text-muted-foreground/40 font-light">{t.reference || "—"}</td>
                  <td className="px-4 py-3 text-[11px] text-muted-foreground/40 font-light">{new Date(t.transaction_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full font-medium ${t.reconciled ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                      {t.reconciled ? "Reconciled" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {!t.reconciled && (
                      <button onClick={() => markReconciled(t.id)} className="p-1.5 rounded-lg border border-border/20 text-muted-foreground/30 hover:text-emerald-400 hover:border-emerald-400/30 transition-all" title="Mark reconciled">
                        <CheckCircle size={12} strokeWidth={1.5} />
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-card border-border/30 max-w-md">
          <DialogHeader><DialogTitle className="font-display text-lg">Add Bank Transaction</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>Type</label>
                <select value={form.transaction_type} onChange={e => setForm(p => ({ ...p, transaction_type: e.target.value }))} className={inputClass}>
                  <option value="credit">Credit (In)</option>
                  <option value="debit">Debit (Out)</option>
                </select>
              </div>
              <div><label className={labelClass}>Amount ($)</label><input type="number" step="0.01" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} required className={inputClass} /></div>
            </div>
            <div><label className={labelClass}>Description</label><input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className={inputClass} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>Reference</label><input value={form.reference} onChange={e => setForm(p => ({ ...p, reference: e.target.value }))} className={inputClass} /></div>
              <div><label className={labelClass}>Date</label><input type="date" value={form.transaction_date} onChange={e => setForm(p => ({ ...p, transaction_date: e.target.value }))} className={inputClass} /></div>
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,85%,58%,0.45)] transition-all duration-500">Save</button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BankReconciliationPage;
