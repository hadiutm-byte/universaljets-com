import { useEffect, useState } from "react";
import { crmInputClass, crmLabelClass, crmSelectClass, crmFilterClass } from "@/components/crm/crmStyles";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { CreditCard, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const PaymentsPage = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ payment_type: "incoming", amount: "", payment_method: "bank_transfer", payment_date: "", reference: "", supplier_name: "", notes: "" });

  const load = async () => {
    const { data } = await supabase.from("payments").select("*").order("created_at", { ascending: false }).limit(100);
    setPayments(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("payments").insert({
      payment_type: form.payment_type,
      amount: parseFloat(form.amount),
      payment_method: form.payment_method,
      payment_date: form.payment_date || null,
      reference: form.reference || null,
      supplier_name: form.supplier_name || null,
      notes: form.notes || null,
      status: "completed",
    });
    if (error) toast.error(error.message);
    else { toast.success("Payment recorded"); load(); setFormOpen(false); }
  };

  const inputClass = crmInputClass;
  const labelClass = crmLabelClass;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-display font-semibold">Payments & Reconciliation</h1>
          <p className="text-[11px] text-muted-foreground/50 font-light mt-1">All incoming and outgoing payments</p>
        </div>
        <button onClick={() => { setForm({ payment_type: "incoming", amount: "", payment_method: "bank_transfer", payment_date: "", reference: "", supplier_name: "", notes: "" }); setFormOpen(true); }}
          className="p-2.5 rounded-lg border border-border/20 text-muted-foreground/40 hover:text-foreground hover:border-primary/30 transition-all">
          <Plus size={16} strokeWidth={1.5} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="w-5 h-5 border border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : payments.length === 0 ? (
        <div className="text-center py-20">
          <CreditCard className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" strokeWidth={1} />
          <p className="text-[13px] text-muted-foreground/40 font-light">No payments recorded</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/20 overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-border/10">
              {["Type", "Amount", "Method", "Date", "Reference", "Status"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.2em] uppercase text-muted-foreground/40 font-medium">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {payments.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-border/5 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full font-medium ${p.payment_type === "incoming" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                      {p.payment_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] font-medium">${Number(p.amount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-[11px] text-muted-foreground/50 font-light">{p.payment_method?.replace(/_/g, " ") || "—"}</td>
                  <td className="px-4 py-3 text-[11px] text-muted-foreground/40 font-light">{p.payment_date ? new Date(p.payment_date).toLocaleDateString() : "—"}</td>
                  <td className="px-4 py-3 text-[11px] text-muted-foreground/40 font-light">{p.reference || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full font-medium ${p.status === "completed" ? "bg-emerald-500/20 text-emerald-400" : p.status === "pending" ? "bg-amber-500/20 text-amber-400" : "bg-destructive/20 text-destructive"}`}>
                      {p.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-card border-border/30 max-w-md">
          <DialogHeader><DialogTitle className="font-display text-lg">Record Payment</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>Type</label>
                <select value={form.payment_type} onChange={e => setForm(p => ({ ...p, payment_type: e.target.value }))} className={inputClass}>
                  <option value="incoming">Incoming</option>
                  <option value="outgoing">Outgoing</option>
                </select>
              </div>
              <div><label className={labelClass}>Amount ($)</label><input type="number" step="0.01" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} required className={inputClass} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>Method</label>
                <select value={form.payment_method} onChange={e => setForm(p => ({ ...p, payment_method: e.target.value }))} className={inputClass}>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="card">Card</option>
                  <option value="cash">Cash</option>
                  <option value="credit_note">Credit Note</option>
                </select>
              </div>
              <div><label className={labelClass}>Date</label><input type="date" value={form.payment_date} onChange={e => setForm(p => ({ ...p, payment_date: e.target.value }))} className={inputClass} /></div>
            </div>
            {form.payment_type === "outgoing" && (
              <div><label className={labelClass}>Supplier / Operator</label><input value={form.supplier_name} onChange={e => setForm(p => ({ ...p, supplier_name: e.target.value }))} className={inputClass} /></div>
            )}
            <div><label className={labelClass}>Reference</label><input value={form.reference} onChange={e => setForm(p => ({ ...p, reference: e.target.value }))} className={inputClass} /></div>
            <div><label className={labelClass}>Notes</label><input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className={inputClass} /></div>
            <button type="submit" className="w-full py-3 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,85%,58%,0.45)] transition-all duration-500">Save</button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentsPage;
