/* ==========================================================================
   KATALIS - Custom Translation Module (i18n)
   Mengubah istilah standar seperti 'Documentation' menjadi 'Deskripsi'
   Author: DARWANZA / PEREKAYASA
   ========================================================================== */

const TRANSLATIONS = {
  'Documentation': 'Deskripsi',
  'Element documentation': 'Deskripsi Alur / Tahap Proses',
  'Set color': 'Pilih Warna Notasi',
  'General': 'General',
  'Name': 'Nama Notasi',
  'Id': 'ID Elemen'
};

export default function customTranslate(template, replacements) {
  replacements = replacements || {};

  const translated = TRANSLATIONS[template] || template;

  return translated.replace(/{([^}]+)}/g, function(_, key) {
    return replacements[key] || '{' + key + '}';
  });
}
