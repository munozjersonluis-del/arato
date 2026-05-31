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

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    const sheets = google.sheets({ version: 'v4', auth });

    if (req.method === 'GET') {
      return res.status(200).json({ ok: true, message: 'Sheets API funcionando' });
    }

    const { viajes = [], camiones = [] } = req.body || {};

    function pBins(v) { try { return JSON.parse(v.bins||'[]'); } catch { return []; } }
    function pRets(v) { try { return JSON.parse(v.retornos||'[]').flatMap(r => r.bins||[]); } catch { return []; } }

    // Limpiar y escribir VIAJES
    const hdrsV = ['#','FECHA','GRUPO','MODULO','MAQUINA','PROVEEDOR','OPERADOR','PORTABINERO','HORA SAL.','BINS ENV.','BINS RET.','FALTANTES','TONELADAS','ESTADO'];
    const rowsV = viajes.map((v,i) => {
      const bins=pBins(v),rets=pRets(v);
      return [i+1,v.fecha,v.grupo,v.modulo,v.maquina||'',v.proveedor||'',v.operador,v.portabinero,v.hora_salida,bins.length,rets.length,bins.length-rets.length,+(v.tn_total||0).toFixed(3),v.cerrado?'Cerrado':'Activo'];
    });

    await sheets.spreadsheets.values.clear({ spreadsheetId: SHEET_ID, range: 'Hoja 1!A:Z' });
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID, range: 'Hoja 1!A1',
      valueInputOption: 'RAW',
      resource: { values: [hdrsV, ...rowsV] }
    });

    // Escribir BINS en Hoja 2 (si existe)
    try {
      const hdrsBins = ['#','CODIGO BIN','FECHA','GRUPO','MODULO','MAQUINA','OPERADOR','PORTABINERO','HORA SALIDA','ESTADO','VIAJE #'];
      const rowsBins = [];
      let bn = 1;
      viajes.forEach((v,vi) => {
        const bins=pBins(v),rets=pRets(v);
        bins.forEach(cod => {
          rowsBins.push([bn++,cod,v.fecha,v.grupo,v.modulo,v.maquina||'',v.operador,v.portabinero,v.hora_salida,rets.includes(cod)?'Retornado':'Pendiente',vi+1]);
        });
      });
      await sheets.spreadsheets.values.clear({ spreadsheetId: SHEET_ID, range: 'Hoja 2!A:Z' });
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID, range: 'Hoja 2!A1',
        valueInputOption: 'RAW',
        resource: { values: [hdrsBins, ...rowsBins] }
      });
    } catch(e2) {}

    res.status(200).json({ ok: true, viajes: rowsV.length, message: 'Sincronizado OK' });

  } catch(e) {
    console.error(e.message);
    res.status(500).json({ error: e.message });
  }
};
