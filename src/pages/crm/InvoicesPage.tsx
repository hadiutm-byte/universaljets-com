import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import CrmTable from "@/components/crm/CrmTable";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { TemplateDownloadCard, invoiceTemplate, receiptTemplate } from "@/components/crm/CrmTemplates";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type InvoiceStatus = Database["public"]["Enums"]["invoice_status"];
const STATUSES: InvoiceStatus[] = ["pending", "paid"];

const InvoicesPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [contracts, setContracts] = useState<any[]>([]);
  const [form, setForm] = useState({ contract_id: "", amount: "", status: "pending" as InvoiceStatus, due_date: "" });

  const load = useCallback(async () => {
    setLoading(true);
    const { data: rows } = await supabase
      .from("invoices")
      .select("*, contracts(status, quotes(aircraft, price, flight_requests(departure, destination, clients(full_name))))")
      .order("created_at", { ascending: false });
    setData(rows ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    supabase.from("contracts").select("id, status").then(({ data: c }) => setContracts(c ?? []));
  }, [load]);

  const openForm = (row?: any) => {
    setEditing(row ?? null);
    setForm({
      contract_id: row?.contract_id ?? "", amount: row?.amount?.toString() ?? "",
      status: (row?.status ?? "pending") as InvoiceStatus, due_date: row?.due_date ? new Date(row.due_date).toISOString().slice(0, 10) : "",
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { contract_id: form.contract_id || null, amount: parseFloat(form.amount), status: form.status, due_date: form.due_date || null };
    const op = editing?.id ? supabase.from("invoices").update(payload).eq("id", editing.id) : supabase.from("invoices").insert(payload);
    const { error } = await op;
    if (error) toast.error(error.message); else { toast.success(editing?.id ? "Updated" : "Created"); load(); setFormOpen(false); }
  };

  const handleDelete = async (row: any) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("invoices").delete().eq("id", row.id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  const isOverdue = (row: any) => row.status === "pending" && row.due_date && new Date(row.due_date) < new Date();

  // Summary stats
  const totalPending = data.filter(r => r.status === "pending").reduce((s, r) => s + Number(r.amount || 0), 0);
  const totalPaid = data.filter(r => r.status === "paid").reduce((s, r) => s + Number(r.amount || 0), 0);
  const overdueCount = data.filter(isOverdue).length;

  const inputClass = "w-full bg-secondary/50 rounded-lg px-3 py-2.5 text-[13px] text-foreground font-light focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all border border-border/20";
  const labelClass = "text-[9px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-1.5 block font-light";

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-border/20 bg-card/50 p-4">
          <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/40">Pending</p>
          <p className="text-lg font-display font-semibold text-amber-400 mt-1">${totalPending.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border/20 bg-card/50 p-4">
          <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/40">Collected</p>
          <p className="text-lg font-display font-semibold text-emerald-400 mt-1">${totalPaid.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border/20 bg-card/50 p-4">
          <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/40">Overdue</p>
          <p className={`text-lg font-display font-semibold mt-1 ${overdueCount > 0 ? "text-destructive" : "text-muted-foreground/30"}`}>{overdueCount}</p>
        </div>
      </div>

      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50 font-medium mb-2">Templates</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <TemplateDownloadCard template={invoiceTemplate} />
          <TemplateDownloadCard template={receiptTemplate} />
        </div>
      </div>
      <CrmTable title="Invoices"
        columns={[
          { key: "client", label: "Client", render: (r: any) => {
            const client = r.contracts?.quotes?.flight_requests?.clients;
            return client?.full_name || "—";
          }},
          { key: "route", label: "Route", render: (r: any) => {
            const fr = r.contracts?.quotes?.flight_requests;
            return fr ? `${fr.departure} → ${fr.destination}` : "—";
          }},
          { key: "amount", label: "Amount", render: (r: any) => `$${Number(r.amount).toLocaleString()}` },
          { key: "status", label: "Status", render: (r: any) => (
            <div className="flex items-center gap-1.5">
              <StatusBadge status={r.status} />
              {isOverdue(r) && <AlertTriangle size={12} className="text-destructive" />}
            </div>
          )},
          { key: "due_date", label: "Due Date", render: (r: any) => r.due_date ? (
            <span className={isOverdue(r) ? "text-destructive font-medium" : ""}>
              {new Date(r.due_date).toLocaleDateString()}
            </span>
          ) : "—" },
          { key: "created_at", label: "Created", render: (r: any) => new Date(r.created_at).toLocaleDateString() },
        ]}
        data={data} loading={loading} onAdd={() => openForm()} onEdit={openForm} onDelete={handleDelete}
      />
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-card border-border/30 max-w-md">
          <DialogHeader><DialogTitle className="font-display text-lg">{editing?.id ? "Edit" : "New"} Invoice</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div><label className={labelClass}>Contract</label>
              <select value={form.contract_id} onChange={e => setForm(p => ({ ...p, contract_id: e.target.value }))} className={inputClass}>
                <option value="">Select contract...</option>
                {contracts.map(c => <option key={c.id} value={c.id}>{c.id.slice(0, 8)}... ({c.status})</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>Amount ($)</label><input type="number" step="0.01" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} required className={inputClass} /></div>
              <div><label className={labelClass}>Due Date</label><input type="date" value={form.due_date} onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))} className={inputClass} /></div>
            </div>
            <div><label className={labelClass}>Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as InvoiceStatus }))} className={inputClass}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,74%,49%,0.45)] transition-all duration-500">Save</button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoicesPage;
