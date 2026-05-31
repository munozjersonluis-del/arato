import * as XLSX from 'xlsx';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { viajes = [], camiones = [] } = req.body;
    const wb = XLSX.utils.book_new();
    const GREEN_DARK = '1A5C38', GREEN_LIGHT = 'DCFCE7';
    const BLUE_DARK = '1E3A5F', BLUE_LIGHT = 'DBEAFE';
    const RED_LIGHT = 'FEE2E2', RED_DARK = 'DC2626';
    const YELLOW = 'FEF3C7', YELLOW_B = 'D97706';
    const GRAY = 'F1F5F9', WHITE = 'FFFFFF';

    // Helper para parsear bins
    const parseBins = v => {
      try { return JSON.parse(v.bins || '[]'); } catch { return []; }
    };
    const parseRets = v => {
      try {
        const r = JSON.parse(v.retornos || '[]');
        return r.flatMap(x => x.bins || []);
      } catch { return []; }
    };

    // ── DASHBOARD ──
    const diasSet = [...new Set(viajes.map(v => v.fecha))].sort();
    const totalV = viajes.length;
    const totalEnv = viajes.reduce((s,v) => s + parseBins(v).length, 0);
    const totalRet = viajes.reduce((s,v) => s + parseRets(v).length, 0);
    const totalTn = viajes.reduce((s,v) => s + (v.tn_total||0), 0);
    const efic = totalEnv > 0 ? (totalRet/totalEnv*100).toFixed(1)+'%' : '0%';
    const camV = camiones.filter(c => c.numero_viaje > 0).length;
    const camTn = camiones.reduce((s,c) => s + (c.tn_carga||0), 0);

    const dashData = [
      ['ARATO MISSION PRODUCE — REPORTE OPERACIONAL COMPLETO','','','','','','','','',''],
      ['Generado:', new Date().toLocaleString('es-CL'),'','','','','','','',''],
      [''],
      ['KPI','VALOR','','KPI','VALOR'],
      ['Días trabajados', diasSet.length, '', 'Total viajes', totalV],
      ['Bins enviados', totalEnv, '', 'Bins retornados', totalRet],
      ['Toneladas cosechadas', +totalTn.toFixed(3), '', 'Eficiencia', efic],
      ['Viajes camión', camV, '', 'Tn a planta', +camTn.toFixed(3)],
      [''],
      ['PRODUCCIÓN POR DÍA','','','','','','',''],
      ['Fecha','Viajes','Bins Env.','Bins Ret.','Faltantes','Toneladas','Efic. %','Camiones']
    ];

    const diasData = {};
    viajes.forEach(v => {
      if (!diasData[v.fecha]) diasData[v.fecha] = {v:0,e:0,r:0,tn:0};
      diasData[v.fecha].v++;
      diasData[v.fecha].e += parseBins(v).length;
      diasData[v.fecha].r += parseRets(v).length;
      diasData[v.fecha].tn += (v.tn_total||0);
    });
    const camXDia = {};
    camiones.filter(c=>c.numero_viaje>0).forEach(c => { camXDia[c.fecha]=(camXDia[c.fecha]||0)+1; });

    Object.keys(diasData).sort().forEach(fecha => {
      const d = diasData[fecha];
      const ef = d.e > 0 ? (d.r/d.e*100).toFixed(1)+'%' : '0%';
      dashData.push([fecha, d.v, d.e, d.r, d.e-d.r, +d.tn.toFixed(3), ef, camXDia[fecha]||0]);
    });

    const wsDash = XLSX.utils.aoa_to_sheet(dashData);
    wsDash['!cols'] = [{wch:22},{wch:12},{wch:12},{wch:12},{wch:12},{wch:14},{wch:10},{wch:12}];
    XLSX.utils.book_append_sheet(wb, wsDash, 'Dashboard');

    // ── VIAJES DETALLE ──
    const hdrsV = ['#','Fecha','Grupo','Módulo','Máquina','Proveedor','Operador','Portabinero','Hora','Bins Env.','Bins Ret.','Faltantes','Toneladas','Estado'];
    const rowsV = [hdrsV];
    [...viajes].sort((a,b)=>a.fecha>b.fecha?1:-1).forEach((v,i) => {
      const bins = parseBins(v), rets = parseRets(v);
      rowsV.push([i+1,v.fecha,v.grupo,v.modulo,v.maquina||'',v.proveedor||'',v.operador,v.portabinero,v.hora_salida,bins.length,rets.length,bins.length-rets.length,+(v.tn_total||0).toFixed(3),v.cerrado?'Cerrado':'Activo']);
    });
    const wsV = XLSX.utils.aoa_to_sheet(rowsV);
    wsV['!cols'] = [{wch:5},{wch:12},{wch:8},{wch:6},{wch:14},{wch:10},{wch:18},{wch:18},{wch:10},{wch:10},{wch:10},{wch:10},{wch:12},{wch:10}];
    wsV['!autofilter'] = {ref:'A1:N1'};
    XLSX.utils.book_append_sheet(wb, wsV, 'Viajes Detalle');

    // ── OPERADORES ──
    const opData = {};
    viajes.forEach(v => {
      if (!opData[v.operador]) opData[v.operador] = {v:0,e:0,r:0,tn:0,dias:new Set()};
      opData[v.operador].v++;
      opData[v.operador].e += parseBins(v).length;
      opData[v.operador].r += parseRets(v).length;
      opData[v.operador].tn += (v.tn_total||0);
      opData[v.operador].dias.add(v.fecha);
    });
    const hdrsOp = ['Operador','Viajes','Bins Env.','Bins Ret.','Faltantes','Toneladas','Efic. %','Tn/Viaje','Días'];
    const rowsOp = [hdrsOp];
    Object.entries(opData).sort((a,b)=>b[1].tn-a[1].tn).forEach(([op,d]) => {
      rowsOp.push([op,d.v,d.e,d.r,d.e-d.r,+d.tn.toFixed(3),d.e>0?(d.r/d.e*100).toFixed(1)+'%':'0%',d.v>0?+(d.tn/d.v).toFixed(3):0,d.dias.size]);
    });
    const wsOp = XLSX.utils.aoa_to_sheet(rowsOp);
    wsOp['!cols'] = [{wch:22},{wch:10},{wch:12},{wch:12},{wch:12},{wch:14},{wch:10},{wch:12},{wch:10}];
    XLSX.utils.book_append_sheet(wb, wsOp, 'Por Operador');

    // ── CAMIONES ──
    const hdrsC = ['Fecha','Placa','Viaje #','Bins','Toneladas','Hora Sal.','Hora Ret.','Tiempo (min)','Estado'];
    const rowsC = [hdrsC];
    camiones.filter(c=>c.numero_viaje>0).sort((a,b)=>a.fecha>b.fecha?1:-1).forEach(c => {
      rowsC.push([c.fecha,c.placa,c.numero_viaje,c.bins_carga||0,+(c.tn_carga||0).toFixed(3),c.hora_salida||'',c.hora_retorno||'',c.tiempo_viaje_ms?Math.round(c.tiempo_viaje_ms/60000):'',c.completado?'Completado':'En ruta']);
    });
    const wsC = XLSX.utils.aoa_to_sheet(rowsC);
    wsC['!cols'] = [{wch:12},{wch:14},{wch:10},{wch:10},{wch:14},{wch:12},{wch:12},{wch:14},{wch:14}];
    XLSX.utils.book_append_sheet(wb, wsC, 'Camiones');

    // Generar buffer
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Arato_Reporte_${new Date().toISOString().slice(0,10)}.xlsx`);
    res.status(200).send(buf);

  } catch(e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
