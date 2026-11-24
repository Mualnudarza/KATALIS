/* ==========================================================================
   KATALIS - Draw.io Studio Workspace Controller
   Standard: Standalone Manual Draw.io Workspace (Phase 1)
   ========================================================================== */

import { DrawioProtocolBridge, DRAWIO_EMBED_URL } from './drawioProtocol.js';
import { BLANK_DRAWIO_XML } from './xmlValidator.js';

export class DrawioWorkspace {
  constructor(options = {}) {
    this.options = options;
    this.container = null;
    this.bridge = null;
    this.currentDiagramXml = BLANK_DRAWIO_XML;
  }

  mount(container) {
    this.container = container;
    this.renderLayout();
    this.initIframe();
    this.attachEventListeners();
  }

  renderLayout() {
    this.container.innerHTML = `
      <div class="drawio-studio-root">
        <header class="drawio-topbar">
          <div class="drawio-topbar-left">
            <button id="btn-drawio-back-hub" class="vng-btn-icon" title="Kembali ke Portal Hub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div class="drawio-brand-info">
              <h2 class="drawio-title">Draw.io Studio</h2>
              <span class="drawio-mode-tag">Editor Diagram</span>
            </div>
          </div>
          <div class="drawio-topbar-right">
            <button id="btn-drawio-reset-canvas" class="vng-btn vng-btn-secondary" title="Bersihkan Kanvas">
              Kanvas Baru
            </button>
          </div>
        </header>
        <div class="drawio-workspace-body">
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
              title="Editor diagram Draw.io"
            ></iframe>
          </main>
        </div>
      </div>
    `;
  }

  initIframe() {
    const iframe = document.getElementById('drawio-embedded-iframe');
    const overlay = document.getElementById('drawio-loading-overlay');

    this.bridge = new DrawioProtocolBridge(iframe, {
      initialXml: this.currentDiagramXml,
      onReady: () => {
        if (overlay) overlay.style.display = 'none';
      },
      onSave: (xml) => {
        this.currentDiagramXml = xml;
      }
    });

    // Keep a failed or slow embed from leaving the loading overlay indefinitely.
    setTimeout(() => {
      if (overlay && overlay.style.display !== 'none') overlay.style.display = 'none';
    }, 10000);
  }

  attachEventListeners() {
    const btnBackHub = document.getElementById('btn-drawio-back-hub');
    if (btnBackHub) {
      btnBackHub.addEventListener('click', () => {
        if (this.options.onNavigateHub) this.options.onNavigateHub();
      });
    }

    const btnResetCanvas = document.getElementById('btn-drawio-reset-canvas');
    if (btnResetCanvas) {
      btnResetCanvas.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin mengosongkan kanvas diagram?')) {
          this.currentDiagramXml = BLANK_DRAWIO_XML;
          if (this.bridge) this.bridge.loadDiagram(BLANK_DRAWIO_XML);
        }
      });
    }
  }

  unmount() {
    if (this.bridge) {
      this.bridge.destroy();
      this.bridge = null;
    }
    if (this.container) this.container.innerHTML = '';
  }
}
