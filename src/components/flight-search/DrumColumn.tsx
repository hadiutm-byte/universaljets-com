import { useRef, useEffect, useCallback } from "react";

const ITEM_H = 40;
const VIS = 7;
const DRUM_H = ITEM_H * VIS;
const MID = Math.floor(VIS / 2);

export { ITEM_H, VIS, DRUM_H, MID };

interface DrumColumnProps {
  options: { value: string; label: string }[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const DrumColumn = ({ options, selectedIndex, onSelect }: DrumColumnProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isUserScroll = useRef(true);

  useEffect(() => {
    if (ref.current) {
      isUserScroll.current = false;
      ref.current.scrollTop = selectedIndex * ITEM_H;
      requestAnimationFrame(() => {
        isUserScroll.current = true;
      });
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (!ref.current || !isUserScroll.current) return;
    const idx = Math.round(ref.current.scrollTop / ITEM_H);
    const clamped = Math.max(0, Math.min(idx, options.length - 1));
    if (clamped !== selectedIndex) onSelect(clamped);
  }, [options.length, selectedIndex, onSelect]);

  const scrollToIndex = (idx: number) => {
    if (ref.current) {
      ref.current.scrollTo({ top: idx * ITEM_H, behavior: "smooth" });
    }
    onSelect(idx);
  };

  return (
    <div
      className="relative flex-1 overflow-hidden"
      style={{
        height: DRUM_H,
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)",
      }}
    >
      <div
        ref={ref}
        onScroll={handleScroll}
        className="h-full overflow-y-auto scrollbar-none"
        style={{
          scrollSnapType: "y mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div style={{ height: MID * ITEM_H }} />
        {options.map((opt, i) => {
          const dist = Math.abs(i - selectedIndex);
          const rotX =
            Math.min(dist, 3) * (i < selectedIndex ? 22 : -22);
          const sc = dist === 0 ? 1 : Math.max(0.72, 1 - dist * 0.1);
          const op = dist === 0 ? 1 : Math.max(0.2, 1 - dist * 0.25);
          return (
            <div
              key={opt.value + i}
              onClick={() => scrollToIndex(i)}
              className="snap-center flex items-center justify-center cursor-pointer"
              style={{ height: ITEM_H, perspective: "280px" }}
            >
              <span
                className="transition-all duration-75 ease-out select-none whitespace-nowrap"
                style={{
                  transform: `rotateX(${rotX}deg) scale(${sc})`,
                  opacity: op,
                  fontSize: dist === 0 ? "16px" : "14px",
                  fontWeight: dist === 0 ? 600 : 400,
                  color:
                    dist === 0
                      ? "hsl(var(--foreground))"
                      : `hsl(var(--muted-foreground) / ${op})`,
                }}
              >
                {opt.label}
              </span>
            </div>
          );
        })}
        <div style={{ height: MID * ITEM_H }} />
      </div>
    </div>
  );
};

export default DrumColumn;
