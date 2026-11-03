import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to top on every route change.
 * For hash links (e.g. /?scrollTo=services), scrolls to the element after a short delay.
 */
const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const scrollTo = params.get("scrollTo");

    if (hash.length > 1 && !scrollTo) {
      // Lazy routes may not have rendered yet — retry briefly for the anchor
      let tries = 0;
      const id = decodeURIComponent(hash.slice(1));
      const timer = setInterval(() => {
        const el = document.getElementById(id);
        if (el || ++tries > 20) {
          clearInterval(timer);
          if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
        }
      }, 100);
      return () => clearInterval(timer);
    }

    if (scrollTo) {
      // Instant jump to target section — no visible scroll-to-top first
      requestAnimationFrame(() => {
        setTimeout(() => {
          const el = document.getElementById(scrollTo) || document.querySelector(`#${scrollTo}`);
          if (el) {
            el.scrollIntoView({ behavior: "instant", block: "start" });
          } else {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          }
        }, 100);
      });
    } else {
      // Normal page change — jump to top instantly
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;
