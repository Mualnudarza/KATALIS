# SPESIFIKASI ARSITEKTUR SISTEM KATALIS

Dokumen ini mendefinisikan arsitektur sistem, model mental, dan peta jalan teknis dari aplikasi **KATALIS** (*Kumpulan Alat, Template, Analisis, dan Instrumen Sistematis*).

---

## 1. Identitas & Visi Sistem

KATALIS adalah platform pemodelan alur kerja, pengujian dinamis berbasis token simulation (BPMN 2.0), pustaka template proses bisnis, dan instrumen analisis sistematis yang dirancang untuk beroperasi secara mandiri (*self-contained static web application*) di GitHub Pages dengan kemampuan penyimpanan awan berbasis Supabase Database.

- **Nama Proyek**: KATALIS (Kumpulan Alat, Template, Analisis, dan Instrumen Sistematis)
- **Repositori Target**: `https://github.com/Mualnudarza/KATALIS.git`
- **Cabang Utama**: `main`
- **Hosting URL**: `https://mualnudarza.github.io/KATALIS/`
- **Database Endpoint**: `https://xrtfqufwbgbwgtwayuqt.supabase.co`
- **Prinsip Desain**: Vengeance UI Design System (Dark Modern, Glass Dock, Spotlight Header, Bento Grid)

---

## 2. Struktur 5 Lapisan Arsitektur

Arsitektur KATALIS tersusun dalam 5 lapisan logis independen:

```text
+--------------------------------------------------------------------------+
| Lapisan 1: Antarmuka & Interaksi (Vengeance UI Design System)            |
| - Spotlight Top Header & Brand Identity                                  |
| - Floating Glass Dock (Simulation Controller)                            |
| - Bento Grid Modal (Template Selector & Supabase Cloud Sync)             |
+--------------------------------------------------------------------------+
                                    |
+--------------------------------------------------------------------------+
| Lapisan 2: Engine Pemodelan BPMN 2.0 (bpmn-js Core & Properties Panel)   |
| - Canvas Renderer & Interactive Palette                                  |
| - Properties Panel Provider & Resizable Drawer                           |
| - Import / Export XML BPMN 2.0 & SVG Vector                              |
+--------------------------------------------------------------------------+
                                    |
+--------------------------------------------------------------------------+
| Lapisan 3: Engine Eksekusi Dinamis (bpmn-js-token-simulation)            |
| - Token Lifecycle Manager (Generation, Propagation, Consumption)        |
| - Gateway Routing Evaluator (Exclusive XOR, Parallel AND, Inclusive OR)  |
| - Visual Execution Overlay (Animation, Log, State Tracker)              |
+--------------------------------------------------------------------------+
                                    |
+--------------------------------------------------------------------------+
| Lapisan 4: Penyimpanan & Persistensi (Hybrid Local-First + Supabase)     |
| - LocalStorage Fallback Cache (Zero-latency offline work)                |
| - Supabase Client SDK (PostgreSQL: katalis_diagrams & simulation_logs)  |
+--------------------------------------------------------------------------+
                                    |
+--------------------------------------------------------------------------+
| Lapisan 5: Infrastruktur & Pengantaran (GitHub Actions & Pages)          |
| - Automated CI/CD Workflow (.github/workflows/deploy.yml)                |
| - Static Bundle Hosting (GitHub Pages https://mualnudarza.github.io/KATALIS/)
+--------------------------------------------------------------------------+
```

---

## 3. Komponen Inti & Integrasi

### 3.1 Antarmuka Vengeance UI
Sistem antarmuka mengadopsi standar komponen dari `www.vengenceui.com`:
- **Palette**: Dark zinc surfaces (`#09090b`, `#121217`), border glow halus, aksen biru primer (`#3b82f6`) dan ungu sekunder (`#8b5cf6`).
- **Spotlight Header**: Header atas dengan efek blur backdrop (`blur(16px)`), gradien garis bawah reaktif, dan tombol aksi terisolasi.
- **Floating Glass Dock**: Panel kendali simulasi mengambang di bawah kanvas dengan tombol aktivasi mode token, status indikator detak (*live indicator*), dan reset alur.
- **Bento Modals**: Pilihan template bisnis dan konfigurasi cloud ditampilkan dalam bentuk kartu bento bertingkat dengan animasi hover glow.

### 3.2 Engine Token Simulation
Mesin simulasi mengeksekusi semantik BPMN 2.0 secara visual:
- **Token Generation**: Dimulai dari Start Event saat alur dipicu.
- **Forking & Synchronizing**: Token membelah di Parallel Gateway (Split) dan menyatu kembali di Parallel Gateway (Join).
- **Branching Decision**: Token memilih cabang yang memenuhi kondisi pada Exclusive Gateway (XOR).
- **State Feedback**: Setiap elemen aktif ditandai dengan lingkaran token bergerak dan counter jumlah token yang sedang mengantre.

### 3.3 Persistensi Hybrid (Supabase + Local-First)
- Diagram yang sedang disunting otomatis disimpan ke `localStorage['katalis-diagram-xml']`.
- Pengguna dapat menghubungkan Supabase melalui modal sinkronisasi dengan memasukkan Anon Key.
- Skema tabel PostgreSQL mencakup:
  - `katalis_diagrams`: Menyimpan `id`, `title`, `description`, `xml`, dan cap waktu.
  - `katalis_simulation_logs`: Menyimpan metrik eksekusi simulasi untuk analisis proses.

---

## 4. Peta Jalan Implementasi (4 Phase)

| Fase | Fokus Utama | Luaran & Status |
|:---|:---|:---|
| **Phase 1** | Inisiasi Repositori, Integrasi Token Simulation, Vengeance UI, GitHub Pages & Supabase | Selesai (Versi 1.0.0 Siap Rilis) |
| **Phase 2** | Fitur Analisis Bottleneck, Deteksi Deadlock Alur, & SLA Duration Calculator | Terencana (Q1) |
| **Phase 3** | Perluasan Pustaka Template BPMN (Sales, ITIL, Finance, ISO 9001, MedTech) | Terencana (Q2) |
| **Phase 4** | Integrasi AI Copilot Evaluator BPMN (Kepatuhan BEF4LLM & Auto-Correction) | Terencana (Q3) |
