# PRODUCT REQUIREMENTS DOCUMENT (PRD)

Dokumen Penanggung Jawab: ANALIS (Direktorat I: Bisnis & Pengetahuan)
Target Pembaca AI: Claude Code, Cursor, Codex, dan seluruh instans agen koding.
Status: Terverifikasi (Hasil Wawancara Frontier GRILL-ME & Kurasi Fase 1.1)
Versi: 1.1.0

---

## 01 Product Overview
- **Product Name:** KATALIS
- **Kepanjangan:** Kumpulan Alat, Template, Analisis, dan Instrumen Sistematis
- **Tagline:** Portal terpadu instrumen dan alat analisis proses bisnis berbasis peramban web statis.
- **Description:** KATALIS adalah portal web multifungsi yang menyediakan katalog perkakas (*tools*), instrumen analisis, dan pustaka template operasional. Pada rilis Versi 1.1, KATALIS menyajikan dua modul instrumen utama: (1) Pemodelan proses bisnis BPMN 2.0 standar internasional OMG dengan mesin simulasi token interaktif (*token simulation*), serta (2) Draw.io Studio sebagai editor diagram umum untuk penyuntingan manual melalui editor diagrams.net tersemat. Fitur AI generatif Draw.io ditahan dan tidak termasuk dalam rilis ini; evaluasinya direncanakan untuk Phase 2. Sistem berjalan di peramban tanpa kewajiban server runtime backend khusus.

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

## 05 Core Features (Version 1 & 1.1)
Fitur wajib yang harus diselesaikan untuk platform KATALIS sesuai hasil wawancara GRILL-ME dan kurasi fase 1.1:

1. **Portal Shell Hub (Beranda Utama)**:
   - Tampilan pembuka bergaya katalog Bento Grid yang memuat daftar instrumen sistematis KATALIS.
   - Kartu aktif untuk meluncurkan modul *BPMN Modeler & Token Simulator*.
   - Kartu aktif untuk meluncurkan modul *Draw.io Studio* sebagai editor diagram manual umum; tidak ada fitur AI pada Phase 1.
   - Kartu rencana masa depan berlabel "Segera Hadir" (*Roadmap Cards*) untuk instrumen analisis lainnya (SLA Analyzer, Compliance Audit).
2. **BPMN 2.0 Modeler Workspace**:
   - Kanvas visual standar OMG BPMN 2.0 berbasis `bpmn-js`.
   - Dukungan elemen: Start/End Events, Tasks (User, Service, Manual), Subprocesses, Data Objects, Pools, dan Lanes.
   - Panel properti (*Properties Panel*) kustom: grup Deskripsi (alih fungsi Documentation) dan grup Lampiran dokumen acuan in-app preview modal.
   - Fitur pewarnaan notasi bebas (spektrum penuh HEX, auto-contrast, dan palet cepat) berbasis OMG BPMN in Color.
3. **Token Simulation Engine**:
   - Mesin eksekusi token dinamis berbasis `bpmn-js-token-simulation`.
   - Visualisasi pergerakan token pada Sequence Flow, percabangan Exclusive Gateway (XOR), pemisahan/penyatuan Parallel Gateway (AND), dan penanganan Timer/Message Events.
   - Kontrol pemutaran simulasi melalui Floating Glass Dock: Putar/Jeda (*Play/Pause*), Langkah Maju (*Step-by-Step*), dan Reset Simulasi.
4. **Draw.io Studio (Phase 1 — Editor Manual)**:
   - Membuka editor diagrams.net resmi melalui embedded iframe tanpa modal AI, pengaturan model, kredensial, atau pemanggilan layanan AI.
   - Menyediakan akses ke stensil bentuk, flowchart, UML, arsitektur cloud, dan konektor Draw.io.
   - Pengguna dapat membuat, mengedit, dan mengekspor diagram melalui kemampuan bawaan editor Draw.io.
   - Editor tersemat memerlukan koneksi internet ke layanan diagrams.net; fitur ini tidak menjanjikan operasi offline penuh.
   - **Phase 2 (ditahan):** Integrasi AI generatif, prompt bahasa alami, pengelolaan kredensial, dan sinkronisasi diagram dengan AI tidak termasuk implementasi Phase 1 dan tidak boleh aktif di runtime.
5. **Sidebar Tab Navigasi Antar-Alat**:
   - Saat pengguna berada di dalam ruang kerja alat (BPMN Workspace atau Draw.io Studio), bilah navigasi samping (*sidebar drawer*) tersedia untuk kembali ke Beranda Portal Hub atau beralih instrumen secara instan.
6. **Pustaka Template Terverifikasi**:
   - Template BPMN 1: Uji Eksekusi Simulasi Paralel & Keputusan (Parallel AND + Exclusive XOR).
   - Template BPMN 2: Alur End-to-End Closing Customer (Account Executive & Finance Collaboration).
   - Template BPMN 3: Kanvas Bersih untuk perancangan diagram baru dari awal.
7. **Penyimpanan Lokal Murni (Local-First Offline)**:
   - Penyimpanan otomatis diagram aktif ke `localStorage` peramban tanpa memerlukan koneksi jaringan internet atau autentikasi akun.
   - Kemampuan Impor file diagram dari komputer lokal (drag-and-drop atau tombol berkas), serta menempelkan XML BPMN langsung ke editor.
   - Kemampuan Ekspor diagram ke format XML, SVG vektor, dan gambar raster PNG 2x Retina.

---

## 06 Out of Scope (For Now)
Komponen yang secara sadar DITOLAK pada Versi 1 & 1.1 untuk mencegah overengineering:
- **Autentikasi Pengguna Wajib**: Tidak ada sistem registrasi akun pengguna, password login terpusat, atau database akun pengguna.
- **Integrasi AI Draw.io pada Phase 1**: Tidak ada pemanggilan model AI, input API key, atau penyimpanan kredensial AI di rilis ini. Integrasi AI dapat dipertimbangkan kembali pada Phase 2 setelah ditinjau dan disetujui.
- **Hosting Mandiri Seluruh Berkas Draw.io (Self-Bundle Bloat)**: Tidak mengklon seluruh repositori sumber statis Draw.io (>150 MB) ke dalam repositori KATALIS; integrasi menggunakan standar resmi Iframe Embed Protocol (`embed.diagrams.net`) yang efisien untuk GitHub Pages.
- **Koneksi Database Cloud Wajib**: Tidak mewajibkan konfigurasi Supabase saat instalasi awal. Seluruh alur data primer beroperasi pada penyimpanan peramban lokal.
- **Mesin Analitik Durasi SLA Kompleks**: Perhitungan waktu siklus (Cycle Time), biaya per aktivitas, dan simulasi Monte Carlo ditunda ke rilis berikutnya.
- **Kolaborasi Multi-User Realtime**: Tidak ada fitur penyuntingan bersama ala Google Docs / WebSocket collaborative cursors.

---

## 07 Success Metrics
1. **Kecepatan Akses**: Aplikasi dan kanvas siap digunakan di GitHub Pages dalam waktu kurang dari 2 detik saat pemuatan pertama.
2. **Kemandirian Offline 100% pada Mode Manual**: Mode pemodelan BPMN dan mode Draw.io manual berfungsi lancar dengan penyimpanan lokal peramban.
3. **Tidak Ada Fitur AI Draw.io di Phase 1**: Runtime tidak meminta kredensial, memanggil model AI, atau mengirim diagram ke layanan AI.
4. **Ketersediaan Editor Draw.io**: Editor diagrams.net dapat dibuka dan digunakan saat peramban memiliki koneksi ke layanan embed diagrams.net.
5. **Integritas Ekspor Standar**: Berkas XML BPMN dan diagram Draw.io yang diekspor dapat digunakan kembali pada alat standar terkait.
6. **Nol Galat Konsol**: Tidak terdapat galat runtime yang tidak tertangani saat menjalankan pemodelan maupun orkestrasi iframe.

---

## 08 Acceptance Criteria
- Pengguna dapat membuka halaman utama portal, melihat katalog alat Bento Grid, dan memilih antara kartu BPMN Modeler atau Draw.io Studio.
- Saat memilih Draw.io Studio, editor diagrams.net terbuka langsung tanpa modal atau opsi AI.
- Pengguna dapat mengedit diagram menggunakan fitur bawaan Draw.io dan kembali ke Portal Hub.
- Phase 1 tidak meminta, menyimpan, atau menggunakan API key maupun kredensial AI.
- Fitur AI Draw.io ditandai sebagai ditahan untuk Phase 2 dan tidak hadir dalam runtime aktif.
- Pengguna dapat memasukkan XML BPMN dengan cara tempel langsung atau melalui dialog tempel XML; XML ditolak dengan pesan yang jelas jika bukan XML BPMN valid.
- Sidebar tab navigasi memungkinkan pengguna berpindah antara Beranda Portal Hub, BPMN Modeler, dan Draw.io Studio secara mulus.
- Teks antarmuka, tombol, formulir, dan seluruh elemen bebas dari karakter emoji.
