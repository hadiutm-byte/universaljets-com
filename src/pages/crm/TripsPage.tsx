import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import CrmTable from "@/components/crm/CrmTable";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const STATUSES = ["scheduled", "in_progress", "completed", "cancelled"] as const;

const TripsPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [form, setForm] = useState({ client_id: "", aircraft: "", departure: "", destination: "", date: "", status: "scheduled" as string });

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data: rows } = await supabase.from("trips").select("*, clients(full_name)").order("created_at", { ascending: false });
    setData(rows ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
    supabase.from("clients").select("id, full_name").then(({ data: c }) => setClients(c ?? []));
  }, [fetch]);

  const openForm = (row?: any) => {
    setEditing(row ?? null);
    setForm({
      client_id: row?.client_id ?? "", aircraft: row?.aircraft ?? "", departure: row?.departure ?? "",
      destination: row?.destination ?? "", date: row?.date ? new Date(row.date).toISOString().slice(0, 16) : "",
      status: row?.status ?? "scheduled",
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, date: form.date || null };
    const op = editing?.id ? supabase.from("trips").update(payload).eq("id", editing.id) : supabase.from("trips").insert(payload);
    const { error } = await op;
    if (error) toast.error(error.message); else { toast.success(editing?.id ? "Updated" : "Created"); fetch(); setFormOpen(false); }
  };

  const handleDelete = async (row: any) => {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("trips").delete().eq("id", row.id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); fetch(); }
  };

  const inputClass = "w-full bg-secondary/50 rounded-lg px-3 py-2.5 text-[13px] text-foreground font-light focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all border border-border/20";
  const labelClass = "text-[9px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-1.5 block font-light";

  return (
    <>
      <CrmTable
        title="Trips"
        columns={[
          { key: "client", label: "Client", render: (r: any) => r.clients?.full_name ?? "—" },
          { key: "aircraft", label: "Aircraft" },
          { key: "departure", label: "From" },
          { key: "destination", label: "To" },
          { key: "date", label: "Date", render: (r: any) => r.date ? new Date(r.date).toLocaleDateString() : "—" },
          { key: "status", label: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
        ]}
        data={data}
        loading={loading}
        onAdd={() => openForm()}
        onEdit={openForm}
        onDelete={handleDelete}
      />
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-card border-border/30 max-w-md">
          <DialogHeader><DialogTitle className="font-display text-lg">{editing?.id ? "Edit" : "New"} Trip</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label className={labelClass}>Client</label>
              <select value={form.client_id} onChange={e => setForm(p => ({ ...p, client_id: e.target.value }))} className={inputClass}>
                <option value="">Select client...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
              </select>
            </div>
            <div><label className={labelClass}>Aircraft</label><input value={form.aircraft} onChange={e => setForm(p => ({ ...p, aircraft: e.target.value }))} className={inputClass} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>From</label><input value={form.departure} onChange={e => setForm(p => ({ ...p, departure: e.target.value }))} required className={inputClass} /></div>
              <div><label className={labelClass}>To</label><input value={form.destination} onChange={e => setForm(p => ({ ...p, destination: e.target.value }))} required className={inputClass} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>Date</label><input type="datetime-local" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className={inputClass} /></div>
              <div>
                <label className={labelClass}>Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className={inputClass}>
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(38,52%,50%,0.45)] transition-all duration-500">Save</button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TripsPage;
