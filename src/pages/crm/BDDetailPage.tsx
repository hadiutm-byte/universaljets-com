import { useEffect, useState } from "react";
import { crmInputClass, crmLabelClass, crmSelectClass, crmFilterClass } from "@/components/crm/crmStyles";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  ArrowLeft, Building2, Globe, Mail, Phone, Calendar, Clock,
  ArrowRight, MessageSquare, Handshake,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const STATUSES = [
  "prospecting", "outreach", "meeting_scheduled", "meeting_done",
  "negotiation", "qualified", "handed_to_sales", "won", "lost", "on_hold",
] as const;

const BDDetailPage = () => {
  const { oppId } = useParams();
  const [opp, setOpp] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "meetings" | "timeline">("overview");
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const load = async () => {
    if (!oppId) return;
    const [oppRes, actRes] = await Promise.all([
      supabase.from("bd_opportunities").select("*").eq("id", oppId).single(),
      supabase.from("activity_log").select("*").eq("entity_id", oppId).order("created_at", { ascending: false }).limit(50),
    ]);
    setOpp(oppRes.data);
    setActivity(actRes.data ?? []);
    setNewStatus(oppRes.data?.status ?? "");
    setLoading(false);
  };

  useEffect(() => { load(); }, [oppId]);

  const updateStatus = async () => {
    if (!oppId || !newStatus) return;
    const updates: any = { status: newStatus, updated_at: new Date().toISOString() };
    if (newStatus === "handed_to_sales") updates.handed_to_sales_at = new Date().toISOString();
    const { error } = await supabase.from("bd_opportunities").update(updates).eq("id", oppId);
    if (error) toast.error(error.message);
    else {
      await supabase.from("activity_log").insert({
        entity_type: "bd_opportunity", entity_id: oppId,
        action: "status_changed", department: "business_development",
        notes: `Status changed to ${newStatus.replace(/_/g, " ")}`,
        previous_value: JSON.stringify({ status: opp.status }),
        new_value: JSON.stringify({ status: newStatus }),
      });
      toast.success("Status updated");
      setStatusOpen(false);
      load();
    }
  };

  const addNote = async () => {
    if (!noteText.trim() || !oppId) return;
    const isMeeting = tab === "meetings";
    if (isMeeting) {
      await supabase.from("bd_opportunities").update({
        meeting_notes: [opp.meeting_notes, `[${new Date().toLocaleDateString()}] ${noteText}`].filter(Boolean).join("\n\n"),
        last_contact_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).eq("id", oppId);
    }
    await supabase.from("activity_log").insert({
      entity_type: "bd_opportunity", entity_id: oppId,
      action: isMeeting ? "meeting_logged" : "note_added",
      department: "business_development", notes: noteText,
    });
    toast.success(isMeeting ? "Meeting logged" : "Note added");
    setNoteOpen(false);
    setNoteText("");
    load();
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-5 h-5 border border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  if (!opp) return <div className="text-center py-20"><p className="text-[13px] text-muted-foreground/40">Opportunity not found</p></div>;

  const statusColor = (s: string) => {
    const m: Record<string, string> = {
      prospecting: "bg-secondary text-muted-foreground", outreach: "bg-blue-500/20 text-blue-400",
      meeting_scheduled: "bg-amber-500/20 text-amber-400", meeting_done: "bg-primary/20 text-primary",
      negotiation: "bg-purple-500/20 text-purple-400", qualified: "bg-emerald-500/20 text-emerald-400",
      handed_to_sales: "bg-emerald-500/20 text-emerald-300", won: "bg-emerald-600/20 text-emerald-400",
      lost: "bg-destructive/20 text-destructive", on_hold: "bg-muted text-muted-foreground",
    };
    return m[s] || "bg-secondary text-muted-foreground";
  };

  const inputClass = crmInputClass;

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "meetings" as const, label: "Meetings & Notes" },
    { key: "timeline" as const, label: "Timeline" },
  ];

  return (
    <div>
      {/* Header */}
      <Link to="/crm/bd" className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-muted-foreground/40 hover:text-foreground transition-colors mb-4">
        <ArrowLeft size={12} strokeWidth={1.5} /> Back to BD
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-display font-semibold">{opp.name}</h1>
            <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full font-medium ${statusColor(opp.status)}`}>
              {opp.status.replace(/_/g, " ")}
            </span>
            <span className="text-[9px] tracking-[0.1em] uppercase text-muted-foreground/30 px-1.5 py-0.5 rounded bg-secondary/50">
              {opp.opportunity_type.replace(/_/g, " ")}
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground/40 font-light">
            {opp.company_name && <span className="flex items-center gap-1"><Building2 size={10} /> {opp.company_name}</span>}
            {opp.contact_name && <span>{opp.contact_name}</span>}
            {opp.market && <span className="flex items-center gap-1"><Globe size={10} /> {opp.market}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setStatusOpen(true)}
            className="px-3 py-2 rounded-lg border border-border/20 text-[10px] tracking-[0.1em] uppercase text-muted-foreground/40 hover:text-foreground hover:border-primary/30 transition-all">
            Update Status
          </button>
          <button onClick={() => setNoteOpen(true)}
            className="px-3 py-2 rounded-lg border border-border/20 text-[10px] tracking-[0.1em] uppercase text-muted-foreground/40 hover:text-foreground hover:border-primary/30 transition-all flex items-center gap-1.5">
            <MessageSquare size={12} strokeWidth={1.5} /> Add Note
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Est. Value", value: `$${Number(opp.estimated_value || 0).toLocaleString()}` },
          { label: "Last Contact", value: opp.last_contact_date ? new Date(opp.last_contact_date).toLocaleDateString() : "—" },
          { label: "Next Follow-up", value: opp.next_follow_up ? new Date(opp.next_follow_up).toLocaleDateString() : "—" },
          { label: "Created", value: new Date(opp.created_at).toLocaleDateString() },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="rounded-xl border border-border/20 bg-card/50 p-3">
            <p className="text-[14px] font-display font-semibold">{s.value}</p>
            <p className="text-[8px] tracking-[0.15em] uppercase text-muted-foreground/40 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b border-border/10 pb-px">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-[10px] tracking-[0.1em] uppercase font-medium transition-all border-b-2 -mb-px ${
              tab === t.key ? "border-primary text-foreground" : "border-transparent text-muted-foreground/40 hover:text-foreground"
            }`}>{t.label}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border/20 bg-card/50 p-5">
            <h3 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light mb-3">Opportunity Details</h3>
            <div className="space-y-2 text-[12px]">
              {[
                ["Name", opp.name],
                ["Type", opp.opportunity_type?.replace(/_/g, " ")],
                ["Company", opp.company_name],
                ["Market", opp.market],
                ["Sector", opp.sector],
                ["Source", opp.source],
                ["Est. Value", opp.estimated_value ? `$${Number(opp.estimated_value).toLocaleString()}` : "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1 border-b border-border/5">
                  <span className="text-muted-foreground/40 font-light">{k}</span>
                  <span className="font-light">{v || "—"}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border/20 bg-card/50 p-5">
            <h3 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light mb-3">Contact</h3>
            <div className="space-y-2 text-[12px]">
              {[
                ["Name", opp.contact_name],
                ["Email", opp.contact_email],
                ["Phone", opp.contact_phone],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1 border-b border-border/5">
                  <span className="text-muted-foreground/40 font-light">{k}</span>
                  <span className="font-light">{v || "—"}</span>
                </div>
              ))}
            </div>
            {opp.notes && (
              <div className="mt-4 p-3 rounded-lg bg-secondary/30">
                <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/40 mb-1">Notes</p>
                <p className="text-[12px] text-muted-foreground/60 font-light whitespace-pre-wrap">{opp.notes}</p>
              </div>
            )}
          </div>

          {opp.status === "handed_to_sales" && opp.handed_to_sales_at && (
            <div className="md:col-span-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center gap-3">
              <ArrowRight className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
              <div>
                <p className="text-[12px] font-medium text-emerald-400">Handed to Sales</p>
                <p className="text-[10px] text-muted-foreground/40">{new Date(opp.handed_to_sales_at).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "meetings" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light">Meeting Notes & Follow-ups</h3>
            <button onClick={() => setNoteOpen(true)}
              className="text-[9px] tracking-[0.1em] uppercase text-primary/60 hover:text-primary transition-colors">+ Log Meeting</button>
          </div>
          {opp.meeting_notes ? (
            <div className="rounded-xl border border-border/20 bg-card/50 p-5">
              <p className="text-[12px] font-light whitespace-pre-wrap text-foreground/80">{opp.meeting_notes}</p>
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground/30 py-10 text-center">No meetings logged yet</p>
          )}
          {activity.filter(a => a.action === "meeting_logged").length > 0 && (
            <div className="rounded-xl border border-border/20 bg-card/50 p-5">
              <h4 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light mb-3">Meeting Log</h4>
              {activity.filter(a => a.action === "meeting_logged").map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="p-3 rounded-lg bg-secondary/30 border border-border/10 mb-2">
                  <p className="text-[12px] font-light">{a.notes}</p>
                  <span className="text-[9px] text-muted-foreground/30">{new Date(a.created_at).toLocaleString()}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "timeline" && (
        <div className="rounded-xl border border-border/20 bg-card/50 p-5">
          <h3 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light mb-3">Activity Timeline</h3>
          {activity.length === 0 ? (
            <p className="text-[11px] text-muted-foreground/30">No activity</p>
          ) : (
            <div className="space-y-2">
              {activity.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="flex items-start gap-3 py-2 border-b border-border/5">
                  <Clock size={12} className="text-muted-foreground/20 mt-0.5 shrink-0" strokeWidth={1.5} />
                  <div className="flex-1">
                    <p className="text-[12px] font-light">
                      <span className="font-medium">{a.action.replace(/_/g, " ")}</span>
                      {a.notes && <span className="text-muted-foreground/50"> — {a.notes}</span>}
                    </p>
                    <span className="text-[9px] text-muted-foreground/30">{new Date(a.created_at).toLocaleString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Status Update Dialog */}
      <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
        <DialogContent className="bg-card border-border/30 max-w-sm">
          <DialogHeader><DialogTitle className="font-display text-lg">Update Status</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className={inputClass}>
              {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
            </select>
            {newStatus === "handed_to_sales" && (
              <p className="text-[11px] text-amber-400/80 font-light">This will mark the opportunity as handed to Sales and record the timestamp.</p>
            )}
            <button onClick={updateStatus}
              className="w-full py-3 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,85%,58%,0.45)] transition-all duration-500">
              Update
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent className="bg-card border-border/30 max-w-md">
          <DialogHeader><DialogTitle className="font-display text-lg">{tab === "meetings" ? "Log Meeting" : "Add Note"}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={4} placeholder={tab === "meetings" ? "Meeting notes…" : "Note…"} className={inputClass} />
            <button onClick={addNote}
              className="w-full py-3 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,85%,58%,0.45)] transition-all duration-500">
              Save
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BDDetailPage;
