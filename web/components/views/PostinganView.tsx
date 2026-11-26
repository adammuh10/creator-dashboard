"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { BarList } from "../charts/BarList";
import { ChartCard } from "../charts/ChartCard";
import { LineChart } from "../charts/LineChart";
import { SplitBar } from "../charts/SplitBar";
import { Card, CardHead } from "../ui/Card";
import { CountUp } from "../ui/CountUp";
import { Icon } from "../ui/Icon";
import { Filters, PageHeader } from "./PageHeader";
import { engagement, postsIn, sum } from "@/lib/data";
import { LIVES, STORIES, YT_REVENUE, dateOf } from "@/lib/demo";
import { compact, duration, num, pct, rupiah, shortDate } from "@/lib/format";
import { PLATFORM_COLOR, PLATFORM_LABEL } from "@/lib/platforms";
import { usePrefs } from "@/lib/prefs";
import type { Post } from "@/lib/types";

type Col = { key: string; label: string; get: (p: Post) => number; fmt: (n: number) => string; only?: Post["platform"] };

const COLS: Col[] = [
  { key: "views", label: "Views", get: (p) => p.views, fmt: num },
  { key: "reach", label: "Jangkauan", get: (p) => p.reach, fmt: num },
  { key: "likes", label: "Suka", get: (p) => p.likes, fmt: num },
  { key: "comments", label: "Komentar", get: (p) => p.comments, fmt: num },
  { key: "shares", label: "Bagikan", get: (p) => p.shares, fmt: num },
  { key: "saves", label: "Simpan", get: (p) => p.saves, fmt: num },
  { key: "er", label: "ER", get: engagement, fmt: (n) => pct(n) },
  { key: "completion", label: "Ditonton habis", get: (p) => p.completion ?? -1, fmt: (n) => (n < 0 ? "–" : pct(n, 0)) },
  { key: "avgWatch", label: "Rata-rata tonton", get: (p) => p.avgWatchSec ?? -1, fmt: (n) => (n < 0 ? "–" : duration(n)) },
  { key: "followers", label: "Followers baru", get: (p) => p.newFollowers, fmt: num },
  { key: "visits", label: "Kunjungan profil", get: (p) => p.profileVisits, fmt: num },
  { key: "ctr", label: "CTR", get: (p) => p.ctr ?? -1, fmt: (n) => (n < 0 ? "–" : pct(n)), only: "youtube" },
];

const avg = (ps: Post[], f: (p: Post) => number) => (ps.length ? sum(ps, f) / ps.length : 0);

function Stat({ label, value, format }: { label: string; value: number; format: (n: number) => string }) {
  return (
    <Card className="!p-4">
      <p className="text-[12.5px] text-ink-2">{label}</p>
      <CountUp value={value} format={format} className="mt-1 block text-[22px] font-bold leading-tight" />
    </Card>
  );
}

function PostDetail({ p, onClose }: { p: Post; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  const d = dateOf(p.day);
  const metrics: [string, string][] = [
    ["Views", num(p.views)],
    [p.platform === "tiktok" ? "Penonton unik" : "Jangkauan", num(p.reach)],
    ["Suka", num(p.likes)],
    ["Komentar", num(p.comments)],
    ["Bagikan", num(p.shares)],
    ["Simpan", num(p.saves)],
    ["Engagement rate", pct(engagement(p))],
    ["Kunjungan profil", num(p.profileVisits)],
    [p.platform === "youtube" ? "Subscriber baru" : "Followers baru", num(p.newFollowers)],
  ];
  if (p.avgWatchSec !== undefined) metrics.push(["Rata-rata ditonton", duration(p.avgWatchSec)]);
  if (p.completion !== undefined) metrics.push([p.platform === "youtube" ? "% ditonton" : "Ditonton sampai habis", pct(p.completion, 0)]);
  if (p.impressions) metrics.push(["Impresi", num(p.impressions)], ["CTR impresi", pct(p.ctr!)]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end lg:items-stretch">
      <motion.div className="absolute inset-0 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={p.title}
        className="relative max-h-[90dvh] w-full overflow-y-auto rounded-t-3xl border-line bg-card p-5 pb-10 lg:max-h-none lg:w-[460px] lg:rounded-none lg:border-l"
        initial={{ y: "100%", x: 0 }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 380, damping: 40 }}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-[12px] text-ink-2">
              {PLATFORM_LABEL[p.platform]} · {p.format}
              {p.durationSec ? ` · ${duration(p.durationSec)}` : ""} · {shortDate(d)} {String(p.hour).padStart(2, "0")}.00
            </p>
            <h2 className="mt-0.5 text-[18px] font-bold leading-snug">{p.title}</h2>
          </div>
          <button onClick={onClose} aria-label="Tutup" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg hover:bg-line/50">
            <Icon name="x" />
          </button>
        </div>
        <dl className="grid grid-cols-2 gap-2">
          {metrics.map(([l, v], i) => (
            <motion.div key={l} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.025 }} className="rounded-xl bg-page/60 p-2.5">
              <dt className="text-[11.5px] text-ink-2">{l}</dt>
              <dd className="tnum text-[16px] font-bold">{v}</dd>
            </motion.div>
          ))}
        </dl>
        {p.retention && (
          <section className="mt-5">
            <h3 className="mb-1 text-[14px] font-semibold">Retensi penonton</h3>
            <p className="mb-2 text-[12px] text-ink-2">Porsi penonton yang masih menonton di tiap titik video.</p>
            <LineChart
              height={180}
              ariaLabel="Grafik retensi penonton"
              labels={p.retention.map((_, i) => (p.durationSec ? duration((p.durationSec * i) / 20) : `${i * 5}%`))}
              series={[{ key: "ret", label: "Masih menonton", color: PLATFORM_COLOR[p.platform], values: p.retention.map((v) => v * 100) }]}
              format={(n) => `${Math.round(n)}%`}
              yMax={100}
              area
            />
          </section>
        )}
        <section className="mt-5">
          <h3 className="mb-2 text-[14px] font-semibold">Dari mana penontonnya</h3>
          <SplitBar
            parts={[
              { label: "Followers", pct: p.followersShare, color: "var(--accent)" },
              { label: "Bukan followers", pct: 1 - p.followersShare, color: "var(--hl)" },
            ]}
          />
          <div className="mt-4">
            <BarList items={p.sources.map((s) => ({ label: s.label, value: s.pct, display: pct(s.pct, 0) }))} />
          </div>
        </section>
      </motion.aside>
    </div>
  );
}

export function PostinganView() {
  const { period, platform } = usePrefs();
  const k = `${period}-${platform}`;
  const posts = useMemo(() => postsIn(period, platform), [period, platform]);
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 }>({ key: "views", dir: -1 });
  const [open, setOpen] = useState<Post | null>(null);
  const cols = COLS.filter((c) => !c.only || platform === c.only);
  const col = cols.find((c) => c.key === sort.key) ?? cols[0];
  const sorted = [...posts].sort((a, b) => (col.get(a) - col.get(b)) * sort.dir);
  const videos = posts.filter((p) => p.durationSec && p.format !== "Video panjang");

  // Kalau formatnya cuma satu (mis. TikTok), bandingkan per topik supaya tidak jadi grafik satu batang.
  const byFormat = new Set(posts.map((p) => p.format)).size > 1;
  const groupKey = (p: Post) => (byFormat ? p.format : p.topic);
  const formats = Array.from(new Set(posts.map(groupKey)))
    .map((f) => {
      const ps = posts.filter((p) => groupKey(p) === f);
      return { label: `${f} (${ps.length})`, value: avg(ps, (p) => p.views), display: compact(avg(ps, (p) => p.views)) };
    })
    .sort((a, b) => b.value - a.value);
  const buckets: [string, number, number][] = [["≤ 15 dtk", 0, 15], ["16–30 dtk", 16, 30], ["31–60 dtk", 31, 60], ["> 60 dtk", 61, 1e9]];
  const durs = buckets
    .map(([label, lo, hi]) => {
      const ps = videos.filter((p) => p.durationSec! >= lo && p.durationSec! <= hi);
      return { label, value: avg(ps, (p) => p.views), display: ps.length ? compact(avg(ps, (p) => p.views)) : "–", hint: `${label}: ${ps.length} video, ditonton habis ${pct(avg(ps, (p) => p.completion ?? 0), 0)}` };
    });
  const srcMap = new Map<string, number>();
  for (const p of posts) for (const s of p.sources) srcMap.set(s.label, (srcMap.get(s.label) ?? 0) + s.pct * p.views);
  const totalViews = sum(posts, (p) => p.views) || 1;
  const sources = [...srcMap.entries()].map(([label, v]) => ({ label, value: v / totalViews, display: pct(v / totalViews, 0) })).sort((a, b) => b.value - a.value).slice(0, 7);

  const kpis: { label: string; value: number; format: (n: number) => string }[] =
    platform === "youtube"
      ? [
          { label: "Views", value: totalViews, format: compact },
          { label: "Waktu tonton (jam)", value: sum(posts, (p) => (p.views * (p.avgWatchSec ?? 0)) / 3600), format: (n) => num(n) },
          { label: "CTR impresi", value: avg(posts, (p) => p.ctr ?? 0), format: (n) => pct(n) },
          { label: "Subscriber baru", value: sum(posts, (p) => p.newFollowers), format: (n) => `+${compact(n)}` },
        ]
      : [
          { label: "Views", value: totalViews, format: compact },
          { label: "Rata-rata per post", value: avg(posts, (p) => p.views), format: compact },
          { label: platform === "instagram" ? "Simpan" : "Ditonton habis", value: platform === "instagram" ? sum(posts, (p) => p.saves) : avg(videos, (p) => p.completion ?? 0), format: platform === "instagram" ? compact : (n) => pct(n, 0) },
          { label: "Bagikan", value: sum(posts, (p) => p.shares), format: compact },
        ];

  return (
    <>
      <PageHeader title="Postingan" sub="Semua metrik insight per postingan. Klik satu baris untuk detail, retensi, dan sumber penonton." />
      <Filters />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((x) => (
          <Stat key={x.label} {...x} />
        ))}
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <ChartCard title={`Rata-rata views per ${byFormat ? "format" : "topik"}`} table={{ columns: [byFormat ? "Format" : "Topik", "Rata-rata views"], rows: formats.map((f) => [f.label, num(f.value)]) }}>
          <BarList animKey={k} items={formats} />
        </ChartCard>
        <ChartCard title="Durasi video" sub="Rata-rata views per panjang video" table={{ columns: ["Durasi", "Rata-rata views"], rows: durs.map((f) => [f.label, f.display]) }}>
          <BarList animKey={k} items={durs} />
        </ChartCard>
        <ChartCard title="Sumber penonton" sub="Ditimbang dari views" table={{ columns: ["Sumber", "Porsi"], rows: sources.map((s) => [s.label, s.display]) }}>
          <BarList animKey={k} items={sources} />
        </ChartCard>
      </div>

      <Card className="mt-3 !p-0">
        <div className="p-4 pb-2 sm:p-5 sm:pb-2">
          <CardHead title={`${posts.length} postingan`} sub="Klik judul kolom untuk mengurutkan." />
        </div>
        <div className="scroll-x">
          <table className="w-full min-w-[980px] text-[12.5px]">
            <thead>
              <tr className="border-y border-line text-ink-2">
                <th className="sticky left-0 bg-card px-4 py-2 text-left font-medium sm:px-5">Postingan</th>
                {cols.map((c) => (
                  <th key={c.key} className="px-2 py-2 text-right font-medium">
                    <button onClick={() => setSort((s) => ({ key: c.key, dir: s.key === c.key ? (s.dir === 1 ? -1 : 1) : -1 }))} className={`whitespace-nowrap ${sort.key === c.key ? "font-semibold text-ink" : "hover:text-ink"}`}>
                      {c.label}
                      {sort.key === c.key ? (sort.dir === -1 ? " ↓" : " ↑") : ""}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <tr key={p.id} onClick={() => setOpen(p)} className="cursor-pointer border-b border-line/70 bg-card odd:bg-[color-mix(in_oklab,var(--page)_45%,var(--card))] hover:bg-accent-soft">
                  <td className="sticky left-0 max-w-[260px] bg-inherit px-4 py-2 sm:px-5">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: PLATFORM_COLOR[p.platform] }} title={PLATFORM_LABEL[p.platform]} />
                      <span className="truncate font-medium">{p.title}</span>
                    </div>
                    <p className="pl-[18px] text-[11px] text-ink-2">
                      {PLATFORM_LABEL[p.platform]} · {p.format} · {shortDate(dateOf(p.day))}
                    </p>
                  </td>
                  {cols.map((c) => (
                    <td key={c.key} className="tnum whitespace-nowrap px-2 py-2 text-right">
                      {c.fmt(c.get(p))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {platform === "instagram" && (
        <Card className="mt-3 !p-0">
          <div className="p-4 pb-2 sm:p-5 sm:pb-2">
            <CardHead title="Story" sub="30 hari terakhir" />
          </div>
          <div className="scroll-x">
            <table className="w-full min-w-[860px] text-[12.5px]">
              <thead>
                <tr className="border-y border-line text-ink-2">
                  {["Story", "Views", "Jangkauan", "Maju", "Kembali", "Keluar", "Story berikutnya", "Balasan", "Klik link", "Tap stiker"].map((h, i) => (
                    <th key={h} className={`whitespace-nowrap px-2 py-2 font-medium ${i ? "text-right" : "pl-4 text-left sm:pl-5"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...STORIES].reverse().map((s) => (
                  <tr key={s.id} className="border-b border-line/70 odd:bg-page/30">
                    <td className="px-2 py-2 pl-4 sm:pl-5">
                      <span className="font-medium">{s.title}</span> <span className="text-[11px] text-ink-2">{shortDate(dateOf(s.day))}</span>
                    </td>
                    {[s.views, s.reach, s.forward, s.back, s.exits, s.nextStory, s.replies, s.linkClicks, s.stickerTaps].map((v, i) => (
                      <td key={i} className="tnum px-2 py-2 text-right">{v ? num(v) : "–"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {platform === "tiktok" && (
        <Card className="mt-3">
          <CardHead title="LIVE" sub="Sesi siaran langsung" />
          <div className="grid gap-3 md:grid-cols-3">
            {LIVES.map((l) => (
              <div key={l.id} className="rounded-xl border border-line p-3">
                <p className="text-[13.5px] font-semibold">{l.title}</p>
                <p className="text-[11.5px] text-ink-2">{shortDate(dateOf(l.day))} · {l.durationMin} menit</p>
                <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[12px]">
                  {([
                    ["Views", num(l.views)],
                    ["Penonton unik", num(l.uniqueViewers)],
                    ["Puncak penonton", num(l.peak)],
                    ["Rata-rata tonton", `${String(l.avgWatchMin).replace(".", ",")} mnt`],
                    ["Followers baru", num(l.newFollowers)],
                    ["Komentar", num(l.comments)],
                    ["Pemberi gift", num(l.gifters)],
                    ["Diamond", num(l.diamonds)],
                  ] as [string, string][]).map(([a, b]) => (
                    <div key={a} className="flex justify-between gap-2">
                      <dt className="text-ink-2">{a}</dt>
                      <dd className="tnum font-semibold">{b}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </Card>
      )}

      {platform === "youtube" && (
        <Card className="mt-3">
          <CardHead title="Pendapatan YouTube (perkiraan)" sub="90 hari terakhir, dari YouTube Studio" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {([
              ["Perkiraan pendapatan", YT_REVENUE.revenue],
              ["RPM", YT_REVENUE.rpm],
              ["CPM", YT_REVENUE.cpm],
              ["YouTube Premium", YT_REVENUE.premium],
            ] as [string, number][]).map(([l, v]) => (
              <div key={l} className="rounded-xl bg-page/60 p-3">
                <p className="text-[12px] text-ink-2">{l}</p>
                <CountUp value={v} format={rupiah} className="text-[18px] font-bold" />
              </div>
            ))}
          </div>
        </Card>
      )}

      <AnimatePresence>{open && <PostDetail p={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </>
  );
}
