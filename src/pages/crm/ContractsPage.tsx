import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import CrmTable from "@/components/crm/CrmTable";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { TemplateDownloadCard, charterContractTemplate } from "@/components/crm/CrmTemplates";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type ContractStatus = Database["public"]["Enums"]["contract_status"];
const STATUSES: ContractStatus[] = ["draft", "sent", "signed", "cancelled"];

const ContractsPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [form, setForm] = useState({ quote_id: "", file_url: "", status: "draft" as ContractStatus });
  const { roles } = useAuth();

  // Only Operations and Admin can manage contracts (supplier/partner documents)
  const canManage = roles.includes("admin") || roles.includes("operations");

  const load = useCallback(async () => {
    setLoading(true);
    const { data: rows } = await supabase.from("contracts").select("*, quotes(aircraft, price)").order("created_at", { ascending: false });
    setData(rows ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    supabase.from("quotes").select("id, aircraft, price").then(({ data: q }) => setQuotes(q ?? []));
  }, [load]);

  const openForm = (row?: any) => {
    if (!canManage) { toast.error("Only Operations can manage contracts"); return; }
    setEditing(row ?? null);
    setForm({ quote_id: row?.quote_id ?? "", file_url: row?.file_url ?? "", status: (row?.status ?? "draft") as ContractStatus });
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;
    const payload = { quote_id: form.quote_id || null, file_url: form.file_url || null, status: form.status };
    const op = editing?.id ? supabase.from("contracts").update(payload).eq("id", editing.id) : supabase.from("contracts").insert(payload);
    const { error } = await op;
    if (error) toast.error(error.message); else { toast.success(editing?.id ? "Updated" : "Created"); load(); setFormOpen(false); }
  };

  const handleDelete = async (row: any) => {
    if (!canManage) { toast.error("Only Operations can delete contracts"); return; }
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("contracts").delete().eq("id", row.id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  const inputClass = "w-full bg-secondary/50 rounded-lg px-3 py-2.5 text-[13px] text-foreground font-light focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all border border-border/20";
  const labelClass = "text-[9px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-1.5 block font-light";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50 font-medium mb-2">Templates</p>
        <TemplateDownloadCard template={charterContractTemplate} />
      </div>
      <CrmTable title="Contracts"
        columns={[
          { key: "quote", label: "Quote", render: (r: any) => r.quotes ? `${r.quotes.aircraft} — $${Number(r.quotes.price).toLocaleString()}` : "—" },
          { key: "file_url", label: "Document", render: (r: any) => r.file_url ? <a href={r.file_url} target="_blank" className="text-primary hover:underline">View</a> : "—" },
          { key: "status", label: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
          { key: "created_at", label: "Created", render: (r: any) => new Date(r.created_at).toLocaleDateString() },
        ]}
        data={data} loading={loading}
        onAdd={canManage ? () => openForm() : undefined}
        onEdit={canManage ? openForm : undefined}
        onDelete={canManage ? handleDelete : undefined}
      />
      {!canManage && (
        <p className="text-[10px] text-muted-foreground/30 font-light mt-2 text-center">
          Contract management is handled by Operations. Contact Operations for changes.
        </p>
      )}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-card border-border/30 max-w-md">
          <DialogHeader><DialogTitle className="font-display text-lg">{editing?.id ? "Edit" : "New"} Contract</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div><label className={labelClass}>Quote</label>
              <select value={form.quote_id} onChange={e => setForm(p => ({ ...p, quote_id: e.target.value }))} className={inputClass}>
                <option value="">Select quote...</option>
                {quotes.map(q => <option key={q.id} value={q.id}>{q.aircraft} — ${Number(q.price).toLocaleString()}</option>)}
              </select>
            </div>
            <div><label className={labelClass}>Document URL</label><input value={form.file_url} onChange={e => setForm(p => ({ ...p, file_url: e.target.value }))} className={inputClass} /></div>
            <div><label className={labelClass}>Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as ContractStatus }))} className={inputClass}>
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

export default ContractsPage;
