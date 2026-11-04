# KATALIS
### Kumpulan Alat, Template, Analisis, dan Instrumen Sistematis

Platform web terintegrasi untuk pemodelan proses bisnis BPMN 2.0, simulasi token dinamis (*bpmn-js-token-simulation*), pustaka template sistematis, dan integrasi penyimpanan cloud Supabase dengan desain antarmuka modern berbasis Vengeance UI.

---

## Tautan Resmi & Akses Langsung

- **URL Aplikasi (GitHub Pages)**: [https://mualnudarza.github.io/KATALIS/](https://mualnudarza.github.io/KATALIS/)
- **Repositori GitHub**: [https://github.com/Mualnudarza/KATALIS](https://github.com/Mualnudarza/KATALIS)
- **Database Endpoint**: [https://xrtfqufwbgbwgtwayuqt.supabase.co](https://xrtfqufwbgbwgtwayuqt.supabase.co)
- **Referensi Desain UI**: [Vengeance UI](https://www.vengenceui.com/)

---

## Fitur Utama

1. **Simulasi Token BPMN 2.0 Interaktif**:
   - Berbasis engine resmi bpmn.io (*bpmn-js-token-simulation*).
   - Pengujian semantik eksekusi proses langkah-demi-langkah.
   - Evaluasi visual gateway percabangan (XOR, AND, OR), timer event, dan sinkronisasi paralel.

2. **Desain Antarmuka Vengeance UI**:
   - Tema gelap modern (*Dark Zinc Aesthetic*) dengan efek blur backdrop.
   - *Spotlight Top Navbar* dengan identitas brand KATALIS dan akses cepat.
   - *Floating Glass Dock* untuk kendali simulasi token yang responsif.
   - *Bento Grid Modal* untuk pemilihan template dan manajemen sinkronisasi cloud.

3. **Pustaka Template Terverifikasi**:
   - Template Simulasi Token Paralel (Uji Eksekusi).
   - Template Alur End-to-End Closing Customer (Account Executive & Finance).
   - Template Kanvas Bersih untuk perancangan proses baru dari awal.

4. **Penyimpanan Hibrida (Local-First + Supabase Cloud)**:
   - *Local-First*: Otomatis menyimpan progres diagram di penyimpanan browser (*LocalStorage*) tanpa latensi.
   - *Supabase Cloud*: Kemampuan sinkronisasi cloud ke PostgreSQL database untuk persistensi jangka panjang dan audit log telemetri simulasi.

5. **Ekspor & Interoperabilitas Lengkap**:
   - Impor dan ekspor file standar XML BPMN 2.0.
   - Ekspor gambar vektor resolusi tinggi format SVG.
   - Panel properti BPMN bawaan untuk konfigurasi atribut teknis elemen proses.

---

## Struktur Direktori Repositori

```text
KATALIS/
├── .github/
│   └── workflows/
│       └── deploy.yml            # CI/CD otomatis ke GitHub Pages
├── ARCHITECTURE/
│   └── ARSITEKTUR-KATALIS.md     # Spesifikasi lengkap arsitektur 5 layer & roadmap
├── assets/                       # Aset ikon dan stylesheet token simulation
├── dist/                         # Hasil kompilasi bundel produksi Webpack
│   ├── katalis.bundle.js         # Bundel utama JavaScript
│   └── vendor/                   # Aset font, ikon, dan stylesheet vendor
├── lib/                          # Modul inti bpmn-js-token-simulation
├── node_modules/                 # Dependensi pustaka npm
├── resources/                    # Berkas sumber daya BPMN
├── src/                          # Kode sumber aplikasi
│   ├── index.js                  # Titik masuk utama aplikasi KATALIS
│   ├── supabase.js               # Klien integrasi Supabase Database
│   └── templates/
│       └── templates.js          # Pustaka template proses bisnis bawaan
├── styles/
│   └── katalis-vengence.css      # Desain tema Vengeance UI
├── supabase/
│   └── schema.sql                # Skema DDL tabel PostgreSQL Supabase
├── index.html                    # Halaman web utama untuk hosting GitHub Pages
├── package.json                  # Konfigurasi dependensi dan skrip proyek
├── webpack.config.js             # Konfigurasi kompilasi Webpack
└── README.md                     # Dokumentasi resmi proyek
```

---

## Panduan Instalasi & Pengembangan Lokal

### Kebutuhan Sistem
- Node.js versi 18 atau lebih baru
- npm versi 9 atau lebih baru
- Peramban web modern (Google Chrome, Mozilla Firefox, Microsoft Edge, atau Safari)

### Langkah Pemasangan

1. Clone repositori:
   ```bash
   git clone https://github.com/Mualnudarza/KATALIS.git
   cd KATALIS
   ```

2. Pasang seluruh dependensi:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Jalankan server pengembangan lokal:
   ```bash
   npm start
   ```
   Aplikasi akan terbuka otomatis di peramban pada alamat `http://localhost:8080`.

4. Bangun bundel produksi:
   ```bash
   npm run build
   ```

---

## Konfigurasi Supabase Cloud Database

Aplikasi KATALIS telah terkonfigurasi dengan endpoint proyek:
- URL: `https://xrtfqufwbgbwgtwayuqt.supabase.co`

Untuk mengaktifkan tabel penyimpanan di Supabase:
1. Buka dashboard proyek Supabase Anda di browser.
2. Masuk ke menu **SQL Editor**.
3. Salin dan jalankan seluruh query DDL dari berkas `supabase/schema.sql`.
4. Dapatkan **Anon Public Key** Anda dari menu **Project Settings > API**.
5. Buka aplikasi KATALIS, klik tombol **Supabase Cloud**, masukkan Anon Key, dan klik **Simpan Diagram ke Cloud**.

---

## Alur Penerbitan GitHub Pages

Aplikasi ini menggunakan GitHub Actions (`.github/workflows/deploy.yml`) untuk pengantaran otomatis:
1. Setiap commit yang di-*push* ke cabang `main` akan memicu workflow deployment.
2. Workflow mengompilasi bundel produksi dan menerbitkan aset ke GitHub Pages.
3. Pastikan pada pengaturan repositori GitHub Anda:
   - Masuk ke **Settings > Pages**.
   - Pada **Build and deployment > Source**, pilih opsi **GitHub Actions**.

---

## Lisensi & Atribusi

- Proyek ini dirilis di bawah lisensi MIT.
- Engine simulasi token mengadaptasi [bpmn-js-token-simulation](https://github.com/bpmn-io/bpmn-js-token-simulation) oleh bpmn.io.
- Konsep desain antarmuka mengacu pada [Vengeance UI](https://www.vengenceui.com/).
