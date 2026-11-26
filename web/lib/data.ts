import { AUDIENCE, DAILY, DAYS, POSTS, dateOf } from "./demo";
import { shortDate } from "./format";
import { PLATFORMS } from "./platforms";
import type { Audience, Daily, Period, Platform, PlatformFilter, Post, Share } from "./types";

export const platformsOf = (f: PlatformFilter): Platform[] => (f === "all" ? PLATFORMS : [f]);

export function range(period: Period, offset = 0) {
  const end = DAYS - 1 - offset * period;
  return { start: end - period + 1, end };
}

export function dailyIn(period: Period, f: PlatformFilter, offset = 0): Daily[] {
  const { start, end } = range(period, offset);
  const ps = platformsOf(f);
  return DAILY.filter((d) => d.day >= start && d.day <= end && ps.includes(d.platform));
}

export function postsIn(period: Period, f: PlatformFilter, offset = 0): Post[] {
  const { start, end } = range(period, offset);
  const ps = platformsOf(f);
  return POSTS.filter((p) => p.day >= start && p.day <= end && ps.includes(p.platform));
}

export function sum<T>(arr: T[], fn: (x: T) => number) {
  return arr.reduce((a, x) => a + fn(x), 0);
}

export const engagement = (p: Pick<Post, "likes" | "comments" | "shares" | "saves" | "views">) =>
  p.views ? (p.likes + p.comments + p.shares + p.saves) / p.views : 0;

export function totals(period: Period, f: PlatformFilter, offset = 0) {
  const d = dailyIn(period, f, offset);
  const views = sum(d, (x) => x.views);
  const interactions = sum(d, (x) => x.interactions);
  return {
    views,
    reach: sum(d, (x) => x.reach),
    interactions,
    er: views ? interactions / views : 0,
    follows: sum(d, (x) => x.follows),
    unfollows: sum(d, (x) => x.unfollows),
    netFollowers: sum(d, (x) => x.follows - x.unfollows),
    profileVisits: sum(d, (x) => x.profileVisits),
    linkTaps: sum(d, (x) => x.linkTaps),
    posts: postsIn(period, f, offset).length,
  };
}

/** Deret harian per platform, untuk grafik garis. */
export function seriesByDay(period: Period, f: PlatformFilter, key: keyof Daily = "views") {
  const { start, end } = range(period);
  const labels: string[] = [];
  for (let d = start; d <= end; d++) labels.push(shortDate(dateOf(d)));
  const series = platformsOf(f).map((p) => ({
    platform: p,
    values: DAILY.filter((x) => x.platform === p && x.day >= start && x.day <= end).map((x) => x[key] as number),
  }));
  return { labels, series };
}

export function sparkline(period: Period, f: PlatformFilter, key: keyof Daily) {
  const { series } = seriesByDay(period, f, key);
  const n = series[0]?.values.length ?? 0;
  return Array.from({ length: n }, (_, i) => series.reduce((a, s) => a + s.values[i], 0));
}

export function followersNow(f: PlatformFilter) {
  return sum(platformsOf(f), (p) => DAILY.filter((d) => d.platform === p).at(-1)!.followers);
}

/** Gabungkan audiens beberapa platform, ditimbang jumlah followers. */
export function audienceOf(f: PlatformFilter): Audience & { platforms: Platform[] } {
  const ps = platformsOf(f);
  if (ps.length === 1) return { ...AUDIENCE[ps[0]], platforms: ps };
  const auds = ps.map((p) => AUDIENCE[p]);
  const total = sum(auds, (a) => a.followers);
  const merge = (pick: (a: Audience) => Share[]): Share[] => {
    const m = new Map<string, number>();
    for (const a of auds) for (const s of pick(a)) m.set(s.label, (m.get(s.label) ?? 0) + (s.pct * a.followers) / total);
    const arr = [...m.entries()].map(([label, pct]) => ({ label, pct }));
    const other = arr.filter((x) => x.label === "Lainnya");
    return [...arr.filter((x) => x.label !== "Lainnya").sort((a, b) => b.pct - a.pct), ...other];
  };
  const active = Array.from({ length: 7 }, (_, d) =>
    Array.from({ length: 24 }, (_, h) => sum(auds, (a) => (a.active[d][h] * a.followers) / total)),
  );
  const ageOrder = ["13–17", "18–24", "25–34", "35–44", "45–54", "55+"];
  return {
    platform: ps[0],
    platforms: ps,
    followers: total,
    gender: merge((a) => a.gender),
    age: merge((a) => a.age).sort((a, b) => ageOrder.indexOf(a.label) - ageOrder.indexOf(b.label)),
    countries: merge((a) => a.countries),
    cities: merge((a) => a.cities),
    active,
    newViewers: sum(auds, (a) => (a.newViewers * a.followers) / total),
  };
}

/** Rata-rata views per hari x blok 3 jam, dari postingan. */
export function bestTimes(posts: Post[]) {
  const blocks = ["06–09", "09–12", "12–15", "15–18", "18–21", "21–24"];
  const acc = Array.from({ length: 7 }, () => blocks.map(() => ({ v: 0, n: 0 })));
  for (const p of posts) {
    const b = Math.min(5, Math.max(0, Math.floor((p.hour - 6) / 3)));
    const wd = (new Date(Date.UTC(2026, 10, 26) - (DAYS - 1 - p.day) * 86400000).getUTCDay() + 6) % 7;
    acc[wd][b].v += p.views;
    acc[wd][b].n += 1;
  }
  const grid = acc.map((row) => row.map((c) => (c.n ? c.v / c.n : 0)));
  let best = { d: 0, b: 0, v: 0 };
  grid.forEach((row, d) => row.forEach((v, b) => v > best.v && (best = { d, b, v })));
  return { blocks, grid, best };
}

export function consistency(f: PlatformFilter, weeks: number, target: number) {
  const out: { week: number; posts: number }[] = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const end = DAYS - 1 - w * 7;
    const start = end - 6;
    out.push({ week: weeks - w, posts: POSTS.filter((p) => p.day >= start && p.day <= end && platformsOf(f).includes(p.platform)).length });
  }
  const hit = out.filter((w) => w.posts >= target).length;
  return { weeks: out, hit, rate: hit / weeks };
}
