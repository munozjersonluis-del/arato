const { google } = require('googleapis');

const SHEET_ID = '1a1MGpVTZOeB6YHoP9pVzSUuYABpAru-wlfqc-Uuck7g';

const credentials = {
  type:"service_account",project_id:"subtle-canto-498013-i0",
  private_key_id:"54b8f0eaad98de64813f1d1d9c8424d09780cb57",
  private_key:"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDRnu3nT3OcEfAg\nadFzwg/eSyomTXswJZYXZgWYMJvgFPREG93Gvex5mMz4zvavr9sIqUcMxc+JXwnV\n3x9Hm/wQBserM4ChTNLnnLcZ1U80YVmc0kQpYCbzOMNT6rpHoMnxZGAlOaMPsIiP\nr9GTi79ruEwGzMNpbDiI8Puvkt5mv29Nmaz3nANW2/IwwZk+NM2OmIZ/rdQ1JONs\nRmrAPErBU3ecklEn7BbUurDTUxtezhzMnOXhVeau3Ti0W5dKEZtc8UtorBlPS1Re\nWMsE/qv7CAwXWvSerA5CqJ7VbtNlfK7pzKutrJwumMmA+7W8rOq+H3awEHib9Mad\n7+dx5uUlAgMBAAECggEAMkT3T4vtsSVaHSPTT3vf+1KyOnpFSxAQdO8J82vgzbWo\nuHaoUkN0pNqAeUCExzAYinSx7b24Xfy1Kp117mHZamx90LAqrkPypgmenWrasjiQ\nWXvRTczZumVH7mVxo8DK/QExz2uJj7cpoK+sxkHyt138mXrcd/k0e56y9PF3NVNP\nEE8SPj42E0kTWCFfBvHWDUMuPEHBUdcN8T1eJED8cnCzquTSiax+XEyPHMRE96Zz\nLmQVM5T4mcC8Ahxzv+kQ1p9I/Rk/dQPfB9aRRE+ocSb8aOVypvWbgMLDrvgqZm5o\nxNbvehVDvd2Dcl8PCDgyh2K+ncofcArGmV293TAL9wKBgQD1JDay6rn3D4uQdYHO\n4FYoxViOnqy01trgpNoqzXejm3Md5DTYMs3i/+6p0sLbS96nwDOFofUF/M1NPwPv\nNnypqWNoU0DavmRoODqER0363ze/l3/4Kzixrh89c7MszqvpcGi3aQeJrIZ/I8U8\n+BTMkuKZF9qv1R0OcNNiYPEuSwKBgQDa5+27AAgy6DXgyZRkF+26HU2xBC4HbCkx\nXicS8N5UIl0el0h6Qrl9ScI5GcWj+0Lfu7zrM/tSyRa9jSpHW2B7jIIoTdSnvta2\n7CU/A5X7hrmj7jR3g1HVB01GvOk2TU7f4+gQ4w5IhvQxMzh8JsUkx91XS11akLZN\nEXCMiztUTwKBgDFqcmhQrtoh1RVyyo8EY/nmBjsBu3jc0tR0BtKYBqUBYgxFg22N\nmDlJNDghl0wTmDeipAAtLLJfSpdmu4lOJ4Uf8z0Fg05VEPJ9WzZtFUgcFSXXCWHi\nfJQ8sGl32EeRBdCR61oFnxJep+IbONhYfgDbHziTOW82e5v8nG/5cMTPAoGAduCY\no4LC8RJVn/sYULsF6JpdRJImhPVh8WNWCN0xf7MhqqkxPOPbY4SYqvWp9QFQMbv8\nPiZ+h1iYtttgaFvhK3cEf+q0X1wtsizPlUbXPj7NtY54g6aW2/8ZIh8Y7tpQyRk1\nP2ZurUhMeCN+uz06tlyrgOp2ieYoefXMjyZVU9UCgYEAjv3qH2v3755ySMLTTpfR\n6Hxj/ukwsAcAWypfPo4QzLN1OnxcnmiYUoDH9dvgUN7Op0+nVzs9P+BZrFpJQWwc\ntLftz90cNfoLBGnw8p1kE4OaiRILCryzDislolQGZyUZaQ9hP7ds/y44CEOuZK/9\np+9dylR6ctZk9pTnY8WdV7U=\n-----END PRIVATE KEY-----\n",
  client_email:"arato-sheets@subtle-canto-498013-i0.iam.gserviceaccount.com",
  client_id:"111629541873412682486",
  token_uri:"https://oauth2.googleapis.com/token"
};

function rgb(hex){return{red:parseInt(hex.slice(0,2),16)/255,green:parseInt(hex.slice(2,4),16)/255,blue:parseInt(hex.slice(4,6),16)/255};}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS')return res.status(200).end();

  try {
    const { records } = req.body;
    if(!records||!records.length) return res.status(200).json({ok:true,msg:'Sin registros'});

    const auth = new google.auth.GoogleAuth({credentials, scopes:['https://www.googleapis.com/auth/spreadsheets']});
    const sheets = google.sheets({version:'v4', auth});

    // Clear and write
    await sheets.spreadsheets.values.clear({spreadsheetId:SHEET_ID, range:'Hoja 1!A:Z'});

    const ROJO    = rgb('8B0000');
    const BLANCO  = {red:1,green:1,blue:1};
    const ROJO_C  = rgb('FFF5F5');
    const VERDE_C = rgb('C6EFCE');
    const VERDE_T = rgb('276221');
    const AMARI_C = rgb('FFEB9C');
    const AMARI_T = rgb('9C6500');
    const NEGRO   = rgb('111827');
    const GRIS    = rgb('F8FAFC');

    const headers = ['N°','FECHA EVALUACIÓN','APELLIDOS Y NOMBRES','DNI','SEXO','FECHA NACIMIENTO',
      'ÁREA','EMPRESA','PESO (kg)','TALLA (m)','IMC','DIAGNÓSTICO','FUR','ACO','ALERGIA',
      'ANTEC. PATOLÓGICOS','ANTEC. QUIRÚRGICOS','OBSERVACIONES','APTITUD MÉDICA','TELÉFONO'];

    const titleRows = [
      ['GRUPO ROCÍO - FICHAS MÉDICAS OCUPACIONALES','','','','','','','','','','','','','','','','','','',''],
      ['Actualizado: '+new Date().toLocaleString('es-PE'),'','','','','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','','','','','',''],
      headers
    ];

    const dataRows = records.map((r,i) => {
      const f=r.ficha, d=r.decl;
      const genero=f.genero==='Femenino'?'F':f.genero==='Masculino'?'M':d.genero||'';
      const aptitud=d.declaracion==='NO_TENER'?'APTO':d.declaracion==='TENER'?'APTO CON RESTRICCIÓN':'';
      const peso=parseFloat(f.peso)||'';
      const talla=parseFloat(f.talla)||'';
      const imc=peso&&talla?+(peso/(talla*talla)).toFixed(2):'';
      return [
        i+1, f.fechaExamen||d.fecha||'',
        (f.apellidosNombres||d.apellidosNombres||'').toUpperCase(),
        f.dni||'', genero, f.fechaNacimiento||d.fechaNacimiento||'',
        f.area||d.area||'', f.empresa||d.sede||'',
        peso, talla, imc, f.diagnostico||'', f.fur||'', f.aco||'',
        (f.alergias||d.alergias)?'SÍ':'NINGUNA',
        [f.bronquitis,f.hepatitis,f.tbc,f.asma].some(Boolean)?'PRESENTA':'NIEGA',
        f.otros||'NIEGA', f.observaciones||'', aptitud, f.telefono||''
      ];
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId:SHEET_ID, range:'Hoja 1!A1',
      valueInputOption:'RAW', resource:{values:[...titleRows,...dataRows]}
    });

    // Format
    const meta = await sheets.spreadsheets.get({spreadsheetId:SHEET_ID});
    const sid = meta.data.sheets[0].properties.sheetId;

    function cell(r1,c1,r2,c2,bg,fg,bold,sz){
      return{repeatCell:{range:{sheetId:sid,startRowIndex:r1,endRowIndex:r2,startColumnIndex:c1,endColumnIndex:c2},
        cell:{userEnteredFormat:{backgroundColor:bg,textFormat:{foregroundColor:fg,bold:!!bold,fontSize:sz||10},horizontalAlignment:'CENTER',verticalAlignment:'MIDDLE'}},
        fields:'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)'}};
    }
    function merge(r1,c1,r2,c2){return{mergeCells:{range:{sheetId:sid,startRowIndex:r1,endRowIndex:r2,startColumnIndex:c1,endColumnIndex:c2},mergeType:'MERGE_ALL'}};}
    function colW(c,w){return{updateDimensionProperties:{range:{sheetId:sid,dimension:'COLUMNS',startIndex:c,endIndex:c+1},properties:{pixelSize:w},fields:'pixelSize'}};}
    function rowH(r,h){return{updateDimensionProperties:{range:{sheetId:sid,dimension:'ROWS',startIndex:r,endIndex:r+1},properties:{pixelSize:h},fields:'pixelSize'}};}

    const reqs = [
      merge(0,0,1,20), cell(0,0,1,20,ROJO,BLANCO,true,14), rowH(0,34),
      merge(1,0,2,20), cell(1,0,2,20,rgb('6B0000'),BLANCO,false,9), rowH(1,14),
      cell(3,0,4,20,ROJO,BLANCO,true,10), rowH(3,24),
      [40,110,200,90,50,110,120,100,80,80,70,130,80,80,80,140,140,140,130,100].map((w,i)=>colW(i,w)),
    ].flat();

    dataRows.forEach((_,i) => {
      const row=4+i;
      const bg=i%2===0?GRIS:{red:1,green:1,blue:1};
      const apt=records[i].decl.declaracion;
      reqs.push(cell(row,0,row+1,20,bg,NEGRO,false,9));
      reqs.push(rowH(row,20));
      // Color aptitud
      const aptBg=apt==='NO_TENER'?VERDE_C:apt==='TENER'?AMARI_C:bg;
      const aptTxt=apt==='NO_TENER'?VERDE_T:apt==='TENER'?AMARI_T:NEGRO;
      reqs.push(cell(row,18,row+1,19,aptBg,aptTxt,true,9));
    });

    // Resumen
    const total=records.length;
    const aptos=records.filter(r=>r.decl.declaracion==='NO_TENER').length;
    const conRest=records.filter(r=>r.decl.declaracion==='TENER').length;
    const noAptos=total-aptos-conRest;
    const resRow=4+dataRows.length+2;
    const resData=[
      ['RESUMEN','','','','','','','','','','','','','','','','','','',''],
      ['Total','Aptos','Aptos con Restricción','No Aptos','','','','','','','','','','','','','','','',''],
      [total,aptos,conRest,noAptos,'','','','','','','','','','','','','','','','']
    ];
    await sheets.spreadsheets.values.update({
      spreadsheetId:SHEET_ID, range:`Hoja 1!A${resRow+1}`,
      valueInputOption:'RAW', resource:{values:resData}
    });
    reqs.push(cell(resRow,0,resRow+1,20,ROJO,BLANCO,true,12));
    reqs.push(cell(resRow+1,0,resRow+2,4,ROJO,BLANCO,true,10));
    reqs.push(cell(resRow+2,0,resRow+3,1,VERDE_C,VERDE_T,true,12));
    reqs.push(cell(resRow+2,1,resRow+3,2,VERDE_C,VERDE_T,true,12));
    reqs.push(cell(resRow+2,2,resRow+3,3,AMARI_C,AMARI_T,true,12));
    reqs.push(cell(resRow+2,3,resRow+3,4,rgb('FFC7CE'),rgb('9C0006'),true,12));

    await sheets.spreadsheets.batchUpdate({spreadsheetId:SHEET_ID, resource:{requests:reqs}});

    res.status(200).json({ok:true, registros:records.length});
  } catch(e) {
    console.error(e.message);
    res.status(500).json({error:e.message});
  }
};
