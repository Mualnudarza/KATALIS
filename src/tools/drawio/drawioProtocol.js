/* ==========================================================================
   KATALIS - Draw.io Embedded postMessage Protocol Driver
   Author: DARWANZA / PEREKAYASA
   Standard: HTML5 postMessage W3C & embed.diagrams.net JSON Protocol
   ========================================================================== */

import { BLANK_DRAWIO_XML } from './xmlValidator.js';

export const DRAWIO_EMBED_URL = 'https://embed.diagrams.net/?embed=1&proto=json&configure=1&ui=min&libraries=1';

export class DrawioProtocolBridge {
  constructor(iframeElement, options = {}) {
    this.iframe = iframeElement;
    this.options = options;
    this.isReady = false;
    this.currentXml = options.initialXml || BLANK_DRAWIO_XML;
    this.messageHandler = this.handleWindowMessage.bind(this);
    this.pendingExports = new Map();

    window.addEventListener('message', this.messageHandler);
  }

  /**
   * Menangani seluruh pesan postMessage yang dikirimkan oleh iframe Draw.io
   */
  handleWindowMessage(event) {
    // Pastikan pesan berasal dari iframe Draw.io resmi
    if (!event.origin.includes('diagrams.net') && !event.origin.includes('draw.io')) {
      return;
    }

    let msg = null;
    try {
      msg = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
    } catch (e) {
      return;
    }

    if (!msg || !msg.event) return;

    switch (msg.event) {
      case 'init':
        this.isReady = true;
        this.sendAction('load', {
          xml: this.currentXml,
          autosave: 1
        });
        if (this.options.onReady) {
          this.options.onReady();
        }
        break;

      case 'configure':
        this.sendAction('configure', {
          config: {
            css: 'body { background-color: #F8FAFC !important; }',
            defaultVertexStyle: {
              rounded: '1',
              strokeColor: '#1d4ed8',
              fillColor: '#dbeafe',
              fontColor: '#0f172a'
            }
          }
        });
        break;

      case 'load':
        if (this.options.onLoad) {
          this.options.onLoad(msg);
        }
        break;

      case 'save':
      case 'autosave':
        if (msg.xml) {
          this.currentXml = msg.xml;
          if (this.options.onSave) {
            this.options.onSave(msg.xml);
          }
        }
        break;

      case 'export':
        if (msg.format && this.pendingExports.has(msg.format)) {
          const resolver = this.pendingExports.get(msg.format);
          this.pendingExports.delete(msg.format);
          resolver(msg.data);
        }
        if (this.options.onExport) {
          this.options.onExport(msg);
        }
        break;

      case 'exit':
        if (this.options.onExit) {
          this.options.onExit();
        }
        break;

      default:
        break;
    }
  }

  /**
   * Mengirim pesan action ke window iframe
   */
  sendAction(action, params = {}) {
    if (!this.iframe || !this.iframe.contentWindow) {
      console.warn('Iframe Draw.io belum siap menerima pesan.');
      return;
    }

    const payload = JSON.stringify({
      action,
      ...params
    });

    this.iframe.contentWindow.postMessage(payload, '*');
  }

  /**
   * Memuat diagram XML baru ke dalam kanvas Draw.io
   */
  loadDiagram(xmlString) {
    this.currentXml = xmlString;
    this.sendAction('load', {
      xml: xmlString,
      autosave: 1
    });
  }

  /**
   * Menggabungkan elemen baru ke diagram aktif tanpa menghapus elemen lama
   */
  mergeDiagram(xmlString) {
    this.sendAction('merge', {
      xml: xmlString
    });
  }

  /**
   * Meminta ekspor data diagram (format: xml, png, svg)
   */
  requestExport(format = 'xml') {
    return new Promise((resolve) => {
      this.pendingExports.set(format, resolve);
      this.sendAction('export', {
        format,
        xml: format === 'xml'
      });
      // Timeout pengaman 10 detik
      setTimeout(() => {
        if (this.pendingExports.has(format)) {
          this.pendingExports.delete(format);
          resolve(null);
        }
      }, 10000);
    });
  }

  /**
   * Mengambil XML diagram saat ini (meminta iframe jika siap, fallback ke cache)
   */
  async getCurrentXml() {
    const exported = await this.requestExport('xml');
    if (exported) {
      this.currentXml = exported;
    }
    return this.currentXml;
  }

  /**
   * Membersihkan event listener saat modul ditutup
   */
  destroy() {
    window.removeEventListener('message', this.messageHandler);
    this.pendingExports.clear();
    this.isReady = false;
  }
}
