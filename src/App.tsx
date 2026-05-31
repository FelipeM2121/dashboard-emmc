import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import {
  ResumenTab, PorServicioTab, PorProveedorTab,
  PorFamiliaTab, PorFechaTab, TablaTab,
} from './components/Dashboard';
import { loadData } from './data/loader';
import { COLORS } from './constants/theme';
import type { EMMCItem, SummaryData } from './types';

const EMPTY_SUMMARY: SummaryData = {
  totalItems: 0, totalQty: 0,
  uniqueServicios: 0, uniqueProveedores: 0, uniqueFamilias: 0, uniquePisos: 0,
  byServicio: [], byProveedor: [], byFamilia: [], byPiso: [],
  byMes: [], bySemana: [], byDia: [],
  fechaStats: { totalConFecha: 0, fechaMin: '', fechaMax: '', totalMeses: 0, totalSemanas: 0 },
};

export default function App() {
  const [activeTab, setActiveTab] = useState('Resumen');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState('');
  const [items, setItems] = useState<EMMCItem[]>([]);
  const [summary, setSummary] = useState<SummaryData>(EMPTY_SUMMARY);
  const [headers, setHeaders] = useState<string[]>([]);
  const [gasUrl, setGasUrl] = useState('');
  const [updated, setUpdated] = useState('');

  // Config modal state
  const [showConfig, setShowConfig] = useState(false);
  const [cfgGasUrl,    setCfgGasUrl]    = useState(() => localStorage.getItem('cfg_gasUrl')    ?? '');
  const [cfgSheetId,   setCfgSheetId]   = useState(() => localStorage.getItem('cfg_sheetId')   ?? '');
  const [cfgSheetName, setCfgSheetName] = useState(() => localStorage.getItem('cfg_sheetName') ?? '');

  const fetchData = useCallback(async () => {
    setStatus('loading');
    try {
      const result = await loadData();
      setItems(result.items);
      setSummary(result.summary);
      setHeaders(result.headers);
      setGasUrl(result.gasUrl);
      setUpdated(result.updated);
      setStatus('ready');
    } catch (e) {
      setError((e as Error).message || 'Error al cargar datos');
      setStatus('error');
    }
  }, []);

  useEffect(() => { fetchData(); const t = setInterval(fetchData, 300_000); return () => clearInterval(t); }, [fetchData]);

  function saveConfig() {
    localStorage.setItem('cfg_gasUrl',    cfgGasUrl.trim());
    localStorage.setItem('cfg_sheetId',   cfgSheetId.trim());
    localStorage.setItem('cfg_sheetName', cfgSheetName.trim());
    setShowConfig(false);
    fetchData();
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: `1px solid ${COLORS.border}`, fontSize: 14,
    background: COLORS.bg, color: COLORS.text, boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} updated={updated} status={status} />

      <div className="main-content">
        <div className="content-container">
          <Header activeTab={activeTab} />

          {/* Config button */}
          <button onClick={() => setShowConfig(true)} style={{
            position: 'fixed', top: 16, right: 16, zIndex: 500,
            background: COLORS.sidebar, color: COLORS.textSidebar,
            border: 'none', borderRadius: 10, padding: '8px 14px',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = COLORS.textSidebar}>
            ⚙ Config
          </button>

          {/* Loading */}
          {status === 'loading' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 80, gap: 20 }}>
              <div style={{ width: 48, height: 48, border: `4px solid ${COLORS.borderLight}`, borderTopColor: COLORS.primary, borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
              <p style={{ color: COLORS.textMuted, fontSize: 16 }}>Cargando datos desde Google Sheets…</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* Error */}
          {status === 'error' && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 16, padding: 32, maxWidth: 520, margin: '40px auto', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
              <h3 style={{ color: '#b91c1c', margin: '0 0 8px', fontSize: 18 }}>Error al cargar datos</h3>
              <p style={{ color: '#dc2626', marginBottom: 20, fontSize: 14 }}>{error}</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button onClick={fetchData} style={{ background: COLORS.primary, color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>Reintentar</button>
                <button onClick={() => setShowConfig(true)} style={{ background: COLORS.white, color: COLORS.text, border: `1px solid ${COLORS.border}`, padding: '10px 24px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>Configurar</button>
              </div>
            </div>
          )}

          {/* Tabs */}
          {status === 'ready' && (
            <>
              {activeTab === 'Resumen'       && <ResumenTab      summary={summary} />}
              {activeTab === 'Por Servicio'  && <PorServicioTab  summary={summary} />}
              {activeTab === 'Por Proveedor' && <PorProveedorTab summary={summary} />}
              {activeTab === 'Por Familia'   && <PorFamiliaTab   summary={summary} />}
              {activeTab === 'Por Fecha'     && <PorFechaTab     summary={summary} />}
              {activeTab === 'Tabla'         && <TablaTab items={items} headers={headers} gasUrl={gasUrl} onSaved={fetchData} />}

              <div className="dashboard-footer">
                <span>Hospital Buin Paine • EMMC</span>
                <span>
                  {summary.totalItems.toLocaleString('es-CL')} ítems •{' '}
                  {summary.totalQty.toLocaleString('es-CL')} unidades •{' '}
                  Actualizado {updated}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Config Modal */}
      {showConfig && (
        <div onClick={() => setShowConfig(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 20, padding: 32, width: '90%', maxWidth: 520, boxShadow: '0 24px 64px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: COLORS.text }}>Configuración</h2>
              <button onClick={() => setShowConfig(false)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: COLORS.textMuted }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>URL Google Apps Script</label>
                <input style={inputStyle} value={cfgGasUrl} onChange={e => setCfgGasUrl(e.target.value)} placeholder="https://script.google.com/macros/s/…/exec" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>ID Google Sheet</label>
                <input style={inputStyle} value={cfgSheetId} onChange={e => setCfgSheetId(e.target.value)} placeholder="1B4drO9RVgZRwOk0hdN…" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: COLORS.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Nombre de la hoja</label>
                <input style={inputStyle} value={cfgSheetName} onChange={e => setCfgSheetName(e.target.value)} placeholder="Consolidado" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowConfig(false)} style={{ padding: '10px 20px', borderRadius: 10, border: `1px solid ${COLORS.border}`, background: COLORS.white, fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>Cancelar</button>
              <button onClick={saveConfig} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: COLORS.primary, color: '#fff', fontSize: 14, cursor: 'pointer', fontWeight: 700 }}>Guardar y recargar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
