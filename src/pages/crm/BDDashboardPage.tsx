import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Briefcase, Plus, Search, Globe, Building2, Users, Handshake,
  ArrowRight, Calendar, Filter,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const OPP_TYPES = [
  "partnership", "corporate", "family_office", "vip_network",
  "channel_partner", "referral_partner", "investor", "strategic",
] as const;

const STATUSES = [
  "prospecting", "outreach", "meeting_scheduled", "meeting_done",
  "negotiation", "qualified", "handed_to_sales", "won", "lost", "on_hold",
] as const;

const BDDashboardPage = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", company_name: "", contact_name: "", contact_email: "", contact_phone: "",
    opportunity_type: "partnership", status: "prospecting", market: "", sector: "",
    estimated_value: "", source: "", notes: "",
  });

  const load = async () => {
    const { data } = await supabase
      .from("bd_opportunities")
      .select("*")
      .order("updated_at", { ascending: false });
    setOpportunities(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("bd_opportunities").insert({
      name: form.name,
      company_name: form.company_name || null,
      contact_name: form.contact_name || null,
      contact_email: form.contact_email || null,
      contact_phone: form.contact_phone || null,
      opportunity_type: form.opportunity_type,
      status: form.status,
      market: form.market || null,
      sector: form.sector || null,
      estimated_value: form.estimated_value ? parseFloat(form.estimated_value) : 0,
      source: form.source || null,
      notes: form.notes || null,
    });
    if (error) toast.error(error.message);
    else { toast.success("Opportunity created"); load(); setFormOpen(false); }
  };

  const filtered = opportunities.filter(o => {
    if (filterType !== "all" && o.opportunity_type !== filterType) return false;
    if (filterStatus !== "all" && o.status !== filterStatus) return false;
    if (search) {
      const s = search.toLowerCase();
      return (o.name?.toLowerCase().includes(s) || o.company_name?.toLowerCase().includes(s) || o.contact_name?.toLowerCase().includes(s));
    }
    return true;
  });

  const statusColor = (s: string) => {
    const m: Record<string, string> = {
      prospecting: "bg-secondary text-muted-foreground",
      outreach: "bg-blue-500/20 text-blue-400",
      meeting_scheduled: "bg-amber-500/20 text-amber-400",
      meeting_done: "bg-primary/20 text-primary",
      negotiation: "bg-purple-500/20 text-purple-400",
      qualified: "bg-emerald-500/20 text-emerald-400",
      handed_to_sales: "bg-emerald-500/20 text-emerald-300",
      won: "bg-emerald-600/20 text-emerald-400",
      lost: "bg-destructive/20 text-destructive",
      on_hold: "bg-muted text-muted-foreground",
    };
    return m[s] || "bg-secondary text-muted-foreground";
  };

  const typeIcon = (t: string) => {
    const m: Record<string, typeof Briefcase> = {
      partnership: Handshake, corporate: Building2, family_office: Users,
      vip_network: Users, channel_partner: Globe, referral_partner: Globe,
      investor: Briefcase, strategic: Briefcase,
    };
    return m[t] || Briefcase;
  };

  // Stats
  const active = opportunities.filter(o => !["won", "lost", "on_hold"].includes(o.status)).length;
  const qualified = opportunities.filter(o => o.status === "qualified").length;
  const pipeline = opportunities.filter(o => !["won", "lost", "on_hold"].includes(o.status)).reduce((s, o) => s + Number(o.estimated_value || 0), 0);
  const handedOff = opportunities.filter(o => o.status === "handed_to_sales").length;

  const inputClass = "w-full bg-secondary/50 rounded-lg px-3 py-2.5 text-[13px] text-foreground font-light focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all border border-border/20";
  const labelClass = "text-[9px] tracking-[0.2em] uppercase text-muted-foreground/60 mb-1.5 block font-light";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-display font-semibold">Business Development</h1>
          <p className="text-[11px] text-muted-foreground/50 font-light mt-1">
            Strategic partnerships · New markets · Growth pipeline
          </p>
        </div>
        <button onClick={() => {
          setForm({ name: "", company_name: "", contact_name: "", contact_email: "", contact_phone: "", opportunity_type: "partnership", status: "prospecting", market: "", sector: "", estimated_value: "", source: "", notes: "" });
          setFormOpen(true);
        }} className="p-2.5 rounded-lg border border-border/20 text-muted-foreground/40 hover:text-foreground hover:border-primary/30 transition-all">
          <Plus size={16} strokeWidth={1.5} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Active", value: active, color: "text-foreground" },
          { label: "Qualified", value: qualified, color: "text-emerald-400" },
          { label: "Pipeline Value", value: `$${pipeline.toLocaleString()}`, color: "text-primary" },
          { label: "Handed to Sales", value: handedOff, color: "text-blue-400" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border/20 bg-card/50 p-4">
            <p className={`text-2xl font-display font-semibold ${s.color}`}>{s.value}</p>
            <p className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground/40 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/30" strokeWidth={1.5} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" className={`${inputClass} pl-9`} />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className={`${inputClass} w-auto`}>
          <option value="all">All Types</option>
          {OPP_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={`${inputClass} w-auto`}>
          <option value="all">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      {/* Opportunities List */}
      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="w-5 h-5 border border-primary/30 border-t-primary rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Briefcase className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" strokeWidth={1} />
          <p className="text-[13px] text-muted-foreground/40 font-light">No opportunities found</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((o, i) => {
            const Icon = typeIcon(o.opportunity_type);
            return (
              <motion.div key={o.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Link to={`/crm/bd/${o.id}`}
                  className="block rounded-xl border border-border/20 bg-card/50 p-5 hover:border-border/40 hover:bg-secondary/20 transition-all group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <Icon className="w-4 h-4 text-muted-foreground/30 shrink-0" strokeWidth={1.5} />
                        <h3 className="text-[14px] font-medium">{o.name}</h3>
                        <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full font-medium ${statusColor(o.status)}`}>
                          {o.status.replace(/_/g, " ")}
                        </span>
                        <span className="text-[9px] tracking-[0.1em] uppercase text-muted-foreground/30 px-1.5 py-0.5 rounded bg-secondary/50">
                          {o.opportunity_type.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-muted-foreground/40 font-light ml-7">
                        {o.company_name && <span className="flex items-center gap-1"><Building2 size={10} /> {o.company_name}</span>}
                        {o.contact_name && <span>{o.contact_name}</span>}
                        {o.market && <span className="flex items-center gap-1"><Globe size={10} /> {o.market}</span>}
                        {o.sector && <span>{o.sector}</span>}
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      {o.estimated_value > 0 && (
                        <p className="text-[14px] font-display font-semibold">${Number(o.estimated_value).toLocaleString()}</p>
                      )}
                      {o.next_follow_up && (
                        <span className="text-[9px] text-muted-foreground/30 flex items-center gap-1">
                          <Calendar size={10} /> {new Date(o.next_follow_up).toLocaleDateString()}
                        </span>
                      )}
                      <ArrowRight size={14} className="text-muted-foreground/20 group-hover:text-foreground/40 transition-colors mt-1" strokeWidth={1.5} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-card border-border/30 max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-display text-lg">New Opportunity</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div><label className={labelClass}>Opportunity Name *</label><input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className={inputClass} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>Type</label>
                <select value={form.opportunity_type} onChange={e => setForm(p => ({ ...p, opportunity_type: e.target.value }))} className={inputClass}>
                  {OPP_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                </select>
              </div>
              <div><label className={labelClass}>Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className={inputClass}>
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>Company</label><input value={form.company_name} onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))} className={inputClass} /></div>
              <div><label className={labelClass}>Contact Name</label><input value={form.contact_name} onChange={e => setForm(p => ({ ...p, contact_name: e.target.value }))} className={inputClass} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelClass}>Contact Email</label><input type="email" value={form.contact_email} onChange={e => setForm(p => ({ ...p, contact_email: e.target.value }))} className={inputClass} /></div>
              <div><label className={labelClass}>Contact Phone</label><input value={form.contact_phone} onChange={e => setForm(p => ({ ...p, contact_phone: e.target.value }))} className={inputClass} /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className={labelClass}>Market / Region</label><input value={form.market} onChange={e => setForm(p => ({ ...p, market: e.target.value }))} className={inputClass} /></div>
              <div><label className={labelClass}>Sector</label><input value={form.sector} onChange={e => setForm(p => ({ ...p, sector: e.target.value }))} className={inputClass} /></div>
              <div><label className={labelClass}>Est. Value ($)</label><input type="number" step="0.01" value={form.estimated_value} onChange={e => setForm(p => ({ ...p, estimated_value: e.target.value }))} className={inputClass} /></div>
            </div>
            <div><label className={labelClass}>Source</label><input value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))} className={inputClass} /></div>
            <div><label className={labelClass}>Notes</label><textarea rows={3} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className={inputClass} /></div>
            <button type="submit" className="w-full py-3 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(45,79%,46%,0.45)] transition-all duration-500">Create</button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BDDashboardPage;
