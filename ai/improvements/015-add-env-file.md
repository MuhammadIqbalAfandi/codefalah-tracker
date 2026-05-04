# Improvement: Environment Config Extraction And Localization UI Consistency

## Background

Konfigurasi aplikasi saat ini masih tersebar di backend dan frontend, sehingga perubahan setting berisiko menjadi tidak konsisten dan lebih sulit dirawat. Di sisi lain, hasil awal fitur localization juga masih menyisakan beberapa detail UI yang belum konsisten, terutama pada ukuran tombol setting dan teks navigasi yang belum sepenuhnya mengikuti bahasa aktif.

Improvement ini dimaksudkan sebagai lanjutan setelah fondasi localization mulai tersedia, sambil sekaligus merapikan cara aplikasi menyimpan dan membaca konfigurasi environment.

## Main Problems

- Konfigurasi backend belum seluruhnya dipusatkan ke file `.env`, sehingga maintenance setting masih terasa tersebar.
- Konfigurasi frontend juga belum seluruhnya dipusatkan ke file `.env`, sehingga pengelolaan environment belum seragam.
- Jika dukungan `.env` native di backend belum memadai, perlu pendekatan yang tetap maintainable, misalnya melalui `go viper` atau solusi serupa yang sesuai dengan stack project.
- Ukuran tombol ganti bahasa dan tombol ganti tema belum selaras, sehingga area setting terlihat kurang rapi.
- Beberapa teks UI masih tertinggal dalam Bahasa Indonesia walaupun bahasa aktif sudah diubah ke English, contohnya tombol `Kembali ke riwayat`.
- Posisi tombol `Kembali ke riwayat` belum konsisten dibanding pola tombol lain seperti `Back to dashboard` dan `Open module`, sehingga ritme layout antar halaman terasa tidak seragam.

## Core Concern

Project membutuhkan dua perapihan yang saling terkait:

- fondasi konfigurasi yang lebih mudah dikelola lewat `.env`
- pengalaman localization yang lebih konsisten di level UI dan layout

Fokus utamanya bukan menambah fitur baru yang besar, tetapi merapikan fondasi maintainability dan konsistensi antarmuka agar hasil fitur sebelumnya terasa lebih matang.

## Expected Improvement

- Seluruh setting penting di backend dipindahkan ke pola konfigurasi berbasis `.env` yang sesuai dengan stack Go di project ini.
- Seluruh setting penting di frontend dipindahkan ke `.env` agar pengelolaan environment menjadi lebih jelas dan seragam.
- Pendekatan pembacaan config di backend tetap sederhana, aman, dan mudah dipelihara jika perlu memakai helper seperti `go viper`.
- Ukuran visual tombol ganti bahasa dan ganti tema dibuat seimbang agar area kontrol header terlihat konsisten.
- Semua teks penting pada UI localization mengikuti bahasa aktif, termasuk tombol kembali di halaman detail.
- Pola posisi tombol kembali diseragamkan agar selaras dengan layout tombol navigasi lain di dashboard dan halaman module.

## Notes

- Scope improvement ini sebaiknya dijaga tetap fokus pada `environment configuration` dan `localization UI consistency`.
- Jika nantinya dipisah menjadi workflow implementasi, besar kemungkinan lebih sehat dijadikan dua feature terpisah:
  - standardisasi `.env` backend/frontend
  - follow-up polish untuk localization dan konsistensi action layout
- Improvement ini berhubungan langsung dengan hasil feature localization sebelumnya, jadi baseline perilaku bahasa aktif yang sudah berjalan perlu tetap dipertahankan.
