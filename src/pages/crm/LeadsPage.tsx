import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import CrmTable from "@/components/crm/CrmTable";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type LeadStatus = Database["public"]["Enums"]["lead_status"];
const STATUSES: LeadStatus[] = ["new", "contacted", "quote_sent", "negotiation", "confirmed", "lost"];

const LeadsPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [form, setForm] = useState({ client_id: "", status: "new" as LeadStatus, source: "" });

  const load = useCallback(async () => {
    setLoading(true);
    const { data: rows } = await supabase.from("leads").select("*, clients(full_name)").order("created_at", { ascending: false });
    setData(rows ?? []);
    setLoading(false);
  }, []);

  const fetchClients = useCallback(async () => {
    const { data: c } = await supabase.from("clients").select("id, full_name");
    setClients(c ?? []);
  }, []);

  useEffect(() => { load(); fetchClients(); }, [load, fetchClients]);

  const openForm = (row?: any) => {
    setEditing(row ?? null);
    setForm({ client_id: row?.client_id ?? "", status: row?.status ?? "new", source: row?.source ?? "" });
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { client_id: form.client_id || null, status: form.status, source: form.source || null };
    const op = editing?.id
      ? supabase.from("leads").update(payload).eq("id", editing.id)
      : supabase.from("leads").insert(payload);
    const { error } = await op;
    if (error) toast.error(error.message);
    else { toast.success(editing?.id ? "Updated" : "Created"); load(); setFormOpen(false); }
  };

  const handleDelete = async (row: any) => {
    if (!confirm("Delete this lead?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", row.id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  const inputClass = "w-full bg-secondary/50 rounded-lg px-3 py-2.5 text-[13px] text-foreground font-light focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all border border-border/20";
  const labelClass = "text-[9px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-1.5 block font-light";

  return (
    <>
      <CrmTable
        title="Leads"
        columns={[
          { key: "client", label: "Client", render: (r: any) => r.clients?.full_name ?? "—" },
          { key: "status", label: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
          { key: "source", label: "Source" },
          { key: "created_at", label: "Created", render: (r: any) => new Date(r.created_at).toLocaleDateString() },
        ]}
        data={data} loading={loading}
        onAdd={() => openForm()} onEdit={openForm} onDelete={handleDelete}
      />
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-card border-border/30 max-w-md">
          <DialogHeader><DialogTitle className="font-display text-lg">{editing?.id ? "Edit" : "New"} Lead</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label className={labelClass}>Client</label>
              <select value={form.client_id} onChange={e => setForm(p => ({ ...p, client_id: e.target.value }))} className={inputClass}>
                <option value="">Select client...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as LeadStatus }))} className={inputClass}>
                {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Source</label>
              <input value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))} placeholder="Website, referral, etc." className={inputClass} />
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(38,52%,50%,0.45)] transition-all duration-500">Save Lead</button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadsPage;
