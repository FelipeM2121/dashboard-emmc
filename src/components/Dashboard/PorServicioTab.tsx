import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { COLORS, CHART_COLORS } from '../../constants/theme';
import { SectionTitle, DataTable, ProgressBar, CustomTooltip } from '../Shared';
import type { SummaryData } from '../../types';

export function PorServicioTab({ summary: S }: { summary: SummaryData }) {
  const maxQty = S.byServicio[0]?.qty ?? 1;
  return (
    <>
      <SectionTitle count={S.uniqueServicios}>Cantidad por Servicio Clínico</SectionTitle>
      <div style={{ background: COLORS.white, borderRadius: 18, padding: 24, border: `1px solid ${COLORS.borderLight}`, boxShadow: '0 2px 16px rgba(99,102,241,0.07)', marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={Math.max(400, S.byServicio.slice(0, 20).length * 28)}>
          <BarChart data={S.byServicio.slice(0, 20)} layout="vertical" margin={{ top: 5, right: 8, left: 0, bottom: 5 }}>
            <XAxis type="number" tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} />
            <YAxis type="category" dataKey="name" width={160} tick={{ fill: COLORS.text, fontSize: 10 }} axisLine={{ stroke: COLORS.border }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="qty" name="Cantidad" radius={[0, 6, 6, 0]}>
              {S.byServicio.slice(0, 20).map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <DataTable
        data={S.byServicio.map((s, i) => ({ ...s, rank: i + 1, pct: ((s.qty / S.totalQty) * 100).toFixed(1) + '%' }))}
        columns={[
          { key: 'rank', label: '#', align: 'center', mono: true, width: '60px' },
          { key: 'name', label: 'Servicio', highlight: true },
          { key: 'qty',  label: 'Cantidad', align: 'right', mono: true, width: '120px', render: (v) => v.toLocaleString('es-CL') },
          { key: 'pct',  label: '% del Total', align: 'right', mono: true, width: '120px' },
          { key: 'qty',  label: 'Distribución', hideMobile: true, render: (v) => <ProgressBar value={v} max={maxQty} color={COLORS.red} /> },
        ]}
        maxRows={15}
      />
    </>
  );
}
