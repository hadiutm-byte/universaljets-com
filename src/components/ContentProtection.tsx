import { useEffect } from "react";

const ContentProtection = () => {
  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();

    // Disable right-click context menu
    document.addEventListener("contextmenu", prevent);

    // Disable common copy/inspect shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "u" || e.key === "U" || e.key === "s" || e.key === "S")
      ) {
        e.preventDefault();
      }
      if (e.key === "F12") {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Disable drag on images
    document.addEventListener("dragstart", prevent);

    // Disable text selection via CSS
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";

    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", prevent);
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
    };
  }, []);

  return null;
};

export default ContentProtection;
