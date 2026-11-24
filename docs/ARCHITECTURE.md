# SYSTEM ARCHITECTURE

Dokumen Penanggung Jawab: PEREKAYASA (Direktorat II: Teknologi & Rekayasa)
Target Pembaca AI: Claude Code, Cursor, Codex, dan seluruh instans agen koding.
Status: Terverifikasi (Phase 1 — Draw.io Manual; integrasi AI ditahan untuk Phase 2)
Versi Arsitektur: 1.1.1

---

## 01 System Overview
KATALIS dirancang dengan arsitektur web statis berorientasi komponen (*Component-Driven Static Web Architecture*) yang beroperasi 100% pada peramban klien (*Client-Side Execution*). Sistem ini mengusung pola **Portal Shell & Subsystem Hub**, di mana portal berfungsi sebagai cangkang navigasi utama yang dapat memanggil berbagai ruang kerja instrumen secara terisolasi.

Topologi arsitektur sistem KATALIS:

```text
+----------------------------------------------------------------------------------------------------+
|                                       KATALIS CLIENT RUNTIME                                       |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  [ LAYER 1: PORTAL SHELL & ROUTER CONTROLLER ]                                                     |
|  +----------------------------------------------------------------------------------------------+  |
|  | - View Switcher: Portal Hub View <---> BPMN Workspace <---> Draw.io Studio Workspace         |  |
|  | - Top Spotlight Navbar (Brand, Mode Terang, Quick Actions)                                    |  |
|  | - Sidebar Tab Navigation (Drawer untuk navigasi antar-alat dan kembali ke Hub)              |  |
|  +----------------------------------------------------------------------------------------------+  |
|                                                │                                                   |
|         ┌──────────────────────────────────────┼──────────────────────────────────────┐            |
|         ▼                                      ▼                                      ▼            |
|  [ LAYER 2A: PORTAL HUB ]            [ LAYER 2B: BPMN WORKSPACE ]        [ LAYER 2C: DRAW.IO STUDIO]
|  - Bento Grid Catalog                - Full-Screen bpmn-js Canvas        - Manual Diagram Editor  |
|  - Active: BPMN Simulator            - Custom Properties Panel           - Embedded Draw.io Iframe |
|  - Active: Draw.io Studio            - Color Picker (OMG in Color)       - diagrams.net postMessage|
|  - Roadmap: SLA, Audit               - Floating Glass Dock               - AI deferred to Phase 2  |
|                                                        │                              │            |
|                                                        ▼                              ▼            |
|                                        [ LAYER 3A: TOKEN SIMULATION ]    [ LAYER 3B: DRAW.IO      |
|                                        - Semantic Evaluator (XOR/AND)      EMBED PROTOCOL]        |
|                                        - Token Lifecycle (Gen/Sink)      - postMessage Bridge      |
|                                        - Realtime SVG Animation Tracing    - Native Draw.io editor  |
|                                                        │                              │            |
|                                        ┌───────────────┴──────────────────────────────┘            |
|                                        ▼                                                           |
|  [ LAYER 4: LOCAL PERSISTENCE & FILE EXPORT ]                                                       |
|  +----------------------------------------------------------------------------------------------+  |
|  | - Permanent Client Store: Browser LocalStorage (Diagram BPMN & Konfigurasi UI)               |  |
|  | - File: Native XML BPMN / Draw.io XML Export & High-Res PNG / SVG Exporter                   |  |
|  | - Optional Cloud DB: Supabase REST Client Adapter (Deferred)                                 |  |
|  +----------------------------------------------------------------------------------------------+  | 
|  | - AI Integration: Not part of Phase 1 runtime; deferred for Phase 2 evaluation               |  |
|  +----------------------------------------------------------------------------------------------+  | 
+----------------------------------------------------------------------------------------------------+
                                                 │
                                                 ▼ (Static Assets Build & Hosting)
+----------------------------------------------------------------------------------------------------+
|  [ LAYER 5: CI/CD DEPLOYMENT INFRASTRUCTURE ]                                                      |
|  - Bundler: Webpack 5 + CopyWebpackPlugin (Aset Font, CSS, & Vendor)                               |
|  - Hosting: GitHub Pages (URL: https://mualnudarza.github.io/KATALIS/)                             |
|  - Automated Workflow: .github/workflows/deploy.yml (Concurrency cancel-in-progress: true)        |
+----------------------------------------------------------------------------------------------------+
```

---

## 02 Tech Stack
Daftar dependensi dan teknologi resmi yang terotorisasi untuk KATALIS:

| Ranah Sistem | Teknologi Terpilih | Versi / Keterangan | Justifikasi Teknis |
|---|---|---|---|
| Runtime & Language | JavaScript (ES6+) | Standar Modern Peramban | Eksekusi cepat tanpa beban runtime overhead berat |
| Bundler & Compiler | Webpack 5 | ^5.90.0 | Pustaka aset vendor, font, dan bundel SPA statis yang stabil |
| Host & Delivery | GitHub Pages | GitHub Actions CI/CD | Hosting statis gratis, reliabel, dan terhubung ke repositori |
| Process Modeler | bpmn-js | ^18.30.0 | Standar resmi OMG BPMN 2.0 open-source paling matang |
| Simulation Engine | bpmn-js-token-simulation | ^0.33.0 | Modul simulasi token resmi bpmn.io dengan visualisasi alur |
| Properties Panel | @bpmn-io/properties-panel | ^3.47.0 | Panel konfigurasi atribut teknis elemen proses BPMN |
| General Diagramming | Draw.io Embedded Protocol | embed.diagrams.net (v24+) | Diagramming serbaguna kelas dunia, zero-bundle bloat di GitHub Pages |
| Iframe Communication | HTML5 postMessage API | W3C Standard | Protokol pertukaran pesan JSON aman antara KATALIS dan Draw.io |
| Styling & Theme | Vanilla CSS (Vengeance UI Light) | Custom Design Tokens | Efek glass blur, spotlight, dock melayang, mode terang |
| Local Persistence | Browser LocalStorage API | Native Web API | Bebas ketergantungan jaringan untuk diagram BPMN (100% offline) |
| Optional Cloud DB | @supabase/supabase-js | ^2.49.0 | Persistensi awan opsional (hanya jika diaktifkan pengguna) |

---

## 03 Project Structure
Tata letak direktori proyek KATALIS:

```text
KATALIS/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Pipeline CI/CD otomatis ke GitHub Pages
├── docs/                         # Spesifikasi teknis & tata kelola produk (The 4 Files)
│   ├── PRD.md                    # File 01: Visi produk, batas MVP, dan Out of Scope
│   ├── DESIGN-SYSTEM.md          # File 02: Aturan visual, hex codes, skala 8px, mode terang
│   └── ARCHITECTURE.md           # File 03: Topologi arsitektur, tech stack, dan data flow
├── assets/                       # Aset ikon dan stylesheet modul token simulation
├── dist/                         # Artefak produksi hasil kompilasi Webpack (di-deploy ke Pages)
│   ├── katalis.bundle.js         # Bundel JavaScript utama
│   └── vendor/                   # Aset font, ikon, dan modul vendor pihak ketiga
├── lib/                          # Modul inti bpmn-js-token-simulation terintegrasi
├── resources/                    # Berkas XML BPMN contoh dan definisi skema
├── src/                          # Kode sumber logika aplikasi
│   ├── index.js                  # Titik masuk utama, pengendali state, dan router tampilan
│   ├── color-picker/             # Modul pewarnaan notasi bebas BPMN (OMG in Color)
│   ├── properties-panel/         # Provider panel kustom (Deskripsi & Lampiran In-App Preview)
│   ├── i18n/                     # Modul translasi kustom antarmuka bahasa Indonesia
│   ├── moddle/                   # Skema ekstensi XML BPMN (katalisModdle.json)
│   ├── portal/                   # Modul pengendali tampilan Beranda Portal Hub
│   │   ├── catalog.js            # Definisi daftar instrumen aktif (BPMN, Draw.io) dan roadmap
│   │   └── portalView.js         # Renderer tampilan katalog Bento Grid
│   ├── tools/                    # Sub-sistem instrumen yang terpasang di portal
│   │   ├── bpmn/                 # Ruang kerja modul BPMN & Token Simulation
│   │   │   ├── bpmnWorkspace.js  # Inisialisasi modeler, event canvas, dan dock
│   │   │   └── navigation.js     # Sidebar tab navigasi kembali ke hub
│   │   └── drawio/               # Ruang kerja Draw.io Studio manual (Phase 1)
│   │       ├── drawioWorkspace.js# Pengendali ruang kerja manual dan iframe
│   │       ├── drawioProtocol.js # Driver komunikasi postMessage (init, load, export, save)
│   │       └── xmlValidator.js   # Konstanta XML kanvas kosong
│   │       # aiClient.js dan aiGateModal.js tersisa sebagai kode Phase 2, tidak diimpor.
│   ├── supabase.js               # Klien adaptor Supabase (opsional)
│   └── templates/                # Pustaka template proses bisnis bawaan
│       └── templates.js          # Definisi XML BPMN (Uji Eksekusi, Closing Customer, Kanvas Bersih)
├── styles/                       # Stylesheet terpadu
│   ├── katalis-vengence.css      # Desain tema Vengeance UI Mode Terang
│   └── token-simulation.css      # Gaya animasi token simulasi
├── index.html                    # Kerangka HTML tunggal aplikasi (Single Page Application)
├── package.json                  # Metadata dependensi dan skrip proyek
├── webpack.config.js             # Konfigurasi bundler Webpack 5
├── AGENTS.md                     # File 04: Aturan operasional agen AI (Root)
├── CLAUDE.md                     # Root Bridge: Memuat @AGENTS.md
└── README.md                     # Panduan orientasi untuk pengembang manusia
```

---

## 04 Data Flow
Alur pemrosesan data ujung-ke-ujung (*end-to-end*):

### A. Alur Kerja Modul BPMN Modeler
```text
[1. Akses Pengguna]
       │
       ▼
[2. Pemuatan Portal Shell Hub]
  - Membaca status rute / hash navigasi
  - Merender Beranda Katalog Bento Grid instrumen KATALIS
       │
       ▼
[3. Pemilihan Instrumen BPMN Modeler]
  - Shell mengalihkan tampilan ke Ruang Kerja BPMN
  - Modeler mengimpor XML dari LocalStorage (atau Template Bawaan jika kosong)
  - XML BPMN dapat dimuat dari berkas, drag-and-drop, atau dialog tempel XML
  - Dialog mem-parse XML di peramban dan memvalidasi root BPMN 2.0 sebelum memanggil `modeler.importXML`
  - XML valid disimpan lokal; kegagalan impor menampilkan pesan tanpa mengganti diagram tersimpan
  - Sidebar Tab Navigasi siap memfasilitasi kembali ke Hub atau memilih template proses.
       │
       ▼
[4. Interaksi Pemodelan & Simulasi Token]
  - Pengguna menambahkan/menyunting elemen proses di kanvas, memberi warna, mengisi lampiran
  - Modeler menyinkronkan perubahan ke cache LocalStorage secara asinkron
  - Pengguna mengaktifkan Token Simulation via Floating Glass Dock
  - Engine mengevaluasi aliran token langkah-demi-langkah dan menganimasikan garis alur
       │
       ▼
[5. Ekspor / Penutupan Sesi]
  - Pengguna dapat mengekspor diagram (XML BPMN, SVG vektor, atau PNG 2x Retina)
  - State diagram tetap tersimpan di penyimpanan browser lokal
```

### B. Alur Kerja Modul Draw.io Studio (Phase 1 — Manual)
```text
[1. Pemilihan Draw.io Studio dari Portal Hub]
       │
       ▼
[2. Shell memuat ruang kerja Draw.io manual]
  - Tidak ada modal AI, pemilihan model, input API key, atau panggilan layanan AI
       │
       ▼
[3. DrawioWorkspace merender toolbar dan iframe diagrams.net]
  - DrawioProtocolBridge menginisialisasi komunikasi postMessage
  - Pengguna membuat dan menyunting diagram langsung pada editor Draw.io
  - Tombol Kanvas Baru memuat XML kosong melalui bridge
       │
       ▼
[4. Simpan, ekspor, dan navigasi]
  - Pengguna memakai kemampuan bawaan diagrams.net untuk menyimpan/mengekspor
  - Pengguna dapat kembali ke Portal Hub dari toolbar
  - Iframe embed memerlukan koneksi internet ke diagrams.net
```

Integrasi model AI Draw.io dan pengelolaan kredensial tidak dimuat ke runtime Phase 1; evaluasi fitur tersebut ditahan untuk Phase 2.

---

## 05 Scalability & Panduan Penambahan Instrumen Baru
Arsitektur KATALIS dirancang agar modular untuk penambahan alat/instrumen sistematis baru di masa depan:
1. **Pendaftaran di Katalog Portal (`src/portal/catalog.js`)**:
   Setiap instrumen baru didaftarkan dengan atribut: `id`, `name`, `category` (Alat / Template / Analisis / Instrumen), `description`, `status` (`active` atau `planned`), dan handler peluncuran.
2. **Pemisahan Modul di Direktori `src/tools/<nama-tool>/`**:
   Setiap instrumen diletakkan dalam folder terisolasi dengan siklus hidup (*lifecycle*):
   - `mount(container)`: Menginisialisasi UI, event handler instrumen, dan listener postMessage.
   - `unmount()`: Membersihkan memory leak, event listener window, timer, dan DOM saat pengguna kembali ke Hub.
3. **Isolasi Penyimpanan & Keamanan Data**:
   - Data diagram permanen menggunakan namespace unik (misal: `katalis_bpmn_state`).
   - Data kredensial sensitif hanya boleh diperkenalkan jika fitur terkait disetujui dan diimplementasikan pada fase mendatang.
4. **Penundaan Integrasi AI Draw.io**: AI generatif dan pengelolaan kredensial tidak menjadi bagian runtime Phase 1; fitur tersebut ditahan untuk evaluasi Phase 2.
5. **Strategi Iframe Tersemat Resmi untuk GitHub Pages**:
   - Menghindari pemaketan repositori monolitik berat. Menggunakan URL embed resmi yang dikendalikan oleh protokol postMessage JSON standar industri.
