# Improvement Request: Samakan Ukuran Field Tanggal dan Rapikan Lebar Date Picker

## Background

Setelah perubahan date input pada feature sebelumnya, pengalaman form di beberapa module sudah bergerak ke arah yang lebih konsisten. Namun, masih ada masalah visual yang cukup terasa pada ukuran field dan tampilan date picker.

Masalah ini terlihat sederhana, tetapi cukup memengaruhi kesan rapi dan kenyamanan penggunaan form. Ketika field tanggal dan field input biasa tidak memiliki ukuran yang selaras, layout form terasa kurang matang. Di sisi lain, ada beberapa kondisi ketika tampilan date picker muncul terlalu besar dan terasa janggal saat dibuka.

## Main Problems

### 1. Ukuran field tanggal dan field input biasa masih belum seragam

Saat ini di berbagai module, field tanggal masih terlihat berbeda ukuran dibanding field input lain di form yang sama.

Masalah:

- tinggi atau proporsi field tanggal tidak selalu sama dengan field input biasa
- tampilan form terasa kurang konsisten antar komponen
- layout keseluruhan jadi terlihat kurang rapi meskipun fungsi form sudah berjalan

Perbaikan yang diinginkan:

- samakan ukuran visual field tanggal dengan field input biasa di semua module yang relevan
- pastikan tinggi, padding, dan proporsi komponen terasa selaras dalam satu form
- jaga agar hasil akhirnya konsisten di desktop dan mobile

### 2. Date picker di beberapa module masih muncul terlalu besar saat dibuka

Saat user membuka field tanggal, ada beberapa kondisi di mana date picker tampil terlalu besar dan terasa tidak proporsional terhadap layout form.

Contoh:

- salah satu kasus yang terlihat jelas ada di module `Sholat`

Masalah:

- ukuran date picker terasa terlalu besar dibanding area form di sekitarnya
- tampilan yang terlalu lebar atau terlalu tinggi membuat interaksi terasa janggal
- konsistensi pengalaman antar module jadi terganggu

Perbaikan yang diinginkan:

- rapikan ukuran date picker agar tampil lebih proporsional saat dibuka
- pastikan lebarnya terasa sesuai dengan field dan container form
- pastikan komponen tetap nyaman digunakan tanpa terasa sempit atau berlebihan

## Core Concern

Fokus utama improvement ini adalah konsistensi visual dan kenyamanan penggunaan form, terutama pada field tanggal.

Jika tidak dirapikan:

- form akan tetap terasa tidak konsisten secara visual
- field tanggal akan terlihat seperti komponen yang “berbeda sendiri”
- pengalaman membuka date picker bisa terasa mengganggu, terutama pada module yang layout-nya lebih sempit

## Expected Improvement

Perbaikan berikut diharapkan dari improvement ini:

- ukuran field tanggal selaras dengan field input biasa di semua module yang relevan
- date picker tampil dengan ukuran yang lebih proporsional saat dibuka
- form terasa lebih rapi, seimbang, dan konsisten secara visual
- pengalaman penggunaan date input terasa lebih nyaman di desktop dan mobile

## Notes

- Fokus improvement ini adalah visual consistency dan usability, bukan perubahan logika tanggal.
- Jika ada perbedaan kebutuhan layout antar module, tetap prioritaskan konsistensi tampilan tanpa membuat komponen terasa dipaksakan.
- Jangan hanya mengecilkan komponen date picker; pastikan hasil akhirnya tetap mudah dipakai dan tetap jelas dibaca.
