import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xrtfqufwbgbwgtwayuqt.supabase.co';
const STORAGE_KEY_CONFIG = 'katalis_supabase_config';
const STORAGE_KEY_DIAGRAMS = 'katalis_local_diagrams';

let supabaseClient = null;

export function getSupabaseConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.warn('Gagal membaca konfigurasi Supabase dari localStorage:', err);
  }
  return {
    url: SUPABASE_URL,
    anonKey: ''
  };
}

export function saveSupabaseConfig(url, anonKey) {
  const config = { url: url || SUPABASE_URL, anonKey: anonKey || '' };
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  if (config.url && config.anonKey) {
    supabaseClient = createClient(config.url, config.anonKey);
  } else {
    supabaseClient = null;
  }
  return config;
}

export function initSupabase() {
  const config = getSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      supabaseClient = createClient(config.url, config.anonKey);
      return supabaseClient;
    } catch (err) {
      console.warn('Inisialisasi client Supabase gagal:', err);
      supabaseClient = null;
    }
  }
  return null;
}

// Simpan Diagram (Cloud dengan fallback LocalStorage)
export async function saveDiagram({ id, title, description, xml }) {
  const payload = {
    id: id || 'diag_' + Date.now(),
    title: title || 'Diagram Tanpa Judul',
    description: description || '',
    xml,
    updated_at: new Date().toISOString()
  };

  // 1. Simpan selalu ke LocalStorage (Local-First Reliability)
  try {
    const local = getLocalDiagrams();
    const existingIdx = local.findIndex(item => item.id === payload.id);
    if (existingIdx >= 0) {
      local[existingIdx] = payload;
    } else {
      local.unshift(payload);
    }
    localStorage.setItem(STORAGE_KEY_DIAGRAMS, JSON.stringify(local));
  } catch (err) {
    console.error('Penyimpanan lokal gagal:', err);
  }

  // 2. Simpan ke Supabase jika client aktif
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('katalis_diagrams')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        console.warn('Penyimpanan Supabase error, tersimpan di lokal:', error.message);
        return { success: true, target: 'local', message: 'Tersimpan di penyimpanan browser (Supabase: ' + error.message + ')' };
      }
      return { success: true, target: 'cloud', data, message: 'Berhasil tersinkronisasi ke Cloud Supabase' };
    } catch (err) {
      console.warn('Koneksi Supabase gagal, tersimpan lokal:', err);
      return { success: true, target: 'local', message: 'Tersimpan di browser (Koneksi Supabase gagal)' };
    }
  }

  return { success: true, target: 'local', message: 'Tersimpan di penyimpanan browser lokal' };
}

// Ambil daftar diagram
export async function listDiagrams() {
  const localList = getLocalDiagrams();

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('katalis_diagrams')
        .select('id, title, description, updated_at')
        .order('updated_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return { source: 'cloud', diagrams: data };
      }
    } catch (err) {
      console.warn('Gagal mengambil diagram dari Supabase, memuat lokal:', err);
    }
  }

  return { source: 'local', diagrams: localList };
}

export function getLocalDiagrams() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DIAGRAMS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// Log simulasi token
export async function logSimulationEvent({ diagramId, stepCount, durationMs, outcome }) {
  const logEntry = {
    diagram_id: diagramId || 'unknown',
    step_count: stepCount || 0,
    duration_ms: durationMs || 0,
    outcome: outcome || 'completed',
    created_at: new Date().toISOString()
  };

  if (supabaseClient) {
    try {
      await supabaseClient.from('katalis_simulation_logs').insert([logEntry]);
    } catch (err) {
      console.debug('Log Supabase dilewati:', err);
    }
  }
}
