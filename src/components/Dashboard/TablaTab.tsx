import { useState, useMemo, useCallback } from 'react';
import { COLORS } from '../../constants/theme';
import { SectionTitle } from '../Shared';
import { Icons } from '../../constants/icons';
import type { EMMCItem } from '../../types';

interface TablaTabProps {
  items: EMMCItem[];
  headers: string[];
  gasUrl: string;
  onSaved?: () => void;
}

const TABLE_COLS: { key: keyof EMMCItem; label: string }[] = [
  { key: 'item',         label: 'Nº Ítem' },
  { key: 'nombre',       label: 'Nombre Equipo' },
  { key: 'servicio',     label: 'Servicio' },
  { key: 'familia',      label: 'Familia' },
  { key: 'cantidad',     label: 'Cant.' },
  { key: 'proveedor',    label: 'Proveedor' },
  { key: 'piso',         label: 'Piso' },
  { key: 'planAdq',      label: 'Plan Adq.' },
  { key: 'planInst',     label: 'Plan Inst.' },
  { key: 'inicio',       label: 'Inicio' },
  { key: 'termino',      label: 'Término' },
  { key: 'entrenamiento',label: 'Entrenamiento' },
];

const ITEMS_PER_PAGE = 50;

function norm(v: string) { return (v || '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

export function TablaTab({ items, gasUrl, onSaved }: TablaTabProps) {
  const [search, setSearch] = useState('');
  const [filterServicio,  setFilterServicio]  = useState('');
  const [filterFamilia,   setFilterFamilia]   = useState('');
  const [filterProveedor, setFilterProveedor] = useState('');
  const [filterPiso,      setFilterPiso]      = useState('');
  const [page, setPage] = useState(1);
  const [changes, setChanges] = useState<Record<string, string>>({});
  const [editItem, setEditItem] = useState<EMMCItem | null>(null);
  const [editVals, setEditVals] = useState<Record<string, string>>({});
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const uniqueServicios  = useMemo(() => [...new Set(items.map(i => i.servicio).filter(Boolean))].sort(), [items]);
  const uniqueFamilias   = useMemo(() => [...new Set(items.map(i => i.familia).filter(Boolean))].sort(), [items]);
  const uniqueProveedores= useMemo(() => [...new Set(items.map(i => i.proveedor).filter(Boolean))].sort(), [items]);
  const uniquePisos      = useMemo(() => [...new Set(items.map(i => i.piso).filter(Boolean))].sort(), [items]);

  const filtered = useMemo(() => {
    const q = norm(search);
    return items.filter(r => {
      if (filterServicio  && norm(r.servicio)  !== norm(filterServicio))  return false;
      if (filterFamilia   && norm(r.familia)   !== norm(filterFamilia))   return false;
      if (filterProveedor && norm(r.proveedor) !== norm(filterProveedor)) return false;
      if (filterPiso      && norm(r.piso)      !== norm(filterPiso))      return false;
      if (q && ![r.item, r.nombre, r.proveedor, r.servicio, r.familia].some(v => norm(v).includes(q))) return false;
      return true;
    });
  }, [items, search, filterServicio, filterFamilia, filterProveedor, filterPiso]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageItems = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const clearFilters = useCallback(() => {
    setSearch(''); setFilterServicio(''); setFilterFamilia('');
    setFilterProveedor(''); setFilterPiso(''); setPage(1);
  }, []);

  function openEdit(item: EMMCItem) {
    setEditItem(item);
    const vals: Record<string, string> = {};
    TABLE_COLS.forEach(c => {
      vals[c.key] = String(changes[`${item._rawIndex}_${c.key}`] ?? item[c.key] ?? '');
    });
    setEditVals(vals);
  }

  function saveEdit() {
    if (!editItem) return;
    const newChanges = { ...changes };
    let changed = 0;
    TABLE_COLS.forEach(c => {
      const orig = String(editItem[c.key] ?? '');
      const newVal = editVals[c.key] ?? orig;
      if (newVal !== orig) { newChanges[`${editItem._rawIndex}_${c.key}`] = newVal; changed++; }
    });
    setChanges(newChanges);
    setEditItem(null);
    if (changed > 0) showToast(`${changed} campo(s) modificado(s)`);
    else showToast('Sin cambios');
  }

  async function syncChanges() {
    const keys = Object.keys(changes);
    if (!keys.length) { showToast('No hay cambios'); return; }
    if (!gasUrl) { showToast('No hay URL de GAS configurada'); return; }
    setSyncing(true);
    try {
      // Build updates: {row: sheetRow, col: colLetter, value}
      const COL_MAP: Record<string, number> = {
        item: 0, servicio: 4, piso: 5, familia: 6, nombre: 10, cantidad: 11,
        planAdq: 12, planInst: 13, proveedor: 14, inicio: 19, termino: 21,
        entrenamiento: 30, fchaPruebas: 33, fchaRecepcion: 35,
      };
      const updates = keys.map(k => {
        const [rawIdx, colKey] = k.split('_');
        return { row: parseInt(rawIdx) + 2, col: (COL_MAP[colKey] ?? 0) + 1, value: changes[k] };
      });
      const url = `${gasUrl}?action=update&payload=${encodeURIComponent(JSON.stringify(updates))}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      if (!result.ok) throw new Error(result.error || 'Error desconocido');
      setChanges({});
      showToast(`✓ ${keys.length} cambio(s) sincronizados`);
      onSaved?.();
    } catch (e) {
      showToast(`Error: ${(e as Error).message}`);
    } finally {
      setSyncing(false);
    }
  }

  const pendingCount = Object.keys(changes).length;

  const selStyle: React.CSSProperties = {
    flex: 1, minWidth: 140, padding: '8px 12px', borderRadius: 8,
    border: `1px solid ${COLORS.border}`, background: COLORS.white,
    fontSize: 13, color: COLORS.text, cursor: 'pointer',
  };

  return (
    <>
      <SectionTitle icon={Icons.search} count={filtered.length}>
        Datos Completos del Inventario
      </SectionTitle>

      {/* Pending bar */}
      {pendingCount > 0 && (
        <div style={{ background: '#f59e0b', borderRadius: 12, padding: '10px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{pendingCount} celda(s) sin sincronizar</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={syncChanges} disabled={syncing} style={{ background: '#fff', color: '#f59e0b', border: 'none', padding: '6px 16px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              {syncing ? 'Sincronizando…' : 'Sincronizar'}
            </button>
            <button onClick={() => setChanges({})} style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.5)', padding: '6px 14px', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              Descartar
            </button>
          </div>
        </div>
      )}

      <div style={{ background: COLORS.white, borderRadius: 20, padding: 24, border: `1px solid ${COLORS.borderLight}`, boxShadow: '0 2px 16px rgba(99,102,241,0.07)', marginBottom: 24 }}>
        {/* Search + filters */}
        <div style={{ marginBottom: 16 }}>
          <input
            type="text" placeholder="🔍 Buscar por nombre, ítem, proveedor…"
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ width: '100%', padding: '10px 16px', borderRadius: 12, border: `1.5px solid ${COLORS.borderLight}`, fontSize: 14, background: COLORS.bg, color: COLORS.text, boxSizing: 'border-box' }}
            onFocus={e => e.currentTarget.style.borderColor = COLORS.primary}
            onBlur={e => e.currentTarget.style.borderColor = COLORS.borderLight}
          />
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
          <select style={selStyle} value={filterServicio} onChange={e => { setFilterServicio(e.target.value); setPage(1); }}>
            <option value="">Todos los servicios</option>
            {uniqueServicios.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select style={selStyle} value={filterFamilia} onChange={e => { setFilterFamilia(e.target.value); setPage(1); }}>
            <option value="">Todas las familias</option>
            {uniqueFamilias.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <select style={selStyle} value={filterProveedor} onChange={e => { setFilterProveedor(e.target.value); setPage(1); }}>
            <option value="">Todos los proveedores</option>
            {uniqueProveedores.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select style={selStyle} value={filterPiso} onChange={e => { setFilterPiso(e.target.value); setPage(1); }}>
            <option value="">Todos los pisos</option>
            {uniquePisos.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {(search || filterServicio || filterFamilia || filterProveedor || filterPiso) && (
            <button onClick={clearFilters} style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${COLORS.border}`, background: COLORS.white, color: COLORS.textMuted, fontSize: 13, cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.background = COLORS.red; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = COLORS.red; }}
              onMouseLeave={e => { e.currentTarget.style.background = COLORS.white; e.currentTarget.style.color = COLORS.textMuted; e.currentTarget.style.borderColor = COLORS.border; }}>
              Limpiar
            </button>
          )}
        </div>

        <div style={{ marginBottom: 12, fontSize: 13, color: COLORS.textMuted }}>
          Mostrando <span style={{ color: COLORS.primary, fontWeight: 700 }}>{filtered.length}</span> de {items.length} registros
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: COLORS.bg, borderBottom: `2px solid ${COLORS.border}` }}>
                {TABLE_COLS.map(c => (
                  <th key={c.key} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>
                    {c.label}
                  </th>
                ))}
                {gasUrl && <th style={{ padding: '10px 14px', width: 70 }} />}
              </tr>
            </thead>
            <tbody>
              {pageItems.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${COLORS.borderLight}`, transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = COLORS.bg}
                  onMouseLeave={e => e.currentTarget.style.background = COLORS.white}>
                  {TABLE_COLS.map(c => {
                    const changed = changes[`${row._rawIndex}_${c.key}`] !== undefined;
                    const val = changed ? changes[`${row._rawIndex}_${c.key}`] : String(row[c.key] ?? '');
                    return (
                      <td key={c.key} style={{ padding: '10px 14px', fontSize: 13, color: COLORS.text, background: changed ? '#fef9c3' : undefined, whiteSpace: c.key === 'nombre' ? 'nowrap' : undefined, maxWidth: c.key === 'nombre' ? 200 : undefined, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.key === 'entrenamiento' ? (
                          <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: val === 'SI' ? '#dcfce7' : val === 'IU' ? '#fef9c3' : '#f1f5f9', color: val === 'SI' ? '#15803d' : val === 'IU' ? '#a16207' : '#64748b' }}>
                            {val || '—'}
                          </span>
                        ) : val || <span style={{ color: COLORS.textLight }}>—</span>}
                      </td>
                    );
                  })}
                  {gasUrl && (
                    <td style={{ padding: '10px 14px' }}>
                      <button onClick={() => openEdit(row)} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 6, border: `1px solid ${COLORS.border}`, background: COLORS.white, color: COLORS.primary, cursor: 'pointer', fontWeight: 600 }}
                        onMouseEnter={e => { e.currentTarget.style.background = COLORS.primary; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = COLORS.white; e.currentTarget.style.color = COLORS.primary; }}>
                        Editar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 16, borderTop: `1px solid ${COLORS.borderLight}` }}>
            <span style={{ fontSize: 13, color: COLORS.textMuted }}>Página {page} de {totalPages}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '7px 16px', borderRadius: 8, border: `1px solid ${COLORS.border}`, background: page === 1 ? COLORS.borderLight : COLORS.white, cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: 13 }}>← Anterior</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '7px 16px', borderRadius: 8, border: `1px solid ${COLORS.border}`, background: page === totalPages ? COLORS.borderLight : COLORS.white, cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: 13 }}>Siguiente →</button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div onClick={() => setEditItem(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: COLORS.white, borderRadius: 20, padding: 28, width: '90%', maxWidth: 600, maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: COLORS.text }}>Editar Ítem</h2>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: COLORS.textMuted }}>{editItem.item} — {editItem.nombre}</p>
              </div>
              <button onClick={() => setEditItem(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: COLORS.textMuted, padding: '0 4px' }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {TABLE_COLS.filter(c => c.key !== 'item').map(c => (
                <div key={c.key}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: COLORS.textMuted, marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.5 }}>{c.label}</label>
                  {c.key === 'entrenamiento' ? (
                    <select value={editVals[c.key] ?? ''} onChange={e => setEditVals({ ...editVals, [c.key]: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 13, background: COLORS.white }}>
                      <option value="">—</option>
                      <option>SI</option><option>IU</option><option>NA</option>
                    </select>
                  ) : (
                    <input type="text" value={editVals[c.key] ?? ''} onChange={e => setEditVals({ ...editVals, [c.key]: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${COLORS.border}`, fontSize: 13, background: COLORS.white, boxSizing: 'border-box' }}
                      onFocus={e => e.currentTarget.style.borderColor = COLORS.primary}
                      onBlur={e => e.currentTarget.style.borderColor = COLORS.border} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => setEditItem(null)} style={{ padding: '9px 20px', borderRadius: 10, border: `1px solid ${COLORS.border}`, background: COLORS.white, fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>Cancelar</button>
              <button onClick={saveEdit} style={{ padding: '9px 24px', borderRadius: 10, border: 'none', background: COLORS.primary, color: '#fff', fontSize: 14, cursor: 'pointer', fontWeight: 700 }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.primaryDark}
                onMouseLeave={e => e.currentTarget.style.background = COLORS.primary}>
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: COLORS.sidebar, color: '#fff', padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 2000 }}>
          {toast}
        </div>
      )}
    </>
  );
}
