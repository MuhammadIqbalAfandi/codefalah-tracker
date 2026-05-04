# Improvement Request: Rapikan Bahasa, Format Tanggal, dan Dukungan Multi-Bahasa

## Background

Saat ini aplikasi sudah mulai memiliki tampilan dan struktur informasi yang lebih rapi, tetapi penggunaan bahasa dan format tanggal masih belum konsisten di beberapa area.

Masalah ini terasa cukup penting karena bahasa dan format tanggal adalah bagian yang langsung dibaca user setiap hari. Ketika UI menggunakan bahasa tertentu tetapi format tanggalnya masih mengikuti pola lain, hasil akhirnya terasa kurang natural dan bisa mengurangi kesan polished.

Selain itu, sudah ada kebutuhan agar aplikasi mulai mendukung lebih dari satu bahasa, minimal untuk `Bahasa Indonesia` dan `English`.

## Main Problems

### 1. Format tanggal masih belum konsisten dengan bahasa yang sedang dipakai

Saat ini ada kondisi di mana bahasa tampilan sudah menggunakan Bahasa Indonesia, tetapi format tanggal di beberapa bagian, termasuk dashboard, masih tampil dengan pola seperti `tahun-bulan-tanggal`.

Masalah:

- format tanggal belum selalu mengikuti bahasa aktif
- tampilan tanggal di dashboard masih terasa tidak natural untuk user berbahasa Indonesia
- pengalaman membaca informasi tanggal jadi terasa campur antara format lokal dan format teknis

Perbaikan yang diinginkan:

- sesuaikan format tanggal dengan bahasa yang sedang dipakai
- jika bahasa aktif adalah Bahasa Indonesia, gunakan format tanggal yang terasa natural untuk konteks Indonesia
- jika bahasa aktif adalah English, gunakan format tanggal yang sesuai dengan konteks English

### 2. Aplikasi belum memiliki dukungan multi-bahasa

Saat ini bahasa aplikasi belum disiapkan secara jelas untuk mendukung lebih dari satu bahasa.

Masalah:

- teks aplikasi belum dirancang untuk berganti bahasa secara konsisten
- belum ada fondasi yang jelas untuk mendukung pilihan bahasa
- ketika kebutuhan bahasa bertambah, perubahan bisa menjadi lebih sulit jika tidak disiapkan dari sekarang

Perbaikan yang diinginkan:

- tambahkan dukungan multi-bahasa minimal untuk `Bahasa Indonesia` dan `English`
- pastikan teks utama aplikasi bisa mengikuti bahasa yang dipilih user
- jadikan perubahan ini sebagai fondasi agar pengelolaan bahasa di masa depan lebih rapi

### 3. Belum ada pengaturan untuk memilih bahasa

Walaupun kebutuhan multi-bahasa sudah muncul, saat ini belum ada mekanisme yang jelas agar user bisa memilih bahasa aplikasi.

Masalah:

- user belum bisa mengganti bahasa secara langsung dari aplikasi
- pengalaman multi-bahasa akan terasa belum lengkap tanpa pengaturan bahasa

Perbaikan yang diinginkan:

- tambahkan setting atau kontrol untuk memilih bahasa
- pastikan pilihan bahasa mudah ditemukan dan mudah digunakan
- pastikan perubahan bahasa juga memengaruhi format tanggal dan teks yang relevan

### 4. Perlu pendekatan yang maintainable untuk pengelolaan bahasa

Karena cakupan ini menyentuh banyak teks dan format tampilan, pengelolaannya perlu dibuat cukup rapi sejak awal.

Masalah:

- jika penanganan bahasa dilakukan manual per halaman, hasilnya bisa tidak konsisten
- format tanggal dan teks UI berisiko tetap tersebar dengan pola berbeda-beda

Perbaikan yang diinginkan:

- gunakan pendekatan yang maintainable untuk pengelolaan bahasa
- penggunaan library untuk i18n diperbolehkan jika memang membantu hasil yang lebih rapi dan konsisten
- pastikan solusi yang dipilih tetap sederhana dan tidak berlebihan untuk kebutuhan saat ini

## Core Concern

Fokus utama improvement ini adalah konsistensi bahasa, keterbacaan tanggal, dan kesiapan aplikasi untuk mendukung multi-bahasa dengan cara yang rapi.

Jika tidak dirapikan:

- format tanggal akan terus terasa tidak selaras dengan bahasa UI
- pengalaman membaca dashboard dan halaman lain bisa terasa kurang natural
- penambahan multi-bahasa di masa depan bisa menjadi lebih rumit

## Expected Improvement

Perbaikan berikut diharapkan dari improvement ini:

- format tanggal mengikuti bahasa aktif aplikasi
- Bahasa Indonesia dan English didukung sebagai pilihan bahasa awal
- tersedia pengaturan untuk memilih bahasa
- teks dan tanggal terasa lebih natural sesuai konteks bahasa yang dipakai
- fondasi pengelolaan bahasa menjadi lebih rapi dan lebih mudah dikembangkan

## Notes

- Fokus improvement ini adalah language consistency, date localization, dan usability.
- Prioritaskan hasil yang terasa natural untuk user, terutama pada tampilan tanggal di dashboard dan area lain yang sering dibaca.
- Penggunaan library untuk i18n diperbolehkan, tetapi tetap pilih pendekatan yang sederhana dan sesuai kebutuhan aplikasi saat ini.
