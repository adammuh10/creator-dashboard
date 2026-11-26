# Akun dan privasi: daftar syarat

Versi 0.1

Daftar syarat yang harus dipenuhi sebelum aplikasi dibuka untuk umum, dan
di layar mana tiap syarat dipenuhi. Nomor layar merujuk ke
[wireframe alur web](../wireframes/README.md).

> Ini ringkasan praktis, bukan nasihat hukum. Cek ulang ke teks resmi
> UU PDP dan kebijakan toko aplikasi terbaru sebelum rilis, karena aturan
> toko aplikasi cukup sering berubah.

## 1. UU Pelindungan Data Pribadi (UU No. 27 Tahun 2022)

| Syarat | Cara memenuhinya | Layar |
|---|---|---|
| Persetujuan yang jelas dan terpisah per tujuan | Kotak persetujuan Syarat & Privasi wajib dicentang sendiri (tidak tercentang otomatis). Email promo dan analisis AI punya izin sendiri | 1.2, 7.3 |
| Informasi yang transparan | Kebijakan Privasi menjelaskan: data apa yang dikumpulkan, untuk apa, pihak ketiga yang dipakai (hosting, database, penyedia AI, pembayaran, email), lokasi server, lama penyimpanan, cara menghubungi kami | Link di 1.2, 7.3 dan footer website |
| Hak mengakses dan mendapat salinan data | "Unduh semua data": file JSON/CSV berisi semua data akun | 7.3, 7.4 |
| Hak memperbaiki data | Ubah nama, email, kata sandi; semua data konten bisa diedit | 7.1 |
| Hak menghapus data | Hapus akun dari aplikasi dan dari web | 7.3 → 7.4 → 7.5, `/hapus-akun` |
| Hak menarik persetujuan | Tombol izin AI dan email promo bisa dimatikan kapan saja. Kalau izin AI dimatikan, impor screenshot dan insight AI dinonaktifkan, fitur lain tetap jalan | 7.3 |
| Data anak | Pendaftaran untuk usia 18+ (pernyataan di kotak persetujuan). Anak di bawah 18 butuh persetujuan orang tua menurut UU PDP, jadi versi pertama dibatasi 18+ | 1.2 |
| Transfer data ke luar negeri | Server (mis. Supabase/Vercel) dan penyedia AI kemungkinan di luar Indonesia. Disebutkan di Kebijakan Privasi; pilih region terdekat (Singapura) | Kebijakan Privasi |
| Keamanan data | Kata sandi di-hash, koneksi HTTPS, akses database per pengguna (row level security), screenshot dihapus setelah angkanya terbaca | Teknis |
| Pemberitahuan kebocoran | Kalau terjadi kebocoran, pengguna dan otoritas diberi tahu paling lambat 3 × 24 jam. Siapkan prosedur dan template email sebelum rilis | Proses internal |
| Data keuangan sensitif (NIK, NPWP, rekening, tanda tangan untuk invoice) | Dienkripsi di database, tampil tersamar, hanya dipakai untuk invoice, tidak ikut di link publik kecuali dipilih, ikut terunduh dan terhapus bersama akun. Lihat [cuan.md](cuan.md) | 4.4 Data penagih |
| Kontak untuk urusan data | "Hubungi kami soal data" (email khusus, mis. privasi@domain) | 7.3 |

## 2. Pendaftaran PSE (Komdigi)

Layanan digital yang menyimpan data pengguna di Indonesia wajib terdaftar
sebagai Penyelenggara Sistem Elektronik lingkup privat. Daftar lewat OSS
(gratis) sebelum dibuka untuk umum.

## 3. Toko aplikasi

Tidak berlaku: produk ini website, tidak dirilis di Google Play atau App
Store, dan langganan dibayar lewat payment gateway web. Kalau nanti dibuat
aplikasi toko, syarat tambahannya: hapus akun dari dalam aplikasi, formulir
Data Safety / label privasi, Play Billing / In-App Purchase, dan "Masuk
dengan Apple" di iOS.

## 4. Langganan dan perlindungan konsumen

- **Batal semudah berlangganan:** tombol "Batalkan langganan" di layar
  Langganan, tanpa harus chat admin (layar 7.2).
- Tampilkan harga, periode tagihan, dan tanggal tagihan berikutnya sebelum
  pengguna membayar.
- Setelah batal, Pro tetap aktif sampai akhir periode yang sudah dibayar.
- Kalau hapus akun saat masih berlangganan, langganan dihentikan otomatis.

## 5. Penyimpanan dan penghapusan data

| Data | Disimpan | Setelah akun dihapus |
|---|---|---|
| Akun, brand, konten, tugas, ide | Selama akun aktif | Dihapus seketika; hilang dari cadangan maksimal 30 hari |
| Data impor (angka per postingan) | Selama akun aktif | Sama seperti di atas |
| Screenshot yang diupload | Hanya sampai angkanya terbaca | Tidak disimpan |
| File video | Tidak pernah disimpan (hanya link) | — |
| Catatan pembayaran langganan (invoice) | Sesuai kewajiban pajak | Disimpan terpisah, tanpa data konten; dijelaskan di Kebijakan Privasi |
| Log keamanan (login, perangkat) | 90 hari | Dihapus bersama akun |
| Invoice & kwitansi yang kamu buat untuk brand | Selama akun aktif (kamu bisa mengunduh arsipnya) | Dihapus bersama akun; unduh arsip dulu karena mungkin perlu untuk pajakmu |

## 6. Email dan analitik

- Email transaksional (verifikasi, reset kata sandi, tagihan) selalu
  dikirim. Email promo hanya kalau pengguna setuju, dan setiap email promo
  punya link berhenti berlangganan.
- Pakai analitik tanpa cookie pelacak, supaya tidak perlu banner cookie dan
  data perilaku tidak dibagikan ke pihak iklan.

## 7. Dokumen yang harus siap sebelum rilis

1. Kebijakan Privasi (Bahasa Indonesia, versi Inggris kalau dijual ke luar
   negeri).
2. Syarat Layanan (termasuk batas usia, langganan, pengembalian dana).
3. Halaman web `/hapus-akun`.
4. Prosedur kebocoran data dan template pemberitahuannya.
5. Pendaftaran PSE.
