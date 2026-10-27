/**
 * INCIDENCIAS DE COSECHADOR → hoja "Incidencias de cosechador".
 * doGet: devuelve la lista de personas (DNI, nombre) y los motivos de la pestaña BD.
 * doPost: agrega una fila en la pestaña Incidencias (Fecha, DNI, Nombres, Incidencia, Registrado por, Hora).
 * Proyecto aparte: no toca los otros aplicativos.
 */
const HOJA_ID = '1EdNGKPL8JFZB5zQHJJexvhMNLxDdp7uMw6LTiDxp_ks';
const TZ = 'America/Lima';

function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function dni_(v) { const s = String(v || '').replace(/\D/g, ''); return s ? ('00000000' + s).slice(-8) : ''; }

function doGet() {
  const ss = SpreadsheetApp.openById(HOJA_ID), bd = ss.getSheetByName('BD');
  const v = bd.getRange(2, 1, Math.max(1, bd.getLastRow() - 1), 4).getDisplayValues();
  const personas = [], motivos = [];
  v.forEach(r => {
    const d = dni_(r[0]), n = String(r[1] || '').trim().toUpperCase();
    if (d && n) personas.push([d, n]);
    const m = String(r[3] || '').trim().toUpperCase();
    if (m && motivos.indexOf(m) < 0) motivos.push(m);
  });
  return json_({ ok: true, personas: personas, motivos: motivos });
}

function doPost(e) {
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const b = JSON.parse(e.postData.contents || '{}');
    const sh = SpreadsheetApp.openById(HOJA_ID).getSheetByName('Incidencias');
    if (sh.getRange(1, 5).getValue() === '') sh.getRange(1, 5, 1, 3).setValues([['Registrado por', 'Hora', 'ID']]);
    const id = String(b.id || '');
    if (id) {
      const n = sh.getLastRow();
      if (n > 1 && sh.getRange(2, 7, n - 1, 1).getValues().some(r => String(r[0]) === id)) return json_({ ok: true, dup: true });
    }
    if (b.accion === 'borrar') {
      const n = sh.getLastRow(); if (n < 2) return json_({ ok: true });
      const ids = sh.getRange(2, 7, n - 1, 1).getValues();
      const i = ids.findIndex(r => String(r[0]) === String(b.borrar));
      if (i >= 0) sh.deleteRow(i + 2);
      return json_({ ok: true });
    }
    const d = dni_(b.dni);
    if (!d || !b.incidencia) return json_({ ok: false, error: 'Faltan datos' });
    const ahora = new Date();
    sh.appendRow([Utilities.formatDate(ahora, TZ, 'dd/MM/yyyy'), "'" + d, String(b.nombre || '').toUpperCase(),
      String(b.incidencia).toUpperCase(), String(b.por || '').toUpperCase(), Utilities.formatDate(ahora, TZ, 'HH:mm'), id]);
    return json_({ ok: true });
  } catch (err) { return json_({ ok: false, error: String(err) }); }
  finally { lock.releaseLock(); }
}
