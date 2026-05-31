import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { COLORS, CHART_COLORS } from '../../constants/theme';
import { SectionTitle, DataTable, ProgressBar, CustomTooltip } from '../Shared';
import type { SummaryData } from '../../types';

export function PorFamiliaTab({ summary: S }: { summary: SummaryData }) {
  const maxQty = S.byFamilia[0]?.qty ?? 1;
  return (
    <>
      <SectionTitle count={S.uniqueFamilias}>Distribución por Familia de Equipos</SectionTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={{ background: COLORS.white, borderRadius: 18, padding: 24, border: `1px solid ${COLORS.borderLight}`, boxShadow: '0 2px 16px rgba(99,102,241,0.07)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 16, marginTop: 0 }}>Por cantidad</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={S.byFamilia.slice(0, 12)} layout="vertical" margin={{ top: 5, right: 8, left: 0, bottom: 5 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: COLORS.textMuted }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: COLORS.text }} width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="qty" radius={[0, 8, 8, 0]}>
                {S.byFamilia.slice(0, 12).map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: COLORS.white, borderRadius: 18, padding: 24, border: `1px solid ${COLORS.borderLight}`, boxShadow: '0 2px 16px rgba(99,102,241,0.07)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 16, marginTop: 0 }}>Proporción</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={S.byFamilia.slice(0, 8)} dataKey="qty" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                {S.byFamilia.slice(0, 8).map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <DataTable
        data={S.byFamilia.map((f, i) => ({ ...f, rank: i + 1, pct: ((f.qty / S.totalQty) * 100).toFixed(1) + '%' }))}
        columns={[
          { key: 'rank', label: '#', align: 'center', mono: true, width: '60px' },
          { key: 'name', label: 'Familia', highlight: true },
          { key: 'qty',  label: 'Cantidad', align: 'right', mono: true, width: '120px', render: (v) => v.toLocaleString('es-CL') },
          { key: 'pct',  label: '% del Total', align: 'right', mono: true, width: '120px' },
          { key: 'qty',  label: 'Distribución', hideMobile: true, render: (v) => <ProgressBar value={v} max={maxQty} color={COLORS.green} /> },
        ]}
        maxRows={15}
      />
    </>
  );
}
