import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { StatusBadge } from "@/components/crm/StatusBadge";
import { toast } from "sonner";
import {
  ArrowLeft, Plane, Users, Clock, MapPin, Utensils, Shield, CheckCircle,
  FileText, Send, Loader2, History, AlertCircle,
} from "lucide-react";

const OpsDetailPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { user, roles } = useAuth();
  const [trip, setTrip] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [briefNotes, setBriefNotes] = useState({ catering: "", permits: "", special: "", passenger_details: "" });

  const canManage = roles.includes("admin") || roles.includes("operations");

  const load = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    const { data } = await supabase
      .from("trips")
      .select("*, clients(full_name, email, phone, nationality), contracts(id, status, quotes(aircraft, price, operator, flight_requests(departure, destination, date, passengers, catering_request, special_requests, notes)))")
      .eq("id", tripId)
      .single();
    setTrip(data);

    const { data: logs } = await supabase
      .from("activity_log")
      .select("*")
      .eq("entity_id", tripId)
      .order("created_at", { ascending: false });
    setActivity(logs ?? []);
    setLoading(false);
  }, [tripId]);

  useEffect(() => { load(); }, [load]);

  const logActivity = async (action: string, notes?: string) => {
    await supabase.from("activity_log").insert({
      entity_type: "trip", entity_id: tripId!, action,
      action_by: user?.id, department: "operations", notes,
    });
  };

  const updateTripStatus = async (status: "scheduled" | "in_progress" | "completed" | "cancelled") => {
    setActionLoading(status);
    await supabase.from("trips").update({ status }).eq("id", tripId!);
    await logActivity(`status_${status}`, `Trip status changed to ${status}`);
    toast.success(`Trip marked as ${status.replace(/_/g, " ")}`);
    setActionLoading(null);
    load();
  };

  const handleSendBrief = async () => {
    setActionLoading("brief");
    const briefSummary = [
      briefNotes.passenger_details && `Passengers: ${briefNotes.passenger_details}`,
      briefNotes.catering && `Catering: ${briefNotes.catering}`,
      briefNotes.permits && `Permits: ${briefNotes.permits}`,
      briefNotes.special && `Special: ${briefNotes.special}`,
    ].filter(Boolean).join(" | ") || "Standard brief";

    await logActivity("flight_brief_sent", briefSummary);

    // Store brief metadata on the trip activity for retrieval
    await supabase.from("activity_log").insert({
      entity_type: "trip",
      entity_id: tripId!,
      action: "flight_brief_details",
      action_by: user?.id,
      department: "operations",
      metadata: briefNotes,
      notes: "Flight brief details stored",
    });

    toast.success("Flight brief logged and sent");
    setActionLoading(null);
    load();
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>;
  if (!trip) return <div className="text-center py-20 text-muted-foreground">Trip not found</div>;

  const client = trip.clients;
  const contract = trip.contracts;
  const quote = contract?.quotes;
  const fr = quote?.flight_requests;
  const briefSent = activity.some(a => a.action === "flight_brief_sent");

  const inputClass = "w-full bg-secondary/50 rounded-lg px-3 py-2.5 text-[13px] text-foreground font-light focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all border border-border/20";
  const labelClass = "text-[9px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-1.5 block font-light";

  return (
    <div className="space-y-6">
      <button onClick={() => navigate("/crm/trips")} className="flex items-center gap-2 text-[11px] text-muted-foreground/60 hover:text-foreground transition-colors">
        <ArrowLeft size={12} /> Back to Trips
      </button>

      {/* Header */}
      <div>
        <h1 className="font-display text-lg sm:text-xl mb-1 break-words">{trip.departure} → {trip.destination}</h1>
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground/60">
          {client && <span className="truncate max-w-[140px]">{client.full_name}</span>}
          <StatusBadge status={trip.status} />
          {trip.aircraft && <span className="truncate max-w-[100px]">{trip.aircraft}</span>}
          {trip.date && <span>{new Date(trip.date).toLocaleDateString()}</span>}
          {briefSent && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[8px] tracking-[0.15em] uppercase rounded-full">
              <CheckCircle size={8} /> Brief Sent
            </span>
          )}
        </div>
      </div>

      {/* Status Actions */}
      {canManage && (
        <div className="flex flex-wrap gap-2 p-4 rounded-xl border border-border/20 bg-card/50">
          <span className="text-[8px] tracking-[0.3em] uppercase text-muted-foreground/40 self-center mr-2">Status</span>
          {(["scheduled", "in_progress", "completed", "cancelled"] as const).map(s => (
            <button key={s} onClick={() => updateTripStatus(s)} disabled={trip.status === s || actionLoading !== null}
              className={`px-3 py-2 text-[9px] tracking-wider uppercase rounded-lg transition-all ${trip.status === s ? "bg-primary/20 text-primary" : "bg-secondary/50 text-foreground/60 hover:bg-secondary/80"} disabled:opacity-40`}>
              {s.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border/20 bg-card/50 p-5 space-y-3">
          <h3 className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground/40">Flight Details</h3>
          <div className="space-y-2 text-[12px]">
            <div className="flex justify-between"><span className="text-muted-foreground/60">Route</span><span>{trip.departure} → {trip.destination}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground/60">Date</span><span>{trip.date ? new Date(trip.date).toLocaleDateString() : "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground/60">Aircraft</span><span>{trip.aircraft || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground/60">Passengers</span><span>{fr?.passengers || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground/60">Operator</span><span>{quote?.operator || "—"}</span></div>
          </div>
        </div>

        <div className="rounded-xl border border-border/20 bg-card/50 p-5 space-y-3">
          <h3 className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground/40">Client</h3>
          <div className="space-y-2 text-[12px]">
            <div className="flex justify-between"><span className="text-muted-foreground/60">Name</span><span>{client?.full_name || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground/60">Email</span><span>{client?.email || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground/60">Phone</span><span>{client?.phone || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground/60">Nationality</span><span>{client?.nationality || "—"}</span></div>
          </div>
        </div>
      </div>

      {/* Flight Brief */}
      {canManage && (
        <div className="rounded-xl border border-border/20 bg-card/50 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <FileText size={12} className="text-primary/60" />
            <h3 className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground/40">Flight Brief</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Passenger Details</label>
              <textarea value={briefNotes.passenger_details} onChange={e => setBriefNotes(p => ({ ...p, passenger_details: e.target.value }))} className={inputClass} rows={2} placeholder="Names, passport numbers..." />
            </div>
            <div>
              <label className={labelClass}>Catering</label>
              <textarea value={briefNotes.catering} onChange={e => setBriefNotes(p => ({ ...p, catering: e.target.value }))} className={inputClass} rows={2} placeholder={fr?.catering_request || "No preference"} />
            </div>
            <div>
              <label className={labelClass}>Permits / Slots</label>
              <textarea value={briefNotes.permits} onChange={e => setBriefNotes(p => ({ ...p, permits: e.target.value }))} className={inputClass} rows={2} placeholder="Landing/overflight permits..." />
            </div>
            <div>
              <label className={labelClass}>Special Notes</label>
              <textarea value={briefNotes.special} onChange={e => setBriefNotes(p => ({ ...p, special: e.target.value }))} className={inputClass} rows={2} placeholder={fr?.special_requests || "None"} />
            </div>
          </div>
          <button onClick={handleSendBrief} disabled={actionLoading === "brief"} className="px-6 py-2.5 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.2em] uppercase font-medium rounded-lg hover:shadow-[0_0_20px_-6px_hsla(43,74%,49%,0.4)] transition-all disabled:opacity-40 flex items-center gap-2">
            {actionLoading === "brief" ? <Loader2 size={10} className="animate-spin" /> : <Send size={10} />}
            Log & Send Brief
          </button>
        </div>
      )}

      {/* Activity Timeline */}
      <div className="rounded-xl border border-border/20 bg-card/50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <History size={12} className="text-muted-foreground/40" />
          <h3 className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground/40">Activity Timeline</h3>
        </div>
        {activity.length === 0 ? (
          <p className="text-[11px] text-muted-foreground/40">No activity recorded yet</p>
        ) : (
          <div className="space-y-3">
            {activity.map(a => (
              <div key={a.id} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] text-foreground/80">{a.action.replace(/_/g, " ")}</p>
                  {a.notes && <p className="text-[10px] text-muted-foreground/50">{a.notes}</p>}
                  <p className="text-[9px] text-muted-foreground/30 mt-0.5">{new Date(a.created_at).toLocaleString()} · {a.department}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OpsDetailPage;
