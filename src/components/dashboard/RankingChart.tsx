import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LabelList,
} from "recharts";
import { classificacaoTexto } from "@/data/relatorioConteudo";

export type ChartType = "bars" | "columns" | "pie" | "donut" | "radar";

interface Item {
  dimension: string;
  score: number;
}

const colorFor = (score: number) => {
  if (score < 1.67) return "hsl(var(--risk-low))";
  if (score < 2.67) return "hsl(var(--accent))";
  return "hsl(var(--risk-high))";
};

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
};

const shortLabel = (s: string, max = 18) =>
  s.length > max ? s.slice(0, max - 1) + "…" : s;

export const RankingChart = ({
  data,
  type,
  height = 320,
}: {
  data: Item[];
  type: ChartType;
  height?: number;
}) => {
  const top = data.slice(0, 10);

  // ===== BARS (horizontal) — original layout =====
  if (type === "bars") {
    return (
      <div className="space-y-2.5">
        {top.map((d) => {
          const pct = (d.score / 4) * 100;
          const color = colorFor(d.score);
          const label = classificacaoTexto(d.score).label;
          return (
            <div
              key={d.dimension}
              className="grid grid-cols-[1fr_88px] gap-3 items-end"
            >
              <div className="min-w-0">
                <div className="text-[12px] font-medium text-foreground mb-1 truncate">
                  {d.dimension}
                </div>
                <div className="h-5 bg-muted/70 rounded-full overflow-hidden relative">
                  <div
                    className="h-full rounded-full flex items-center justify-end pr-2.5 transition-all"
                    style={{ width: `${Math.max(pct, 8)}%`, background: color }}
                  >
                    <span className="text-[10px] font-bold text-white drop-shadow-sm">
                      {d.score.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-wider text-right pb-0.5"
                style={{ color }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  // ===== COLUMNS (vertical bars via recharts) =====
  if (type === "columns") {
    const chartData = top.map((d) => ({
      name: shortLabel(d.dimension, 14),
      full: d.dimension,
      score: Number(d.score.toFixed(2)),
    }));
    return (
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 16, right: 12, left: -16, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              interval={0}
              angle={-35}
              textAnchor="end"
              height={70}
            />
            <YAxis
              domain={[0, 4]}
              ticks={[0, 1, 2, 3, 4]}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v: number) => [v.toFixed(2), "Score"]}
              labelFormatter={(_, p) => p?.[0]?.payload?.full ?? ""}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              <LabelList dataKey="score" position="top" fontSize={10} fill="hsl(var(--foreground))" />
              {chartData.map((d, i) => (
                <Cell key={i} fill={colorFor(d.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // ===== PIE / DONUT =====
  if (type === "pie" || type === "donut") {
    const chartData = top.map((d) => ({
      name: d.dimension,
      value: Number(d.score.toFixed(2)),
      color: colorFor(d.score),
    }));
    const totalScore = chartData.reduce((s, d) => s + d.value, 0);
    return (
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div style={{ height, width: height }} className="shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={type === "donut" ? "55%" : 0}
                outerRadius="85%"
                paddingAngle={type === "donut" ? 2 : 1}
                stroke="hsl(var(--card))"
                strokeWidth={1}
              >
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v: number, n) => [
                  `${(v as number).toFixed(2)} (${(((v as number) / totalScore) * 100).toFixed(1)}%)`,
                  n,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          {type === "donut" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-primary">
                {(totalScore / chartData.length).toFixed(2)}
              </span>
              <span className="text-[10px] text-muted-foreground">média</span>
            </div>
          )}
        </div>
        <div className="flex-1 w-full grid grid-cols-1 gap-1.5 max-h-[320px] overflow-auto pr-1">
          {chartData.map((d) => (
            <div key={d.name} className="flex items-center gap-2 text-[11px]">
              <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ background: d.color }} />
              <span className="flex-1 truncate text-foreground">{d.name}</span>
              <span className="font-bold tabular-nums text-primary">{d.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ===== RADAR =====
  if (type === "radar") {
    const chartData = top.map((d) => ({
      dimension: shortLabel(d.dimension, 16),
      full: d.dimension,
      score: Number(d.score.toFixed(2)),
    }));
    return (
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} outerRadius="75%">
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 4]}
              tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="hsl(var(--accent))"
              fill="hsl(var(--accent))"
              fillOpacity={0.4}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v: number) => [v.toFixed(2), "Score"]}
              labelFormatter={(_, p) => p?.[0]?.payload?.full ?? ""}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
};

export const CHART_TYPE_OPTIONS: { value: ChartType; label: string }[] = [
  { value: "bars", label: "Barras horizontais" },
  { value: "columns", label: "Colunas verticais" },
  { value: "pie", label: "Pizza" },
  { value: "donut", label: "Rosca (Donut)" },
  { value: "radar", label: "Radar" },
];
