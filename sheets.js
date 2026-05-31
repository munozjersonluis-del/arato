import { google } from 'googleapis';

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

async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  return google.sheets({ version: 'v4', auth });
}

async function ensureSheet(sheets, title, headers, color) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const existing = meta.data.sheets.find(s => s.properties.title === title);
  
  if (!existing) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      resource: {
        requests: [{
          addSheet: {
            properties: {
              title,
              tabColor: color
            }
          }
        }]
      }
    });
  }

  // Write headers with formatting
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${title}!A1`,
    valueInputOption: 'RAW',
    resource: { values: [headers] }
  });

  return meta.data.sheets.find(s => s.properties.title === title)?.properties?.sheetId;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { viajes = [], camiones = [], action = 'sync' } = req.body;
    const sheets = await getSheets();

    function pBins(v) { try { return JSON.parse(v.bins||'[]'); } catch { return []; } }
    function pRets(v) { try { return JSON.parse(v.retornos||'[]').flatMap(r => r.bins||[]); } catch { return []; } }

    // ── HOJA: VIAJES ──
    const hdrsViajes = ['#','FECHA','GRUPO','MÓDULO','MÁQUINA','PROVEEDOR','OPERADOR','PORTABINERO','HORA SAL.','BINS ENV.','BINS RET.','FALTANTES','TONELADAS','ESTADO'];
    await ensureSheet(sheets, 'Viajes', hdrsViajes, {red:0.1,green:0.36,blue:0.22});

    const rowsViajes = viajes.map((v,i) => {
      const bins=pBins(v),rets=pRets(v);
      return [i+1,v.fecha,v.grupo,v.modulo,v.maquina||'',v.proveedor||'',v.operador,v.portabinero,v.hora_salida,bins.length,rets.length,bins.length-rets.length,+(v.tn_total||0).toFixed(3),v.cerrado?'Cerrado':'Activo'];
    });

    if (rowsViajes.length) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: 'Viajes!A2',
        valueInputOption: 'RAW',
        resource: { values: rowsViajes }
      });
    }

    // ── HOJA: BINS ──
    const hdrsBins = ['#','CÓDIGO BIN','FECHA','GRUPO','MÓDULO','MÁQUINA','OPERADOR','PORTABINERO','HORA SALIDA','ESTADO','VIAJE #'];
    await ensureSheet(sheets, 'Detalle Bins', hdrsBins, {red:0.12,green:0.23,blue:0.37});

    const rowsBins = [];
    let binNum = 1;
    viajes.forEach((v,vi) => {
      const bins=pBins(v),rets=pRets(v);
      bins.forEach(cod => {
        rowsBins.push([binNum++,cod,v.fecha,v.grupo,v.modulo,v.maquina||'',v.operador,v.portabinero,v.hora_salida,rets.includes(cod)?'Retornado':'Pendiente',vi+1]);
      });
    });

    if (rowsBins.length) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: 'Detalle Bins!A2',
        valueInputOption: 'RAW',
        resource: { values: rowsBins }
      });
    }

    // ── HOJA: CAMIONES ──
    const hdrsCam = ['FECHA','PLACA','VIAJE #','BINS','TONELADAS','HORA SAL.','HORA RET.','TIEMPO (min)','ESTADO'];
    await ensureSheet(sheets, 'Camiones', hdrsCam, {red:0.57,green:0.25,blue:0.05});

    const rowsCam = camiones.filter(c=>c.numero_viaje>0).map(c => [
      c.fecha,c.placa,c.numero_viaje,c.bins_carga||0,+(c.tn_carga||0).toFixed(3),
      c.hora_salida||'',c.hora_retorno||'',
      c.tiempo_viaje_ms?Math.round(c.tiempo_viaje_ms/60000):'',
      c.completado?'Completado':'En ruta'
    ]);

    if (rowsCam.length) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: 'Camiones!A2',
        valueInputOption: 'RAW',
        resource: { values: rowsCam }
      });
    }

    // ── HOJA: DASHBOARD ──
    const tv=viajes.length;
    const te=viajes.reduce((s,v)=>s+pBins(v).length,0);
    const tr=viajes.reduce((s,v)=>s+pRets(v).length,0);
    const ttn=viajes.reduce((s,v)=>s+(v.tn_total||0),0);
    const efic=te>0?(tr/te*100).toFixed(1)+'%':'0%';
    const dias=[...new Set(viajes.map(v=>v.fecha))].sort();

    const dashData = [
      ['ARATO MISSION PRODUCE — REPORTE OPERACIONAL','','',''],
      ['Actualizado:', new Date().toLocaleString('es-CL'),'',''],
      [''],
      ['RESUMEN GENERAL','','',''],
      ['Días trabajados', dias.length, 'Total viajes', tv],
      ['Bins enviados', te, 'Bins retornados', tr],
      ['Toneladas cosechadas', +ttn.toFixed(3), 'Eficiencia', efic],
      ['Faltantes', te-tr, '', ''],
    ];

    await ensureSheet(sheets, 'Dashboard', ['INDICADOR','VALOR','INDICADOR','VALOR'], {red:0.1,green:0.36,blue:0.22});
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: 'Dashboard!A1',
      valueInputOption: 'RAW',
      resource: { values: dashData }
    });

    res.status(200).json({ 
      ok: true, 
      viajes: rowsViajes.length,
      bins: rowsBins.length,
      camiones: rowsCam.length
    });

  } catch(e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
