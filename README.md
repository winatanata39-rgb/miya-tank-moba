# 🎮 MIYA TANK - Mini MOBA Game

Sebuah game mini MOBA interaktif yang dibangun dengan HTML5 Canvas dan JavaScript vanilla. Mainkan sebagai Miya Tank dan hindari tower musuh sambil mengumpulkan poin!

## 🎯 Fitur Utama

- **Pemain yang Dapat Dimainkan**: Kontrol Miya Tank dengan klik/tap untuk melompat
- **Sistem Musuh**: Tower musuh yang bergerak dari kanan ke kiri dengan berbagai kesulitan
- **Power-Up**: Kumpulkan power-up hijau untuk menambah HP atau skor
- **Sistem Level**: Semakin tinggi skor, semakin sulit permainan
- **Efek Partikel**: Animasi visual yang menarik saat tabrakan atau mengambil power-up
- **Tiga Tingkat Kesulitan**:
  - 🟢 **Mudah**: Kecepatan lambat, spawn rate rendah
  - 🟡 **Normal**: Kecepatan sedang, spawn rate normal
  - 🔴 **Sulit**: Kecepatan cepat, spawn rate tinggi

## 🎮 Cara Bermain

1. **Membuat Melompat**: Klik atau tap layar untuk membuat Miya Tank melompat
2. **Hindari Tower**: Hindari tower merah yang bergerak dari kanan
3. **Ambil Power-Up**: Kumpulkan power-up hijau untuk bonus kesehatan atau skor
4. **Tingkatkan Level**: Semakin tinggi skor, semakin sulit permainan
5. **Pertahankan HP**: Anda memiliki 3 HP. Jika mencapai 0, game over!

## 📊 Scoring System

- **Tower yang Dihindari**: +1 poin setiap frame
- **Power-Up Kesehatan**: +50 poin + 1 HP
- **Power-Up Skor**: +100 poin

## 🎨 Teknologi yang Digunakan

- **HTML5**: Struktur dan semantik
- **CSS3**: Styling dan efek visual
- **JavaScript (ES6+)**: Game logic dan interaktivitas
- **Canvas API**: Rendering grafis

## 📁 Struktur File

```
miya-tank-moba/
├── index.html      # File HTML utama
├── game.js         # Logic game
└── README.md       # Dokumentasi
```

## 🚀 Cara Menjalankan

1. Clone atau download repository ini
2. Buka file `index.html` di browser modern
3. Mulai bermain!

## 🎨 Elemen Game

### Player (Miya Tank)
- Karakter berwarna biru dengan mata
- Melompat dengan mekanik gravitasi realistis
- Bergerak otomatis di garis horizontal

### Tower (Musuh)
- Tower merah bergerak dari kanan ke kiri
- Memiliki turret dan warning symbol
- Mengurangi 1 HP saat terkena

### Power-Up
- Berwarna hijau dengan efek glow
- Ada dua jenis: kesehatan dan skor
- Bergerak naik turun secara lembut

### Partikel
- Efek ledakan saat tabrakan
- Efek kumpulan saat mengambil power-up

## 🎮 Controls

| Aksi | Kontrol |
|------|---------|
| Melompat | Klik / Tap Layar |
| Pause | Tombol ⏸️ Pause |
| Main Ulang | Tombol 🔄 Main Ulang |

## 📈 Difficulty Progression

Kesulitan bertambah otomatis setiap 200 poin:
- Kecepatan tower meningkat +0.5
- Spawn rate meningkat +0.002

## 🎯 Tips Bermain

1. Perhatikan polanya - tower spawn tidak benar-benar random
2. Gunakan momentum melompat untuk menghindari
3. Prioritaskan mengumpulkan power-up kesehatan
4. Dalam mode sulit, lebih cepat dan reaktif
5. Jangan lupa pause jika ingin istirahat!

## 🐛 Debugging

Jika game tidak berjalan:
1. Pastikan browser mendukung HTML5 Canvas
2. Buka console (F12) untuk melihat error
3. Refresh halaman
4. Coba browser lain

## 📝 Lisensi

Bebas digunakan untuk keperluan pribadi dan pendidikan.

## 🎊 Selamat Bermain!

Nikmati game Miya Tank Mini MOBA ini! Jangan lupa share score tertinggimu! 🎮✨

---

**Dibuat dengan ❤️ menggunakan JavaScript Vanilla**
