import { COLORS } from "../../constants/theme";

interface SectionTitleProps {
  children: string;
  count?: number;
  action?: string;
  icon?: React.ReactNode;
}

export function SectionTitle({ children, count, action, icon }: SectionTitleProps) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
      marginTop: 28,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {icon && (
          <div style={{
            width: 32, height: 32,
            background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryDark} 100%)`,
            borderRadius: 9,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 3px 8px ${COLORS.primary}35`,
          }}>
            <div style={{ width: 16, height: 16, display: "flex" }}>
              {icon}
            </div>
          </div>
        )}
        <h2 style={{
          fontSize: 17,
          fontWeight: 700,
          color: COLORS.text,
          margin: 0,
          letterSpacing: "-0.3px",
        }}>
          {children}
        </h2>
        {count !== undefined && (
          <span style={{
            background: `${COLORS.primary}15`,
            color: COLORS.primary,
            padding: "3px 10px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
          }}>
            {count}
          </span>
        )}
      </div>
      {action && (
        <button style={{
          background: `${COLORS.primary}12`,
          color: COLORS.primary,
          border: "none",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          padding: "6px 14px",
          borderRadius: 20,
          transition: "all 0.2s ease",
          letterSpacing: 0.3,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.primary; e.currentTarget.style.color = "#fff"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = `${COLORS.primary}12`; e.currentTarget.style.color = COLORS.primary; }}>
          {action}
        </button>
      )}
    </div>
  );
}
