"use client";

import { useEffect, useState } from "react";

export type ThemePreference = "light" | "dark";

const themeStorageKey = "planning-poker.theme.v1";

export function useThemePreference() {
  const [theme, setTheme] = useState<ThemePreference>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }

  return {
    theme,
    toggleTheme,
  };
}

function getInitialTheme(): ThemePreference {
  if (typeof window === "undefined") {
    return "dark";
  }

  const storedTheme = window.localStorage.getItem(themeStorageKey);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia?.("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}
