import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { FileText, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const NOTE_TYPES = ["credit", "debit", "refund", "adjustment"] as const;
const STATUSES = ["draft", "issued", "applied", "void"] as const;

const CreditsPage = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ note_type: "credit", amount: "", reason: "", supplier_name: "", status: "draft" });

  const load = async () => {
    const { data } = await supabase.from("credit_notes").select("*").order("created_at", { ascending: false });
    setNotes(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("credit_notes").insert({
      note_type: form.note_type,
      amount: parseFloat(form.amount),
      reason: form.reason || null,
      supplier_name: form.supplier_name || null,
      status: form.status,
    });
    if (error) toast.error(error.message);
    else { toast.success("Note created"); load(); setFormOpen(false); }
  };

  const typeColor = (t: string) => {
    const m: Record<string, string> = { credit: "bg-emerald-500/20 text-emerald-400", debit: "bg-amber-500/20 text-amber-400", refund: "bg-blue-500/20 text-blue-400", adjustment: "bg-purple-500/20 text-purple-400" };
    return m[t] || "bg-secondary text-muted-foreground";
  };

  const statusColor = (s: string) => {
    const m: Record<string, string> = { draft: "bg-secondary text-muted-foreground", issued: "bg-primary/20 text-primary", applied: "bg-emerald-500/20 text-emerald-400", void: "bg-destructive/20 text-destructive" };
    return m[s] || "bg-secondary text-muted-foreground";
  };

  const inputClass = "w-full bg-secondary/50 rounded-lg px-3 py-2.5 text-[13px] text-foreground font-light focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all border border-border/20";
  const labelClass = "text-[9px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-1.5 block font-light";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-display font-semibold">Credits & Adjustments</h1>
          <p className="text-[11px] text-muted-foreground/50 font-light mt-1">Credit notes · Debit notes · Refunds · Adjustments</p>
        </div>
        <button onClick={() => { setForm({ note_type: "credit", amount: "", reason: "", supplier_name: "", status: "draft" }); setFormOpen(true); }}
          className="p-2.5 rounded-lg border border-border/20 text-muted-foreground/40 hover:text-foreground hover:border-primary/30 transition-all">
          <Plus size={16} strokeWidth={1.5} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="w-5 h-5 border border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : notes.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" strokeWidth={1} />
          <p className="text-[13px] text-muted-foreground/40 font-light">No credit notes yet</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border/20 overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-border/10">
              {["Type", "Amount", "Reason", "Supplier", "Status", "Date"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[9px] tracking-[0.2em] uppercase text-muted-foreground/40 font-medium">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {notes.map((n, i) => (
                <motion.tr key={n.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-border/5 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3"><span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full font-medium ${typeColor(n.note_type)}`}>{n.note_type}</span></td>
                  <td className="px-4 py-3 text-[12px] font-medium">${Number(n.amount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-[11px] text-muted-foreground/40 font-light">{n.reason || "—"}</td>
                  <td className="px-4 py-3 text-[11px] text-muted-foreground/40 font-light">{n.supplier_name || "—"}</td>
                  <td className="px-4 py-3"><span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full font-medium ${statusColor(n.status)}`}>{n.status}</span></td>
                  <td className="px-4 py-3 text-[11px] text-muted-foreground/40 font-light">{new Date(n.created_at).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-card border-border/30 max-w-md">
          <DialogHeader><DialogTitle className="font-display text-lg">New Credit/Debit Note</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>Type</label>
                <select value={form.note_type} onChange={e => setForm(p => ({ ...p, note_type: e.target.value }))} className={inputClass}>
                  {NOTE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div><label className={labelClass}>Amount ($)</label><input type="number" step="0.01" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} required className={inputClass} /></div>
            </div>
            <div><label className={labelClass}>Reason</label><input value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} className={inputClass} /></div>
            <div><label className={labelClass}>Supplier (if applicable)</label><input value={form.supplier_name} onChange={e => setForm(p => ({ ...p, supplier_name: e.target.value }))} className={inputClass} /></div>
            <div><label className={labelClass}>Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className={inputClass}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(45,79%,46%,0.45)] transition-all duration-500">Save</button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreditsPage;
