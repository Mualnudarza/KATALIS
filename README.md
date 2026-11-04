# KATALIS
### Kumpulan Alat, Template, Analisis, dan Instrumen Sistematis

Platform portal terpadu untuk pemodelan proses bisnis BPMN 2.0, simulasi token dinamis (*bpmn-js-token-simulation*), pustaka template sistematis, dan instrumen operasional berbasis peramban web statis dengan desain antarmuka Mode Terang (*Light Mode*) Vengeance UI.

---

## Tautan Resmi & Akses Langsung

- **URL Aplikasi (GitHub Pages)**: [https://mualnudarza.github.io/KATALIS/](https://mualnudarza.github.io/KATALIS/)
- **Repositori GitHub**: [https://github.com/Mualnudarza/KATALIS](https://github.com/Mualnudarza/KATALIS)
- **Desain Antarmuka**: Mode Terang Vengeance UI ([www.vengenceui.com](https://www.vengenceui.com/))
- **Arsitektur Spesifikasi**: Berbasis The 4 Files Framework (`docs/PRD.md`, `docs/DESIGN-SYSTEM.md`, `docs/ARCHITECTURE.md`, `AGENTS.md`)

---

## Konsep & Fitur Utama

1. **Portal Shell Hub**:
   - Beranda pembuka berbentuk katalog Bento Grid untuk memilih instrumen dan alat kerja sistematis.
   - Modul aktif: *BPMN 2.0 Modeler & Token Simulator*.
   - Kartu rencana instrumen mendatang (*Roadmap Cards*): SLA & Cycle Time Analyzer, SOP Document Generator, Process Compliance Audit.

2. **Ruang Kerja Pemodelan & Simulasi Token BPMN 2.0**:
   - Kanvas visual OMG BPMN 2.0 standar internasional (`bpmn-js`).
   - Mesin eksekusi simulasi token dinamis langkah-demi-langkah (`bpmn-js-token-simulation`).
   - Floating Glass Dock untuk kendali pemutaran simulasi (Play, Step, Reset, dan Status Pulsa).
   - Sidebar Tab Navigasi untuk berpindah antar-alat dan kembali ke Beranda Portal Hub.

3. **Penyimpanan Lokal Murni (100% Offline)**:
   - Beroperasi langsung di peramban tanpa kewajiban autentikasi akun atau server database.
   - Diagram tersimpan aman di penyimpanan lokal peramban (*LocalStorage*).
   - Ekspor dan impor file standar XML BPMN 2.0 serta ekspor gambar vektor SVG resolusi tinggi.

4. **Desain Antarmuka Vengeance UI Mode Terang**:
   - Tampilan terang cerah berorientasi ketelitian analisis (*Clean Light Zinc #F8FAFC & #FFFFFF*).
   - Spotlight Top Navbar dengan backdrop blur halus.
   - Floating Glass Dock melayang yang ergonomis.
   - Kartu Bento informatif dengan tata kelola token visual terstandarisasi.

---

## Struktur Spesifikasi Sistem (The 4 Files Framework)

Proyek ini dikelola mengikuti metodologi spesifikasi pra-koding standar MUALNURDARZA:

```text
KATALIS/
├── docs/
│   ├── PRD.md                    # File 01: Visi produk, target pengguna, fitur V1, dan Out of Scope
│   ├── DESIGN-SYSTEM.md          # File 02: Aturan visual, hex codes, skala 8px, mode terang
│   └── ARCHITECTURE.md           # File 03: Topologi portal, subsistem alat, dan data flow
├── AGENTS.md                     # File 04: Aturan kerja operasional AI lintas platform (Root)
├── CLAUDE.md                     # Root Bridge: Memuat @AGENTS.md untuk Claude Code
└── README.md                     # Panduan orientasi untuk pengembang manusia
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
