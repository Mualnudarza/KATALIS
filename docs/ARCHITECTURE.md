# SYSTEM ARCHITECTURE

Dokumen Penanggung Jawab: PEREKAYASA (Direktorat II: Teknologi & Rekayasa)
Target Pembaca AI: Claude Code, Cursor, Codex, dan seluruh instans agen koding.
Status: Terverifikasi (Hasil Wawancara Frontier GRILL-ME & Kurasi Fase 1.1)
Versi Arsitektur: 1.1.0

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
|  | - Top Spotlight Navbar (Brand, Mode Terang, Quick Actions, Status Lencana Koneksi AI)        |  |
|  | - Sidebar Tab Navigation (Drawer untuk navigasi antar-alat dan kembali ke Hub)              |  |
|  +----------------------------------------------------------------------------------------------+  |
|                                                │                                                   |
|         ┌──────────────────────────────────────┼──────────────────────────────────────┐            |
|         ▼                                      ▼                                      ▼            |
|  [ LAYER 2A: PORTAL HUB ]            [ LAYER 2B: BPMN WORKSPACE ]        [ LAYER 2C: DRAW.IO STUDIO]
|  - Bento Grid Catalog                - Full-Screen bpmn-js Canvas        - Dual-Mode Switcher      |
|  - Active: BPMN Simulator            - Custom Properties Panel           - Ephemeral AI Gate Modal |
|  - Active: Draw.io Studio            - Color Picker (OMG in Color)       - Embedded Draw.io Iframe |
|  - Roadmap: SLA, Audit               - Floating Glass Dock               - AI Assistant Drawer     |
|                                                        │                              │            |
|                                                        ▼                              ▼            |
|                                        [ LAYER 3A: TOKEN SIMULATION ]    [ LAYER 3B: AI DIAGRAM    |
|                                        - Semantic Evaluator (XOR/AND)      ENGINE & PROTOCOL]      |
|                                        - Token Lifecycle (Gen/Sink)      - OpenAI-Compatible REST  |
|                                        - Realtime SVG Animation Tracing    Streaming Client        |
|                                                        │                 - 9Router Gateway Driver  |
|                                                        │                 - XML Validator & Auto-Fix|
|                                                        │                 - postMessage Bridge      |
|                                                        │                              │            |
|                                        ┌───────────────┴──────────────────────────────┘            |
|                                        ▼                                                           |
|  [ LAYER 4: DUAL PERSISTENCE & EPHEMERAL CREDENTIAL LAYER ]                                        |
|  +----------------------------------------------------------------------------------------------+  |
|  | - Permanent Client Store: Browser LocalStorage (Diagram BPMN & Konfigurasi UI)               |  |
|  | - Ephemeral Session Store: Browser SessionStorage / In-Memory (Endpoint & API Key AI Hilang) |  |
|  | - Fallback/File: Native XML BPMN / Draw.io XML Export & High-Res PNG / SVG Exporter          |  |
|  | - Optional Cloud DB: Supabase REST Client Adapter (Deferred)                                 |  |
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
| AI Integration Driver | OpenAI-Compatible REST SSE | Fetch Streams API | Terkoneksi mulus ke 9Router (port 20128), DeepSeek, Ollama, OpenRouter |
| Styling & Theme | Vanilla CSS (Vengeance UI Light) | Custom Design Tokens | Efek glass blur, spotlight, dock melayang, mode terang |
| Local Persistence | Browser LocalStorage API | Native Web API | Bebas ketergantungan jaringan untuk diagram BPMN (100% offline) |
| Ephemeral Security | Browser SessionStorage API | In-Memory Session | Kredensial AI (Endpoint, API Key) musnah otomatis saat sesi berakhir |
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
│   │   └── drawio/               # Ruang kerja modul Draw.io Studio (Dual-Mode)
│   │       ├── drawioWorkspace.js# Pengendali ruang kerja, tata letak split-view, & iframe
│   │       ├── drawioProtocol.js # Driver komunikasi postMessage (init, load, export, save)
│   │       ├── aiGateModal.js    # Modal dialog kredensial sesi sementara (Ephemeral AI Gate)
│   │       ├── aiClient.js       # Client REST streaming OpenAI-compatible (9Router / BYOK)
│   │       └── xmlValidator.js   # Parser & pembersih tag mxCell XML hasil generasi AI
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
  - Sidebar Tab Navigasi siap memfasilitasi kembali ke Hub atau memilih template
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

### B. Alur Kerja Modul Draw.io Studio (Dual-Mode & Ephemeral AI Gate)
```text
[1. Pemilihan Instrumen Draw.io Studio dari Portal Hub]
       │
       ▼
[2. Pemicuan Ephemeral AI Gate Modal]
       │
       ├──────────────────────────────────────────┐
       │ (Opsi: Bangun Dari Nol / Lewati)         │ (Opsi: Isi Endpoint & Kunci API)
       ▼                                          ▼
[3A. Mode 1: Pure Zero Manual]             [3B. Mode 2: AI-Assisted Generative]
  - Kredensial AI dikosongkan                - Endpoint (misal http://localhost:20128/v1) & Key
  - AI Assistant Drawer dinonaktifkan          disimpan di SessionStorage (hilang saat tab tutup)
  - Iframe Draw.io mengambil layar penuh     - Antarmuka Split-View: AI Drawer (kiri) & Kanvas (kanan)
  - Pengguna mendesain diagram manual        - Pengguna mengirimkan prompt perintah bahasa alami
       │                                          │
       │                                          ▼
       │                                   [4. AI Streaming & Protocol Bridge]
       │                                     - aiClient mengirim pesan ke 9Router / LLM Provider
       │                                     - Respons streaming mxCell XML diproses real-time
       │                                     - xmlValidator membungkus mxCell ke mxGraphModel
       │                                     - drawioProtocol mengirim { action: 'load', xml }
       │                                       ke iframe Draw.io via window.postMessage
       │                                          │
       │                                          ▼
       │                                   [5. Sinkronisasi Dua Arah]
       │                                     - Pengguna menyunting manual di atas kanvas Draw.io
       │                                     - AI Drawer meminta diagram terkini ({ action: 'export' })
       │                                     - XML terbaru diumpankan balik sebagai konteks iterasi
       │                                          │
       └──────────────────┬───────────────────────┘
                          │
                          ▼
[6. Ekspor & Penutupan Sesi]
  - Ekspor langsung dari Draw.io ke format .drawio, .xml, .svg, atau .png
  - Menutup peramban menghapus seluruh API Key dari memori tanpa sisa jejak
```

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
   - Data kredensial sensitif wajib menggunakan `sessionStorage` atau *in-memory runtime state* dengan mekanisme pembersihan otomatis (*auto-purge*) saat sesi berakhir.
4. **Strategi Iframe Tersemat Resmi untuk GitHub Pages**:
   - Menghindari pemaketan repositori monolitik berat. Menggunakan URL embed resmi yang dikendalikan oleh protokol postMessage JSON standar industri.
