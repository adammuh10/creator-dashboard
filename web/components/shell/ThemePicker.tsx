"use client";
import { THEMES, usePrefs, type ModePref } from "@/lib/prefs";
import { Icon } from "../ui/Icon";
import { Segmented } from "../ui/Segmented";

export function ThemePicker() {
  const { theme, setTheme, mode, setMode } = usePrefs();
  return (
    <div className="space-y-3">
      <div>
        <p className="mb-2 text-[12px] font-semibold text-ink-2">Warna dashboard</p>
        <div className="grid grid-cols-5 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              aria-pressed={theme === t.id}
              className={`flex flex-col items-center gap-1 rounded-xl border p-1.5 text-[11px] transition ${theme === t.id ? "border-accent bg-accent-soft" : "border-line hover:border-ink-2"}`}
            >
              <span className="flex h-7 w-full overflow-hidden rounded-lg">
                {t.swatch.map((c) => (
                  <span key={c} className="flex-1" style={{ background: c }} />
                ))}
              </span>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-[12px] font-semibold text-ink-2">Mode</p>
        <Segmented<ModePref>
          label="Mode terang atau gelap"
          value={mode}
          onChange={setMode}
          options={[
            { value: "light", label: "Terang" },
            { value: "dark", label: "Gelap" },
            { value: "sistem", label: "Ikuti sistem" },
          ]}
        />
      </div>
    </div>
  );
}

export function ThemeButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label="Ganti warna dashboard" className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-card text-ink hover:bg-line/50">
      <Icon name="palette" />
    </button>
  );
}
