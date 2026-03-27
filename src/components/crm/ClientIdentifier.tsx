import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, User, Phone, Mail, Crown, CreditCard, Plane, MapPin, Calendar, Loader2, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ClientResult {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  member_status: string | null;
  membership_tier: string | null;
  credit_balance: number | null;
  client_type: string | null;
  city: string | null;
  country: string | null;
  company: string | null;
  created_at: string;
}

export default function ClientIdentifier() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ClientResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selected, setSelected] = useState<ClientResult | null>(null);
  const [clientHistory, setClientHistory] = useState<{ requests: any[]; quotes: any[]; trips: any[] } | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const search = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    setSelected(null);
    setClientHistory(null);

    // Search by name, email, phone, whatsapp, or member_id (via profiles)
    const q = query.trim();
    const { data } = await supabase
      .from("clients")
      .select("id, full_name, email, phone, whatsapp, member_status, membership_tier, credit_balance, client_type, city, country, company, created_at")
      .or(`full_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,whatsapp.ilike.%${q}%`)
      .order("created_at", { ascending: false })
      .limit(10);

    setResults(data ?? []);
    setLoading(false);
  }, [query]);

  const selectClient = useCallback(async (client: ClientResult) => {
    setSelected(client);
    setHistoryLoading(true);

    const [reqRes, quoteRes, tripRes] = await Promise.all([
      supabase.from("flight_requests").select("id, departure, destination, date, status, passengers, created_at").eq("client_id", client.id).order("created_at", { ascending: false }).limit(5),
      supabase.from("quotes").select("id, aircraft, price, status, created_at, flight_requests!inner(client_id, departure, destination)").eq("flight_requests.client_id", client.id).order("created_at", { ascending: false }).limit(5),
      supabase.from("trips").select("id, departure, destination, date, aircraft, status, created_at").eq("client_id", client.id).order("created_at", { ascending: false }).limit(5),
    ]);

    setClientHistory({
      requests: reqRes.data ?? [],
      quotes: quoteRes.data ?? [],
      trips: tripRes.data ?? [],
    });
    setHistoryLoading(false);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") search();
  };

  const tierColor = (tier: string | null) => {
    if (!tier) return "text-muted-foreground";
    const t = tier.toLowerCase();
    if (t.includes("maverick") || t.includes("founder")) return "text-primary";
    if (t.includes("globetrotter")) return "text-amber-400";
    if (t.includes("explorer")) return "text-blue-400";
    return "text-muted-foreground";
  };

  return (
    <div className="rounded-xl border border-border/20 bg-card/50 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-4 h-4 text-primary/60" strokeWidth={1.5} />
        <p className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light">Client Identification</p>
      </div>

      {/* Search bar */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by name, email, phone, membership number..."
            className="w-full bg-secondary/50 rounded-lg px-3 py-2.5 pl-9 text-[13px] text-foreground font-light focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all border border-border/20"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/40" />
        </div>
        <button
          onClick={search}
          disabled={loading || !query.trim()}
          className="px-4 py-2.5 bg-primary/10 text-primary text-[10px] tracking-[0.2em] uppercase font-medium rounded-lg hover:bg-primary/20 transition-all disabled:opacity-40"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Find"}
        </button>
      </div>

      {/* Results */}
      {searched && !loading && results.length === 0 && (
        <p className="text-[11px] text-muted-foreground/50 font-light text-center py-4">No clients found. Create a new client record?</p>
      )}

      {results.length > 0 && !selected && (
        <div className="space-y-1.5 max-h-60 overflow-y-auto">
          {results.map((c) => (
            <button
              key={c.id}
              onClick={() => selectClient(c)}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center flex-shrink-0">
                <User className="w-3.5 h-3.5 text-muted-foreground/60" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium truncate">{c.full_name}</span>
                  {c.member_status === "active" && (
                    <Crown className={`w-3 h-3 ${tierColor(c.membership_tier)}`} />
                  )}
                </div>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground/50">
                  {c.email && <span className="flex items-center gap-1"><Mail size={8} /> {c.email}</span>}
                  {c.phone && <span className="flex items-center gap-1"><Phone size={8} /> {c.phone}</span>}
                </div>
              </div>
              <span className="text-[8px] tracking-[0.15em] uppercase bg-secondary/50 text-foreground/40 px-2 py-0.5 rounded">
                {c.client_type || "lead"}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Selected client detail */}
      {selected && (
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4.5 h-4.5 text-primary/70" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-[15px] font-semibold">{selected.full_name}</h3>
                  {selected.member_status === "active" && (
                    <span className={`text-[8px] tracking-[0.2em] uppercase font-medium px-2 py-0.5 rounded-full border border-primary/20 bg-primary/5 ${tierColor(selected.membership_tier)}`}>
                      {selected.membership_tier || "Member"}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 mt-1 text-[10px] text-muted-foreground/60">
                  {selected.email && <span className="flex items-center gap-1"><Mail size={9} /> {selected.email}</span>}
                  {selected.phone && <span className="flex items-center gap-1"><Phone size={9} /> {selected.phone}</span>}
                  {selected.city && <span className="flex items-center gap-1"><MapPin size={9} /> {selected.city}{selected.country ? `, ${selected.country}` : ""}</span>}
                  {selected.company && <span>{selected.company}</span>}
                </div>
              </div>
            </div>
            <button onClick={() => { setSelected(null); setClientHistory(null); }} className="text-muted-foreground/40 hover:text-foreground">
              <X size={14} />
            </button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-secondary/30 p-3 text-center">
              <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-1">Type</p>
              <p className="text-[12px] font-medium capitalize">{selected.client_type || "lead"}</p>
            </div>
            <div className="rounded-lg bg-secondary/30 p-3 text-center">
              <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-1">Credit</p>
              <p className="text-[12px] font-medium">${(selected.credit_balance || 0).toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-secondary/30 p-3 text-center">
              <p className="text-[9px] text-muted-foreground/50 uppercase tracking-wider mb-1">Since</p>
              <p className="text-[12px] font-medium">{new Date(selected.created_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</p>
            </div>
          </div>

          {/* Activity history */}
          {historyLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-4 h-4 animate-spin text-primary/60" />
            </div>
          ) : clientHistory && (
            <div className="space-y-3">
              {clientHistory.requests.length > 0 && (
                <div>
                  <p className="text-[8px] tracking-[0.2em] uppercase text-muted-foreground/40 mb-1.5 font-light">Recent Requests</p>
                  {clientHistory.requests.map((r: any) => (
                    <div key={r.id} className="flex items-center justify-between py-1.5 text-[11px]">
                      <span className="font-light">{r.departure} → {r.destination}</span>
                      <span className="text-[9px] bg-secondary/50 text-foreground/40 px-2 py-0.5 rounded uppercase">{r.status}</span>
                    </div>
                  ))}
                </div>
              )}
              {clientHistory.quotes.length > 0 && (
                <div>
                  <p className="text-[8px] tracking-[0.2em] uppercase text-muted-foreground/40 mb-1.5 font-light">Recent Quotes</p>
                  {clientHistory.quotes.map((q: any) => (
                    <div key={q.id} className="flex items-center justify-between py-1.5 text-[11px]">
                      <span className="font-light">{q.aircraft || "—"} · ${q.price?.toLocaleString() || "—"}</span>
                      <span className="text-[9px] bg-secondary/50 text-foreground/40 px-2 py-0.5 rounded uppercase">{q.status}</span>
                    </div>
                  ))}
                </div>
              )}
              {clientHistory.trips.length > 0 && (
                <div>
                  <p className="text-[8px] tracking-[0.2em] uppercase text-muted-foreground/40 mb-1.5 font-light">Recent Trips</p>
                  {clientHistory.trips.map((t: any) => (
                    <div key={t.id} className="flex items-center justify-between py-1.5 text-[11px]">
                      <span className="font-light">{t.departure} → {t.destination}</span>
                      <span className="text-[9px] bg-secondary/50 text-foreground/40 px-2 py-0.5 rounded uppercase">{t.status}</span>
                    </div>
                  ))}
                </div>
              )}
              {clientHistory.requests.length === 0 && clientHistory.quotes.length === 0 && clientHistory.trips.length === 0 && (
                <p className="text-[11px] text-muted-foreground/40 font-light text-center py-2">No activity history yet.</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Link
              to={`/crm/account-mgmt/${selected.id}`}
              className="flex-1 text-center py-2.5 bg-primary/10 text-primary text-[9px] tracking-[0.2em] uppercase font-medium rounded-lg hover:bg-primary/20 transition-all"
            >
              View Full Profile
            </Link>
            <Link
              to={`/crm/search-inventory?client_id=${selected.id}&client_name=${encodeURIComponent(selected.full_name)}`}
              className="flex-1 text-center py-2.5 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.2em] uppercase font-medium rounded-lg hover:shadow-[0_0_20px_-6px_hsla(43,85%,58%,0.4)] transition-all flex items-center justify-center gap-1.5"
            >
              <Plane size={10} /> Search for Client
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
