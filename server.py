#!/usr/bin/env python3
"""
Dashboard EMMC – Hospital Buin Paine
=====================================
Servidor local que:
  - Se autentica con Google Sheets UNA sola vez (guarda token.json)
  - Actualiza los datos automáticamente cada 5 minutos
  - Sirve el dashboard en http://localhost:8080
  - Permite editar celdas y guardar de vuelta en Sheets

PRIMER USO:
  1. Descarga 'credentials.json' desde Google Cloud Console:
       APIs y servicios → Credenciales → tu cliente OAuth
       → clic en el lápiz (editar) → "Descargar JSON"
       → guárdalo como 'credentials.json' en esta misma carpeta
       (Si el tipo es "Aplicación web", primero crea uno nuevo
        de tipo "App de escritorio" para uso sin errores)
  2. Instala dependencias:  pip install flask google-auth google-auth-oauthlib requests
  3. Ejecuta:               python server.py
  4. Se abrirá el navegador para autorizar → acepta una sola vez
  5. El servidor queda corriendo en http://localhost:8080
"""

import os, json, time, threading, requests as req_lib
from flask import Flask, jsonify, request, send_file
from datetime import datetime
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request as GRequest

# ── CONFIGURACIÓN ──────────────────────────────────────────────────────────────
SHEET_ID         = '1B4drO9RVgZRwOk0hdNgCssbdtgmHkh3t-XzoT8_YVfo'
SHEET_NAME       = 'Consolidado'
CREDENTIALS_FILE = os.path.join(os.path.dirname(__file__), 'credentials.json')
TOKEN_FILE       = os.path.join(os.path.dirname(__file__), 'token.json')
DASHBOARD_FILE   = os.path.join(os.path.dirname(__file__), 'dashboard-emmc.html')
SCOPES           = ['https://www.googleapis.com/auth/spreadsheets']
REFRESH_SECONDS  = 300   # 5 minutos
PORT             = 8080

# ── ESTADO GLOBAL ──────────────────────────────────────────────────────────────
cache = {'headers': [], 'rows': [], 'updated': None, 'status': 'Iniciando…'}
creds = None
lock  = threading.Lock()

# ── AUTENTICACIÓN ──────────────────────────────────────────────────────────────
def get_credentials():
    global creds

    if not os.path.exists(CREDENTIALS_FILE):
        raise FileNotFoundError(
            f"\n❌  No se encontró '{CREDENTIALS_FILE}'.\n"
            "    Descárgalo desde Google Cloud Console:\n"
            "      APIs y servicios → Credenciales → tu cliente OAuth\n"
            "      → Descargar JSON → guardar como 'credentials.json'\n"
            "    Si el tipo es 'Aplicación web', crea uno nuevo de tipo\n"
            "    'App de escritorio' para evitar problemas de redirect.\n"
        )

    # Cargar token guardado
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    # Renovar o iniciar OAuth
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("[Auth] Renovando token automáticamente...")
            creds.refresh(GRequest())
        else:
            print("[Auth] Abriendo navegador para autorización (solo esta vez)...")
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0, open_browser=True)
            print("[Auth] ✓ Autorización exitosa")

        with open(TOKEN_FILE, 'w') as f:
            f.write(creds.to_json())

    return creds


def refresh_token_if_needed():
    """Renueva el token si está próximo a expirar o no es válido."""
    global creds
    if creds and creds.refresh_token and (not creds.valid or creds.expired):
        print("[Auth] Renovando token...")
        creds.refresh(GRequest())
        with open(TOKEN_FILE, 'w') as f:
            f.write(creds.to_json())


# ── HELPERS ────────────────────────────────────────────────────────────────────
def col_to_letter(col: int) -> str:
    """Convierte número de columna 1-based a letras (1→A, 27→AA)."""
    result = ''
    while col > 0:
        col, rem = divmod(col - 1, 26)
        result = chr(65 + rem) + result
    return result


def sheets_url(path: str) -> str:
    return f'https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}{path}'


def auth_header() -> dict:
    return {'Authorization': f'Bearer {creds.token}'}


# ── GOOGLE SHEETS OPERACIONES ──────────────────────────────────────────────────
def fetch_sheet_data():
    """Descarga todos los valores de la hoja y actualiza el caché."""
    global cache
    try:
        refresh_token_if_needed()
        url = sheets_url(f'/values/{req_lib.utils.quote(SHEET_NAME, safe="")}')
        resp = req_lib.get(url, headers=auth_header(), timeout=30)
        resp.raise_for_status()
        values = resp.json().get('values', [])

        with lock:
            if values:
                # La hoja tiene 3 filas de metadata antes del encabezado real
                # Buscar la primera fila con contenido como encabezado
                header_idx = 0
                for i, row in enumerate(values):
                    if row and any(str(c).strip() for c in row[:5]):
                        # Verificar que sea la fila de headers buscando columna 0 no numérica
                        if row[0] and not str(row[0]).replace('.','').isdigit():
                            header_idx = i
                            break

                real_headers = values[header_idx]
                n_cols = len(real_headers)
                header_val = str(real_headers[0]).strip() if real_headers else ''

                data_rows = []
                for r in values[header_idx + 1:]:
                    if not r:
                        continue
                    first = str(r[0]).strip() if r else ''
                    if not first or first == header_val:
                        continue
                    # Strip whitespace de cada celda
                    cleaned = [str(c).strip() for c in r]
                    padded = cleaned + [''] * max(0, n_cols - len(cleaned))
                    data_rows.append(padded[:n_cols] if len(padded) > n_cols else padded)

                cache['headers'] = real_headers
                cache['rows']    = data_rows
                cache['updated'] = datetime.now().strftime('%d/%m/%Y %H:%M:%S')
                cache['status']  = 'Conectado'
                print(f"[{cache['updated']}] {len(cache['rows'])} filas cargadas (header en fila {header_idx})")
            else:
                cache['status'] = 'Hoja vacía'

    except Exception as e:
        with lock:
            cache['status'] = f'Error: {str(e)[:80]}'
        print(f"[Error fetch] {e}")
        # log response body if available
        try:
            print(f"[Error fetch detail] {e.response.text[:300]}")
        except Exception:
            pass


def write_cell(row_1: int, col_1: int, value: str):
    """Escribe un valor en una celda específica."""
    refresh_token_if_needed()
    cell_range = f"{SHEET_NAME}!{col_to_letter(col_1)}{row_1}"
    url  = sheets_url(f'/values/{req_lib.utils.quote(cell_range, safe="")}')
    url += '?valueInputOption=USER_ENTERED'
    resp = req_lib.put(
        url,
        headers={**auth_header(), 'Content-Type': 'application/json'},
        json={'values': [[value]]},
        timeout=15
    )
    resp.raise_for_status()
    return resp.json()


def batch_write(updates: list):
    """Escribe múltiples celdas en una sola llamada a la API."""
    refresh_token_if_needed()
    data = []
    for u in updates:
        cell_range = f"{SHEET_NAME}!{col_to_letter(u['col'])}{u['row']}"
        data.append({'range': cell_range, 'values': [[u['value']]]})

    url  = sheets_url('/values:batchUpdate')
    resp = req_lib.post(
        url,
        headers={**auth_header(), 'Content-Type': 'application/json'},
        json={'valueInputOption': 'USER_ENTERED', 'data': data},
        timeout=30
    )
    resp.raise_for_status()
    return resp.json()


# ── AUTO-REFRESH EN BACKGROUND ─────────────────────────────────────────────────
def auto_refresh_loop():
    while True:
        time.sleep(REFRESH_SECONDS)
        print(f"[Auto-refresh] Actualizando datos...")
        try:
            fetch_sheet_data()
        except Exception as e:
            print(f"[Auto-refresh Error] {e}")


# ── FLASK APP ──────────────────────────────────────────────────────────────────
app = Flask(__name__)


@app.route('/')
def index():
    return send_file(DASHBOARD_FILE)


@app.route('/api/data')
def api_data():
    with lock:
        return jsonify(cache)


@app.route('/api/status')
def api_status():
    with lock:
        return jsonify({
            'status':  cache['status'],
            'updated': cache['updated'],
            'rows':    len(cache['rows'])
        })


@app.route('/api/update', methods=['POST'])
def api_update():
    """Guarda cambios en Google Sheets. Acepta una celda o un lote."""
    try:
        body = request.get_json(force=True)

        # Lote de cambios
        if 'updates' in body:
            updates = body['updates']
            result  = batch_write(updates)

            with lock:
                for u in updates:
                    di = u['row'] - 2        # fila de datos (0-based)
                    ci = u['col'] - 1        # columna (0-based)
                    if 0 <= di < len(cache['rows']):
                        row = list(cache['rows'][di])
                        while len(row) <= ci:
                            row.append('')
                        row[ci] = u['value']
                        cache['rows'][di] = row

            return jsonify({'ok': True, 'updated': result.get('totalUpdatedCells', len(updates))})

        # Celda individual
        row   = int(body['row'])
        col   = int(body['col'])
        value = str(body.get('value', ''))
        result = write_cell(row, col, value)

        with lock:
            di = row - 2
            ci = col - 1
            if 0 <= di < len(cache['rows']):
                row_data = list(cache['rows'][di])
                while len(row_data) <= ci:
                    row_data.append('')
                row_data[ci] = value
                cache['rows'][di] = row_data

        return jsonify({'ok': True, 'updated': result.get('updatedCells', 1)})

    except Exception as e:
        print(f"[Error update] {e}")
        return jsonify({'ok': False, 'error': str(e)}), 500


@app.route('/api/refresh', methods=['POST'])
def api_refresh():
    """Fuerza una actualización inmediata desde Sheets."""
    threading.Thread(target=fetch_sheet_data, daemon=True).start()
    return jsonify({'ok': True})


# ── INICIO ─────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    print("=" * 55)
    print("  Dashboard EMMC – Hospital Buin Paine")
    print("=" * 55)

    try:
        get_credentials()
    except FileNotFoundError as e:
        print(e)
        input("Presiona Enter para salir...")
        raise SystemExit(1)

    print("[Init] Cargando datos iniciales desde Google Sheets...")
    fetch_sheet_data()

    t = threading.Thread(target=auto_refresh_loop, daemon=True)
    t.start()
    print(f"[Init] Auto-refresh cada {REFRESH_SECONDS // 60} minutos activado")

    print(f"\n✓  Servidor listo → http://localhost:{PORT}")
    print("   Presiona Ctrl+C para detener.\n")

    app.run(host='0.0.0.0', port=PORT, debug=False, use_reloader=False)
