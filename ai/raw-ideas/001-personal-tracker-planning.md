# Personal Tracker App Planning

## 1. Tujuan Aplikasi

Aplikasi ini dibuat sebagai pusat pencatatan aktivitas pribadi harian, mingguan, bulanan, dan tahunan.

Fokus utama aplikasi:

- Membantu user lebih konsisten menjalankan kebiasaan baik
- Mencatat aktivitas penting dalam satu aplikasi
- Memisahkan setiap tracker berdasarkan menu atau module
- Menampilkan progress dalam bentuk grafik
- Menjadi tempat evaluasi diri harian, mingguan, dan bulanan
- Menjadi media pribadi untuk menulis kejadian yang dialami setiap hari

---

## 2. Konsep Utama Aplikasi

Aplikasi menggunakan konsep **modular tracker**.

Artinya setiap jenis tracker dibuat sebagai menu atau module terpisah.

Contoh module utama:

- Sholat Tracker
- Puasa Tracker
- Keuangan Tracker
- Olahraga Tracker
- Makan Tracker
- Minum Tracker
- Jadwal Harian
- Jadwal Bulanan
- Jurnal Harian
- Habit Tracker
- Tidur Tracker
- Belajar Tracker
- Ibadah Tambahan Tracker
- Target Hidup Tracker

Setiap module memiliki:

- Halaman utama module
- Form input pencatatan
- Checklist aktivitas
- Riwayat pencatatan
- Grafik progress
- Contribution graph
- Statistik harian, mingguan, bulanan, dan tahunan

---

## 3. Struktur Menu Utama

```txt
Dashboard
│
├── Sholat Tracker
├── Puasa Tracker
├── Keuangan Tracker
├── Olahraga Tracker
├── Makan Tracker
├── Minum Tracker
├── Jadwal Harian
├── Jadwal Bulanan
├── Jurnal Harian
├── Habit Tracker
├── Tidur Tracker
├── Belajar Tracker
├── Ibadah Tambahan Tracker
└── Target Hidup Tracker
```

---

## 4. Dashboard Utama

Dashboard utama berfungsi sebagai ringkasan semua aktivitas user.

### Informasi yang Ditampilkan

- Sholat hari ini
- Puasa hari ini atau bulan ini
- Pengeluaran bulan ini
- Sisa budget bulan ini
- Olahraga minggu ini
- Air minum hari ini
- Jadwal hari ini
- Jurnal hari ini
- Habit yang sudah selesai
- Progress target bulanan

### Fitur Dashboard

- Summary card per module
- Quick action untuk input cepat
- Reminder aktivitas yang belum selesai
- Grafik contribution semua aktivitas
- Ringkasan progress harian
- Ringkasan progress bulanan

### Contoh Ringkasan Dashboard

```txt
Hari Ini

Sholat          : 4/5 selesai
Puasa           : Tidak puasa
Olahraga        : Belum selesai
Minum           : 6/8 gelas
Jurnal          : Belum ditulis
Keuangan        : Pengeluaran Rp 35.000
Jadwal Harian   : 5/8 selesai
```

---

## 5. Module Sholat Tracker

### Tujuan

Mencatat aktivitas sholat harian agar user bisa melihat konsistensi ibadah.

### Data yang Dicatat

- Tanggal
- Subuh
- Dzuhur
- Ashar
- Maghrib
- Isya
- Status setiap sholat
- Sholat berjamaah atau sendiri
- Catatan tambahan

### Fitur

- Checklist sholat harian
- Riwayat sholat
- Statistik sholat harian
- Statistik sholat bulanan
- Grafik konsistensi sholat
- Contribution graph sholat
- Streak sholat lengkap

### Contoh Tampilan Checklist

```txt
Sholat Hari Ini

[✓] Subuh
[✓] Dzuhur
[✓] Ashar
[ ] Maghrib
[ ] Isya
```

---

## 6. Module Puasa Tracker

### Tujuan

Mencatat puasa wajib dan puasa sunnah.

### Jenis Puasa

- Puasa Ramadhan
- Puasa Senin Kamis
- Puasa Ayyamul Bidh
- Puasa Daud
- Puasa Syawal
- Puasa Arafah
- Puasa Asyura
- Puasa sunnah lainnya

### Data yang Dicatat

- Tanggal
- Jenis puasa
- Status puasa
- Sahur
- Berbuka
- Catatan

### Fitur

- Checklist puasa
- Kalender puasa
- Target puasa sunnah bulanan
- Statistik jumlah puasa
- Grafik puasa per bulan
- Contribution graph puasa
- Riwayat puasa

### Contoh Target

```txt
Target Puasa Bulan Ini

Puasa Senin Kamis : 4 kali
Ayyamul Bidh      : 3 kali
Total Target      : 7 hari
Progress          : 3/7 hari
```

---

## 7. Module Keuangan Tracker

### Tujuan

Mencatat pemasukan, pengeluaran, dan rencana penggunaan uang.

### Submodule

- Pemasukan
- Pengeluaran
- Planning uang
- Budget bulanan
- Tabungan
- Hutang/piutang
- Target keuangan

### Data yang Dicatat

#### Pemasukan

- Tanggal
- Sumber pemasukan
- Jumlah
- Catatan

#### Pengeluaran

- Tanggal
- Kategori pengeluaran
- Jumlah
- Catatan

#### Planning Uang

- Nama rencana
- Jumlah uang
- Prioritas
- Status
- Catatan

### Contoh Kategori Pengeluaran

- Makan
- Transportasi
- Rumah/kos
- Internet
- Pendidikan
- Kesehatan
- Hiburan
- Sedekah
- Tabungan
- Darurat
- Lainnya

### Fitur

- Catat pemasukan
- Catat pengeluaran
- Buat planning uang
- Buat budget bulanan
- Pantau sisa budget
- Statistik pemasukan dan pengeluaran
- Grafik pengeluaran per kategori
- Grafik trend pengeluaran bulanan
- Contribution graph keuangan sehat

### Contoh Planning Uang

```txt
Gaji Bulan Ini: Rp 5.000.000

Planning:

- Makan        : Rp 1.000.000
- Kos/Rumah    : Rp 1.200.000
- Tabungan     : Rp 1.000.000
- Orang Tua    : Rp   500.000
- Investasi    : Rp   500.000
- Hiburan      : Rp   300.000
- Dana Darurat : Rp   500.000
```

---

## 8. Module Olahraga Tracker

### Tujuan

Mencatat jadwal olahraga dan progress olahraga.

### Data yang Dicatat

- Tanggal
- Jenis olahraga
- Durasi
- Status selesai atau belum
- Catatan

### Contoh Jenis Olahraga

- Lari
- Jalan kaki
- Push up
- Sit up
- Gym
- Sepeda
- Badminton
- Futsal
- Renang
- Stretching

### Fitur

- Jadwal olahraga mingguan
- Checklist olahraga
- Target olahraga per minggu
- Riwayat olahraga
- Statistik durasi olahraga
- Contribution graph olahraga
- Streak olahraga

### Contoh Jadwal

```txt
Jadwal Olahraga Minggu Ini

Senin    : Push Up      [✓]
Selasa   : Jalan Kaki   [✓]
Rabu     : Istirahat
Kamis    : Lari         [ ]
Jumat    : Gym          [ ]
Sabtu    : Badminton    [ ]
Minggu   : Istirahat
```

---

## 9. Module Makan Tracker

### Tujuan

Mencatat makanan yang dikonsumsi setiap hari.

### Data yang Dicatat

- Tanggal
- Waktu makan
- Nama makanan
- Porsi
- Kategori makanan
- Catatan

### Waktu Makan

- Sarapan
- Makan siang
- Makan malam
- Cemilan

### Fitur

- Catatan makan harian
- Riwayat makanan
- Statistik pola makan
- Catatan makanan sehat dan tidak sehat
- Grafik jumlah makan per hari
- Grafik kategori makanan

### Contoh Catatan

```txt
Makan Hari Ini

Sarapan     : Nasi goreng
Makan Siang : Ayam bakar + nasi
Cemilan     : Roti
Makan Malam : Sup ayam
```

---

## 10. Module Minum Tracker

### Tujuan

Mencatat jumlah air minum harian.

### Data yang Dicatat

- Tanggal
- Jumlah minum
- Satuan minum
- Waktu minum
- Catatan

### Fitur

- Target minum harian
- Checklist gelas air
- Reminder minum
- Statistik air minum
- Grafik progress minum harian
- Contribution graph minum cukup

### Contoh Checklist

```txt
Target Air Minum Hari Ini: 8 Gelas

[✓] Gelas 1
[✓] Gelas 2
[✓] Gelas 3
[✓] Gelas 4
[ ] Gelas 5
[ ] Gelas 6
[ ] Gelas 7
[ ] Gelas 8
```

---

## 11. Module Jadwal Harian

### Tujuan

Membuat planning aktivitas harian agar hari lebih terarah.

### Data yang Dicatat

- Tanggal
- Jam mulai
- Jam selesai
- Nama aktivitas
- Prioritas
- Status
- Catatan

### Status Aktivitas

- Belum mulai
- Sedang berjalan
- Selesai
- Dibatalkan

### Fitur

- To-do list harian
- Time blocking
- Prioritas aktivitas
- Checklist aktivitas
- Reminder jadwal
- Statistik produktivitas harian
- Contribution graph produktivitas

### Contoh Jadwal

```txt
Jadwal Hari Ini

05:00 - 05:30  Sholat Subuh
06:00 - 07:00  Olahraga
08:00 - 12:00  Kerja
12:00 - 13:00  Istirahat
13:00 - 17:00  Kerja
20:00 - 21:00  Belajar coding
21:00 - 21:30  Tulis jurnal
```

---

## 12. Module Jadwal Bulanan

### Tujuan

Mencatat target dan agenda penting dalam satu bulan.

### Data yang Dicatat

- Bulan
- Tahun
- Target bulanan
- Aktivitas penting
- Deadline
- Status
- Catatan evaluasi

### Fitur

- Kalender bulanan
- Target bulanan
- Agenda penting
- Progress bulanan
- Evaluasi akhir bulan
- Grafik pencapaian bulanan

### Contoh Target Bulanan

```txt
Target April 2026

- Selesaikan MVP aplikasi tracker
- Olahraga minimal 12 kali
- Puasa sunnah minimal 6 hari
- Nabung Rp 1.000.000
- Belajar bahasa Inggris 20 hari
- Tulis jurnal minimal 25 hari
```

---

## 13. Module Jurnal Harian / Social Diary

### Tujuan

Menjadi tempat menulis kejadian yang dialami hari ini.

Module ini dibuat seperti media sosial pribadi, tetapi fokus utama tetap untuk refleksi diri.

### Data yang Dicatat

- Tanggal
- Judul cerita
- Isi cerita
- Mood
- Foto opsional
- Tag
- Status privasi

### Fitur

- Tulis cerita harian
- Timeline seperti media sosial
- Upload gambar
- Mood tracker
- Tag kejadian
- Search jurnal
- Statistik mood
- Contribution graph menulis jurnal

### Contoh Jurnal

```txt
Judul:
Hari ini berhasil olahraga pagi

Isi:
Hari ini saya bangun lebih awal, lalu olahraga selama 30 menit.
Awalnya malas, tapi setelah selesai badan terasa lebih ringan.
Saya ingin mengulang kebiasaan ini besok.

Mood:
Senang
```

---

## 14. Module Habit Tracker

### Tujuan

Mencatat kebiasaan umum yang ingin dibangun secara konsisten.

### Contoh Habit

- Baca buku
- Belajar bahasa Inggris
- Belajar coding
- Tidur cepat
- Bangun pagi
- Tidak begadang
- Tidak boros
- Dzikir pagi/sore

### Fitur

- Buat habit pribadi
- Checklist habit harian
- Target mingguan
- Streak habit
- Contribution graph habit
- Statistik konsistensi

---

## 15. Module Tidur Tracker

### Tujuan

Mencatat pola tidur dan kualitas tidur.

### Data yang Dicatat

- Tanggal
- Jam tidur
- Jam bangun
- Durasi tidur
- Kualitas tidur
- Catatan

### Fitur

- Catat jam tidur
- Catat jam bangun
- Hitung durasi tidur
- Statistik tidur mingguan
- Grafik kualitas tidur
- Contribution graph tidur cukup

---

## 16. Module Belajar Tracker

### Tujuan

Mencatat aktivitas belajar dan perkembangan skill.

### Contoh Aktivitas Belajar

- Belajar coding
- Belajar bahasa Inggris
- Membaca buku
- Menonton course
- Mengerjakan project
- Membuat catatan belajar

### Data yang Dicatat

- Tanggal
- Topik belajar
- Durasi belajar
- Sumber belajar
- Progress
- Catatan

### Fitur

- Catat sesi belajar
- Target jam belajar
- Riwayat belajar
- Grafik durasi belajar
- Contribution graph belajar
- Evaluasi progress skill

---

## 17. Module Ibadah Tambahan Tracker

### Tujuan

Mencatat ibadah tambahan selain sholat wajib dan puasa.

### Contoh Ibadah

- Baca Al-Qur'an
- Dzikir pagi
- Dzikir sore
- Sedekah
- Sholat sunnah
- Kajian
- Hafalan

### Fitur

- Checklist ibadah harian
- Target ibadah mingguan
- Riwayat ibadah
- Contribution graph ibadah
- Statistik ibadah bulanan

---

## 18. Module Target Hidup Tracker

### Tujuan

Mencatat goal besar dalam hidup agar lebih terarah.

### Contoh Target

- Target karir
- Target finansial
- Target kesehatan
- Target spiritual
- Target keluarga
- Target skill
- Target project pribadi

### Data yang Dicatat

- Nama target
- Kategori target
- Deadline
- Progress
- Status
- Catatan

### Status Target

- Belum mulai
- Berjalan
- Tercapai
- Ditunda
- Dibatalkan

### Fitur

- Buat target hidup
- Pecah target menjadi langkah kecil
- Pantau progress
- Evaluasi target
- Grafik pencapaian target

---

## 19. Grafik dan Statistik

Setiap module sebaiknya memiliki grafik masing-masing.

### 19.1 Contribution Graph

Digunakan untuk melihat konsistensi aktivitas.

Contoh penggunaan:

- Sholat lengkap dalam satu hari
- Puasa dilakukan dalam satu hari
- Olahraga selesai dalam satu hari
- Jurnal ditulis dalam satu hari
- Minum mencapai target dalam satu hari
- Belajar dilakukan dalam satu hari

### 19.2 Line Chart

Digunakan untuk melihat perkembangan dari waktu ke waktu.

Contoh:

- Pengeluaran bulanan
- Durasi olahraga
- Jumlah air minum
- Durasi belajar
- Kualitas tidur

### 19.3 Bar Chart

Digunakan untuk membandingkan data.

Contoh:

- Jumlah olahraga per minggu
- Jumlah puasa per bulan
- Jumlah aktivitas selesai per hari
- Pengeluaran per kategori

### 19.4 Pie Chart

Digunakan untuk melihat proporsi data.

Contoh:

- Persentase kategori pengeluaran
- Persentase waktu harian
- Persentase jenis makanan

### 19.5 Streak Counter

Digunakan untuk melihat berapa lama user konsisten melakukan aktivitas.

Contoh:

```txt
Sholat lengkap : 5 hari berturut-turut
Olahraga       : 3 minggu konsisten
Menulis jurnal : 10 hari berturut-turut
Minum cukup    : 7 hari berturut-turut
```

---

## 20. Reminder dan Notifikasi

### Tujuan

Membantu user tidak lupa melakukan aktivitas penting.

### Contoh Reminder

- Reminder sholat
- Reminder minum
- Reminder olahraga
- Reminder tulis jurnal
- Reminder jadwal harian
- Reminder puasa sunnah
- Reminder evaluasi bulanan

### Jenis Reminder

- Reminder berdasarkan waktu
- Reminder berdasarkan hari tertentu
- Reminder aktivitas belum selesai
- Reminder target hampir deadline

---

## 21. Prioritas MVP

Agar aplikasi tidak terlalu besar di awal, buat versi MVP terlebih dahulu.

### MVP yang Disarankan

Module awal:

1. Dashboard utama
2. Sholat Tracker
3. Puasa Tracker
4. Keuangan Tracker
5. Olahraga Tracker
6. Jurnal Harian
7. Contribution graph sederhana

### Alasan Memilih Module Ini

- Sholat dan puasa adalah tracker ibadah utama
- Keuangan penting untuk kontrol uang pribadi
- Olahraga penting untuk kesehatan
- Jurnal penting untuk refleksi harian
- Contribution graph membuat progress lebih mudah dilihat

---

## 22. Tahapan Pengerjaan

## Phase 1 - Fondasi Aplikasi

Fokus:

- Membuat halaman utama
- Membuat struktur menu
- Membuat dashboard utama
- Membuat layout module
- Membuat alur input sederhana

Output:

- User bisa membuka aplikasi
- User bisa melihat daftar module
- User bisa masuk ke halaman module

---

## Phase 2 - Tracker Dasar

Fokus:

- Membuat pola tracker umum
- Membuat form pencatatan
- Membuat checklist harian
- Membuat riwayat pencatatan

Output:

- User bisa mencatat aktivitas
- User bisa melihat aktivitas yang sudah dicatat
- User bisa mengubah dan menghapus catatan

---

## Phase 3 - Module Utama MVP

Fokus membuat module:

- Sholat Tracker
- Puasa Tracker
- Keuangan Tracker
- Olahraga Tracker
- Jurnal Harian

Output:

- Setiap module utama bisa digunakan
- Setiap module punya halaman sendiri
- Setiap module punya riwayat data

---

## Phase 4 - Grafik dan Statistik

Fokus:

- Menambahkan contribution graph
- Menambahkan statistik ringkas
- Menambahkan grafik sederhana
- Menambahkan streak counter

Output:

- User bisa melihat progress aktivitas
- User bisa melihat konsistensi harian dan bulanan

---

## Phase 5 - Reminder

Fokus:

- Reminder sholat
- Reminder minum
- Reminder olahraga
- Reminder jurnal
- Reminder jadwal harian

Output:

- User mendapat pengingat aktivitas penting
- User bisa mengatur reminder sesuai kebutuhan

---

## Phase 6 - Module Tambahan

Fokus menambahkan module:

- Makan Tracker
- Minum Tracker
- Jadwal Harian
- Jadwal Bulanan
- Habit Tracker
- Tidur Tracker
- Belajar Tracker
- Ibadah Tambahan Tracker
- Target Hidup Tracker

Output:

- Aplikasi menjadi tracker pribadi yang lebih lengkap

---

## Phase 7 - Social Diary

Fokus:

- Timeline jurnal
- Post private/public
- Like
- Comment
- Follow
- Upload gambar

Catatan:

Fitur social diary sebaiknya dibuat setelah fitur tracker utama stabil.

---

## 23. Prinsip Desain Fitur

### 23.1 Modular

Setiap tracker harus berdiri sendiri.

Contoh:

- Module keuangan tidak bercampur dengan module sholat
- Module olahraga punya halaman dan grafik sendiri
- Module jurnal punya timeline sendiri

### 23.2 Mudah Diinput

Input data harus cepat dan tidak merepotkan.

Contoh:

- Sholat cukup centang
- Minum cukup klik tambah gelas
- Olahraga cukup klik selesai
- Jurnal cukup tulis seperti postingan

### 23.3 Mudah Dievaluasi

Setiap data harus bisa dilihat kembali dalam bentuk ringkasan.

Contoh:

- Hari ini sudah melakukan apa saja
- Minggu ini sudah konsisten berapa hari
- Bulan ini target tercapai berapa persen

### 23.4 Fokus pada Progress

Aplikasi tidak hanya untuk mencatat, tetapi juga untuk melihat perkembangan diri.

Contoh:

- Progress sholat
- Progress keuangan
- Progress olahraga
- Progress belajar
- Progress ibadah

---

## 24. Contoh User Flow

### 24.1 Flow Sholat

```txt
User buka aplikasi
↓
Masuk Dashboard
↓
Klik Sholat Tracker
↓
Centang sholat yang sudah dilakukan
↓
Data tersimpan
↓
Grafik sholat terupdate
```

### 24.2 Flow Puasa

```txt
User buka Puasa Tracker
↓
Pilih jenis puasa
↓
Centang status puasa hari ini
↓
Tambahkan catatan jika perlu
↓
Data tersimpan
↓
Progress puasa terupdate
```

### 24.3 Flow Keuangan

```txt
User buka Keuangan Tracker
↓
Klik Tambah Pengeluaran
↓
Isi kategori, jumlah, dan catatan
↓
Simpan
↓
Budget dan grafik terupdate
```

### 24.4 Flow Olahraga

```txt
User buka Olahraga Tracker
↓
Lihat jadwal olahraga hari ini
↓
Centang selesai setelah olahraga
↓
Isi durasi dan catatan
↓
Progress olahraga terupdate
```

### 24.5 Flow Jurnal

```txt
User buka Jurnal Harian
↓
Klik Tulis Cerita Hari Ini
↓
Isi judul, cerita, mood, dan tag
↓
Simpan
↓
Post tampil di timeline pribadi
```

---

## 25. Naming Module

Gunakan nama module yang konsisten.

```txt
sholat-tracker
puasa-tracker
finance-tracker
sport-tracker
meal-tracker
drink-tracker
daily-schedule
monthly-schedule
journal-tracker
habit-tracker
sleep-tracker
study-tracker
worship-tracker
goal-tracker
```

---

## 26. Kesimpulan

Aplikasi ini sebaiknya dibuat sebagai **Personal Modular Tracker App**.

Fokus awal bukan membuat semua fitur sekaligus, tetapi membuat pondasi tracker yang rapi dan mudah dikembangkan.

Prioritas awal:

1. Dashboard
2. Sholat Tracker
3. Puasa Tracker
4. Keuangan Tracker
5. Olahraga Tracker
6. Jurnal Harian
7. Contribution Graph

Setelah fitur utama stabil, module lain bisa ditambahkan secara bertahap.
