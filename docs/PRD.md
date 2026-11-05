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
- **Description:** KATALIS adalah portal web multifungsi yang menyediakan katalog perkakas (*tools*), instrumen analisis, dan pustaka template operasional. Pada rilis Versi 1.1, KATALIS menyajikan dua modul instrumen utama: (1) Pemodelan proses bisnis BPMN 2.0 standar internasional OMG dengan mesin simulasi token interaktif (*token simulation*), serta (2) Draw.io Studio dengan kemampuan Dual-Mode (pembuatan diagram berbasis instruksi AI generatif via gateway OpenAI-compatible / 9Router dan pembuatan diagram manual murni dari nol / *Pure Zero Build*). Seluruh sistem beroperasi 100% pada peramban web tanpa kewajiban server runtime backend khusus.

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
   - Kartu aktif untuk meluncurkan modul baru *Draw.io Studio (Dual-Mode: AI & Pure Zero)*.
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
4. **Draw.io Studio (Dual-Mode: AI-Assisted & Pure Zero Build)**:
   - **Gerbang Kredensial AI Sesi Sementara (Ephemeral AI Gate)**:
     - Dialog penentu mode saat memasuki instrumen Draw.io Studio.
     - Menyediakan input konfigurasi Endpoint AI (default acuan: `http://localhost:20128/v1` untuk 9Router), API Key/Token, dan Model ID pilihan.
     - Keamanan Sesi Ephemeral: Kredensial hanya disimpan di dalam memori aktif sesi peramban (`sessionStorage` atau in-memory state) dan otomatis terhapus tanpa sisa saat tab atau sesi peramban ditutup.
     - Opsi Lewati / Bangun Dari Nol (*Skip / Pure Build from Zero*): Pengguna dapat melewati pengisian kredensial untuk langsung menggunakan kanvas manual murni.
   - **Mode 1: Pure Zero Build (Manual 100%)**:
     - Menampilkan kanvas editor Draw.io tersemat (*embedded iframe*) secara layar penuh tanpa panel AI.
     - Akses lengkap ke seluruh stensil bentuk dasar, flowchart, UML, arsitektur cloud, dan konektor.
     - Penyimpanan diagram lokal dan ekspor mandiri ke format `.drawio`, `.xml`, `.png`, dan `.svg`.
   - **Mode 2: AI-Assisted Generative Mode**:
     - Antarmuka Split-View Vengeance UI: AI Chat Drawer di sisi samping dan kanvas Draw.io di sisi utama.
     - Input perintah bahasa alami (*prompt*) untuk membuat diagram baru (arsitektur microservices, ERD, topologi cloud, flowchart logika) atau memperbarui diagram aktif.
     - Integrasi Gateway OpenAI-Compatible (kompatibel langsung dengan 9Router, DeepSeek, OpenRouter, Groq, OpenAI, Ollama).
     - Streaming XML Parser & Auto-Repair: AI hanya menghasilkan tag `mxCell` terstruktur yang divalidasi dan diinjeksikan secara real-time ke editor Draw.io via protokol `window.postMessage`.
     - Sinkronisasi Dua Arah: Perubahan manual di kanvas dapat diekspor balik sebagai konteks XML bagi AI untuk iterasi perintah berikutnya.
5. **Sidebar Tab Navigasi Antar-Alat**:
   - Saat pengguna berada di dalam ruang kerja alat (BPMN Workspace atau Draw.io Studio), bilah navigasi samping (*sidebar drawer*) tersedia untuk kembali ke Beranda Portal Hub atau beralih instrumen secara instan.
6. **Pustaka Template Terverifikasi**:
   - Template BPMN 1: Uji Eksekusi Simulasi Paralel & Keputusan (Parallel AND + Exclusive XOR).
   - Template BPMN 2: Alur End-to-End Closing Customer (Account Executive & Finance Collaboration).
   - Template BPMN 3: Kanvas Bersih untuk perancangan diagram baru dari awal.
7. **Penyimpanan Lokal Murni (Local-First Offline)**:
   - Penyimpanan otomatis diagram aktif ke `localStorage` peramban tanpa memerlukan koneksi jaringan internet atau autentikasi akun.
   - Kemampuan Impor file diagram dari komputer lokal (drag-and-drop atau tombol berkas).
   - Kemampuan Ekspor diagram ke format XML, SVG vektor, dan gambar raster PNG 2x Retina.

---

## 06 Out of Scope (For Now)
Komponen yang secara sadar DITOLAK pada Versi 1 & 1.1 untuk mencegah overengineering:
- **Autentikasi Pengguna Wajib**: Tidak ada sistem registrasi akun pengguna, password login terpusat, atau database akun pengguna.
- **Penyimpanan Kredensial AI Permanen di Server**: KATALIS tidak menyediakan database backend untuk menyimpan API Key pengguna. Seluruh kredensial AI berumur pendek (*ephemeral*) dan dikelola murni di sisi peramban klien (*Bring Your Own Key*).
- **Hosting Mandiri Seluruh Berkas Draw.io (Self-Bundle Bloat)**: Tidak mengklon seluruh repositori sumber statis Draw.io (>150 MB) ke dalam repositori KATALIS; integrasi menggunakan standar resmi Iframe Embed Protocol (`embed.diagrams.net`) yang efisien untuk GitHub Pages.
- **Koneksi Database Cloud Wajib**: Tidak mewajibkan konfigurasi Supabase saat instalasi awal. Seluruh alur data primer beroperasi pada penyimpanan peramban lokal.
- **Mesin Analitik Durasi SLA Kompleks**: Perhitungan waktu siklus (Cycle Time), biaya per aktivitas, dan simulasi Monte Carlo ditunda ke rilis berikutnya.
- **Kolaborasi Multi-User Realtime**: Tidak ada fitur penyuntingan bersama ala Google Docs / WebSocket collaborative cursors.

---

## 07 Success Metrics
1. **Kecepatan Akses**: Aplikasi dan kanvas siap digunakan di GitHub Pages dalam waktu kurang dari 2 detik saat pemuatan pertama.
2. **Kemandirian Offline 100% pada Mode Manual**: Mode pemodelan BPMN dan mode Draw.io manual berfungsi lancar dengan penyimpanan lokal peramban.
3. **Keamanan Kredensial Mutlak**: Tidak ada kebocoran kunci API atau endpoint ke storage persisten permanen; kunci musnah saat sesi peramban ditutup.
4. **Kompatibilitas Gateway AI**: Driver AI KATALIS berhasil terhubung dan bertukar pesan streaming dengan 9Router lokal (`localhost:20128/v1`) maupun endpoint publik OpenAI-compatible.
5. **Integritas Ekspor Standar**: Berkas XML BPMN dan XML Draw.io yang diekspor lolos validasi impor di alat standar industri tanpa galat skema.
6. **Nol Galat Konsol**: Tidak terdapat galat runtime yang tidak tertangani pada konsol peramban saat menjalankan pemodelan maupun orkestrasi iframe.

---

## 08 Acceptance Criteria
- Pengguna dapat membuka halaman utama portal, melihat katalog alat Bento Grid, dan memilih antara kartu BPMN Modeler atau Draw.io Studio.
- Saat memilih Draw.io Studio, pengguna disuguhkan modal Ephemeral AI Gate dengan pilihan mengisi endpoint & API key atau memilih "Bangun Dari Nol".
- Jika pengguna memilih "Bangun Dari Nol", kanvas Draw.io terbuka bersih secara penuh tanpa gangguan panel AI.
- Jika pengguna mengisi kredensial dan memilih "Aktifkan Mode AI", ruang kerja menampilkan split-view: drawer asisten AI di samping kanvas Draw.io.
- Perintah teks pada drawer AI berhasil menghasilkan elemen diagram yang langsung ter-render di atas kanvas Draw.io melalui `postMessage`.
- Menutup tab peramban menghapus seluruh data kredensial AI yang diinputkan.
- Sidebar tab navigasi memungkinkan pengguna berpindah antara Beranda Portal Hub, BPMN Modeler, dan Draw.io Studio secara mulus.
- Teks antarmuka, tombol, formulir, dan seluruh elemen bebas dari karakter emoji.
