/* ==========================================================================
   KATALIS - Ephemeral AI Credential Gate Modal
   Author: DARWANZA / PEREKAYASA
   Standard: Vengeance UI Modal with Dual-Target Strategy (Local 9Router & Cloud HTTPS)
   ========================================================================== */

import { setAiCredentials, getAiCredentials, clearAiCredentials } from './aiClient.js';

export const AI_PRESETS = [
  {
    id: 'openrouter',
    name: 'OpenRouter',
    type: 'https',
    endpoint: 'https://openrouter.ai/api/v1',
    model: 'anthropic/claude-3.5-sonnet',
    hint: 'Cloud HTTPS (Direkomendasikan untuk GitHub Pages)'
  },
  {
    id: 'groq',
    name: 'Groq',
    type: 'https',
    endpoint: 'https://api.groq.com/openai/v1',
    model: 'llama-3.3-70b-versatile',
    hint: 'Cloud HTTPS (Kecepatan tinggi)'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    type: 'https',
    endpoint: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
    hint: 'Cloud HTTPS (Ekonomis & Andal)'
  },
  {
    id: '9router',
    name: '9Router Lokal',
    type: 'local',
    endpoint: 'http://localhost:20128/v1',
    model: 'kr/claude-sonnet-4.5',
    hint: 'Lokal Komputer (Direkomendasikan untuk http://localhost:8080)'
  }
];

export class AiGateModal {
  constructor(options = {}) {
    this.options = options;
    this.modalElement = null;
    this.onSuccess = options.onSuccess || (() => {});
    this.onSkip = options.onSkip || (() => {});
  }

  /**
   * Menampilkan modal Ephemeral AI Gate dengan preset Dual-Target
   */
  open() {
    this.close(); // Pastikan tidak ada modal ganda

    const isHttps = typeof window !== 'undefined' && window.location && window.location.protocol === 'https:';
    const currentCreds = getAiCredentials() || {};

    // Penentuan default berdasarkan protokol lingkungan jika belum tersimpan
    let defaultEndpoint = currentCreds.endpoint;
    let defaultModel = currentCreds.model;

    if (!defaultEndpoint) {
      if (isHttps) {
        defaultEndpoint = 'https://openrouter.ai/api/v1';
        defaultModel = 'anthropic/claude-3.5-sonnet';
      } else {
        defaultEndpoint = 'http://localhost:20128/v1';
        defaultModel = 'kr/claude-sonnet-4.5';
      }
    }

    const currentKey = currentCreds.apiKey || '';

    // Render tombol preset pills
    const presetPillsHtml = AI_PRESETS.map((preset) => {
      const isSelected = preset.endpoint === defaultEndpoint;
      const badgeText = preset.type === 'https' ? 'HTTPS' : 'LOKAL';
      return `
        <button
          type="button"
          class="ai-preset-pill ${isSelected ? 'active' : ''}"
          data-preset-id="${preset.id}"
          data-endpoint="${preset.endpoint}"
          data-model="${preset.model}"
          data-hint="${preset.hint}"
          title="${preset.hint}"
        >
          <span class="preset-name">${preset.name}</span>
          <span class="preset-type-badge ${preset.type}">${badgeText}</span>
        </button>
      `;
    }).join('');

    const envBadgeText = isHttps
      ? 'Lingkungan: GitHub Pages (HTTPS)'
      : 'Lingkungan: Lokal (HTTP)';

    const modalHtml = `
      <div class="vng-modal-backdrop open active" id="modal-ai-gate-backdrop">
        <div class="vng-modal ai-gate-modal-card" id="modal-ai-gate-card">
          <div class="ai-gate-header">
            <div class="ai-gate-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              <span>Gerbang AI Sesi Sementara</span>
            </div>
            <span class="ai-env-tag ${isHttps ? 'https' : 'local'}">${envBadgeText}</span>
            <button class="vng-btn-icon-subtle" id="btn-close-ai-gate" title="Tutup">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="ai-gate-content">
            <h3 class="ai-gate-title">Aktivasi Asisten AI Draw.io</h3>
            <p class="ai-gate-desc">
              Pilih penyedia model AI pilihan Anda untuk menyusun diagram arsitektur secara generatif. Kredensial aktif di memori sesi peramban dan musnah saat tab ditutup.
            </p>

            <!-- Preset Selector Pills -->
            <div class="ai-preset-wrapper">
              <label class="vng-label">Pilih Preset Gateway AI:</label>
              <div class="ai-preset-list">
                ${presetPillsHtml}
              </div>
            </div>

            <!-- Form Inputs -->
            <form id="form-ai-gate" class="ai-gate-form">
              <div class="vng-form-group">
                <label for="ai-endpoint-input" class="vng-label">
                  Endpoint Gateway AI (OpenAI-Compatible):
                </label>
                <input
                  type="text"
                  id="ai-endpoint-input"
                  class="vng-input"
                  value="${defaultEndpoint}"
                  placeholder="https://openrouter.ai/api/v1 atau http://localhost:20128/v1"
                  required
                />
                <span class="vng-field-hint" id="ai-endpoint-hint">
                  ${isHttps ? 'Disarankan menggunakan endpoint HTTPS di GitHub Pages.' : 'Mendukung 9Router lokal di port 20128.'}
                </span>

                <!-- Notifikasi Panduan Dual-Target jika di HTTPS memakai HTTP lokal -->
                <div class="ai-dual-target-note" id="ai-dual-target-note" style="display: none;">
                  <div class="note-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                  </div>
                  <div class="note-text">
                    <strong>Catatan Strategi Dual-Target:</strong>
                    Pada GitHub Pages (HTTPS), peramban membatasi pemanggilan langsung ke <code>http://localhost</code>. Untuk memakai 9Router lokal Anda secara bebas, buka KATALIS dari repositori lokal via <code>npm start</code> (http://localhost:8080). Di GitHub Pages, gunakan penyedia HTTPS seperti OpenRouter atau Groq.
                  </div>
                </div>
              </div>

              <div class="vng-form-group">
                <label for="ai-apikey-input" class="vng-label">
                  API Key / Token Bearer:
                </label>
                <div class="input-with-action">
                  <input
                    type="password"
                    id="ai-apikey-input"
                    class="vng-input"
                    value="${currentKey}"
                    placeholder="Masukkan kunci API Anda..."
                  />
                  <button type="button" class="vng-btn-icon-addon" id="btn-toggle-key-visibility" title="Lihat/Sembunyikan">
                    <svg id="svg-eye" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </div>
                <span class="vng-field-hint">Kunci tersimpan secara ephemeral hanya untuk sesi aktif tab ini</span>
              </div>

              <div class="vng-form-group">
                <label for="ai-model-input" class="vng-label">
                  Model ID:
                </label>
                <input
                  type="text"
                  id="ai-model-input"
                  class="vng-input"
                  value="${defaultModel || 'anthropic/claude-3.5-sonnet'}"
                  placeholder="Contoh: anthropic/claude-3.5-sonnet atau kr/claude-sonnet-4.5"
                />
              </div>

              <div class="ai-gate-actions">
                <button type="button" class="vng-btn vng-btn-secondary" id="btn-skip-ai-gate">
                  Bangun Dari Nol (Tanpa AI)
                </button>
                <button type="submit" class="vng-btn vng-btn-primary" id="btn-submit-ai-gate">
                  Aktifkan Mode AI
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    this.modalElement = document.getElementById('modal-ai-gate-backdrop');
    this.attachEvents();
  }

  attachEvents() {
    if (!this.modalElement) return;

    // Tutup saat klik latar belakang
    this.modalElement.addEventListener('click', (e) => {
      if (e.target === this.modalElement) {
        this.close();
      }
    });

    // Tombol silang
    const btnClose = this.modalElement.querySelector('#btn-close-ai-gate');
    if (btnClose) {
      btnClose.addEventListener('click', () => this.close());
    }

    // Toggle visibility API Key
    const keyInput = this.modalElement.querySelector('#ai-apikey-input');
    const toggleBtn = this.modalElement.querySelector('#btn-toggle-key-visibility');
    if (toggleBtn && keyInput) {
      toggleBtn.addEventListener('click', () => {
        keyInput.type = keyInput.type === 'password' ? 'text' : 'password';
      });
    }

    // Pengecekan input endpoint dan tampilkan catatan Dual-Target bila perlu
    const endpointInput = this.modalElement.querySelector('#ai-endpoint-input');
    const modelInput = this.modalElement.querySelector('#ai-model-input');
    const endpointHint = this.modalElement.querySelector('#ai-endpoint-hint');
    const dualTargetNote = this.modalElement.querySelector('#ai-dual-target-note');
    const presetPills = this.modalElement.querySelectorAll('.ai-preset-pill');

    const updateDualTargetNote = () => {
      const isHttps = typeof window !== 'undefined' && window.location && window.location.protocol === 'https:';
      const val = (endpointInput?.value || '').trim();
      const isLocalHttp = val.startsWith('http://localhost') || val.startsWith('http://127.0.0.1');

      if (dualTargetNote) {
        dualTargetNote.style.display = (isHttps && isLocalHttp) ? 'flex' : 'none';
      }
    };

    if (endpointInput) {
      updateDualTargetNote();
      endpointInput.addEventListener('input', () => {
        updateDualTargetNote();
        // Hapus kelas aktif dari pills jika pengguna mengetik kustom
        presetPills.forEach(p => p.classList.remove('active'));
      });
    }

    // Klik tombol preset pills
    presetPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        presetPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const ep = pill.getAttribute('data-endpoint');
        const mdl = pill.getAttribute('data-model');
        const hnt = pill.getAttribute('data-hint');

        if (endpointInput && ep) endpointInput.value = ep;
        if (modelInput && mdl) modelInput.value = mdl;
        if (endpointHint && hnt) endpointHint.textContent = hnt;

        updateDualTargetNote();
      });
    });

    // Tombol Lewati / Bangun Dari Nol
    const btnSkip = this.modalElement.querySelector('#btn-skip-ai-gate');
    if (btnSkip) {
      btnSkip.addEventListener('click', () => {
        this.close();
        this.onSkip('pure-zero');
      });
    }

    // Submit form (Aktifkan AI)
    const form = this.modalElement.querySelector('#form-ai-gate');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const endpoint = endpointInput ? endpointInput.value : '';
        const apiKey = keyInput ? keyInput.value : '';
        const model = modelInput ? modelInput.value : '';

        setAiCredentials({ endpoint, apiKey, model });
        this.close();
        this.onSuccess('ai-assisted');
      });
    }
  }

  close() {
    if (this.modalElement) {
      this.modalElement.remove();
      this.modalElement = null;
    }
    const existing = document.getElementById('modal-ai-gate-backdrop');
    if (existing) existing.remove();
  }
}

