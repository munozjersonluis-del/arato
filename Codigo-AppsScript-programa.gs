/**
 * PROGRAMA → app de Bandejas.
 * Devuelve qué estibas van en cada placa según la pestaña ARMAR PROGRAMA.
 * Solo nombres (sin DNI ni celular). Proyecto aparte: no toca los otros aplicativos.
 */
const PROGRAMA_ID = '1tPtN4dOhpEgeDauExJY3eC0dX1CtPboxLc2v2dGlARg';

function doGet() {
  const sh = SpreadsheetApp.openById(PROGRAMA_ID).getSheetByName('ARMAR PROGRAMA');
  const v = sh.getRange(5, 1, Math.max(1, sh.getLastRow() - 4), 8).getDisplayValues();
  const unidades = {};
  v.forEach(r => {
    const placa = String(r[4] || '').trim().toUpperCase();
    if (!/^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(placa)) return;
    const est = [r[6], r[7]].map(x => String(x || '').trim().toUpperCase()).filter(Boolean);
    unidades[placa] = { grupo: String(r[0] || '').trim().toUpperCase(), chofer: String(r[5] || '').trim().toUpperCase(), estibas: est };
  });
  return ContentService.createTextOutput(JSON.stringify({ ok: true, unidades: unidades }))
    .setMimeType(ContentService.MimeType.JSON);
}
