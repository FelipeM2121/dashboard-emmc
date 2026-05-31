import { useState } from "react";
import { COLORS } from "../../constants/theme";

interface DataTableColumn {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  mono?: boolean;
  width?: string;
  highlight?: boolean;
  hideMobile?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: DataTableColumn[];
  maxRows?: number;
}

export function DataTable({ data, columns, maxRows = 10 }: DataTableProps) {
  const [showAll, setShowAll] = useState(false);
  const display = showAll ? data : data.slice(0, maxRows);

  return (
    <div style={{
      background: COLORS.white,
      borderRadius: 18,
      overflow: "hidden",
      border: `1px solid ${COLORS.borderLight}`,
      boxShadow: "0 2px 16px rgba(99,102,241,0.07), 0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <div className="data-table-scroll">
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr style={{
              background: `${COLORS.primary}08`,
              borderBottom: `1px solid ${COLORS.borderLight}`,
            }}>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={col.hideMobile ? "dt-hide-mobile" : undefined}
                  style={{
                    textAlign: col.align || "left",
                    padding: "13px 16px",
                    fontWeight: 700,
                    fontSize: 11,
                    color: COLORS.primary,
                    letterSpacing: 0.8,
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    width: col.width || undefined,
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {display.map((row, i) => (
              <tr
                key={i}
                style={{ borderBottom: i < display.length - 1 ? `1px solid ${COLORS.borderLight}` : "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = `${COLORS.primary}05`)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {columns.map((col, j) => {
                  const val = row[col.key];
                  return (
                    <td
                      key={j}
                      className={col.hideMobile ? "dt-hide-mobile" : undefined}
                      style={{
                        textAlign: col.align || "left",
                        padding: "13px 16px",
                        fontSize: 13.5,
                        color: col.highlight ? COLORS.text : COLORS.textMuted,
                        fontWeight: col.highlight ? 600 : 400,
                        fontFamily: col.mono ? "'SF Mono', 'Monaco', monospace" : "inherit",
                        fontVariantNumeric: col.mono ? "tabular-nums" : "normal",
                        whiteSpace: col.mono ? "nowrap" : undefined,
                      }}
                    >
                      {col.render ? col.render(val, row) : val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length > maxRows && (
        <div style={{
          padding: "14px 20px",
          textAlign: "center",
          borderTop: `1px solid ${COLORS.borderLight}`,
          background: `${COLORS.primary}05`,
        }}>
          <button onClick={() => setShowAll(!showAll)} style={{
            background: COLORS.primary,
            color: COLORS.white,
            border: "none",
            padding: "8px 22px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: `0 4px 12px ${COLORS.primary}40`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.primaryDark; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.primary; e.currentTarget.style.transform = "translateY(0)"; }}>
            {showAll ? "Mostrar menos" : `Ver ${data.length - maxRows} más`}
          </button>
        </div>
      )}
    </div>
  );
}
