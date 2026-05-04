# Improvement Request: Rapikan Input, Waktu Lokal, dan Dokumentasi Dashboard

## Background

Setelah beberapa improvement pada dashboard dan contribution, masih ada beberapa detail UX yang terasa belum rapi dan belum konsisten.

Masalah yang muncul bukan hanya soal tampilan, tetapi juga soal akurasi waktu, kenyamanan input, dan penempatan dokumentasi agar user bisa memahami dashboard tanpa mengganggu alur utama.

## Main Problems

### 1. Komponen input masih belum konsisten dengan arah UI saat ini

Saat ini beberapa bagian masih memakai komponen native browser, terutama untuk:

- input date
- dropdown select

Masalah:

- tampilannya terasa kurang konsisten dengan komponen dashboard lain
- pengalaman visual dan interaksi terasa campur antara native browser dan UI system yang sudah dipakai
- kesan produk jadi kurang rapi meskipun fitur utamanya sudah berkembang

Perbaikan yang diinginkan:

- ganti komponen date dari native menjadi versi yang sesuai dengan Shadcn UI
- ganti dropdown select native ke komponen select yang konsisten dengan Shadcn UI
- pastikan perubahan ini tetap nyaman dipakai di desktop dan mobile

### 2. Pembacaan tanggal belum selaras dengan waktu lokal Jakarta

Saat ini ada indikasi bahwa pembacaan tanggal masih tidak konsisten dengan timezone lokal pengguna.

Contoh masalah:

- waktu lokal sudah masuk `4 May`
- tetapi data untuk `4 May` belum terbaca
- sistem masih terasa seperti membaca `3 May`

Masalah ini penting karena dashboard, contribution, dan detail activity sangat bergantung pada tanggal yang benar.

Perbaikan yang diinginkan:

- pastikan tanggal mengikuti waktu lokal `UTC+7 / Asia/Jakarta`
- periksa seluruh alur yang memengaruhi default date, summary date, contribution date, dan detail activity date
- jika ada pergeseran karena UTC atau parsing frontend/backend, anggap ini sebagai bug nyata

### 3. Dokumentasi dashboard perlu dipindahkan ke pola interaksi yang lebih tepat

Saat ini dokumentasi atau penjelasan dashboard sebaiknya tidak langsung memenuhi halaman utama.

Masalah:

- dokumentasi tetap penting
- tetapi jika tampil terlalu terbuka di area utama, halaman bisa terasa terlalu padat
- user tetap butuh cara yang mudah untuk membukanya saat bingung

Perbaikan yang diinginkan:

- tampilkan dokumentasi atau penjelasan di dalam popup, dialog, atau surface serupa
- sediakan tombol `show`, `info`, `help`, atau entry point sejenis di posisi yang lebih tepat dan mudah ditemukan
- pastikan tombol pembuka dokumentasi tidak mengganggu hirarki utama dashboard

### 4. Tipografi label waktu masih perlu dirapikan

Beberapa label seperti:

- `Bulan ini`
- `Hari ini`
- `Minggu ini`

masih perlu penyesuaian agar lebih enak dilihat dan terasa lebih intentional.

Perbaikan yang diinginkan:

- rapikan gaya font, ukuran, atau emphasis untuk label periode waktu
- pastikan label periode mudah dibedakan tetapi tidak terlalu dominan
- jaga agar hasil akhir tetap konsisten dengan hierarchy dashboard yang sudah ada

## Core Concern

Secara keseluruhan, dashboard saat ini sudah lebih kaya fitur, tetapi masih ada detail implementasi yang membuat pengalaman terasa kurang rapi, kurang konsisten, atau kurang akurat.

Akibatnya:

- user bisa merasa input dan filter belum terasa polished
- bug timezone bisa merusak kepercayaan terhadap data dashboard
- dokumentasi yang niatnya membantu bisa terasa berat jika penempatannya kurang tepat
- tipografi yang belum pas bisa membuat hierarchy visual terasa kurang matang

## Expected Improvement

Perbaikan berikut diharapkan dari improvement ini:

- input date dan select terasa lebih konsisten dengan komponen UI yang sudah dipakai
- pembacaan tanggal benar-benar mengikuti waktu lokal Jakarta
- dokumentasi dashboard tetap mudah diakses tetapi tidak membebani layout utama
- label periode seperti `Hari ini`, `Minggu ini`, dan `Bulan ini` terasa lebih rapi dan nyaman dibaca

## Notes

- Fokus improvement ini adalah konsistensi UI, akurasi tanggal, dan penempatan dokumentasi yang lebih tepat.
- Jika masalah tanggal ternyata berasal dari logika UTC atau sinkronisasi frontend/backend, prioritaskan sebagai bug correctness, bukan sekadar polish UI.
- Jangan hanya memindahkan dokumentasi ke popup; pastikan entry point untuk membukanya tetap jelas dan natural bagi user.
