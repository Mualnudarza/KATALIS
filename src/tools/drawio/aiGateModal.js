/* ==========================================================================
   KATALIS - Ephemeral AI Credential Gate Modal
   Author: DARWANZA / PEREKAYASA
   Standard: Vengeance UI Modal with Zero-Retention Ephemeral Storage
   ========================================================================== */

import { setAiCredentials, getAiCredentials, clearAiCredentials } from './aiClient.js';

export class AiGateModal {
  constructor(options = {}) {
    this.options = options;
    this.modalElement = null;
    this.onSuccess = options.onSuccess || (() => {});
    this.onSkip = options.onSkip || (() => {});
  }

  /**
   * Menampilkan modal Ephemeral AI Gate
   */
  open() {
    this.close(); // Pastikan tidak ada modal ganda

    const currentCreds = getAiCredentials() || {};
    const defaultEndpoint = currentCreds.endpoint || 'http://localhost:20128/v1';
    const defaultModel = currentCreds.model || 'kr/claude-sonnet-4.5';
    const currentKey = currentCreds.apiKey || '';

    const modalHtml = `
      <div class="vng-modal-backdrop active" id="modal-ai-gate-backdrop">
        <div class="vng-modal-card ai-gate-modal-card" id="modal-ai-gate-card">
          <div class="ai-gate-header">
            <div class="ai-gate-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              <span>Gerbang AI Sesi Sementara</span>
            </div>
            <button class="vng-btn-icon-subtle" id="btn-close-ai-gate" title="Tutup">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="ai-gate-content">
            <h3 class="ai-gate-title">Aktivasi Asisten AI Draw.io</h3>
            <p class="ai-gate-desc">
              Hubungkan model kecerdasan buatan pilihan Anda untuk menyusun diagram arsitektur dan flowchart secara generatif.
            </p>

            <!-- Ephemeral Notice Alert Box -->
            <div class="ai-gate-alert">
              <div class="alert-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div class="alert-text">
                <strong>Prinsip Keamanan Zero-Retention:</strong> Kredensial disimpan secara eksklusif pada memori sesi peramban aktif. Seluruh API Key dan Endpoint akan otomatis terhapus tanpa sisa saat tab atau peramban ditutup.
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
                  placeholder="http://localhost:20128/v1"
                  required
                />
                <span class="vng-field-hint">Default acuan: 9Router lokal pada port 20128</span>
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
                <span class="vng-field-hint">Kunci tidak pernah dikirim ke server KATALIS</span>
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
                  placeholder="kr/claude-sonnet-4.5 atau deepseek-chat"
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
        const endpoint = this.modalElement.querySelector('#ai-endpoint-input').value;
        const apiKey = this.modalElement.querySelector('#ai-apikey-input').value;
        const model = this.modalElement.querySelector('#ai-model-input').value;

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
