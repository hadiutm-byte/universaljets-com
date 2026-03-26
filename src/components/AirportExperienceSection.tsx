import { motion } from "framer-motion";
import { Building2, Shield, Users, Loader2 } from "lucide-react";
import { useDestinationFbos, type ApiFbo } from "@/hooks/useDestinationData";
import { useMemo } from "react";

/** Featured hub ICAOs — top business aviation airports for the concierge context */
const FEATURED_ICAOS = ["OMDB", "OMSJ", "EGLF", "LFPB", "LSGG", "LIML"];

const AirportExperienceSection = () => {
  const { data: fbos, isLoading } = useDestinationFbos(FEATURED_ICAOS);

  const highlights = useMemo(() => {
    if (!fbos?.length) return [];
    const unique = fbos.reduce((acc: ApiFbo[], f) => {
      if (!acc.find((x) => x.name === f.name)) acc.push(f);
      return acc;
    }, []);
    return unique
      .filter((f) => f.vip_lounge || f.customs)
      .sort((a, b) => (b.vip_lounge ? 1 : 0) - (a.vip_lounge ? 1 : 0))
      .slice(0, 6);
  }, [fbos]);

  if (!isLoading && highlights.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-6 md:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-[11px] tracking-[0.4em] uppercase text-primary mb-4 font-medium">The Airport Experience</p>
          <h2 className="font-display text-2xl md:text-4xl font-semibold text-foreground mb-4">
            Private Terminal <span className="text-gradient-gold italic">Access</span>
          </h2>
          <p className="text-[14px] text-muted-foreground font-light leading-relaxed max-w-lg mx-auto">
            Your journey begins at the terminal — not the queue. We arrange private facilities with VIP lounges, dedicated customs, and direct tarmac boarding worldwide.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-primary/40" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {highlights.map((fbo, i) => (
              <motion.div
                key={fbo.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="rounded-2xl border border-border bg-card p-6 group hover:border-primary/20 transition-all duration-500"
              >
                <div className="w-10 h-10 rounded-xl border border-border bg-muted/30 flex items-center justify-center mb-4 group-hover:border-primary/30 transition-all duration-500">
                  <Building2 className="w-4 h-4 text-primary/60" strokeWidth={1.2} />
                </div>
                <h3 className="font-display text-sm font-semibold text-foreground mb-1">{fbo.name}</h3>
                <p className="text-[10px] text-muted-foreground/50 font-light mb-3">
                  {fbo.city || fbo.airport_name} · {fbo.airport_icao}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {fbo.vip_lounge && (
                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-[9px] tracking-[0.1em] text-primary/70 font-medium uppercase">VIP Lounge</span>
                  )}
                  {fbo.customs && (
                    <span className="px-2 py-0.5 rounded-md bg-muted text-[9px] tracking-[0.1em] text-muted-foreground/60 font-medium uppercase">Private Customs</span>
                  )}
                  {fbo.hangar && (
                    <span className="px-2 py-0.5 rounded-md bg-muted text-[9px] tracking-[0.1em] text-muted-foreground/60 font-medium uppercase">Hangar</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-2 mt-8 text-[10px] text-muted-foreground/40 font-light"
        >
          <Shield size={10} className="text-primary/30" />
          <span>Your advisor coordinates all terminal arrangements before departure.</span>
        </motion.div>
      </div>
    </section>
  );
};

export default AirportExperienceSection;
