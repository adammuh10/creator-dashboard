"use client";
import { useMemo, useState } from "react";
import { Card } from "../ui/Card";
import { CountUp } from "../ui/CountUp";
import { Delta } from "../ui/Delta";
import { Filters, PageHeader } from "./PageHeader";
import { SaranCard } from "./SaranCard";
import { range } from "@/lib/data";
import { dateOf } from "@/lib/demo";
import { compact, pct, shortDate } from "@/lib/format";
import { ringkasanMinggu, saranMingguIni, type Kategori } from "@/lib/insights";
import { PLATFORM_LABEL } from "@/lib/platforms";
import { usePrefs } from "@/lib/prefs";

export function SaranView() {
  const { platform } = usePrefs();
  const all = useMemo(() => saranMingguIni(platform), [platform]);
  const week = useMemo(() => ringkasanMinggu(platform), [platform]);
  const [kat, setKat] = useState<Kategori | "Semua">("Semua");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const cats = ["Semua", ...Array.from(new Set(all.map((s) => s.kategori)))] as (Kategori | "Semua")[];
  const list = kat === "Semua" ? all : all.filter((s) => s.kategori === kat);
  const r = range(7);
  const doneCount = all.filter((s) => done[s.id]).length;

  return (
    <>
      <PageHeader title="Saran minggu ini" sub={`${shortDate(dateOf(r.start))} – ${shortDate(dateOf(r.end))} · dibuat dari angka insight-mu, bukan tebakan.`} />
      <Filters period={false} />

      <div className="grid gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <p className="text-[12.5px] text-ink-2">Minggu ini</p>
          <p className="mt-1 text-[15px] font-semibold leading-snug">{week.kalimat}</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div>
              <p className="text-[12px] text-ink-2">Views</p>
              <CountUp value={week.cur.views} format={compact} className="text-[22px] font-bold" />
              <div><Delta value={week.d} label="vs minggu lalu" /></div>
            </div>
            <div>
              <p className="text-[12px] text-ink-2">Followers baru</p>
              <CountUp value={week.cur.netFollowers} format={(n) => `+${compact(n)}`} className="text-[22px] font-bold" />
            </div>
            <div>
              <p className="text-[12px] text-ink-2">Postingan</p>
              <CountUp value={week.cur.posts} format={(n) => `${Math.round(n)}`} className="text-[22px] font-bold" />
            </div>
          </div>
          {week.best && (
            <p className="mt-3 text-[12.5px] text-ink-2">
              Terbaik: <span className="font-semibold text-ink">{week.best.title}</span> ({PLATFORM_LABEL[week.best.platform]}, {compact(week.best.views)} views)
            </p>
          )}
        </Card>
        <Card>
          <p className="text-[12.5px] text-ink-2">Progres saran</p>
          <p className="mt-1 text-[22px] font-bold">
            {doneCount}/{all.length} <span className="text-[13px] font-medium text-ink-2">dilakukan</span>
          </p>
          <div className="mt-3 h-2.5 rounded-full bg-line/60">
            <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${(doneCount / Math.max(1, all.length)) * 100}%` }} />
          </div>
          <p className="mt-3 text-[12px] text-ink-2">Saran diperbarui setiap kamu impor data baru. Engagement minggu ini {pct(week.er)}.</p>
        </Card>
      </div>

      <div className="scroll-x -mx-4 mt-4 flex gap-2 px-4 sm:mx-0 sm:px-0">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setKat(c)}
            aria-pressed={kat === c}
            className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-[12.5px] font-medium ${kat === c ? "border-ink bg-ink text-page" : "border-line bg-card text-ink-2 hover:text-ink"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {list.map((s, i) => (
          <SaranCard key={s.id} s={s} i={i} done={!!done[s.id]} onDone={() => setDone((d) => ({ ...d, [s.id]: !d[s.id] }))} />
        ))}
      </div>
      <p className="mt-4 text-[12px] text-ink-2">Saran dihitung dari pola di datamu. Hasil tiap konten tetap bisa berbeda.</p>
    </>
  );
}
