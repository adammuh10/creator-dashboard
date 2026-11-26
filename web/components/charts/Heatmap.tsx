"use client";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

/** Peta panas satu warna (warna aksen tema), terang = kecil, pekat = besar. */
export function Heatmap({
  rows,
  cols,
  values,
  format,
  caption,
  animKey = "",
  colLabelEvery = 1,
}: {
  rows: string[];
  cols: string[];
  values: number[][];
  format: (v: number) => string;
  caption: (r: string, c: string, v: string) => string;
  animKey?: string;
  colLabelEvery?: number;
}) {
  const reduce = useReducedMotion();
  const max = Math.max(...values.flat(), 1);
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);
  const bg = (v: number) => `color-mix(in oklab, var(--accent) ${Math.round(6 + (v / max) * 94)}%, var(--card))`;
  return (
    <div>
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: `34px repeat(${cols.length}, minmax(0,1fr))` }} role="img" aria-label="Peta panas">
        <span />
        {cols.map((c, i) => (
          <span key={c} className="truncate text-center text-[10px] text-ink-2">
            {i % colLabelEvery === 0 ? c : ""}
          </span>
        ))}
        {rows.map((r, ri) => (
          <div key={r} className="contents">
            <span className="self-center text-[10.5px] text-ink-2">{r}</span>
            {cols.map((c, ci) => (
              <motion.button
                key={`${c}${animKey}`}
                type="button"
                aria-label={caption(r, c, format(values[ri][ci]))}
                onPointerEnter={() => setHover({ r: ri, c: ci })}
                onFocus={() => setHover({ r: ri, c: ci })}
                onPointerLeave={() => setHover(null)}
                className={`h-[18px] rounded-[4px] outline-offset-1 sm:h-5 ${hover?.r === ri && hover?.c === ci ? "ring-2 ring-ink" : ""}`}
                style={{ background: bg(values[ri][ci]) }}
                initial={reduce ? false : { opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: Math.min(0.9, (ci + ri) * 0.025) }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between gap-3 text-[11.5px] text-ink-2">
        <span className="min-h-[1.2em]">{hover ? caption(rows[hover.r], cols[hover.c], format(values[hover.r][hover.c])) : "Arahkan ke kotak untuk melihat angkanya"}</span>
        <span className="flex shrink-0 items-center gap-1.5">
          sedikit
          <span className="h-2 w-14 rounded-full" style={{ background: "linear-gradient(90deg, color-mix(in oklab, var(--accent) 6%, var(--card)), var(--accent))" }} />
          banyak
        </span>
      </div>
    </div>
  );
}
