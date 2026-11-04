# AGENT OPERATIONAL RULES AND CONTEXT LOADER

Dokumen Penanggung Jawab: ORKESTRATOR (Lintas Direktorat / Chief of Staff)
Lokasi Berkas: Root Repositori Proyek (`AGENTS.md`)
Target Pembaca AI: Seluruh instans agen koding (Claude Code, Cursor, Codex, Windsurf).
Status: Terverifikasi (The 4 Files Framework)

---

## 01 Purpose
Berkas ini memuat instruksi operasional, batas kendali teknis, dan protokol wajib bagi seluruh agen kecerdasan buatan yang beroperasi di repositori proyek KATALIS. Setiap sesi koding wajib mematuhi aturan ini secara disiplin.

## 02 Before You Start (Pre-Flight Checklist)
Sebelum menulis atau memodifikasi satu baris kode pun di proyek KATALIS, agen AI wajib menjalankan pemeriksaan awal:
1. **Pahami Batasan Produk**: Baca `docs/PRD.md` untuk memahami visi KATALIS sebagai Portal Hub alat sistematis dan batasan `Out of Scope`. Jangan membangun sistem di luar ruang lingkup yang disepakati.
2. **Kunci Aturan Visual**: Baca `docs/DESIGN-SYSTEM.md`. Antarmuka KATALIS WAJIB menggunakan Mode Terang (*Light Mode*) berbasis Vengeance UI. Dilarang mengubah latar menjadi tema gelap atau menggunakan kode warna arbitrer di luar tabel CSS Variables resmi.
3. **Patuhi Denah Arsitektur**: Baca `docs/ARCHITECTURE.md` sebelum membuat folder baru, merombak arsitektur router, atau memasang dependensi luar.
4. **Verifikasi Penyimpanan**: Prioritaskan penyimpanan lokal murni (*Local-First Offline* via browser `localStorage`). Jangan memaksakan koneksi database cloud wajib.
5. **Periksa Komponen Eksisting**: Selalu amati struktur `src/` dan stylesheet `styles/` sebelum menambahkan elemen baru.

## 03 Multi-Agent Role Delegation (MUALNURDARZA Standard)
- **ANALIS (Direktorat I)**: Penanggung jawab `docs/PRD.md`, ruang lingkup katalog portal, dan kriteria penerimaan pengguna.
- **KURATOR (Direktorat I)**: Penanggung jawab `README.md`, panduan instalasi lokal, dan dokumentasi arsitektur.
- **PERANCANG (Direktorat II)**: Penanggung jawab `docs/DESIGN-SYSTEM.md`, kepatuhan Mode Terang Vengeance UI, token heksadesimal, dan responsivitas layout.
- **PEREKAYASA (Direktorat II)**: Penanggung jawab `docs/ARCHITECTURE.md`, logika JavaScript, konfigurasi Webpack, integrasi bpmn-js, dan engine simulasi token.
- **PENGUJI (Direktorat III)**: Penanggung jawab pengujian integritas ekspor XML BPMN, verifikasi aliran token, dan penanganan status error peramban.
- **AUDITOR (Direktorat III)**: Verifikator kepatuhan gerbang mutu (*quality gate*) terhadap ketiadaan emoji, lisensi aset, dan standardisasi penamaan.
- **ORKESTRATOR**: Koordinasi terpadu antar-agen dan validasi kesesuaian sistem dengan arahan pengguna.

## 04 General Engineering Rules
- **Arsitektur Utama**: Portal Hub di beranda awal, berpindah ke Ruang Kerja Alat saat modul dibuka, dengan Sidebar Navigasi untuk kembali ke Hub.
- **Wajib Mode Terang**: Latar belakang kanvas `#F8FAFC`, kartu dan navbar `#FFFFFF`, teks `#0F172A`, aksen `#2563EB`. Dilarang menggunakan tema gelap.
- **Kemandirian 100% Offline**: Aplikasi harus dapat berfungsi penuh tanpa jaringan internet setelah dimuat dari GitHub Pages.
- **Prinsip Modular**: Pisahkan logika Portal Hub (`src/portal/`) dengan logika Ruang Kerja Alat BPMN (`src/tools/bpmn/`).
- **Larangan Mutlak Emoji**: Dilarang keras menyematkan karakter emoji pada kode sumber, komentar, teks antarmuka, judul, maupun log sistem.
- **Larangan Berkas Sampah**: Jangan membuat berkas sementara atau duplikasi skrip di dalam repositori.

## 05 Security Directives
- Dilarang membocorkan kunci API atau rahasia sensitif di dalam kode sumber.
- Seluruh data diagram pengguna disimpan di peramban lokal mereka sendiri (*zero data leakage*).
- Berkas XML BPMN yang diimpor wajib divalidasi oleh parser sebelum dimuat ke kanvas guna mencegah serangan injeksi skrip (XSS).

## 06 Useful Commands
```bash
npm install               # Memasang seluruh dependensi pustaka resmi
npm start                 # Menjalankan server pengembangan lokal (http://localhost:8080)
npm run build             # Mengompilasi bundel produksi Webpack ke folder dist/
```

## 07 When Unsure (Protokol Mitigasi Keraguan)
1. Periksa berkas spesifikasi kanonikal di dalam direktori `docs/` (`PRD.md`, `DESIGN-SYSTEM.md`, `ARCHITECTURE.md`).
2. Amati pola implementasi bpmn-js dan token simulation yang telah terpasang.
3. Jika terdapat perubahan kebutuhan bisnis atau fitur baru, tanyakan kepada pengguna dan perbarui berkas di `docs/` terlebih dahulu sebelum menyentuh kode. Dilarang menebak secara sepihak.
