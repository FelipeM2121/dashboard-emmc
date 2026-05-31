import { COLORS } from "../../constants/theme";

interface KPICardProps {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ReactNode;
  color?: string;
  compact?: boolean;
}

export function KPICard({ label, value, sub, icon, color = COLORS.primary, compact = false }: KPICardProps) {
  return (
    <div style={{
      background: COLORS.white,
      border: `1px solid ${COLORS.borderLight}`,
      borderRadius: 20,
      padding: compact ? "18px 20px" : "22px 24px",
      display: "flex",
      alignItems: "center",
      gap: 16,
      boxShadow: "0 2px 12px rgba(99,102,241,0.06), 0 1px 3px rgba(0,0,0,0.04)",
      transition: "all 0.22s ease",
      cursor: "default",
      position: "relative",
      overflow: "hidden",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = `0 8px 28px ${color}20, 0 2px 8px rgba(0,0,0,0.06)`;
      e.currentTarget.style.transform = "translateY(-2px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = "0 2px 12px rgba(99,102,241,0.06), 0 1px 3px rgba(0,0,0,0.04)";
      e.currentTarget.style.transform = "translateY(0)";
    }}>
      {/* Decoración fondo círculo */}
      <div style={{
        position: "absolute", right: -16, top: -16,
        width: 80, height: 80,
        borderRadius: "50%",
        background: `${color}10`,
        pointerEvents: "none",
      }} />
      {/* Ícono glass */}
      <div style={{
        width: compact ? 44 : 52,
        height: compact ? 44 : 52,
        borderRadius: 14,
        background: `linear-gradient(135deg, ${color} 0%, ${color}bb 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        boxShadow: `0 4px 12px ${color}40`,
      }}>
        <div style={{ width: compact ? 22 : 26, height: compact ? 22 : 26, display: "flex" }}>
          {icon}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 11,
          color: COLORS.textMuted,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          marginBottom: 4,
        }}>
          {label}
        </div>
        <div style={{
          fontSize: compact ? 22 : 28,
          fontWeight: 800,
          color: COLORS.text,
          lineHeight: 1.1,
          letterSpacing: "-0.5px",
        }}>
          {typeof value === "number" ? value.toLocaleString("es-CL") : value}
          {sub && (
            <span style={{
              fontSize: compact ? 11 : 12,
              color: COLORS.textMuted,
              fontWeight: 500,
              marginLeft: 5,
              letterSpacing: 0,
            }}>
              {sub}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
