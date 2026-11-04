/* ==========================================================================
   KATALIS - Color Popup Provider (BPMN in Color & Custom Spectrum)
   Author: DARWANZA / PEREKAYASA
   Standard: OMG BPMN in Color (bioc:stroke, bioc:fill)
   ========================================================================== */

const COLORS = [
  { label: 'Default', fill: undefined, stroke: undefined },
  { label: 'Biru', fill: '#DBEAFE', stroke: '#1D4ED8' },
  { label: 'Biru Muda', fill: '#E0F2FE', stroke: '#0284C7' },
  { label: 'Teal', fill: '#CCFBF1', stroke: '#0F766E' },
  { label: 'Hijau', fill: '#DCFCE7', stroke: '#15803D' },
  { label: 'Kuning', fill: '#FEF9C3', stroke: '#A16207' },
  { label: 'Oranye', fill: '#FFEDD5', stroke: '#C2410C' },
  { label: 'Merah', fill: '#FEE2E2', stroke: '#B91C1C' },
  { label: 'Ungu', fill: '#F3E8FF', stroke: '#7E22CE' },
  { label: 'Abu-abu', fill: '#F1F5F9', stroke: '#475569' }
];

export default function KatalisColorPopupProvider(config, bpmnRendererConfig, popupMenu, modeling, translate) {
  this._popupMenu = popupMenu;
  this._modeling = modeling;
  this._translate = translate;

  this._colors = (config && config.colors) || COLORS;
  this._defaultFillColor = (bpmnRendererConfig && bpmnRendererConfig.defaultFillColor) || '#ffffff';
  this._defaultStrokeColor = (bpmnRendererConfig && bpmnRendererConfig.defaultStrokeColor) || '#0f172a';

  this._popupMenu.registerProvider('color-picker', this);
}

KatalisColorPopupProvider.$inject = [
  'config.colorPicker',
  'config.bpmnRenderer',
  'popupMenu',
  'modeling',
  'translate'
];

KatalisColorPopupProvider.prototype.getEntries = function(elements) {
  const self = this;

  const colorIconHtml = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="100%" width="100%">
      <rect rx="3" x="1.5" y="1.5" width="22" height="22" fill="var(--fill-color)" stroke="var(--stroke-color)" style="stroke-width:2"></rect>
    </svg>
  `;

  // 1. Preset Warna Standar
  const entries = this._colors.map(function(color) {
    const entryColorIconHtml = colorIconHtml
      .replace('var(--fill-color)', color.fill || self._defaultFillColor)
      .replace('var(--stroke-color)', color.stroke || self._defaultStrokeColor);

    return {
      title: self._translate(color.label),
      id: color.label.toLowerCase().replace(/\s+/g, '-') + '-color',
      imageHtml: entryColorIconHtml,
      action: function() {
        self._modeling.setColor(elements, color);
      }
    };
  });

  // 2. Opsi Bebas: Warna Kustom Spectrum Penuh
  const customColorIconHtml = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="100%" width="100%">
      <defs>
        <linearGradient id="katalis-rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ef4444" />
          <stop offset="25%" stop-color="#f59e0b" />
          <stop offset="50%" stop-color="#10b981" />
          <stop offset="75%" stop-color="#3b82f6" />
          <stop offset="100%" stop-color="#8b5cf6" />
        </linearGradient>
      </defs>
      <rect rx="3" x="1.5" y="1.5" width="22" height="22" fill="url(#katalis-rainbow)" stroke="#0f172a" style="stroke-width:1.5"></rect>
    </svg>
  `;

  entries.push({
    title: self._translate('Warna Kustom (Bebas)...'),
    id: 'katalis-custom-color',
    imageHtml: customColorIconHtml,
    action: function() {
      if (typeof window.openKatalisCustomColorModal === 'function') {
        window.openKatalisCustomColorModal(elements);
      }
    }
  });

  return entries;
};
