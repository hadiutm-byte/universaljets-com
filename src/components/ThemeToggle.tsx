import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

/**
 * ThemeToggle — Switches between dark (default) and light mode
 * by toggling a `data-theme="light"` attribute on <html>.
 * Light mode styles are defined in index.css via the [data-theme="light"] selector.
 */
const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("uj-theme") as "dark" | "light") ?? "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
    localStorage.setItem("uj-theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={`relative w-9 h-9 flex items-center justify-center rounded-full glass border border-border/20 text-muted-foreground hover:text-white hover:border-primary/30 transition-all duration-200 ${className}`}
    >
      <motion.div
        key={theme}
        initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        {theme === "dark" ? (
          <Sun className="w-4 h-4" strokeWidth={1.5} />
        ) : (
          <Moon className="w-4 h-4" strokeWidth={1.5} />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
