import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import CrmTable from "@/components/crm/CrmTable";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { TemplateDownloadCard, quoteRequestTemplate } from "@/components/crm/CrmTemplates";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type QuoteStatus = Database["public"]["Enums"]["quote_status"];
const STATUSES: QuoteStatus[] = ["draft", "sent", "accepted", "rejected", "expired"];

const QuotesPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [form, setForm] = useState({ request_id: "", aircraft: "", operator: "", price: "", valid_until: "", status: "draft" as QuoteStatus });

  const load = useCallback(async () => {
    setLoading(true);
    const { data: rows } = await supabase.from("quotes").select("*, flight_requests(departure, destination)").order("created_at", { ascending: false });
    setData(rows ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    supabase.from("flight_requests").select("id, departure, destination").then(({ data: r }) => setRequests(r ?? []));
  }, [load]);

  const openForm = (row?: any) => {
    setEditing(row ?? null);
    setForm({
      request_id: row?.request_id ?? "", aircraft: row?.aircraft ?? "", operator: row?.operator ?? "",
      price: row?.price?.toString() ?? "", valid_until: row?.valid_until ? new Date(row.valid_until).toISOString().slice(0, 10) : "",
      status: (row?.status ?? "draft") as QuoteStatus,
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { request_id: form.request_id || null, aircraft: form.aircraft || null, operator: form.operator || null, price: form.price ? parseFloat(form.price) : null, valid_until: form.valid_until || null, status: form.status };
    const op = editing?.id ? supabase.from("quotes").update(payload).eq("id", editing.id) : supabase.from("quotes").insert(payload);
    const { error } = await op;
    if (error) toast.error(error.message); else { toast.success(editing?.id ? "Updated" : "Created"); load(); setFormOpen(false); }
  };

  const handleDelete = async (row: any) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("quotes").delete().eq("id", row.id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  const inputClass = "w-full bg-secondary/50 rounded-lg px-3 py-2.5 text-[13px] text-foreground font-light focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all border border-border/20";
  const labelClass = "text-[9px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-1.5 block font-light";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/50 font-medium mb-2">Templates</p>
        <TemplateDownloadCard template={quoteRequestTemplate} />
      </div>
      <CrmTable title="Quotes"
        columns={[
          { key: "route", label: "Route", render: (r: any) => r.flight_requests ? `${r.flight_requests.departure} → ${r.flight_requests.destination}` : "—" },
          { key: "aircraft", label: "Aircraft" }, { key: "operator", label: "Operator" },
          { key: "price", label: "Price", render: (r: any) => r.price ? `$${Number(r.price).toLocaleString()}` : "—" },
          { key: "valid_until", label: "Valid Until", render: (r: any) => r.valid_until ? new Date(r.valid_until).toLocaleDateString() : "—" },
          { key: "status", label: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
        ]}
        data={data} loading={loading} onAdd={() => openForm()} onEdit={openForm} onDelete={handleDelete}
      />
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-card border-border/30 max-w-md">
          <DialogHeader><DialogTitle className="font-display text-lg">{editing?.id ? "Edit" : "New"} Quote</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div><label className={labelClass}>Flight Request</label>
              <select value={form.request_id} onChange={e => setForm(p => ({ ...p, request_id: e.target.value }))} className={inputClass}>
                <option value="">Select request...</option>
                {requests.map(r => <option key={r.id} value={r.id}>{r.departure} → {r.destination}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>Aircraft</label><input value={form.aircraft} onChange={e => setForm(p => ({ ...p, aircraft: e.target.value }))} className={inputClass} /></div>
              <div><label className={labelClass}>Operator</label><input value={form.operator} onChange={e => setForm(p => ({ ...p, operator: e.target.value }))} className={inputClass} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>Price ($)</label><input type="number" step="0.01" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} className={inputClass} /></div>
              <div><label className={labelClass}>Valid Until</label><input type="date" value={form.valid_until} onChange={e => setForm(p => ({ ...p, valid_until: e.target.value }))} className={inputClass} /></div>
            </div>
            <div><label className={labelClass}>Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as QuoteStatus }))} className={inputClass}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(45,79%,46%,0.45)] transition-all duration-500">Save</button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuotesPage;
