import { useEffect, useState, useCallback } from "react";
import { crmInputClass, crmLabelClass, crmFilterClass, crmSelectClass } from "@/components/crm/crmStyles";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import CrmTable from "@/components/crm/CrmTable";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type TripStatus = Database["public"]["Enums"]["trip_status"];
const STATUSES: TripStatus[] = ["scheduled", "in_progress", "completed", "cancelled"];

const TripsPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [form, setForm] = useState({ client_id: "", aircraft: "", departure: "", destination: "", date: "", status: "scheduled" as TripStatus });
  const { roles } = useAuth();

  // Only Operations, Finance, and Admin can manage trips and see full supplier/operator details
  const canManage = roles.includes("admin") || roles.includes("operations");
  const canSeeSupplierDetails = roles.includes("admin") || roles.includes("operations") || roles.includes("finance");

  const load = useCallback(async () => {
    setLoading(true);
    const { data: rows } = await supabase.from("trips").select("*, clients(full_name)").order("created_at", { ascending: false });
    setData(rows ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    supabase.from("clients").select("id, full_name").then(({ data: c }) => setClients(c ?? []));
  }, [load]);

  const openForm = (row?: any) => {
    if (!canManage) { toast.error("Only Operations can manage trips"); return; }
    setEditing(row ?? null);
    setForm({
      client_id: row?.client_id ?? "", aircraft: row?.aircraft ?? "", departure: row?.departure ?? "",
      destination: row?.destination ?? "", date: row?.date ? new Date(row.date).toISOString().slice(0, 16) : "",
      status: (row?.status ?? "scheduled") as TripStatus,
    });
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;
    const payload = { client_id: form.client_id || null, aircraft: form.aircraft || null, departure: form.departure, destination: form.destination, date: form.date || null, status: form.status };
    const op = editing?.id ? supabase.from("trips").update(payload).eq("id", editing.id) : supabase.from("trips").insert(payload);
    const { error } = await op;
    if (error) toast.error(error.message); else { toast.success(editing?.id ? "Updated" : "Created"); load(); setFormOpen(false); }
  };

  const handleDelete = async (row: any) => {
    if (!canManage) { toast.error("Only Operations can delete trips"); return; }
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("trips").delete().eq("id", row.id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  const inputClass = crmInputClass;
  const labelClass = crmLabelClass;

  // Build columns — Sales/Account Mgmt see limited view (no aircraft/operator details)
  const columns = [
    { key: "client", label: "Client", render: (r: any) => r.clients?.full_name ?? "—" },
    ...(canSeeSupplierDetails
      ? [{ key: "aircraft", label: "Aircraft" }]
      : [{ key: "aircraft_summary", label: "Aircraft", render: (r: any) => r.aircraft ? "Assigned" : "Pending" }]),
    { key: "departure", label: "From" }, { key: "destination", label: "To" },
    { key: "date", label: "Date", render: (r: any) => r.date ? new Date(r.date).toLocaleDateString() : "—" },
    { key: "status", label: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
  ];

  return (
    <>
      <CrmTable title="Trips"
        columns={columns}
        data={data} loading={loading}
        onAdd={canManage ? () => openForm() : undefined}
        onEdit={canManage ? openForm : undefined}
        onDelete={canManage ? handleDelete : undefined}
        onRowClick={(row: any) => navigate(`/crm/trips/${row.id}`)}
      />
      {!canManage && (
        <p className="text-[10px] text-muted-foreground/30 font-light mt-2 text-center">
          Trip management is handled by Operations. Contact Operations for changes.
        </p>
      )}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-card border-border/30 max-w-md">
          <DialogHeader><DialogTitle className="font-display text-lg">{editing?.id ? "Edit" : "New"} Trip</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div><label className={labelClass}>Client</label>
              <select value={form.client_id} onChange={e => setForm(p => ({ ...p, client_id: e.target.value }))} className={crmSelectClass}>
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
              <div><label className={labelClass}>Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as TripStatus }))} className={crmSelectClass}>
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,85%,58%,0.45)] transition-all duration-500">Save</button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TripsPage;
