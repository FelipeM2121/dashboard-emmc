import type { EMMCItem, SummaryData, NameQty } from '../types';

const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbzAY0mFNPcOQGj8YPOarHAy2fdOjNuL6pkvidE1U1jGnIzWIbHz6SQZtHLX_xg4jHvY7g/exec';
const DEFAULT_SHEET_ID = '1B4drO9RVgZRwOk0hdNgCssbdtgmHkh3t-XzoT8_YVfo';
const DEFAULT_SHEET_NAME = 'Consolidado';

// Column indices (0-based) in the Google Sheet
const COL = {
  ITEM: 0,
  SERVICIO: 4,
  PISO: 5,
  FAMILIA: 6,
  NOMBRE: 10,
  CANTIDAD: 11,
  PLAN_ADQ: 12,
  PLAN_INST: 13,
  PROVEEDOR: 14,
  FCHAS_RECINTO: 17,
  INICIO: 19,
  TERMINO: 21,
  ENTRENAMIENTO: 30,
  FECHA_PRUEBAS: 33,
  FECHA_RECEPCION: 35,
};

function parseCant(val: string): number {
  const s = String(val || '').trim();
  if (!s) return 1;
  const n = parseFloat(s.replace(/\./g, '').replace(',', '.'));
  return isNaN(n) ? 1 : n;
}

function cell(row: string[], idx: number): string {
  return (row[idx] || '').trim();
}

export function rawRowsToItems(rows: string[][], headers: string[]): EMMCItem[] {
  // Find column indices dynamically (fallback to hardcoded)
  const findCol = (name: RegExp, fallback: number) => {
    const idx = headers.findIndex(h => name.test((h || '').trim()));
    return idx >= 0 ? idx : fallback;
  };
  const ci = {
    ITEM:          findCol(/^n[°º]?\s*[ií]tem/i,      COL.ITEM),
    SERVICIO:      findCol(/^servicio/i,               COL.SERVICIO),
    PISO:          findCol(/^piso/i,                   COL.PISO),
    FAMILIA:       findCol(/^familia/i,                COL.FAMILIA),
    NOMBRE:        findCol(/^nombre/i,                 COL.NOMBRE),
    CANTIDAD:      findCol(/^cant/i,                   COL.CANTIDAD),
    PLAN_ADQ:      findCol(/plan.*adq/i,               COL.PLAN_ADQ),
    PLAN_INST:     findCol(/plan.*inst/i,              COL.PLAN_INST),
    PROVEEDOR:     findCol(/^proveedor/i,              COL.PROVEEDOR),
    FCHAS_RECINTO: findCol(/fchas.*recinto/i,          COL.FCHAS_RECINTO),
    INICIO:        findCol(/inicio/i,                  COL.INICIO),
    TERMINO:       findCol(/t[eé]rmino/i,              COL.TERMINO),
    ENTRENAMIENTO: findCol(/entrenamiento/i,           COL.ENTRENAMIENTO),
    FECHA_PRUEBAS: findCol(/pruebas/i,                 COL.FECHA_PRUEBAS),
    FECHA_RECEP:   findCol(/recepci[oó]n/i,            COL.FECHA_RECEPCION),
  };

  return rows.map((row, i) => ({
    item:          cell(row, ci.ITEM),
    servicio:      cell(row, ci.SERVICIO),
    piso:          cell(row, ci.PISO),
    familia:       cell(row, ci.FAMILIA),
    nombre:        cell(row, ci.NOMBRE),
    cantidad:      parseCant(cell(row, ci.CANTIDAD)),
    planAdq:       cell(row, ci.PLAN_ADQ),
    planInst:      cell(row, ci.PLAN_INST),
    proveedor:     cell(row, ci.PROVEEDOR),
    fchasRecinto:  cell(row, ci.FCHAS_RECINTO),
    inicio:        cell(row, ci.INICIO),
    termino:       cell(row, ci.TERMINO),
    entrenamiento: cell(row, ci.ENTRENAMIENTO),
    fchaPruebas:   cell(row, ci.FECHA_PRUEBAS),
    fchaRecepcion: cell(row, ci.FECHA_RECEP),
    _rawIndex:     i,
  }));
}

function groupBy(items: EMMCItem[], key: keyof EMMCItem): NameQty[] {
  const map: Record<string, number> = {};
  items.forEach(item => {
    const k = String(item[key] || 'Sin dato');
    map[k] = (map[k] || 0) + item.cantidad;
  });
  return Object.entries(map)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty);
}

function parseDate(s: string): Date | null {
  if (!s) return null;
  // Try DD/MM/YYYY
  const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmy) return new Date(+dmy[3], +dmy[2] - 1, +dmy[1]);
  // Try YYYY-MM-DD
  const ymd = s.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
  if (ymd) return new Date(+ymd[1], +ymd[2] - 1, +ymd[3]);
  return null;
}

function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function weekLabel(d: Date): string {
  const start = new Date(d);
  start.setDate(d.getDate() - d.getDay() + 1);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return `${start.getDate()}/${start.getMonth() + 1} – ${end.getDate()}/${end.getMonth() + 1}`;
}

export function computeSummary(items: EMMCItem[]): SummaryData {
  const totalItems = items.length;
  const totalQty = items.reduce((s, i) => s + i.cantidad, 0);

  const byServicio  = groupBy(items, 'servicio');
  const byProveedor = groupBy(items, 'proveedor');
  const byFamilia   = groupBy(items, 'familia');
  const byPiso      = groupBy(items, 'piso');

  // Date-based aggregations (use 'inicio' column)
  const mesMap: Record<string, number> = {};
  const semMap: Record<string, number> = {};
  const diaMap: Record<string, number> = {};
  let fechaMin = '', fechaMax = '';
  let totalConFecha = 0;

  items.forEach(item => {
    const d = parseDate(item.inicio);
    if (!d) return;
    totalConFecha++;
    const iso = toISO(d);
    if (!fechaMin || iso < fechaMin) fechaMin = iso;
    if (!fechaMax || iso > fechaMax) fechaMax = iso;
    const mes = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    mesMap[mes] = (mesMap[mes] || 0) + item.cantidad;
    const sem = weekLabel(d);
    semMap[sem] = (semMap[sem] || 0) + item.cantidad;
    const dia = iso;
    diaMap[dia] = (diaMap[dia] || 0) + item.cantidad;
  });

  const byMes = Object.entries(mesMap).sort((a, b) => a[0].localeCompare(b[0])).map(([name, qty]) => ({ name, qty }));
  const bySemana = Object.entries(semMap).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, qty]) => ({ name, qty }));
  const byDia = Object.entries(diaMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, qty]) => ({ name, qty }));

  const meses = new Set(byMes.map(m => m.name.slice(0, 7)));
  const semanas = new Set(Object.keys(semMap));

  return {
    totalItems,
    totalQty,
    uniqueServicios:   new Set(items.map(i => i.servicio).filter(Boolean)).size,
    uniqueProveedores: new Set(items.map(i => i.proveedor).filter(Boolean)).size,
    uniqueFamilias:    new Set(items.map(i => i.familia).filter(Boolean)).size,
    uniquePisos:       new Set(items.map(i => i.piso).filter(Boolean)).size,
    byServicio,
    byProveedor,
    byFamilia,
    byPiso,
    byMes,
    bySemana,
    byDia,
    fechaStats: { totalConFecha, fechaMin, fechaMax, totalMeses: meses.size, totalSemanas: semanas.size },
  };
}

// ── GAS loader ──────────────────────────────────────────────────
async function loadFromGAS(gasUrl: string): Promise<{ headers: string[]; rows: string[][] }> {
  const res = await fetch(gasUrl);
  if (!res.ok) throw new Error(`GAS HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error('GAS: ' + data.error);
  return { headers: data.headers, rows: data.rows };
}

// ── gviz loader (fallback, read-only) ───────────────────────────
async function loadFromGviz(sheetId: string, sheetName: string): Promise<{ headers: string[]; rows: string[][] }> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}&headers=0`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`gviz HTTP ${res.status}`);
  const text = await res.text();
  const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/);
  if (!match) throw new Error('Respuesta inesperada de Google Sheets');
  const json = JSON.parse(match[1]);
  if (json.status !== 'ok') throw new Error('Sheets: ' + (json.errors?.[0]?.message || 'Error desconocido'));

  const table = json.table;
  const allRows: string[][] = (table.rows || []).map((r: any) =>
    r.c.map((c: any) => c === null ? '' : (c.v != null ? String(c.v) : (c.f != null ? c.f : '')))
  );

  let headerIdx = 0;
  for (let i = 0; i < allRows.length; i++) {
    const first = (allRows[i][0] || '').trim();
    if (first && !/^[\d.]+$/.test(first)) { headerIdx = i; break; }
  }

  const headers = allRows[headerIdx].map(h => (h || '').trim());
  const headerVal = headers[0];
  const nCols = headers.length;
  const rows = allRows.slice(headerIdx + 1)
    .filter(r => { const f = (r[0] || '').trim(); return f && f !== headerVal; })
    .map(r => {
      const c = r.map(v => (v || '').trim());
      while (c.length < nCols) c.push('');
      return c.slice(0, nCols);
    });

  return { headers, rows };
}

export interface LoadResult {
  items: EMMCItem[];
  summary: SummaryData;
  headers: string[];
  gasUrl: string;
  updated: string;
}

export async function loadData(overrideGasUrl?: string): Promise<LoadResult> {
  const gasUrl = overrideGasUrl
    ?? localStorage.getItem('cfg_gasUrl')
    ?? DEFAULT_GAS_URL;
  const sheetId   = localStorage.getItem('cfg_sheetId')   ?? DEFAULT_SHEET_ID;
  const sheetName = localStorage.getItem('cfg_sheetName') ?? DEFAULT_SHEET_NAME;

  let headers: string[];
  let rows: string[][];

  try {
    if (gasUrl) {
      ({ headers, rows } = await loadFromGAS(gasUrl));
    } else {
      ({ headers, rows } = await loadFromGviz(sheetId, sheetName));
    }
  } catch {
    ({ headers, rows } = await loadFromGviz(sheetId, sheetName));
  }

  const items = rawRowsToItems(rows, headers);
  const summary = computeSummary(items);
  return {
    items,
    summary,
    headers,
    gasUrl,
    updated: new Date().toLocaleString('es-CL'),
  };
}
