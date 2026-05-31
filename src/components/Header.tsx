import { COLORS } from '../constants/theme';
import { TABS } from './Sidebar';

const TAB_SUBTITLES: Record<string, string> = {
  'Resumen':       'Vista general del equipamiento médico',
  'Por Servicio':  'Distribución por servicio clínico',
  'Por Proveedor': 'Análisis por proveedor adjudicado',
  'Por Familia':   'Desglose por familia de equipos',
  'Por Fecha':     'Cronograma de instalación',
  'Tabla':         'Datos completos y edición',
};

interface HeaderProps {
  activeTab: string;
}

export function Header({ activeTab }: HeaderProps) {
  const tab = TABS.find(t => t.name === activeTab);

  return (
    <div className="dashboard-header">
      <div className="dashboard-header-left">
        <div style={{
          width: 64, height: 64,
          background: `linear-gradient(135deg, ${COLORS.blue} 0%, ${COLORS.primary} 100%)`,
          borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: `0 4px 16px ${COLORS.primary}40`,
        }}>
          <svg viewBox="0 0 24 24" fill="none" width="36" height="36">
            <rect x="3" y="3" width="18" height="18" rx="3" fill="white" fillOpacity="0.2"/>
            <rect x="10.5" y="5" width="3" height="14" rx="1.5" fill="white" fillOpacity="0.9"/>
            <rect x="5" y="10.5" width="14" height="3" rx="1.5" fill="white" fillOpacity="0.9"/>
          </svg>
        </div>
        <div>
          <h1 className="dashboard-title">EMMC</h1>
          <p className="dashboard-subtitle">Dashboard Equipamiento Médico — Hospital Buin Paine</p>
        </div>
      </div>

      {tab && (
        <div className="dashboard-tab-badge" style={{
          background: `${tab.color}15`,
          border: `1px solid ${tab.color}30`,
          color: tab.color,
        }}>
          <div className="dashboard-tab-badge-icon" style={{
            filter: `drop-shadow(0 0 4px ${tab.color}60)`,
          }}>
            <div style={{
              width: 18, height: 18,
              background: `linear-gradient(135deg, ${tab.color}, ${tab.color}bb)`,
              borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 2,
            }}>
              {tab.icon}
            </div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600 }}>
            {TAB_SUBTITLES[activeTab] || activeTab}
          </span>
        </div>
      )}
    </div>
  );
}
