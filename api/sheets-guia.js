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

    // Fetch guia data
    const rows = await fetchSupa('guia_registros?select=fecha,grupo,subgrupo,viaje,bins,obs&order=fecha.desc,grupo.asc,subgrupo.asc');

    if (!rows || !rows.length) {
      return res.status(200).json({ ok: true, msg: 'Sin datos en guia_registros' });
    }

    // Get or create sheet
    const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const existing = meta.data.sheets.map(s => s.properties.title);
    if (!existing.includes('Guia Bins')) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        resource: { requests: [{ addSheet: { properties: { title: 'Guia Bins' } } }] }
      });
    }

    // Clear and write data
    await sheets.spreadsheets.values.clear({ spreadsheetId: SHEET_ID, range: 'Guia Bins!A:Z' });

    const data = [
      ['ARATO MISSION PRODUCE — CONTROL DE GUIA DE BINS', '', '', '', '', '', '', '', ''],
      ['Actualizado: ' + new Date().toLocaleString('es-PE'), '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', ''],
      ['FECHA', 'GRUPO', 'SUBGRUPO', 'TOTAL BINS', 'LLEGADOS', 'FALTANTES', 'PENDIENTES', '% LLEGADO', 'OBSERVACION']
    ];

    rows.forEach(r => {
      const total = r.viaje || 0;
      const llegados = r.bins || 0;
      const obs = r.obs || '';
      const faltMatch = obs.match(/F:(\d+)/);
      const faltantes = faltMatch ? parseInt(faltMatch[1]) : 0;
      const pend = Math.max(0, total - llegados - faltantes);
      const pct = total > 0 ? Math.round(llegados / total * 100) : 0;
      data.push([r.fecha||'', r.grupo||'', r.subgrupo||'', total, llegados, faltantes, pend, pct + '%', obs]);
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: 'Guia Bins!A1',
      valueInputOption: 'RAW',
      resource: { values: data }
    });

    // Apply formatting
    const meta2 = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    const sheet = meta2.data.sheets.find(s => s.properties.title === 'Guia Bins');
    const sid = sheet.properties.sheetId;

    const VERDE = rgb('1A5C38'), VERDE2 = rgb('2D6A4F'), VERDE_C = rgb('DCFCE7');
    const VERDE_TXT = rgb('15803D'), AMARILLO_C = rgb('FEF3C7'), AMARILLO = rgb('D97706');
    const ROJO_C = rgb('FEE2E2'), ROJO = rgb('DC2626');
    const BLANCO = {red:1,green:1,blue:1}, GRIS = rgb('F8FAFC'), NEGRO = rgb('111827');

    function cell(r1,c1,r2,c2,bg,fg,bold,sz) {
      return { repeatCell: {
        range:{sheetId:sid,startRowIndex:r1,endRowIndex:r2,startColumnIndex:c1,endColumnIndex:c2},
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
      merge(0,0,1,9), cell(0,0,1,9,VERDE,BLANCO,true,13), rowH(0,32),
      merge(1,0,2,9), cell(1,0,2,9,VERDE2,BLANCO,false,9), rowH(1,16),
      cell(3,0,4,9,VERDE,BLANCO,true,10), rowH(3,22),
      [80,60,90,90,80,80,90,80,180].map((w,i)=>colW(i,w)),
    ].flat();

    rows.forEach((r, i) => {
      const row = 4 + i;
      const bg = i % 2 === 0 ? GRIS : BLANCO;
      const pct = r.viaje > 0 ? Math.round((r.bins||0) / r.viaje * 100) : 0;
      reqs.push(cell(row,0,row+1,9,bg,NEGRO,false,9));
      reqs.push(rowH(row,18));
      // Color % column
      const pctBg = pct===100 ? VERDE_C : pct>0 ? AMARILLO_C : ROJO_C;
      const pctTxt = pct===100 ? VERDE_TXT : pct>0 ? AMARILLO : ROJO;
      reqs.push(cell(row,7,row+1,8,pctBg,pctTxt,true,9));
    });

    await sheets.spreadsheets.batchUpdate({ spreadsheetId: SHEET_ID, resource: { requests: reqs } });

    res.status(200).json({ ok: true, registros: rows.length });

  } catch(e) {
    console.error(e.message);
    res.status(500).json({ error: e.message });
  }
};
