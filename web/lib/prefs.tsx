"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Period, PlatformFilter } from "./types";

export type ThemeName = "krem" | "lavender" | "laut" | "mawar" | "mono";
export type ModePref = "sistem" | "light" | "dark";

export const THEMES: { id: ThemeName; label: string; swatch: [string, string, string] }[] = [
  { id: "krem", label: "Krem", swatch: ["#f5efe6", "#1f5f3f", "#c9557c"] },
  { id: "lavender", label: "Lavender", swatch: ["#f3f1fa", "#5a45c0", "#b8651f"] },
  { id: "laut", label: "Laut", swatch: ["#eef4f7", "#17608f", "#b8651f"] },
  { id: "mawar", label: "Mawar", swatch: ["#faf0ef", "#9b3553", "#8a6a12"] },
  { id: "mono", label: "Mono", swatch: ["#f3f3f2", "#222222", "#555555"] },
];

interface Prefs {
  theme: ThemeName;
  mode: ModePref;
  setTheme: (t: ThemeName) => void;
  setMode: (m: ModePref) => void;
  period: Period;
  setPeriod: (p: Period) => void;
  platform: PlatformFilter;
  setPlatform: (p: PlatformFilter) => void;
}

const Ctx = createContext<Prefs | null>(null);

function applyMode(m: ModePref) {
  const dark = m === "dark" || (m === "sistem" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.setAttribute("data-mode", dark ? "dark" : "light");
}

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("krem");
  const [mode, setModeState] = useState<ModePref>("sistem");
  const [period, setPeriod] = useState<Period>(30);
  const [platform, setPlatform] = useState<PlatformFilter>("all");

  useEffect(() => {
    try {
      const t = localStorage.getItem("cd-theme") as ThemeName | null;
      const m = localStorage.getItem("cd-mode") as ModePref | null;
      if (t) setThemeState(t);
      if (m) setModeState(m);
    } catch {}
  }, []);

  useEffect(() => {
    if (mode !== "sistem") return;
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const on = () => applyMode("sistem");
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [mode]);

  const setTheme = useCallback((t: ThemeName) => {
    setThemeState(t);
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("cd-theme", t); } catch {}
  }, []);

  const setMode = useCallback((m: ModePref) => {
    setModeState(m);
    applyMode(m);
    try { localStorage.setItem("cd-mode", m); } catch {}
  }, []);

  return (
    <Ctx.Provider value={{ theme, mode, setTheme, setMode, period, setPeriod, platform, setPlatform }}>
      {children}
    </Ctx.Provider>
  );
}

export function usePrefs() {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePrefs di luar PrefsProvider");
  return v;
}
