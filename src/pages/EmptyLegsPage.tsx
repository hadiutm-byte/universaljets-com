import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plane, Users, Loader2 } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import PublicPageShell, { PageHero, Crumbs, CtaLink } from "@/components/public/PublicPageShell";
import EmptyLegInquiryModal from "@/components/EmptyLegInquiryModal";
import { useEmptyLegs, type EmptyLeg } from "@/hooks/useAviapages";

const REGIONS = ["All", "Middle East", "Europe", "Asia", "Africa", "Americas"];

const fmtDate = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Flexible";

const place = (a: EmptyLeg["departure"]) => (a ? a.city || a.name || a.icao || a.iata || "—" : "—");
const code = (a: EmptyLeg["departure"]) => (a ? a.icao || a.iata || "" : "");

const EmptyLegsPage = () => {
  const [region, setRegion] = useState("All");
  const [selected, setSelected] = useState<EmptyLeg | null>(null);
  const { data, isLoading, isError, refetch } = useEmptyLegs(region);

  const legs = useMemo(() => {
    const startOfToday = new Date().setHours(0, 0, 0, 0);
    return (data?.results ?? [])
      .filter((l) => {
        const last = new Date(l.to_date || l.from_date).getTime();
        return Number.isNaN(last) || last >= startOfToday;
      })
      .sort((a, b) => new Date(a.from_date).getTime() - new Date(b.from_date).getTime())
      .slice(0, 60);
  }, [data]);

  return (
    <PublicPageShell>
      <SEOHead
        title="Live Empty Leg Flights"
        description="Browse current private jet empty leg flights and enquire on the route that suits you. Availability and pricing are confirmed by an advisor."
        path="/empty-legs"
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Empty Legs", path: "/empty-legs" }]}
      />
      <PageHero
        eyebrow="Empty legs"
        title="Live empty leg flights"
        intro="Repositioning flights listed as they become available. Listings change quickly — send an enquiry and we will confirm current availability and final pricing."
      >
        <Crumbs items={[{ name: "Home", href: "/" }, { name: "Empty Legs" }]} />
      </PageHero>

      <section className="pb-20">
        <div className="container mx-auto px-5 md:px-8 max-w-5xl">
          <div className="flex gap-2 overflow-x-auto pb-4 -mx-1 px-1" role="group" aria-label="Filter by region">
            {REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                aria-pressed={region === r}
                className={`shrink-0 min-h-[44px] px-4 rounded-full border text-[11px] tracking-[0.12em] uppercase ${
                  region === r ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div aria-live="polite">
            {isLoading && (
              <p className="py-16 text-center text-muted-foreground flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={16} /> Loading live availability…
              </p>
            )}
            {isError && (
              <div className="py-16 text-center">
                <p className="text-muted-foreground mb-4">We couldn't load empty legs right now.</p>
                <button type="button" onClick={() => refetch()} className="min-h-[44px] px-6 rounded-lg border border-border text-[11px] tracking-[0.15em] uppercase">
                  Try again
                </button>
              </div>
            )}
            {!isLoading && !isError && legs.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-muted-foreground mb-6">No empty legs are listed for this region at the moment. Tell us your route and we'll watch for matches.</p>
                <CtaLink to="/private-jet-charter-dubai#quote">Request a quote</CtaLink>
              </div>
            )}
          </div>

          <ul className="grid gap-4 md:grid-cols-2">
            {legs.map((leg) => (
              <li key={leg.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-3 font-display text-lg">
                  <span>{place(leg.departure)}</span>
                  <Plane size={16} className="text-primary shrink-0" aria-label="to" />
                  <span>{place(leg.arrival)}</span>
                </div>
                <p className="text-[11px] tracking-[0.1em] text-muted-foreground mt-1">
                  {[code(leg.departure), code(leg.arrival)].filter(Boolean).join(" → ")}
                </p>
                <dl className="mt-4 grid grid-cols-2 gap-2 text-[13px] text-muted-foreground font-light">
                  <div><dt className="sr-only">Date</dt><dd>{fmtDate(leg.from_date)}</dd></div>
                  <div><dt className="sr-only">Aircraft</dt><dd>{leg.aircraft_type}</dd></div>
                  {leg.aircraft_max_pax ? (
                    <div className="flex items-center gap-1"><Users size={13} aria-hidden="true" /><dd>Up to {leg.aircraft_max_pax}</dd></div>
                  ) : null}
                  <div><dt className="sr-only">Price</dt><dd>{leg.price ? `${leg.currency} ${leg.price.toLocaleString()}` : "Price on request"}</dd></div>
                </dl>
                <button
                  type="button"
                  onClick={() => setSelected(leg)}
                  className="mt-4 w-full min-h-[48px] rounded-lg bg-gradient-gold text-primary-foreground text-[11px] tracking-[0.2em] uppercase"
                >
                  Enquire
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[12px] text-muted-foreground font-light">
            Listed prices are indicative and subject to operator confirmation. See <Link to="/pricing" className="text-primary underline">how pricing works</Link>.
          </p>
        </div>
      </section>

      <EmptyLegInquiryModal
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
        emptyLeg={selected ? {
          route: `${place(selected.departure)} → ${place(selected.arrival)}`,
          date: selected.from_date,
          aircraft: selected.aircraft_type,
        } : undefined}
      />
    </PublicPageShell>
  );
};

export default EmptyLegsPage;
