import { TOP_DIMENSIONS } from "@/data/copsoq";

interface Cell { dim: string; score: number }
interface Row { department: string; cells: Cell[]; avg: number }

const cellColor = (score: number) => {
  // Gradient: green (0) -> yellow (2) -> red (4)
  const t = Math.max(0, Math.min(1, score / 4));
  let h: number, l: number;
  if (t < 0.5) {
    // green -> yellow
    h = 142 - (142 - 42) * (t / 0.5);
    l = 44;
  } else {
    // yellow -> red
    h = 42 - (42 - 0) * ((t - 0.5) / 0.5);
    l = 50;
  }
  return `hsl(${h}, 75%, ${l}%)`;
};

const textOn = (score: number) => (score > 1.5 ? "white" : "hsl(var(--primary))");

export const Heatmap = ({ data }: { data: Row[] }) => {
  const cols = TOP_DIMENSIONS;
  return (
    <div className="overflow-x-auto -mx-2 px-2">
      <table className="w-full border-separate border-spacing-1 min-w-[760px]">
        <thead>
          <tr>
            <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground pb-2 sticky left-0 bg-card">Área</th>
            {cols.map((c) => (
              <th key={c} className="text-[10px] font-semibold uppercase tracking-tight text-muted-foreground pb-2 px-1 align-bottom">
                <div className="leading-tight">{c}</div>
              </th>
            ))}
            <th className="text-[10px] font-semibold uppercase tracking-tight text-muted-foreground pb-2 px-1">Média</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.department}>
              <td className="text-sm font-semibold text-foreground pr-3 sticky left-0 bg-card whitespace-nowrap">{row.department}</td>
              {row.cells.map((c) => (
                <td key={c.dim}>
                  <div
                    className="h-12 rounded-md flex items-center justify-center text-xs font-bold transition-transform hover:scale-105 cursor-default"
                    style={{ background: cellColor(c.score), color: textOn(c.score) }}
                    title={`${row.department} — ${c.dim}: ${c.score.toFixed(2)} / 4`}
                  >
                    {c.score.toFixed(1)}
                  </div>
                </td>
              ))}
              <td>
                <div
                  className="h-12 rounded-md flex items-center justify-center text-xs font-bold border-2 border-primary/20"
                  style={{ background: cellColor(row.avg), color: textOn(row.avg) }}
                  title={`Média geral: ${row.avg.toFixed(2)}`}
                >
                  {row.avg.toFixed(2)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-3">
          <span className="font-semibold uppercase tracking-wider">Escala:</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-6 rounded-sm" style={{ background: cellColor(0.5) }} /> Baixo</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-6 rounded-sm" style={{ background: cellColor(2) }} /> Moderado</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-6 rounded-sm" style={{ background: cellColor(3.5) }} /> Alto</span>
        </div>
        <span>Áreas ordenadas por criticidade</span>
      </div>
    </div>
  );
};
