import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Globe, Clock, TrendingDown } from "lucide-react";

const stats = [
  { icon: Globe, value: 6000, suffix: "+", label: "Aircraft Worldwide", format: true },
  { icon: Clock, value: 24, suffix: "/7", label: "Global Coverage", format: false },
  { icon: TrendingDown, value: 30, suffix: "%", label: "Better Pricing", prefix: "Up to ", format: false },
];

const AnimatedCounter = ({ value, suffix, prefix, format }: { value: number; suffix: string; prefix?: string; format?: boolean }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const duration = 2000;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * end);
      setCount(start);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, value]);

  const display = format ? count.toLocaleString() : count;

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{display}{suffix}
    </span>
  );
};

const LiveMarketSection = () => (
  <section className="relative py-20 md:py-28 overflow-hidden">
    {/* Terminal-style background grid */}
    <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
      style={{
        backgroundImage: `linear-gradient(hsla(38,52%,50%,0.3) 1px, transparent 1px), linear-gradient(90deg, hsla(38,52%,50%,0.3) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-background via-[hsl(228,22%,4%)] to-background pointer-events-none" />

    <div className="container mx-auto px-8 relative z-10">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 max-w-4xl mx-auto mb-16">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center group"
          >
            <div className="w-12 h-12 rounded-full luxury-border flex items-center justify-center mx-auto mb-6 group-hover:glow-subtle transition-all duration-700">
              <s.icon className="w-5 h-5 text-primary/60" strokeWidth={1.2} />
            </div>
            <p className="font-display text-[2.5rem] md:text-[3.5rem] font-semibold text-gradient-gold leading-none mb-3">
              <AnimatedCounter value={s.value} suffix={s.suffix} prefix={s.prefix} format={s.format} />
            </p>
            <p className="text-[9px] tracking-[0.4em] uppercase text-foreground/40 font-light">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Divider */}
      <div className="divider-gold mb-16" />

      {/* Bold statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl mx-auto"
      >
        <p className="text-[9px] tracking-[0.5em] uppercase text-primary/60 mb-8 font-light">
          Live Market Intelligence
        </p>
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground mb-6 leading-tight">
          We don't sell aircraft.
        </h2>
        <p className="text-[14px] md:text-[16px] text-foreground/50 font-extralight leading-[2] mb-4">
          We give you access to the{" "}
          <span className="text-gradient-gold italic font-light">entire market.</span>
        </p>
        <p className="text-[11px] text-foreground/25 font-extralight leading-[2] max-w-md mx-auto">
          Real-time market intelligence. Operator relationships across 190+ countries. Pricing advantages no single fleet can offer.
        </p>
      </motion.div>
    </div>
  </section>
);

export default LiveMarketSection;
