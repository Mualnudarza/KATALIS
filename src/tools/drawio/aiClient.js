/* ==========================================================================
   KATALIS - AI Streaming Client (OpenAI-Compatible / 9Router / BYOK)
   Author: DARWANZA / PEREKAYASA
   Standard: REST SSE Streams with Ephemeral Session Storage
   ========================================================================== */

const SESSION_STORAGE_KEY = 'katalis_ephemeral_ai_credentials';

// Fallback in-memory state jika sessionStorage tidak tersedia
let inMemoryCredentials = null;

/**
 * Menyimpan kredensial AI ke dalam sessionStorage (hanya aktif selama sesi tab peramban)
 */
export function setAiCredentials({ endpoint, apiKey, model }) {
  const cleanEndpoint = (endpoint || 'http://localhost:20128/v1').trim().replace(/\/+$/, '');
  const cleanModel = (model || 'kr/claude-sonnet-4.5').trim();
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
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Gagal membaca kredensial dari sessionStorage:', err);
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
 * Melakukan panggilan streaming Server-Sent Events (SSE) ke endpoint OpenAI-compatible
 */
export async function streamChatCompletion({ messages, onChunk, onDone, onError, signal }) {
  const creds = getAiCredentials();
  if (!creds || !creds.endpoint) {
    if (onError) onError(new Error('Kredensial AI tidak ditemukan. Silakan konfigurasi via Ephemeral AI Gate.'));
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
    model: creds.model || 'kr/claude-sonnet-4.5',
    messages,
    stream: true,
    temperature: 0.2
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal
    });

    if (!response.ok) {
      let errorBody = '';
      try {
        errorBody = await response.text();
      } catch (e) {
        errorBody = response.statusText;
      }
      throw new Error(`HTTP ${response.status}: ${errorBody || response.statusText}`);
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

    if (onDone) onDone(accumulatedContent);
    return accumulatedContent;
  } catch (err) {
    if (signal && signal.aborted) {
      console.log('Permintaan streaming dibatalkan pengguna.');
      return;
    }
    console.error('Galat saat streaming AI completion:', err);
    if (onError) onError(err);
    throw err;
  }
}
