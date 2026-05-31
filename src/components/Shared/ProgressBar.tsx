import { COLORS } from "../../constants/theme";

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
}

export function ProgressBar({ value, max, color = COLORS.primary }: ProgressBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{
      background: COLORS.borderLight,
      borderRadius: 4,
      height: 6,
      overflow: "hidden",
    }}>
      <div style={{
        background: color,
        width: `${pct}%`,
        height: "100%",
        borderRadius: 4,
        transition: "width 0.4s ease",
      }} />
    </div>
  );
}
