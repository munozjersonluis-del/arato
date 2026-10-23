// App "Movimientos de grupos" (supervisores de cosecha)
// Hoja: SUPERVISOR DE COSECHA. Pegar en Extensiones → Apps Script, Implementar → Aplicación web
// (Ejecutar como: Yo · Acceso: Cualquier persona) y pasar el enlace /exec.
const SUP = ['TOMAS', 'ELIAS', 'LESLIE', 'JHASTYN'];
const F0 = 6, NF = 17; // filas 6 a 22 de cada pestaña
const TZ = 'America/Lima';

function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function hoy_() { return Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd'); }
function bd_(ss) {
  return ss.getSheetByName('BD').getRange('A2:B').getValues()
    .filter(r => r[0] !== '' && r[0] != null).map(r => ({ c: String(r[0]).trim(), f: String(r[1]).trim() }));
}
function hist_(ss) {
  let h = ss.getSheetByName('HISTORIAL');
  if (!h) {
    h = ss.insertSheet('HISTORIAL');
    h.appendRow(['FECHA', 'SUPERVISOR', 'GRUPO', 'PERSONAS', 'FUNDO ORIGEN', 'COMEDOR ORIGEN', 'FUNDO DESTINO', 'COMEDOR DESTINO', 'HORA', 'REGISTRADO', 'ID', 'ESTADO']);
    h.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground('#123A5C').setFontColor('#fff');
    h.setFrozenRows(1);
  }
  return h;
}
// Al empezar un día nuevo se limpia la pestaña del supervisor (lo anterior ya está en HISTORIAL)
function limpiaDia_(sh) {
  if (sh.getMaxColumns() < 12) { sh.insertColumnsAfter(sh.getMaxColumns(), 12 - sh.getMaxColumns()); sh.hideColumns(10, 3); }
  const p = PropertiesService.getScriptProperties(), k = 'dia_' + sh.getName(), d = hoy_();
  const ant = p.getProperty(k);
  if (ant && ant !== d) {
    [2, 3, 5, 8, 9].forEach(c => sh.getRange(F0, c, NF, 1).clearContent());
    sh.getRange(F0, 12, NF, 1).clearContent();
  }
  if (ant !== d) p.setProperty(k, d);
}
function leer_(sh) {
  limpiaDia_(sh);
  const v = sh.getRange(F0, 1, NF, 12).getDisplayValues();
  return v.map((r, i) => ({ fila: F0 + i, grupo: r[1], personas: r[2], fo: r[3], co: r[4], fd: r[6], cd: r[7], hora: r[8], id: r[11] }))
    .filter(r => r.grupo);
}

function doGet(e) {
  const ss = SpreadsheetApp.getActive(), sup = String((e && e.parameter.sup) || '').toUpperCase();
  const out = { ok: true, supervisores: SUP, comedores: bd_(ss), movs: [] };
  if (SUP.includes(sup)) { const sh = ss.getSheetByName(sup); if (sh) out.movs = leer_(sh); }
  return json_(out);
}

function doPost(e) {
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const b = JSON.parse(e.postData.contents || '{}'), ss = SpreadsheetApp.getActive();
    const sup = String(b.sup || '').toUpperCase();
    if (!SUP.includes(sup)) return json_({ ok: false, error: 'Supervisor no válido' });
    const sh = ss.getSheetByName(sup); if (!sh) return json_({ ok: false, error: 'No existe la pestaña ' + sup });
    limpiaDia_(sh);
    const H = hist_(ss);

    if (b.accion === 'borrar') {
      const v = sh.getRange(F0, 12, NF, 1).getValues();
      const i = v.findIndex(r => String(r[0]) === String(b.id));
      if (i < 0) return json_({ ok: false, error: 'No se encontró el movimiento' });
      [2, 3, 5, 8, 9, 12].forEach(c => sh.getRange(F0 + i, c).clearContent());
      const ids = H.getRange(2, 11, Math.max(1, H.getLastRow() - 1), 1).getValues();
      const j = ids.findIndex(r => String(r[0]) === String(b.id));
      if (j >= 0) H.getRange(j + 2, 12).setValue('ANULADO');
      return json_({ ok: true, movs: leer_(sh) });
    }

    if (b.accion === 'editar') {
      const v = sh.getRange(F0, 12, NF, 1).getValues();
      const i = v.findIndex(r => String(r[0]) === String(b.id));
      if (i < 0) return json_({ ok: false, error: 'No se encontró el movimiento' });
      const f = F0 + i, num = x => (/^\d+$/.test(x) ? Number(x) : x);
      sh.getRange(f, 2).setValue(String(b.grupo || '').toUpperCase());
      sh.getRange(f, 3).setValue(Number(b.personas) || '');
      sh.getRange(f, 5).setValue(num(String(b.co)));
      sh.getRange(f, 8).setValue(num(String(b.cd)));
      sh.getRange(f, 9).setValue(String(b.hora));
      const ids = H.getRange(2, 11, Math.max(1, H.getLastRow() - 1), 1).getValues();
      const j = ids.findIndex(r => String(r[0]) === String(b.id));
      if (j >= 0) {
        const B = bd_(ss), fu = c => (B.find(x => x.c === c) || {}).f || '';
        H.getRange(j + 2, 3, 1, 7).setValues([[String(b.grupo).toUpperCase(), Number(b.personas) || '', fu(String(b.co)), num(String(b.co)), fu(String(b.cd)), num(String(b.cd)), String(b.hora)]]);
        H.getRange(j + 2, 12).setValue('EDITADO');
      }
      return json_({ ok: true, movs: leer_(sh) });
    }

    // agregar
    const g = String(b.grupo || '').toUpperCase(), co = String(b.co || ''), cd = String(b.cd || ''), hora = String(b.hora || '');
    if (!g || !co || !cd || !hora) return json_({ ok: false, error: 'Faltan datos' });
    const id = String(b.id || Date.now());
    const ids = sh.getRange(F0, 12, NF, 1).getValues();
    if (ids.some(r => String(r[0]) === id)) return json_({ ok: true, movs: leer_(sh) }); // ya guardado
    const col = sh.getRange(F0, 2, NF, 1).getValues();
    const i = col.findIndex(r => r[0] === '' || r[0] == null);
    if (i < 0) return json_({ ok: false, error: 'La hoja de ' + sup + ' está llena (17 movimientos)' });
    const f = F0 + i, num = v => (/^\d+$/.test(v) ? Number(v) : v);
    sh.getRange(f, 2).setValue(g);
    sh.getRange(f, 3).setValue(Number(b.personas) || '');
    sh.getRange(f, 5).setValue(num(co));
    sh.getRange(f, 8).setValue(num(cd));
    sh.getRange(f, 9).setValue(hora);
    sh.getRange(f, 12).setValue(id);
    const B = bd_(ss), fu = c => (B.find(x => x.c === c) || {}).f || '';
    H.appendRow([hoy_(), sup, g, Number(b.personas) || '', fu(co), num(co), fu(cd), num(cd), hora,
      Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd HH:mm'), id, 'OK']);
    return json_({ ok: true, movs: leer_(sh) });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally { lock.releaseLock(); }
}
