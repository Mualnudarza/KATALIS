# DESIGN SYSTEM (LIGHT MODE VENGEANCE UI)

Dokumen Penanggung Jawab: PERANCANG (Direktorat II: Teknologi & Rekayasa)
Target Pembaca AI: Claude Code, Cursor, Codex, dan seluruh instans agen koding.
Status: Terverifikasi (Hasil Wawancara Frontier GRILL-ME)
Tema: Mode Terang (Light Mode) Bersih, Tajam, Berorientasi Ketelitian Analisis

---

## 01 Brand Identity
Karakter visual utama KATALIS dirangkum dalam 5 kata kunci:
- **Presisi**: Garis kontur tegas dengan ukuran modular berbasis kelipatan 8px.
- **Bersih**: Latar belakang terang cerah bebas distraksi untuk kanvas pemodelan proses.
- **Modern**: Efek kaca buram (*frosted glass blur*), border halus, dan bayangan lembut Vengeance UI.
- **Fokus**: Tipografi dengan keterbacaan tinggi dan hierarki yang membedakan instruksi dari data.
- **Sistematis**: Penataan komponen berbasis Bento Grid dan Floating Glass Dock yang teratur.

---

## 02 Colour Palette (Light Mode Vengeance)
Dilarang menggunakan nilai warna arbitrer di luar tabel heksadesimal resmi berikut:

| Nama Token | Nilai Hex | Peruntukan Elemen |
|---|---|---|
| Background Canvas | #F8FAFC | Latar belakang dasar halaman dan kanvas pemodelan BPMN |
| Surface Primary | #FFFFFF | Latar belakang kartu Bento, panel properti, bilah navigasi, dan modal |
| Surface Alt | #F1F5F9 | Latar belakang sub-kontainer, input field, dan lencana sekunder |
| Surface Hover | #E2E8F0 | Efek sorot (hover) pada tombol, baris daftar, dan kartu |
| Border Default | #E2E8F0 | Garis batas kontainer, pembatas tabel, dan border tombol |
| Border Subtle | #F1F5F9 | Pembatas antar-elemen sekunder yang sangat halus |
| Border Focus | #3B82F6 | Garis batas aktif/fokus saat input diklik atau elemen disorot |
| Text Primary | #0F172A | Teks judul utama, isi tabel, dan label navigasi penting |
| Text Muted | #64748B | Teks penjelasan sekunder, sub-judul, dan metadata |
| Text Subtle | #94A3B8 | Placeholder formulir, tanggal kadaluarsa, dan label nonaktif |
| Accent Primary | #2563EB | Tombol aksi utama (CTA), tombol aktif simulasi, dan indikator aktif |
| Accent Hover | #1D4ED8 | Status hover tombol aksi utama |
| Accent Glow | rgba(37,99,235,0.15) | Efek pendaran lembut di sekitar komponen fokus |
| Secondary Accent | #8B5CF6 | Lencana instrumen khusus dan aksen sekunder |
| Success Indicator | #10B981 | Status token simulasi berjalan lancar dan notifikasi sukses |
| Warning Indicator | #F59E0B | Indikator antrean token dan peringatan validasi alur |
| Error Destructive | #EF4444 | Pesan galat, indikator deadlock proses, dan tombol reset |

---

## 03 Typography
- **Font Family Antarmuka:** Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Font Family Data & Notasi:** JetBrains Mono, "Fira Code", monospace (untuk XML BPMN, ID elemen, dan log telemetri)
- **H1 (Display / Brand):** 28px, Bold, Line-height 1.25, Letter-spacing -0.02em
- **H2 (Katalog / Section):** 20px, Semibold, Line-height 1.3, Letter-spacing -0.01em
- **H3 (Kartu Bento / Modal):** 16px, Semibold, Line-height 1.4
- **Body (Regular):** 14px, Regular, Line-height 1.5
- **Caption / Secondary:** 12px, Regular, Line-height 1.4
- **Badge / Micro:** 11px, Medium, Line-height 1.3, Text-transform: uppercase

---

## 04 Spacing (Skala Modular 8px)
- **4px (0.5x):** Jarak mikro padding lencana, gap ikon tombol kecil
- **8px (1x):** Jarak antar elemen dalam tombol, gap antar tombol bilah navigasi
- **12px (1.5x):** Padding internal tombol, padding input field
- **16px (2x):** Padding kartu bento kecil, gap antar kolom grid sedang
- **20px (2.5x):** Padding bilah navigasi atas (Navbar), jarak margin tepi
- **24px (3x):** Padding bento card utama, padding modal dialog
- **32px (4x):** Jarak antar seksi halaman katalog alat
- **48px (6x):** Pemisah makro header beranda dengan grid instrumen

---

## 05 Border Radius
- **Small (6px):** Tag badge, input field kecil, tombol ikon mikro
- **Medium (8px):** Tombol aksi standar, input formulir, tab navigasi
- **Large (12px):** Kartu Bento katalog alat, kontainer panel properti
- **X-Large (16px):** Modal dialog bento, jendela pemilihan template
- **Full (9999px):** Floating Glass Dock, tombol kapsul, indikator pulsa status

---

## 06 Komponen Antarmuka Khas Vengeance UI (Light Mode)

### A. Spotlight Top Navbar (Light Mode)
- Latar: `rgba(255, 255, 255, 0.88)` dengan efek `backdrop-filter: blur(16px)`
- Border bawah: `1px solid var(--vng-border)` (#E2E8F0)
- Garis gradasi aksen di dasar navbar: `linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), rgba(139, 92, 246, 0.4), transparent)`
- Tinggi standar: 56px, posisi menempel di bagian atas viewport

### B. Floating Glass Dock (Light Mode)
- Posisi: Melayang di bagian bawah kanvas, terpusat horizontal (`bottom: 24px; left: 50%; transform: translateX(-50%)`)
- Latar: `rgba(255, 255, 255, 0.92)` dengan efek `backdrop-filter: blur(20px)`
- Border: `1px solid #E2E8F0` dengan sudut bulat penuh (`border-radius: 9999px`)
- Bayangan: `0 12px 32px rgba(0, 0, 0, 0.08), 0 0 20px rgba(37, 99, 235, 0.06)`
- Memuat tombol-tombol kendali simulasi token: Play/Pause, Step Next, Reset, dan Indikator Status Pulsa

### C. Bento Grid Cards (Light Mode)
- Latar: `#FFFFFF` dengan batas `1px solid #E2E8F0`
- Sudut: `border-radius: 12px`
- Garis aksen atas: Indikator gradasi halus yang menyala saat kursor mendekat (*hover*)
- Efek Hover: Bergeser ke atas 2px (`transform: translateY(-2px)`), batas berubah menjadi `#93C5FD`, bayangan lembut `0 10px 25px -5px rgba(0, 0, 0, 0.06)`

### D. Sidebar Tab Navigasi (Ruang Kerja Alat)
- Posisi: Bilah sisi kiri atau bilah laci di dalam ruang kerja alat BPMN
- Fungsi: Menampilkan tombol "Kembali ke Portal Hub", pemilih template proses, ekspor file, dan informasi versi
- Latar: `#FFFFFF` dengan batas pemisah kanan `1px solid #E2E8F0`

### E. Panel Properti BPMN (Light Overrides)
- Latar panel: `#FFFFFF`
- Teks label: `#64748B`
- Masukan input panel: `#F8FAFC` dengan border `#E2E8F0`, teks `#0F172A`

---

## 07 Icons & Visual Symbols
- Pustaka: Lucide Icons / SVG Vektor Mandiri
- Karakter: Garis murni (*clean line icons*), ketebalan stroke seragam 1.5px
- Larangan Mutlak Emoji: Dilarang menyematkan karakter emoji pada tombol, lencana, teks menu, maupun pesan notifikasi sistem.

---

## 08 Breakpoints
- **Mobile (< 640px):** Bilah dock mengecil ke format ikon tunggal, panel properti disembunyikan dalam laci geser bawah, kartu bento menjadi kolom tunggal.
- **Tablet (640px - 1024px):** Grid katalog bento 2 kolom, dock simulasi ukuran sedang.
- **Desktop (> 1024px):** Tata letak kanvas penuh dengan panel properti di samping kanan dan grid katalog bento 3 kolom di beranda hub.

---

## 09 Aturan Mutlak Antarmuka
1. Wajib mempertahankan Mode Terang (*Light Mode*) secara konsisten pada seluruh komponen. Dilarang mencampur background gelap pada kanvas atau kartu.
2. Seluruh warna tombol, border, dan teks wajib mengambil dari tabel CSS Variables `--vng-*` resmi.
3. Seluruh interaksi wajib memiliki feedback transisi halus (0.16s - 0.25s bezier).
