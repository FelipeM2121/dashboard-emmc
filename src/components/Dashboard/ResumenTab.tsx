import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { COLORS, CHART_COLORS } from '../../constants/theme';
import { Icons } from '../../constants/icons';
import { KPICard, SectionTitle, StatusBadge, DataTable, ProgressBar, CustomTooltip } from '../Shared';
import type { SummaryData } from '../../types';

interface ResumenTabProps { summary: SummaryData; }

export function ResumenTab({ summary: S }: ResumenTabProps) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 767);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const maxPrv = S.byProveedor[0]?.qty ?? 1;

  return (
    <>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
        <KPICard label="Total Equipos"   value={S.totalQty}          sub="unidades"   icon={Icons.stack}    color={COLORS.green} />
        <KPICard label="Proveedores"     value={S.uniqueProveedores} sub="adjudicados" icon={Icons.building} color={COLORS.orange} />
        <KPICard label="Servicios"       value={S.uniqueServicios}   sub="clínicos"   icon={Icons.hospital} color={COLORS.red} />
      </div>

      {/* Status badges */}
      <SectionTitle>Estado del Inventario</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatusBadge label="Familias"    value={S.uniqueFamilias}    color={COLORS.green}   icon={Icons.folder} />
        <StatusBadge label="Pisos"       value={S.uniquePisos}       color={COLORS.cyan}    icon={Icons.layers} />
        <StatusBadge label="Servicios"   value={S.uniqueServicios}   color={COLORS.primary} icon={Icons.hospital} />
        <StatusBadge label="Proveedores" value={S.uniqueProveedores} color={COLORS.orange}  icon={Icons.building} />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 14 : 20, marginBottom: 32 }}>
        <div className="chart-card" style={{ background: COLORS.white, borderRadius: 18, padding: 24, border: `1px solid ${COLORS.borderLight}`, boxShadow: '0 2px 16px rgba(99,102,241,0.07)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 20, marginTop: 0 }}>Distribución por Familia</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={S.byFamilia.slice(0, 10)} layout="vertical" margin={{ top: 5, right: 8, left: 0, bottom: 5 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: COLORS.textMuted }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: COLORS.text }} width={isMobile ? 80 : 110} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="qty" radius={[0, 8, 8, 0]}>
                {S.byFamilia.slice(0, 10).map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card" style={{ background: COLORS.white, borderRadius: 18, padding: 24, border: `1px solid ${COLORS.borderLight}`, boxShadow: '0 2px 16px rgba(99,102,241,0.07)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 20, marginTop: 0 }}>Top Proveedores</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={S.byProveedor.slice(0, 8)} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="20%">
              <XAxis dataKey="name" tick={{ fill: COLORS.textMuted, fontSize: isMobile ? 8 : 10 }} axisLine={{ stroke: COLORS.border }} interval={0} height={40} tickFormatter={(v: string) => v.length > 12 ? v.slice(0, 12) + '…' : v} />
              <YAxis tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="qty" name="Cantidad" radius={[6, 6, 0, 0]}>
                {S.byProveedor.slice(0, 8).map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Proveedores cards */}
      <SectionTitle count={S.uniqueProveedores}>Análisis de Proveedores</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 32 }}>
        {S.byProveedor.slice(0, 6).map((p, i) => (
          <KPICard key={i} label={p.name} value={p.qty} sub={`${((p.qty / S.totalQty) * 100).toFixed(1)}%`} icon={Icons.building} color={CHART_COLORS[i]} compact />
        ))}
      </div>

      {/* Tabla proveedores */}
      <DataTable
        data={S.byProveedor.map((p, i) => ({ ...p, rank: i + 1, pct: ((p.qty / S.totalQty) * 100).toFixed(1) + '%' }))}
        columns={[
          { key: 'rank', label: '#', align: 'center', mono: true, width: '60px' },
          { key: 'name', label: 'Proveedor', highlight: true },
          { key: 'qty',  label: 'Cantidad', align: 'right', mono: true, width: '100px', render: (v) => v.toLocaleString('es-CL') },
          { key: 'pct',  label: '% del Total', align: 'right', mono: true, width: '110px' },
          { key: 'qty',  label: 'Distribución', hideMobile: true, render: (v) => <ProgressBar value={v} max={maxPrv} color={COLORS.green} /> },
        ]}
        maxRows={10}
      />

      {/* Top 5 equipos */}
      <SectionTitle action="Ver todos">Top 5 Equipos</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 40 }}>
        {S.byFamilia.slice(0, 5).map((p, i) => (
          <KPICard key={i} label={p.name} value={p.qty} sub="uds" icon={[Icons.tag, Icons.box, Icons.folder, Icons.stack, Icons.list][i]} color={CHART_COLORS[i]} compact />
        ))}
      </div>
    </>
  );
}
