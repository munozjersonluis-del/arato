const { google } = require('googleapis');
const https = require('https');

const SHEET_ID = '1wKwRNcox1Ydnqwz9CkDP1_hheaAnWO8y0xWcuq9hTlk';
const SUPA_HOST = 'rqvcvffyynpnighzwxju.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxdmN2ZmZ5eW5wbmlnaHp3eGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MjgyNDcsImV4cCI6MjA5MzMwNDI0N30.fFufNEdRvAzl6O6BqtTbx83O3Eg8Wd7gACNJDGQKga4';

const credentials = {
  type:"service_account",project_id:"subtle-canto-498013-i0",
  private_key_id:"54b8f0eaad98de64813f1d1d9c8424d09780cb57",
  private_key:"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDRnu3nT3OcEfAg\nadFzwg/eSyomTXswJZYXZgWYMJvgFPREG93Gvex5mMz4zvavr9sIqUcMxc+JXwnV\n3x9Hm/wQBserM4ChTNLnnLcZ1U80YVmc0kQpYCbzOMNT6rpHoMnxZGAlOaMPsIiP\nr9GTi79ruEwGzMNpbDiI8Puvkt5mv29Nmaz3nANW2/IwwZk+NM2OmIZ/rdQ1JONs\nRmrAPErBU3ecklEn7BbUurDTUxtezhzMnOXhVeau3Ti0W5dKEZtc8UtorBlPS1Re\nWMsE/qv7CAwXWvSerA5CqJ7VbtNlfK7pzKutrJwumMmA+7W8rOq+H3awEHib9Mad\n7+dx5uUlAgMBAAECggEAMkT3T4vtsSVaHSPTT3vf+1KyOnpFSxAQdO8J82vgzbWo\nuHaoUkN0pNqAeUCExzAYinSx7b24Xfy1Kp117mHZamx90LAqrkPypgmenWrasjiQ\nWXvRTczZumVH7mVxo8DK/QExz2uJj7cpoK+sxkHyt138mXrcd/k0e56y9PF3NVNP\nEE8SPj42E0kTWCFfBvHWDUMuPEHBUdcN8T1eJED8cnCzquTSiax+XEyPHMRE96Zz\nLmQVM5T4mcC8Ahxzv+kQ1p9I/Rk/dQPfB9aRRE+ocSb8aOVypvWbgMLDrvgqZm5o\nxNbvehVDvd2Dcl8PCDgyh2K+ncofcArGmV293TAL9wKBgQD1JDay6rn3D4uQdYHO\n4FYoxViOnqy01trgpNoqzXejm3Md5DTYMs3i/+6p0sLbS96nwDOFofUF/M1NPwPv\nNnypqWNoU0DavmRoODqER0363ze/l3/4Kzixrh89c7MszqvpcGi3aQeJrIZ/I8U8\n+BTMkuKZF9qv1R0OcNNiYPEuSwKBgQDa5+27AAgy6DXgyZRkF+26HU2xBC4HbCkx\nXicS8N5UIl0el0h6Qrl9ScI5GcWj+0Lfu7zrM/tSyRa9jSpHW2B7jIIoTdSnvta2\n7CU/A5X7hrmj7jR3g1HVB01GvOk2TU7f4+gQ4w5IhvQxMzh8JsUkx91XS11akLZN\nEXCMiztUTwKBgDFqcmhQrtoh1RVyyo8EY/nmBjsBu3jc0tR0BtKYBqUBYgxFg22N\nmDlJNDghl0wTmDeipAAtLLJfSpdmu4lOJ4Uf8z0Fg05VEPJ9WzZtFUgcFSXXCWHi\nfJQ8sGl32EeRBdCR61oFnxJep+IbONhYfgDbHziTOW82e5v8nG/5cMTPAoGAduCY\no4LC8RJVn/sYULsF6JpdRJImhPVh8WNWCN0xf7MhqqkxPOPbY4SYqvWp9QFQMbv8\nPiZ+h1iYtttgaFvhK3cEf+q0X1wtsizPlUbXPj7NtY54g6aW2/8ZIh8Y7tpQyRk1\nP2ZurUhMeCN+uz06tlyrgOp2ieYoefXMjyZVU9UCgYEAjv3qH2v3755ySMLTTpfR\n6Hxj/ukwsAcAWypfPo4QzLN1OnxcnmiYUoDH9dvgUN7Op0+nVzs9P+BZrFpJQWwc\ntLftz90cNfoLBGnw8p1kE4OaiRILCryzDislolQGZyUZaQ9hP7ds/y44CEOuZK/9\np+9dylR6ctZk9pTnY8WdV7U=\n-----END PRIVATE KEY-----\n",
  client_email:"arato-sheets@subtle-canto-498013-i0.iam.gserviceaccount.com",
  client_id:"111629541873412682486",
  token_uri:"https://oauth2.googleapis.com/token"
};

function fetchSupa(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SUPA_HOST,
      path: '/rest/v1/' + path,
      headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY }
    };
    https.get(options, (r) => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => { try { resolve(JSON.parse(d)); } catch(e) { resolve([]); } });
    }).on('error', reject);
  });
}

function rgb(hex) {
  return { red: parseInt(hex.slice(0,2),16)/255, green: parseInt(hex.slice(2,4),16)/255, blue: parseInt(hex.slice(4,6),16)/255 };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const auth = new google.auth.GoogleAuth({ credentials, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
    const sheets = google.sheets({ version: 'v4', auth });

    // Obtener hojas existentes
    const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const existing = meta.data.sheets.map(s => s.properties.title);

    // ── Hoja 1: Stock de Bins ──
    const movs = await fetchSupa('stock_movimientos?select=tipo,cantidad,fecha,obs&order=created_at.asc');
    let stk = 0;
    const rowsMovs = movs.map((m, i) => {
      stk += m.tipo === 'ingreso' ? (m.cantidad||0) : -(m.cantidad||0);
      return [i+1, m.fecha||'', m.tipo==='ingreso'?'INGRESO (+)':'SALIDA AVOCADO (−)', m.cantidad, stk, m.obs||''];
    });

    // Crear hoja si no existe
    if (!existing.includes('Stock Bins')) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        resource: { requests: [{ addSheet: { properties: { title: 'Stock Bins' } } }] }
      });
    }

    // Limpiar y escribir datos
    await sheets.spreadsheets.values.clear({ spreadsheetId: SHEET_ID, range: 'Stock Bins!A:Z' });
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: 'Stock Bins!A1',
      valueInputOption: 'RAW',
      resource: { values: [
        ['ARATO MISSION PRODUCE — CONTROL DE STOCK DE BINS VACÍOS'],
        ['Stock = Ingreso Acopio − Salida Avocado'],
        ['Actualizado:', new Date().toLocaleString('es-PE')],
        [],
        ['#','FECHA','TIPO','CANTIDAD','STOCK','OBSERVACION'],
        ...rowsMovs,
        [],
        ['','','','STOCK ACTUAL ->', stk, '']
      ]}
    });

    // Aplicar colores
    const metaNew = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const s1 = metaNew.data.sheets.find(s => s.properties.title === 'Stock Bins');
    const sid = s1.properties.sheetId;

    const VERDE = rgb('1A5C38'), VERDE2 = rgb('2D6A4F'), VERDE_C = rgb('DCFCE7'), VERDE_TXT = rgb('15803D');
    const ROJO = rgb('DC2626'), ROJO_C = rgb('FEE2E2');
    const AZUL = rgb('1D4ED8'), AZUL_C = rgb('DBEAFE');
    const BLANCO = {red:1,green:1,blue:1}, GRIS = rgb('F8FAFC'), NEGRO = rgb('1E293B');

    function cell(r1,c1,r2,c2,bg,fg,bold,sz) {
      return { repeatCell: { range:{sheetId:sid,startRowIndex:r1,endRowIndex:r2,startColumnIndex:c1,endColumnIndex:c2},
        cell:{userEnteredFormat:{backgroundColor:bg,textFormat:{foregroundColor:fg,bold:!!bold,fontSize:sz||10},horizontalAlignment:'CENTER',verticalAlignment:'MIDDLE'}},
        fields:'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)'
      }};
    }
    function merge(r1,c1,r2,c2) {
      return { mergeCells: { range:{sheetId:sid,startRowIndex:r1,endRowIndex:r2,startColumnIndex:c1,endColumnIndex:c2}, mergeType:'MERGE_ALL' }};
    }
    function colW(c,w) {
      return { updateDimensionProperties: { range:{sheetId:sid,dimension:'COLUMNS',startIndex:c,endIndex:c+1}, properties:{pixelSize:w}, fields:'pixelSize' }};
    }
    function rowH(r,h) {
      return { updateDimensionProperties: { range:{sheetId:sid,dimension:'ROWS',startIndex:r,endIndex:r+1}, properties:{pixelSize:h}, fields:'pixelSize' }};
    }

    const reqs = [
      merge(0,0,1,6), cell(0,0,1,6,VERDE,BLANCO,true,13), rowH(0,32),
      merge(1,0,2,6), cell(1,0,2,6,VERDE2,BLANCO,false,9), rowH(1,16),
      cell(4,0,5,6,VERDE,BLANCO,true,10), rowH(4,22),
      [30,100,160,80,80,200].map((w,i)=>colW(i,w)),
    ].flat();

    rowsMovs.forEach((row,i) => {
      const r = 5+i, isIng = row[2].includes('INGRESO'), bg = i%2===0?GRIS:BLANCO;
      reqs.push(cell(r,0,r+1,6,bg,NEGRO,false,9));
      reqs.push(cell(r,2,r+1,3,isIng?VERDE_C:ROJO_C,isIng?VERDE_TXT:ROJO,true,9));
      reqs.push(cell(r,4,r+1,5,AZUL_C,AZUL,true,11));
      reqs.push(rowH(r,18));
    });

    const totRow = 5 + rowsMovs.length + 1;
    reqs.push(cell(totRow,3,totRow+1,4,VERDE2,BLANCO,true,10));
    reqs.push(cell(totRow,4,totRow+1,5,VERDE,BLANCO,true,14));
    reqs.push(rowH(totRow,28));

    await sheets.spreadsheets.batchUpdate({ spreadsheetId: SHEET_ID, resource: { requests: reqs } });

    // ── Hoja 2: Stock por Módulo ──
    const modulos = await fetchSupa('stock_modulos?select=modulo,cantidad,fecha,obs,tipo&order=created_at.asc');
    if (modulos.length > 0) {
      if (!existing.includes('Stock Modulos')) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SHEET_ID,
          resource: { requests: [{ addSheet: { properties: { title: 'Stock Modulos' } } }] }
        });
      }
      const modMap = {};
      modulos.forEach(r => {
        if (!modMap[r.modulo]) modMap[r.modulo] = 0;
        modMap[r.modulo] += r.cantidad||0;
      });
      const totalMod = Object.values(modMap).reduce((s,v)=>s+Math.max(0,v),0);
      const modsActivos = Object.keys(modMap).filter(m=>modMap[m]>0).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}));

      await sheets.spreadsheets.values.clear({ spreadsheetId: SHEET_ID, range: 'Stock Modulos!A:Z' });
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID, range: 'Stock Modulos!A1', valueInputOption: 'RAW',
        resource: { values: [
          ['ARATO MISSION PRODUCE — STOCK DE BINS POR MODULO'],
          ['Actualizado:', new Date().toLocaleString('es-PE')],
          [],
          ['MODULO','STOCK ACTUAL','',''],
          ...modsActivos.map(m=>[m, modMap[m],'','']),
          [],
          ['TOTAL MODULOS', totalMod,'',''],
          ['STOCK GENERAL', stk,'',''],
          ['DIFERENCIA', stk-totalMod,'',''],
        ]}
      });
    }

    res.status(200).json({ ok: true, movimientos: rowsMovs.length, stock: stk });

  } catch(e) {
    console.error(e.message);
    res.status(500).json({ error: e.message });
  }
};
