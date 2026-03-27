import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  ArrowLeft, Star, MapPin, Phone, Mail, Building2, Plane, FileText,
  Heart, Clock, MessageSquare, RefreshCw, CreditCard,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const AccountMgmtDetailPage = () => {
  const { clientId } = useParams();
  const [client, setClient] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [concierge, setConcierge] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "history" | "notes" | "concierge" | "timeline">("overview");
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    if (!clientId) return;
    const load = async () => {
      const cRes = await supabase.from("clients").select("*").eq("id", clientId).single();
      const userId = cRes.data?.user_id ?? "00000000-0000-0000-0000-000000000000";
      const [tRes, rRes, qRes, refRes, conRes, actRes] = await Promise.all([
        supabase.from("trips").select("*").eq("client_id", clientId).order("date", { ascending: false }),
        supabase.from("flight_requests").select("*").eq("client_id", clientId).order("created_at", { ascending: false }),
        supabase.from("quotes").select("*, flight_requests!inner(client_id)").eq("flight_requests.client_id", clientId).order("created_at", { ascending: false }),
        supabase.from("referrals").select("*").eq("referrer_id", clientId).order("created_at", { ascending: false }),
        supabase.from("concierge_preferences").select("*").eq("user_id", userId).maybeSingle(),
        supabase.from("activity_log").select("*").eq("entity_id", clientId).order("created_at", { ascending: false }).limit(30),
      ]);
      setClient(cRes.data);
      setTrips(tRes.data ?? []);
      setRequests(rRes.data ?? []);
      setQuotes(qRes.data ?? []);
      setReferrals(refRes.data ?? []);
      setConcierge(conRes.data);
      setActivity(actRes.data ?? []);
      setLoading(false);
    };
    load();
  }, [clientId]);

  const addNote = async () => {
    if (!noteText.trim() || !clientId) return;
    const { error } = await supabase.from("activity_log").insert({
      entity_type: "client",
      entity_id: clientId,
      action: "note_added",
      department: "account_management",
      notes: noteText,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Note added");
      setNoteOpen(false);
      setNoteText("");
      const { data } = await supabase.from("activity_log").select("*").eq("entity_id", clientId).order("created_at", { ascending: false }).limit(30);
      setActivity(data ?? []);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-5 h-5 border border-primary/30 border-t-primary rounded-full animate-spin" /></div>;
  }

  if (!client) {
    return <div className="text-center py-20"><p className="text-[13px] text-muted-foreground/40">Client not found</p></div>;
  }

  const completedTrips = trips.filter(t => t.status === "completed").length;
  const totalRequests = requests.length;

  const tabs = [
    { key: "overview" as const, label: "Overview" },
    { key: "history" as const, label: "Booking History" },
    { key: "concierge" as const, label: "Concierge" },
    { key: "notes" as const, label: "Notes" },
    { key: "timeline" as const, label: "Timeline" },
  ];

  const statusColor = (s: string) => {
    const m: Record<string, string> = {
      completed: "bg-emerald-500/20 text-emerald-400",
      scheduled: "bg-blue-500/20 text-blue-400",
      in_progress: "bg-primary/20 text-primary",
      cancelled: "bg-destructive/20 text-destructive",
      pending: "bg-amber-500/20 text-amber-400",
      confirmed: "bg-emerald-500/20 text-emerald-400",
    };
    return m[s] || "bg-secondary text-muted-foreground";
  };

  const inputClass = "w-full bg-secondary/50 rounded-lg px-3 py-2.5 text-[13px] text-foreground font-light focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all border border-border/20";

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link to="/crm/account-mgmt" className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-muted-foreground/40 hover:text-foreground transition-colors mb-4">
          <ArrowLeft size={12} strokeWidth={1.5} /> Back to Portfolio
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-display font-semibold">{client.full_name}</h1>
              {client.client_type && (
                <span className="text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full font-medium bg-primary/20 text-primary">
                  {client.client_type.replace(/_/g, " ")}
                </span>
              )}
              {client.membership_tier && (
                <span className="text-[9px] tracking-[0.1em] uppercase text-amber-400 flex items-center gap-1">
                  <Star size={10} /> {client.membership_tier.replace(/_/g, " ")}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground/40 font-light">
              {client.email && <span className="flex items-center gap-1"><Mail size={10} /> {client.email}</span>}
              {client.phone && <span className="flex items-center gap-1"><Phone size={10} /> {client.phone}</span>}
              {(client.city || client.country) && <span className="flex items-center gap-1"><MapPin size={10} /> {[client.city, client.country].filter(Boolean).join(", ")}</span>}
              {client.company && <span className="flex items-center gap-1"><Building2 size={10} /> {client.company}</span>}
            </div>
          </div>
          <button onClick={() => setNoteOpen(true)}
            className="px-3 py-2 rounded-lg border border-border/20 text-[10px] tracking-[0.1em] uppercase text-muted-foreground/40 hover:text-foreground hover:border-primary/30 transition-all flex items-center gap-1.5">
            <MessageSquare size={12} strokeWidth={1.5} /> Add Note
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: "Completed Trips", value: completedTrips, icon: Plane },
          { label: "Total Requests", value: totalRequests, icon: FileText },
          { label: "Quotes", value: quotes.length, icon: FileText },
          { label: "Referrals", value: referrals.length, icon: Heart },
          { label: "Credit", value: `$${Number(client.credit_balance ?? 0).toLocaleString()}`, icon: CreditCard },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="rounded-xl border border-border/20 bg-card/50 p-3">
            <s.icon className="w-4 h-4 text-muted-foreground/30 mb-2" strokeWidth={1.5} />
            <p className="text-[16px] font-display font-semibold">{s.value}</p>
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

      {/* Tab Content */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border/20 bg-card/50 p-5">
            <h3 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light mb-3">Client Details</h3>
            <div className="space-y-2 text-[12px]">
              {[
                ["Name", client.full_name],
                ["Email", client.email],
                ["Phone", client.phone],
                ["WhatsApp", client.whatsapp],
                ["Company", client.company],
                ["Nationality", client.nationality],
                ["Language", client.preferred_language],
                ["Contact Pref", client.preferred_contact_method],
                ["Member Since", client.created_at ? new Date(client.created_at).toLocaleDateString() : "—"],
                ["Profile", `${client.profile_completeness ?? 0}% complete`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1 border-b border-border/5">
                  <span className="text-muted-foreground/40 font-light">{k}</span>
                  <span className="font-light">{v || "—"}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border/20 bg-card/50 p-5">
            <h3 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light mb-3">Membership & Credits</h3>
            <div className="space-y-2 text-[12px]">
              {[
                ["Status", client.member_status || "—"],
                ["Tier", client.membership_tier?.replace(/_/g, " ") || "—"],
                ["Invitation", client.invitation_status || "—"],
                ["Credit Balance", `$${Number(client.credit_balance ?? 0).toLocaleString()}`],
                ["Referral Status", client.referral_status || "—"],
                ["Verification", client.verification_status || "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1 border-b border-border/5">
                  <span className="text-muted-foreground/40 font-light">{k}</span>
                  <span className="font-light">{v}</span>
                </div>
              ))}
            </div>
            {client.notes && (
              <div className="mt-4 p-3 rounded-lg bg-secondary/30">
                <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground/40 mb-1">Internal Notes</p>
                <p className="text-[12px] text-muted-foreground/60 font-light">{client.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-4">
          {/* Trips */}
          <div className="rounded-xl border border-border/20 bg-card/50 p-5">
            <h3 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light mb-3">Trips ({trips.length})</h3>
            {trips.length === 0 ? <p className="text-[11px] text-muted-foreground/30">No trips</p> : (
              <div className="space-y-2">
                {trips.map((t, i) => (
                  <motion.div key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between py-2 border-b border-border/5">
                    <div className="flex items-center gap-3">
                      <Plane size={12} className="text-muted-foreground/30" strokeWidth={1.5} />
                      <span className="text-[12px] font-light">{t.departure} → {t.destination}</span>
                      {t.aircraft && <span className="text-[10px] text-muted-foreground/30">{t.aircraft}</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-muted-foreground/30">{t.date ? new Date(t.date).toLocaleDateString() : "—"}</span>
                      <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full font-medium ${statusColor(t.status)}`}>{t.status}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Requests */}
          <div className="rounded-xl border border-border/20 bg-card/50 p-5">
            <h3 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light mb-3">Flight Requests ({requests.length})</h3>
            {requests.length === 0 ? <p className="text-[11px] text-muted-foreground/30">No requests</p> : (
              <div className="space-y-2">
                {requests.slice(0, 10).map((r, i) => (
                  <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between py-2 border-b border-border/5">
                    <div>
                      <span className="text-[12px] font-light">{r.departure} → {r.destination}</span>
                      <span className="text-[10px] text-muted-foreground/30 ml-2">{r.passengers} pax</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-muted-foreground/30">{r.date ? new Date(r.date).toLocaleDateString() : "—"}</span>
                      <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full font-medium ${statusColor(r.status)}`}>{r.status}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Quotes */}
          <div className="rounded-xl border border-border/20 bg-card/50 p-5">
            <h3 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light mb-3">Quote History ({quotes.length})</h3>
            {quotes.length === 0 ? <p className="text-[11px] text-muted-foreground/30">No quotes</p> : (
              <div className="space-y-2">
                {quotes.map((q, i) => (
                  <motion.div key={q.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between py-2 border-b border-border/5">
                    <div>
                      {q.aircraft && <span className="text-[12px] font-light">{q.aircraft}</span>}
                      {q.price && <span className="text-[12px] font-medium ml-2">${Number(q.price).toLocaleString()}</span>}
                    </div>
                    <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full font-medium ${statusColor(q.status)}`}>{q.status}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "concierge" && (
        <div className="rounded-xl border border-border/20 bg-card/50 p-5">
          <h3 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light mb-3">Concierge Preferences</h3>
          {!concierge ? (
            <p className="text-[11px] text-muted-foreground/30">No concierge preferences recorded</p>
          ) : (
            <div className="space-y-2 text-[12px]">
              {[
                ["Chauffeur", concierge.chauffeur ? "Yes" : "No"],
                ["Security Escort", concierge.security_escort ? "Yes" : "No"],
                ["Hotel Preferences", concierge.hotel_preferences],
                ["Special Assistance", concierge.special_assistance],
                ["Notes", concierge.notes],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-1 border-b border-border/5">
                  <span className="text-muted-foreground/40 font-light">{k}</span>
                  <span className="font-light">{v || "—"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "notes" && (
        <div className="rounded-xl border border-border/20 bg-card/50 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light">Relationship Notes</h3>
            <button onClick={() => setNoteOpen(true)}
              className="text-[9px] tracking-[0.1em] uppercase text-primary/60 hover:text-primary transition-colors">+ Add Note</button>
          </div>
          {activity.filter(a => a.action === "note_added").length === 0 ? (
            <p className="text-[11px] text-muted-foreground/30">No notes yet</p>
          ) : (
            <div className="space-y-3">
              {activity.filter(a => a.action === "note_added").map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="p-3 rounded-lg bg-secondary/30 border border-border/10">
                  <p className="text-[12px] font-light text-foreground/80">{a.notes}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[9px] text-muted-foreground/30">{new Date(a.created_at).toLocaleString()}</span>
                    {a.department && <span className="text-[8px] tracking-[0.1em] uppercase text-muted-foreground/20">{a.department}</span>}
                  </div>
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
            <p className="text-[11px] text-muted-foreground/30">No activity recorded</p>
          ) : (
            <div className="space-y-2">
              {activity.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                  className="flex items-start gap-3 py-2 border-b border-border/5">
                  <Clock size={12} className="text-muted-foreground/20 mt-0.5 shrink-0" strokeWidth={1.5} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-light">
                      <span className="font-medium">{a.action.replace(/_/g, " ")}</span>
                      {a.notes && <span className="text-muted-foreground/50"> — {a.notes}</span>}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[9px] text-muted-foreground/30">{new Date(a.created_at).toLocaleString()}</span>
                      {a.department && <span className="text-[8px] tracking-[0.1em] uppercase px-1.5 py-0.5 rounded bg-secondary text-muted-foreground/30">{a.department}</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Note Dialog */}
      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent className="bg-card border-border/30 max-w-md">
          <DialogHeader><DialogTitle className="font-display text-lg">Add Relationship Note</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={4} placeholder="Enter note…"
              className={inputClass} />
            <button onClick={addNote}
              className="w-full py-3 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,85%,58%,0.45)] transition-all duration-500">
              Save Note
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountMgmtDetailPage;
