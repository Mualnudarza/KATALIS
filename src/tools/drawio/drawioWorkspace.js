/* ==========================================================================
   KATALIS - Draw.io Studio Workspace Controller
   Author: DARWANZA / PEREKAYASA
   Standard: Dual-Mode Workspace (AI-Assisted & Pure Zero Manual)
   ========================================================================== */

import { DrawioProtocolBridge, DRAWIO_EMBED_URL } from './drawioProtocol.js';
import { buildDrawioSystemPrompt, extractAndCleanXml, BLANK_DRAWIO_XML } from './xmlValidator.js';
import { getAiCredentials, hasAiCredentials, streamChatCompletion, clearAiCredentials } from './aiClient.js';

export class DrawioWorkspace {
  constructor(options = {}) {
    this.options = options;
    this.container = null;
    this.bridge = null;
    this.mode = 'pure-zero'; // 'pure-zero' | 'ai-assisted'
    this.chatHistory = [];
    this.isStreaming = false;
    this.abortController = null;
    this.currentDiagramXml = BLANK_DRAWIO_XML;
  }

  /**
   * Menempelkan ruang kerja ke dalam kontainer DOM
   */
  mount(container, initialMode = 'pure-zero') {
    this.container = container;
    this.mode = initialMode;
    this.renderLayout();
    this.initIframe();
    this.attachEventListeners();
    this.updateModeUI();
  }

  /**
   * Memasang elemen tata letak split-view dan iframe
   */
  renderLayout() {
    this.container.innerHTML = `
      <div class="drawio-studio-root">
        <!-- Top Spotlight Bar khusus Draw.io -->
        <header class="drawio-topbar">
          <div class="drawio-topbar-left">
            <button id="btn-drawio-back-hub" class="vng-btn-icon" title="Kembali ke Portal Hub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div class="drawio-brand-info">
              <h2 class="drawio-title">Draw.io Studio</h2>
              <span class="drawio-mode-tag" id="drawio-mode-label">Mode Manual Murni</span>
            </div>
          </div>

          <div class="drawio-topbar-center">
            <div id="drawio-ai-badge" class="drawio-ai-status-pill">
              <span class="status-dot"></span>
              <span class="status-text">Mode Manual</span>
            </div>
          </div>

          <div class="drawio-topbar-right">
            <button id="btn-drawio-toggle-ai" class="vng-btn vng-btn-secondary" title="Konfigurasi Asisten AI">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              <span id="btn-drawio-toggle-ai-text">Buka Asisten AI</span>
            </button>
            <button id="btn-drawio-reset-canvas" class="vng-btn vng-btn-secondary" title="Bersihkan Kanvas">
              Kanvas Baru
            </button>
          </div>
        </header>

        <!-- Main Body: Split View (Drawer AI di kiri + Kanvas di kanan) -->
        <div class="drawio-workspace-body" id="drawio-workspace-body">
          <!-- AI Assistant Drawer -->
          <aside class="drawio-ai-drawer" id="drawio-ai-drawer">
            <div class="ai-drawer-header">
              <div class="ai-drawer-title-group">
                <h3 class="ai-drawer-heading">Asisten AI Draw.io</h3>
                <span class="ai-drawer-endpoint" id="ai-drawer-endpoint-label">Gateway: Localhost</span>
              </div>
              <div class="ai-drawer-actions">
                <button id="btn-ai-drawer-close" class="vng-btn-icon-subtle" title="Sembunyikan Panel AI">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Pesan Pengingat Kredensial Sementara -->
            <div class="ai-drawer-notice">
              <span>Sesi Ephemeral: Kredensial aktif di memori peramban dan musnah saat tab ditutup.</span>
            </div>

            <!-- Chat Message List -->
            <div class="ai-drawer-messages" id="ai-drawer-messages">
              <div class="ai-message ai-message-system">
                <div class="ai-bubble">
                  Selamat datang di Asisten AI Draw.io KATALIS. Ketikkan deskripsi diagram sistem, arsitektur microservices, ERD, atau flowchart logika yang ingin Anda buat.
                </div>
              </div>
            </div>

            <!-- Chat Input Area -->
            <div class="ai-drawer-footer">
              <div class="ai-input-wrapper">
                <textarea
                  id="drawio-ai-prompt-input"
                  class="ai-prompt-textarea"
                  placeholder="Ketik deskripsi diagram... (Tekan Enter untuk kirim, Shift+Enter untuk baris baru)"
                  rows="3"
                ></textarea>
                <div class="ai-input-controls">
                  <span class="ai-input-tip">Format: XML mxGraphModel</span>
                  <div class="ai-btn-group">
                    <button id="btn-drawio-ai-cancel" class="vng-btn vng-btn-danger vng-btn-sm" style="display: none;">
                      Batal
                    </button>
                    <button id="btn-drawio-ai-submit" class="vng-btn vng-btn-primary vng-btn-sm">
                      Kirim
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <!-- Draw.io Iframe Canvas Container -->
          <main class="drawio-canvas-container" id="drawio-canvas-container">
            <div class="drawio-loading-overlay" id="drawio-loading-overlay">
              <div class="drawio-spinner"></div>
              <p>Menghubungkan ke kanvas Draw.io...</p>
            </div>
            <iframe
              id="drawio-embedded-iframe"
              class="drawio-iframe"
              src="${DRAWIO_EMBED_URL}"
              allow="clipboard-read; clipboard-write"
            ></iframe>
          </main>
        </div>
      </div>
    `;
  }

  /**
   * Menginisialisasi komunikasi postMessage dengan iframe
   */
  initIframe() {
    const iframe = document.getElementById('drawio-embedded-iframe');
    const overlay = document.getElementById('drawio-loading-overlay');

    this.bridge = new DrawioProtocolBridge(iframe, {
      initialXml: this.currentDiagramXml,
      onReady: () => {
        if (overlay) {
          overlay.style.display = 'none';
        }
      },
      onSave: (xml) => {
        this.currentDiagramXml = xml;
      }
    });
  }

  /**
   * Menghubungkan seluruh interaksi event listener pada komponen
   */
  attachEventListeners() {
    // Tombol kembali ke Beranda Hub
    const btnBackHub = document.getElementById('btn-drawio-back-hub');
    if (btnBackHub) {
      btnBackHub.addEventListener('click', () => {
        if (this.options.onNavigateHub) {
          this.options.onNavigateHub();
        }
      });
    }

    // Tombol toggle atau konfigurasi AI
    const btnToggleAi = document.getElementById('btn-drawio-toggle-ai');
    if (btnToggleAi) {
      btnToggleAi.addEventListener('click', () => {
        if (this.mode === 'pure-zero') {
          // Buka modal gate untuk konfigurasi AI
          if (this.options.onRequestAiGate) {
            this.options.onRequestAiGate();
          }
        } else {
          // Tutup drawer AI atau alihkan ke mode manual
          this.setMode(this.isDrawerOpen() ? 'pure-zero' : 'ai-assisted');
        }
      });
    }

    // Tombol tutup panel AI
    const btnCloseDrawer = document.getElementById('btn-ai-drawer-close');
    if (btnCloseDrawer) {
      btnCloseDrawer.addEventListener('click', () => {
        this.setMode('pure-zero');
      });
    }

    // Tombol reset kanvas bersih
    const btnResetCanvas = document.getElementById('btn-drawio-reset-canvas');
    if (btnResetCanvas) {
      btnResetCanvas.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin mengosongkan kanvas diagram?')) {
          this.currentDiagramXml = BLANK_DRAWIO_XML;
          if (this.bridge) {
            this.bridge.loadDiagram(BLANK_DRAWIO_XML);
          }
        }
      });
    }

    // Input prompt kirim
    const promptInput = document.getElementById('drawio-ai-prompt-input');
    const btnSubmit = document.getElementById('btn-drawio-ai-submit');
    const btnCancel = document.getElementById('btn-drawio-ai-cancel');

    if (promptInput) {
      promptInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.submitPrompt();
        }
      });
    }

    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => {
        this.submitPrompt();
      });
    }

    if (btnCancel) {
      btnCancel.addEventListener('click', () => {
        this.cancelStreaming();
      });
    }
  }

  isDrawerOpen() {
    const drawer = document.getElementById('drawio-ai-drawer');
    return drawer && drawer.classList.contains('active');
  }

  /**
   * Mengatur mode kerja (Pure Zero vs AI-Assisted)
   */
  setMode(mode) {
    this.mode = mode;
    this.updateModeUI();
  }

  /**
   * Memperbarui visual UI berdasarkan mode aktif
   */
  updateModeUI() {
    const drawer = document.getElementById('drawio-ai-drawer');
    const modeLabel = document.getElementById('drawio-mode-label');
    const badge = document.getElementById('drawio-ai-badge');
    const btnToggleAiText = document.getElementById('btn-drawio-toggle-ai-text');
    const endpointLabel = document.getElementById('ai-drawer-endpoint-label');

    const creds = getAiCredentials();
    const isAiConfigured = hasAiCredentials();

    if (this.mode === 'ai-assisted' && isAiConfigured) {
      if (drawer) drawer.classList.add('active');
      if (modeLabel) modeLabel.textContent = 'Mode Asisten AI Aktif';
      if (btnToggleAiText) btnToggleAiText.textContent = 'Sembunyikan AI';

      if (badge) {
        badge.className = 'drawio-ai-status-pill connected';
        badge.innerHTML = `
          <span class="status-dot"></span>
          <span class="status-text">${creds.model || 'AI Terkoneksi'}</span>
        `;
      }

      if (endpointLabel && creds) {
        endpointLabel.textContent = `Model: ${creds.model || 'Default'} (${creds.endpoint})`;
      }
    } else {
      if (drawer) drawer.classList.remove('active');
      if (modeLabel) modeLabel.textContent = 'Mode Manual Murni';
      if (btnToggleAiText) btnToggleAiText.textContent = 'Buka Asisten AI';

      if (badge) {
        badge.className = 'drawio-ai-status-pill manual';
        badge.innerHTML = `
          <span class="status-dot"></span>
          <span class="status-text">Mode Manual (Tanpa AI)</span>
        `;
      }
    }
  }

  /**
   * Mengirim prompt pengguna ke model AI dan mengalirkan respons
   */
  async submitPrompt() {
    const input = document.getElementById('drawio-ai-prompt-input');
    if (!input || this.isStreaming) return;

    const userText = input.value.trim();
    if (!userText) return;

    input.value = '';
    this.appendMessage('user', userText);

    // Ambil diagram aktif untuk konteks
    let activeXml = this.currentDiagramXml;
    if (this.bridge && this.bridge.isReady) {
      try {
        const latestXml = await this.bridge.getCurrentXml();
        if (latestXml) activeXml = latestXml;
      } catch (e) {
        // Abaikan
      }
    }

    const messages = [
      { role: 'system', content: buildDrawioSystemPrompt() }
    ];

    // Jika sudah ada diagram sebelumnya, lampirkan sebagai konteks
    if (activeXml && activeXml !== BLANK_DRAWIO_XML) {
      messages.push({
        role: 'user',
        content: `Berikut adalah diagram XML Draw.io yang sedang aktif di kanvas:\n\`\`\`xml\n${activeXml}\n\`\`\`\nMohon lakukan perbaikan atau penambahan sesuai instruksi berikutnya.`
      });
    }

    messages.push({ role: 'user', content: userText });

    const aiBubble = this.appendMessage('assistant', '', true);
    this.setStreamingState(true);

    this.abortController = new AbortController();

    try {
      const fullResponse = await streamChatCompletion({
        messages,
        signal: this.abortController.signal,
        onChunk: (accumulated, delta) => {
          if (aiBubble) {
            aiBubble.innerHTML = this.formatStreamingText(accumulated);
            this.scrollMessagesToBottom();
          }
        },
        onDone: (finalText) => {
          this.setStreamingState(false);
          const cleanXml = extractAndCleanXml(finalText);
          this.currentDiagramXml = cleanXml;

          if (this.bridge && cleanXml) {
            this.bridge.loadDiagram(cleanXml);
          }

          if (aiBubble) {
            aiBubble.innerHTML = `
              <div class="ai-generated-summary">
                <p>Diagram berhasil diperbarui di kanvas Draw.io.</p>
                <div class="ai-generated-actions">
                  <button class="vng-btn vng-btn-xs vng-btn-secondary btn-reapply-xml">Terapkan Ulang</button>
                </div>
              </div>
            `;
            const btnReapply = aiBubble.querySelector('.btn-reapply-xml');
            if (btnReapply) {
              btnReapply.addEventListener('click', () => {
                if (this.bridge) this.bridge.loadDiagram(cleanXml);
              });
            }
          }
          this.scrollMessagesToBottom();
        },
        onError: (err) => {
          this.setStreamingState(false);
          if (aiBubble) {
            aiBubble.innerHTML = `<span class="ai-error-text">Gagal menyusun diagram: ${err.message}</span>`;
          }
        }
      });
    } catch (err) {
      this.setStreamingState(false);
    }
  }

  cancelStreaming() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.setStreamingState(false);
  }

  setStreamingState(isStreaming) {
    this.isStreaming = isStreaming;
    const btnSubmit = document.getElementById('btn-drawio-ai-submit');
    const btnCancel = document.getElementById('btn-drawio-ai-cancel');

    if (btnSubmit) btnSubmit.style.display = isStreaming ? 'none' : 'inline-flex';
    if (btnCancel) btnCancel.style.display = isStreaming ? 'inline-flex' : 'none';
  }

  appendMessage(role, content, isStreaming = false) {
    const list = document.getElementById('ai-drawer-messages');
    if (!list) return null;

    const row = document.createElement('div');
    row.className = `ai-message ai-message-${role}`;

    const bubble = document.createElement('div');
    bubble.className = 'ai-bubble';
    if (isStreaming) {
      bubble.classList.add('streaming-pulse');
      bubble.innerHTML = '<span class="typing-indicator">Menyusun elemen diagram...</span>';
    } else {
      bubble.textContent = content;
    }

    row.appendChild(bubble);
    list.appendChild(row);
    this.scrollMessagesToBottom();
    return bubble;
  }

  formatStreamingText(text) {
    if (!text) return '<span class="typing-indicator">Menyusun elemen diagram...</span>';
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    const lastLine = lines[lines.length - 1] || '';
    return `<div class="streaming-text-preview"><code>${this.escapeHtml(lastLine.slice(0, 80))}</code></div>`;
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  scrollMessagesToBottom() {
    const list = document.getElementById('ai-drawer-messages');
    if (list) {
      list.scrollTop = list.scrollHeight;
    }
  }

  /**
   * Melepas komponen dan membersihkan resource
   */
  unmount() {
    if (this.bridge) {
      this.bridge.destroy();
      this.bridge = null;
    }
    this.cancelStreaming();
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
