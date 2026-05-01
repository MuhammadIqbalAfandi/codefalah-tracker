# Enhancement Idea: Interactive Record Management and Theme Support

## Latar Belakang

Pada feature `001-personal-modular-tracker-app`, fondasi MVP untuk dashboard dan module utama sudah tersedia, termasuk alur penyimpanan data dasar untuk sholat, puasa, keuangan, olahraga, dan jurnal.

Namun, pengalaman penggunaan masih belum lengkap karena riwayat pada beberapa module belum sepenuhnya menampilkan data nyata dari backend, dan user belum bisa melihat detail, mengedit, atau menghapus data yang sudah dibuat. Selain itu, aplikasi belum memiliki opsi dark theme untuk kenyamanan penggunaan.

Enhancement ini dibuat untuk melengkapi kemampuan dasar pengelolaan data pada module yang sudah ada, tanpa menambah module baru.

## Tujuan

Meningkatkan MVP tracker yang sudah ada agar user bisa:

- Melihat riwayat data asli yang tersimpan dari backend pada setiap module
- Melihat detail penuh dari satu data pada halaman khusus
- Mengedit data yang sudah pernah dibuat
- Menghapus data dengan aman
- Mengganti tampilan aplikasi ke dark theme

## Hubungan Dengan Feature Lama

Enhancement ini adalah kelanjutan langsung dari `001-personal-modular-tracker-app`.

Feature `001` membangun fondasi dashboard, API, form input, dan navigasi module utama. Feature baru ini tidak membuat module baru, tetapi menyempurnakan usability dan lifecycle data pada module yang sudah dibuat di `001`.

## Scope

Enhancement ini mencakup:

- Riwayat setiap module mengambil data nyata dari backend, bukan data placeholder
- Riwayat diperbarui setelah create, edit, atau delete
- Halaman detail khusus untuk setiap record pada:
  - Sholat Tracker
  - Puasa Tracker
  - Keuangan Tracker
  - Olahraga Tracker
  - Jurnal Harian
- Fitur edit record pada setiap module MVP yang sudah ada
- Fitur hapus record pada setiap module MVP yang sudah ada
- Konfirmasi sebelum penghapusan data
- Refresh summary atau tampilan terkait setelah data diubah atau dihapus
- Opsi dark theme yang berlaku global di frontend
- Penyimpanan preferensi theme agar tetap konsisten saat app dibuka ulang

## Out of Scope

Hal-hal berikut tidak termasuk dalam enhancement ini:

- Penambahan module baru
- Sistem authentication atau multi-user
- Undo delete / trash bin
- Sinkronisasi cloud atau backup/export data
- Redesign besar pada dashboard
- Perubahan arsitektur stack di luar `/ai/context/tech-stack.md`

## Expected Behavior

Sebagai user:

- Saya bisa membuka halaman module dan melihat riwayat data yang benar-benar pernah saya simpan
- Saya bisa memilih satu item riwayat untuk membuka halaman detail khusus
- Saya bisa mengedit data dari halaman detail atau halaman edit
- Saya bisa menghapus data dan mendapat konfirmasi sebelum data benar-benar dihapus
- Setelah edit atau hapus, history dan summary terkait ikut diperbarui
- Saya bisa mengaktifkan dark theme dan preferensinya tetap tersimpan

## Kebutuhan Per Module

### Sholat Tracker

- Riwayat menampilkan record sholat yang tersimpan
- Detail menampilkan tanggal, status setiap waktu sholat, dan catatan
- Edit memperbolehkan perubahan status sholat dan catatan
- Delete menghapus record terpilih

### Puasa Tracker

- Riwayat menampilkan record puasa yang tersimpan
- Detail menampilkan tanggal, jenis puasa, status, sahur, berbuka, dan catatan
- Edit memperbolehkan perubahan field yang relevan
- Delete menghapus record terpilih

### Keuangan Tracker

- Riwayat menampilkan transaksi yang tersimpan
- Detail menampilkan tipe transaksi, nominal, kategori, tanggal, dan catatan
- Edit memperbolehkan perubahan data transaksi
- Delete menghapus transaksi terpilih dan summary ikut menyesuaikan

### Olahraga Tracker

- Riwayat menampilkan record olahraga yang tersimpan
- Detail menampilkan jenis olahraga, durasi, tanggal, status, dan catatan
- Edit memperbolehkan perubahan data olahraga
- Delete menghapus record terpilih

### Jurnal Harian

- Riwayat menampilkan entri jurnal yang tersimpan
- Detail menampilkan judul, isi, mood, tags, tanggal, dan metadata relevan
- Edit memperbolehkan perubahan isi jurnal
- Delete menghapus entri jurnal terpilih

## Catatan Implementasi

- Tetap gunakan stack yang sudah disetujui pada `/ai/context/tech-stack.md`
- Gunakan pola backend dan frontend yang sudah dibangun pada feature `001`
- Hindari menambah dependency baru kecuali benar-benar diperlukan dan dijelaskan dulu di plan
- Fokus enhancement ini adalah melengkapi CRUD usability dan theme support, bukan memperluas domain feature
