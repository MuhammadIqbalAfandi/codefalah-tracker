# Enhancement Idea: Dashboard Revamp and Module Contribution Views

## Latar Belakang

Dashboard saat ini masih terasa terlalu umum dan belum cukup membantu user membaca perkembangan aktivitas dari setiap module secara jelas.

Bagian contribution juga masih perlu diarahkan ulang agar benar-benar merepresentasikan progres harian dalam bentuk visual yang konsisten dan mudah dipahami. Karena itu, dashboard yang sekarang perlu dievaluasi dan disusun ulang, bukan sekadar dipoles tampilan luarnya.

## Tujuan

Enhancement ini bertujuan untuk:

- menyederhanakan ulang struktur dashboard agar lebih fokus dan informatif
- menjadikan contribution graph sebagai elemen utama untuk membaca progres harian
- memastikan setiap module memiliki tampilan contribution yang konsisten
- menyediakan halaman detail contribution agar user bisa melihat aktivitas harian dengan konteks yang lebih lengkap

## Arah Perubahan

Perubahan yang diinginkan bukan hanya redesign visual, tetapi perombakan cara dashboard menyajikan informasi.

Secara umum:

- dashboard yang sekarang boleh dihapus atau diganti
- contribution graph menjadi pusat utama pembacaan progres
- setiap module perlu memiliki representasi contribution sendiri di dashboard
- user harus bisa masuk dari dashboard ke halaman detail contribution per module

## Konsep Contribution Graph

Contribution graph yang diinginkan memiliki karakteristik berikut:

- setiap module memiliki contribution graph sendiri pada dashboard
- setiap contribution graph ditampilkan dalam satu card
- satu card menampilkan 12 bulan dalam satu tampilan
- satu kotak kecil merepresentasikan 1 hari
- jumlah kotak mengikuti jumlah hari yang sebenarnya pada setiap bulan
- setiap kotak menunjukkan ada atau tidaknya progres pada hari tersebut

Visual contribution tidak harus meniru GitHub secara persis, tetapi harus tetap terasa ringkas, konsisten, dan mudah dibaca.

## Flow Interaksi

Saat user melihat dashboard:

- user bisa melihat contribution graph dari setiap module
- user bisa memahami hari-hari mana yang memiliki aktivitas dan mana yang kosong

Saat user mengklik salah satu contribution dashboard:

- user diarahkan ke halaman baru
- contribution graph untuk module tersebut tetap ditampilkan di bagian atas
- di bawah graph, tampil daftar aktivitas yang relevan dengan kontribusi atau record pada periode yang dipilih

## Harapan Per Halaman Detail

Halaman detail contribution sebaiknya membantu user membaca hubungan antara pola visual dan data asli.

Minimalnya:

- graph tetap terlihat sebagai konteks utama
- ada daftar aktivitas di bawah graph
- daftar aktivitas relevan dengan module yang dibuka
- transisi dari ringkasan dashboard ke detail terasa natural dan mudah dipahami

## Scope Awal

Enhancement ini terutama mencakup:

- evaluasi dan penyusunan ulang dashboard yang ada saat ini
- perancangan ulang card contribution pada dashboard
- contribution graph per module
- navigasi dari card contribution ke halaman detail contribution
- tampilan detail contribution yang menampilkan graph dan daftar aktivitas

## Out of Scope Sementara

Untuk sementara, ide ini belum secara spesifik membahas:

- aturan final perhitungan level intensitas contribution selain status ada atau tidak ada aktivitas
- filter lanjutan per periode, kategori, atau label
- perombakan module selain yang berkaitan langsung dengan dashboard dan contribution view
- perubahan arsitektur stack di luar pola yang sudah dipakai project

## Expected Behavior

Sebagai user:

- saya bisa membuka dashboard dan langsung melihat contribution dari setiap module
- saya bisa memahami progres harian dengan cepat melalui kotak-kotak contribution
- saya bisa mengklik contribution suatu module untuk melihat detail lebih lanjut
- saya tetap melihat graph di halaman detail agar konteks visualnya tidak hilang
- saya bisa melihat daftar aktivitas di bawah graph untuk memahami data yang membentuk contribution tersebut

## Catatan

- Enhancement ini cocok diposisikan sebagai perombakan pengalaman dashboard, bukan hanya penambahan komponen baru
- Jika nanti diperlukan, definisi "progres" per module bisa dijabarkan lebih rinci pada issue atau plan turunan
- Fokus utama ide ini adalah kejelasan visual, konsistensi antar module, dan kemudahan membaca aktivitas harian
