# SYSTEM ARCHITECTURE

Dokumen Penanggung Jawab: PEREKAYASA (Direktorat II: Teknologi & Rekayasa)
Target Pembaca AI: Claude Code, Cursor, Codex, dan seluruh instans agen koding.
Status: Terverifikasi (Hasil Wawancara Frontier GRILL-ME)
Versi Arsitektur: 1.0.0

---

## 01 System Overview
KATALIS dirancang dengan arsitektur web statis berorientasi komponen (*Component-Driven Static Web Architecture*) yang beroperasi 100% pada peramban klien (*Client-Side Execution*). Sistem ini mengusung pola **Portal Shell & Subsystem Hub**, di mana portal berfungsi sebagai cangkang navigasi utama yang dapat memanggil berbagai ruang kerja instrumen secara terisolasi.

Topologi arsitektur sistem KATALIS:

```text
+--------------------------------------------------------------------------------+
|                             KATALIS CLIENT RUNTIME                             |
+--------------------------------------------------------------------------------+
|                                                                                |
|  [ LAYER 1: PORTAL SHELL & ROUTER CONTROLLER ]                                 |
|  +--------------------------------------------------------------------------+  |
|  | - View Switcher: Portal Hub View <---> Tool Workspace View (BPMN)        |  |
|  | - Top Spotlight Navbar (Brand, Mode Terang, Quick Actions)               |  |
|  | - Sidebar Tab Navigation (Drawer untuk navigasi antar-alat)              |  |
|  +--------------------------------------------------------------------------+  |
|                                       │                                        |
|         ┌─────────────────────────────┴─────────────────────────────┐          |
|         ▼                                                           ▼          |
|  [ LAYER 2A: PORTAL HUB VIEW ]              [ LAYER 2B: TOOL WORKSPACE VIEW ]  |
|  - Bento Grid Catalog                       - Full-Screen Modeling Canvas      |
|  - Active Tool: BPMN Simulator              - Modeler: bpmn-js (BPMN 2.0)      |
|  - Roadmap Cards: SLA, Audit, SOP           - Properties Panel Provider        |
|                                             - Floating Glass Dock Controller   |
|                                             - Template Ingestion Engine        |
|                                                             │                  |
|                                                             ▼                  |
|                                             [ LAYER 3: TOKEN SIMULATION ENGINE]|
|                                             - Semantic Evaluator (XOR/AND/Flow)|
|                                             - Token Lifecycle (Gen/Pass/Sink)  |
|                                             - Realtime SVG Animation Tracing   |
|                                                             │                  |
|                                       ┌─────────────────────┘                  |
|                                       ▼                                        |
|  [ LAYER 4: LOCAL-FIRST PERSISTENCE LAYER ]                                    |
|  +--------------------------------------------------------------------------+  |
|  | - Primary: Browser LocalStorage (Zero-Latency, 100% Offline)             |  |
|  | - Fallback/File: Native XML BPMN 2.0 Export/Import & SVG Exporter        |  |
|  | - Optional Future Adapter: Supabase REST Client (Deferred)               |  |
|  +--------------------------------------------------------------------------+  |
+--------------------------------------------------------------------------------+
                                        │
                                        ▼ (Static Assets Build & Hosting)
+--------------------------------------------------------------------------------+
|  [ LAYER 5: CI/CD DEPLOYMENT INFRASTRUCTURE ]                                  |
|  - Bundler: Webpack 5 + CopyWebpackPlugin (Aset Font, CSS, & Vendor)           |
|  - Hosting: GitHub Pages (URL: https://mualnudarza.github.io/KATALIS/)         |
|  - Automated Workflow: .github/workflows/deploy.yml                           |
+--------------------------------------------------------------------------------+
```

---

## 02 Tech Stack
Daftar dependensi dan teknologi resmi yang terotorisasi untuk KATALIS:

| Ranah Sistem | Teknologi Terpilih | Versi / Keterangan | Justifikasi Teknis |
|---|---|---|---|
| Runtime & Language | JavaScript (ES6+) | Standar Modern Peramban | Eksekusi cepat tanpa beban runtime overhead berat |
| Bundler & Compiler | Webpack 5 | ^5.90.0 | Pustaka aset vendor, font, dan bundel SPA statis yang stabil |
| Host & Delivery | GitHub Pages | GitHub Actions CI/CD | Hosting statis gratis, reliabel, dan terhubung ke repositori |
| Process Modeler | bpmn-js | ^17.0.0 | Standar resmi OMG BPMN 2.0 open-source paling matang |
| Simulation Engine | bpmn-js-token-simulation | ^0.33.0 | Modul simulasi token resmi bpmn.io dengan visualisasi alur |
| Properties Panel | @bpmn-io/properties-panel | ^3.10.0 | Panel konfigurasi atribut teknis elemen proses BPMN |
| Styling & Theme | Vanilla CSS (Vengeance UI Light) | Custom Design Tokens | Efek glass blur, spotlight, dock melayang, mode terang |
| Local Persistence | Browser LocalStorage API | Native Web API | Bebas ketergantungan jaringan (100% offline) |
| Optional Cloud DB | @supabase/supabase-js | ^2.39.0 | Persistensi awan opsional (hanya jika diaktifkan pengguna) |

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
│   ├── portal/                   # Modul pengendali tampilan Beranda Portal Hub
│   │   ├── catalog.js            # Definisi daftar instrumen aktif dan rencana (roadmap)
│   │   └── portalView.js         # Renderer tampilan katalog Bento Grid
│   ├── tools/                    # Sub-sistem alat yang terpasang di portal
│   │   └── bpmn/                 # Ruang kerja modul BPMN & Token Simulation
│   │       ├── bpmnWorkspace.js  # Inisialisasi modeler, event canvas, dan dock
│   │       └── navigation.js     # Sidebar tab navigasi kembali ke hub
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

```text
[1. Akses Pengguna]
       │
       ▼
[2. Pemuatan Portal Shell Hub]
  - Membaca status rute / hash navigasi
  - Merender Beranda Katalog Bento Grid instrumen KATALIS
       │
       ▼
[3. Pemilihan Instrumen (BPMN Modeler & Token Simulator)]
  - Shell mengalihkan tampilan ke Ruang Kerja Alat (Tool Workspace)
  - Modeler mengimpor XML dari LocalStorage (atau Template Bawaan jika kosong)
  - Sidebar Tab Navigasi siap memfasilitasi kembali ke Hub atau memilih template
       │
       ▼
[4. Interaksi Pemodelan & Simulasi Token]
  - Pengguna menambahkan/menyunting elemen proses di kanvas
  - Modeler menyinkronkan perubahan ke cache LocalStorage secara asinkron
  - Pengguna mengaktifkan Token Simulation via Floating Glass Dock
  - Engine mengevaluasi aliran token langkah-demi-langkah dan menganimasikan garis alur
       │
       ▼
[5. Ekspor / Penutupan Sesi]
  - Pengguna dapat mengekspor diagram dalam bentuk file fisik (.bpmn atau .svg)
  - Pengguna dapat mengklik tombol "Kembali ke Portal Hub" di Sidebar Navigasi
  - State diagram tetap tersimpan di penyimpanan browser lokal
```

---

## 05 Scalability & Panduan Penambahan Instrumen Baru
Arsitektur KATALIS dirancang agar modular untuk penambahan alat/instrumen sistematis baru di masa depan:
1. **Pendaftaran di Katalog Portal (`src/portal/catalog.js`)**:
   Setiap instrumen baru didaftarkan dengan atribut: `id`, `name`, `category` (Alat / Template / Analisis / Instrumen), `description`, `status` (`active` atau `planned`), dan handler peluncuran.
2. **Pemisahan Modul di Direktori `src/tools/<nama-tool>/`**:
   Setiap instrumen diletakkan dalam folder terisolasi dengan siklus hidup (*lifecycle*):
   - `mount(container)`: Menginisialisasi UI dan event handler instrumen.
   - `unmount()`: Membersihkan memory leak, timer, dan DOM saat pengguna kembali ke Hub.
3. **Isolasi Penyimpanan**:
   Setiap instrumen menggunakan namespace kunci penyimpanan lokal tersendiri (misal: `katalis_bpmn_state`, `katalis_sla_state`) untuk mencegah tabrakan data.
