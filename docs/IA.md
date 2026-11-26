# Information Architecture: Creator Dashboard

Versi 0.2 · draf untuk didiskusikan

> Pembaruan v0.2: susunan menu mengikuti [riset UX](ux-research.md) dan
> [menu Tugas](menu-tugas.md): Ringkasan · Tugas · Ide · Postingan · Cuan ·
> Laporan, dengan bar bawah HP Ringkasan · Tugas · (+) · Cuan · Lainnya.
> Bagian 2-4 di bawah masih memakai susunan v0.1 dan akan dirapikan setelah
> wireframe disetujui.

## 1. Ringkasan produk

Web app (desktop dan HP) untuk kreator yang ingin melihat performa konten
TikTok, Instagram, dan YouTube di satu tempat, tahu apa yang berhasil dan apa
yang tidak, lalu merencanakan konten berikutnya.

Data performa masuk lewat **file ekspor** dari masing-masing platform
(ditambah screenshot atau input manual), **bukan** lewat koneksi API. Jadi
tidak perlu izin Meta/TikTok, dan pengguna tidak perlu memberikan password
media sosialnya.

Pengguna login di domain kita. Datanya tersimpan di akun mereka dan bisa
dibuka dari perangkat mana pun.

### Pengguna utama

| Persona | Kebutuhan |
|---|---|
| Kreator solo (UMKM, beauty, food, edukasi) | Tahu konten mana yang laku dan kapan sebaiknya posting, tanpa buka 3 aplikasi |
| Kreator dengan beberapa akun/brand | Pindah antar-brand dengan cepat, laporan terpisah per brand |
| Admin/sosmed freelancer (fase berikutnya) | Laporan rapi untuk klien |

### Prinsip

1. **Satu pertanyaan per halaman.** Ringkasan: "minggu ini gimana?".
   Platform: "di mana kontenku paling laku?". Konten: "habis ini posting apa?".
2. **Import harus terasa 1 menit.** Tombol impor selalu terlihat, ada panduan
   ekspor per platform, dan file dikenali otomatis.
3. **Angka selalu disertai arti.** Setiap kartu angka punya pembanding
   (vs periode sebelumnya) dan satu kalimat penjelasan.
4. **Kosong bukan rusak.** Setiap halaman punya tampilan kosong yang
   menyuruh langkah berikutnya.

## 2. Peta situs

```
Publik
├── /                      Landing
├── /harga                 Paket Gratis vs Pro
├── /masuk                 Login (email + password, Google)
├── /daftar                Daftar
├── /lupa-password
├── /privasi               Kebijakan Privasi
├── /syarat                Syarat Layanan
└── /hapus-akun            Hapus akun tanpa memasang aplikasi

Aplikasi (/app, wajib login)
├── Onboarding (sekali, setelah daftar)
│   ├── 1. Nama brand & niche
│   ├── 2. Platform yang dipakai + username
│   ├── 3. Impor file pertama (atau lewati, pakai data contoh)
│   └── 4. Target (posting per minggu, target followers)
│
├── Ringkasan                          /app
├── Platform                           /app/platform
│   ├── Tab: Semua · TikTok · Instagram · YouTube
│   └── Detail postingan               /app/platform/post/:id
├── Konten                             /app/konten
│   ├── Kalender (bulan / minggu)
│   ├── Pipeline (papan per status)
│   └── Bank ide
├── Ide & Tren                         /app/tren
├── Laporan                            /app/laporan
│   └── Laporan mingguan/bulanan + insight AI, bisa diunduh PDF
├── Impor data                         /app/impor
│   ├── Upload file (CSV/XLSX) atau screenshot
│   ├── Input manual per postingan
│   ├── Riwayat impor
│   └── Panduan ekspor (TikTok, Instagram, YouTube)
└── Pengaturan                         /app/pengaturan
    ├── Profil
    ├── Brand & akun sosial (tambah/ganti brand)
    ├── Target
    ├── Langganan & tagihan
    └── Data & privasi (ekspor semua data, hapus akun)
```

## 3. Navigasi

### Desktop

Sidebar kiri (hijau tua), urutan:

1. Pemilih brand (logo + nama, dropdown untuk ganti brand)
2. Ringkasan
3. Platform
4. Konten (dengan badge jumlah konten yang jatuh tempo minggu ini)
5. Ide & Tren
6. Laporan
7. Impor data
8. (bawah) Pengaturan, Bantuan, profil pengguna

Bar atas: pencarian (postingan, ide, konten), status data terakhir
("Data TikTok terakhir 18 Nov"), tombol **Impor**, notifikasi.

### HP

Bar bawah 5 item: **Ringkasan · Platform · (+) Impor · Konten · Lainnya**.
"Lainnya" berisi Ide & Tren, Laporan, Pengaturan. Pemilih brand ada di
header.

### Filter global

Periode (7 / 30 / 90 hari / custom) dan platform. Pilihan disimpan per
pengguna dan berlaku di Ringkasan, Platform, dan Laporan.

## 4. Isi tiap halaman

### 4.1 Ringkasan

Tujuan: dalam 10 detik tahu kondisi minggu ini.

| Blok | Isi |
|---|---|
| Sapaan | "Selamat sore, Sarita" + 1 kalimat kesimpulan AI ("Views naik 18%, didorong 2 video tutorial") |
| Kartu angka (4) | Total views · Engagement rate · Followers baru · Postingan periode ini (vs target) |
| Grafik | Views per minggu, garis per platform |
| Waktu terbaik posting | Hari & jam dengan rata-rata views tertinggi |
| Konsistensi posting | % minggu yang mencapai target posting |
| Top 3 postingan | Thumbnail/judul, platform, views, engagement |
| Yang harus dilakukan | Konten jatuh tempo minggu ini (dari Konten), pengingat impor kalau data > 7 hari |

### 4.2 Platform

Tab per platform (dan "Semua").

- Kartu angka khusus platform: followers, rata-rata views per post,
  engagement, reach/impresi (kalau ada di file).
- Tabel **Top postingan**: judul/caption, format (video, carousel, foto,
  short), tanggal, views, likes, komentar, share, save, ER. Bisa diurutkan.
- Panel **Yang berhasil / Yang kurang** (AI): 2-4 poin masing-masing,
  dengan contoh postingan dan angkanya.
- Perbandingan format (video vs carousel, durasi pendek vs panjang).

**Detail postingan:** semua metrik, grafik kalau ada data harian, catatan
pengguna, tag (topik, hook, format), tombol "Buat konten serupa" (masuk ke
Bank ide).

### 4.3 Konten

- **Kalender:** tampilan bulan/minggu, kartu konten berwarna per platform.
- **Pipeline:** Ide → Naskah → Siap rekam → Editing → Terjadwal → Terbit.
  Drag & drop.
- **Bank ide:** daftar ide dengan sumber (manual, dari tren, dari postingan
  yang berhasil), prioritas, platform target.
- Konten berstatus Terbit bisa dihubungkan ke postingan hasil impor, supaya
  hasilnya terlihat langsung di kartu konten.

### 4.4 Ide & Tren

Tanpa API, jadi sumbernya:

- **Hashtag/kata kunci dipantau:** pengguna mencatat hashtag; aplikasi
  menghitung performa postingannya sendiri per hashtag.
- **Saran topik AI:** berdasarkan niche + postingan terbaik pengguna.
  Diberi label jelas "saran AI, bukan data tren real-time".
- **Tautan cepat:** Google Trends, TikTok Creative Center untuk kata kunci
  yang dipantau.
- Setiap ide bisa dikirim ke Bank ide dengan satu klik.

### 4.5 Laporan

- Laporan mingguan dan bulanan otomatis: ringkasan angka, top/bottom
  postingan, insight AI, rekomendasi 3 aksi.
- Unduh PDF (untuk kreator yang melapor ke klien/brand).

### 4.6 Impor data

1. Pilih platform (atau biarkan dikenali otomatis dari isi file).
2. Upload CSV/XLSX, atau screenshot (dibaca AI), atau isi form manual.
3. Pratinjau: berapa postingan baru, berapa yang diperbarui, periode data.
4. Konfirmasi.

Riwayat impor menampilkan file, platform, periode, jumlah baris, dan tombol
batalkan impor.

Panduan ekspor: langkah bergambar untuk TikTok Studio, Meta Business Suite,
dan YouTube Studio.

### 4.7 Akun (menu Lainnya)

- **Profil & keamanan:** nama, email, kata sandi, login Google, perangkat
  aktif, keluar dari semua perangkat.
- **Brand:** tambah, ganti, hapus brand.
- **Langganan:** paket, metode bayar, riwayat tagihan, batalkan.
- **Privasi & data:** izin analisis AI, izin email promo, unduh semua data,
  Kebijakan Privasi, kontak soal data, hapus akun.
- **Bantuan**, **Keluar**.

Syarat lengkapnya (UU PDP, PSE, Google Play, App Store) ada di
[akun-privasi.md](akun-privasi.md).

## 5. Alur utama

**A. Pengguna baru:** Landing → Daftar → Onboarding (brand, platform,
impor pertama) → Ringkasan terisi. Kalau melewati impor, tampilkan data
contoh dengan banner "Ini data contoh. Impor datamu".

**B. Rutinitas mingguan (target ≤ 3 menit):** Notifikasi/email "Waktunya
update" → Impor (1 file per platform) → Ringkasan & Laporan mingguan
terbarui → tambah 2-3 ide ke Konten.

**C. Rencana konten:** Platform → lihat "Yang berhasil" → "Buat konten
serupa" → Bank ide → Pipeline → Kalender → Terbit → hubungkan ke postingan
setelah impor berikutnya.

## 6. Model data (garis besar)

| Entitas | Isi utama |
|---|---|
| User | email, nama, paket |
| Brand (workspace) | nama, niche, logo, target |
| AkunSosial | brand, platform, username |
| Impor | brand, platform, sumber (CSV/screenshot/manual), periode, jumlah baris, status |
| Postingan | brand, platform, id/URL platform, tanggal, format, judul/caption, durasi |
| MetrikPostingan | postingan, tanggal snapshot, views, likes, komentar, share, save, reach, watch time |
| MetrikAkun | akun, tanggal, followers, profile views, reach |
| Konten | brand, judul, status pipeline, platform, tanggal rencana, postingan terkait |
| Ide | brand, judul, sumber, prioritas |
| HashtagDipantau | brand, hashtag |
| Insight | brand, periode, jenis (ringkasan, berhasil, kurang, rekomendasi), isi |

Definisi utama: **Engagement rate = (likes + komentar + share + save) ÷
views**, dihitung per postingan lalu dirata-rata tertimbang views.

Snapshot metrik disimpan per impor, supaya pertumbuhan postingan dari minggu
ke minggu tetap terlihat walaupun file ekspor hanya berisi angka terkini.

## 7. Paket

| Fitur | Gratis | Pro |
|---|---|---|
| Brand | 1 | Sampai 5 |
| Platform | 1 | Semua |
| Riwayat data | 30 hari | Tanpa batas |
| Impor CSV & manual | Ya | Ya |
| Impor screenshot (AI) | — | Ya |
| Insight & laporan AI | — | Ya |
| Konten (kalender, pipeline, bank ide) | Sampai 20 item | Tanpa batas |
| Laporan PDF | — | Ya |

## 8. Di luar cakupan versi pertama

- Koneksi API langsung ke Instagram/TikTok/YouTube.
- Sinkron ke Notion.
- Mode tim/klien (banyak pengguna di satu brand).
- Aplikasi native Play Store/App Store (PWA dulu).

## 9. Keputusan yang masih terbuka

1. Nama produk dan domain.
2. Bahasa antarmuka: Indonesia saja, atau Indonesia + Inggris sejak awal.
3. Harga Pro dan apakah ada opsi bayar sekali.
4. Platform yang wajib di versi pertama (TikTok + Instagram, YouTube
   menyusul?).
5. Format file ekspor asli dari tiap platform: perlu contoh file untuk
   memastikan kolom yang tersedia.
