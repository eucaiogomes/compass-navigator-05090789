import { classifyRisk } from "@/data/copsoq";

interface Item { dimension: string; score: number }

const colorFor = (score: number) => {
  const c = classifyRisk(score);
  return c === "low" ? "hsl(var(--risk-low))" : c === "moderate" ? "hsl(var(--risk-moderate))" : "hsl(var(--risk-high))";
};

export const DimensionBarsChart = ({ data }: { data: Item[] }) => {
  const top = data.slice(0, 10);
  return (
    <div className="space-y-2.5">
      {top.map((d) => {
        const pct = (d.score / 4) * 100;
        const color = colorFor(d.score);
        return (
          <div key={d.dimension} className="grid grid-cols-[1fr_auto] gap-3 items-center" title={`${d.dimension}: ${d.score.toFixed(2)} / 4`}>
            <div className="min-w-0">
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className="text-xs font-medium text-foreground truncate">{d.dimension}</span>
              </div>
              <div className="h-6 bg-muted rounded-md overflow-hidden relative">
                <div
                  className="h-full rounded-md transition-all flex items-center justify-end pr-2"
                  style={{ width: `${pct}%`, background: color }}
                >
                  <span className="text-[11px] font-bold text-white drop-shadow">{d.score.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider w-20 text-right" style={{ color }}>
              {classifyRisk(d.score) === "low" ? "Baixo" : classifyRisk(d.score) === "moderate" ? "Moderado" : "Alto"}
            </span>
          </div>
        );
      })}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-border mt-2">
        <span>Escala COPSOQ II: 0 (mínimo) — 4 (máximo)</span>
        <span>Top 10 dimensões por risco</span>
      </div>
    </div>
  );
};
