"use client";
import { motion, useReducedMotion } from "motion/react";

export interface BarItem {
  label: string;
  value: number;
  display: string;
  color?: string;
  hint?: string;
}

export function BarList({ items, max, animKey = "", color = "var(--accent)" }: { items: BarItem[]; max?: number; animKey?: string; color?: string }) {
  const reduce = useReducedMotion();
  const top = max ?? Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li key={it.label} className="group grid grid-cols-[minmax(84px,34%)_1fr_auto] items-center gap-3 rounded-lg px-1 py-1 hover:bg-line/40" title={it.hint ?? `${it.label}: ${it.display}`}>
          <span className="truncate text-[12.5px] text-ink">{it.label}</span>
          <span className="h-2.5 rounded-full bg-line/50">
            <motion.span
              key={animKey}
              className="block h-full rounded-[4px]"
              style={{ background: it.color ?? color }}
              initial={reduce ? false : { width: 0 }}
              animate={{ width: `${Math.max(1.5, (it.value / top) * 100)}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20, delay: i * 0.05 }}
            />
          </span>
          <span className="tnum text-right text-[12.5px] font-semibold">{it.display}</span>
        </li>
      ))}
    </ul>
  );
}
