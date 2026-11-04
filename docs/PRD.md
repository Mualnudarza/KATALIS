# PRODUCT REQUIREMENTS DOCUMENT (PRD)

Dokumen Penanggung Jawab: ANALIS (Direktorat I: Bisnis & Pengetahuan)
Target Pembaca AI: Claude Code, Cursor, Codex, dan seluruh instans agen koding.
Status: Terverifikasi (Hasil Wawancara Frontier GRILL-ME)
Versi: 1.0.0

---

## 01 Product Overview
- **Product Name:** KATALIS
- **Kepanjangan:** Kumpulan Alat, Template, Analisis, dan Instrumen Sistematis
- **Tagline:** Portal terpadu instrumen dan alat analisis proses bisnis berbasis peramban web statis.
- **Description:** KATALIS adalah portal web multifungsi yang menyediakan katalog perkakas (*tools*), instrumen analisis, dan pustaka template operasional. Pada rilis awal (Versi 1), KATALIS menyajikan modul pemodelan proses bisnis BPMN 2.0 standar internasional OMG yang dilengkapi mesin simulasi token interaktif (*token simulation*) yang dapat dieksekusi 100% lokal offline di peramban web tanpa ketergantungan server runtime.

---

## 02 Problem
Dalam perancangan operasional dan manajemen proses bisnis, pengguna menghadapi kendala sistemik:
1. **Ketiadaan Platform Terpadu**: Alat perancangan proses, kalkulator analisis, dan instrumen operasional tersebar di berbagai aplikasi terpisah, membingungkan pengguna yang membutuhkan satu pintu masuk (*portal hub*).
2. **Diagram Alur Pasif (Mati)**: Pemodelan alur kerja SOP umumnya hanya menghasilkan gambar statis yang tidak dapat diuji kebenaran logikanya secara visual.
3. **Ketergantungan Backend Berat**: Menguji simulasi proses bisnis biasanya membutuhkan instalasi engine orkestrasi berat (Camunda, Zeebe, dsb.), menyulitkan analisis cepat di lapangan atau lingkungan tanpa instalasi khusus.
4. **Ketergantungan Akses Cloud & Privasi**: Pengguna sering kali dilarang mengunggah diagram proses sensitif perusahaan ke cloud pihak ketiga tanpa otorisasi formal.

---

## 03 Goal
Menyediakan portal web statis mandiri (*client-side static portal*) yang memungkinkan pengguna membuka katalog instrumen sistematis, merancang alur proses BPMN 2.0, memvalidasi semantik eksekusi melalui simulasi token animasi, serta mengelola diagram secara aman di penyimpanan lokal peramban tanpa latensi dan tanpa server eksternal dalam waktu kurang dari 3 menit sejak aplikasi dibuka.

---

## 04 Target Users
- **Business Process Analyst**: Profesional yang memetakan, menganalisis, dan mengoptimalkan SOP lintas divisi.
- **Quality Assurance & Audit Tim**: Auditor internal yang memvalidasi kepatuhan alur kerja terhadap standar ISO/APQC.
- **Konsultan Manajemen & Operasional**: Praktisi yang membutuhkan alat visualisasi instan untuk presentasi dan lokakarya klien.
- **Pendidik & Mahasiswa**: Pengajar dan pelajar yang mempelajari semantik notasi BPMN 2.0 dan perilaku gateway/token.

---

## 05 Core Features (Version 1)
Fitur wajib yang harus diselesaikan untuk rilis awal (MVP) sesuai hasil wawancara GRILL-ME:

1. **Portal Shell Hub (Beranda Utama)**:
   - Tampilan pembuka bergaya katalog Bento Grid yang memuat daftar instrumen sistematis KATALIS.
   - Kartu aktif untuk meluncurkan modul *BPMN Modeler & Token Simulator*.
   - Kartu rencana masa depan berlabel "Segera Hadir" (*Roadmap Cards*) untuk instrumen analisis lainnya.
2. **BPMN 2.0 Modeler Workspace**:
   - Kanvas visual standar OMG BPMN 2.0 berbasis `bpmn-js`.
   - Dukungan elemen: Start/End Events, Tasks (User, Service, Manual), Subprocesses, Data Objects, Pools, dan Lanes.
   - Panel properti (*Properties Panel*) untuk menyunting atribut teknis elemen proses.
3. **Token Simulation Engine**:
   - Mesin eksekusi token dinamis berbasis `bpmn-js-token-simulation`.
   - Visualisasi pergerakan token pada Sequence Flow, percabangan Exclusive Gateway (XOR), pemisahan/penyatuan Parallel Gateway (AND), dan penanganan Timer/Message Events.
   - Kontrol pemutaran simulasi melalui Floating Glass Dock: Putar/Jeda (*Play/Pause*), Langkah Maju (*Step-by-Step*), dan Reset Simulasi.
4. **Sidebar Tab Navigasi Antar-Alat**:
   - Saat pengguna berada di dalam ruang kerja alat (misal BPMN Workspace), bilah navigasi samping (*sidebar drawer*) tersedia untuk kembali ke Beranda Portal Hub atau beralih ke instrumen lain secara cepat.
5. **Pustaka Template Terverifikasi**:
   - Template 1: Uji Eksekusi Simulasi Paralel & Keputusan (Parallel AND + Exclusive XOR).
   - Template 2: Alur End-to-End Closing Customer (Account Executive & Finance Collaboration).
   - Template 3: Kanvas Bersih untuk perancangan diagram baru dari awal.
6. **Penyimpanan Lokal Murni (Local-First Offline)**:
   - Penyimpanan otomatis diagram aktif ke `localStorage` peramban tanpa memerlukan koneksi jaringan internet atau autentikasi akun.
   - Kemampuan Impor file XML BPMN dari komputer lokal (drag-and-drop atau tombol berkas).
   - Kemampuan Ekspor diagram ke format XML BPMN 2.0 dan format gambar vektor SVG beresolusi tinggi.

---

## 06 Out of Scope (For Now)
Komponen yang secara sadar DITOLAK pada Versi 1 untuk mencegah overengineering:
- **Autentikasi Pengguna Wajib**: Tidak ada sistem login, registrasi akun, kata sandi, atau sesi JWT pada V1. Aplikasi dapat diakses bebas langsung pakai.
- **Koneksi Database Cloud Wajib**: Tidak mewajibkan konfigurasi Supabase saat instalasi awal. Seluruh alur data primer beroperasi pada penyimpanan peramban lokal.
- **Mesin Analitik Durasi SLA Kompleks**: Perhitungan waktu siklus (Cycle Time), biaya per aktivitas, dan simulasi Monte Carlo ditunda ke rilis berikutnya.
- **Pemeriksa Kepatuhan Berbasis AI (BEF4LLM Audit)**: Audit kepatuhan berbasis model bahasa besar ditolak untuk rilis awal.
- **Kolaborasi Multi-User Realtime**: Tidak ada fitur penyuntingan bersama ala Google Docs / WebSocket collaborative cursors.

---

## 07 Success Metrics
1. **Kecepatan Akses**: Aplikasi dan kanvas siap digunakan di GitHub Pages dalam waktu kurang dari 2 detik saat pemuatan pertama.
2. **Kemandirian Offline 100%**: Aplikasi berfungsi penuh saat jaringan internet terputus setelah aset awal dimuat (*zero network dependency*).
3. **Integritas Ekspor Standar**: Berkas XML BPMN yang diekspor lolos validasi impor di alat standar industri (Camunda Modeler, bpmn.io) tanpa galat sintaksis.
4. **Nol Galat Konsol**: Tidak terdapat galat runtime yang tidak tertangani pada konsol peramban saat menjalankan simulasi token.

---

## 08 Acceptance Criteria
- Pengguna dapat membuka halaman utama portal, melihat katalog alat, dan mengklik kartu BPMN untuk masuk ke kanvas.
- Kanvas menampilkan antarmuka Mode Terang (*Light Mode*) yang bersih, kontras, dan konsisten dengan token Vengeance UI.
- Floating Glass Dock dapat memicu, menjeda, melangkah maju, dan mereset simulasi token visual.
- Sidebar tab navigasi memungkinkan pengguna kembali ke Beranda Portal Hub kapan pun tanpa kehilangan progres diagram di kanvas.
- Diagram tersimpan di `localStorage` peramban dan tetap utuh saat halaman dimuat ulang.
- Teks antarmuka, tombol, dan seluruh elemen bebas dari karakter emoji.
