/**
 * ContentProtection — production-grade.
 * Blocks View-Source (Ctrl+U) and F12 shortcuts.
 * Does NOT block text selection, right-click, or drag
 * (those interfere with legitimate UX on touch devices).
 */
import { useEffect } from "react";

const ContentProtection = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "u" || e.key === "U")
      ) {
        e.preventDefault();
      }
      if (e.key === "F12") {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return null;
};

export default ContentProtection;
