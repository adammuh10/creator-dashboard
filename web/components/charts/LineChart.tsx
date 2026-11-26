"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useMemo, useState } from "react";
import { useWidth } from "../ui/hooks";

export interface LineSeries {
  key: string;
  label: string;
  color: string;
  values: number[];
}

function niceMax(v: number) {
  if (v <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(v));
  const n = v / p;
  const m = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return m * p;
}

export function LineChart({
  labels,
  series,
  height = 240,
  format,
  yFormat,
  area,
  animKey = "",
  ariaLabel,
  yMax,
}: {
  labels: string[];
  series: LineSeries[];
  height?: number;
  format: (n: number) => string;
  yFormat?: (n: number) => string;
  area?: boolean;
  animKey?: string;
  ariaLabel: string;
  yMax?: number;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const reduce = useReducedMotion();
  const gid = useId().replace(/:/g, "");
  const [hover, setHover] = useState<number | null>(null);
  const n = labels.length;
  const multi = series.length > 1;
  const endLabels = multi && series.length <= 4 && width > 420;
  const m = { l: 44, r: endLabels ? 82 : 10, t: 10, b: 26 };
  const iw = Math.max(10, width - m.l - m.r);
  const ih = height - m.t - m.b;
  const max = yMax ?? niceMax(Math.max(1, ...series.flatMap((s) => s.values)));
  const x = (i: number) => m.l + (n <= 1 ? iw / 2 : (i * iw) / (n - 1));
  const y = (v: number) => m.t + ih * (1 - v / max);
  const yf = yFormat ?? format;

  const paths = useMemo(
    () =>
      series.map((s) => ({
        ...s,
        d: s.values.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(""),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [series, width, height, max],
  );

  // label ujung garis, didorong supaya tidak bertumpuk
  const ends = useMemo(() => {
    const arr = series.map((s) => ({ key: s.key, label: s.label, color: s.color, y: y(s.values.at(-1) ?? 0) }));
    arr.sort((a, b) => a.y - b.y);
    for (let i = 1; i < arr.length; i++) if (arr[i].y - arr[i - 1].y < 15) arr[i].y = arr[i - 1].y + 15;
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series, width, height, max]);

  const tickEvery = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(iw / 70))));
  const onMove = (e: React.PointerEvent<SVGRectElement>) => {
    const box = (e.currentTarget as SVGRectElement).getBoundingClientRect();
    const px = e.clientX - box.left;
    const i = Math.round((px / box.width) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  };

  return (
    <div>
      {multi && (
        <ul className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-ink-2" aria-label="Legenda">
          {series.map((s) => (
            <li key={s.key} className="flex items-center gap-1.5">
              <span className="h-[3px] w-3.5 rounded-full" style={{ background: s.color }} />
              {s.label}
            </li>
          ))}
        </ul>
      )}
      <div ref={ref} className="relative w-full" style={{ height }}>
        {width > 0 && (
          <svg width={width} height={height} role="img" aria-label={ariaLabel} className="block overflow-visible">
            {area && !multi && (
              <defs>
                <linearGradient id={`g${gid}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={series[0].color} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={series[0].color} stopOpacity={0} />
                </linearGradient>
              </defs>
            )}
            {[0, 0.25, 0.5, 0.75, 1].map((t) => (
              <g key={t}>
                <line x1={m.l} x2={m.l + iw} y1={y(max * t)} y2={y(max * t)} stroke={t === 0 ? "var(--axis)" : "var(--grid)"} strokeWidth={1} />
                <text x={m.l - 8} y={y(max * t)} dy="0.32em" textAnchor="end" className="fill-ink-2 text-[10.5px] tnum">
                  {yf(max * t)}
                </text>
              </g>
            ))}
            {labels.map((l, i) =>
              (i % tickEvery === 0 && x(n - 1) - x(i) > 44) || i === n - 1 ? (
                <text key={i} x={x(i)} y={height - 6} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} className="fill-ink-2 text-[10.5px]">
                  {l}
                </text>
              ) : null,
            )}
            {area && !multi && (
              <motion.path
                key={`a${animKey}`}
                d={`${paths[0].d}L${x(n - 1)},${y(0)}L${x(0)},${y(0)}Z`}
                fill={`url(#g${gid})`}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            )}
            {paths.map((p, i) => (
              <motion.path
                key={`${p.key}${animKey}`}
                d={p.d}
                fill="none"
                stroke={p.color}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1], delay: i * 0.15 }}
              />
            ))}
            {endLabels &&
              ends.map((e, i) => (
                <motion.text
                  key={`${e.key}${animKey}`}
                  x={m.l + iw + 8}
                  y={e.y}
                  dy="0.32em"
                  className="fill-ink text-[11.5px] font-medium"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + i * 0.15 }}
                >
                  {e.label}
                </motion.text>
              ))}
            <AnimatePresence>
              {hover !== null && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
                  <motion.line
                    y1={m.t}
                    y2={m.t + ih}
                    stroke="var(--axis)"
                    strokeWidth={1}
                    animate={{ x1: x(hover), x2: x(hover) }}
                    transition={{ type: "spring", stiffness: 600, damping: 40 }}
                  />
                  {series.map((s) => (
                    <motion.circle
                      key={s.key}
                      r={4.5}
                      fill={s.color}
                      stroke="var(--card)"
                      strokeWidth={2}
                      animate={{ cx: x(hover), cy: y(s.values[hover]) }}
                      transition={{ type: "spring", stiffness: 600, damping: 40 }}
                    />
                  ))}
                </motion.g>
              )}
            </AnimatePresence>
            <rect
              x={m.l}
              y={0}
              width={iw}
              height={height}
              fill="transparent"
              onPointerMove={onMove}
              onPointerDown={onMove}
              onPointerLeave={() => setHover(null)}
              style={{ touchAction: "pan-y" }}
            />
          </svg>
        )}
        <AnimatePresence>
          {hover !== null && width > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0, left: Math.min(Math.max(x(hover) - 80, 0), width - 170) }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 600, damping: 42 }}
              className="pointer-events-none absolute top-0 z-10 w-[170px] rounded-xl border border-line bg-card px-3 py-2 text-[12px] shadow-lg"
            >
              <div className="mb-1 font-semibold">{labels[hover]}</div>
              {series.map((s) => (
                <div key={s.key} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-ink-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                    {s.label}
                  </span>
                  <span className="tnum font-semibold">{format(s.values[hover])}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
