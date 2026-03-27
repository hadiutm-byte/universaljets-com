import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to top on every route change.
 * For hash links (e.g. /?scrollTo=services), scrolls to the element after a short delay.
 */
const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const scrollTo = params.get("scrollTo");

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
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
