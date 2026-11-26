# Akun dan privasi: daftar syarat

Versi 0.1

Daftar syarat yang harus dipenuhi sebelum aplikasi dibuka untuk umum, dan
di layar mana tiap syarat dipenuhi. Nomor layar merujuk ke
[wireframe](../wireframes/README.md).

> Ini ringkasan praktis, bukan nasihat hukum. Cek ulang ke teks resmi
> UU PDP dan kebijakan toko aplikasi terbaru sebelum rilis, karena aturan
> toko aplikasi cukup sering berubah.

## 1. UU Pelindungan Data Pribadi (UU No. 27 Tahun 2022)

| Syarat | Cara memenuhinya | Layar |
|---|---|---|
| Persetujuan yang jelas dan terpisah per tujuan | Kotak persetujuan Syarat & Privasi wajib dicentang sendiri (tidak tercentang otomatis). Email promo dan analisis AI punya izin sendiri | 10, 13 |
| Informasi yang transparan | Kebijakan Privasi menjelaskan: data apa yang dikumpulkan, untuk apa, pihak ketiga yang dipakai (hosting, database, penyedia AI, pembayaran, email), lokasi server, lama penyimpanan, cara menghubungi kami | Link di 9, 10, 13 dan di web |
| Hak mengakses dan mendapat salinan data | "Unduh semua data": file JSON/CSV berisi semua data akun | 13, 14 |
| Hak memperbaiki data | Ubah nama, email, kata sandi; semua data konten bisa diedit | 11 |
| Hak menghapus data | Hapus akun dari aplikasi dan dari web | 14, 15, web `/hapus-akun` |
| Hak menarik persetujuan | Tombol izin AI dan email promo bisa dimatikan kapan saja. Kalau izin AI dimatikan, impor screenshot dan insight AI dinonaktifkan, fitur lain tetap jalan | 13 |
| Data anak | Pendaftaran untuk usia 18+ (pernyataan di kotak persetujuan). Anak di bawah 18 butuh persetujuan orang tua menurut UU PDP, jadi versi pertama dibatasi 18+ | 10 |
| Transfer data ke luar negeri | Server (mis. Supabase/Vercel) dan penyedia AI kemungkinan di luar Indonesia. Disebutkan di Kebijakan Privasi; pilih region terdekat (Singapura) | Kebijakan Privasi |
| Keamanan data | Kata sandi di-hash, koneksi HTTPS, akses database per pengguna (row level security), screenshot dihapus setelah angkanya terbaca | Teknis |
| Pemberitahuan kebocoran | Kalau terjadi kebocoran, pengguna dan otoritas diberi tahu paling lambat 3 × 24 jam. Siapkan prosedur dan template email sebelum rilis | Proses internal |
| Kontak untuk urusan data | "Hubungi kami soal data" (email khusus, mis. privasi@domain) | 13 |

## 2. Pendaftaran PSE (Komdigi)

Layanan digital yang menyimpan data pengguna di Indonesia wajib terdaftar
sebagai Penyelenggara Sistem Elektronik lingkup privat. Daftar lewat OSS
(gratis) sebelum dibuka untuk umum.

## 3. Google Play

| Syarat | Cara memenuhinya | Layar |
|---|---|---|
| Kebijakan privasi bisa dibuka di dalam aplikasi dan di halaman toko | Link di menu Akun dan Privasi | 9, 13 |
| Formulir Data Safety | Isi sesuai daftar data di Kebijakan Privasi | Play Console |
| Hapus akun dari dalam aplikasi | Privasi & data → Hapus akun | 13, 14 |
| Hapus akun **tanpa** harus memasang aplikasi | Halaman web `/hapus-akun` (login lalu hapus, atau kirim permintaan lewat email) | Web |
| Pembayaran barang digital di dalam aplikasi | Pakai Google Play Billing untuk langganan yang dibeli di aplikasi Android | 12 |

## 4. App Store (Apple)

| Syarat | Cara memenuhinya | Layar |
|---|---|---|
| Hapus akun dari dalam aplikasi (bukan sekadar nonaktif) | Alur hapus akun 13 → 14 → 15 | 13–15 |
| Login alternatif yang menjaga privasi kalau ada login Google | Tambah "Masuk dengan Apple" di versi iOS | 10 (versi iOS) |
| Label privasi di halaman toko | Isi sesuai Kebijakan Privasi | App Store Connect |
| Langganan digital di dalam aplikasi | Pakai In-App Purchase Apple; beri tahu bahwa langganan dari App Store dikelola di pengaturan Apple | 12 |
| Kebijakan privasi bisa diakses | Link di aplikasi dan di halaman toko | 9, 13 |

## 5. Langganan dan perlindungan konsumen

- **Batal semudah berlangganan:** tombol "Batalkan langganan" di layar
  Langganan, tanpa harus chat admin (layar 12).
- Tampilkan harga, periode tagihan, dan tanggal tagihan berikutnya sebelum
  pengguna membayar.
- Setelah batal, Pro tetap aktif sampai akhir periode yang sudah dibayar.
- Kalau hapus akun saat masih berlangganan: langganan web dihentikan
  otomatis; langganan dari App Store / Google Play diberi pengingat untuk
  dibatalkan di toko masing-masing.

## 6. Penyimpanan dan penghapusan data

| Data | Disimpan | Setelah akun dihapus |
|---|---|---|
| Akun, brand, konten, tugas, ide | Selama akun aktif | Dihapus seketika; hilang dari cadangan maksimal 30 hari |
| Data impor (angka per postingan) | Selama akun aktif | Sama seperti di atas |
| Screenshot yang diupload | Hanya sampai angkanya terbaca | Tidak disimpan |
| File video | Tidak pernah disimpan (hanya link) | — |
| Catatan pembayaran langganan (invoice) | Sesuai kewajiban pajak | Disimpan terpisah, tanpa data konten; dijelaskan di Kebijakan Privasi |
| Log keamanan (login, perangkat) | 90 hari | Dihapus bersama akun |

## 7. Email dan analitik

- Email transaksional (verifikasi, reset kata sandi, tagihan) selalu
  dikirim. Email promo hanya kalau pengguna setuju, dan setiap email promo
  punya link berhenti berlangganan.
- Pakai analitik tanpa cookie pelacak, supaya tidak perlu banner cookie dan
  data perilaku tidak dibagikan ke pihak iklan.

## 8. Dokumen yang harus siap sebelum rilis

1. Kebijakan Privasi (Bahasa Indonesia, versi Inggris kalau dijual ke luar
   negeri).
2. Syarat Layanan (termasuk batas usia, langganan, pengembalian dana).
3. Halaman web `/hapus-akun`.
4. Prosedur kebocoran data dan template pemberitahuannya.
5. Pendaftaran PSE.
6. Formulir Data Safety (Play) dan label privasi (App Store), kalau masuk
   toko aplikasi.
