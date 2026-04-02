import { useEffect, useState, useCallback } from "react";
import { crmInputClass, crmLabelClass, crmFilterClass } from "@/components/crm/crmStyles";
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
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSource, setFilterSource] = useState("all");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("leads").select("*, clients(full_name, email)").order("created_at", { ascending: false });
    if (filterStatus !== "all") query = query.eq("status", filterStatus as any);
    if (filterSource !== "all") query = query.eq("source", filterSource);
    const { data: rows } = await query;
    setData(rows ?? []);
    setLoading(false);
  }, [filterStatus, filterSource]);

  const fetchClients = useCallback(async () => {
    const { data: c } = await supabase.from("clients").select("id, full_name");
    setClients(c ?? []);
  }, []);

  useEffect(() => { load(); fetchClients(); }, [load, fetchClients]);

  const filteredData = search
    ? data.filter(r => {
        const name = r.clients?.full_name?.toLowerCase() || "";
        const email = r.clients?.email?.toLowerCase() || "";
        return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
      })
    : data;

  const uniqueSources = [...new Set(data.map(r => r.source).filter(Boolean))];

  const openForm = (row?: any) => {
    setEditing(row ?? null);
    setForm({ client_id: row?.client_id ?? "", status: row?.status ?? "new", source: row?.source ?? "" });
    setFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { client_id: form.client_id || null, status: form.status, source: form.source || null };
    const op = editing?.id ? supabase.from("leads").update(payload).eq("id", editing.id) : supabase.from("leads").insert(payload);
    const { error } = await op;
    if (error) toast.error(error.message); else { toast.success(editing?.id ? "Updated" : "Created"); load(); setFormOpen(false); }
  };

  const handleDelete = async (row: any) => {
    if (!confirm("Delete this lead?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", row.id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  const handleBulkAction = async (ids: string[], action: string) => {
    if (action === "delete") {
      if (!confirm(`Delete ${ids.length} leads?`)) return;
      const { error } = await supabase.from("leads").delete().in("id", ids);
      if (error) toast.error(error.message); else { toast.success(`${ids.length} leads deleted`); load(); }
    } else {
      const { error } = await supabase.from("leads").update({ status: action as LeadStatus }).in("id", ids);
      if (error) toast.error(error.message); else { toast.success(`${ids.length} leads updated to ${action}`); load(); }
    }
  };

  const inputClass = crmInputClass;
  const labelClass = crmLabelClass;
  const filterClass = crmFilterClass;

  return (
    <>
      <CrmTable
        title="Leads"
        columns={[
          { key: "client", label: "Client", render: (r: any) => (
            <div>
              <p className="font-medium">{r.clients?.full_name ?? "—"}</p>
              {r.clients?.email && <p className="text-[10px] text-muted-foreground/40">{r.clients.email}</p>}
            </div>
          )},
          { key: "status", label: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
          { key: "source", label: "Source" },
          { key: "created_at", label: "Created", render: (r: any) => new Date(r.created_at).toLocaleDateString() },
        ]}
        data={filteredData}
        loading={loading}
        onAdd={() => openForm()}
        onEdit={openForm}
        onDelete={handleDelete}
        onBulkAction={handleBulkAction}
        bulkActions={[
          ...STATUSES.map(s => ({ label: `Set ${s.replace(/_/g, " ")}`, value: s })),
          { label: "Delete", value: "delete" },
        ]}
        filterBar={
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className={`${filterClass} w-52`}
            />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={filterClass}>
              <option value="all">All Status</option>
              {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
            </select>
            <select value={filterSource} onChange={e => setFilterSource(e.target.value)} className={filterClass}>
              <option value="all">All Sources</option>
              {uniqueSources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        }
      />
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-card border-border/30 max-w-md">
          <DialogHeader><DialogTitle className="font-display text-lg">{editing?.id ? "Edit" : "New"} Lead</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div><label className={labelClass}>Client</label>
              <select value={form.client_id} onChange={e => setForm(p => ({ ...p, client_id: e.target.value }))} className={inputClass}>
                <option value="">Select client...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
              </select>
            </div>
            <div><label className={labelClass}>Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as LeadStatus }))} className={inputClass}>
                {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
              </select>
            </div>
            <div><label className={labelClass}>Source</label>
              <input value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))} placeholder="Website, referral, etc." className={inputClass} />
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,85%,58%,0.45)] transition-all duration-500">Save Lead</button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadsPage;
