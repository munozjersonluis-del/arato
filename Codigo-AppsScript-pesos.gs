/**
 * Registro de pesos de bandejas + DESCARTE → Google Sheets
 * - Pesos: escribe en la tabla que tiene el encabezado "kg pesado" (pestaña BD), desde la fila FILA_INICIO.
 * - Descarte: escribe en la pestaña DESCARTE (Fecha, Grupo, Modulo, Variedad, Jabas, Peso).
 *   Si ya hay una fila del día con ese grupo y sin jabas/peso (prellenada), la completa; si no, agrega una fila nueva.
 * - Cada registro trae un código único: si el celular reenvía, NO se vuelve a escribir (sin duplicados).
 *   En BD el código va en la columna "ID registro"; en DESCARTE se guarda en una pestaña oculta (_descarte_ids)
 *   para no agregar columnas a DESCARTE.
 * - Proyecto propio (separado del de material solicitado): abre la hoja por su ID.
 */
const HOJA_ID = '1WY-8HvSFrrRhbLJ5sVFKZDqejSQN0HdZESdLPlkzCWk'; // PESO DE BANDEJA POR GRUPO (pesos, descarte y material)
function SS_() { return SpreadsheetApp.openById(HOJA_ID); }
const PESTANA_DESCARTE = 'DESCARTE';
const PESTANA_DESC_IDS = '_descarte_ids'; // ID | Fila | Fecha | Grupo | Peso | Prellenada
const ENTRADAS = ['fecha', 'acopio', 'modulo', 'variedad', 'grupo', 'tipo', 'cantidad', 'kg pesado'];
const FILA_INICIO = 186; // el formulario empieza a escribir desde esta fila

function norm_(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
}

// Ubicación de la tabla (se guarda 6 horas en caché para no buscarla cada vez)
function tabla_(forzar) {
  const cache = CacheService.getScriptCache();
  const ss = SS_();
  if (!forzar) {
    const c = cache.get('tabla_v3');
    if (c) { const t = JSON.parse(c); const h = ss.getSheetByName(t.hojaNombre); if (h) { t.hoja = h; return t; } }
  }
  for (const h of ss.getSheets()) {
    const filas = Math.min(h.getLastRow(), 15);
    if (filas < 1) continue;
    const vals = h.getRange(1, 1, filas, h.getLastColumn()).getValues();
    for (let r = 0; r < vals.length; r++) {
      const fila = vals[r].map(norm_);
      if (fila.some(v => v.indexOf('kg pesado') === 0) && fila.indexOf('fecha') >= 0 && fila.indexOf('grupo') >= 0) {
        const col = {};
        fila.forEach((v, i) => { if (v && !(v in col)) col[v] = i + 1; });
        col['kg pesado'] = fila.findIndex(v => v.indexOf('kg pesado') === 0) + 1;
        // columna con el ID de cada registro: evita duplicados aunque el celular reenvíe
        if (!col['id registro']) {
          let ult = fila.length; while (ult > 0 && !fila[ult - 1]) ult--;
          h.getRange(r + 1, ult + 1).setValue('ID registro');
          col['id registro'] = ult + 1;
        }
        const t = { hojaNombre: h.getName(), filaEnc: r + 1, col: col, ncol: fila.length };
        cache.put('tabla_v3', JSON.stringify(t), 21600);
        t.hoja = h;
        return t;
      }
    }
  }
  throw new Error('No encontré la tabla con el encabezado "kg pesado".');
}

// Tabla MODULO -> FUNDO (también en caché)
function modulos_() {
  const cache = CacheService.getScriptCache();
  const c = cache.get('modulos_v2');
  if (c) return JSON.parse(c);
  const out = [];
  buscar:
  for (const h of SS_().getSheets()) {
    const n = h.getLastRow();
    if (n < 2) continue;
    const vals = h.getRange(1, 1, n, Math.min(h.getLastColumn(), 30)).getValues();
    for (let r = 0; r < Math.min(vals.length, 15); r++) {
      for (let c2 = 0; c2 < vals[r].length - 1; c2++) {
        if (norm_(vals[r][c2]) === 'modulo' && norm_(vals[r][c2 + 1]) === 'fundo') {
          for (let k = r + 1; k < vals.length; k++) {
            const m = String(vals[k][c2] || '').trim();
            if (!m) break;
            out.push({ modulo: m, fundo: String(vals[k][c2 + 1] || '').trim() });
          }
          break buscar;
        }
      }
    }
  }
  cache.put('modulos_v2', JSON.stringify(out), 21600);
  return out;
}

function siguienteVacia_(t, desde) {
  const h = t.hoja, cF = t.col['fecha'];
  desde = Math.max(desde, FILA_INICIO, t.filaEnc + 1);
  const ultima = Math.max(h.getLastRow(), desde);
  const n = ultima - desde + 1;
  const vals = h.getRange(desde, cF, n, 1).getValues();
  const kg = h.getRange(desde, t.col['kg pesado'], n, 1).getValues();
  const ids = h.getRange(desde, colId_(t), n, 1).getValues();
  for (let i = 0; i < n; i++) if (vals[i][0] === '' && kg[i][0] === '' && ids[i][0] === '') return desde + i;
  return ultima + 1;
}

// última fila con FECHA (las columnas calculadas pueden tener fórmulas arrastradas hasta el final de la hoja)
function ultimaDatos_(t) {
  const h = t.hoja, n = h.getLastRow();
  if (n <= t.filaEnc) return t.filaEnc;
  const v = h.getRange(t.filaEnc + 1, t.col['fecha'], n - t.filaEnc, 1).getValues();
  let i = v.length; while (i > 0 && v[i - 1][0] === '') i--;
  return t.filaEnc + i;
}

function semana_(d) { const ini = new Date(d.getFullYear(), 0, 1); return Math.floor((Math.floor((d - ini) / 86400000) + ini.getDay()) / 7) + 1; }
function serial_(d) { return Math.round((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(1899, 11, 30)) / 86400000); }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

function doGet(e) {
  try {
    const t = tabla_();
    const h = t.hoja;
    const ultima = ultimaDatos_(t);
    const desde = Math.max(t.filaEnc + 1, ultima - 400);
    const regs = [], variedades = {};
    if (ultima >= desde) {
      const vals = h.getRange(desde, 1, ultima - desde + 1, t.ncol).getValues();
      const tz = Session.getScriptTimeZone();
      vals.forEach(v => {
        const f = v[t.col['fecha'] - 1];
        if (!f) return;
        const va = String(v[t.col['variedad'] - 1] || '').trim().toUpperCase();
        if (va) variedades[va] = 1;
        regs.push({
          fecha: f instanceof Date ? Utilities.formatDate(f, tz, 'yyyy-MM-dd') : String(f),
          acopio: v[t.col['acopio'] - 1], modulo: v[t.col['modulo'] - 1], variedad: va,
          grupo: v[t.col['grupo'] - 1], tipo: v[t.col['tipo'] - 1],
          cantidad: v[t.col['cantidad'] - 1], kg: v[t.col['kg pesado'] - 1]
        });
      });
    }
    let descartes = [];
    try { descartes = leerDescartes_(); } catch (x) { }
    return json_({ ok: true, modulos: modulos_(), variedades: Object.keys(variedades).sort(), registros: regs.slice(-200), descartes: descartes });
  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) });
  }
}

// Columna "ID registro" (columna V): guarda el código único de cada registro y evita duplicados para siempre
function colId_(t) { return t.col['id registro'] || 22; }

function yaGuardado_(t, id) {
  if (!id) return 0;
  const h = t.hoja, last = h.getLastRow();
  if (last < 2) return 0;
  const f = h.getRange(2, colId_(t), last - 1, 1).createTextFinder(String(id)).matchEntireCell(true).findNext();
  return f ? f.getRow() : 0;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try { lock.waitLock(25000); } catch (x) { return json_({ ok: false, error: 'Servidor ocupado, se reintentará.' }); }
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.accion === 'deshacer') return json_(deshacer_(d));
    const regs = Array.isArray(d.registros) ? d.registros : [d];
    let t = tabla_();
    if (!t.col['fecha'] || !t.col['kg pesado']) t = tabla_(true);
    const h = t.hoja, cache = CacheService.getScriptCache();
    const CID = colId_(t);
    if (h.getMaxColumns() < CID) h.insertColumnsAfter(h.getMaxColumns(), CID - h.getMaxColumns());
    const guardados = [], errores = [];
    const colsIn = ENTRADAS.map(k => t.col[k]);
    const contiguas = colsIn.every((c, i) => c && c === colsIn[0] + i);
    let fila = null;

    regs.forEach(r => {
      if (r.tipoReg === 'descarte') {
        try { guardarDescarte_(r); guardados.push(r.id); } catch (err) { errores.push(String(err.message || err)); }
        return;
      }
      // 1) si este registro ya está en la hoja (por su código único), no se vuelve a escribir
      const existe = r.id ? (Number(cache.get('fila_' + r.id)) || yaGuardado_(t, r.id)) : 0;
      if (existe) { guardados.push(r.id); return; }
      try {
        fila = siguienteVacia_(t, fila ? fila + 1 : FILA_INICIO);
        let fecha = null;
        const p = String(r.fecha || '').split('-').map(Number);
        if (p.length === 3 && p[0] > 2000) fecha = new Date(p[0], p[1] - 1, p[2]);
        if (!fecha || isNaN(fecha)) fecha = new Date();
        const valores = [fecha, r.acopio, r.modulo, String(r.variedad).toUpperCase(), r.grupo, r.tipo, Number(r.cantidad), Number(r.kg)];
        if (contiguas) h.getRange(fila, colsIn[0], 1, 8).setValues([valores]);
        else colsIn.forEach((c, i) => { if (c) h.getRange(fila, c).setValue(valores[i]); });
        if (r.id) h.getRange(fila, CID).setValue(String(r.id));
        if (r.id) cache.put('fila_' + r.id, String(fila), 21600);
        guardados.push(r.id || fila);
      } catch (err) {
        errores.push(String(err.message || err));
        return;
      }
      // 2) columnas calculadas: si algo falla aquí, el registro ya quedó guardado
      try {
        const fAct = h.getRange(fila, 1, 1, t.ncol).getFormulasR1C1()[0];
        const fArr = fila - 1 > t.filaEnc ? h.getRange(fila - 1, 1, 1, t.ncol).getFormulasR1C1()[0] : [];
        const nombres = {}; Object.keys(t.col).forEach(k => nombres[t.col[k]] = k);
        for (let c = 1; c <= t.ncol; c++) {
          const nombre = nombres[c];
          if (colsIn.indexOf(c) >= 0 || fAct[c - 1]) continue;
          if (fArr[c - 1]) { h.getRange(fila, c).setFormulaR1C1(fArr[c - 1]); continue; }
          if (nombre === 'semana') h.getRange(fila, c).setValue(semana_(new Date(h.getRange(fila, t.col['fecha']).getValue())));
          else if (nombre === 'fundo') h.getRange(fila, c).setValue((modulos_().find(m => norm_(m.modulo) === norm_(r.modulo)) || {}).fundo || '');
          else if (nombre === 'fechagrupo') h.getRange(fila, c).setValue(serial_(new Date(h.getRange(fila, t.col['fecha']).getValue())) + String(r.grupo));
        }
      } catch (err) { /* el registro ya está guardado */ }
    });
    SpreadsheetApp.flush();
    if (errores.length && !guardados.length) return json_({ ok: false, error: errores[0] });
    return json_({ ok: true, guardados: guardados, errores: errores });
  } catch (err) {
    try { CacheService.getScriptCache().remove('tabla_v2'); } catch (x) {}
    return json_({ ok: false, error: String(err.message || err) });
  } finally {
    lock.releaseLock();
  }
}

function deshacer_(d) {
  if (d.tipoReg === 'descarte') return deshacerDescarte_(d);
  const cache = CacheService.getScriptCache();
  const t = tabla_();
  const h = t.hoja;
  let fila = Number(cache.get('fila_' + d.id));
  const cId = t.col['id registro'];
  if (!fila && cId && d.id) {
    const ult = ultimaDatos_(t), desde = Math.max(t.filaEnc + 1, ult - 3000);
    const ids = h.getRange(desde, cId, ult - desde + 1, 1).getValues();
    const i = ids.findIndex(v => String(v[0]) === String(d.id));
    if (i >= 0) fila = desde + i;
  }
  if (!fila) return { ok: false, error: 'Ya no se puede deshacer este registro. Corrígelo en la hoja.' };
  const colsIn = ENTRADAS.map(k => t.col[k]);
  const kg = Number(h.getRange(fila, t.col['kg pesado']).getValue());
  const mod = String(h.getRange(fila, t.col['modulo']).getValue());
  if (Math.abs(kg - Number(d.kg)) > 0.0005 || norm_(mod) !== norm_(d.modulo)) {
    return { ok: false, error: 'La fila ' + fila + ' ya fue cambiada en la hoja. Corrígela ahí.' };
  }
  colsIn.forEach(c => { if (c) h.getRange(fila, c).clearContent(); });
  if (cId) h.getRange(fila, cId).clearContent();
  cache.remove('fila_' + d.id);
  return { ok: true, fila: fila };
}


/* =================== DESCARTE =================== */
function hojaDescarte_() {
  const ss = SS_();
  const h = ss.getSheetByName(PESTANA_DESCARTE);
  if (!h) throw new Error('No encontré la pestaña DESCARTE.');
  const head = h.getRange(1, 1, 1, h.getLastColumn()).getValues()[0].map(norm_);
  const c = n => head.indexOf(n) + 1;
  const C = { fecha: c('fecha'), grupo: c('grupo'), modulo: c('modulo'), variedad: c('variedad'), jabas: c('jabas'), peso: c('peso') };
  if (!C.fecha || !C.grupo || !C.jabas || !C.peso) throw new Error('En DESCARTE faltan columnas (Fecha, Grupo, Jabas, Peso).');
  C.n = Math.max(C.fecha, C.grupo, C.modulo, C.variedad, C.jabas, C.peso);
  let ids = ss.getSheetByName(PESTANA_DESC_IDS);
  if (!ids) {
    ids = ss.insertSheet(PESTANA_DESC_IDS);
    ids.getRange(1, 1, 1, 6).setValues([['ID', 'Fila', 'Fecha', 'Grupo', 'Peso', 'Prellenada']]);
    ids.hideSheet();
  }
  return { h: h, C: C, ids: ids };
}
function fechaTxt_(v) { // dd/MM/yyyy
  if (v && typeof v.getTime === 'function') return Utilities.formatDate(v, Session.getScriptTimeZone(), 'dd/MM/yyyy');
  const m = String(v || '').trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  return m ? ('0' + m[1]).slice(-2) + '/' + ('0' + m[2]).slice(-2) + '/' + m[3] : String(v || '').trim();
}
function fechaDe_(iso) { const p = String(iso || '').split('-').map(Number); const d = p.length === 3 && p[0] > 2000 ? new Date(p[0], p[1] - 1, p[2]) : new Date(); return isNaN(d) ? new Date() : d; }
function idDescarte_(ids, id) {
  const n = ids.getLastRow();
  if (!id || n < 2) return null;
  const f = ids.getRange(2, 1, n - 1, 1).createTextFinder(String(id)).matchEntireCell(true).findNext();
  return f ? { fila: f.getRow(), datos: ids.getRange(f.getRow(), 1, 1, 6).getValues()[0] } : null;
}
function guardarDescarte_(r) {
  const D = hojaDescarte_(), h = D.h, C = D.C;
  if (r.id && idDescarte_(D.ids, r.id)) return; // ya guardado: no duplicar
  const fecha = fechaDe_(r.fecha), fTxt = fechaTxt_(fecha), grupo = String(r.grupo || '').toUpperCase();
  const jabas = Number(r.jabas), kg = Number(r.kg);
  if (!(jabas > 0) || !(kg > 0)) throw new Error('Descarte sin jabas o sin peso.');
  const n = h.getLastRow();
  const v = n > 1 ? h.getRange(2, 1, n - 1, C.n).getValues() : [];
  // 1) fila prellenada del día para ese grupo (sin jabas ni peso)
  let fila = 0, prell = false;
  for (let i = 0; i < v.length; i++) {
    const x = v[i];
    if (fechaTxt_(x[C.fecha - 1]) === fTxt && String(x[C.grupo - 1]).trim().toUpperCase() === grupo && x[C.jabas - 1] === '' && x[C.peso - 1] === '') { fila = i + 2; prell = true; break; }
  }
  // 2) si no hay, primera fila totalmente vacía al final
  if (!fila) {
    let u = v.length; while (u > 0 && v[u - 1].every(c => c === '')) u--;
    fila = u + 2;
    h.getRange(fila, C.fecha).setValue(fecha);
    h.getRange(fila, C.grupo).setValue(grupo);
  }
  if (C.modulo && r.modulo) h.getRange(fila, C.modulo).setValue(String(r.modulo).toUpperCase());
  if (C.variedad && r.variedad) h.getRange(fila, C.variedad).setValue(String(r.variedad).toUpperCase());
  h.getRange(fila, C.jabas).setValue(jabas);
  h.getRange(fila, C.peso).setValue(kg);
  D.ids.appendRow([String(r.id || ''), fila, fTxt, grupo, kg, prell ? 'SI' : 'NO']);
}
function leerDescartes_() {
  const D = hojaDescarte_(), h = D.h, C = D.C, n = h.getLastRow();
  if (n < 2) return [];
  const desde = Math.max(2, n - 300);
  const v = h.getRange(desde, 1, n - desde + 1, C.n).getValues();
  const out = [];
  v.forEach(x => {
    const f = fechaTxt_(x[C.fecha - 1]), m = f.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m || (x[C.jabas - 1] === '' && x[C.peso - 1] === '')) return;
    out.push({
      fecha: m[3] + '-' + m[2] + '-' + m[1], grupo: String(x[C.grupo - 1] || ''),
      modulo: C.modulo ? String(x[C.modulo - 1] || '') : '',
      variedad: C.variedad ? String(x[C.variedad - 1] || '') : '',
      jabas: Number(x[C.jabas - 1]) || 0, kg: Number(x[C.peso - 1]) || 0
    });
  });
  return out.slice(-200);
}
function deshacerDescarte_(d) {
  const D = hojaDescarte_(), h = D.h, C = D.C;
  const reg = idDescarte_(D.ids, d.id);
  if (!reg) return { ok: false, error: 'Ya no se puede deshacer este descarte. Corrígelo en la hoja.' };
  const fila = Number(reg.datos[1]);
  const kg = Number(h.getRange(fila, C.peso).getValue()), g = String(h.getRange(fila, C.grupo).getValue()).trim().toUpperCase();
  if (Math.abs(kg - Number(d.kg)) > 0.0005 || g !== String(d.grupo || '').toUpperCase())
    return { ok: false, error: 'La fila ' + fila + ' de DESCARTE ya fue cambiada. Corrígela ahí.' };
  h.getRange(fila, C.jabas).clearContent(); h.getRange(fila, C.peso).clearContent();
  if (C.variedad) h.getRange(fila, C.variedad).clearContent();
  if (C.modulo) h.getRange(fila, C.modulo).clearContent();
  if (reg.datos[5] !== 'SI') { h.getRange(fila, C.fecha).clearContent(); h.getRange(fila, C.grupo).clearContent(); }
  D.ids.deleteRow(reg.fila);
  return { ok: true, fila: fila };
}
