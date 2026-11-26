# Creator Dashboard (web)

Next.js 16 (App Router, Turbopack) + Tailwind CSS 4 + Motion.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Isi tahap 1

- **Ringkasan:** kartu angka dengan hitung naik, grafik views per platform
  (garis tergambar + crosshair), jam terbaik posting, konsistensi, aktivitas
  profil, postingan teratas, 3 saran teratas.
- **Saran AI:** saran minggu ini dari data insight, dengan bukti angka,
  filter kategori, dan tanda "sudah dilakukan". Logikanya di `lib/insights.ts`.
- **Postingan:** semua metrik per postingan, tabel bisa diurutkan, detail
  dengan retensi dan sumber penonton; Story (Instagram), LIVE (TikTok),
  pendapatan (YouTube).
- **Audiens:** gender, umur, kota, negara, jam aktif, follow baru, penonton
  baru vs kembali, followers vs bukan, minat (TikTok), bahasa (YouTube).
- **Tampilan:** sidebar di desktop, bar bawah + menu di HP. 5 warna tema
  (Krem, Lavender, Laut, Mawar, Mono) × terang/gelap/ikuti sistem.

Daftar lengkap metrik: [docs/metrik-insight.md](../docs/metrik-insight.md).

## Catatan

- Data masih **data contoh** (`lib/demo.ts`), dibuat deterministik. Tahap
  berikutnya: login + database (Supabase) dan impor file ekspor.
- Warna data per platform tetap (TikTok biru, Instagram oranye, YouTube
  hijau toska) karena sudah divalidasi untuk buta warna; tema hanya mengubah
  warna antarmuka dan grafik satu warna.
- Semua animasi mati otomatis kalau pengguna memilih "kurangi gerakan" di
  perangkatnya.
