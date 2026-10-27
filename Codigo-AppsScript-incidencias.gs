// INCIDENCIAS DE COSECHADOR · app con escaneo de fotocheck
// Lee la pestaña BD (DNI, nombre, motivos) y guarda en la pestaña Incidencias:
// Fecha | DNI | Nombres | Incidencia | Grupo | Auxiliar | Hora | ID
const HOJA_ID = '1EdNGKPL8JFZB5zQHJJexvhMNLxDdp7uMw6LTiDxp_ks';
const TZ = 'America/Lima';
const CAB = ['Fecha', 'DNI', 'Nombres', 'Incidencia', 'Grupo', 'Auxiliar', 'Hora', 'ID'];

function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function dni_(v) { const s = String(v || '').replace(/\D/g, ''); return s ? ('00000000' + s).slice(-8) : ''; }
function hoja_(n) { return SpreadsheetApp.openById(HOJA_ID).getSheetByName(n); }

function doGet() {
  const bd = hoja_('BD');
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
    const sh = hoja_('Incidencias');
    sh.getRange(1, 1, 1, CAB.length).setValues([CAB]).setFontWeight('bold');
    const n = sh.getLastRow();
    const ids = n > 1 ? sh.getRange(2, 8, n - 1, 1).getValues().map(r => String(r[0])) : [];
    if (b.accion === 'borrar') {
      const i = ids.indexOf(String(b.borrar));
      if (i >= 0) sh.deleteRow(i + 2);
      return json_({ ok: true });
    }
    if (b.id && ids.indexOf(String(b.id)) >= 0) return json_({ ok: true, dup: true });
    const d = dni_(b.dni);
    if (!d || !b.incidencia) return json_({ ok: false, error: 'Faltan datos' });
    const ahora = new Date();
    sh.appendRow([Utilities.formatDate(ahora, TZ, 'dd/MM/yyyy'), "'" + d, String(b.nombre || '').toUpperCase(),
      String(b.incidencia).toUpperCase(), String(b.grupo || '').toUpperCase(), String(b.por || '').toUpperCase(),
      Utilities.formatDate(ahora, TZ, 'HH:mm'), String(b.id || '')]);
    return json_({ ok: true });
  } catch (err) { return json_({ ok: false, error: String(err) }); }
  finally { lock.releaseLock(); }
}
