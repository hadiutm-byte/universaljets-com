import { useRef, useState, useEffect, type ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  /** Placeholder height while not yet visible */
  minHeight?: string;
  /** IntersectionObserver rootMargin — load before it scrolls into view */
  rootMargin?: string;
}

/**
 * Defers rendering of heavy sections until they scroll near the viewport.
 * Once triggered, the section stays mounted permanently.
 */
const LazySection = ({
  children,
  minHeight = "400px",
  rootMargin = "200px",
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
      {visible ? children : null}
    </div>
  );
};

export default LazySection;
