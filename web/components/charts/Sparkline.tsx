"use client";
import { motion, useReducedMotion } from "motion/react";

export function Sparkline({ values, color = "var(--accent)", height = 32, animKey = "" }: { values: number[]; color?: string; height?: number; animKey?: string }) {
  const reduce = useReducedMotion();
  const w = 100;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const d = values
    .map((v, i) => `${i ? "L" : "M"}${((i / Math.max(1, values.length - 1)) * w).toFixed(2)},${(height - 2 - ((v - min) / (max - min || 1)) * (height - 4)).toFixed(2)}`)
    .join("");
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="block h-8 w-full" aria-hidden>
      <motion.path
        key={animKey}
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0, opacity: 0.4 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
      />
    </svg>
  );
}
