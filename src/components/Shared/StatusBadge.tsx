import { COLORS } from "../../constants/theme";

interface StatusBadgeProps {
  label: string;
  value: number | string;
  color: string;
  icon: React.ReactNode;
}

export function StatusBadge({ label, value, color, icon }: StatusBadgeProps) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "16px 20px",
      background: COLORS.white,
      borderRadius: 16,
      border: `1px solid ${COLORS.borderLight}`,
      boxShadow: "0 2px 12px rgba(99,102,241,0.06), 0 1px 3px rgba(0,0,0,0.04)",
    }}>
      <div style={{
        width: 48,
        height: 48,
        background: `linear-gradient(135deg, ${color} 0%, ${color}bb 100%)`,
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 4px 12px ${color}40`,
        flexShrink: 0,
      }}>
        <div style={{ width: 24, height: 24, display: "flex" }}>
          {icon}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 28,
          fontWeight: 700,
          color: COLORS.text,
          lineHeight: 1,
          marginBottom: 4,
        }}>
          {value}
        </div>
        <div style={{
          fontSize: 12,
          color: COLORS.textMuted,
          fontWeight: 500,
        }}>
          {label}
        </div>
      </div>
    </div>
  );
}
