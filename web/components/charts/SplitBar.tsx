"use client";
import { motion, useReducedMotion } from "motion/react";
import { pctSmart as pctS } from "@/lib/format";

/** Batang 100% bertumpuk, jarak 2px antar-bagian, label di bawah. */
export function SplitBar({ parts, animKey = "" }: { parts: { label: string; pct: number; color: string }[]; animKey?: string }) {
  const reduce = useReducedMotion();
  return (
    <div>
      <div className="flex h-3 w-full gap-[2px]" role="img" aria-label={parts.map((p) => `${p.label} ${pctS(p.pct)}`).join(", ")}>
        {parts.map((p, i) => (
          <motion.span
            key={`${p.label}${animKey}`}
            className="h-full rounded-[4px]"
            style={{ background: p.color }}
            initial={reduce ? false : { flexGrow: 0.0001 }}
            animate={{ flexGrow: p.pct }}
            transition={{ type: "spring", stiffness: 90, damping: 18, delay: i * 0.08 }}
          />
        ))}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            <span className="text-ink-2">{p.label}</span>
            <span className="tnum font-semibold">{pctS(p.pct)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
