import { pct } from "@/lib/format";

export function Delta({ value, label = "vs periode lalu" }: { value: number; label?: string }) {
  const up = value >= 0;
  return (
    <span className={`inline-flex items-center gap-1 text-[12px] font-semibold ${up ? "text-good" : "text-bad"}`}>
      <span aria-hidden>{up ? "▲" : "▼"}</span>
      {pct(Math.abs(value), 0)}
      <span className="sr-only">{up ? "naik" : "turun"} {label}</span>
    </span>
  );
}
