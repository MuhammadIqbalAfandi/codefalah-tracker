# Improvement Request: Revisi Contribution Dashboard Agar Lebih Jelas

## Background

Dashboard saat ini sudah mulai menampilkan contribution, insight, dan ringkasan harian. Namun dari sudut pandang user, masih ada beberapa bagian yang terasa membingungkan karena istilah, skor, dan hubungan antar data belum cukup jelas.

Masalah utamanya bukan hanya tampilan, tetapi pemahaman user terhadap arti data yang ditampilkan.

## Main Problems

### 1. Filter tahun di dashboard masih kurang fleksibel

Saat ini filter tahun pada area contribution sudah ada, tetapi bentuknya masih kurang ideal jika data semakin panjang di masa depan.

Masalah:

- pilihan tahun akan semakin banyak seiring penggunaan aplikasi
- tampilan tombol tahun bisa menjadi kurang rapi jika jumlah tahun bertambah
- pengalaman memilih tahun akan lebih sulit dibandingkan jika memakai dropdown

Perbaikan yang diinginkan:

- ubah filter tahun pada contribution dashboard menjadi dropdown
- pastikan dropdown tetap mudah digunakan ketika jumlah tahun sudah bertambah banyak

### 2. Dashboard belum memiliki dokumentasi atau panduan pemahaman yang cukup

Saat ini user masih bisa bingung dengan arti beberapa informasi di dashboard.

Contoh kebingungan user:

- `progress` menghitung apa saja
- `tanggal acuan` dipakai untuk apa
- kenapa card tertentu masih menunjukkan angka seperti `0/5` padahal user merasa aktivitasnya sudah selesai
- streak dihitung dari aturan apa
- apa yang harus dilakukan user agar nilai di dashboard berubah

Perbaikan yang diinginkan:

- tambahkan satu menu, bantuan, atau dokumentasi singkat khusus untuk menjelaskan dashboard
- jelaskan arti setiap area penting di dashboard dengan bahasa yang sederhana
- bantu user memahami bagaimana data backend memengaruhi angka, status, dan insight yang tampil

### 3. Label intensitas contribution masih membingungkan

Pada contribution sholat, user masih belum memahami arti label seperti:

- kosong
- ringan
- sedang
- tinggi

Contoh masalah:

- user sudah sholat 5 waktu tetapi contribution masih terlihat `sedang`
- user mengira jika 5 waktu sudah lengkap maka seharusnya langsung dianggap penuh atau selesai

Masalah ini menunjukkan bahwa mapping antara data backend dan level contribution belum cukup jelas bagi user.

Perbaikan yang diinginkan:

- perjelas arti setiap level contribution
- pastikan aturan scoring contribution sesuai dengan ekspektasi user atau setidaknya dijelaskan dengan jelas
- evaluasi apakah scoring sholat saat ini memang sudah benar secara logika produk

## Core Concern

Dari keseluruhan pengalaman saat ini, dashboard masih memberi kesan bahwa sebagian data belum sepenuhnya terasa terhubung dengan data backend atau belum dijelaskan dengan baik ke user.

Akibatnya:

- user bisa meragukan keakuratan dashboard
- user sulit memahami kenapa suatu angka atau status muncul
- insight yang seharusnya membantu justru terasa membingungkan

## Expected Improvement

Perbaikan berikut diharapkan dari improvement ini:

- dashboard lebih mudah dipahami tanpa user harus menebak arti tiap angka atau status
- filter tahun contribution lebih scalable untuk penggunaan jangka panjang
- contribution scoring, terutama untuk sholat, terasa lebih masuk akal atau minimal lebih jelas penjelasannya
- tersedia panduan singkat agar user memahami hubungan antara data input dan hasil yang tampil di dashboard

## Notes

- Fokus improvement ini adalah clarity dan pemahaman user.
- Jangan hanya memperbaiki visual jika akar masalahnya ada pada istilah, scoring, atau penjelasan data.
- Jika memang ada data dashboard yang belum sinkron dengan backend, itu perlu dianggap sebagai bug nyata, bukan sekadar masalah copywriting.
