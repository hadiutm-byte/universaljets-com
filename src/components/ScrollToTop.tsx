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

    // Always scroll to top first
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    if (scrollTo) {
      // Wait for DOM to settle, then smooth-scroll to target
      requestAnimationFrame(() => {
        setTimeout(() => {
          const el = document.getElementById(scrollTo) || document.querySelector(`#${scrollTo}`);
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      });
    }
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
