# Dashboard EMMC – Hospital Buin Paine

Panel de **Equipamiento & Mobiliario Médico Clínico** conectado a Google Sheets en tiempo real.

🌐 **Demo en vivo:** [dashboard-emmc-v2.netlify.app/dashboard-emmc.html](https://dashboard-emmc-v2.netlify.app/dashboard-emmc.html)

---

## Características

- **4.910+ ítems** de equipamiento médico con filtros y búsqueda
- Gráficos de distribución por servicio y familia de equipo
- KPIs automáticos: total ítems, equipos, proveedores y servicios únicos
- Filtros por servicio, familia, proveedor y piso
- Edición inline con sincronización directa a Google Sheets
- Auto-refresh cada 5 minutos
- Exportar e importar CSV
- Funciona tanto desde la web (Netlify) como en local (servidor Python)

---

## Arquitectura

```
┌─────────────────────────────────────────┐
│           Google Sheets                 │
│     (fuente de datos + escritura)       │
└────────────────┬────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
   [Web / Netlify]   [Local / LAN]
        │                 │
   Apps Script       server.py
   (gas-backend.gs)  (Flask + OAuth2)
        │                 │
        └────────┬────────┘
                 │
        dashboard-emmc.html
```

| Modo | URL | Edición | Requiere |
|------|-----|---------|----------|
| **Web (Netlify)** | `dashboard-emmc-v2.netlify.app` | ✅ | Nada (ya desplegado) |
| **Local** | `localhost:8080` | ✅ | Python + `credentials.json` |

---

## Uso en la web

Accede directamente a la demo:

```
https://dashboard-emmc-v2.netlify.app/dashboard-emmc.html
```

No requiere instalación ni cuenta. Los datos se obtienen desde Google Sheets vía Google Apps Script.

---

## Uso local (red interna / LAN)

### Requisitos

- Python 3.8+
- Paquetes: `flask google-auth google-auth-oauthlib requests`

### Instalación

```bash
# 1. Instalar dependencias
pip install flask google-auth google-auth-oauthlib requests

# 2. Colocar credentials.json en esta carpeta
#    (descargado desde Google Cloud Console → APIs → Credenciales → App de escritorio)

# 3. Ejecutar
run_server.bat          # Windows (doble clic)
# o
python server.py
```

Al iniciar por primera vez se abrirá el navegador para autorizar con Google (solo una vez). Después el token se guarda en `token.json`.

El dashboard queda disponible en:
- **Local:** http://localhost:8080
- **Red local:** http://\<tu-IP\>:8080

### Archivos

| Archivo | Descripción |
|---------|-------------|
| `dashboard-emmc.html` | Frontend completo (HTML/CSS/JS, sin dependencias externas) |
| `server.py` | Servidor Flask con OAuth2 y auto-refresh |
| `run_server.bat` | Lanzador para Windows con encoding UTF-8 |
| `gas-backend.gs` | Código del backend Google Apps Script (web) |
| `netlify.toml` | Configuración de deploy en Netlify |

---

## Backend Google Apps Script

El archivo `gas-backend.gs` contiene el backend que corre en los servidores de Google y permite que la versión web funcione con edición completa.

Para redesplegar tu propio backend:

1. Ir a [script.google.com](https://script.google.com) → **Nuevo proyecto**
2. Pegar el contenido de `gas-backend.gs`
3. **Implementar → Nueva implementación**
   - Tipo: `Aplicación web`
   - Ejecutar como: `Yo`
   - Acceso: `Cualquier persona`
4. Copiar la URL `/exec` generada
5. En el dashboard → **Config** → pegar la URL en *"URL del Backend"*

---

## Hoja de cálculo

Los datos provienen de la hoja `Consolidado` del spreadsheet configurado en `server.py` y `gas-backend.gs`. La estructura esperada es:

- **Filas 1–3:** metadata del proyecto (se omiten automáticamente)
- **Fila 4:** encabezados de columna
- **Filas 5+:** datos de ítems

---

## Tecnologías

- **Frontend:** HTML5 + Tailwind CSS (CDN) + Chart.js
- **Backend local:** Python 3 + Flask + Google OAuth2
- **Backend web:** Google Apps Script
- **Hosting:** Netlify (estático)
- **Datos:** Google Sheets API v4
