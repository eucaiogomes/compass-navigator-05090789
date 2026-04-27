import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Slice { name: string; value: number; pct: number; color: string }

export const RiskDistributionChart = ({ data }: { data: Slice[] }) => {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="relative h-[220px] w-[220px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={70} outerRadius={100} paddingAngle={2} stroke="none">
              {data.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              formatter={(v: number, _n, p: { payload: Slice }) => [`${v} colaboradores (${p.payload.pct.toFixed(1)}%)`, p.payload.name]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-primary">{total}</span>
          <span className="text-xs text-muted-foreground">colaboradores</span>
        </div>
      </div>

      <div className="flex-1 space-y-3 w-full">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-sm shrink-0" style={{ background: d.color }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-foreground">{d.name}</span>
                <span className="text-sm font-bold text-primary tabular-nums">{d.pct.toFixed(1)}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                <div className="h-full rounded-full transition-all" style={{ width: `${d.pct}%`, background: d.color }} />
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">{d.value} colaboradores</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
