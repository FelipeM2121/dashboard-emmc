import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { COLORS, CHART_COLORS } from '../../constants/theme';
import { Icons } from '../../constants/icons';
import { KPICard, SectionTitle, StatusBadge, DataTable, ProgressBar, CustomTooltip } from '../Shared';
import type { SummaryData } from '../../types';

const MESES_FULL = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function formatMonth(ym: string): string {
  const [y, m] = ym.split('-');
  if (!y || !m) return ym;
  return `${MESES_FULL[parseInt(m, 10) - 1] || m} ${y}`;
}

function formatDate(s: string): string {
  if (!s) return '—';
  const [y, m, d] = s.split('-');
  if (!y || !m || !d) return s;
  return `${parseInt(d, 10)} ${MESES_FULL[parseInt(m, 10) - 1]?.slice(0, 3) || m} ${y}`;
}

export function PorFechaTab({ summary: S }: { summary: SummaryData }) {
  const F = S.fechaStats;
  const maxMes = S.byMes[0]?.qty ?? 1;

  if (F.totalConFecha === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 60, color: COLORS.textMuted }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>📅</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>Sin fechas disponibles</div>
        <div style={{ fontSize: 14 }}>La columna "Inicio" de la planilla no tiene fechas cargadas.</div>
      </div>
    );
  }

  return (
    <>
      <SectionTitle icon={Icons.calendar}>Cronograma de Instalación</SectionTitle>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
        <KPICard label="Fecha Inicio"  value={formatDate(F.fechaMin)} sub="primera instalación" icon={Icons.calendar} color={COLORS.green} compact />
        <KPICard label="Fecha Término" value={formatDate(F.fechaMax)} sub="última instalación"  icon={Icons.calendar} color={COLORS.orange} compact />
        <KPICard label="Meses"         value={F.totalMeses}            sub="de instalación"      icon={Icons.chart}    color={COLORS.primary} compact />
        <KPICard label="Con fecha"     value={F.totalConFecha}         sub="ítems programados"   icon={Icons.list}     color={COLORS.purple} compact />
      </div>

      <SectionTitle>Distribución Mensual</SectionTitle>
      <div style={{ background: COLORS.white, borderRadius: 18, padding: 24, border: `1px solid ${COLORS.borderLight}`, boxShadow: '0 2px 16px rgba(99,102,241,0.07)', marginBottom: 24 }}>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={S.byMes.map(m => ({ ...m, name: formatMonth(m.name) }))} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fill: COLORS.textMuted, fontSize: 10 }} axisLine={{ stroke: COLORS.border }} interval={0} height={44} />
            <YAxis tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="qty" name="Cantidad" radius={[6, 6, 0, 0]}>
              {S.byMes.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <DataTable
        data={S.byMes.map((m, i) => ({ ...m, name: formatMonth(m.name), rank: i + 1, pct: ((m.qty / S.totalQty) * 100).toFixed(1) + '%' }))}
        columns={[
          { key: 'rank', label: '#', align: 'center', mono: true, width: '60px' },
          { key: 'name', label: 'Mes', highlight: true, width: '200px' },
          { key: 'qty',  label: 'Cantidad', align: 'right', mono: true, width: '120px', render: (v) => v.toLocaleString('es-CL') },
          { key: 'pct',  label: '% del Total', align: 'right', mono: true, width: '120px' },
          { key: 'qty',  label: 'Distribución', hideMobile: true, render: (v) => <ProgressBar value={v} max={maxMes} color={COLORS.primary} /> },
        ]}
        maxRows={6}
      />

      {S.byDia.length > 0 && (
        <>
          <SectionTitle>Top Días con Más Instalaciones</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            {S.byDia.map((d, i) => (
              <StatusBadge key={i} label={formatDate(d.name)} value={d.qty} color={CHART_COLORS[i % CHART_COLORS.length]} icon={Icons.calendar} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
