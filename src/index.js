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
let currentView = 'hub'; // 'hub' atau 'workspace'

// URL parameters
const url = new URL(window.location.href);
const autoSimulate = url.searchParams.has('sim') || url.searchParams.has('e');
const directTool = url.searchParams.get('tool') === 'bpmn' || autoSimulate;

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
      setTimeout(() => {
        try {
          modeler.get('canvas').zoom('fit-viewport');
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

// Fungsi Switch View (Hub <--> Tool Workspace)
export function switchView(targetView) {
  currentView = targetView;
  const viewHub = document.getElementById('view-hub');
  const viewWorkspace = document.getElementById('view-tool-workspace');

  if (targetView === 'workspace') {
    if (viewHub) viewHub.classList.remove('active');
    if (viewWorkspace) viewWorkspace.classList.add('active');

    // Sesuaikan zoom canvas saat view dibuka
    setTimeout(() => {
      try {
        modeler.get('canvas').zoom('fit-viewport');
      } catch (e) {}
    }, 100);
  } else {
    if (viewWorkspace) viewWorkspace.classList.remove('active');
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
  if (directTool) {
    switchView('workspace');
  } else {
    switchView('hub');
  }

  // 2. Navigasi Router Hub <--> Workspace
  const btnEnterBpmn = document.getElementById('btn-enter-bpmn');
  const btnQuickLaunchBpmn = document.getElementById('btn-quick-launch-bpmn');
  const btnBackHub = document.getElementById('btn-back-hub');
  const drawerNavHub = document.getElementById('drawer-nav-hub');
  const workspaceBrandHome = document.getElementById('workspace-brand-home');
  const drawerNavBpmn = document.getElementById('drawer-nav-bpmn');

  if (btnEnterBpmn) {
    btnEnterBpmn.addEventListener('click', () => switchView('workspace'));
  }
  if (btnQuickLaunchBpmn) {
    btnQuickLaunchBpmn.addEventListener('click', () => switchView('workspace'));
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
  });
});
