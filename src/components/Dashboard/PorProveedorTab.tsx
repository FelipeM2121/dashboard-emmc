import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { COLORS, CHART_COLORS } from '../../constants/theme';
import { SectionTitle, DataTable, ProgressBar, CustomTooltip, KPICard } from '../Shared';
import { Icons } from '../../constants/icons';
import type { SummaryData } from '../../types';

export function PorProveedorTab({ summary: S }: { summary: SummaryData }) {
  const maxQty = S.byProveedor[0]?.qty ?? 1;
  return (
    <>
      <SectionTitle count={S.uniqueProveedores}>Análisis por Proveedor</SectionTitle>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 28 }}>
        {S.byProveedor.map((p, i) => (
          <KPICard key={i} label={p.name} value={p.qty} sub={`${((p.qty / S.totalQty) * 100).toFixed(1)}%`} icon={Icons.building} color={CHART_COLORS[i % CHART_COLORS.length]} />
        ))}
      </div>

      {/* Bar chart */}
      <div style={{ background: COLORS.white, borderRadius: 18, padding: 24, border: `1px solid ${COLORS.borderLight}`, boxShadow: '0 2px 16px rgba(99,102,241,0.07)', marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 20, marginTop: 0 }}>Distribución por Proveedor</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={S.byProveedor} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="20%">
            <XAxis dataKey="name" tick={{ fill: COLORS.textMuted, fontSize: 10 }} axisLine={{ stroke: COLORS.border }} interval={0} height={48} tickFormatter={(v: string) => v.length > 12 ? v.slice(0, 12) + '…' : v} />
            <YAxis tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="qty" name="Cantidad" radius={[6, 6, 0, 0]}>
              {S.byProveedor.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <DataTable
        data={S.byProveedor.map((p, i) => ({ ...p, rank: i + 1, pct: ((p.qty / S.totalQty) * 100).toFixed(1) + '%' }))}
        columns={[
          { key: 'rank', label: '#', align: 'center', mono: true, width: '60px' },
          { key: 'name', label: 'Proveedor', highlight: true },
          { key: 'qty',  label: 'Cantidad', align: 'right', mono: true, width: '100px', render: (v) => v.toLocaleString('es-CL') },
          { key: 'pct',  label: '% del Total', align: 'right', mono: true, width: '110px' },
          { key: 'qty',  label: 'Distribución', hideMobile: true, render: (v) => <ProgressBar value={v} max={maxQty} color={COLORS.orange} /> },
        ]}
        maxRows={20}
      />
    </>
  );
}
