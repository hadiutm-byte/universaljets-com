/**
 * ContentProtection — production-grade.
 * Blocks View-Source (Ctrl+U) only.
 * Does NOT block text selection, right-click, drag, F12,
 * or any other normal browsing behavior.
 */
import { useEffect } from "react";

const ContentProtection = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return null;
};

export default ContentProtection;
