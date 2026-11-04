/* ==========================================================================
   KATALIS - Color Picker Module
   Author: DARWANZA / PEREKAYASA
   ========================================================================== */

import ColorContextPadProvider from 'bpmn-js-color-picker/colors/ColorContextPadProvider';
import KatalisColorPopupProvider from './KatalisColorPopupProvider';

export default {
  __init__: [
    'colorContextPadProvider',
    'colorPopupProvider'
  ],
  colorContextPadProvider: [ 'type', ColorContextPadProvider ],
  colorPopupProvider: [ 'type', KatalisColorPopupProvider ]
};
