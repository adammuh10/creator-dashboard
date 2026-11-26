"use client";

import { useMemo } from "react";
import { BarList } from "../charts/BarList";
import { ChartCard } from "../charts/ChartCard";
import { Heatmap } from "../charts/Heatmap";
import { LineChart } from "../charts/LineChart";
import { SplitBar } from "../charts/SplitBar";
import { Card, CardHead } from "../ui/Card";
import { CountUp } from "../ui/CountUp";
import { Delta } from "../ui/Delta";
import { Filters, PageHeader } from "./PageHeader";
import { audienceOf, followersNow, postsIn, seriesByDay, sum, totals } from "@/lib/data";
import { AUDIENCE } from "@/lib/demo";
import { HARI, compact, num, pct, pctSmart } from "@/lib/format";
import { PLATFORM_COLOR, PLATFORM_LABEL } from "@/lib/platforms";
import { usePrefs } from "@/lib/prefs";
import type { Share } from "@/lib/types";

const shareItems = (s: Share[]) => s.map((x) => ({ label: x.label, value: x.pct, display: pctSmart(x.pct) }));
const HOURS = Array.from({ length: 24 }, (_, h) => String(h).padStart(2, "0"));
const GENDER_COLORS = ["var(--accent)", "var(--hl)", "var(--ink-2)"];

export function AudiensView() {
  const { period, platform } = usePrefs();
  const k = `${period}-${platform}`;
  const d = useMemo(() => {
    const a = audienceOf(platform);
    const t = totals(period, platform);
    const prev = period < 90 ? totals(period, platform, 1) : null;
    const posts = postsIn(period, platform);
    const fromFollowers = posts.length ? sum(posts, (p) => p.followersShare * p.views) / Math.max(1, sum(posts, (p) => p.views)) : 0;
    return { a, t, prev, fromFollowers, growth: seriesByDay(period, platform, "follows") };
  }, [period, platform]);
  const { a, t, prev, fromFollowers, growth } = d;
  const now = followersNow(platform);

  return (
    <>
      <PageHeader title="Audiens" sub="Siapa yang menonton: umur, gender, lokasi, jam aktif, dan pertumbuhan followers." />
      <Filters />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="!p-4">
          <p className="text-[12.5px] text-ink-2">Total followers</p>
          <CountUp value={now} format={compact} className="mt-1 block text-[24px] font-bold" />
        </Card>
        <Card className="!p-4">
          <p className="text-[12.5px] text-ink-2">Pertumbuhan bersih</p>
          <div className="mt-1 flex items-baseline gap-2">
            <CountUp value={t.netFollowers} format={(n) => `+${compact(n)}`} className="text-[24px] font-bold" />
            {prev && <Delta value={(t.netFollowers - prev.netFollowers) / Math.max(1, prev.netFollowers)} />}
          </div>
          <p className="text-[11.5px] text-ink-2">{num(t.follows)} follow · {num(t.unfollows)} unfollow</p>
        </Card>
        <Card className="!p-4">
          <p className="text-[12.5px] text-ink-2">Penonton baru</p>
          <CountUp value={a.newViewers} format={(n) => pct(n, 0)} className="mt-1 block text-[24px] font-bold" />
          <p className="text-[11.5px] text-ink-2">sisanya penonton yang kembali</p>
        </Card>
        <Card className="!p-4">
          <p className="text-[12.5px] text-ink-2">Views dari non-followers</p>
          <CountUp value={1 - fromFollowers} format={(n) => pct(n, 0)} className="mt-1 block text-[24px] font-bold" />
          <p className="text-[11.5px] text-ink-2">jangkauan ke orang baru</p>
        </Card>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <ChartCard
          className="lg:col-span-2"
          title="Follow baru per hari"
          sub="Jumlah akun yang mulai follow"
          table={{ columns: ["Tanggal", ...growth.series.map((s) => PLATFORM_LABEL[s.platform])], rows: growth.labels.map((l, i) => [l, ...growth.series.map((s) => num(s.values[i]))]) }}
        >
          <LineChart
            animKey={k}
            ariaLabel="Grafik follow baru per hari"
            labels={growth.labels}
            format={num}
            yFormat={compact}
            area={growth.series.length === 1}
            series={growth.series.map((s) => ({ key: s.platform, label: PLATFORM_LABEL[s.platform], color: PLATFORM_COLOR[s.platform], values: s.values }))}
          />
        </ChartCard>
        <Card>
          <CardHead title="Gender" />
          <SplitBar animKey={k} parts={a.gender.map((g, i) => ({ label: g.label, pct: g.pct, color: GENDER_COLORS[i] }))} />
          <div className="mt-5">
            <CardHead title="Umur" />
            <BarList animKey={k} items={shareItems(a.age)} />
          </div>
        </Card>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <ChartCard title="Kota teratas" table={{ columns: ["Kota", "Porsi"], rows: a.cities.map((c) => [c.label, pct(c.pct, 0)]) }}>
          <BarList animKey={k} items={shareItems(a.cities)} />
        </ChartCard>
        <ChartCard title="Negara teratas" table={{ columns: ["Negara", "Porsi"], rows: a.countries.map((c) => [c.label, pct(c.pct, 0)]) }}>
          <BarList animKey={k} items={shareItems(a.countries)} />
        </ChartCard>
      </div>

      <ChartCard
        className="mt-3"
        title="Jam aktif followers"
        sub="Kapan followers paling banyak membuka aplikasi"
        table={{ columns: ["Hari", ...HOURS], rows: a.active.map((r, i) => [HARI[i], ...r.map((v) => pct(v, 0))]) }}
      >
        <Heatmap animKey={k} rows={HARI} cols={HOURS} values={a.active} colLabelEvery={3} format={(v) => `${pct(v, 0)} dari puncak`} caption={(r, c, v) => `${r} jam ${c}.00: ${v}`} />
      </ChartCard>

      <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHead title="Followers vs bukan" sub="Porsi views dari followers" />
          <SplitBar
            animKey={k}
            parts={[
              { label: "Followers", pct: fromFollowers, color: "var(--accent)" },
              { label: "Bukan followers", pct: 1 - fromFollowers, color: "var(--hl)" },
            ]}
          />
          <div className="mt-5">
            <CardHead title="Penonton baru vs kembali" />
            <SplitBar
              animKey={k}
              parts={[
                { label: "Baru", pct: a.newViewers, color: "var(--accent)" },
                { label: "Kembali", pct: 1 - a.newViewers, color: "var(--hl)" },
              ]}
            />
          </div>
        </Card>
        {(platform === "all" || platform === "tiktok") && (
          <Card>
            <CardHead title="Minat followers TikTok" sub="Topik yang juga mereka tonton" />
            <ul className="flex flex-wrap gap-2">
              {AUDIENCE.tiktok.interests!.map((x) => (
                <li key={x} className="rounded-full bg-accent-soft px-3 py-1 text-[12.5px] font-medium text-accent">{x}</li>
              ))}
            </ul>
          </Card>
        )}
        {(platform === "all" || platform === "youtube") && (
          <Card>
            <CardHead title="YouTube" sub="Bahasa subtitle dan waktu tonton subscriber" />
            <BarList animKey={k} items={shareItems(AUDIENCE.youtube.languages!)} />
            <div className="mt-4">
              <SplitBar
                animKey={k}
                parts={[
                  { label: "Dari subscriber", pct: AUDIENCE.youtube.subscriberWatch!, color: "var(--accent)" },
                  { label: "Bukan subscriber", pct: 1 - AUDIENCE.youtube.subscriberWatch!, color: "var(--hl)" },
                ]}
              />
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
