import { Card } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, Minus, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KPI {
  label: string;
  value: string;
  variation: number; // %
  variationLowerIsBetter?: boolean;
  badge?: { label: string; variant: "low" | "moderate" | "high" };
  icon: LucideIcon;
  caption?: string;
}

const badgeStyles = {
  low: "bg-risk-low-bg text-risk-low border-risk-low/30",
  moderate: "bg-risk-moderate-bg text-risk-moderate border-risk-moderate/40",
  high: "bg-risk-high-bg text-risk-high border-risk-high/40",
};

export const KPICard = ({ label, value, variation, variationLowerIsBetter, badge, icon: Icon, caption }: KPI) => {
  const positiveDirection = variationLowerIsBetter ? variation < 0 : variation > 0;
  const isFlat = Math.abs(variation) < 0.5;
  const ArrowIcon = isFlat ? Minus : positiveDirection ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="p-5 shadow-card border-border hover:shadow-elevated transition-shadow animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold text-primary leading-none">{value}</p>
          {caption && <p className="text-xs text-muted-foreground mt-0.5">{caption}</p>}
        </div>
        <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-primary" strokeWidth={2.2} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        {badge ? (
          <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-md border", badgeStyles[badge.variant])}>
            {badge.label}
          </span>
        ) : <span />}
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md",
            isFlat
              ? "bg-muted text-muted-foreground"
              : positiveDirection
              ? "bg-risk-low-bg text-risk-low"
              : "bg-risk-high-bg text-risk-high",
          )}
          title="Variação vs. período anterior"
        >
          <ArrowIcon className="h-3.5 w-3.5" />
          {isFlat ? "Estável" : `${variation > 0 ? "+" : ""}${variation.toFixed(1)}%`}
        </div>
      </div>
    </Card>
  );
};
