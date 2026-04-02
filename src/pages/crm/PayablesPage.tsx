import { useEffect, useState } from "react";
import { crmInputClass, crmLabelClass, crmFilterClass } from "@/components/crm/crmStyles";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ArrowUpRight, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const PayablesPage = () => {
  const [payables, setPayables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ supplier_name: "", amount: "", payment_date: "", reference: "", notes: "", status: "pending" });

  const load = async () => {
    const { data } = await supabase
      .from("payments")
      .select("*")
      .eq("payment_type", "outgoing")
      .order("created_at", { ascending: false });
    setPayables(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("payments").insert({
      payment_type: "outgoing",
      supplier_name: form.supplier_name,
      amount: parseFloat(form.amount),
      payment_date: form.payment_date || null,
      reference: form.reference || null,
      notes: form.notes || null,
      status: form.status,
    });
    if (error) toast.error(error.message);
    else { toast.success("Payable recorded"); load(); setFormOpen(false); }
  };

  const total = payables.filter(p => p.status === "pending").reduce((s, p) => s + Number(p.amount), 0);
  const inputClass = crmInputClass;
  const labelClass = crmLabelClass;

  const statusColor = (s: string) => {
    if (s === "completed") return "bg-emerald-500/20 text-emerald-400";
    if (s === "pending") return "bg-amber-500/20 text-amber-400";
    return "bg-destructive/20 text-destructive";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-display font-semibold">Accounts Payable</h1>
          <p className="text-[11px] text-muted-foreground/50 font-light mt-1">Supplier · Operator · Partner payments</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-display font-semibold">${total.toLocaleString()}</p>
            <p className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground/40">Outstanding</p>
          </div>
          <button onClick={() => { setForm({ supplier_name: "", amount: "", payment_date: "", reference: "", notes: "", status: "pending" }); setFormOpen(true); }}
            className="p-2.5 rounded-lg border border-border/20 text-muted-foreground/40 hover:text-foreground hover:border-primary/30 transition-all">
            <Plus size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : payables.length === 0 ? (
        <div className="text-center py-20">
          <ArrowUpRight className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" strokeWidth={1} />
          <p className="text-[13px] text-muted-foreground/40 font-light">No payables recorded</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/20 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/10">
                {["Supplier / Operator", "Amount", "Date", "Reference", "Status"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.2em] uppercase text-muted-foreground/40 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payables.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-border/5 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 text-[12px] font-light">{p.supplier_name || "—"}</td>
                  <td className="px-4 py-3 text-[12px] font-medium">${Number(p.amount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-[11px] text-muted-foreground/40 font-light">{p.payment_date ? new Date(p.payment_date).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-3 text-[11px] text-muted-foreground/40 font-light">{p.reference || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full font-medium ${statusColor(p.status)}`}>{p.status}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-card border-border/30 max-w-md">
          <DialogHeader><DialogTitle className="font-display text-lg">Record Payable</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div><label className={labelClass}>Supplier / Operator</label><input value={form.supplier_name} onChange={e => setForm(p => ({ ...p, supplier_name: e.target.value }))} required className={inputClass} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>Amount ($)</label><input type="number" step="0.01" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} required className={inputClass} /></div>
              <div><label className={labelClass}>Date</label><input type="date" value={form.payment_date} onChange={e => setForm(p => ({ ...p, payment_date: e.target.value }))} className={inputClass} /></div>
            </div>
            <div><label className={labelClass}>Reference</label><input value={form.reference} onChange={e => setForm(p => ({ ...p, reference: e.target.value }))} className={inputClass} /></div>
            <div><label className={labelClass}>Notes</label><input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className={inputClass} /></div>
            <button type="submit" className="w-full py-3 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,85%,58%,0.45)] transition-all duration-500">Save</button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PayablesPage;
