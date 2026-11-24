/* ==========================================================================
   KATALIS - AI Streaming Client (Google Gemini API / Ephemeral Session)
   Author: DARWANZA / PEREKAYASA
   Standard: Google Generative Language OpenAI-Compatible REST SSE
   ========================================================================== */

const SESSION_STORAGE_KEY = 'katalis_ephemeral_gemini_credentials';

export const GEMINI_DEFAULT_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/openai';
export const GEMINI_DEFAULT_MODEL = 'gemini-2.5-flash';

// Fallback in-memory state jika sessionStorage tidak tersedia
let inMemoryCredentials = null;

/**
 * Menyimpan kredensial AI ke dalam sessionStorage (hanya aktif selama sesi tab peramban)
 */
export function setAiCredentials({ endpoint, apiKey, model }) {
  const cleanEndpoint = (endpoint || GEMINI_DEFAULT_ENDPOINT).trim().replace(/\/+$/, '');
  let cleanModel = (model || GEMINI_DEFAULT_MODEL).trim();

  // Migrasi otomatis jika model input adalah model lama yang sunset atau bermasalah timeout
  if (cleanModel.includes('1.5') || cleanModel.includes('2.0') || cleanModel.includes('3.8')) {
    cleanModel = GEMINI_DEFAULT_MODEL;
  }

  const cleanKey = (apiKey || '').trim();

  const creds = {
    endpoint: cleanEndpoint,
    apiKey: cleanKey,
    model: cleanModel,
    updatedAt: Date.now()
  };

  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(creds));
  } catch (err) {
    console.warn('Gagal menyimpan kredensial ke sessionStorage, beralih ke in-memory state:', err);
  }
  inMemoryCredentials = creds;
}

/**
 * Mengambil kredensial AI aktif dari sesi peramban
 */
export function getAiCredentials() {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migrasi otomatis jika sessionStorage menyimpan model lama atau timeout
      if (parsed.model && (parsed.model.includes('1.5') || parsed.model.includes('2.0') || parsed.model.includes('3.8'))) {
        parsed.model = GEMINI_DEFAULT_MODEL;
        try {
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(parsed));
        } catch (_) {}
      }
      return parsed;
    }
  } catch (err) {
    console.warn('Gagal membaca kredensial dari sessionStorage:', err);
  }
  if (inMemoryCredentials && inMemoryCredentials.model && (inMemoryCredentials.model.includes('1.5') || inMemoryCredentials.model.includes('2.0') || inMemoryCredentials.model.includes('3.8'))) {
    inMemoryCredentials.model = GEMINI_DEFAULT_MODEL;
  }
  return inMemoryCredentials;
}

/**
 * Memeriksa apakah kredensial AI aktif tersedia
 */
export function hasAiCredentials() {
  const creds = getAiCredentials();
  return Boolean(creds && creds.endpoint && creds.apiKey);
}

/**
 * Menghapus kredensial AI tanpa sisa (Zero-Retention Security)
 */
export function clearAiCredentials() {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (err) {
    console.warn('Gagal menghapus kredensial dari sessionStorage:', err);
  }
  inMemoryCredentials = null;
}

/**
 * Melakukan panggilan streaming Server-Sent Events (SSE) ke endpoint OpenAI-compatible Google Gemini
 */
export async function streamChatCompletion({ messages, onChunk, onDone, onError, signal }) {
  const creds = getAiCredentials();
  if (!creds || !creds.endpoint || !creds.apiKey) {
    const missingErr = new Error('Kunci API Google Gemini belum dikonfigurasi. Silakan masukkan API Key di Gerbang AI.');
    if (onError) onError(missingErr);
    return;
  }

  const url = `${creds.endpoint}/chat/completions`;
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'text/event-stream'
  };

  if (creds.apiKey) {
    headers['Authorization'] = `Bearer ${creds.apiKey}`;
  }

  const payload = {
    model: creds.model || GEMINI_DEFAULT_MODEL,
    messages,
    stream: true,
    temperature: 0.2
  };

  let fetchSignal = signal;
  let timeoutId = null;

  // Jika tidak ada signal dari luar, pasang timeout 30 detik agar tidak pernah loading tanpa batas
  if (!fetchSignal) {
    const controller = new AbortController();
    fetchSignal = controller.signal;
    timeoutId = setTimeout(() => {
      controller.abort(new Error('Koneksi ke Google Gemini melebihi batas waktu 30 detik.'));
    }, 30000);
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: fetchSignal
    });

    if (timeoutId) clearTimeout(timeoutId);

    if (!response.ok) {
      let errorBody = '';
      try {
        const rawText = await response.text();
        try {
          const errJson = JSON.parse(rawText);
          if (Array.isArray(errJson) && errJson[0]?.error?.message) {
            errorBody = errJson[0].error.message;
          } else if (errJson?.error?.message) {
            errorBody = errJson.error.message;
          } else {
            errorBody = rawText;
          }
        } catch (_) {
          errorBody = rawText;
        }
      } catch (e) {
        errorBody = response.statusText;
      }
      throw new Error(`Google Gemini (${response.status}): ${errorBody || response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response body tidak mendukung streaming pembacaan data.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let accumulatedContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Sisakan baris yang belum utuh

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith(':')) continue; // Lewati komentar SSE

        if (trimmed === 'data: [DONE]') {
          if (onDone) onDone(accumulatedContent);
          return accumulatedContent;
        }

        if (trimmed.startsWith('data:')) {
          const jsonStr = trimmed.slice(5).trim();
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content || '';
            if (delta) {
              accumulatedContent += delta;
              if (onChunk) onChunk(accumulatedContent, delta);
            }
          } catch (jsonErr) {
            // Abaikan potongan JSON parsial yang belum lengkap
          }
        }
      }
    }

    // Tangani sisa buffer jika stream selesai tanpa data: [DONE]
    if (buffer.trim()) {
      const trimmed = buffer.trim();
      if (trimmed.startsWith('data:') && trimmed !== 'data: [DONE]') {
        try {
          const parsed = JSON.parse(trimmed.slice(5).trim());
          const delta = parsed.choices?.[0]?.delta?.content || '';
          if (delta) {
            accumulatedContent += delta;
            if (onChunk) onChunk(accumulatedContent, delta);
          }
        } catch (_) {}
      }
    }

    if (onDone) onDone(accumulatedContent);
    return accumulatedContent;
  } catch (err) {
    if (timeoutId) clearTimeout(timeoutId);
    if (signal && signal.aborted) {
      console.log('Permintaan streaming dibatalkan pengguna.');
      return;
    }
    console.error('Galat saat streaming AI completion:', err);
    if (onError) onError(err);
    throw err;
  }
}
