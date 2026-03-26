import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  User, CreditCard, Plane, Shield, FileText, MapPin, Heart, Settings,
  Save, Upload, Trash2, Plus, LogOut, ChevronLeft
} from "lucide-react";
import { Link } from "react-router-dom";

/* ── helpers ── */
const Field = ({ label, value, onChange, type = "text", placeholder = "", disabled = false }: any) => (
  <div>
    <label className="text-[9px] tracking-[0.25em] uppercase text-gold/50 mb-1.5 block font-light">{label}</label>
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full bg-secondary/50 rounded-lg px-4 py-2.5 text-[13px] text-foreground placeholder:text-foreground/20 font-light focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all luxury-border disabled:opacity-40"
    />
  </div>
);

const Toggle = ({ label, checked, onChange }: any) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div className={`w-9 h-5 rounded-full transition-colors relative ${checked ? "bg-gold/60" : "bg-secondary"}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
    </div>
    <span className="text-[12px] text-foreground/60 font-light group-hover:text-foreground/80 transition-colors">{label}</span>
  </label>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[9px] tracking-[0.4em] uppercase text-gold/50 font-light mb-4 mt-6 first:mt-0">{children}</p>
);

const MemberProfilePage = () => {
  const { user, roles, signOut } = useAuth();
  const [saving, setSaving] = useState(false);

  /* ── profile state ── */
  const [profile, setProfile] = useState<any>(null);
  const [travel, setTravel] = useState<any>(null);
  const [concierge, setConcierge] = useState<any>(null);
  const [savedRoutes, setSavedRoutes] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [trips, setTrips] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* route form */
  const [newRoute, setNewRoute] = useState({ name: "", departure: "", destination: "" });

  const uid = user?.id;

  const fetchAll = useCallback(async () => {
    if (!uid) return;
    setLoading(true);

    const [pRes, tRes, cRes, rRes, dRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
      supabase.from("travel_preferences").select("*").eq("user_id", uid).maybeSingle(),
      supabase.from("concierge_preferences").select("*").eq("user_id", uid).maybeSingle(),
      supabase.from("saved_routes").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      supabase.from("member_documents").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
    ]);

    setProfile(pRes.data ?? {});
    setTravel(tRes.data ?? { user_id: uid });
    setConcierge(cRes.data ?? { user_id: uid });
    setSavedRoutes(rRes.data ?? []);
    setDocuments(dRes.data ?? []);

    // Fetch client-linked data (invoices, trips, requests)
    const { data: clientData } = await supabase.from("clients").select("id").eq("user_id", uid).maybeSingle();
    if (clientData) {
      const [iRes, trRes, frRes] = await Promise.all([
        supabase.from("invoices").select("*").order("created_at", { ascending: false }).limit(20),
        supabase.from("trips").select("*").eq("client_id", clientData.id).order("created_at", { ascending: false }),
        supabase.from("flight_requests").select("*").eq("client_id", clientData.id).order("created_at", { ascending: false }),
      ]);
      setInvoices(iRes.data ?? []);
      setTrips(trRes.data ?? []);
      setRequests(frRes.data ?? []);
    }

    setLoading(false);
  }, [uid]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── save helpers ── */
  const saveProfile = async () => {
    if (!uid) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update(profile).eq("id", uid);
    if (error) toast.error("Failed to save profile"); else toast.success("Profile saved");
    setSaving(false);
  };

  const saveTravel = async () => {
    if (!uid) return;
    setSaving(true);
    const payload = { ...travel, user_id: uid };
    delete payload.id; delete payload.created_at; delete payload.updated_at;
    const { error } = await supabase.from("travel_preferences").upsert(payload, { onConflict: "user_id" });
    if (error) toast.error("Failed to save travel preferences"); else toast.success("Travel preferences saved");
    setSaving(false);
  };

  const saveConcierge = async () => {
    if (!uid) return;
    setSaving(true);
    const payload = { ...concierge, user_id: uid };
    delete payload.id; delete payload.created_at; delete payload.updated_at;
    const { error } = await supabase.from("concierge_preferences").upsert(payload, { onConflict: "user_id" });
    if (error) toast.error("Failed to save concierge preferences"); else toast.success("Concierge preferences saved");
    setSaving(false);
  };

  const addRoute = async () => {
    if (!uid || !newRoute.departure || !newRoute.destination) return;
    const { error } = await supabase.from("saved_routes").insert({ ...newRoute, user_id: uid });
    if (error) toast.error("Failed to save route");
    else { toast.success("Route saved"); setNewRoute({ name: "", departure: "", destination: "" }); fetchAll(); }
  };

  const deleteRoute = async (id: string) => {
    await supabase.from("saved_routes").delete().eq("id", id);
    fetchAll();
  };

  const uploadDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uid) return;
    const path = `${uid}/${Date.now()}_${file.name}`;
    const { error: uploadErr } = await supabase.storage.from("member-documents").upload(path, file);
    if (uploadErr) { toast.error("Upload failed"); return; }
    const { data: urlData } = supabase.storage.from("member-documents").getPublicUrl(path);
    await supabase.from("member_documents").insert({ user_id: uid, name: file.name, file_url: urlData.publicUrl, doc_type: "upload" });
    toast.success("Document uploaded");
    fetchAll();
  };

  const deleteDoc = async (id: string, url: string) => {
    const path = url.split("/member-documents/")[1];
    if (path) await supabase.storage.from("member-documents").remove([path]);
    await supabase.from("member_documents").delete().eq("id", id);
    fetchAll();
  };

  const up = (key: string, val: any) => setProfile((p: any) => ({ ...p, [key]: val }));
  const ut = (key: string, val: any) => setTravel((p: any) => ({ ...p, [key]: val }));
  const uc = (key: string, val: any) => setConcierge((p: any) => ({ ...p, [key]: val }));

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-6 h-6 border border-gold/30 border-t-gold/80 rounded-full animate-spin" />
    </div>
  );

  const tabItems = [
    { value: "overview", label: "Overview", icon: User },
    { value: "personal", label: "Personal", icon: Settings },
    { value: "travel", label: "Travel", icon: Plane },
    { value: "membership", label: "Membership", icon: Shield },
    { value: "billing", label: "Billing", icon: CreditCard },
    { value: "documents", label: "Documents", icon: FileText },
    { value: "routes", label: "Routes", icon: MapPin },
    { value: "concierge", label: "Concierge", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-36 pb-16 md:pt-44">
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Link to="/dashboard" className="text-[9px] tracking-[0.2em] uppercase text-foreground/25 hover:text-foreground/50 transition-colors font-light inline-flex items-center gap-1 mb-6">
              <ChevronLeft size={10} /> Dashboard
            </Link>
            <p className="text-[9px] tracking-[0.5em] uppercase text-gold/70 mb-3 font-light">Member Profile</p>
            <h1 className="text-xl md:text-3xl font-display font-semibold">{profile?.full_name || "Member"}</h1>
            <p className="text-[11px] text-foreground/30 font-extralight mt-1">{user?.email}</p>
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full flex-wrap h-auto gap-1 bg-secondary/30 p-1.5 rounded-xl mb-6">
              {tabItems.map((t) => (
                <TabsTrigger key={t.value} value={t.value} className="text-[9px] tracking-[0.1em] uppercase font-light gap-1.5 data-[state=active]:bg-background data-[state=active]:text-gold/80 px-3 py-2">
                  <t.icon size={12} strokeWidth={1.2} />
                  <span className="hidden sm:inline">{t.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* ── OVERVIEW ── */}
            <TabsContent value="overview">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(220,15%,12%) 0%, hsl(220,10%,18%) 50%, hsl(45,30%,22%) 100%)" }}>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[9px] tracking-[0.5em] uppercase text-white/40 font-light">Founder's Circle</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                      <span className="text-[9px] tracking-[0.15em] uppercase text-white/40 font-light">Active</span>
                    </div>
                  </div>
                  <p className="text-lg font-display text-white/90 font-semibold mb-0.5">{profile?.full_name || "Member"}</p>
                  <p className="text-[10px] text-white/30 font-extralight mb-6">Member since {memberSince}</p>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Available Credit", value: `$${(profile?.available_credit ?? 0).toLocaleString()}` },
                      { label: "Referrals Sent", value: profile?.referrals_sent ?? 0 },
                      { label: "Trips", value: trips.length },
                    ].map((s) => (
                      <div key={s.label}>
                        <p className="text-lg font-display text-white/90 font-semibold">{s.value}</p>
                        <p className="text-[8px] tracking-[0.15em] uppercase text-white/30 font-light">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Active Requests", value: requests.filter(r => r.status === "pending").length },
                    { label: "Past Flights", value: trips.filter(t => t.status === "completed").length },
                    { label: "Saved Routes", value: savedRoutes.length },
                    { label: "Documents", value: documents.length },
                  ].map((s) => (
                    <div key={s.label} className="glass rounded-xl p-5">
                      <p className="text-xl font-display font-semibold">{s.value}</p>
                      <p className="text-[9px] tracking-[0.1em] uppercase text-foreground/40 font-light mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* ── PERSONAL INFO ── */}
            <TabsContent value="personal">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-6 space-y-4">
                <SectionTitle>Contact Details</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Full Name" value={profile?.full_name} onChange={(v: string) => up("full_name", v)} />
                  <Field label="Email" value={user?.email} onChange={() => {}} disabled />
                  <Field label="Phone" value={profile?.phone} onChange={(v: string) => up("phone", v)} />
                  <Field label="WhatsApp" value={profile?.whatsapp} onChange={(v: string) => up("whatsapp", v)} />
                </div>
                <SectionTitle>Location & Company</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Nationality" value={profile?.nationality} onChange={(v: string) => up("nationality", v)} />
                  <Field label="City" value={profile?.city} onChange={(v: string) => up("city", v)} />
                  <Field label="Country" value={profile?.country} onChange={(v: string) => up("country", v)} />
                  <Field label="Company" value={profile?.company} onChange={(v: string) => up("company", v)} />
                  <Field label="Title" value={profile?.title} onChange={(v: string) => up("title", v)} />
                </div>
                <button onClick={saveProfile} disabled={saving} className="mt-4 px-6 py-2.5 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,74%,49%,0.45)] transition-all duration-500 disabled:opacity-50 inline-flex items-center gap-2">
                  <Save size={12} /> {saving ? "Saving..." : "Save Changes"}
                </button>
              </motion.div>
            </TabsContent>

            {/* ── TRAVEL PREFERENCES ── */}
            <TabsContent value="travel">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-6 space-y-4">
                <SectionTitle>Flight Defaults</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Preferred Aircraft Category" value={travel?.preferred_aircraft_category} onChange={(v: string) => ut("preferred_aircraft_category", v)} placeholder="Light, Mid, Heavy, Ultra-Long" />
                  <Field label="Default Passengers" value={travel?.default_passengers} onChange={(v: string) => ut("default_passengers", parseInt(v) || 1)} type="number" />
                  <Field label="Catering Preference" value={travel?.catering_preference} onChange={(v: string) => ut("catering_preference", v)} placeholder="Halal, Vegan, Fine dining…" />
                  <Field label="Ground Transport" value={travel?.ground_transport_preference} onChange={(v: string) => ut("ground_transport_preference", v)} placeholder="Chauffeur, Helicopter, Self…" />
                </div>
                <SectionTitle>Onboard Preferences</SectionTitle>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Toggle label="Smoking" checked={travel?.smoking} onChange={(v: boolean) => ut("smoking", !travel?.smoking)} />
                  <Toggle label="Pets Onboard" checked={travel?.pets} onChange={() => ut("pets", !travel?.pets)} />
                  <Toggle label="Wi-Fi Required" checked={travel?.wifi_required} onChange={() => ut("wifi_required", !travel?.wifi_required)} />
                  <Toggle label="VIP Terminal" checked={travel?.vip_terminal} onChange={() => ut("vip_terminal", !travel?.vip_terminal)} />
                </div>
                <button onClick={saveTravel} disabled={saving} className="mt-4 px-6 py-2.5 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,74%,49%,0.45)] transition-all duration-500 disabled:opacity-50 inline-flex items-center gap-2">
                  <Save size={12} /> {saving ? "Saving..." : "Save Preferences"}
                </button>
              </motion.div>
            </TabsContent>

            {/* ── MEMBERSHIP ── */}
            <TabsContent value="membership">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="glass rounded-xl p-6">
                  <SectionTitle>Membership Status</SectionTitle>
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { label: "Tier", value: (profile?.membership_tier ?? "founder_circle").replace("_", " ") },
                      { label: "Status", value: profile?.invitation_status ?? "Active" },
                      { label: "Member ID", value: profile?.member_id ?? uid?.slice(0, 8).toUpperCase() },
                      { label: "Available Credit", value: `$${(profile?.available_credit ?? 0).toLocaleString()}` },
                      { label: "Referrals Sent", value: profile?.referrals_sent ?? 0 },
                      { label: "Reward Progress", value: `${Math.min((profile?.referrals_sent ?? 0), 3)} / 3` },
                    ].map((s) => (
                      <div key={s.label}>
                        <p className="text-[9px] tracking-[0.2em] uppercase text-foreground/30 font-light mb-1">{s.label}</p>
                        <p className="text-sm font-display capitalize">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="glass rounded-xl p-6">
                  <SectionTitle>Referral Reward</SectionTitle>
                  <p className="text-[12px] text-foreground/50 font-light leading-relaxed">
                    Refer 3 qualified individuals to earn a <span className="text-gold">$1,000 flight credit</span>. Share your unique link to start earning.
                  </p>
                  <div className="mt-4 w-full bg-secondary/50 rounded-full h-2">
                    <div className="bg-gradient-gold h-2 rounded-full transition-all" style={{ width: `${Math.min(((profile?.referrals_sent ?? 0) / 3) * 100, 100)}%` }} />
                  </div>
                  <p className="text-[9px] text-foreground/30 font-light mt-2">{profile?.referrals_sent ?? 0} of 3 referrals completed</p>
                </div>
              </motion.div>
            </TabsContent>

            {/* ── BILLING ── */}
            <TabsContent value="billing">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="glass rounded-xl p-6 space-y-4">
                  <SectionTitle>Billing Details</SectionTitle>
                  <Field label="Billing Address" value={profile?.billing_address} onChange={(v: string) => up("billing_address", v)} placeholder="Full billing address" />
                  <Field label="Payment Preference" value={profile?.payment_preference} onChange={(v: string) => up("payment_preference", v)} placeholder="Wire transfer, Credit card…" />
                  <button onClick={saveProfile} disabled={saving} className="px-6 py-2.5 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,74%,49%,0.45)] transition-all disabled:opacity-50 inline-flex items-center gap-2">
                    <Save size={12} /> Save
                  </button>
                </div>
                <div className="glass rounded-xl p-6">
                  <SectionTitle>Recent Invoices</SectionTitle>
                  {invoices.length === 0 ? (
                    <p className="text-[11px] text-foreground/30 font-extralight">No invoices yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {invoices.slice(0, 10).map((inv) => (
                        <div key={inv.id} className="flex items-center justify-between py-2 border-b border-border/10 last:border-0">
                          <div>
                            <p className="text-[12px] font-light">${inv.amount?.toLocaleString()}</p>
                            <p className="text-[9px] text-foreground/30">{new Date(inv.created_at).toLocaleDateString()}</p>
                          </div>
                          <span className={`text-[9px] tracking-[0.1em] uppercase font-light px-2 py-0.5 rounded ${inv.status === "paid" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>{inv.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </TabsContent>

            {/* ── DOCUMENTS ── */}
            <TabsContent value="documents">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-6">
                <SectionTitle>Your Documents</SectionTitle>
                <label className="flex items-center gap-2 px-4 py-2.5 bg-secondary/50 rounded-lg cursor-pointer hover:bg-secondary/70 transition-colors mb-4 w-fit">
                  <Upload size={14} className="text-gold/60" />
                  <span className="text-[11px] font-light">Upload Document</span>
                  <input type="file" className="hidden" onChange={uploadDocument} />
                </label>
                {documents.length === 0 ? (
                  <p className="text-[11px] text-foreground/30 font-extralight">No documents uploaded.</p>
                ) : (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between py-2 border-b border-border/10 last:border-0">
                        <div className="flex items-center gap-3">
                          <FileText size={14} className="text-gold/40" />
                          <div>
                            <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-[12px] font-light hover:text-gold transition-colors">{doc.name}</a>
                            <p className="text-[9px] text-foreground/30">{new Date(doc.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button onClick={() => deleteDoc(doc.id, doc.file_url)} className="text-foreground/20 hover:text-destructive transition-colors"><Trash2 size={12} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* ── SAVED ROUTES / ACTIVITY ── */}
            <TabsContent value="routes">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="glass rounded-xl p-6">
                  <SectionTitle>Add Saved Route</SectionTitle>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <Field label="Name" value={newRoute.name} onChange={(v: string) => setNewRoute(r => ({ ...r, name: v }))} placeholder="Weekend getaway" />
                    <Field label="Departure" value={newRoute.departure} onChange={(v: string) => setNewRoute(r => ({ ...r, departure: v }))} placeholder="KJFK" />
                    <Field label="Destination" value={newRoute.destination} onChange={(v: string) => setNewRoute(r => ({ ...r, destination: v }))} placeholder="LFPB" />
                  </div>
                  <button onClick={addRoute} className="px-4 py-2 bg-gold/10 text-gold text-[9px] tracking-[0.15em] uppercase rounded-lg hover:bg-gold/20 transition-colors inline-flex items-center gap-1.5"><Plus size={12} /> Add Route</button>
                </div>

                {savedRoutes.length > 0 && (
                  <div className="glass rounded-xl p-6">
                    <SectionTitle>Your Routes</SectionTitle>
                    <div className="space-y-2">
                      {savedRoutes.map((r) => (
                        <div key={r.id} className="flex items-center justify-between py-2 border-b border-border/10 last:border-0">
                          <div>
                            <p className="text-[12px] font-light">{r.name || `${r.departure} → ${r.destination}`}</p>
                            <p className="text-[9px] text-foreground/30">{r.departure} → {r.destination}</p>
                          </div>
                          <button onClick={() => deleteRoute(r.id)} className="text-foreground/20 hover:text-destructive transition-colors"><Trash2 size={12} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Requests */}
                <div className="glass rounded-xl p-6">
                  <SectionTitle>Recent Requests</SectionTitle>
                  {requests.length === 0 ? (
                    <p className="text-[11px] text-foreground/30 font-extralight">No flight requests yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {requests.slice(0, 8).map((r) => (
                        <div key={r.id} className="flex items-center justify-between py-2 border-b border-border/10 last:border-0">
                          <div>
                            <p className="text-[12px] font-light">{r.departure} → {r.destination}</p>
                            <p className="text-[9px] text-foreground/30">{r.date ? new Date(r.date).toLocaleDateString() : "Flexible"} · {r.passengers} pax</p>
                          </div>
                          <span className="text-[9px] tracking-[0.1em] uppercase font-light px-2 py-0.5 rounded bg-secondary/50">{r.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Past Trips */}
                <div className="glass rounded-xl p-6">
                  <SectionTitle>Past Trips</SectionTitle>
                  {trips.length === 0 ? (
                    <p className="text-[11px] text-foreground/30 font-extralight">No trips recorded yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {trips.slice(0, 8).map((t) => (
                        <div key={t.id} className="flex items-center justify-between py-2 border-b border-border/10 last:border-0">
                          <div>
                            <p className="text-[12px] font-light">{t.departure} → {t.destination}</p>
                            <p className="text-[9px] text-foreground/30">{t.date ? new Date(t.date).toLocaleDateString() : "—"} · {t.aircraft ?? "—"}</p>
                          </div>
                          <span className={`text-[9px] tracking-[0.1em] uppercase font-light px-2 py-0.5 rounded ${t.status === "completed" ? "bg-emerald-500/10 text-emerald-400" : "bg-secondary/50"}`}>{t.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </TabsContent>

            {/* ── CONCIERGE ── */}
            <TabsContent value="concierge">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-6 space-y-4">
                <SectionTitle>Concierge Preferences</SectionTitle>
                <Field label="Hotel Preferences" value={concierge?.hotel_preferences} onChange={(v: string) => uc("hotel_preferences", v)} placeholder="5-star, boutique, specific brands…" />
                <div className="grid grid-cols-2 gap-4">
                  <Toggle label="Chauffeur Service" checked={concierge?.chauffeur} onChange={() => uc("chauffeur", !concierge?.chauffeur)} />
                  <Toggle label="Security / Escort" checked={concierge?.security_escort} onChange={() => uc("security_escort", !concierge?.security_escort)} />
                </div>
                <Field label="Special Assistance" value={concierge?.special_assistance} onChange={(v: string) => uc("special_assistance", v)} placeholder="Wheelchair, medical, etc." />
                <div>
                  <label className="text-[9px] tracking-[0.25em] uppercase text-gold/50 mb-1.5 block font-light">Additional Notes</label>
                  <textarea
                    value={concierge?.notes ?? ""}
                    onChange={(e) => uc("notes", e.target.value)}
                    placeholder="Any additional requests or preferences…"
                    rows={4}
                    className="w-full bg-secondary/50 rounded-lg px-4 py-2.5 text-[13px] text-foreground placeholder:text-foreground/20 font-light focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all luxury-border resize-none"
                  />
                </div>
                <button onClick={saveConcierge} disabled={saving} className="px-6 py-2.5 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,74%,49%,0.45)] transition-all disabled:opacity-50 inline-flex items-center gap-2">
                  <Save size={12} /> {saving ? "Saving..." : "Save Preferences"}
                </button>
              </motion.div>
            </TabsContent>
          </Tabs>

          {/* Footer nav */}
          <div className="flex justify-between items-center mt-8">
            <Link to="/dashboard" className="text-[9px] tracking-[0.2em] uppercase text-foreground/25 hover:text-foreground/50 transition-colors font-light">← Dashboard</Link>
            <button onClick={signOut} className="flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase text-foreground/25 hover:text-destructive/70 transition-colors font-light">
              <LogOut size={12} /> Sign Out
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MemberProfilePage;
