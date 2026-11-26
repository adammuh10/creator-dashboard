// Data contoh yang deterministik (hasil sama di server dan browser).
// Nanti diganti data impor pengguna dari database.
import type {
  Audience,
  Daily,
  Format,
  Live,
  Platform,
  Post,
  Story,
  YtRevenue,
} from "./types";

export const DAYS = 90;
// 26 Nov 2026 = hari terakhir data (indeks DAYS - 1)
export const LAST_DATE_UTC = Date.UTC(2026, 10, 26);

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const r = rng(20261126);
const between = (a: number, b: number) => a + (b - a) * r();
const pick = <T,>(arr: T[]) => arr[Math.floor(r() * arr.length)];
const round = Math.round;

/** 0 = Senin ... 6 = Minggu */
export function weekday(day: number) {
  const d = new Date(LAST_DATE_UTC - (DAYS - 1 - day) * 86400000);
  return (d.getUTCDay() + 6) % 7;
}
export function dateOf(day: number) {
  return new Date(LAST_DATE_UTC - (DAYS - 1 - day) * 86400000);
}

const TOPICS: Record<string, { f: number; titles: string[] }> = {
  "Hair oil": { f: 1.9, titles: ["Hair oil part 1", "Hair oil part 2", "Hair oil part 3", "Hair oil vs serum", "Hair oil untuk rambut kering"] },
  "Rambut rontok": { f: 1.6, titles: ["3 penyebab rambut rontok", "Rambut rontok setelah begadang", "Sampo anti rontok murah"] },
  Skincare: { f: 1.1, titles: ["Skincare pagi 5 menit", "Skincare malam", "Urutan skincare yang benar", "Sunscreen di bawah 50 ribu"] },
  OOTD: { f: 0.8, titles: ["OOTD kampus", "OOTD hujan", "Mix and match 3 outfit"] },
  Review: { f: 0.75, titles: ["Review sampo viral", "Review masker rambut", "Haul skincare Shopee"] },
  "Day in my life": { f: 0.65, titles: ["Day in my life mahasiswa", "Vlog belanja bulanan", "Ngonten seharian"] },
};
const TOPIC_KEYS = Object.keys(TOPICS);
const HOURS = [7, 9, 12, 16, 19, 20, 21];

function slotFactor(day: number, hour: number) {
  const wd = weekday(day);
  let f = 1;
  if (hour >= 19 && hour <= 21) f *= 1.35;
  if (hour <= 9) f *= 0.72;
  if (wd === 4 || wd === 5) f *= 1.3; // Jum, Sab
  if (wd === 1 && hour <= 12) f *= 0.6; // Sel pagi
  return f;
}

function sources(p: Platform): { label: string; pct: number }[] {
  const raw: [string, number][] =
    p === "tiktok"
      ? [["For You", between(62, 78)], ["Profil", between(6, 12)], ["Following", between(4, 9)], ["Pencarian", between(5, 14)], ["Suara", between(1, 4)]]
      : p === "instagram"
        ? [["Tab Reels", between(40, 58)], ["Beranda", between(18, 30)], ["Explore", between(8, 18)], ["Profil", between(4, 9)], ["Hashtag", between(1, 4)]]
        : [["Feed Shorts", between(40, 60)], ["Pencarian YouTube", between(10, 20)], ["Video yang disarankan", between(8, 18)], ["Fitur jelajah", between(5, 12)], ["Eksternal", between(1, 5)]];
  const sum = raw.reduce((a, b) => a + b[1], 0);
  return raw.map(([label, v]) => ({ label, pct: v / sum }));
}

function retention(completion: number, hook: number): number[] {
  // turun tajam di 10% awal (hook), lalu meluruh sampai titik "selesai"
  const pts: number[] = [];
  const afterHook = 1 - hook;
  const k = -Math.log(Math.max(completion, 0.05) / afterHook);
  for (let i = 0; i <= 20; i++) {
    const x = i / 20;
    const v = x <= 0.1 ? 1 - (hook * x) / 0.1 : afterHook * Math.exp((-k * (x - 0.1)) / 0.9);
    pts.push(Math.max(0, Math.min(1, v)));
  }
  return pts;
}

function makePosts(): Post[] {
  const posts: Post[] = [];
  const used = new Map<string, number>();
  const plan: { p: Platform; n: number; base: number }[] = [
    { p: "tiktok", n: 34, base: 9500 },
    { p: "instagram", n: 26, base: 5200 },
    { p: "youtube", n: 12, base: 2600 },
  ];
  for (const { p, n, base } of plan) {
    for (let i = 0; i < n; i++) {
      const day = Math.min(DAYS - 1, Math.floor((i + between(0.1, 0.9)) * (DAYS / n)));
      const topic = pick(TOPIC_KEYS);
      const t = TOPICS[topic];
      const hour = pick(HOURS);
      let format: Format = "Video";
      let durationSec: number | undefined;
      if (p === "tiktok") durationSec = round(pick([between(14, 45), between(20, 58), between(61, 110)]));
      if (p === "instagram") {
        format = pick<Format>(["Reels", "Reels", "Reels", "Carousel", "Carousel", "Foto"]);
        if (format === "Reels") durationSec = round(pick([between(12, 45), between(20, 58), between(62, 95)]));
      }
      if (p === "youtube") {
        format = i % 4 === 3 ? "Video panjang" : "Shorts";
        durationSec = format === "Shorts" ? round(between(18, 58)) : round(between(420, 900));
      }
      const hook = between(0.18, 0.5);
      const long = durationSec !== undefined && durationSec > 60 && format !== "Video panjang";
      const durF = long ? 0.45 : 1;
      const hookF = 1.35 - hook;
      const noise = Math.exp(between(-0.35, 0.35));
      const fmtF = format === "Carousel" ? 0.55 : format === "Foto" ? 0.35 : format === "Video panjang" ? 0.7 : 1;
      const views = round(base * t.f * slotFactor(day, hour) * durF * hookF * noise * fmtF);
      const isVideo = durationSec !== undefined;
      const completion = isVideo
        ? Math.max(0.06, Math.min(0.72, (format === "Video panjang" ? 0.28 : 0.62) - (durationSec! / (format === "Video panjang" ? 4000 : 220)) + (0.3 - hook) * 0.5))
        : undefined;
      const saveRate = format === "Carousel" ? between(0.03, 0.055) : between(0.006, 0.02) * (topic === "Hair oil" || topic === "Rambut rontok" ? 1.6 : 1);
      const pickedTitle = pick(t.titles);
      const seen = (used.get(`${p}${pickedTitle}`) ?? 0) + 1;
      used.set(`${p}${pickedTitle}`, seen);
      const titleBase =
        seen === 1
          ? pickedTitle
          : /part \d/.test(pickedTitle)
            ? pickedTitle.replace(/part (\d)/, (_, d) => `part ${Number(d) + 3 * (seen - 1)}`)
            : `${pickedTitle} (${seen})`;
      const post: Post = {
        id: `${p}-${i}`,
        platform: p,
        title: format === "Carousel" ? `${titleBase} (carousel)` : titleBase,
        topic,
        format,
        day,
        hour,
        durationSec,
        views,
        reach: round(views * between(0.7, 0.86)),
        likes: round(views * between(0.05, 0.09) * Math.sqrt(t.f)),
        comments: round(views * between(0.003, 0.009)),
        shares: round(views * between(0.003, 0.013) * t.f),
        saves: round(views * saveRate),
        profileVisits: round(views * between(0.01, 0.022)),
        newFollowers: round(views * between(0.003, 0.009) * (t.f > 1.2 ? 1.4 : 1)),
        followersShare: between(0.22, 0.5),
        completion,
        avgWatchSec: isVideo ? Math.round(durationSec! * (completion! * 0.55 + 0.22)) : undefined,
        retention: isVideo ? retention(completion!, hook) : undefined,
        sources: sources(p),
      };
      if (p === "youtube") {
        post.ctr = between(0.028, 0.092);
        post.impressions = round(views / post.ctr);
      }
      posts.push(post);
    }
  }
  return posts.sort((a, b) => a.day - b.day || a.hour - b.hour);
}

const START_FOLLOWERS: Record<Platform, number> = { tiktok: 29400, instagram: 16900, youtube: 3900 };
const BASELINE: Record<Platform, number> = { tiktok: 1400, instagram: 900, youtube: 380 };

function makeDaily(posts: Post[]): Daily[] {
  const out: Daily[] = [];
  const decay = [0.46, 0.24, 0.12, 0.07, 0.04, 0.03, 0.02, 0.02];
  for (const p of ["tiktok", "instagram", "youtube"] as Platform[]) {
    const views = new Array(DAYS).fill(0);
    const follows = new Array(DAYS).fill(0);
    const visits = new Array(DAYS).fill(0);
    const inter = new Array(DAYS).fill(0);
    for (const post of posts.filter((x) => x.platform === p)) {
      decay.forEach((d, k) => {
        const day = post.day + k;
        if (day < DAYS) {
          views[day] += post.views * d;
          follows[day] += post.newFollowers * d;
          visits[day] += post.profileVisits * d;
          inter[day] += (post.likes + post.comments + post.shares + post.saves) * d;
        }
      });
    }
    let followers = START_FOLLOWERS[p];
    for (let day = 0; day < DAYS; day++) {
      const growth = 1 + day / 260; // tren naik pelan
      const v = round((views[day] + BASELINE[p] * between(0.8, 1.2)) * growth);
      const f = round(follows[day] * growth + between(4, 18));
      const u = round(f * between(0.12, 0.3));
      followers += f - u;
      out.push({
        day,
        platform: p,
        views: v,
        reach: round(v * between(0.72, 0.82)),
        profileVisits: round(visits[day] + v * 0.004),
        linkTaps: round(v * between(0.0012, 0.003)),
        follows: f,
        unfollows: u,
        followers,
        interactions: round(inter[day] * growth + v * 0.01),
      });
    }
  }
  return out;
}

function makeStories(): Story[] {
  const titles = ["Polling: hair oil favorit", "Behind the scene syuting", "Q&A rambut rontok", "Link produk di bio", "Repost Reels baru", "Hari ini pakai apa?"];
  const out: Story[] = [];
  for (let i = 0; i < 24; i++) {
    const views = round(between(900, 1700));
    out.push({
      id: `st-${i}`,
      day: DAYS - 30 + Math.floor(i * 1.25),
      title: titles[i % titles.length],
      views,
      reach: round(views * between(0.88, 0.97)),
      forward: round(views * between(0.35, 0.6)),
      back: round(views * between(0.01, 0.04)),
      exits: round(views * between(0.05, 0.14)),
      nextStory: round(views * between(0.02, 0.07)),
      replies: round(views * between(0.002, 0.02)),
      linkClicks: i % 4 === 3 ? round(views * between(0.02, 0.06)) : 0,
      stickerTaps: i % 3 === 0 ? round(views * between(0.04, 0.12)) : 0,
    });
  }
  return out;
}

function makeLives(): Live[] {
  return [
    { id: "lv-1", day: DAYS - 62, title: "Live: tanya jawab rambut", durationMin: 48, views: 3120, uniqueViewers: 1840, peak: 212, avgWatchMin: 3.1, newFollowers: 96, comments: 640, gifters: 23, diamonds: 1480 },
    { id: "lv-2", day: DAYS - 33, title: "Live: unboxing haul", durationMin: 62, views: 4280, uniqueViewers: 2510, peak: 305, avgWatchMin: 3.8, newFollowers: 141, comments: 910, gifters: 37, diamonds: 2650 },
    { id: "lv-3", day: DAYS - 6, title: "Live: skincare malam bareng", durationMin: 55, views: 5030, uniqueViewers: 2970, peak: 364, avgWatchMin: 4.2, newFollowers: 188, comments: 1120, gifters: 41, diamonds: 3020 },
  ];
}

function activeGrid(peakHours: number[], weekendBoost: number) {
  const g: number[][] = [];
  for (let d = 0; d < 7; d++) {
    const row: number[] = [];
    for (let h = 0; h < 24; h++) {
      let v = 0.05;
      if (h >= 6 && h <= 23) v = 0.25;
      for (const p of peakHours) v += Math.max(0, 0.6 - Math.abs(h - p) * 0.18);
      if (h >= 0 && h <= 4) v = 0.04 + (h === 0 ? 0.12 : 0);
      if (d >= 4) v *= weekendBoost;
      row.push(Math.min(1, v * between(0.92, 1.05)));
    }
    g.push(row);
  }
  const max = Math.max(...g.flat());
  return g.map((row) => row.map((v) => v / max));
}

const share = (pairs: [string, number][]) => {
  const sum = pairs.reduce((a, b) => a + b[1], 0);
  return pairs.map(([label, v]) => ({ label, pct: v / sum }));
};

function makeAudience(daily: Daily[]): Record<Platform, Audience> {
  const last = (p: Platform) => daily.filter((d) => d.platform === p).at(-1)!.followers;
  return {
    tiktok: {
      platform: "tiktok",
      followers: last("tiktok"),
      gender: share([["Perempuan", 78], ["Laki-laki", 21], ["Lainnya", 1]]),
      age: share([["18–24", 46], ["25–34", 31], ["35–44", 13], ["45–54", 6], ["55+", 4]]),
      countries: share([["Indonesia", 92], ["Malaysia", 4], ["Singapura", 1.5], ["Lainnya", 2.5]]),
      cities: share([["Jakarta", 21], ["Surabaya", 9], ["Bandung", 8], ["Bekasi", 6], ["Medan", 5], ["Lainnya", 51]]),
      active: activeGrid([12, 20, 22], 1.12),
      newViewers: 0.71,
      interests: ["Kecantikan", "Perawatan rambut", "Fashion", "Kuliner", "Kampus"],
    },
    instagram: {
      platform: "instagram",
      followers: last("instagram"),
      gender: share([["Perempuan", 84], ["Laki-laki", 16]]),
      age: share([["13–17", 3], ["18–24", 41], ["25–34", 38], ["35–44", 12], ["45–54", 4], ["55+", 2]]),
      countries: share([["Indonesia", 95], ["Malaysia", 2], ["Lainnya", 3]]),
      cities: share([["Jakarta", 24], ["Bandung", 9], ["Surabaya", 8], ["Tangerang", 6], ["Depok", 5], ["Lainnya", 48]]),
      active: activeGrid([8, 13, 20], 1.05),
      newViewers: 0.58,
    },
    youtube: {
      platform: "youtube",
      followers: last("youtube"),
      gender: share([["Perempuan", 69], ["Laki-laki", 31]]),
      age: share([["13–17", 4], ["18–24", 38], ["25–34", 35], ["35–44", 15], ["45–54", 6], ["55+", 2]]),
      countries: share([["Indonesia", 89], ["Malaysia", 5], ["Amerika Serikat", 2], ["Lainnya", 4]]),
      cities: share([["Jakarta", 19], ["Surabaya", 8], ["Bandung", 7], ["Medan", 5], ["Lainnya", 61]]),
      active: activeGrid([19, 21], 1.2),
      newViewers: 0.66,
      languages: share([["Indonesia", 88], ["Inggris", 9], ["Lainnya", 3]]),
      subscriberWatch: 0.24,
    },
  };
}

export const POSTS: Post[] = makePosts();
export const DAILY: Daily[] = makeDaily(POSTS);
export const STORIES: Story[] = makeStories();
export const LIVES: Live[] = makeLives();
export const AUDIENCE: Record<Platform, Audience> = makeAudience(DAILY);
export const YT_REVENUE: YtRevenue = { revenue: 1_240_000, rpm: 9_800, cpm: 21_500, premium: 86_000 };
export const PROFILE = { name: "Sarita", niche: "Beauty & haircare", weeklyTarget: 6 };
