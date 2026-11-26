"use client";
import type { ReactNode } from "react";
import { PLATFORM_LABEL, PLATFORMS } from "@/lib/platforms";
import { usePrefs } from "@/lib/prefs";
import type { Period, PlatformFilter } from "@/lib/types";
import { Segmented } from "../ui/Segmented";

export function PageHeader({ title, sub, children }: { title: string; sub?: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3 lg:mb-5">
      <div className="min-w-0">
        <h1 className="text-[22px] font-bold leading-tight sm:text-[26px]">{title}</h1>
        {sub && <p className="mt-1 max-w-2xl text-[13.5px] text-ink-2">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

/** Filter global: satu baris di atas semua grafik. */
export function Filters({ period = true, all = true }: { period?: boolean; all?: boolean }) {
  const { period: p, setPeriod, platform, setPlatform } = usePrefs();
  const opts: { value: PlatformFilter; label: string }[] = [
    ...(all ? [{ value: "all" as const, label: "Semua" }] : []),
    ...PLATFORMS.map((x) => ({ value: x, label: PLATFORM_LABEL[x] })),
  ];
  return (
    <div className="scroll-x -mx-4 mb-4 flex gap-2 px-4 sm:mx-0 sm:px-0 lg:mb-5">
      <Segmented<PlatformFilter> label="Platform" value={!all && platform === "all" ? "tiktok" : platform} onChange={setPlatform} options={opts} />
      {period && (
        <Segmented<Period>
          label="Periode"
          value={p}
          onChange={setPeriod}
          options={[
            { value: 7, label: "7 hari" },
            { value: 30, label: "30 hari" },
            { value: 90, label: "90 hari" },
          ]}
        />
      )}
    </div>
  );
}
