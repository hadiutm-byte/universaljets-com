import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, Plane, Users, Clock, Loader2, Shield, Ruler, Gauge, ArrowRight, Calendar, User, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { getAircraftImage, getAircraftCategory } from "@/lib/aircraftImages";
import AIRPORT_COORDS from "@/lib/airportCoords";
import { greatCircleDistanceNm, estimateFlightTimeMin, getCharterPrice, formatDuration, formatDistance } from "@/lib/pricingEstimates";

const getSupabaseUrl = () => import.meta.env.VITE_SUPABASE_URL;
const getAnonKey = () => import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const InternalSearchPage = () => {
  const [searchParams] = useSearchParams();
  const preClientId = searchParams.get("client_id") || "";
  const preClientName = searchParams.get("client_name") || "";
  const { user } = useAuth();

  const [fromIcao, setFromIcao] = useState("");
  const [toIcao, setToIcao] = useState("");
  const [date, setDate] = useState("");
  const [pax, setPax] = useState("1");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [quoteDialog, setQuoteDialog] = useState<{ open: boolean; aircraft?: string; price?: number }>({ open: false });
  const [quoteForm, setQuoteForm] = useState({ price: "", validDays: "7" });
  const [submitting, setSubmitting] = useState(false);

  // Client selector
  const [clientId, setClientId] = useState(preClientId);
  const [clientName, setClientName] = useState(preClientName);
  const [clientSearch, setClientSearch] = useState("");
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);

  // Fetch clients for selector
  const { data: clients } = useQuery({
    queryKey: ["crm-clients-for-search"],
    queryFn: async () => {
      const { data } = await supabase.from("clients").select("id, full_name, email, company").order("full_name").limit(500);
      return data || [];
    },
  });

  const filteredClients = useMemo(() => {
    if (!clients) return [];
    if (!clientSearch) return clients.slice(0, 20);
    const q = clientSearch.toLowerCase();
    return clients.filter(c =>
      c.full_name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.company?.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [clients, clientSearch]);

  // Search
  const { data, isLoading } = useQuery({
    queryKey: ["internal-charter-search", fromIcao, toIcao, date, pax],
    queryFn: async () => {
      const response = await fetch(`${getSupabaseUrl()}/functions/v1/aviapages-charter-search`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAnonKey()}`,
          apikey: getAnonKey(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from_icao: fromIcao, to_icao: toIcao, date, passengers: pax }),
      });
      if (!response.ok) throw new Error("Search failed");
      return response.json();
    },
    enabled: searchTriggered && !!fromIcao && !!toIcao,
  });

  const routeInfo = useMemo(() => {
    const fromCoords = AIRPORT_COORDS[fromIcao];
    const toCoords = AIRPORT_COORDS[toIcao];
    if (!fromCoords || !toCoords) return null;
    return { distanceNm: greatCircleDistanceNm(fromCoords[0], fromCoords[1], toCoords[0], toCoords[1]) };
  }, [fromIcao, toIcao]);

  const results = data?.results || [];

  const handleSearch = () => {
    if (!fromIcao || !toIcao) { toast.error("Enter departure and destination ICAO codes"); return; }
    setSearchTriggered(true);
  };

  const handleCreateQuote = async () => {
    if (!clientId) { toast.error("Select a client first"); return; }
    if (!quoteForm.price) { toast.error("Price required"); return; }
    setSubmitting(true);

    const { data: reqData, error: reqErr } = await supabase.from("flight_requests").insert({
      client_id: clientId,
      departure: fromIcao,
      destination: toIcao,
      date: date || null,
      passengers: parseInt(pax) || 1,
      status: "quoted",
      source: "crm_internal",
      specific_aircraft: quoteDialog.aircraft || null,
      contact_name: clientName,
    }).select("id").single();

    if (reqErr) { toast.error(reqErr.message); setSubmitting(false); return; }

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + parseInt(quoteForm.validDays || "7"));

    const { error: quoteErr } = await supabase.from("quotes").insert({
      request_id: reqData.id,
      aircraft: quoteDialog.aircraft || null,
      price: parseFloat(quoteForm.price),
      valid_until: validUntil.toISOString(),
      status: "draft",
      created_by: user?.id,
    });

    if (quoteErr) { toast.error(quoteErr.message); setSubmitting(false); return; }

    toast.success("Quote created successfully");
    setQuoteDialog({ open: false });
    setSubmitting(false);
  };

  const inputClass = crmInputClass;
  const labelClass = crmLabelClass;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-xl">Internal Inventory Search</h1>
        <p className="text-[11px] text-muted-foreground/50 font-light mt-1">Search flights and generate quotes for clients</p>
      </div>

      {/* Client Selector */}
      <div className="rounded-xl border border-border/20 bg-card/50 p-4">
        <label className={labelClass}>Client</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setClientDropdownOpen(!clientDropdownOpen)}
            className={`${inputClass} text-left flex items-center justify-between cursor-pointer`}
          >
            <span className={clientId ? "text-foreground" : "text-muted-foreground/40"}>
              {clientName || "Select a client..."}
            </span>
            <ChevronDown size={14} className="text-muted-foreground/40" />
          </button>
          {clientDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => { setClientDropdownOpen(false); setClientSearch(""); }} />
              <div className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-card border border-border/30 shadow-2xl z-50 overflow-hidden max-w-md">
                <div className="p-2 border-b border-border/10">
                  <input
                    type="text"
                    placeholder="Search by name, email, or company..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    autoFocus
                    className="w-full px-3 py-2 text-[12px] rounded-lg bg-secondary/30 border border-border/10 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/30"
                  />
                </div>
                <div className="overflow-y-auto max-h-[200px]">
                  {filteredClients.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => { setClientId(c.id); setClientName(c.full_name); setClientDropdownOpen(false); setClientSearch(""); }}
                      className={`w-full text-left px-3 py-2.5 hover:bg-secondary/40 transition-colors border-b border-border/5 ${c.id === clientId ? "bg-primary/5" : ""}`}
                    >
                      <p className="text-[12px] font-medium text-foreground">{c.full_name}</p>
                      <p className="text-[10px] text-muted-foreground/40">{c.email}{c.company ? ` · ${c.company}` : ""}</p>
                    </button>
                  ))}
                  {filteredClients.length === 0 && <p className="text-center py-4 text-[11px] text-muted-foreground/30">No clients found</p>}
                </div>
              </div>
            </>
          )}
        </div>
        {clientId && (
          <div className="flex items-center gap-2 mt-2">
            <User size={12} className="text-primary/60" />
            <span className="text-[11px] text-muted-foreground font-light">Searching on behalf of:</span>
            <span className="text-[11px] text-foreground font-medium">{clientName}</span>
            <button onClick={() => { setClientId(""); setClientName(""); }} className="text-[9px] text-destructive/60 hover:text-destructive ml-2">Clear</button>
          </div>
        )}
      </div>

      {/* Search Form */}
      <div className="rounded-xl border border-border/20 bg-card/50 p-5">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className={labelClass}>From (ICAO)</label>
            <input value={fromIcao} onChange={(e) => { setFromIcao(e.target.value.toUpperCase()); setSearchTriggered(false); }} placeholder="KJFK" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>To (ICAO)</label>
            <input value={toIcao} onChange={(e) => { setToIcao(e.target.value.toUpperCase()); setSearchTriggered(false); }} placeholder="EGLL" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Passengers</label>
            <input type="number" min={1} value={pax} onChange={(e) => setPax(e.target.value)} className={inputClass} />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full py-2.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.2em] uppercase font-medium rounded-lg hover:shadow-[0_0_20px_-6px_hsla(43,85%,58%,0.4)] transition-all disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
              Search
            </button>
          </div>
        </div>
        {routeInfo && (
          <p className="text-[10px] text-muted-foreground/50 mt-2 font-light">
            Route: {formatDistance(routeInfo.distanceNm)}
          </p>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="ml-2 text-[11px] text-muted-foreground/60">Searching operators...</span>
        </div>
      )}

      {/* Results */}
      {searchTriggered && !isLoading && results.length === 0 && (
        <div className="text-center py-12 rounded-xl border border-border/20 bg-card/50">
          <Plane className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-[13px] text-muted-foreground font-light">No operators responded for this route.</p>
        </div>
      )}

      {results.length > 0 && (
        <div>
          <p className="text-[11px] text-muted-foreground/50 mb-4">{results.length} aircraft options found</p>
          <div className="space-y-3">
            {results.map((r: any, i: number) => {
              const category = r.aircraft_class || getAircraftCategory(r.aircraft_type);
              const fallbackImage = getAircraftImage(r.aircraft_type);
              const displayImage = r.images?.exterior || fallbackImage;
              const flightTimeMin = r.estimated_flight_time_min || (routeInfo ? estimateFlightTimeMin(routeInfo.distanceNm, category, r.speed_kmh) : null);
              const pricing = getCharterPrice({
                price: r.price, priceCurrency: r.price_currency, priceUnit: r.price_unit,
                aircraftClass: category, distanceNm: routeInfo?.distanceNm, flightTimeMin, speedKmh: r.speed_kmh,
              });

              return (
                <div key={`${r.id}-${i}`} className="rounded-xl border border-border/20 bg-card/50 p-4 flex gap-4 items-start hover:bg-secondary/20 transition-all">
                  <div className="w-28 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-secondary/30">
                    <img src={displayImage} alt={r.aircraft_type} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[14px] font-display font-medium">{r.aircraft_type}</h3>
                      {category && <span className="text-[8px] tracking-[0.15em] uppercase bg-secondary/50 text-muted-foreground/60 px-2 py-0.5 rounded">{category}</span>}
                      {r.operator?.certified && (
                        <span className="text-[8px] tracking-[0.1em] uppercase bg-primary/10 text-primary px-2 py-0.5 rounded flex items-center gap-1">
                          <Shield size={7} /> Verified
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground/60">
                      {r.max_passengers && <span className="flex items-center gap-1"><Users size={9} /> {r.max_passengers} pax</span>}
                      {r.range_km && <span className="flex items-center gap-1"><Ruler size={9} /> {r.range_km.toLocaleString()} km</span>}
                      {r.speed_kmh && <span className="flex items-center gap-1"><Gauge size={9} /> {r.speed_kmh} km/h</span>}
                      {flightTimeMin && <span className="flex items-center gap-1"><Clock size={9} /> {formatDuration(flightTimeMin)}</span>}
                      {r.year_of_production && <span className="flex items-center gap-1"><Calendar size={9} /> {r.year_of_production}</span>}
                    </div>
                    {r.amenities?.length > 0 && (
                      <div className="flex gap-1.5 mt-1.5">
                        {r.amenities.slice(0, 5).map((a: string) => (
                          <span key={a} className="text-[7px] tracking-wider uppercase bg-secondary/30 text-muted-foreground/50 px-1.5 py-0.5 rounded">{a}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-right space-y-2">
                    <div>
                      <p className={`font-display text-[15px] font-semibold ${pricing.variant === "exact" ? "text-primary" : pricing.variant === "estimate" ? "text-foreground" : "text-muted-foreground"}`}>
                        {pricing.display}
                      </p>
                      {pricing.variant === "estimate" && <p className="text-[8px] text-muted-foreground/40">estimate</p>}
                    </div>
                    <button
                      onClick={() => {
                        if (!clientId) { toast.error("Select a client first to create a quote"); return; }
                        setQuoteForm({ price: r.price?.toString() || "", validDays: "7" });
                        setQuoteDialog({ open: true, aircraft: r.aircraft_type, price: r.price });
                      }}
                      className={`px-4 py-2 text-[9px] tracking-[0.15em] uppercase font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                        clientId
                          ? "bg-gradient-gold text-primary-foreground hover:shadow-[0_0_15px_-4px_hsla(43,85%,58%,0.4)]"
                          : "bg-secondary/50 text-muted-foreground/40 border border-border/20"
                      }`}
                    >
                      Create Quote <ArrowRight size={9} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quote creation dialog */}
      <Dialog open={quoteDialog.open} onOpenChange={(o) => setQuoteDialog({ ...quoteDialog, open: o })}>
        <DialogContent className="bg-card border-border/30 max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-lg">Create Quote</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="rounded-lg bg-secondary/30 p-3">
              <p className="text-[11px] text-foreground/70 font-light">
                <span className="font-medium">{fromIcao}</span> → <span className="font-medium">{toIcao}</span>
              </p>
              <p className="text-[10px] text-muted-foreground/50 mt-0.5">{quoteDialog.aircraft} · {clientName}</p>
            </div>
            <div>
              <label className={labelClass}>Quote Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={quoteForm.price}
                onChange={(e) => setQuoteForm({ ...quoteForm, price: e.target.value })}
                className={inputClass}
                placeholder="Enter quoted price"
              />
            </div>
            <div>
              <label className={labelClass}>Valid for (days)</label>
              <input
                type="number"
                min={1}
                value={quoteForm.validDays}
                onChange={(e) => setQuoteForm({ ...quoteForm, validDays: e.target.value })}
                className={inputClass}
              />
            </div>
            <button
              onClick={handleCreateQuote}
              disabled={submitting}
              className="w-full py-3 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-lg hover:shadow-[0_0_30px_-8px_hsla(43,85%,58%,0.45)] transition-all duration-500 disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              {submitting ? <Loader2 size={12} className="animate-spin" /> : null}
              Create Quote
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InternalSearchPage;
