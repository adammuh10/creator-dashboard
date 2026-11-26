// Mesin "Saran minggu ini": aturan yang membaca data impor dan
// menghasilkan saran dengan bukti angka. Nanti kalimatnya bisa dipoles AI,
// tapi angka dan logikanya tetap dari sini supaya bisa dicek.
import { AUDIENCE, PROFILE, STORIES } from "./demo";
import { bestTimes, consistency, engagement, platformsOf, postsIn, sum, totals } from "./data";
import { HARI_PANJANG, compact, delta, pct } from "./format";
import { PLATFORM_LABEL } from "./platforms";
import type { PlatformFilter, Post } from "./types";

export type Kategori = "Waktu" | "Format" | "Hook" | "Topik" | "Audiens" | "Pertumbuhan" | "Konsistensi";

export interface Saran {
  id: string;
  kategori: Kategori;
  dampak: "Tinggi" | "Sedang";
  judul: string;
  alasan: string;
  aksi: string;
  bukti: { label: string; nilai: string }[];
  skor: number;
}

const avg = (arr: Post[], fn: (p: Post) => number) => (arr.length ? sum(arr, fn) / arr.length : 0);

export function saranMingguIni(f: PlatformFilter): Saran[] {
  const posts = postsIn(90, f);
  const recent = postsIn(30, f);
  const out: Saran[] = [];
  const baseViews = avg(posts, (p) => p.views);

  // 1. Waktu terbaik dan terburuk
  const bt = bestTimes(posts);
  const hari = HARI_PANJANG[bt.best.d];
  const blok = bt.blocks[bt.best.b];
  const kali = bt.best.v / baseViews;
  if (kali > 1.2)
    out.push({
      id: "waktu",
      kategori: "Waktu",
      dampak: kali > 1.6 ? "Tinggi" : "Sedang",
      judul: `Posting ${hari} jam ${blok.replace("–", ".00–")}.00`,
      alasan: `Postingan di slot ini rata-rata ${kali.toFixed(1).replace(".", ",")}× views biasanya.`,
      aksi: `Taruh 2 konten terkuat minggu ini di ${hari} malam.`,
      bukti: [
        { label: "Rata-rata di slot ini", nilai: compact(bt.best.v) },
        { label: "Rata-rata semua postingan", nilai: compact(baseViews) },
      ],
      skor: kali * 10,
    });

  // 2. Durasi video
  const vids = posts.filter((p) => p.durationSec && p.format !== "Video panjang");
  const short = vids.filter((p) => p.durationSec! <= 45);
  const long = vids.filter((p) => p.durationSec! > 60);
  if (short.length >= 3 && long.length >= 3) {
    const s = avg(short, (p) => p.views);
    const l = avg(long, (p) => p.views);
    const drop = 1 - l / s;
    if (drop > 0.2)
      out.push({
        id: "durasi",
        kategori: "Format",
        dampak: drop > 0.4 ? "Tinggi" : "Sedang",
        judul: "Potong video jadi ≤ 45 detik",
        alasan: `Video di atas 60 detik views-nya ${pct(drop, 0)} lebih rendah dan lebih jarang ditonton sampai habis.`,
        aksi: "Pecah video panjang jadi 2 part, buang intro sebelum detik ke-2.",
        bukti: [
          { label: `≤ 45 dtk (${short.length} video)`, nilai: `${compact(s)} views · ${pct(avg(short, (p) => p.completion ?? 0), 0)} habis` },
          { label: `> 60 dtk (${long.length} video)`, nilai: `${compact(l)} views · ${pct(avg(long, (p) => p.completion ?? 0), 0)} habis` },
        ],
        skor: drop * 30,
      });
  }

  // 3. Hook: retensi 3 detik pertama
  const withRet = vids.filter((p) => p.retention);
  if (withRet.length >= 6) {
    const sorted = [...withRet].sort((a, b) => b.retention![2] - a.retention![2]);
    const q = Math.floor(sorted.length / 4);
    const top = sorted.slice(0, q);
    const bot = sorted.slice(-q);
    const ratio = avg(top, (p) => p.views) / avg(bot, (p) => p.views);
    out.push({
      id: "hook",
      kategori: "Hook",
      dampak: ratio > 1.8 ? "Tinggi" : "Sedang",
      judul: "Kuatkan 2 detik pertama",
      alasan: `Video yang menahan penonton di awal dapat ${ratio.toFixed(1).replace(".", ",")}× views dibanding yang ditinggal cepat.`,
      aksi: "Buka dengan pertanyaan atau hasil akhir, teks besar di layar.",
      bukti: [
        { label: `Contoh terbaik: ${top[0].title}`, nilai: `${pct(top[0].retention![2], 0)} bertahan di 10% awal` },
        { label: `Contoh terlemah: ${bot.at(-1)!.title}`, nilai: `${pct(bot.at(-1)!.retention![2], 0)} bertahan` },
      ],
      skor: ratio * 8,
    });
  }

  // 4. Momentum: postingan yang meledak 14 hari terakhir
  const last14 = postsIn(30, f).filter((p) => p.day >= 90 - 14);
  const star = [...last14].sort((a, b) => b.views / baseViews - a.views / baseViews)[0];
  if (star && star.views > baseViews * 1.8)
    out.push({
      id: "momentum",
      kategori: "Pertumbuhan",
      dampak: "Tinggi",
      judul: `Buat lanjutan "${star.title}"`,
      alasan: `Dapat ${compact(star.views)} views, ${(star.views / baseViews).toFixed(1).replace(".", ",")}× rata-rata. Penonton masih mencari topik ini.`,
      aksi: "Unggah part berikutnya dalam 3 hari, sebut part sebelumnya di awal.",
      bukti: [
        { label: "Share", nilai: compact(star.shares) },
        { label: "Followers baru dari video ini", nilai: compact(star.newFollowers) },
      ],
      skor: 40,
    });

  // 5. Topik yang disimpan dan dibagikan
  const byTopic = new Map<string, Post[]>();
  for (const p of posts) byTopic.set(p.topic, [...(byTopic.get(p.topic) ?? []), p]);
  const topics = [...byTopic.entries()]
    .filter(([, ps]) => ps.length >= 3)
    .map(([t, ps]) => ({ t, ps, v: avg(ps, (p) => p.views), sv: avg(ps, (p) => (p.saves + p.shares) / p.views) }))
    .sort((a, b) => b.v - a.v);
  if (topics.length >= 2) {
    const best = topics[0];
    const worst = topics.at(-1)!;
    out.push({
      id: "topik",
      kategori: "Topik",
      dampak: "Sedang",
      judul: `Jadikan "${best.t}" seri mingguan`,
      alasan: `Topik ini rata-rata ${compact(best.v)} views dan paling banyak disimpan/dibagikan (${pct(best.sv)}). "${worst.t}" paling rendah (${compact(worst.v)}).`,
      aksi: `Kurangi "${worst.t}", ganti dengan 1 konten ${best.t} per minggu.`,
      bukti: topics.slice(0, 3).map((x) => ({ label: `${x.t} (${x.ps.length} post)`, nilai: `${compact(x.v)} views` })),
      skor: (best.v / baseViews) * 9,
    });
  }

  // 6. Carousel untuk disimpan (Instagram)
  if (platformsOf(f).includes("instagram")) {
    const ig = posts.filter((p) => p.platform === "instagram");
    const car = ig.filter((p) => p.format === "Carousel");
    const reels = ig.filter((p) => p.format === "Reels");
    if (car.length >= 2 && reels.length >= 2) {
      const sc = avg(car, (p) => p.saves / p.views);
      const sr = avg(reels, (p) => p.saves / p.views);
      if (sc > sr * 1.5)
        out.push({
          id: "carousel",
          kategori: "Format",
          dampak: "Sedang",
          judul: "Ubah tips jadi carousel di Instagram",
          alasan: `Carousel disimpan ${(sc / sr).toFixed(1).replace(".", ",")}× lebih sering dari Reels. Simpanan membuat konten muncul lagi di Explore.`,
          aksi: "Ringkas video tips terbaik jadi carousel 5 slide.",
          bukti: [
            { label: "Simpan per views, carousel", nilai: pct(sc) },
            { label: "Simpan per views, Reels", nilai: pct(sr) },
          ],
          skor: 14,
        });
    }
  }

  // 7. Jangkauan ke non-followers
  const nonFol = 1 - avg(recent, (p) => p.followersShare);
  const t = totals(30, f);
  const folRate = t.views ? t.follows / t.views : 0;
  out.push({
    id: "nonfollower",
    kategori: "Pertumbuhan",
    dampak: folRate < 0.006 ? "Tinggi" : "Sedang",
    judul: "Ajak penonton baru untuk follow",
    alasan: `${pct(nonFol, 0)} views datang dari yang belum follow, tapi baru ${pct(folRate, 2)} yang jadi followers.`,
    aksi: 'Tutup video dengan alasan follow: "part 2 besok jam 7 malam".',
    bukti: [
      { label: "Views 30 hari", nilai: compact(t.views) },
      { label: "Followers baru 30 hari", nilai: compact(t.follows) },
    ],
    skor: 12,
  });

  // 8. Audiens
  const ps = platformsOf(f);
  const main = AUDIENCE[ps.length === 1 ? ps[0] : "tiktok"];
  const topAge = [...main.age].sort((a, b) => b.pct - a.pct)[0];
  const topCity = main.cities[0];
  out.push({
    id: "audiens",
    kategori: "Audiens",
    dampak: "Sedang",
    judul: `Bicara ke ${topAge.label} tahun di ${topCity.label}`,
    alasan: `${pct(topAge.pct, 0)} penonton berumur ${topAge.label}, ${pct(topCity.pct, 0)} dari ${topCity.label}. ${pct(main.gender[0].pct, 0)} ${main.gender[0].label.toLowerCase()}.`,
    aksi: "Pakai harga terjangkau, contoh situasi kampus/kerja pertama, dan sebut toko yang mudah dijangkau.",
    bukti: main.age.slice(0, 3).map((a) => ({ label: `Umur ${a.label}`, nilai: pct(a.pct, 0) })),
    skor: 8,
  });

  // 9. Konsistensi
  const target = ps.length === 1 ? Math.ceil(PROFILE.weeklyTarget / 2) : PROFILE.weeklyTarget;
  const c = consistency(f, 4, target);
  if (c.rate < 1)
    out.push({
      id: "konsistensi",
      kategori: "Konsistensi",
      dampak: c.rate < 0.5 ? "Tinggi" : "Sedang",
      judul: `Capai ${target} post minggu ini`,
      alasan: `${c.hit} dari 4 minggu terakhir mencapai target. Minggu terakhir: ${c.weeks.at(-1)!.posts} post.`,
      aksi: "Rekam 3 konten sekaligus di hari Minggu, jadwalkan sepanjang minggu.",
      bukti: c.weeks.map((w) => ({ label: `Minggu ${w.week}`, nilai: `${w.posts} post` })),
      skor: (1 - c.rate) * 20,
    });

  // 10. Durasi tonton YouTube / CTR
  if (ps.includes("youtube")) {
    const yt = posts.filter((p) => p.platform === "youtube" && p.ctr);
    const lowCtr = yt.filter((p) => p.ctr! < 0.045);
    if (lowCtr.length)
      out.push({
        id: "ctr",
        kategori: "Format",
        dampak: "Sedang",
        judul: "Perbaiki thumbnail YouTube",
        alasan: `${lowCtr.length} video punya CTR di bawah 4,5%. Rata-rata channel ${pct(avg(yt, (p) => p.ctr!))}.`,
        aksi: "Pakai wajah + 3 kata besar; uji ulang thumbnail video dengan CTR terendah.",
        bukti: lowCtr.slice(0, 2).map((p) => ({ label: p.title, nilai: `CTR ${pct(p.ctr!)}` })),
        skor: 7,
      });
  }

  // 11. Story (Instagram)
  if (ps.includes("instagram")) {
    const st = STORIES;
    const exit = sum(st, (s) => s.exits) / sum(st, (s) => s.views);
    const sticker = st.filter((s) => s.stickerTaps > 0);
    out.push({
      id: "story",
      kategori: "Audiens",
      dampak: "Sedang",
      judul: "Pakai stiker polling di Story",
      alasan: `Story dengan stiker dapat interaksi lebih tinggi; rata-rata ${pct(exit, 0)} penonton keluar di tengah Story.`,
      aksi: "Tambah 1 polling atau kuis di 3 Story minggu ini.",
      bukti: [
        { label: "Story dengan stiker", nilai: `${sticker.length} dari ${st.length}` },
        { label: "Rata-rata tap stiker", nilai: compact(sum(sticker, (s) => s.stickerTaps) / Math.max(1, sticker.length)) },
      ],
      skor: 6,
    });
  }

  return out.sort((a, b) => b.skor - a.skor);
}

export function ringkasanMinggu(f: PlatformFilter) {
  const cur = totals(7, f);
  const prev = totals(7, f, 1);
  const d = delta(cur.views, prev.views);
  const posts = postsIn(7, f);
  const best = [...posts].sort((a, b) => b.views - a.views)[0];
  const arah = d >= 0 ? "naik" : "turun";
  const kalimat = best
    ? `Views ${arah} ${pct(Math.abs(d), 0)} dari minggu lalu, paling banyak dari "${best.title}" (${PLATFORM_LABEL[best.platform]}).`
    : `Views ${arah} ${pct(Math.abs(d), 0)} dari minggu lalu.`;
  return { cur, prev, d, best, kalimat, er: posts.length ? avg(posts, engagement) : 0 };
}

