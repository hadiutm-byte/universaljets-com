import { useEffect } from "react";

const MILESTONES = [25, 50, 75, 100];

/**
 * Pushes scroll depth milestones (25%, 50%, 75%, 100%) to GTM dataLayer.
 * Each milestone fires only once per page load.
 */
const useScrollDepthTracking = () => {
  useEffect(() => {
    const fired = new Set<number>();

    const handler = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const percent = Math.round((scrollTop / docHeight) * 100);

      for (const m of MILESTONES) {
        if (percent >= m && !fired.has(m)) {
          fired.add(m);
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: "scroll_depth",
            scroll_percentage: m,
            page_path: window.location.pathname,
          });
        }
      }
    };

    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
};

export default useScrollDepthTracking;
