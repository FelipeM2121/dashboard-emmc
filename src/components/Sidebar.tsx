import './Sidebar.css';
import { COLORS } from '../constants/theme';
import { Icons } from '../constants/icons';

export interface TabConfig {
  name: string;
  icon: React.ReactNode;
  color: string;
}

export const TABS: TabConfig[] = [
  { name: 'Resumen',       icon: Icons.chart,    color: COLORS.primary },
  { name: 'Por Servicio',  icon: Icons.hospital, color: COLORS.red },
  { name: 'Por Proveedor', icon: Icons.building, color: COLORS.orange },
  { name: 'Por Familia',   icon: Icons.folder,   color: COLORS.green },
  { name: 'Por Fecha',     icon: Icons.calendar, color: '#f59e0b' },
  { name: 'Tabla',         icon: Icons.list,     color: COLORS.purple },
];

const FULL_LABELS: Record<string, string> = {
  'Resumen':       'Resumen General',
  'Por Servicio':  'Por Servicio',
  'Por Proveedor': 'Por Proveedor',
  'Por Familia':   'Por Familia',
  'Por Fecha':     'Por Fecha',
  'Tabla':         'Tabla de Datos',
};

const SHORT_LABELS: Record<string, string> = {
  'Resumen':       'Resumen',
  'Por Servicio':  'Servicio',
  'Por Proveedor': 'Proveedor',
  'Por Familia':   'Familia',
  'Por Fecha':     'Fecha',
  'Tabla':         'Tabla',
};

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  updated: string;
  status: 'loading' | 'ready' | 'error';
}

export function Sidebar({ activeTab, onTabChange, updated, status }: SidebarProps) {
  return (
    <div className="sidebar">
      {/* Logo / brand */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
            <rect x="10.5" y="5" width="3" height="14" rx="1.5" fill="white" fillOpacity="0.9"/>
            <rect x="5" y="10.5" width="14" height="3" rx="1.5" fill="white" fillOpacity="0.9"/>
          </svg>
        </div>
        <div>
          <div className="sidebar-logo-text">EMMC</div>
          <div className="sidebar-logo-sub">Hospital Buin Paine</div>
        </div>
      </div>

      <div className="sidebar-nav">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => onTabChange(tab.name)}
              title={tab.name}
              className={`sidebar-tab-btn${isActive ? ' active' : ''}`}
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${tab.color} 0%, ${tab.color}cc 100%)`
                  : 'transparent',
                boxShadow: isActive ? `0 4px 16px ${tab.color}55` : 'none',
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = `${tab.color}22`; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <div className="sidebar-tab-icon" style={{ opacity: isActive ? 1 : 0.6 }}>
                {tab.icon}
              </div>
              <span className="sidebar-tab-label">
                {/* desktop: full name; mobile: short */}
                <span className="label-full">{FULL_LABELS[tab.name]}</span>
                <span className="label-short">{SHORT_LABELS[tab.name]}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="sidebar-divider" />

      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px' }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
          background: status === 'ready' ? COLORS.green : status === 'error' ? COLORS.red : COLORS.orange,
          boxShadow: status === 'ready' ? `0 0 5px ${COLORS.green}` : undefined,
        }} />
        <span style={{ fontSize: 10, color: COLORS.textSidebar, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {updated || (status === 'loading' ? 'Cargando…' : status === 'error' ? 'Error' : '')}
        </span>
      </div>
    </div>
  );
}
