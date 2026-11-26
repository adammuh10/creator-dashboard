"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useMemo } from "react";
import { BarList } from "../charts/BarList";
import { ChartCard } from "../charts/ChartCard";
import { Heatmap } from "../charts/Heatmap";
import { LineChart } from "../charts/LineChart";
import { Ring } from "../charts/Ring";
import { Sparkline } from "../charts/Sparkline";
import { Card, CardHead } from "../ui/Card";
import { CountUp } from "../ui/CountUp";
import { Delta } from "../ui/Delta";
import { Icon } from "../ui/Icon";
import { Filters, PageHeader } from "./PageHeader";
import { SaranCard } from "./SaranCard";
import { bestTimes, consistency, engagement, postsIn, seriesByDay, sparkline, totals } from "@/lib/data";
import { PROFILE } from "@/lib/demo";
import { HARI, HARI_PANJANG, compact, num, pct } from "@/lib/format";
import { ringkasanMinggu, saranMingguIni } from "@/lib/insights";
import { PLATFORM_COLOR, PLATFORM_LABEL } from "@/lib/platforms";
import { usePrefs } from "@/lib/prefs";
import type { Daily } from "@/lib/types";

function Kpi({ label, value, format, d, spark, k }: { label: string; value: number; format: (n: number) => string; d?: number; spark: number[]; k: string }) {
  return (
    <Card className="!p-4">
      <p className="text-[12.5px] text-ink-2">{label}</p>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <CountUp value={value} format={format} className="whitespace-nowrap text-[22px] font-bold leading-none sm:text-[26px]" />
        {d !== undefined && <Delta value={d} />}
      </div>
      <div className="mt-3">
        <Sparkline values={spark} animKey={k} />
      </div>
    </Card>
  );
}

export function RingkasanView() {
  const { period, platform } = usePrefs();
  const k = `${period}-${platform}`;
  const data = useMemo(() => {
    const cur = totals(period, platform);
    const prev = period < 90 ? totals(period, platform, 1) : null;
    const d = (a: number, b?: number) => (prev && b ? (a - b) / b : undefined);
    const sp = (key: keyof Daily) => sparkline(period, platform, key);
    const line = seriesByDay(period, platform);
    const posts = postsIn(period, platform);
    const bt = bestTimes(postsIn(90, platform));
    const target = platform === "all" ? PROFILE.weeklyTarget : Math.ceil(PROFILE.weeklyTarget / 2);
    const cons = consistency(platform, 8, target);
    return {
      cur,
      prev,
      d,
      sp,
      line,
      top: [...posts].sort((a, b) => b.views - a.views).slice(0, 5),
      bt,
      target,
      cons,
      saran: saranMingguIni(platform).slice(0, 3),
      week: ringkasanMinggu(platform),
    };
  }, [period, platform]);
  const { cur, prev, d, sp, line, top, bt, target, cons, saran, week } = data;

  return (
    <>
      <PageHeader title={`Halo, ${PROFILE.name}`} sub={week.kalimat} />
      <Filters />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi k={k} label="Views" value={cur.views} format={compact} d={d(cur.views, prev?.views)} spark={sp("views")} />
        <Kpi k={k} label="Jangkauan" value={cur.reach} format={compact} d={d(cur.reach, prev?.reach)} spark={sp("reach")} />
        <Kpi k={k} label="Engagement" value={cur.er} format={(n) => pct(n)} d={d(cur.er, prev?.er)} spark={sp("interactions")} />
        <Kpi k={k} label="Followers baru" value={cur.netFollowers} format={(n) => `+${compact(n)}`} d={d(cur.netFollowers, prev?.netFollowers)} spark={sp("follows")} />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <ChartCard
          className="lg:col-span-2"
          title="Views per hari"
          sub={platform === "all" ? "Per platform" : PLATFORM_LABEL[platform]}
          table={{
            columns: ["Tanggal", ...line.series.map((s) => PLATFORM_LABEL[s.platform])],
            rows: line.labels.map((l, i) => [l, ...line.series.map((s) => num(s.values[i]))]),
          }}
        >
          <LineChart
            animKey={k}
            ariaLabel="Grafik views per hari"
            labels={line.labels}
            format={num}
            yFormat={compact}
            area={line.series.length === 1}
            series={line.series.map((s) => ({ key: s.platform, label: PLATFORM_LABEL[s.platform], color: PLATFORM_COLOR[s.platform], values: s.values }))}
          />
        </ChartCard>

        <Card>
          <CardHead
            title="Saran minggu ini"
            sub="Dari data insight-mu"
            right={
              <Link href="/saran" className="flex items-center gap-1 text-[12.5px] font-semibold text-accent">
                Semua <Icon name="arrow" className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <div className="space-y-2">
            {saran.map((s, i) => (
              <SaranCard key={s.id} s={s} i={i} compact />
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <ChartCard
          title="Jam terbaik posting"
          sub={`Paling tinggi: ${HARI_PANJANG[bt.best.d]} ${bt.blocks[bt.best.b]}`}
          table={{ columns: ["Hari", ...bt.blocks], rows: bt.grid.map((r, i) => [HARI[i], ...r.map((v) => (v ? compact(v) : "–"))]) }}
        >
          <Heatmap
            animKey={k}
            rows={HARI}
            cols={bt.blocks}
            values={bt.grid}
            format={(v) => (v ? `${compact(v)} views` : "belum ada post")}
            caption={(r, c, v) => `${r} ${c}: ${v}`}
          />
        </ChartCard>

        <Card>
          <CardHead title="Konsistensi posting" sub={`Target ${target} post per minggu`} />
          <div className="flex items-center gap-4">
            <Ring value={cons.rate} label={pct(cons.rate, 0)} sub={`${cons.hit}/8 minggu`} />
            <div className="flex h-[108px] flex-1 items-end gap-1.5" role="img" aria-label="Jumlah post per minggu">
              {cons.weeks.map((w, i) => {
                const max = Math.max(target, ...cons.weeks.map((x) => x.posts));
                return (
                  <div key={w.week} className="flex flex-1 flex-col items-center gap-1">
                    <span className="tnum text-[10px] text-ink-2">{w.posts}</span>
                    <motion.span
                      key={k}
                      className="w-full rounded-t-[4px]"
                      style={{ background: w.posts >= target ? "var(--accent)" : "color-mix(in oklab, var(--accent) 30%, var(--card))" }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(w.posts / max) * 72}px` }}
                      transition={{ type: "spring", stiffness: 140, damping: 18, delay: i * 0.05 }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <p className="mt-3 text-[12px] text-ink-2">Batang pekat = minggu yang mencapai target.</p>
        </Card>

        <Card>
          <CardHead title="Aktivitas profil" sub={`${period} hari terakhir`} />
          <BarList
            animKey={k}
            items={[
              { label: "Kunjungan profil", value: cur.profileVisits, display: compact(cur.profileVisits) },
              { label: "Follow", value: cur.follows, display: compact(cur.follows) },
              { label: "Klik link di bio", value: cur.linkTaps, display: compact(cur.linkTaps) },
              { label: "Unfollow", value: cur.unfollows, display: compact(cur.unfollows) },
            ]}
          />
          <p className="mt-3 text-[12px] text-ink-2">{cur.posts} postingan di periode ini.</p>
        </Card>
      </div>

      <Card className="mt-3">
        <CardHead
          title="Postingan teratas"
          sub={`${period} hari terakhir`}
          right={
            <Link href="/postingan" className="flex items-center gap-1 text-[12.5px] font-semibold text-accent">
              Semua <Icon name="arrow" className="h-3.5 w-3.5" />
            </Link>
          }
        />
        <ol className="divide-y divide-line">
          {top.map((p, i) => (
            <motion.li
              key={`${p.id}${k}`}
              className="flex items-center gap-3 py-2.5"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <span className="w-5 text-center text-[12px] font-semibold text-ink-2">{i + 1}</span>
              <span className="h-9 w-9 shrink-0 rounded-lg" style={{ background: `color-mix(in oklab, ${PLATFORM_COLOR[p.platform]} 22%, var(--card))` }} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-medium">{p.title}</p>
                <p className="text-[11.5px] text-ink-2">
                  {PLATFORM_LABEL[p.platform]} · {p.format}
                </p>
              </div>
              <div className="text-right">
                <p className="tnum text-[13.5px] font-semibold">{compact(p.views)}</p>
                <p className="tnum text-[11.5px] text-ink-2">ER {pct(engagement(p))}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </Card>
    </>
  );
}
