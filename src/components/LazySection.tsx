import { useRef, useState, useEffect, type ReactNode } from "react";

interface LazySectionProps {
  /** Child components to render once the section scrolls into view. */
  children: ReactNode;
  /** Placeholder height while not yet visible. @default "400px" */
  minHeight?: string;
  /** IntersectionObserver rootMargin — triggers load before section reaches viewport. @default "200px" */
  rootMargin?: string;
  /** Optional skeleton/loading placeholder to show instead of empty space. */
  skeleton?: ReactNode;
}

/**
 * Defers rendering of heavy sections until they scroll near the viewport.
 * Once triggered, the section stays mounted permanently — no re-renders on scroll.
 *
 * Provides a subtle loading indicator (or custom skeleton) while content
 * hasn't loaded yet, improving perceived performance.
 *
 * @example
 * ```tsx
 * <LazySection minHeight="600px" rootMargin="300px">
 *   <HeavyChart />
 * </LazySection>
 *
 * // With custom skeleton
 * <LazySection skeleton={<CardSkeleton />}>
 *   <FleetSection />
 * </LazySection>
 * ```
 */
const LazySection = ({
  children,
  minHeight = "400px",
  rootMargin = "200px",
  skeleton,
}: LazySectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} style={{ minHeight: visible ? undefined : minHeight }}>
      {visible ? children : (
        skeleton || (
          <div className="flex items-center justify-center" style={{ minHeight }}>
            <div className="w-5 h-5 rounded-full border-2 border-primary/20 border-t-primary/60 animate-spin" />
          </div>
        )
      )}
    </div>
  );
};

export default LazySection;