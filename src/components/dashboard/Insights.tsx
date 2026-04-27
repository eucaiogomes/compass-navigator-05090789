import { Insight, Recommendation } from "@/data/copsoq";
import { AlertTriangle, AlertCircle, CheckCircle2, Lightbulb, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const iconFor = (s: Insight["severity"]) => (s === "high" ? AlertTriangle : s === "moderate" ? AlertCircle : CheckCircle2);
const styleFor = (s: Insight["severity"]) =>
  s === "high"
    ? "border-l-risk-high bg-risk-high-bg/50 text-risk-high"
    : s === "moderate"
    ? "border-l-risk-moderate bg-risk-moderate-bg/50 text-risk-moderate"
    : "border-l-risk-low bg-risk-low-bg/50 text-risk-low";

export const InsightsList = ({ insights }: { insights: Insight[] }) => (
  <div className="space-y-2.5">
    {insights.map((i, idx) => {
      const Icon = iconFor(i.severity);
      return (
        <div key={idx} className={cn("border-l-4 rounded-md p-3 flex gap-3 items-start", styleFor(i.severity))}>
          <Icon className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground leading-snug">{i.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{i.detail}</p>
          </div>
        </div>
      );
    })}
    {!insights.length && <p className="text-sm text-muted-foreground italic">Sem alertas para os filtros selecionados.</p>}
  </div>
);

export const RecommendationsList = ({ recs }: { recs: Recommendation[] }) => (
  <div className="grid sm:grid-cols-2 gap-3">
    {recs.map((r, idx) => (
      <div key={idx} className="border border-border rounded-lg p-3.5 bg-card hover:shadow-card transition-shadow">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="h-4 w-4 text-accent" />
          <span className="text-xs font-bold uppercase tracking-wider text-primary">{r.factor}</span>
          <span
            className={cn(
              "ml-auto text-[10px] font-semibold px-2 py-0.5 rounded",
              r.impact === "Alto" ? "bg-risk-high-bg text-risk-high" : "bg-risk-moderate-bg text-risk-moderate",
            )}
          >
            Impacto {r.impact}
          </span>
        </div>
        <p className="text-sm text-foreground leading-snug">{r.action}</p>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-2 pt-2 border-t border-border">
          <ArrowRight className="h-3 w-3" />
          Área alvo: <span className="font-semibold text-foreground">{r.target}</span>
        </div>
      </div>
    ))}
    {!recs.length && <p className="text-sm text-muted-foreground italic col-span-full">Sem recomendações críticas no momento.</p>}
  </div>
);
