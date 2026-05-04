# Improvement Request: Rapikan Input Tanggal dan Sederhanakan Dashboard

## Background

Setelah beberapa iterasi pada dashboard dan detail contribution, masih ada beberapa bagian yang terasa belum rapi dari sisi input, kepadatan informasi, dan kenyamanan penggunaan di mobile.

Masalah yang muncul bukan berdiri sendiri. Sebagian berkaitan dengan konsistensi komponen form, sebagian lagi berkaitan dengan dashboard yang saat ini terasa terlalu penuh sehingga fungsi utamanya sebagai ringkasan harian menjadi kurang fokus.

## Main Problems

### 1. Input tanggal di setiap module masih belum konsisten dan belum ideal

Saat ini input tanggal di beberapa module masih terasa terlalu bergantung pada input otomatis atau komponen bawaan browser.

Masalah:

- input tanggal belum terasa konsisten antar module
- pengalaman memilih tanggal belum cukup jelas dan nyaman
- arah UI yang diinginkan adalah pemilihan tanggal lewat calendar, bukan sekadar input otomatis

Perbaikan yang diinginkan:

- gunakan date picker berbasis calendar yang konsisten dengan komponen Shadcn UI
- terapkan perilaku ini pada setiap module yang memiliki input tanggal
- pastikan interaksi pemilihan tanggal tetap nyaman di desktop dan mobile

### 2. Filter tahun pada dashboard masih kurang rapi dan belum responsif di mobile

Saat ini filter tahun pada dashboard masih menampilkan angka tahun dengan presentasi yang belum cukup bersih, dan versi mobile juga belum terasa responsif.

Masalah:

- tampilan filter tahun masih terasa kurang rapi
- label atau struktur visual di bawah angka tahun terasa tidak perlu
- pengalaman di mobile belum nyaman dan belum tertata dengan baik

Perbaikan yang diinginkan:

- sederhanakan tampilan filter tahun agar fokus pada angka tahunnya saja
- hilangkan elemen label tambahan yang tidak diperlukan
- rapikan layout filter tahun agar responsif dan tetap mudah dipakai di mobile

### 3. `Quick Summary` sebaiknya dihapus agar dashboard lebih fokus

Saat ini dashboard terasa memiliki terlalu banyak area informasi, dan salah satu yang dinilai tidak perlu dipertahankan adalah `Quick Summary`.

Masalah:

- dashboard sudah memuat cukup banyak teks dan informasi
- keberadaan `Quick Summary` menambah distraksi pada halaman utama
- fungsi utama dashboard sebagai ringkasan cepat jadi kurang fokus

Perbaikan yang diinginkan:

- hapus card `Quick Summary`
- gunakan ruang yang ada untuk membuat dashboard terasa lebih ringan dan lebih fokus pada informasi inti

### 4. Detail contribution graph perlu otomatis mengarah ke bulan berjalan

Saat user membuka detail contribution, posisi scroll saat ini belum membantu user langsung melihat konteks bulan yang sedang berjalan.

Masalah:

- user masih perlu scroll manual ke bulan aktif
- pengalaman membaca detail contribution jadi kurang efisien

Perbaikan yang diinginkan:

- saat membuka detail contribution graph, otomatis arahkan scroll ke bulan berjalan
- contoh: jika saat ini bulan `May`, tampilan detail sebaiknya langsung berada di area bulan `May`

### 5. Dashboard masih terlalu penuh teks sehingga tujuan utamanya terdistraksi

Secara umum, dashboard masih terasa terlalu ramai oleh teks dan elemen penjelasan.

Masalah:

- terlalu banyak teks membuat dashboard terasa berat dibaca
- perhatian user terpecah dari fungsi utama dashboard
- hirarki informasi utama menjadi kurang tegas

Perbaikan yang diinginkan:

- sederhanakan area dashboard yang terlalu padat teks
- prioritaskan informasi yang paling penting untuk dibaca cepat
- jaga agar dashboard tetap informatif tanpa terasa penuh

### 6. Card dokumentasi sebaiknya dihapus dan diganti dengan tombol bantuan yang lebih ringan

Saat ini card dokumentasi di dashboard dianggap terlalu memakan ruang. User tetap butuh bantuan, tetapi entry point-nya sebaiknya lebih ringan.

Masalah:

- card dokumentasi menambah kepadatan layout
- dokumentasi tetap penting, tetapi tidak perlu selalu tampil sebagai card
- modal atau tampilan bantuannya juga belum responsif di mobile

Perbaikan yang diinginkan:

- hapus card dokumentasi dari area utama dashboard
- ganti dengan tombol seperti `Show Help` atau entry point serupa di bagian atas
- pastikan modal atau dialog bantuan responsif dan nyaman digunakan di mobile

## Core Concern

Fokus utama improvement ini adalah merapikan pengalaman penggunaan dashboard dan module form agar terasa lebih jelas, ringan, dan konsisten.

Jika tidak dirapikan:

- input tanggal akan terasa tidak selaras dengan arah UI aplikasi
- dashboard akan terus terasa terlalu padat
- user perlu melakukan langkah manual yang seharusnya bisa dibantu sistem
- pengalaman mobile tetap terasa tertinggal dibanding desktop

## Expected Improvement

Perbaikan berikut diharapkan dari improvement ini:

- input tanggal di semua module memakai calendar picker yang konsisten
- filter tahun dashboard tampil lebih sederhana dan lebih responsif di mobile
- card `Quick Summary` dihapus agar dashboard lebih fokus
- detail contribution otomatis membuka area bulan berjalan
- teks dan elemen dashboard yang tidak penting dikurangi
- dokumentasi dipindahkan dari card ke tombol bantuan yang lebih ringan, dengan modal yang responsif

## Notes

- Fokus improvement ini adalah clarity, consistency, dan usability.
- Jika perlu memilih prioritas, dahulukan perubahan yang paling berdampak pada pengalaman harian user: input tanggal, fokus dashboard, dan responsivitas mobile.
- Jangan hanya memindahkan elemen; pastikan hasil akhirnya benar-benar membuat dashboard lebih ringan dan lebih mudah dipahami.
