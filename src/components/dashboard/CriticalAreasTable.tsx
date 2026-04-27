import { classifyRisk, riskLabel } from "@/data/copsoq";
import { cn } from "@/lib/utils";

interface Row { department: string; cells: { dim: string; score: number }[]; avg: number }

const priorityFor = (avg: number) => {
  const c = classifyRisk(avg);
  return c === "high" ? { label: "Alta", style: "bg-risk-high text-white" }
    : c === "moderate" ? { label: "Média", style: "bg-risk-moderate text-white" }
    : { label: "Baixa", style: "bg-risk-low text-white" };
};

export const CriticalAreasTable = ({ data }: { data: Row[] }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border">
          <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground py-2">Área</th>
          <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground py-2">Risco Médio</th>
          <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground py-2">Classificação</th>
          <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground py-2">Fator Mais Crítico</th>
          <th className="text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground py-2">Prioridade</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => {
          const top = [...row.cells].sort((a, b) => b.score - a.score)[0];
          const p = priorityFor(row.avg);
          const cls = classifyRisk(row.avg);
          return (
            <tr key={row.department} className={cn("border-b border-border last:border-0", cls === "high" && "bg-risk-high-bg/30")}>
              <td className="py-3 font-semibold text-foreground">{row.department}</td>
              <td className="py-3 tabular-nums font-medium">{row.avg.toFixed(2)} / 4</td>
              <td className="py-3">
                <span className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded",
                  cls === "high" ? "bg-risk-high-bg text-risk-high"
                  : cls === "moderate" ? "bg-risk-moderate-bg text-risk-moderate"
                  : "bg-risk-low-bg text-risk-low",
                )}>{riskLabel(cls)}</span>
              </td>
              <td className="py-3 text-foreground">{top.dim} <span className="text-muted-foreground">({top.score.toFixed(2)})</span></td>
              <td className="py-3 text-right">
                <span className={cn("text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded", p.style)}>{p.label}</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
