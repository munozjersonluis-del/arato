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

const META = 2.3;
function r1(n){return Math.round((n||0)*10)/10;}
function r2(n){return Math.round((n||0)*100)/100;}

function fetchSupa(path){
  return new Promise((resolve,reject)=>{
    const options={hostname:SUPA_HOST,path:'/rest/v1/'+path,headers:{'apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY}};
    https.get(options,(r)=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>{try{resolve(JSON.parse(d));}catch(e){resolve([]);}});}).on('error',reject);
  });
}

function rgb(hex){return{red:parseInt(hex.slice(0,2),16)/255,green:parseInt(hex.slice(2,4),16)/255,blue:parseInt(hex.slice(4,6),16)/255};}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  if(req.method==='OPTIONS')return res.status(200).end();
  try {
    const auth = new google.auth.GoogleAuth({credentials,scopes:['https://www.googleapis.com/auth/spreadsheets']});
    const sheets = google.sheets({version:'v4',auth});
    const rows = await fetchSupa('maquinaria_registros?select=*&order=fecha.asc,maquina.asc');
    if(!rows||!rows.length)return res.status(200).json({ok:true,msg:'Sin datos'});

    const meta = await sheets.spreadsheets.get({spreadsheetId:SHEET_ID});
    const existing = meta.data.sheets.map(s=>s.properties.title);

    // ── HOJA 1: BASE DE DATOS ──
    if(!existing.includes('Base_Datos')){
      await sheets.spreadsheets.batchUpdate({spreadsheetId:SHEET_ID,resource:{requests:[{addSheet:{properties:{title:'Base_Datos',index:0}}}]}});
    }
    await sheets.spreadsheets.values.clear({spreadsheetId:SHEET_ID,range:'Base_Datos!A:Z'});

    const baseDatos = [
      ['REGISTRO CONTINUO DE MAQUINARIA Y CAMPO','','','','','','','','','','',''],
      ['','','','','','','','','','','',''],
      ['','','','','','','','','','','',''],
      ['Maquina','Operador','Fecha','Hora Inicio','Hora Fin','Hrs Ejec','Bins','Toneladas','TN/Hr Real','Meta','Estado','Modulos']
    ];
    rows.forEach(r=>{
      baseDatos.push([
        r.maquina||'',
        r.operador||'',
        r.fecha||'',
        r.hora_inicio||'',
        r.hora_fin||'',
        r1(r.hrs_ejec),
        r1(r.bins),
        r2(r.toneladas),
        r2(r.tn_hr),
        r.meta||META,
        r.estado||'',
        r.modulos||''
      ]);
    });

    await sheets.spreadsheets.values.update({spreadsheetId:SHEET_ID,range:'Base_Datos!A1',valueInputOption:'RAW',resource:{values:baseDatos}});

    // Format Base_Datos
    const meta2 = await sheets.spreadsheets.get({spreadsheetId:SHEET_ID});
    const s1 = meta2.data.sheets.find(s=>s.properties.title==='Base_Datos');
    const sid1 = s1.properties.sheetId;

    const VERDE=rgb('1A5C38'),VERDE2=rgb('2D6A4F'),VERDE_C=rgb('DCFCE7'),VERDE_T=rgb('15803D');
    const ROJO=rgb('DC2626'),ROJO_C=rgb('FEE2E2'),AMARILLO=rgb('D97706'),AMARILLO_C=rgb('FEF3C7');
    const BLANCO={red:1,green:1,blue:1},GRIS=rgb('F8FAFC'),NEGRO=rgb('111827');

    function cell(sid,r1i,c1,r2i,c2,bg,fg,bold,sz){
      return{repeatCell:{range:{sheetId:sid,startRowIndex:r1i,endRowIndex:r2i,startColumnIndex:c1,endColumnIndex:c2},
        cell:{userEnteredFormat:{backgroundColor:bg,textFormat:{foregroundColor:fg,bold:!!bold,fontSize:sz||10},horizontalAlignment:'CENTER',verticalAlignment:'MIDDLE'}},
        fields:'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)'}};
    }
    function merge(sid,r1i,c1,r2i,c2){return{mergeCells:{range:{sheetId:sid,startRowIndex:r1i,endRowIndex:r2i,startColumnIndex:c1,endColumnIndex:c2},mergeType:'MERGE_ALL'}};}
    function colW(sid,c,w){return{updateDimensionProperties:{range:{sheetId:sid,dimension:'COLUMNS',startIndex:c,endIndex:c+1},properties:{pixelSize:w},fields:'pixelSize'}};}
    function rowH(sid,r,h){return{updateDimensionProperties:{range:{sheetId:sid,dimension:'ROWS',startIndex:r,endIndex:r+1},properties:{pixelSize:h},fields:'pixelSize'}};}

    const reqs1 = [
      merge(sid1,0,0,1,12), cell(sid1,0,0,1,12,VERDE,BLANCO,true,14), rowH(sid1,0,36),
      cell(sid1,3,0,4,12,VERDE2,BLANCO,true,10), rowH(sid1,3,24),
      [100,100,90,90,80,70,70,90,80,60,70,120].map((w,i)=>colW(sid1,i,w)),
    ].flat();

    rows.forEach((_,i)=>{
      const row=4+i;
      const bg=i%2===0?GRIS:BLANCO;
      const r=rows[i];
      const tnhr=r.tn_hr||0;
      const isBien=tnhr>=META;
      const isReg=tnhr>=META*0.7;
      const estadoBg=isBien?VERDE_C:isReg?AMARILLO_C:ROJO_C;
      const estadoTxt=isBien?VERDE_T:isReg?AMARILLO:ROJO;
      reqs1.push(cell(sid1,row,0,row+1,12,bg,NEGRO,false,9));
      reqs1.push(cell(sid1,row,8,row+1,9,bg,isBien?VERDE_T:isReg?AMARILLO:ROJO,true,10)); // TN/Hr
      reqs1.push(cell(sid1,row,10,row+1,11,estadoBg,estadoTxt,true,9)); // Estado
      reqs1.push(rowH(sid1,row,18));
    });
    await sheets.spreadsheets.batchUpdate({spreadsheetId:SHEET_ID,resource:{requests:reqs1}});

    // ── HOJA 2: DASHBOARD ──
    if(!existing.includes('Dashboard_Graficos')){
      await sheets.spreadsheets.batchUpdate({spreadsheetId:SHEET_ID,resource:{requests:[{addSheet:{properties:{title:'Dashboard_Graficos'}}}]}});
    }
    await sheets.spreadsheets.values.clear({spreadsheetId:SHEET_ID,range:'Dashboard_Graficos!A:Z'});

    // Resumen por maquina
    const maqMap={};
    rows.forEach(r=>{
      if(!maqMap[r.maquina])maqMap[r.maquina]={bins:0,tons:0,hrs:0,count:0};
      maqMap[r.maquina].bins+=r.bins||0;
      maqMap[r.maquina].tons+=r.toneladas||0;
      maqMap[r.maquina].hrs+=r.hrs_ejec||0;
      maqMap[r.maquina].count++;
    });
    const maqNames=Object.keys(maqMap).sort();

    // Rendimiento cronologico
    const fechas=[...new Set(rows.map(r=>r.fecha))].sort();

    const dash=[
      ['PANEL DE CONTROL GENERAL Y FILTRADO POR FECHAS','','','','',''],
      ['','','','','',''],
      ['','','','','',''],
      ['Resumen General por Maquina (Consolidado Historico)','','','','',''],
      ['Maquina','Total Horas','Total Bins','Total Toneladas','TN/Hr Promedio','Estado Global'],
    ];
    maqNames.forEach(m=>{
      const d=maqMap[m];
      const prom=d.hrs>0?r2(d.tons/d.hrs):0;
      const estado=prom>=META?'BIEN':prom>=META*0.7?'REGULAR':'MAL';
      dash.push([m,r1(d.hrs),r1(d.bins),r2(d.tons),prom,estado]);
    });
    dash.push(['','','','','','']);
    dash.push(['','','','','','']);
    dash.push(['Rendimiento Cronologico Diario (Evolucion por Fechas)','','','','','']);

    // Header row for chart data
    const chartHeader=['Fecha',...maqNames.map(m=>'TN/Hr '+m),'Meta Minima'];
    dash.push(chartHeader);
    fechas.forEach(f=>{
      const row=[f];
      maqNames.forEach(m=>{
        const rec=rows.find(r=>r.fecha===f&&r.maquina===m);
        row.push(rec?r2(rec.tn_hr):0);
      });
      row.push(META);
      dash.push(row);
    });

    await sheets.spreadsheets.values.update({spreadsheetId:SHEET_ID,range:'Dashboard_Graficos!A1',valueInputOption:'RAW',resource:{values:dash}});

    // Format Dashboard
    const meta3=await sheets.spreadsheets.get({spreadsheetId:SHEET_ID});
    const s2=meta3.data.sheets.find(s=>s.properties.title==='Dashboard_Graficos');
    const sid2=s2.properties.sheetId;

    const reqs2=[
      merge(sid2,0,0,1,6), cell(sid2,0,0,1,6,VERDE,BLANCO,true,13), rowH(sid2,0,30),
      merge(sid2,3,0,4,6), cell(sid2,3,0,4,6,VERDE2,BLANCO,true,11),
      cell(sid2,4,0,5,6,VERDE,BLANCO,true,10), rowH(sid2,4,22),
      [140,100,100,110,110,90].map((w,i)=>colW(sid2,i,w)),
    ].flat();

    maqNames.forEach((_,i)=>{
      const row=5+i;
      const bg=i%2===0?GRIS:BLANCO;
      const d=maqMap[maqNames[i]];
      const prom=d.hrs>0?r2(d.tons/d.hrs):0;
      const isBien=prom>=META;
      reqs2.push(cell(sid2,row,0,row+1,6,bg,NEGRO,false,10));
      reqs2.push(cell(sid2,row,4,row+1,5,bg,isBien?VERDE_T:ROJO,true,10));
      reqs2.push(cell(sid2,row,5,row+1,6,isBien?VERDE_C:ROJO_C,isBien?VERDE_T:ROJO,true,10));
      reqs2.push(rowH(sid2,row,20));
    });

    const cronRow=5+maqNames.length+3;
    reqs2.push(merge(sid2,cronRow,0,cronRow+1,maqNames.length+2));
    reqs2.push(cell(sid2,cronRow,0,cronRow+1,maqNames.length+2,VERDE2,BLANCO,true,11));
    reqs2.push(cell(sid2,cronRow+1,0,cronRow+2,maqNames.length+2,VERDE,BLANCO,true,10));
    fechas.forEach((_,i)=>{
      const row=cronRow+2+i;
      reqs2.push(cell(sid2,row,0,row+1,maqNames.length+2,i%2===0?GRIS:BLANCO,NEGRO,false,10));
      // Color TN/Hr cells
      maqNames.forEach((m,mi)=>{
        const rec=rows.find(r=>r.fecha===fechas[i]&&r.maquina===m);
        const tnhr=rec?rec.tn_hr:0;
        const isBien=tnhr>=META;
        const isReg=tnhr>=META*0.7;
        reqs2.push(cell(sid2,row,mi+1,row+1,mi+2,isBien?VERDE_C:isReg?AMARILLO_C:ROJO_C,isBien?VERDE_T:isReg?AMARILLO:ROJO,true,10));
      });
      reqs2.push(rowH(sid2,row,20));
    });

    await sheets.spreadsheets.batchUpdate({spreadsheetId:SHEET_ID,resource:{requests:reqs2}});
    res.status(200).json({ok:true,registros:rows.length,maquinas:maqNames.length,fechas:fechas.length});
  } catch(e) {
    console.error(e.message);
    res.status(500).json({error:e.message});
  }
};
