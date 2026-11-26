"use client";
import { motion, useReducedMotion } from "motion/react";

export function Ring({ value, size = 108, label, sub }: { value: number; size?: number; label: string; sub?: string }) {
  const reduce = useReducedMotion();
  const s = 10;
  const rad = (size - s) / 2;
  const c = 2 * Math.PI * rad;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`${label} ${sub ?? ""}`}>
        <circle cx={size / 2} cy={size / 2} r={rad} fill="none" stroke="var(--line)" strokeWidth={s} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={rad}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={s}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={reduce ? false : { strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - value) }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[22px] font-bold leading-none">{label}</span>
        {sub && <span className="mt-1 text-[11px] text-ink-2">{sub}</span>}
      </div>
    </div>
  );
}
