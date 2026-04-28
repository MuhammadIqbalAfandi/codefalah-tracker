# Issue: Personal Modular Tracker App

## Feature Name

Personal Modular Tracker App

## Background

User membutuhkan aplikasi pribadi untuk mencatat, memantau, dan mengevaluasi aktivitas harian, mingguan, bulanan, dan tahunan dalam satu tempat.

Saat ini kebutuhan tracker tersebar dalam banyak area kehidupan, seperti ibadah, keuangan, olahraga, jurnal, kebiasaan, tidur, belajar, jadwal, dan target hidup. Agar aplikasi tetap rapi dan mudah dikembangkan, setiap jenis pencatatan perlu dipisahkan sebagai module tracker yang berdiri sendiri.

Konsep utama aplikasi adalah modular tracker, yaitu aplikasi yang memiliki dashboard utama sebagai ringkasan dan beberapa module terpisah untuk pencatatan aktivitas tertentu.

## Goal

Membuat aplikasi personal tracker yang membantu user:

- Mencatat aktivitas penting secara konsisten.
- Melihat progress aktivitas dalam bentuk ringkasan, statistik, grafik, contribution graph, dan streak.
- Mengevaluasi diri berdasarkan data harian, mingguan, bulanan, dan tahunan.
- Mengakses setiap jenis tracker melalui module yang jelas dan terpisah.
- Menulis jurnal harian sebagai media refleksi pribadi.

## Scope

Scope utama aplikasi mencakup:

- Dashboard utama sebagai ringkasan semua aktivitas user.
- Struktur menu berbasis module tracker.
- Module tracker utama untuk MVP:
  - Sholat Tracker.
  - Puasa Tracker.
  - Keuangan Tracker.
  - Olahraga Tracker.
  - Jurnal Harian.
  - Contribution graph sederhana.
- Ringkasan dashboard untuk aktivitas penting hari ini dan bulan ini.
- Form input atau checklist pencatatan aktivitas.
- Riwayat pencatatan pada setiap module.
- Statistik dasar untuk melihat progress dan konsistensi.
- Grafik sederhana sesuai kebutuhan setiap module.
- Streak counter untuk aktivitas yang bersifat konsisten.

Module tambahan yang termasuk dalam visi aplikasi, tetapi dapat dikerjakan bertahap setelah MVP:

- Makan Tracker.
- Minum Tracker.
- Jadwal Harian.
- Jadwal Bulanan.
- Habit Tracker.
- Tidur Tracker.
- Belajar Tracker.
- Ibadah Tambahan Tracker.
- Target Hidup Tracker.
- Reminder dan notifikasi.
- Social diary yang lebih lengkap.

## Out of Scope

Hal berikut tidak termasuk dalam cakupan awal issue ini:

- Implementasi kode.
- Detail teknis database, API, komponen UI, routing, atau struktur folder aplikasi.
- Rencana implementasi detail per phase.
- Integrasi dengan layanan eksternal.
- Fitur social diary publik seperti follow, like, comment, dan post public.
- Reminder atau notifikasi lanjutan sebelum tracker utama stabil.
- Semua module tambahan di luar prioritas MVP sebagai fitur wajib awal.
- Otomatisasi data dari perangkat wearable, bank, kalender eksternal, atau aplikasi pihak ketiga.

## Expected Behavior

User dapat membuka aplikasi dan melihat dashboard utama yang menampilkan ringkasan aktivitas penting.

Dashboard menampilkan informasi seperti:

- Status sholat hari ini.
- Status puasa hari ini atau bulan ini.
- Pengeluaran dan sisa budget bulan ini.
- Aktivitas olahraga minggu ini.
- Status jurnal hari ini.
- Habit atau aktivitas yang sudah selesai.
- Progress target bulanan.

User dapat membuka setiap module tracker utama dari menu aplikasi.

Pada Sholat Tracker, user dapat mencentang sholat harian, menambahkan catatan, melihat riwayat, melihat statistik, contribution graph, dan streak sholat lengkap.

Pada Puasa Tracker, user dapat mencatat jenis puasa, status puasa, sahur, berbuka, catatan, target puasa sunnah, riwayat, dan progress bulanan.

Pada Keuangan Tracker, user dapat mencatat pemasukan, pengeluaran, planning uang, budget bulanan, tabungan, hutang/piutang, dan target keuangan. User juga dapat melihat sisa budget, grafik pengeluaran, dan statistik pemasukan atau pengeluaran.

Pada Olahraga Tracker, user dapat mencatat jenis olahraga, jadwal, durasi, status selesai, catatan, target mingguan, riwayat, statistik, contribution graph, dan streak olahraga.

Pada Jurnal Harian, user dapat menulis cerita harian dengan judul, isi, mood, foto opsional, tag, dan status privasi. Catatan tampil sebagai timeline pribadi dan dapat digunakan untuk refleksi diri.

Setiap module sebaiknya memiliki pola umum:

- Halaman utama module.
- Form input atau checklist.
- Riwayat data.
- Statistik harian, mingguan, bulanan, atau tahunan sesuai kebutuhan.
- Grafik progress.
- Contribution graph bila relevan.

Input data harus cepat dan sederhana, misalnya:

- Sholat cukup dicentang.
- Olahraga cukup ditandai selesai lalu diberi durasi.
- Pengeluaran cukup mengisi kategori, jumlah, dan catatan.
- Jurnal cukup ditulis seperti postingan pribadi.

## Notes

- Gunakan ID `001` untuk semua file workflow terkait fitur ini.
- Nama module yang disarankan:
  - `sholat-tracker`
  - `puasa-tracker`
  - `finance-tracker`
  - `sport-tracker`
  - `meal-tracker`
  - `drink-tracker`
  - `daily-schedule`
  - `monthly-schedule`
  - `journal-tracker`
  - `habit-tracker`
  - `sleep-tracker`
  - `study-tracker`
  - `worship-tracker`
  - `goal-tracker`
- Aplikasi harus mengutamakan desain modular agar setiap tracker dapat dikembangkan secara terpisah.
- Fokus awal adalah membuat pondasi tracker yang rapi dan mudah dikembangkan, bukan membuat semua fitur sekaligus.
- Raw idea menyebut tahapan pengerjaan, tetapi detail phase dan implementasi harus dibuat nanti dalam file plan terpisah.
- Asumsi nama feature file: `001-personal-modular-tracker-app.issue.md`.
