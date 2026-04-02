import { useEffect, useState, useCallback } from "react";
import { crmInputClass, crmLabelClass, crmFilterClass, crmSelectClass } from "@/components/crm/crmStyles";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import CrmTable from "@/components/crm/CrmTable";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";

const STATUSES = ["draft", "requested", "pending", "accepted", "rejected", "expired"] as const;
type OpReqStatus = typeof STATUSES[number];

const OperatorRequestsPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const { user } = useAuth();

  const [form, setForm] = useState({
    request_id: "", operator_name: "", aircraft_type: "", aircraft_identifier: "",
    status: "draft" as OpReqStatus, offered_price: "", offered_currency: "USD", notes: "",
    response_expiry: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    const { data: rows } = await supabase
      .from("operator_requests")
      .select("*, flight_requests(departure, destination, contact_name)")
      .order("created_at", { ascending: false });
    setData(rows ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    supabase.from("flight_requests").select("id, departure, destination").order("created_at", { ascending: false }).limit(100)
      .then(({ data: r }) => setRequests(r ?? []));
  }, [load]);

  const openForm = (row?: any) => {
    setEditing(row ?? null);
    setForm({
      request_id: row?.request_id ?? "",
      operator_name: row?.operator_name ?? "",
      aircraft_type: row?.aircraft_type ?? "",
      aircraft_identifier: row?.aircraft_identifier ?? "",
      status: (row?.status ?? "draft") as OpReqStatus,
      offered_price: row?.offered_price?.toString() ?? "",
      offered_currency: row?.offered_currency ?? "USD",
      notes: row?.notes ?? "",
      response_expiry: row?.response_expiry ? new Date(row.response_expiry).toISOString().slice(0, 10) : "",
    });
    setFormOpen(true);
  };

  const logActivity = async (entityId: string, action: string, notes?: string) => {
    await supabase.from("activity_log").insert({
      entity_type: "operator_request",
      entity_id: entityId,
      action,
      action_by: user?.id,
      department: "sales",
      notes,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const payload: any = {
      request_id: form.request_id || null,
      operator_name: form.operator_name,
      aircraft_type: form.aircraft_type || null,
      aircraft_identifier: form.aircraft_identifier || null,
      status: form.status,
      offered_price: form.offered_price ? parseFloat(form.offered_price) : null,
      offered_currency: form.offered_currency,
      notes: form.notes || null,
      response_expiry: form.response_expiry || null,
      updated_at: now,
    };

    if (!editing?.id) {
      payload.created_by = user?.id;
      if (form.status === "requested") payload.requested_at = now;
    } else {
      if (form.status === "requested" && editing.status !== "requested") payload.requested_at = now;
      if (["accepted", "rejected"].includes(form.status) && !["accepted", "rejected"].includes(editing.status)) payload.responded_at = now;
    }

    const op = editing?.id
      ? supabase.from("operator_requests").update(payload).eq("id", editing.id)
      : supabase.from("operator_requests").insert(payload).select("id").single();
    const { data: result, error } = await op;
    if (error) { toast.error(error.message); return; }

    // Log activity on status changes
    const entityId = editing?.id || (result as any)?.id;
    if (entityId) {
      if (!editing?.id) {
        await logActivity(entityId, "operator_request_created", `Request to ${form.operator_name} for ${form.aircraft_type || "aircraft"}`);
      } else if (form.status !== editing.status) {
        await logActivity(entityId, `status_${form.status}`, `Status changed from ${editing.status} to ${form.status}`);
      }
    }

    toast.success(editing?.id ? "Updated" : "Created");
    load();
    setFormOpen(false);
  };

  const handleDelete = async (row: any) => {
    if (!confirm("Delete this operator request?")) return;
    const { error } = await supabase.from("operator_requests").delete().eq("id", row.id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  const handleConvertToQuote = async (row: any) => {
    if (!row.request_id || !row.offered_price) { toast.error("Need request and price to create quote"); return; }
    setConvertingId(row.id);

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 7);

    const { data: quote, error } = await supabase.from("quotes").insert({
      request_id: row.request_id,
      aircraft: row.aircraft_type,
      operator: row.operator_name,
      price: row.offered_price,
      valid_until: validUntil.toISOString(),
      status: "draft",
      created_by: user?.id,
    }).select("id").single();

    if (error) { toast.error(error.message); setConvertingId(null); return; }

    // Link quote back and update operator request status
    await supabase.from("operator_requests").update({
      status: "accepted",
      responded_at: new Date().toISOString(),
      quote_id: quote.id,
    }).eq("id", row.id);

    // Log activity on both entities
    await logActivity(row.id, "converted_to_quote", `Quote ${quote.id.slice(0, 8)} created from operator offer`);
    await supabase.from("activity_log").insert({
      entity_type: "quote",
      entity_id: quote.id,
      action: "quote_created_from_operator",
      action_by: user?.id,
      department: "sales",
      notes: `Created from ${row.operator_name} offer: ${row.offered_currency} ${Number(row.offered_price).toLocaleString()}`,
    });

    toast.success("Quote created from operator offer");
    setConvertingId(null);
    load();
  };

  const inputClass = crmInputClass;
  const labelClass = crmLabelClass;
  const selectClass = crmSelectClass;

  const columns = [
    { key: "route", label: "Route", render: (r: any) => r.flight_requests ? `${r.flight_requests.departure} → ${r.flight_requests.destination}` : "—" },
    { key: "operator_name", label: "Operator" },
    { key: "aircraft_type", label: "Aircraft" },
    { key: "offered_price", label: "Price", render: (r: any) => r.offered_price ? `${r.offered_currency || "$"} ${Number(r.offered_price).toLocaleString()}` : "—" },
    { key: "status", label: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
    { key: "response_expiry", label: "Expires", render: (r: any) => r.response_expiry ? new Date(r.response_expiry).toLocaleDateString() : "—" },
    {
      key: "actions", label: "", render: (r: any) => r.status === "accepted" || r.status === "pending" ? (
        <button
          onClick={(e) => { e.stopPropagation(); handleConvertToQuote(r); }}
          disabled={convertingId === r.id}
          className="px-3 py-1.5 bg-primary/10 text-primary text-[8px] tracking-[0.15em] uppercase font-medium rounded-md hover:bg-primary/20 transition-all flex items-center gap-1"
        >
          {convertingId === r.id ? <Loader2 size={8} className="animate-spin" /> : <ArrowRight size={8} />}
          Create Quote
        </button>
      ) : null,
    },
  ];

  return (
    <div className="space-y-6">
      <CrmTable
        title="Operator Requests"
        columns={columns}
        data={data}
        loading={loading}
        onAdd={() => openForm()}
        onEdit={openForm}
        onDelete={handleDelete}
      />
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-card border-border/30 max-w-md">
          <DialogHeader><DialogTitle className="font-display text-lg">{editing?.id ? "Edit" : "New"} Operator Request</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label className={labelClass}>Flight Request</label>
              <select value={form.request_id} onChange={e => setForm(p => ({ ...p, request_id: e.target.value }))} className={selectClass}>
                <option value="">Select request...</option>
                {requests.map(r => <option key={r.id} value={r.id}>{r.departure} → {r.destination}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Operator Name</label>
              <input value={form.operator_name} onChange={e => setForm(p => ({ ...p, operator_name: e.target.value }))} required className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Aircraft Type</label>
                <input value={form.aircraft_type} onChange={e => setForm(p => ({ ...p, aircraft_type: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Aircraft ID (internal)</label>
                <input value={form.aircraft_identifier} onChange={e => setForm(p => ({ ...p, aircraft_identifier: e.target.value }))} className={inputClass} placeholder="Tail / reg" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Offered Price</label>
                <input type="number" step="0.01" value={form.offered_price} onChange={e => setForm(p => ({ ...p, offered_price: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Currency</label>
                <select value={form.offered_currency} onChange={e => setForm(p => ({ ...p, offered_currency: e.target.value }))} className={inputClass}>
                  {["USD", "EUR", "GBP", "AED", "CHF"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Expiry</label>
                <input type="date" value={form.response_expiry} onChange={e => setForm(p => ({ ...p, response_expiry: e.target.value }))} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as OpReqStatus }))} className={inputClass}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Notes</label>
              <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className={inputClass} rows={2} />
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,85%,58%,0.45)] transition-all duration-500">Save</button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OperatorRequestsPage;
