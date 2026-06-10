import { AnimatePresence, motion } from "motion/react";
import type { ThemePreference } from "../hooks/use-theme-preference";

type ThemeToggleProps = {
  theme: ThemePreference;
  onToggleTheme: () => void;
};

export function ThemeToggle({ theme, onToggleTheme }: ThemeToggleProps) {
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={onToggleTheme}
      className="theme-toggle touch-target"
      aria-label={`Switch to ${nextTheme} theme`}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        <AnimatePresence mode="wait">
          <motion.span
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            {theme === "dark" ? "☾" : "☼"}
          </motion.span>
        </AnimatePresence>
      </span>
      <span>{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
