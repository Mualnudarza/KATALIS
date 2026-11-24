/* ==========================================================================
   KATALIS - Ephemeral AI Credential Gate Modal (Google Gemini Edition)
   Author: DARWANZA / PEREKAYASA
   Standard: Google Gemini Gateway (Pure Client-Side Ephemeral Security)
   ========================================================================== */

import {
  setAiCredentials,
  getAiCredentials,
  clearAiCredentials,
  GEMINI_DEFAULT_ENDPOINT,
  GEMINI_DEFAULT_MODEL
} from './aiClient.js';

export const GEMINI_MODELS = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    badge: 'REKOMENDASI',
    hint: 'Model resmi paling stabil & cepat untuk perancangan diagram (Default)',
    model: 'gemini-2.5-flash'
  },
  {
    id: 'gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash-Lite',
    badge: 'ULTRA CEPAT',
    hint: 'Latensi ultra rendah (<2 detik) dan hemat kuota',
    model: 'gemini-2.5-flash-lite'
  },
  {
    id: 'gemini-3.6-flash',
    name: 'Gemini 3.6 Flash',
    badge: 'TERBARU',
    hint: 'Generasi 3 dengan penalaran arsitektur sistem lanjutan',
    model: 'gemini-3.6-flash'
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
   * Menampilkan modal Ephemeral AI Gate khusus Google Gemini
   */
  open() {
    this.close(); // Pastikan tidak ada modal ganda

    const currentCreds = getAiCredentials() || {};
    const defaultEndpoint = currentCreds.endpoint || GEMINI_DEFAULT_ENDPOINT;
    const defaultModel = currentCreds.model || GEMINI_DEFAULT_MODEL;
    const currentKey = currentCreds.apiKey || '';

    // Render tombol pilihan model Gemini
    const modelPillsHtml = GEMINI_MODELS.map((item) => {
      const isSelected = item.model === defaultModel;
      return `
        <button
          type="button"
          class="ai-preset-pill ${isSelected ? 'active' : ''}"
          data-model="${item.model}"
          data-hint="${item.hint}"
          title="${item.hint}"
        >
          <span class="preset-name">${item.name}</span>
          <span class="preset-type-badge https">${item.badge}</span>
        </button>
      `;
    }).join('');

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
              <span>Google Gemini AI (Sesi Sementara)</span>
            </div>
            <span class="ai-env-tag https">Gateway Resmi Google</span>
            <button class="vng-btn-icon-subtle" id="btn-close-ai-gate" title="Tutup">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="ai-gate-content">
            <h3 class="ai-gate-title">Aktivasi Asisten AI Gemini Draw.io</h3>
            <p class="ai-gate-desc">
              Gunakan Google Gemini API untuk merancang dan menyunting diagram Draw.io secara generatif. Kredensial aktif di memori sesi peramban dan musnah saat tab ditutup (Zero-Retention Security).
            </p>

            <!-- Pilihan Model Gemini -->
            <div class="ai-preset-wrapper">
              <label class="vng-label">Pilih Model Google Gemini:</label>
              <div class="ai-preset-list" style="grid-template-columns: repeat(3, 1fr);">
                ${modelPillsHtml}
              </div>
            </div>

            <!-- Form Inputs -->
            <form id="form-ai-gate" class="ai-gate-form">
              <div class="vng-form-group">
                <label for="ai-apikey-input" class="vng-label">
                  Google Gemini API Key:
                </label>
                <div class="input-with-action">
                  <input
                    type="password"
                    id="ai-apikey-input"
                    class="vng-input"
                    value="${currentKey}"
                    placeholder="Masukkan kunci API Google Anda (AIzaSy...)"
                    required
                  />
                  <button type="button" class="vng-btn-icon-addon" id="btn-toggle-key-visibility" title="Lihat/Sembunyikan">
                    <svg id="svg-eye" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </div>
                <span class="vng-field-hint">
                  Belum punya API key? Dapatkan gratis di <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" style="color: var(--vng-primary); font-weight: 600; text-decoration: underline;">Google AI Studio</a>.
                </span>
              </div>

              <div class="vng-form-group">
                <label for="ai-model-input" class="vng-label">
                  Model ID:
                </label>
                <input
                  type="text"
                  id="ai-model-input"
                  class="vng-input"
                  value="${defaultModel}"
                  placeholder="gemini-2.5-flash"
                  required
                />
                <span class="vng-field-hint" id="ai-model-hint">
                  Model terpilih siap mengolah diagram secara streaming real-time.
                </span>
              </div>

              <!-- Endpoint Detail (Collapsible / Readonly) -->
              <details class="vng-details-box" style="margin-bottom: 16px;">
                <summary style="font-size: 11px; color: var(--vng-text-muted); cursor: pointer; font-weight: 600;">
                  Pengaturan Lanjutan (Endpoint Gateway)
                </summary>
                <div class="vng-form-group" style="margin-top: 8px;">
                  <input
                    type="text"
                    id="ai-endpoint-input"
                    class="vng-input"
                    value="${defaultEndpoint}"
                    placeholder="https://generativelanguage.googleapis.com/v1beta/openai"
                  />
                  <span class="vng-field-hint">
                    Endpoint OpenAI-compatible resmi dari Google Generative Language API (Dukungan penuh CORS & HTTPS).
                  </span>
                </div>
              </details>

              <div class="ai-gate-actions">
                <button type="button" class="vng-btn vng-btn-secondary" id="btn-skip-ai-gate">
                  Bangun Dari Nol (Tanpa AI)
                </button>
                <button type="submit" class="vng-btn vng-btn-primary" id="btn-submit-ai-gate">
                  Aktifkan AI Gemini
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

    const endpointInput = this.modalElement.querySelector('#ai-endpoint-input');
    const modelInput = this.modalElement.querySelector('#ai-model-input');
    const modelHint = this.modalElement.querySelector('#ai-model-hint');
    const modelPills = this.modalElement.querySelectorAll('.ai-preset-pill');

    // Klik tombol model pills
    modelPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        modelPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const mdl = pill.getAttribute('data-model');
        const hnt = pill.getAttribute('data-hint');

        if (modelInput && mdl) modelInput.value = mdl;
        if (modelHint && hnt) modelHint.textContent = hnt;
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

    // Submit form (Aktifkan AI Gemini)
    const form = this.modalElement.querySelector('#form-ai-gate');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const endpoint = endpointInput ? endpointInput.value : GEMINI_DEFAULT_ENDPOINT;
        const apiKey = keyInput ? keyInput.value : '';
        const model = modelInput ? modelInput.value : GEMINI_DEFAULT_MODEL;

        if (!apiKey.trim()) {
          alert('Silakan masukkan Google Gemini API Key Anda.');
          return;
        }

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

