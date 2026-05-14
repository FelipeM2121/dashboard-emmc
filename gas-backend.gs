// ============================================================
// Dashboard EMMC – Backend Google Apps Script
// ============================================================
// INSTRUCCIONES:
//   1. Ir a https://script.google.com → Nuevo proyecto
//   2. Pegar este código completo
//   3. Clic en "Implementar" → "Nueva implementación"
//      - Tipo: Aplicación web
//      - Ejecutar como: Yo (tu cuenta)
//      - Quién tiene acceso: Cualquier persona
//   4. Copiar la URL que aparece (termina en /exec)
//   5. En el Dashboard → Config → pegar esa URL en "URL del backend"
// ============================================================

const SHEET_ID   = '1B4drO9RVgZRwOk0hdNgCssbdtgmHkh3t-XzoT8_YVfo';
const SHEET_NAME = 'Consolidado';

function doGet(e) {
  try {
    const action = (e.parameter && e.parameter.action) || 'data';

    if (action === 'update') {
      const payload = JSON.parse(e.parameter.payload || '[]');
      return handleUpdate(payload);
    }

    return getData();
  } catch(err) {
    return json({ ok: false, error: err.message });
  }
}

// ── Leer todos los datos ────────────────────────────────────
function getData() {
  const sheet  = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getValues();

  // Auto-detectar fila de encabezado (primera fila con primer campo no numérico)
  let headerIdx = 0;
  for (let i = 0; i < values.length; i++) {
    const first = String(values[i][0] || '').trim();
    if (first && !/^[\d.]+$/.test(first)) { headerIdx = i; break; }
  }

  const headers  = values[headerIdx].map(h => String(h || '').trim());
  const headerVal = headers[0];
  const nCols    = headers.length;

  const rows = values.slice(headerIdx + 1)
    .filter(r => { const f = String(r[0] || '').trim(); return f && f !== headerVal; })
    .map(r => {
      const c = r.map(v => String(v !== null && v !== undefined ? v : '').trim());
      while (c.length < nCols) c.push('');
      return c.slice(0, nCols);
    });

  return json({
    headers: headers,
    rows:    rows,
    updated: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm:ss'),
    status:  'Conectado'
  });
}

// ── Actualizar celdas ───────────────────────────────────────
function handleUpdate(updates) {
  if (!Array.isArray(updates) || updates.length === 0) {
    return json({ ok: true, updated: 0 });
  }

  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

  updates.forEach(u => {
    sheet.getRange(Number(u.row), Number(u.col)).setValue(u.value);
  });

  return json({ ok: true, updated: updates.length });
}

// ── Helper JSON con CORS ────────────────────────────────────
function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
