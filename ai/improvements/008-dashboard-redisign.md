# Dashboard Redesign Request

## Background

Dashboard saat ini sudah memiliki contribution view dan beberapa summary penting, tetapi pengalaman utamanya masih belum terasa cukup kuat sebagai halaman yang cepat dipahami dan benar-benar membantu user mengambil tindakan.

Masalah yang masih terasa saat ini:

- card kiri terlalu banyak teks dan belum cukup actionable
- contribution section masih terasa berat untuk dibaca cepat
- belum ada kontrol tahun untuk penggunaan jangka panjang
- insight yang tampil masih lebih bersifat data display daripada guidance
- banyak kondisi kosong atau bernilai `0` yang belum memberi arahan jelas ke user

Permintaan redesign ini bertujuan memperjelas fungsi dashboard sebagai pusat ringkasan, arahan, dan pembacaan konsistensi habit.

## Main Goal

Redesign dashboard agar lebih:

- cepat dipahami
- actionable
- fokus pada consistency
- relevan untuk penggunaan jangka panjang

User idealnya bisa langsung memahami tiga hal dalam beberapa detik pertama:

- apa yang perlu dilakukan hari ini
- progres hari ini seperti apa
- konsistensi mereka sedang bagus, stagnan, atau menurun

## Design Direction

Dashboard yang diinginkan:

- lebih sederhana secara visual
- lebih kuat di insight, bukan hanya angka
- lebih membantu user mengambil langkah berikutnya
- tetap terasa cocok untuk aplikasi tracker pribadi, bukan analytics dashboard yang terlalu berat

## Scope

Redesign ini hanya mencakup area dashboard.

### 1. Top Section

#### A. Ganti card kiri menjadi `Progress Hari Ini`

Card ini harus menjadi entry point utama dashboard.

Isi yang diharapkan:

- progress harian dalam persen
- status tiap module utama:
  - Sholat `(x/5)`
  - Puasa
  - Keuangan
  - Olahraga
  - Jurnal
- CTA utama seperti:
  - `Lanjutkan aktivitas`
  - atau CTA setara yang lebih tepat

Tujuan:

- user langsung tahu kondisi hari ini
- user langsung tahu apa yang belum selesai

#### B. Perjelas card kanan menjadi `Quick Summary`

Card ini tetap ringkas, tetapi lebih informatif.

Tambahan yang diharapkan:

- status indicator seperti `good`, `warning`, atau `bad`
- insight ringan per module
- ringkasan yang membantu membaca kondisi cepat tanpa harus membuka detail

### 2. Contribution Section

Contribution tetap menjadi bagian penting, tetapi tampilannya harus lebih ringan dan lebih mudah dipahami.

#### A. Sederhanakan pembacaan contribution

Yang diinginkan:

- contribution lebih fokus pada ringkasan yang cepat dibaca
- hindari kesan terlalu padat atau terlalu berat saat melihat rentang panjang

#### B. Tambahkan filter tahun

Ini adalah kebutuhan wajib.

Tujuan:

- memudahkan penggunaan jangka panjang
- membantu user melihat contribution per tahun tanpa terasa penuh

#### C. Tambahkan insight bulanan

Minimal insight yang diharapkan:

- total hari aktif
- persentase konsistensi
- jumlah hari kosong

#### D. Tambahkan meta insight

Insight tambahan yang diinginkan:

- streak terpanjang
- trend naik atau turun

### 3. Tambahkan card insight pendukung

Dashboard boleh memiliki card tambahan selama tetap ringkas dan tidak membuat halaman terasa berat.

Kandidat card:

#### A. `Streak Card`

Isi:

- current streak
- target streak

#### B. `Weekly Summary`

Isi:

- hari aktif minggu ini
- perbandingan dengan minggu lalu

#### C. `Recommendation Card`

Isi berupa arahan sederhana, misalnya:

- `Kamu belum olahraga 3 hari`
- `Coba mulai dari 10 menit hari ini`

Tujuan card tambahan:

- membantu user mengambil keputusan
- bukan sekadar menambah angka

### 4. Empty State Improvement

Jika data belum ada atau masih kosong:

- jangan hanya tampilkan angka `0`
- berikan empty state yang tetap membantu
- sediakan CTA atau shortcut ke module terkait

Contoh arah:

- `Mulai aktivitas`
- shortcut langsung ke module

## Out of Scope

Permintaan ini tidak mencakup:

- perubahan backend
- perubahan database
- detail implementasi kode
- redesign halaman module lain
- perubahan arsitektur aplikasi

## Expected Outcome

Hasil redesign yang diharapkan:

- dashboard bisa dipahami sangat cepat
- dashboard terasa lebih berguna, bukan hanya informatif
- user lebih mudah tahu langkah berikutnya
- contribution dan summary terasa lebih relevan untuk habit tracking jangka panjang
- informasi penting lebih menonjol daripada angka-angka pasif

## Notes

- gunakan pendekatan contribution seperti GitHub hanya sebagai referensi, bukan untuk disalin mentah
- prioritaskan UX dan clarity dibanding detail data yang terlalu berat
- hindari overload informasi
- jika harus memilih, prioritaskan insight yang mendorong tindakan dibanding statistik yang hanya dekoratif
