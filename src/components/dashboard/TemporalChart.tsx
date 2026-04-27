import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Point { mes: string; "Risco Geral": number; Estresse: number; "Carga de Trabalho": number; Burnout: number }

export const TemporalChart = ({ data }: { data: Point[] }) => (
  <div className="h-[280px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={false} />
        <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
          formatter={(v: number) => v.toFixed(2)}
        />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} iconType="circle" />
        <Line type="monotone" dataKey="Risco Geral" stroke="hsl(var(--chart-1))" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="Estresse" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 2 }} />
        <Line type="monotone" dataKey="Carga de Trabalho" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ r: 2 }} />
        <Line type="monotone" dataKey="Burnout" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={{ r: 2 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
