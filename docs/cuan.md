# Menu Cuan: kerja sama, invoice, rate card

Versi 0.1 · draf untuk didiskusikan

## Mind map

![Mind map menu Cuan](mindmap/cuan-overview.png)

Detail: [bagian 1](mindmap/cuan-bagian-1.png) (kerja sama, profil penagih,
invoice, kirim, arsip) · [bagian 2](mindmap/cuan-bagian-2.png) (rate card,
pajak, laporan, impor, template, keamanan, paket). Sumber teks:
[mindmap/menu-cuan.md](mindmap/menu-cuan.md).

## 1. Kerja sama (brand deals)

Kolomnya mengikuti cara creator biasanya mencatat deal di Notion, Google
Sheets, atau Excel, ditambah beberapa kolom yang biasanya belum ada.

| Kolom | Catatan |
|---|---|
| Brand | Brand jadi data sendiri (alamat, PIC, email), jadi tidak perlu diketik ulang setiap invoice |
| Akun | Untuk creator yang punya lebih dari satu akun. Setiap akun punya rate card sendiri |
| Platform + Format + Add-on | Tiga kolom terpisah. Di tabel manual, ketiganya sering dicampur dalam satu kolom (mis. "Reels, TikTok, mirroring"), jadi tidak bisa dihitung. Platform = IG/TikTok/YouTube, Format = Reels/Carousel/Story/Video, Add-on = Collab/Mirroring/Owning/Link |
| SOW | Daftar deliverable. Tiap baris otomatis jadi tugas di menu Tugas dan baris di invoice |
| Status konten | Nego → Deal → Draft → Revisi → Approved → Posted |
| Tanggal posting | Tersambung ke menu Tugas |
| Fee | Bruto, sebelum potongan |
| Status bayar | Belum → Ditagih → DP → Lunas, ditambah Telat (otomatis kalau lewat jatuh tempo) |
| Tanggal dibayar | Diisi saat ditandai Lunas |
| **Lewat manager / agensi** | Nama perantara dan komisinya (% atau nominal), sehingga fee bersih terlihat |
| Termin | DP sekian %, pelunasan setelah posting |
| Bukti tayang | Link postingan + angka dari data impor |
| Brief & kontrak | File atau link |

**Deal lewat manager atau agensi.** Ada dua pola, dan creator memilih salah
satu per deal:
- **Brand bayar ke kamu, kamu bayar komisi ke manager.** Invoice ke brand.
  Komisi hanya muncul di hitunganmu, tidak tercetak di invoice.
- **Brand bayar ke agensi, agensi bayar ke kamu.** Invoice ke agensi
  (Bill to = agensi), sebesar fee setelah komisi.

## 2. Profil penagih (diisi sekali, dipakai di semua invoice)

- Nama sesuai KTP/rekening, alamat, email, no HP/WA.
- **NIK** dan **NPWP.** Sejak 2024 NIK berfungsi sebagai NPWP orang pribadi.
  Kolom NPWP otomatis terisi dari NIK, tapi tetap bisa diubah.
- Status PKP (kalau ya, invoice menambahkan PPN).
- **Rekening:** bank, nomor, atas nama. Bisa lebih dari satu, dengan satu
  rekening sebagai default.
- **Tanda tangan:** digambar langsung di layar atau upload PNG transparan.
- Logo (opsional).
- Format nomor invoice, misalnya `INV/2026/11/001`, atau dengan kode akun
  (`INV/SR/2026/11/001`) untuk creator yang punya beberapa akun.

## 3. Invoice

Dibuat dari satu baris kerja sama. Semua kolom terisi otomatis, lalu tinggal
dicek.

| Bagian | Isi |
|---|---|
| Kepala | Logo, nama, kontak, NPWP; nomor invoice, tanggal, jatuh tempo (NET 7/14/30), no PO kalau brand minta |
| Bill to | Nama PT/brand, alamat, PIC, email (dari data brand) |
| Tabel | Deskripsi (dari SOW), qty, harga satuan, jumlah |
| Hitungan | Subtotal → diskon → PPN (kalau PKP) → total tagihan → dikurangi DP yang sudah dibayar → **sisa tagihan** |
| Potongan pajak | Tanpa potongan / PPh 21 / PPh 21 harga aman pajak / PPh 23, dengan tampilan ringkas atau rinci (lihat di bawah). Aplikasi selalu menampilkan **perkiraan uang bersih diterima** |
| Terbilang | "Satu juta dua ratus ribu rupiah" (sering diminta tim finance) |
| Pembayaran | Bank, nomor rekening, atas nama |
| Penutup | Catatan/syarat, tanda tangan, nama terang, kota & tanggal |
| Meterai | Pengingat kalau nilai lebih dari Rp5.000.000 |

### Potongan pajak

**Default untuk pengguna baru.** Saat pertama membuka Cuan, aplikasi
menanyakan satu hal: *"Biasanya brand memotong pajak dari fee-mu?"*

| Jawaban | Default yang dipasang |
|---|---|
| Ya | PPh 21 dipotong brand, 2,5%. Langsung muncul tawaran: "Mau tetap terima rate utuh? Nyalakan harga aman pajak" |
| Tidak | Tanpa potongan |
| Belum tahu | Tanpa potongan, plus penjelasan singkat dan perkiraan potongan kalau nanti brand memotong |

Default bisa diubah di pengaturan dan diganti per invoice.

| Pilihan | Dipakai kalau | Hasilnya |
|---|---|---|
| Tanpa potongan | Brand tidak memotong pajak (brand perorangan, brand luar negeri) | Ditagih = fee |
| PPh 21 dipotong brand | Kamu perorangan, brand berbadan usaha (paling umum) | Ditagih = fee; kamu terima fee − PPh |
| **PPh 21, harga aman pajak** | Kamu mau tetap terima rate-mu utuh | Tagihan dinaikkan sedikit, supaya setelah dipotong kamu terima persis rate-mu |
| PPh 23 (2%) | Kamu menagih atas nama PT/CV | Ditagih = fee; kamu terima fee − 2% |

**Tarif PPh 21:** 2,5% (default, dari 50% × tarif lapisan pertama 5%), 3%
(tanpa NPWP, 20% lebih tinggi), atau isi sendiri. Tarif bisa lebih tinggi
kalau total penghasilan dari brand yang sama dalam setahun besar. Semua
angka pajak di aplikasi adalah perkiraan; cek ke konsultan pajak.

**Rumus harga aman pajak:**

```
ditagih = rate bersih yang kamu mau ÷ (1 − tarif PPh − komisi perantara)
          → dibulatkan ke ATAS (Rp1.000 / Rp10.000 / Rp50.000)
```

Pembulatan selalu ke atas, supaya yang kamu terima tidak pernah kurang dari
rate-mu.

| Rate bersih yang kamu mau | Tarif | Komisi perantara | Ditagih (bulat ke atas Rp1.000) | Dipotong PPh | Komisi | Kamu terima |
|---|---|---|---|---|---|---|
| Rp1.000.000 | 2,5% | — | Rp1.026.000 | Rp25.650 | — | Rp1.000.350 |
| Rp1.000.000 | 3% | — | Rp1.031.000 | Rp30.930 | — | Rp1.000.070 |
| Rp1.500.000 | 2,5% | 10% (manager) | Rp1.715.000 | Rp42.875 | Rp171.500 | Rp1.500.625 |

**Tampilan di invoice** dipilih otomatis, dan bisa diganti:
- **Rinci** kalau ada potongan pajak: Nilai jasa → PPh 21 dipotong (2,5%) →
  Jumlah yang ditransfer. Tim finance brand butuh rincian ini untuk membuat
  bukti potong.
- **Ringkas** kalau tanpa potongan: hanya total, tanpa baris pajak.

Komisi manager tidak pernah tercetak di invoice ke brand.

Kalau kamu PKP, PPN dihitung dari nilai jasa dan ditambahkan di atasnya;
PPh dihitung dari nilai jasa sebelum PPN.

### Setelah dibuat

- Unduh PDF, bagikan link invoice, atau kirim lewat email/WA dengan template pesan.
- Status: Draft → Terkirim → Lunas, ditambah Telat dan Batal.
- Pengingat H-1 dan saat jatuh tempo, plus template pesan follow-up.
- **Kwitansi otomatis** begitu ditandai Lunas.
- Setelah terkirim, invoice dikunci. Perubahan dibuat sebagai revisi
  (`INV/2026/11/001-R1`), supaya arsipnya rapi.

### Arsip

Semua invoice dan kwitansi tersimpan. Bisa dicari dan difilter (brand,
akun, tahun, status), diunduh ulang, diduplikat untuk brand yang sama, dan
diekspor ke CSV/Excel untuk akuntan.

## 4. Rate card otomatis

### Rumus

```
rate = median views ÷ 1.000 × tarif per 1.000 views
       × faktor engagement × faktor format
       + add-on − diskon paket
       → dibulatkan ke Rp50.000 terdekat
```

| Komponen | Sumber / default (bisa diubah) |
|---|---|
| Median views | Data impor 30 atau 90 hari terakhir, per akun dan platform |
| Tarif per 1.000 views | Isi sendiri, **atau dihitung dari deal lamamu**: fee dibagi views postingan deal itu. Contoh: fee Rp1.200.000 untuk postingan dengan 60.000 views berarti Rp20.000 per 1.000 views |
| Faktor engagement | ER kamu ÷ ER patokan, dibatasi 0,8 sampai 1,5 |
| Faktor format | Reels/TikTok 1,0 · Carousel 0,7 · Story 0,3 · YouTube 2,0 |
| Add-on | Collab +20% · link in bio/IGS tap link +Rp150.000 · mirroring +40% · owning/hak pakai +30% per bulan · eksklusif kategori +25% · ads/Spark code +50% per bulan · rush (< 3 hari) +30% · raw footage +20% · revisi tambahan +Rp100.000 |
| Diskon paket | 3 konten −10%, bulanan −15% |

Hasilnya dua angka: **harga buka** (untuk nego) dan **harga minimum** (batas
bawah). Di sebelahnya ada **fee rata-rata asli** dari deal-deal sebelumnya,
misalnya "Reels: rata-rata Rp1.150.000 dari 6 deal", supaya
kelihatan kalau rate card terlalu tinggi atau terlalu rendah.

### Harga custom dan paket

Rumus hanya titik awal. Setiap item di rate card punya tiga angka:

| Angka | Isi |
|---|---|
| Harga rumus | Dihitung otomatis dari data |
| **Harga kamu** | Diisi sendiri, lalu dikunci (tidak berubah walaupun datanya berubah) |
| Harga di rate card | Harga yang dilihat brand. Kalau opsi **"naikkan supaya aman pajak"** menyala, ini adalah harga kamu setelah gross-up |

- **Paket custom:** beri nama, pilih isinya (misalnya 1 Reels + mirroring
  TikTok + 3 IG Story), lalu pilih harga otomatis (jumlah isi − diskon) atau
  harga tetap yang kamu tentukan. Rate card menampilkan "hemat Rp…" dibanding
  beli satuan.
- **Peringatan** kalau harga kamu lebih dari 30% di bawah harga rumus atau
  di bawah fee rata-rata deal sebelumnya.
- **Riwayat versi:** rate card lama tetap tersimpan (misalnya Jan 2026 dan
  Jul 2026), supaya kelihatan harga mana yang pernah dikirim ke brand.
- Saat membuat invoice dari deal, harga item diambil dari rate card versi
  yang berlaku, dan bisa diubah.

### Template rate card

Satu rate card per akun. Isinya:
- harga per format;
- paket (single, bundle 3 konten, bulanan);
- add-on;
- syarat standar: DP, jumlah revisi, durasi hak pakai, waktu pengerjaan.

Bisa dibagikan sebagai PDF atau link, dan nyambung ke media kit.

## 5. Ide tambahan (selain invoice dan rate card)

| Ide | Kenapa penting |
|---|---|
| **Impor dari Notion, Sheets, Excel** (CSV) | Catatan deal yang sudah ada langsung pindah, tanpa ketik ulang. Kolom dicocokkan otomatis; kolom campuran platform/format dipecah jadi tiga |
| **Manager / agensi + komisi** | Fee bruto vs yang benar-benar kamu terima kelihatan jelas |
| **Termin / DP** | Banyak brand bayar DP dulu; sisa tagihan dihitung otomatis |
| **Lama dibayar per brand** | Kelihatan brand yang selalu telat bayar, berguna untuk menentukan syarat DP berikutnya |
| **Brand langganan** | Brand yang deal lebih dari sekali bisa ditawari paket bulanan |
| **Uang masuk bulan depan** | Total invoice yang belum dibayar plus jadwal posting yang sudah deal |
| **Rekap pajak tahunan** | Total bruto, perkiraan PPh 21, dan bukti potong per brand, siap untuk SPT |
| **Template pesan** | Balas DM dengan rate card, kirim invoice, follow-up bayar, kirim bukti tayang |
| **Pipeline nego** | Catat tawaran yang masuk dan yang ditolak; lihat rasio deal dan selisih harga tawar vs rate card |
| **Mata uang asing** | Untuk brand luar: USD, SWIFT code, alamat bank |

## 6. Keamanan data sensitif

NIK, NPWP, nomor rekening, dan tanda tangan termasuk data pribadi yang
sensitif.
- Dienkripsi di database.
- Tampil tersamar di layar (`•••• 1234`), dibuka hanya saat perlu.
- Tidak ikut di link invoice publik kecuali dipilih (rekening biasanya perlu,
  NIK tidak).
- Ikut terunduh di "Unduh semua data" dan ikut terhapus saat hapus akun.

Detail syarat ada di [akun-privasi.md](akun-privasi.md).

## 7. Paket

| | Gratis | Pro |
|---|---|---|
| Kerja sama | Tanpa batas | Tanpa batas |
| Invoice | 3 per bulan | Tanpa batas, plus kwitansi, link, pengingat |
| Rate card otomatis | — | Ya |
| Rekap pajak & ekspor | — | Ya |
| Impor CSV (Notion, Sheets, Excel) | Ya (sekali, supaya mudah pindah) | Ya |

## 8. Keputusan terbuka

Sudah diputuskan: default pajak lewat satu pertanyaan awal, dan tampilan
invoice otomatis (rinci kalau ada potongan). Lihat bagian 3.

1. Default jatuh tempo: NET 7 atau NET 14?
2. Nilai awal add-on dan faktor format: cek ke 10-20 creator lewat survei
   validasi (lihat [ux-research.md](ux-research.md)) sebelum dipakai.
3. Kumpulkan 5-10 contoh tabel brand deals dari creator lain (Notion,
   Sheets, Excel) untuk menguji pencocokan kolom saat impor.
