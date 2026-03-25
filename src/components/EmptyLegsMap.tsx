import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, Plane } from "lucide-react";

interface Route {
  id: number;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  fromCoords: [number, number]; // [x%, y%] on map
  toCoords: [number, number];
  aircraft: string;
  date: string;
  savings: string;
  region: string;
}

const routes: Route[] = [
  { id: 1, from: "New York", fromCode: "TEB", to: "Miami", toCode: "OPF", fromCoords: [23, 40], toCoords: [24, 50], aircraft: "Citation XLS+", date: "Apr 12", savings: "65%", region: "Americas" },
  { id: 2, from: "London", fromCode: "LTN", to: "Geneva", toCode: "GVA", fromCoords: [47, 30], toCoords: [49, 33], aircraft: "Phenom 300E", date: "Apr 15", savings: "70%", region: "Europe" },
  { id: 3, from: "Dubai", fromCode: "DWC", to: "London", toCode: "LTN", fromCoords: [62, 42], toCoords: [47, 30], aircraft: "Global 6000", date: "Apr 18", savings: "75%", region: "Middle East" },
  { id: 4, from: "Los Angeles", fromCode: "VNY", to: "Las Vegas", toCode: "LAS", fromCoords: [15, 40], toCoords: [17, 38], aircraft: "Citation CJ3+", date: "Apr 22", savings: "60%", region: "Americas" },
  { id: 5, from: "Paris", fromCode: "LBG", to: "Nice", toCode: "NCE", fromCoords: [48, 32], toCoords: [49.5, 35], aircraft: "Phenom 100EV", date: "Apr 25", savings: "55%", region: "Europe" },
  { id: 6, from: "Singapore", fromCode: "SIN", to: "Hong Kong", toCode: "HKG", fromCoords: [78, 56], toCoords: [80, 44], aircraft: "Falcon 2000LXS", date: "May 1", savings: "68%", region: "Asia" },
];

const regions = ["All", "Americas", "Europe", "Middle East", "Asia"];

const EmptyLegsMap = () => {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [activeRegion, setActiveRegion] = useState("All");

  const filteredRoutes = useMemo(
    () => activeRegion === "All" ? routes : routes.filter((r) => r.region === activeRegion),
    [activeRegion]
  );

  const handleRouteClick = useCallback((route: Route) => {
    setSelectedRoute(route);
  }, []);

  return (
    <section id="empty-legs" className="section-padding overflow-hidden">
      <div className="container mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[9px] tracking-[0.5em] uppercase text-gold/70 mb-6 font-light">Exclusive Opportunity</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold mb-6">Empty Legs</h2>
          <p className="text-[13px] text-muted-foreground font-extralight max-w-md mx-auto leading-[2]">
            One-way repositioning flights at up to 75% off. The smartest way to fly private.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setActiveRegion(r)}
              className={`px-5 py-2 rounded-full text-[9px] tracking-[0.25em] uppercase font-light transition-all duration-500 ${
                activeRegion === r
                  ? "bg-gradient-gold text-primary-foreground glow-gold"
                  : "luxury-border text-muted-foreground hover:text-foreground luxury-border-hover"
              }`}
            >
              {r}
            </button>
          ))}
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative glass rounded-2xl p-6 md:p-10 mb-16 overflow-hidden"
        >
          {/* Dark world map SVG background */}
          <div className="relative w-full" style={{ paddingBottom: "45%" }}>
            <svg
              viewBox="0 0 100 45"
              className="absolute inset-0 w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Simplified world continents */}
              <defs>
                <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsla(38,52%,50%,0.04)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <rect width="100" height="45" fill="url(#mapGlow)" />

              {/* North America */}
              <path d="M10 12 L28 10 L30 18 L28 28 L22 32 L18 30 L12 22 L8 16 Z" fill="hsla(0,0%,100%,0.03)" stroke="hsla(0,0%,100%,0.06)" strokeWidth="0.15" />
              {/* South America */}
              <path d="M22 32 L28 30 L30 38 L26 44 L20 42 L18 36 Z" fill="hsla(0,0%,100%,0.03)" stroke="hsla(0,0%,100%,0.06)" strokeWidth="0.15" />
              {/* Europe */}
              <path d="M42 10 L55 8 L56 18 L52 22 L46 20 L42 16 Z" fill="hsla(0,0%,100%,0.03)" stroke="hsla(0,0%,100%,0.06)" strokeWidth="0.15" />
              {/* Africa */}
              <path d="M42 22 L56 20 L58 36 L50 42 L44 38 L42 28 Z" fill="hsla(0,0%,100%,0.03)" stroke="hsla(0,0%,100%,0.06)" strokeWidth="0.15" />
              {/* Asia */}
              <path d="M56 8 L85 6 L88 20 L82 30 L68 32 L58 24 Z" fill="hsla(0,0%,100%,0.03)" stroke="hsla(0,0%,100%,0.06)" strokeWidth="0.15" />
              {/* Oceania */}
              <path d="M78 34 L90 32 L92 40 L84 42 Z" fill="hsla(0,0%,100%,0.03)" stroke="hsla(0,0%,100%,0.06)" strokeWidth="0.15" />

              {/* Grid dots */}
              {[...Array(10)].map((_, xi) =>
                [...Array(5)].map((_, yi) => (
                  <circle
                    key={`${xi}-${yi}`}
                    cx={5 + xi * 10}
                    cy={4.5 + yi * 9}
                    r="0.15"
                    fill="hsla(0,0%,100%,0.05)"
                  />
                ))
              )}

              {/* Route lines */}
              {filteredRoutes.map((route) => (
                <g key={route.id}>
                  <line
                    x1={route.fromCoords[0]}
                    y1={route.fromCoords[1]}
                    x2={route.toCoords[0]}
                    y2={route.toCoords[1]}
                    stroke="hsla(38,52%,50%,0.25)"
                    strokeWidth="0.2"
                    strokeDasharray="0.8 0.4"
                  />
                  {/* From dot */}
                  <circle
                    cx={route.fromCoords[0]}
                    cy={route.fromCoords[1]}
                    r="0.6"
                    fill="hsla(38,52%,50%,0.8)"
                    className="cursor-pointer"
                    onClick={() => handleRouteClick(route)}
                  />
                  <circle
                    cx={route.fromCoords[0]}
                    cy={route.fromCoords[1]}
                    r="1.2"
                    fill="none"
                    stroke="hsla(38,52%,50%,0.2)"
                    strokeWidth="0.1"
                    className="animate-pulse-glow"
                  />
                  {/* To dot */}
                  <circle
                    cx={route.toCoords[0]}
                    cy={route.toCoords[1]}
                    r="0.6"
                    fill="hsla(38,52%,50%,0.8)"
                    className="cursor-pointer"
                    onClick={() => handleRouteClick(route)}
                  />
                  <circle
                    cx={route.toCoords[0]}
                    cy={route.toCoords[1]}
                    r="1.2"
                    fill="none"
                    stroke="hsla(38,52%,50%,0.2)"
                    strokeWidth="0.1"
                    className="animate-pulse-glow"
                  />
                </g>
              ))}
            </svg>

            {/* Clickable overlay labels */}
            {filteredRoutes.map((route) => (
              <button
                key={route.id}
                onClick={() => handleRouteClick(route)}
                className="absolute transform -translate-x-1/2 -translate-y-full group z-10"
                style={{ left: `${route.fromCoords[0]}%`, top: `${route.fromCoords[1]}%` }}
              >
                <span className="hidden md:block text-[8px] tracking-[0.15em] text-gold/60 uppercase whitespace-nowrap group-hover:text-gold transition-colors mb-1">
                  {route.fromCode}
                </span>
              </button>
            ))}
          </div>

          {/* Route popup */}
          <AnimatePresence>
            {selectedRoute && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-4 md:inset-auto md:right-8 md:top-8 md:w-80 glass-strong rounded-xl p-6 z-20"
              >
                <button
                  onClick={() => setSelectedRoute(null)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={14} />
                </button>
                <p className="text-[9px] tracking-[0.3em] uppercase text-gold/70 mb-4 font-light">{selectedRoute.date}</p>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-display text-lg">{selectedRoute.from}</span>
                  <ArrowRight size={14} className="text-gold/50" />
                  <span className="font-display text-lg">{selectedRoute.to}</span>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground font-extralight">Aircraft</span>
                    <span className="text-foreground/80 font-light">{selectedRoute.aircraft}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground font-extralight">Savings</span>
                    <span className="text-gold font-medium">Up to {selectedRoute.savings}</span>
                  </div>
                </div>
                <a
                  href="#cta"
                  className="block w-full py-3 bg-gradient-gold text-primary-foreground text-[9px] tracking-[0.25em] uppercase font-medium rounded-md text-center hover:shadow-[0_0_25px_-5px_hsla(38,52%,50%,0.4)] transition-all duration-500"
                >
                  Request This Flight
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Empty Legs Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {filteredRoutes.map((leg, i) => (
            <motion.div
              key={leg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="glass rounded-xl p-7 hover:glow-subtle transition-all duration-700 group cursor-pointer"
              onClick={() => handleRouteClick(leg)}
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-[9px] tracking-[0.2em] text-muted-foreground uppercase font-extralight">{leg.date}</span>
                <span className="text-[9px] tracking-[0.2em] text-gold font-medium uppercase">Save {leg.savings}</span>
              </div>
              <div className="flex items-center gap-3 mb-5">
                <span className="font-display text-base">{leg.fromCode}</span>
                <div className="flex-1 flex items-center gap-1.5 px-1">
                  <div className="flex-1 h-[0.5px] bg-border" />
                  <Plane size={10} className="text-gold/50 flex-shrink-0" />
                  <div className="flex-1 h-[0.5px] bg-border" />
                </div>
                <span className="font-display text-base">{leg.toCode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-extralight">{leg.aircraft}</span>
                <ArrowRight size={10} className="text-gold/40 group-hover:text-gold group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EmptyLegsMap;
