import './Sidebar.css';
import { COLORS } from '../constants/theme';
import { Icons } from '../constants/icons';

export interface TabConfig {
  name: string;
  icon: React.ReactNode;
  color: string;
}

export const TABS: TabConfig[] = [
  { name: 'Resumen',      icon: Icons.chart,    color: COLORS.primary },
  { name: 'Por Servicio', icon: Icons.hospital, color: COLORS.red },
  { name: 'Por Proveedor',icon: Icons.building, color: COLORS.orange },
  { name: 'Por Familia',  icon: Icons.folder,   color: COLORS.green },
  { name: 'Por Fecha',    icon: Icons.calendar, color: '#f59e0b' },
  { name: 'Tabla',        icon: Icons.list,     color: COLORS.purple },
];

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
              <div className="sidebar-tab-icon" style={{ opacity: isActive ? 1 : 0.5 }}>
                {tab.icon}
              </div>
              <span className="sidebar-tab-label">{SHORT_LABELS[tab.name]}</span>
            </button>
          );
        })}
      </div>

      <div className="sidebar-divider" />

      {/* Status dot */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        padding: '12px 0',
      }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: status === 'ready' ? COLORS.green : status === 'error' ? COLORS.red : COLORS.orange,
          boxShadow: status === 'ready' ? `0 0 6px ${COLORS.green}` : undefined,
        }} />
        <span style={{ fontSize: 9, color: COLORS.textSidebar, textAlign: 'center', padding: '0 4px', lineHeight: 1.3 }}>
          {updated || (status === 'loading' ? 'Cargando…' : status === 'error' ? 'Error' : '')}
        </span>
      </div>
    </div>
  );
}
