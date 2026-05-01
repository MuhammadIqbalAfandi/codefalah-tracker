# Personal Tracker Dashboard and Sidebar Improvement Ideas

## Ringkasan Ide

Fokus ide ini adalah merapikan pengalaman penggunaan aplikasi, terutama pada:

- sidebar template daftar module
- kejelasan isi dashboard utama
- kejelasan statistik per module
- arti progress, contribution, dan summary card

Tujuan utamanya adalah membuat tampilan lebih mudah dipahami, lebih informatif, dan benar-benar mencerminkan data yang sudah pernah diinput user.

---

## 1. Perbaikan Sidebar

Sidebar daftar module sebaiknya dibuat lebih nyaman dipakai.

### Harapan

- Ada tombol untuk `open sidebar`
- Ada tombol untuk `close sidebar`
- Perilaku sidebar jelas saat dipakai di layar kecil maupun layar besar
- Navigasi antar module terasa sederhana dan tidak membingungkan

---

## 2. Arah Perbaikan Dashboard

Dashboard perlu dibuat lebih jelas dan lebih mudah dimengerti sebagai ringkasan statistik keseluruhan.

Saat ini dashboard sebaiknya tidak hanya menampilkan card, tetapi juga benar-benar membantu user memahami:

- apa yang sudah dikerjakan
- apa yang belum dikerjakan
- bagaimana perkembangan dalam periode tertentu
- bagaimana membaca angka atau progress yang ditampilkan

---

## 3. Kebutuhan Dashboard per Module

Setiap module di dashboard idealnya bisa menampilkan data dalam beberapa rentang waktu:

- hari ini
- minggu ini
- bulan ini
- tahun ini

Kalau memungkinkan, user juga sebaiknya bisa melihat daftar aktivitas atau ringkasan record pada rentang tersebut, bukan hanya angka total.

### Contoh kebutuhan per module

#### Dashboard Sholat

- Bisa mengetahui aktivitas sholat dalam setahun, sebulan, seminggu, dan per hari
- Angka statistik mudah dibaca untuk periode yang dipilih
- Terlihat jelas sholat mana yang lengkap, kurang, atau belum dilakukan

#### Dashboard Puasa

- Bisa mengetahui daftar dan statistik puasa pada periode tertentu
- Bisa dibedakan antara puasa yang sudah dilakukan dan yang belum
- Ringkasan angkanya mudah dipahami

#### Dashboard Keuangan

- Bisa mengetahui daftar transaksi pada periode tertentu
- Statistik pemasukan dan pengeluaran lebih mudah dibaca
- Ringkasan keuangan terasa relevan dengan kebutuhan evaluasi user

#### Dashboard Olahraga

- Tambahkan grafik untuk melihat intensitas olahraga pada rentang tertentu
- Bisa menampilkan nilai atau indikator lain yang membantu membaca konsistensi
- Detail visualnya boleh dikembangkan secara kreatif selama tetap jelas

#### Dashboard Jurnal

- Saat ini jurnal belum menampilkan angka atau daftar jurnal pada rentang tertentu
- Padahal data sudah pernah diinput sebelumnya
- Dashboard jurnal sebaiknya menampilkan jumlah entri, daftar entri, atau ringkasan aktivitas menulis sesuai periode

---

## 4. Kejelasan Progress

Bagian `progress` saat ini terasa belum jelas.

Contoh masalah:

- Jika muncul angka seperti `25%`, belum jelas itu angka apa
- Belum jelas progress tersebut dihitung dari target apa
- Belum jelas apakah progress berlaku harian, mingguan, atau bulanan

### Harapan

- Progress memiliki arti yang jelas
- Ada konteks perhitungan yang mudah dimengerti user
- Label atau penjelasan singkat membantu membaca progress tanpa menebak-nebak

Bagian ini bisa dikembangkan sesuai ide terbaik agar lebih komunikatif.

---

## 5. Kejelasan Contribution

Bagian `contribution` akan lebih baik jika menampilkan pola aktivitas dalam rentang waktu yang lebih jelas.

### Harapan

- Bisa menampilkan contribution per hari atau per bulan
- Polanya bisa mirip gaya visual GitHub, atau versi lain yang lebih cocok untuk aplikasi ini
- User bisa cepat memahami kapan dirinya aktif dan kapan tidak aktif

---

## 6. Evaluasi Summary Card di Dashboard

Ada beberapa card di dashboard seperti:

- ibadah
- aktivitas
- belum ada catatan hari ini

Saat ini maksud dari beberapa card tersebut terasa belum jelas.

### Harapan

- Setiap card punya arti yang tegas
- Isi card relevan dengan data nyata yang dimiliki user
- Tidak ada card yang terasa generik atau membingungkan
- Kalau perlu, nama card, isi card, atau cara penyajiannya bisa disesuaikan ulang

Bagian ini terbuka untuk penyesuaian desain dan isi agar dashboard terasa lebih masuk akal.

---

## 7. Arah Implementasi yang Diinginkan

Perubahan yang diharapkan bukan hanya mempercantik tampilan, tetapi juga:

- memperjelas makna setiap informasi
- menampilkan statistik yang benar-benar berguna
- menampilkan data yang sesuai dengan record yang sudah diinput
- membantu user membaca perkembangan dirinya dengan cepat

Jika ada bagian yang belum ideal, pendekatan implementasinya boleh dikembangkan secara kreatif selama hasil akhirnya tetap jelas, informatif, dan mudah dipahami.
