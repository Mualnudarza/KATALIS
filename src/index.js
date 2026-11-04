/* ==========================================================================
   KATALIS - Main Application Engine
   Kumpulan Alat, Template, Analisis, dan Instrumen Sistematis
   Modeler BPMN 2.0 + Token Simulation + Vengeance UI + Supabase Cloud
   ========================================================================== */

import BpmnModeler from 'bpmn-js/lib/Modeler';
import TokenSimulationModule from '../lib';
import AddExporter from '@bpmn-io/add-exporter';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule
} from 'bpmn-js-properties-panel';
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

// State global aplikasi
let currentFileName = 'katalis-diagram.bpmn';
let isSimulationActive = false;

// URL parameters
const url = new URL(window.location.href);
const autoSimulate = url.searchParams.has('sim') || url.searchParams.has('e');

// Inisialisasi Modeler BPMN
const modeler = new BpmnModeler({
  container: '#canvas',
  additionalModules: [
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    TokenSimulationModule,
    AddExporter
  ],
  propertiesPanel: {
    parent: '#properties-panel'
  },
  exporter: {
    name: 'KATALIS (Kumpulan Alat, Template, Analisis, dan Instrumen Sistematis)',
    version: process.env.KATALIS_VERSION || '1.0.0'
  }
});

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
      modeler.get('canvas').zoom('fit-viewport');
    })
    .catch(err => {
      console.error('Gagal memuat XML BPMN:', err);
      alert('Gagal memuat diagram BPMN: ' + err.message);
    });
}

// Inisialisasi Event Bus & Token Simulation
const eventBus = modeler.get('eventBus');

eventBus.on('tokenSimulation.toggleMode', (event) => {
  isSimulationActive = event.active;
  const toggleBtn = document.getElementById('btn-toggle-sim');
  const playBtn = document.getElementById('btn-play-sim');
  const simIndicator = document.getElementById('sim-status-indicator');

  if (toggleBtn) {
    toggleBtn.classList.toggle('active', isSimulationActive);
  }
  if (simIndicator) {
    simIndicator.classList.toggle('live', isSimulationActive);
  }
  if (playBtn) {
    playBtn.disabled = !isSimulationActive;
  }
});

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
}

document.body.addEventListener('dragover', fileDrop('Buka diagram BPMN di KATALIS', handleDroppedFiles), false);

// Setup Handler Aksi Vengeance UI
document.addEventListener('DOMContentLoaded', () => {
  initSupabase();

  // 1. Tombol Simulasi
  const btnToggleSim = document.getElementById('btn-toggle-sim');
  const btnResetSim = document.getElementById('btn-reset-sim');
  const btnStepSim = document.getElementById('btn-step-sim');

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

  // 2. Tombol Download & Export
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

  if (btnOpenFile) {
    btnOpenFile.addEventListener('click', () => {
      fileOpen().then(handleDroppedFiles);
    });
  }

  // 3. Properties Panel Toggle
  const btnToggleProps = document.getElementById('btn-toggle-props');
  const propsContainer = document.querySelector('.properties-panel-container');

  if (btnToggleProps && propsContainer) {
    btnToggleProps.addEventListener('click', () => {
      propsContainer.classList.toggle('collapsed');
      btnToggleProps.classList.toggle('active', !propsContainer.classList.contains('collapsed'));
    });
  }

  // 4. Modal Templates
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
        currentFileName = 'katalis-simulasi.bpmn';
      }
      openDiagram(targetXml);
      if (modalTemplates) {
        modalTemplates.classList.remove('open');
      }
    });
  });

  // 5. Modal Supabase Cloud Sync
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

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyS' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (btnDownloadBpmn) btnDownloadBpmn.click();
    }
    if (e.code === 'KeyO' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (btnOpenFile) btnOpenFile.click();
    }
  });
});
