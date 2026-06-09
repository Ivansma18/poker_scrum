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
        {theme === "dark" ? "☾" : "☼"}
      </span>
      <span>{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
