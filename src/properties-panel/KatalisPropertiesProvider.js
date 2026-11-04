/* ==========================================================================
   KATALIS - Custom Properties Provider (Grup Deskripsi & Lampiran)
   Author: DARWANZA / PEREKAYASA
   ========================================================================== */

import { html } from 'htm/preact';
import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';

const LOW_PRIORITY = 500;

function AttachmentName(props) {
  const { element, id } = props;
  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    return element.businessObject.get('katalis:attachmentName') || '';
  };

  const setValue = (value) => {
    modeling.updateProperties(element, {
      'katalis:attachmentName': value || undefined
    });
  };

  return html`<${TextFieldEntry}
    id=${id}
    element=${element}
    label=${translate('Nama Lampiran / Dokumen')}
    description=${translate('Contoh: Template Laporan, SOP, atau Panduan')}
    placeholder="Template Dokumen Acuan"
    getValue=${getValue}
    setValue=${setValue}
    debounce=${debounce}
  />`;
}

function AttachmentUrl(props) {
  const { element, id } = props;
  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    return element.businessObject.get('katalis:attachmentUrl') || '';
  };

  const setValue = (value) => {
    modeling.updateProperties(element, {
      'katalis:attachmentUrl': value || undefined
    });
  };

  return html`<${TextFieldEntry}
    id=${id}
    element=${element}
    label=${translate('Tautan Dokumen (URL)')}
    description=${translate('Tautan web, Google Docs/Sheets, PDF, dsb')}
    placeholder="https://..."
    getValue=${getValue}
    setValue=${setValue}
    debounce=${debounce}
  />`;
}

function AttachmentPreviewButton(props) {
  const { element } = props;

  const handleClick = (e) => {
    e.preventDefault();
    const bo = element.businessObject;
    const url = bo.get('katalis:attachmentUrl');
    const name = bo.get('katalis:attachmentName') || bo.name || 'Dokumen Lampiran';

    if (!url || !url.trim()) {
      alert('Tautan dokumen belum diisi. Silakan isi Tautan Dokumen (URL) terlebih dahulu.');
      return;
    }

    if (typeof window.openKatalisAttachmentPreview === 'function') {
      window.openKatalisAttachmentPreview(url.trim(), name);
    }
  };

  return html`
    <div class="bio-properties-panel-entry" data-entry-id="katalis-btn-preview-entry" style="margin-top: 10px; margin-bottom: 6px;">
      <button
        type="button"
        class="vng-btn vng-btn-primary vng-btn-sm"
        style="width: 100%; justify-content: center; gap: 8px; padding: 8px 12px; font-size: 12px; font-weight: 600;"
        onClick=${handleClick}
        title="Buka pratinjau dokumen di dalam modal pop-up KATALIS"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        Buka Pratinjau Dokumen
      </button>
    </div>
  `;
}

function createAttachmentGroup(element, translate) {
  return {
    id: 'katalis-lampiran-group',
    label: translate('Lampiran'),
    entries: [
      {
        id: 'katalis-attachment-name',
        element,
        component: AttachmentName,
        isEdited: isTextFieldEntryEdited
      },
      {
        id: 'katalis-attachment-url',
        element,
        component: AttachmentUrl,
        isEdited: isTextFieldEntryEdited
      },
      {
        id: 'katalis-attachment-preview-btn',
        element,
        component: AttachmentPreviewButton,
        isEdited: () => false
      }
    ]
  };
}

export default function KatalisPropertiesProvider(propertiesPanel, translate) {
  this.getGroups = function(element) {
    return function(groups) {
      // 1. Ganti label Documentation menjadi Deskripsi
      const docGroup = groups.find(g => g.id === 'documentation');
      if (docGroup) {
        docGroup.label = translate('Deskripsi');
      }

      // 2. Tambahkan grup Lampiran tepat di bawah grup Deskripsi
      const attachmentGroup = createAttachmentGroup(element, translate);

      const docIdx = groups.findIndex(g => g.id === 'documentation');
      if (docIdx !== -1) {
        groups.splice(docIdx + 1, 0, attachmentGroup);
      } else {
        // Fallback jika grup dokumentasi tidak ada, letakkan setelah general atau di akhir
        const generalIdx = groups.findIndex(g => g.id === 'general');
        if (generalIdx !== -1) {
          groups.splice(generalIdx + 1, 0, attachmentGroup);
        } else {
          groups.push(attachmentGroup);
        }
      }

      return groups;
    };
  };

  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

KatalisPropertiesProvider.$inject = ['propertiesPanel', 'translate'];
