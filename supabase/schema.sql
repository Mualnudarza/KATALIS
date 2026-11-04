-- ============================================================================
-- KATALIS Database Schema (Supabase PostgreSQL)
-- Endpoint: https://xrtfqufwbgbwgtwayuqt.supabase.co
-- ============================================================================

-- 1. Tabel Penyimpanan Diagram Proses Bisnis BPMN
CREATE TABLE IF NOT EXISTS public.katalis_diagrams (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    xml TEXT NOT NULL,
    version INTEGER DEFAULT 1,
    author TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pencarian cepat
CREATE INDEX IF NOT EXISTS idx_katalis_diagrams_updated_at ON public.katalis_diagrams(updated_at DESC);

-- 2. Tabel Log Audit dan Telemetri Simulasi Token
CREATE TABLE IF NOT EXISTS public.katalis_simulation_logs (
    id BIGSERIAL PRIMARY KEY,
    diagram_id TEXT REFERENCES public.katalis_diagrams(id) ON DELETE SET NULL,
    step_count INTEGER DEFAULT 0,
    duration_ms INTEGER DEFAULT 0,
    outcome TEXT DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index histori simulasi
CREATE INDEX IF NOT EXISTS idx_katalis_simulation_logs_diagram_id ON public.katalis_simulation_logs(diagram_id);

-- 3. Row Level Security (RLS) & Akses Terbuka (Public Read/Write untuk Anon Key)
ALTER TABLE public.katalis_diagrams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.katalis_simulation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Akses Baca Publik Diagram" ON public.katalis_diagrams
    FOR SELECT USING (true);

CREATE POLICY "Akses Tulis Publik Diagram" ON public.katalis_diagrams
    FOR ALL USING (true);

CREATE POLICY "Akses Baca Log Simulasi" ON public.katalis_simulation_logs
    FOR SELECT USING (true);

CREATE POLICY "Akses Tambah Log Simulasi" ON public.katalis_simulation_logs
    FOR INSERT WITH CHECK (true);
