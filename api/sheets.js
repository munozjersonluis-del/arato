const { google } = require('googleapis');

const SHEET_ID = '1wKwRNcox1Ydnqwz9CkDP1_hheaAnWO8y0xWcuq9hTlk';

const credentials = {
  type: "service_account",
  project_id: "subtle-canto-498013-i0",
  private_key_id: "54b8f0eaad98de64813f1d1d9c8424d09780cb57",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDRnu3nT3OcEfAg\nadFzwg/eSyomTXswJZYXZgWYMJvgFPREG93Gvex5mMz4zvavr9sIqUcMxc+JXwnV\n3x9Hm/wQBserM4ChTNLnnLcZ1U80YVmc0kQpYCbzOMNT6rpHoMnxZGAlOaMPsIiP\nr9GTi79ruEwGzMNpbDiI8Puvkt5mv29Nmaz3nANW2/IwwZk+NM2OmIZ/rdQ1JONs\nRmrAPErBU3ecklEn7BbUurDTUxtezhzMnOXhVeau3Ti0W5dKEZtc8UtorBlPS1Re\nWMsE/qv7CAwXWvSerA5CqJ7VbtNlfK7pzKutrJwumMmA+7W8rOq+H3awEHib9Mad\n7+dx5uUlAgMBAAECggEAMkT3T4vtsSVaHSPTT3vf+1KyOnpFSxAQdO8J82vgzbWo\nuHaoUkN0pNqAeUCExzAYinSx7b24Xfy1Kp117mHZamx90LAqrkPypgmenWrasjiQ\nWXvRTczZumVH7mVxo8DK/QExz2uJj7cpoK+sxkHyt138mXrcd/k0e56y9PF3NVNP\nEE8SPj42E0kTWCFfBvHWDUMuPEHBUdcN8T1eJED8cnCzquTSiax+XEyPHMRE96Zz\nLmQVM5T4mcC8Ahxzv+kQ1p9I/Rk/dQPfB9aRRE+ocSb8aOVypvWbgMLDrvgqZm5o\nxNbvehVDvd2Dcl8PCDgyh2K+ncofcArGmV293TAL9wKBgQD1JDay6rn3D4uQdYHO\n4FYoxViOnqy01trgpNoqzXejm3Md5DTYMs3i/+6p0sLbS96nwDOFofUF/M1NPwPv\nNnypqWNoU0DavmRoODqER0363ze/l3/4Kzixrh89c7MszqvpcGi3aQeJrIZ/I8U8\n+BTMkuKZF9qv1R0OcNNiYPEuSwKBgQDa5+27AAgy6DXgyZRkF+26HU2xBC4HbCkx\nXicS8N5UIl0el0h6Qrl9ScI5GcWj+0Lfu7zrM/tSyRa9jSpHW2B7jIIoTdSnvta2\n7CU/A5X7hrmj7jR3g1HVB01GvOk2TU7f4+gQ4w5IhvQxMzh8JsUkx91XS11akLZN\nEXCMiztUTwKBgDFqcmhQrtoh1RVyyo8EY/nmBjsBu3jc0tR0BtKYBqUBYgxFg22N\nmDlJNDghl0wTmDeipAAtLLJfSpdmu4lOJ4Uf8z0Fg05VEPJ9WzZtFUgcFSXXCWHi\nfJQ8sGl32EeRBdCR61oFnxJep+IbONhYfgDbHziTOW82e5v8nG/5cMTPAoGAduCY\no4LC8RJVn/sYULsF6JpdRJImhPVh8WNWCN0xf7MhqqkxPOPbY4SYqvWp9QFQMbv8\nPiZ+h1iYtttgaFvhK3cEf+q0X1wtsizPlUbXPj7NtY54g6aW2/8ZIh8Y7tpQyRk1\nP2ZurUhMeCN+uz06tlyrgOp2ieYoefXMjyZVU9UCgYEAjv3qH2v3755ySMLTTpfR\n6Hxj/ukwsAcAWypfPo4QzLN1OnxcnmiYUoDH9dvgUN7Op0+nVzs9P+BZrFpJQWwc\ntLftz90cNfoLBGnw8p1kE4OaiRILCryzDislolQGZyUZaQ9hP7ds/y44CEOuZK/9\np+9dylR6ctZk9pTnY8WdV7U=\n-----END PRIVATE KEY-----\n",
  client_email: "arato-sheets@subtle-canto-498013-i0.iam.gserviceaccount.com",
  client_id: "111629541873412682486",
  token_uri: "https://oauth2.googleapis.com/token"
};

// Colores exactos del Excel
function rgb(hex) {
  const r = parseInt(hex.slice(0,2),16)/255;
  const g = parseInt(hex.slice(2,4),16)/255;
  const b = parseInt(hex.slice(4,6),16)/255;
  return {red:r,green:g,blue:b};
}

const C = {
  VERDE:    rgb('1A5C38'), VERDE2:  rgb('2D6A4F'), VERDE_C: rgb('DCFCE7'),
  AZUL:     rgb('1E3A5F'), AZUL_C:  rgb('DBEAFE'),
  MORADO:   rgb('6D28D9'), MORADO2: rgb('5B21B6'), MORADO_C: rgb('F3E8FF'),
  TEAL:     rgb('059669'), TEAL_C:  rgb('ECFDF5'),
  NARANJA:  rgb('92400E'), NARANJA2: rgb('7A3008'),
  AMARILLO: rgb('D97706'), AMARILLO_C: rgb('FEF3C7'),
  ROJO:     rgb('DC2626'), ROJO_C:  rgb('FEE2E2'),
  BLANCO:   {red:1,green:1,blue:1},
  GRIS:     rgb('F1F5F9'),
  NEGRO:    rgb('1E293B'),
  VERDE_FNT: rgb('A8D8B9'),
  AZUL_FNT:  rgb('1E3A5F'),
};

const brd = { style:'SOLID', color:{red:0.82,green:0.87,blue:0.93} };
const borders = { top:brd, bottom:brd, left:brd, right:brd };

function fmt(bg, fg, bold, size, italic, wrap) {
  return {
    backgroundColor: bg,
    textFormat: { foregroundColor: fg, bold:!!bold, fontSize:size||10, italic:!!italic },
    horizontalAlignment: 'CENTER',
    verticalAlignment: 'MIDDLE',
    wrapStrategy: wrap ? 'WRAP' : 'CLIP',
    borders
  };
}

function rep(sheetId, startRow, endRow, startCol, endCol, cellFmt) {
  return { repeatCell: {
    range: { sheetId, startRowIndex:startRow, endRowIndex:endRow, startColumnIndex:startCol, endColumnIndex:endCol },
    cell: { userEnteredFormat: cellFmt },
    fields: 'userEnteredFormat'
  }};
}

function merge(sheetId, r1, r2, c1, c2) {
  return { mergeCells: { range:{ sheetId, startRowIndex:r1, endRowIndex:r2, startColumnIndex:c1, endColumnIndex:c2 }, mergeType:'MERGE_ALL' }};
}

function rowH(sheetId, row, px) {
  return { updateDimensionProperties: { range:{sheetId, dimension:'ROWS', startIndex:row, endIndex:row+1}, properties:{pixelSize:px}, fields:'pixelSize' }};
}

function colW(sheetId, col, px) {
  return { updateDimensionProperties: { range:{sheetId, dimension:'COLUMNS', startIndex:col, endIndex:col+1}, properties:{pixelSize:px}, fields:'pixelSize' }};
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return res.status(200).json({ ok:true, message:'Sheets API funcionando' });

  try {
    const auth = new google.auth.GoogleAuth({ credentials, scopes:['https://www.googleapis.com/auth/spreadsheets'] });
    const sheets = google.sheets({ version:'v4', auth });

    const { viajes=[], camiones=[] } = req.body || {};

    function pBins(v) { try { return JSON.parse(v.bins||'[]'); } catch { return []; } }
    function pRets(v) { try { return JSON.parse(v.retornos||'[]').flatMap(r=>r.bins||[]); } catch { return []; } }

    // Totales
    const tv=viajes.length, te=viajes.reduce((s,v)=>s+pBins(v).length,0);
    const tr=viajes.reduce((s,v)=>s+pRets(v).length,0);
    const ttn=viajes.reduce((s,v)=>s+(v.tn_total||0),0);
    const efic=te>0?(tr/te*100).toFixed(1)+'%':'0%';
    const dias=[...new Set(viajes.map(v=>v.fecha))].sort();
    const camV=camiones.filter(c=>c.numero_viaje>0).length;
    const camTn=camiones.reduce((s,c)=>s+(c.tn_carga||0),0);

    // Obtener IDs de hojas
    const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const sheetIds = {};
    meta.data.sheets.forEach(s => { sheetIds[s.properties.title] = s.properties.sheetId; });

    // ══════════════════════════
    // HOJA 1: DASHBOARD
    // ══════════════════════════
    const s1 = sheetIds['Hoja 1'];

    // Dashboard data
    const dd = {};
    viajes.forEach(v => {
      if (!dd[v.fecha]) dd[v.fecha]={v:0,e:0,r:0,tn:0};
      dd[v.fecha].v++; dd[v.fecha].e+=pBins(v).length;
      dd[v.fecha].r+=pRets(v).length; dd[v.fecha].tn+=(v.tn_total||0);
    });
    const camXDia={};
    camiones.filter(c=>c.numero_viaje>0).forEach(c=>{camXDia[c.fecha]=(camXDia[c.fecha]||0)+1;});

    const dashRows = [
      ['🌿  ARATO MISSION PRODUCE  —  REPORTE OPERACIONAL','','','','','','','','',''],
      ['Control de Bins de Campo  •  Arato Mission Produce','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['DÍAS TRABAJADOS','','VIAJES CAMPO','','BINS ENVIADOS','','BINS RETORNADOS','','EFICIENCIA',''],
      [dias.length,'', tv,'', te,'', tr,'', efic,''],
      ['','','','','','','','','',''],
      ['','','','','','','','','',''],
      ['PRODUCCIÓN POR DÍA','','','','','','','','',''],
      ['FECHA','VIAJES','BINS ENV.','BINS RET.','FALTANTES','TONELADAS','EFIC. %','CAMIONES','DÍAS',''],
    ];

    // Datos por día
    const diasRows = Object.keys(dd).sort().map((f,i) => {
      const d=dd[f]; const ef=d.e>0?(d.r/d.e*100).toFixed(1)+'%':'0%';
      return [f,d.v,d.e,d.r,d.e-d.r,+d.tn.toFixed(3),ef,camXDia[f]||0,1,''];
    });
    const totRow = ['TOTALES',tv,te,tr,te-tr,+ttn.toFixed(3),efic,camV,dias.length,''];

    // Aplicar merges PRIMERO antes de escribir datos
    await sheets.spreadsheets.batchUpdate({ spreadsheetId:SHEET_ID, resource:{ requests:[
      merge(s1,0,1,0,10),   // Título
      merge(s1,1,2,0,10),   // Subtítulo
      merge(s1,3,4,0,2),    // KPI1 label
      merge(s1,3,4,2,4),    // KPI2 label
      merge(s1,3,4,4,6),    // KPI3 label
      merge(s1,3,4,6,8),    // KPI4 label
      merge(s1,3,4,8,10),   // KPI5 label
      merge(s1,4,5,0,2),    // KPI1 valor
      merge(s1,4,5,2,4),    // KPI2 valor
      merge(s1,4,5,4,6),    // KPI3 valor
      merge(s1,4,5,6,8),    // KPI4 valor
      merge(s1,4,5,8,10),   // KPI5 valor
      merge(s1,7,8,0,10),   // Título sección
    ]}});

    // Escribir datos DESPUÉS de los merges
    await sheets.spreadsheets.values.clear({ spreadsheetId:SHEET_ID, range:'Hoja 1!A:Z' });
    await sheets.spreadsheets.values.update({
      spreadsheetId:SHEET_ID, range:'Hoja 1!A1', valueInputOption:'RAW',
      resource:{ values:[...dashRows, ...diasRows, totRow] }
    });

    const reqs1 = [
      // Título formato
      rep(s1,0,1,0,10, fmt(C.VERDE,C.BLANCO,true,15,false,true)),
      rowH(s1,0,40),
      // Subtítulo formato
      rep(s1,1,2,0,10, fmt(C.VERDE2,C.VERDE_FNT,false,9,true,false)),
      rowH(s1,1,18),
      rowH(s1,2,10),
      // KPI headers - 2 columnas por KPI
      rep(s1,3,4,0,2, fmt(C.AZUL,C.BLANCO,true,9,false,true)),
      rep(s1,3,4,2,4, fmt(C.VERDE,C.BLANCO,true,9,false,true)),
      rep(s1,3,4,4,6, fmt(C.MORADO,C.BLANCO,true,9,false,true)),
      rep(s1,3,4,6,8, fmt(C.TEAL,C.BLANCO,true,9,false,true)),
      rep(s1,3,4,8,10, fmt(C.AMARILLO,C.BLANCO,true,9,false,true)),
      rowH(s1,3,22),
      // KPI values - 2 columnas por KPI
      rep(s1,4,5,0,2, fmt(C.AZUL_C,C.AZUL,true,20,false,false)),
      rep(s1,4,5,2,4, fmt(C.VERDE_C,C.VERDE,true,20,false,false)),
      rep(s1,4,5,4,6, fmt(C.MORADO_C,C.MORADO,true,20,false,false)),
      rep(s1,4,5,6,8, fmt(C.TEAL_C,C.TEAL,true,20,false,false)),
      rep(s1,4,5,8,10, fmt(C.AMARILLO_C,C.AMARILLO,true,20,false,false)),
      rowH(s1,4,44),
      rowH(s1,5,10), rowH(s1,6,10),
      // Título sección producción
      rep(s1,7,8,0,10, fmt(C.VERDE,C.BLANCO,true,11,false,false)),
      rowH(s1,7,24),
      // Encabezados tabla
      rep(s1,8,9,0,10, fmt(C.VERDE2,C.BLANCO,true,9,false,false)),
      rowH(s1,8,22),
    ];

    // Filas de datos
    diasRows.forEach((row,i) => {
      const r = 9+i;
      const bg = i%2===1 ? C.GRIS : C.BLANCO;
      reqs1.push(rep(s1,r,r+1,0,10, fmt(bg,C.NEGRO,false,9,false,false)));
      reqs1.push(rowH(s1,r,18));
      // Eficiencia semáforo col 6
      const ef = parseFloat((row[6]||'0').toString().replace('%',''));
      const efBg = ef>=95?C.VERDE_C:ef>=80?C.AMARILLO_C:C.ROJO_C;
      const efFg = ef>=95?C.VERDE:ef>=80?C.AMARILLO:C.ROJO;
      reqs1.push(rep(s1,r,r+1,6,7, fmt(efBg,efFg,true,9,false,false)));
      // Faltantes col 4
      const falt = row[4];
      if (typeof falt==='number') {
        reqs1.push(rep(s1,r,r+1,4,5, fmt(falt>0?C.ROJO_C:C.VERDE_C, falt>0?C.ROJO:C.VERDE,true,9,false,false)));
      }
    });

    // Fila totales
    const totR = 9+diasRows.length;
    reqs1.push(rep(s1,totR,totR+1,0,10, fmt(C.VERDE,C.BLANCO,true,9,false,false)));
    reqs1.push(rowH(s1,totR,24));

    // Anchos col dashboard
    [110,100,100,100,100,110,90,100,80,60].forEach((w,i)=>reqs1.push(colW(s1,i,w)));

    await sheets.spreadsheets.batchUpdate({ spreadsheetId:SHEET_ID, resource:{requests:reqs1} });

    // ══════════════════════════
    // HOJA 2: DETALLE BINS
    // ══════════════════════════
    let rowsBins = [];
    const s2 = sheetIds['Hoja 2'];
    if (s2 !== undefined) {
      const hdrsBins = ['#','CÓDIGO BIN','FECHA','GRUPO','MÓDULO','MÁQUINA','OPERADOR','PORTABINERO','HORA SALIDA','ESTADO','VIAJE #'];
      let bn=1;
      viajes.forEach((v,vi)=>{
        const bins=pBins(v),rets=pRets(v);
        bins.forEach(cod=>{
          rowsBins.push([bn++,cod,v.fecha,v.grupo,v.modulo,v.maquina||'',v.operador,v.portabinero,v.hora_salida,rets.includes(cod)?'Retornado':'Pendiente',vi+1]);
        });
      });

      await sheets.spreadsheets.values.clear({ spreadsheetId:SHEET_ID, range:'Hoja 2!A:Z' });
      await sheets.spreadsheets.values.update({
        spreadsheetId:SHEET_ID, range:'Hoja 2!A1', valueInputOption:'RAW',
        resource:{ values:[
          ['📦  DETALLE DE BINS — CÓDIGOS INDIVIDUALES',...Array(10).fill('')],
          ['Actualizado: '+new Date().toLocaleString('es-CL'),...Array(10).fill('')],
          Array(11).fill(''),
          hdrsBins,
          ...rowsBins
        ]}
      });

      const reqs2 = [
        merge(s2,0,1,0,11), rep(s2,0,1,0,11, fmt(C.AZUL,C.BLANCO,true,14,false,false)), rowH(s2,0,36),
        merge(s2,1,2,0,11), rep(s2,1,2,0,11, fmt({red:0.12,green:0.22,blue:0.42},{red:0.7,green:0.83,blue:1},false,9,true,false)), rowH(s2,1,18),
        rowH(s2,2,10),
        rep(s2,3,4,0,11, fmt(C.AZUL,C.BLANCO,true,10,false,false)), rowH(s2,3,22),
      ];

      rowsBins.forEach((row,i)=>{
        const r=4+i; const bg=i%2===1?C.GRIS:C.BLANCO;
        reqs2.push(rep(s2,r,r+1,0,11, fmt(bg,C.NEGRO,false,9,false,false)));
        reqs2.push(rowH(s2,r,17));
        // Código bin azul destacado col 1
        reqs2.push(rep(s2,r,r+1,1,2, fmt(bg,C.AZUL,true,10,false,false)));
        // Estado col 9
        const estado=row[9];
        reqs2.push(rep(s2,r,r+1,9,10, fmt(estado==='Retornado'?C.VERDE_C:C.AMARILLO_C, estado==='Retornado'?C.VERDE:C.AMARILLO,true,9,false,false)));
      });

      [40,120,100,70,70,120,150,150,100,110,80].forEach((w,i)=>reqs2.push(colW(s2,i,w)));
      await sheets.spreadsheets.batchUpdate({ spreadsheetId:SHEET_ID, resource:{requests:reqs2} });
    }

    // ── HOJA 3: STOCK DE BINS (stock_movimientos) ──
    const SUPA_URL = 'https://rqvcvffyynpnighzwxju.supabase.co';
    const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxdmN2ZmZ5eW5wbmlnaHp3eGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MjgyNDcsImV4cCI6MjA5MzMwNDI0N30.fFufNEdRvAzl6O6BqtTbx83O3Eg8Wd7gACNJDGQKga4';
    const https = require('https');

    async function fetchSupa(path) {
      return new Promise((resolve, reject) => {
        const options = {
          hostname: 'rqvcvffyynpnighzwxju.supabase.co',
          path: '/rest/v1/' + path,
          headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY }
        };
        https.get(options, (r) => {
          let d = '';
          r.on('data', c => d += c);
          r.on('end', () => resolve(JSON.parse(d)));
        }).on('error', reject);
      });
    }

    try {
      const movs = await fetchSupa('stock_movimientos?select=tipo,cantidad,fecha,obs&order=created_at.asc');
      const modulos = await fetchSupa('stock_modulos?select=modulo,cantidad,fecha,obs,tipo&order=created_at.asc');

      // Calcular stock acumulado
      let stk = 0;
      const rowsMovs = movs.map((m, i) => {
        stk += m.tipo === 'ingreso' ? (m.cantidad||0) : -(m.cantidad||0);
        return [i+1, m.fecha||'', m.tipo==='ingreso'?'INGRESO (+)':'SALIDA AVOCADO (−)', m.cantidad, stk, m.obs||''];
      });

      // Stock por módulo
      const modMap = {};
      modulos.forEach(r => {
        if (!modMap[r.modulo]) modMap[r.modulo] = 0;
        modMap[r.modulo] += r.cantidad||0;
      });
      const totalMod = Object.values(modMap).reduce((s,v) => s+Math.max(0,v), 0);

      // Hoja Stock
      let s3 = existingSheets.find(s => s.properties.title === 'Stock Bins');
      if (!s3) {
        const addRes = await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SHEET_ID,
          resource: { requests: [{ addSheet: { properties: { title: 'Stock Bins' } } }] }
        });
        s3 = addRes.data.replies[0].addSheet;
      }
      const s3id = s3.properties ? s3.properties.sheetId : s3.addSheet?.properties.sheetId;

      const hdrsMovs = ['#','FECHA','TIPO','CANTIDAD','STOCK','OBSERVACION'];
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: 'Stock Bins!A1',
        valueInputOption: 'RAW',
        resource: { values: [
          ['ARATO MISSION PRODUCE — CONTROL DE STOCK DE BINS VACÍOS'],
          ['Stock = Ingreso Acopio − Salida Avocado'],
          ['Actualizado:', new Date().toLocaleString('es-PE')],
          [],
          hdrsMovs,
          ...rowsMovs,
          [],
          ['','','','STOCK ACTUAL →', stk, ''],
          [],
          ['STOCK POR MODULO'],
          ['MODULO','STOCK ACTUAL','','','',''],
          ...Object.keys(modMap).filter(m=>modMap[m]>0).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true})).map(m=>[m, modMap[m],'','','','']),
          ['TOTAL MODULOS', totalMod,'','','',''],
          ['DIFERENCIA (Gral - Modulos)', stk - totalMod,'','','',''],
        ]}
      });

      const GOLD = rgb('B8962E');
      const reqs3 = [
        merge(s3id,0,1,0,6), rep(s3id,0,1,0,6, fmt(C.VERDE,C.BLANCO,true,13)), rowH(s3id,0,30),
        merge(s3id,1,2,0,6), rep(s3id,1,2,0,6, fmt(C.VERDE2,C.BLANCO,false,9,true)), rowH(s3id,1,16),
        rep(s3id,4,5,0,6, fmt(C.VERDE,C.BLANCO,true,10)), rowH(s3id,4,22),
      ];
      rowsMovs.forEach((row,i) => {
        const r=5+i; const bg=i%2===0?C.GRIS:C.BLANCO; const isIng=row[2].includes('INGRESO');
        reqs3.push(rep(s3id,r,r+1,0,6, fmt(bg,C.NEGRO,false,9)));
        reqs3.push(rep(s3id,r,r+1,2,3, fmt(isIng?C.VERDE_C:C.ROJO_C, isIng?C.VERDE:C.ROJO, true, 9)));
        reqs3.push(rep(s3id,r,r+1,4,5, fmt(C.AZUL_C,C.AZUL,true,10)));
        reqs3.push(rowH(s3id,r,18));
      });
      [30,100,160,80,80,200].forEach((w,i)=>reqs3.push(colW(s3id,i,w)));
      await sheets.spreadsheets.batchUpdate({ spreadsheetId:SHEET_ID, resource:{requests:reqs3} });
    } catch(e3) {
      console.error('Stock sheet error:', e3.message);
    }

    // ── HOJA 4: GUIA BINS ──
    try {
      const guiaRows = await fetchSupa('guia_registros?select=fecha,grupo,subgrupo,viaje,bins,obs&order=fecha.desc,grupo.asc,subgrupo.asc');
      if (guiaRows && guiaRows.length > 0) {
        // Create or find sheet
        const metaG = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
        const existG = metaG.data.sheets.map(s => s.properties.title);
        if (!existG.includes('Guia Bins')) {
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId: SHEET_ID,
            resource: { requests: [{ addSheet: { properties: { title: 'Guia Bins' } } }] }
          });
        }
        await sheets.spreadsheets.values.clear({ spreadsheetId: SHEET_ID, range: 'Guia Bins!A:Z' });

        const dataGuia = [
          ['ARATO MISSION PRODUCE — CONTROL DE GUIA DE BINS'],
          ['Actualizado:', new Date().toLocaleString('es-PE')],
          [],
          ['FECHA', 'GRUPO', 'SUBGRUPO', 'TOTAL BINS', 'LLEGADOS', 'FALTANTES', 'PENDIENTES', '% LLEGADO', 'OBS']
        ];
        guiaRows.forEach(r => {
          const total = r.viaje || 0;
          const llegados = r.bins || 0;
          const obs = r.obs || '';
          const faltantes = parseInt((obs.match(/F:(\d+)/)||[0,0])[1]) || 0;
          const pend = total - llegados - faltantes;
          const pct = total > 0 ? Math.round(llegados/total*100) : 0;
          dataGuia.push([r.fecha||'', r.grupo||'', r.subgrupo||'', total, llegados, faltantes, pend, pct+'%', obs]);
        });

        await sheets.spreadsheets.values.update({
          spreadsheetId: SHEET_ID, range: 'Guia Bins!A1',
          valueInputOption: 'RAW', resource: { values: dataGuia }
        });

        // Format
        const metaG2 = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
        const sG = metaG2.data.sheets.find(s => s.properties.title === 'Guia Bins');
        const sGid = sG.properties.sheetId;
        const reqsG = [
          merge(sGid,0,1,0,9), rep(sGid,0,1,0,9, fmt(C.VERDE,C.BLANCO,true,13)), rowH(sGid,0,30),
          merge(sGid,1,2,0,9), rep(sGid,1,2,0,9, fmt(C.VERDE2,C.BLANCO,false,9)), rowH(sGid,1,14),
          rep(sGid,3,4,0,9, fmt(C.VERDE,C.BLANCO,true,10)), rowH(sGid,3,22),
          [80,70,90,100,90,90,100,90,180].map((w,i)=>colW(sGid,i,w)),
        ].flat();
        guiaRows.forEach((r,i) => {
          const row = 4+i;
          const bg = i%2===0 ? C.GRIS : C.BLANCO;
          const pct = r.viaje>0 ? Math.round((r.bins||0)/r.viaje*100) : 0;
          reqsG.push(rep(sGid,row,row+1,0,9, fmt(bg,C.NEGRO,false,9)));
          // Color % column green if 100%, yellow if partial
          const pctColor = pct===100 ? C.VERDE_C : pct>0 ? C.AMARILLO_C : C.ROJO_C;
          const pctTxt = pct===100 ? C.VERDE : pct>0 ? C.AMARILLO : C.ROJO;
          reqsG.push(rep(sGid,row,row+1,7,8, fmt(pctColor,pctTxt,true,9)));
          reqsG.push(rowH(sGid,row,18));
        });
        await sheets.spreadsheets.batchUpdate({ spreadsheetId: SHEET_ID, resource: { requests: reqsG } });
      }
    } catch(e4) {
      console.error('Guia sheet error:', e4.message);
    }

    res.status(200).json({ ok:true, viajes:tv, bins:rowsBins ? rowsBins.length : 0, dias:dias.length });

  } catch(e) {
    console.error(e.message);
    res.status(500).json({ error: e.message });
  }
};
