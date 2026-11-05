/* ==========================================================================
   KATALIS - Main Application Engine
   Kumpulan Alat, Template, Analisis, dan Instrumen Sistematis
   Modeler BPMN 2.0 + Token Simulation + Vengeance UI + Portal Hub
   Author: DARWANZA / PEREKAYASA
   ========================================================================== */

import BpmnModeler from 'bpmn-js/lib/Modeler';
import TokenSimulationModule from '../lib';
import AddExporter from '@bpmn-io/add-exporter';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule
} from 'bpmn-js-properties-panel';
import 'bpmn-js-color-picker/colors/color-picker.css';
import KatalisColorPickerModule from './color-picker';
import KatalisPropertiesExtensionModule from './properties-panel';
import customTranslate from './i18n/customTranslate';
import katalisModdle from './moddle/katalisModdle.json';
import fileDrop from 'file-drops';
import fileOpen from 'file-open';
import download from 'downloadjs';

import {
  SAMPLE_SIMULATION_BPMN,
  CLOSING_CUSTOMER_BPMN,
  BLANK_BPMN
} from './templates/templates';

import {
  initSupabase,
  saveDiagram,
  listDiagrams,
  saveSupabaseConfig,
  getSupabaseConfig
} from './supabase';

import { DrawioWorkspace } from './tools/drawio/drawioWorkspace';
import { AiGateModal } from './tools/drawio/aiGateModal';

// State global aplikasi
let currentFileName = 'katalis-diagram.bpmn';
let isSimulationActive = false;
let currentView = 'hub'; // 'hub', 'workspace', atau 'drawio'
let drawioWorkspaceInstance = null;

// URL parameters
const url = new URL(window.location.href);
const autoSimulate = url.searchParams.has('sim') || url.searchParams.has('e');
const directTool = url.searchParams.get('tool') === 'bpmn' || autoSimulate;
const directDrawio = url.searchParams.get('tool') === 'drawio';

// Inisialisasi Modeler BPMN
const modeler = new BpmnModeler({
  container: '#canvas',
  additionalModules: [
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    KatalisPropertiesExtensionModule,
    KatalisColorPickerModule,
    TokenSimulationModule,
    AddExporter,
    {
      translate: [ 'value', customTranslate ]
    }
  ],
  moddleExtensions: {
    katalis: katalisModdle
  },
  propertiesPanel: {
    parent: '#properties-panel'
  },
  exporter: {
    name: 'KATALIS (Kumpulan Alat, Template, Analisis, dan Instrumen Sistematis)',
    version: process.env.KATALIS_VERSION || '1.0.0'
  }
});

// Dynamic Canvas Grid Synchronizer (Membuat background grid bergerak dan berskala dinamis mengikuti viewbox)
export function updateDynamicGrid(viewbox) {
  const container = document.querySelector('.canvas-container');
  if (!container) return;

  if (!viewbox) {
    try {
      viewbox = modeler.get('canvas').viewbox();
    } catch (e) {
      return;
    }
  }

  if (!viewbox || typeof viewbox.scale !== 'number') return;

  const baseSize = 20;
  const size = Math.round(baseSize * viewbox.scale * 100) / 100;
  const posX = Math.round(-viewbox.x * viewbox.scale * 100) / 100;
  const posY = Math.round(-viewbox.y * viewbox.scale * 100) / 100;

  container.style.backgroundSize = `${size}px ${size}px`;
  container.style.backgroundPosition = `${posX}px ${posY}px`;
}

// Helper: Konversi SVG string ke berkas gambar raster PNG resolusi tinggi (2x Retina)
export function exportDiagramAsPng(svgString, fileName) {
  return new Promise((resolve, reject) => {
    try {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
      const svgElement = svgDoc.documentElement;

      // Ambil dimensi dari viewBox atau atribut width & height
      let width = parseFloat(svgElement.getAttribute('width'));
      let height = parseFloat(svgElement.getAttribute('height'));
      const viewBox = svgElement.getAttribute('viewBox');

      if (viewBox) {
        const parts = viewBox.trim().split(/\s+/).map(Number);
        if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
          width = parts[2];
          height = parts[3];
        }
      }

      if (!width || !height || isNaN(width) || isNaN(height)) {
        width = 1200;
        height = 800;
      }

      // Pastikan atribut width dan height terpasang pada SVG root
      svgElement.setAttribute('width', width);
      svgElement.setAttribute('height', height);

      const serializedSvg = new XMLSerializer().serializeToString(svgDoc);
      const svgBlob = new Blob([serializedSvg], { type: 'image/svg+xml;charset=utf-8' });
      const blobUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        // Skala 2x untuk menghasilkan resolusi tajam bebas buram
        const scale = 2;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(blobUrl);
          reject(new Error('Gagal menginisialisasi 2D canvas context'));
          return;
        }

        // Beri latar belakang putih bersih agar diagram terbaca di dokumen/slide
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Render gambar SVG ke canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(blobUrl);

        canvas.toBlob((blob) => {
          if (blob) {
            download(blob, fileName, 'image/png');
            resolve();
          } else {
            reject(new Error('Gagal menghasilkan Blob PNG dari canvas'));
          }
        }, 'image/png');
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(blobUrl);
        reject(new Error('Gagal memuat elemen gambar SVG: ' + err));
      };

      img.src = blobUrl;
    } catch (err) {
      reject(err);
    }
  });
}

// Helper: Buka diagram XML
export function openDiagram(xmlString) {
  return modeler.importXML(xmlString)
    .then(({ warnings }) => {
      if (warnings && warnings.length) {
        console.warn('Peringatan impor BPMN:', warnings);
      }
      try {
        localStorage.setItem('katalis-diagram-xml', xmlString);
      } catch (e) {
        // Abaikan jika storage penuh
      }
      setTimeout(() => {
        try {
          modeler.get('canvas').zoom('fit-viewport');
          updateDynamicGrid();
        } catch (e) {}
      }, 50);
    })
    .catch(err => {
      console.error('Gagal memuat XML BPMN:', err);
      alert('Gagal memuat diagram BPMN: ' + err.message);
    });
}

// Inisialisasi Event Bus & Token Simulation
const eventBus = modeler.get('eventBus');

// Listener: Sinkronisasi dynamic grid saat viewbox canvas digeser (pan) atau dizoom
eventBus.on('canvas.viewbox.changed', (event) => {
  updateDynamicGrid(event.viewbox);
});

eventBus.on('tokenSimulation.toggleMode', (event) => {
  isSimulationActive = event.active;
  const toggleBtn = document.getElementById('btn-toggle-sim');
  const simIndicator = document.getElementById('sim-status-indicator');

  if (toggleBtn) {
    toggleBtn.classList.toggle('active', isSimulationActive);
  }
  if (simIndicator) {
    simIndicator.classList.toggle('live', isSimulationActive);
  }
});

// Fungsi Buka Modal Ephemeral AI Gate
export function openAiGateModal() {
  const modal = new AiGateModal({
    onSuccess: (mode) => {
      switchView('drawio', mode);
    },
    onSkip: (mode) => {
      switchView('drawio', mode);
    }
  });
  modal.open();
}

// Fungsi Switch View (Hub <--> BPMN Workspace <--> Draw.io Studio)
export function switchView(targetView, initialMode = 'pure-zero') {
  currentView = targetView;
  const viewHub = document.getElementById('view-hub');
  const viewWorkspace = document.getElementById('view-tool-workspace');
  const viewDrawio = document.getElementById('view-drawio-workspace');

  if (targetView === 'workspace' || targetView === 'bpmn') {
    if (viewHub) viewHub.classList.remove('active');
    if (viewDrawio) viewDrawio.classList.remove('active');
    if (viewWorkspace) viewWorkspace.classList.add('active');

    // Sesuaikan zoom canvas dan grid saat workspace dibuka
    setTimeout(() => {
      try {
        modeler.get('canvas').zoom('fit-viewport');
        updateDynamicGrid();
      } catch (e) {}
    }, 100);
  } else if (targetView === 'drawio') {
    if (viewHub) viewHub.classList.remove('active');
    if (viewWorkspace) viewWorkspace.classList.remove('active');
    if (viewDrawio) {
      viewDrawio.classList.add('active');
      if (!drawioWorkspaceInstance) {
        drawioWorkspaceInstance = new DrawioWorkspace({
          onNavigateHub: () => switchView('hub'),
          onRequestAiGate: () => openAiGateModal()
        });
        drawioWorkspaceInstance.mount(viewDrawio, initialMode);
      } else {
        drawioWorkspaceInstance.setMode(initialMode);
      }
    }
  } else {
    if (viewWorkspace) viewWorkspace.classList.remove('active');
    if (viewDrawio) viewDrawio.classList.remove('active');
    if (viewHub) viewHub.classList.add('active');
  }
}

// Muat diagram awal
const savedDiagram = localStorage.getItem('katalis-diagram-xml');
const initialXml = savedDiagram || SAMPLE_SIMULATION_BPMN;

openDiagram(initialXml).then(() => {
  if (autoSimulate) {
    try {
      const toggleMode = modeler.get('toggleMode');
      if (toggleMode) {
        toggleMode.toggleMode(true);
      }
    } catch (e) {
      console.debug('Autosimulate toggle error:', e);
    }
  }
});

// Setup File Drag and Drop
function handleDroppedFiles(files) {
  if (!files || !files.length) return;
  currentFileName = files[0].name;
  openDiagram(files[0].contents);
  switchView('workspace');
}

document.body.addEventListener('dragover', fileDrop('Buka diagram BPMN di KATALIS', handleDroppedFiles), false);

// Setup Handler Aksi Vengeance UI & Navigasi
document.addEventListener('DOMContentLoaded', () => {
  initSupabase();

  // 1. Tentukan Tampilan Awal (Default: Portal Hub, kecuali parameter direct)
  if (directDrawio) {
    openAiGateModal();
  } else if (directTool) {
    switchView('workspace');
  } else {
    switchView('hub');
  }

  // 2. Navigasi Router Hub <--> BPMN Workspace <--> Draw.io Studio
  const btnEnterBpmn = document.getElementById('btn-enter-bpmn');
  const btnEnterDrawio = document.getElementById('btn-enter-drawio');
  const btnBackHub = document.getElementById('btn-back-hub');
  const drawerNavHub = document.getElementById('drawer-nav-hub');
  const workspaceBrandHome = document.getElementById('workspace-brand-home');
  const drawerNavBpmn = document.getElementById('drawer-nav-bpmn');
  const drawerNavDrawio = document.getElementById('drawer-nav-drawio');

  if (btnEnterBpmn) {
    btnEnterBpmn.addEventListener('click', () => switchView('workspace'));
  }
  if (btnEnterDrawio) {
    btnEnterDrawio.addEventListener('click', () => openAiGateModal());
  }
  if (btnBackHub) {
    btnBackHub.addEventListener('click', () => switchView('hub'));
  }
  if (drawerNavHub) {
    drawerNavHub.addEventListener('click', () => switchView('hub'));
  }
  if (workspaceBrandHome) {
    workspaceBrandHome.addEventListener('click', () => switchView('hub'));
  }
  if (drawerNavBpmn) {
    drawerNavBpmn.addEventListener('click', () => switchView('workspace'));
  }
  if (drawerNavDrawio) {
    drawerNavDrawio.addEventListener('click', () => openAiGateModal());
  }

  // 3. Sidebar Drawer Toggle
  const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
  const btnCloseSidebar = document.getElementById('btn-close-sidebar');
  const sidebarDrawer = document.getElementById('sidebar-drawer');

  if (btnToggleSidebar && sidebarDrawer) {
    btnToggleSidebar.addEventListener('click', () => {
      sidebarDrawer.classList.toggle('collapsed');
      btnToggleSidebar.classList.toggle('vng-btn-active', !sidebarDrawer.classList.contains('collapsed'));
    });
  }

  if (btnCloseSidebar && sidebarDrawer) {
    btnCloseSidebar.addEventListener('click', () => {
      sidebarDrawer.classList.add('collapsed');
      if (btnToggleSidebar) btnToggleSidebar.classList.remove('vng-btn-active');
    });
  }

  // 4. Tombol Simulasi Token
  const btnToggleSim = document.getElementById('btn-toggle-sim');
  const btnResetSim = document.getElementById('btn-reset-sim');

  if (btnToggleSim) {
    btnToggleSim.addEventListener('click', () => {
      const toggleMode = modeler.get('toggleMode');
      if (toggleMode) {
        toggleMode.toggleMode();
      }
    });
  }

  if (btnResetSim) {
    btnResetSim.addEventListener('click', () => {
      const resetSim = modeler.get('resetSimulation');
      if (resetSim) {
        resetSim.resetSimulation();
      }
    });
  }

  // 5. Tombol Download & Export
  const btnDownloadBpmn = document.getElementById('btn-download-bpmn');
  const btnExportSvg = document.getElementById('btn-export-svg');
  const btnOpenFile = document.getElementById('btn-open-file');

  if (btnDownloadBpmn) {
    btnDownloadBpmn.addEventListener('click', () => {
      modeler.saveXML({ format: true }).then(({ xml }) => {
        download(xml, currentFileName, 'application/xml');
      });
    });
  }

  if (btnExportSvg) {
    btnExportSvg.addEventListener('click', () => {
      modeler.saveSVG().then(({ svg }) => {
        const svgFileName = currentFileName.replace(/\.bpmn$/, '') + '.svg';
        download(svg, svgFileName, 'image/svg+xml');
      });
    });
  }

  const btnExportPng = document.getElementById('btn-export-png');
  if (btnExportPng) {
    btnExportPng.addEventListener('click', () => {
      modeler.saveSVG().then(({ svg }) => {
        const pngFileName = currentFileName.replace(/\.bpmn$/, '') + '.png';
        exportDiagramAsPng(svg, pngFileName).catch(err => {
          console.error('Gagal ekspor PNG:', err);
          alert('Gagal mengekspor diagram ke format PNG: ' + err.message);
        });
      });
    });
  }

  if (btnOpenFile) {
    btnOpenFile.addEventListener('click', () => {
      fileOpen().then(handleDroppedFiles);
    });
  }

  // 6. Properties Panel Toggle
  const btnToggleProps = document.getElementById('btn-toggle-props');
  const propsContainer = document.querySelector('.properties-panel-container');

  if (btnToggleProps && propsContainer) {
    btnToggleProps.addEventListener('click', () => {
      propsContainer.classList.toggle('collapsed');
      btnToggleProps.classList.toggle('active', !propsContainer.classList.contains('collapsed'));
    });
  }

  // 7. Modal Templates
  const modalTemplates = document.getElementById('modal-templates');
  const btnOpenTemplates = document.getElementById('btn-templates');
  const btnCloseTemplates = document.getElementById('btn-close-templates');

  if (btnOpenTemplates && modalTemplates) {
    btnOpenTemplates.addEventListener('click', () => {
      modalTemplates.classList.add('open');
    });
  }

  if (btnCloseTemplates && modalTemplates) {
    btnCloseTemplates.addEventListener('click', () => {
      modalTemplates.classList.remove('open');
    });
  }

  // Klik Template Card
  document.querySelectorAll('[data-template]').forEach(card => {
    card.addEventListener('click', () => {
      const tplKey = card.getAttribute('data-template');
      let targetXml = SAMPLE_SIMULATION_BPMN;
      if (tplKey === 'closing') {
        targetXml = CLOSING_CUSTOMER_BPMN;
        currentFileName = 'katalis-closing-customer.bpmn';
      } else if (tplKey === 'blank') {
        targetXml = BLANK_BPMN;
        currentFileName = 'katalis-baru.bpmn';
      } else {
        targetXml = SAMPLE_SIMULATION_BPMN;
        currentFileName = 'katalis-simulasi.bpmn';
      }
      openDiagram(targetXml);
      if (modalTemplates) {
        modalTemplates.classList.remove('open');
      }
    });
  });

  // 8. Modal Supabase Cloud Sync (Opsional)
  const modalCloud = document.getElementById('modal-cloud');
  const btnOpenCloud = document.getElementById('btn-cloud-sync');
  const btnCloseCloud = document.getElementById('btn-close-cloud');
  const btnSaveCloud = document.getElementById('btn-save-cloud');
  const inputSupabaseKey = document.getElementById('input-supabase-key');
  const inputDiagramTitle = document.getElementById('input-diagram-title');
  const syncStatusText = document.getElementById('sync-status-text');

  if (btnOpenCloud && modalCloud) {
    btnOpenCloud.addEventListener('click', () => {
      const cfg = getSupabaseConfig();
      if (inputSupabaseKey) inputSupabaseKey.value = cfg.anonKey || '';
      modalCloud.classList.add('open');
    });
  }

  if (btnCloseCloud && modalCloud) {
    btnCloseCloud.addEventListener('click', () => {
      modalCloud.classList.remove('open');
    });
  }

  if (btnSaveCloud) {
    btnSaveCloud.addEventListener('click', async () => {
      const anonKey = inputSupabaseKey ? inputSupabaseKey.value.trim() : '';
      const title = inputDiagramTitle ? inputDiagramTitle.value.trim() : 'Diagram KATALIS';
      if (anonKey) {
        saveSupabaseConfig(null, anonKey);
      }
      if (syncStatusText) syncStatusText.textContent = 'Menyimpan...';

      const { xml } = await modeler.saveXML({ format: true });
      const res = await saveDiagram({
        title,
        description: 'Disimpan dari platform KATALIS',
        xml
      });

      if (syncStatusText) {
        syncStatusText.textContent = res.message;
      }
    });
  }

  // 9. Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyS' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (btnDownloadBpmn) btnDownloadBpmn.click();
    }
    if (e.code === 'KeyO' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (btnOpenFile) btnOpenFile.click();
    }
    if (e.code === 'Escape') {
      if (modalAttachmentPreview && modalAttachmentPreview.classList.contains('open')) {
        modalPreviewIframe.src = 'about:blank';
        modalAttachmentPreview.classList.remove('open');
      }
      if (modalCustomColor && modalCustomColor.classList.contains('open')) {
        closeCustomColorModal();
      }
    }
  });

  // 10. Modal Pratinjau Dokumen Lampiran (In-App Preview Iframe)
  const modalAttachmentPreview = document.getElementById('modal-attachment-preview');
  const btnClosePreview = document.getElementById('btn-close-preview');
  const btnPreviewExternal = document.getElementById('btn-preview-external');
  const modalPreviewIframe = document.getElementById('modal-preview-iframe');
  const modalPreviewLoading = document.getElementById('modal-preview-loading');
  const previewDocTitle = document.getElementById('modal-preview-title');
  const previewDocBadge = document.getElementById('modal-preview-url-badge');

  function normalizePreviewUrl(rawUrl) {
    if (!rawUrl) return '';
    let urlStr = rawUrl.trim();

    // Normalisasi preview dokumen Google Docs / Sheets / Slides / Drive
    if (urlStr.includes('docs.google.com/document/d/')) {
      urlStr = urlStr.replace(/\/edit(\?.*)?$/, '/preview');
      if (!urlStr.includes('/preview')) urlStr = urlStr.replace(/\/?$/, '/preview');
    } else if (urlStr.includes('docs.google.com/spreadsheets/d/')) {
      urlStr = urlStr.replace(/\/edit(\?.*)?$/, '/preview');
      if (!urlStr.includes('/preview')) urlStr = urlStr.replace(/\/?$/, '/preview');
    } else if (urlStr.includes('docs.google.com/presentation/d/')) {
      urlStr = urlStr.replace(/\/edit(\?.*)?$/, '/preview');
      if (!urlStr.includes('/preview')) urlStr = urlStr.replace(/\/?$/, '/preview');
    } else if (urlStr.includes('drive.google.com/file/d/')) {
      urlStr = urlStr.replace(/\/view(\?.*)?$/, '/preview');
      if (!urlStr.includes('/preview')) urlStr = urlStr.replace(/\/?$/, '/preview');
    }

    return urlStr;
  }

  window.openKatalisAttachmentPreview = function(rawUrl, docName) {
    if (!modalAttachmentPreview || !modalPreviewIframe) return;

    const normalizedUrl = normalizePreviewUrl(rawUrl);

    if (previewDocTitle) {
      previewDocTitle.textContent = docName || 'Pratinjau Dokumen Lampiran';
    }

    if (previewDocBadge) {
      let hostname = '';
      try {
        hostname = new URL(rawUrl).hostname;
      } catch (e) {
        hostname = 'Lampiran Eksternal';
      }
      previewDocBadge.textContent = hostname;
    }

    if (btnPreviewExternal) {
      btnPreviewExternal.href = rawUrl;
    }

    if (modalPreviewLoading) {
      modalPreviewLoading.style.display = 'flex';
    }

    modalPreviewIframe.src = normalizedUrl;

    modalPreviewIframe.onload = () => {
      if (modalPreviewLoading) {
        modalPreviewLoading.style.display = 'none';
      }
    };

    modalAttachmentPreview.classList.add('open');
  };

  if (btnClosePreview && modalAttachmentPreview && modalPreviewIframe) {
    btnClosePreview.addEventListener('click', () => {
      modalPreviewIframe.src = 'about:blank';
      modalAttachmentPreview.classList.remove('open');
    });
  }

  if (modalAttachmentPreview && modalPreviewIframe) {
    modalAttachmentPreview.addEventListener('click', (e) => {
      if (e.target === modalAttachmentPreview) {
        modalPreviewIframe.src = 'about:blank';
        modalAttachmentPreview.classList.remove('open');
      }
    });
  }

  // 11. Modal Pewarnaan Notasi Bebas (Custom Spectrum Color Picker)
  const modalCustomColor = document.getElementById('modal-custom-color');
  const btnCloseColorModal = document.getElementById('btn-close-custom-color');
  const btnCancelCustomColor = document.getElementById('btn-cancel-custom-color');
  const btnApplyCustomColor = document.getElementById('btn-apply-custom-color');
  const btnResetColorDefault = document.getElementById('btn-reset-color-default');
  const customColorPreviewBox = document.getElementById('custom-color-preview-box');
  const inputCustomFill = document.getElementById('input-custom-fill');
  const inputCustomFillHex = document.getElementById('input-custom-fill-hex');
  const inputCustomStroke = document.getElementById('input-custom-stroke');
  const inputCustomStrokeHex = document.getElementById('input-custom-stroke-hex');
  const btnAutoContrastStroke = document.getElementById('btn-auto-contrast-stroke');

  let activeColorElements = null;

  function getDarkerStrokeFromHex(hex) {
    if (!hex || hex[0] !== '#' || hex.length !== 7) return '#0f172a';
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    r = Math.max(0, Math.floor(r * 0.4));
    g = Math.max(0, Math.floor(g * 0.4));
    b = Math.max(0, Math.floor(b * 0.4));

    const toHex = (n) => n.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function updateColorPreview() {
    const fill = inputCustomFillHex ? inputCustomFillHex.value.trim() : '#ffffff';
    const stroke = inputCustomStrokeHex ? inputCustomStrokeHex.value.trim() : '#0f172a';

    if (customColorPreviewBox) {
      customColorPreviewBox.style.backgroundColor = fill;
      customColorPreviewBox.style.borderColor = stroke;
    }
  }

  function setCustomColorValues(fill, stroke) {
    if (inputCustomFill) inputCustomFill.value = fill || '#ffffff';
    if (inputCustomFillHex) inputCustomFillHex.value = fill || '#ffffff';
    if (inputCustomStroke) inputCustomStroke.value = stroke || '#0f172a';
    if (inputCustomStrokeHex) inputCustomStrokeHex.value = stroke || '#0f172a';
    updateColorPreview();
  }

  window.openKatalisCustomColorModal = function(elements) {
    if (!modalCustomColor) return;
    activeColorElements = elements;

    const target = Array.isArray(elements) ? elements[0] : elements;
    const di = target && target.di;

    const currentFill = (di && di.get('bioc:fill')) || '#ffffff';
    const currentStroke = (di && di.get('bioc:stroke')) || '#0f172a';

    setCustomColorValues(currentFill, currentStroke);
    modalCustomColor.classList.add('open');
  };

  function closeCustomColorModal() {
    if (modalCustomColor) {
      modalCustomColor.classList.remove('open');
    }
    activeColorElements = null;
  }

  if (btnCloseColorModal) btnCloseColorModal.addEventListener('click', closeCustomColorModal);
  if (btnCancelCustomColor) btnCancelCustomColor.addEventListener('click', closeCustomColorModal);

  if (modalCustomColor) {
    modalCustomColor.addEventListener('click', (e) => {
      if (e.target === modalCustomColor) {
        closeCustomColorModal();
      }
    });
  }

  if (inputCustomFill && inputCustomFillHex) {
    inputCustomFill.addEventListener('input', (e) => {
      inputCustomFillHex.value = e.target.value;
      updateColorPreview();
    });
    inputCustomFillHex.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
        inputCustomFill.value = val;
      }
      updateColorPreview();
    });
  }

  if (inputCustomStroke && inputCustomStrokeHex) {
    inputCustomStroke.addEventListener('input', (e) => {
      inputCustomStrokeHex.value = e.target.value;
      updateColorPreview();
    });
    inputCustomStrokeHex.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
        inputCustomStroke.value = val;
      }
      updateColorPreview();
    });
  }

  if (btnAutoContrastStroke) {
    btnAutoContrastStroke.addEventListener('click', () => {
      const fillHex = inputCustomFillHex ? inputCustomFillHex.value.trim() : '#ffffff';
      const autoStroke = getDarkerStrokeFromHex(fillHex);
      if (inputCustomStroke) inputCustomStroke.value = autoStroke;
      if (inputCustomStrokeHex) inputCustomStrokeHex.value = autoStroke;
      updateColorPreview();
    });
  }

  // Quick Swatches
  document.querySelectorAll('.vng-color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      const fill = swatch.getAttribute('data-fill');
      const stroke = swatch.getAttribute('data-stroke');
      if (fill && stroke) {
        setCustomColorValues(fill, stroke);
      }
    });
  });

  // Reset to default
  if (btnResetColorDefault) {
    btnResetColorDefault.addEventListener('click', () => {
      if (activeColorElements && activeColorElements.length) {
        const modeling = modeler.get('modeling');
        modeling.setColor(activeColorElements, { fill: undefined, stroke: undefined });
      }
      closeCustomColorModal();
    });
  }

  // Apply custom color
  if (btnApplyCustomColor) {
    btnApplyCustomColor.addEventListener('click', () => {
      if (activeColorElements && activeColorElements.length) {
        const fill = inputCustomFillHex ? inputCustomFillHex.value.trim() : undefined;
        const stroke = inputCustomStrokeHex ? inputCustomStrokeHex.value.trim() : undefined;
        const modeling = modeler.get('modeling');
        modeling.setColor(activeColorElements, { fill, stroke });
      }
      closeCustomColorModal();
    });
  }
});
