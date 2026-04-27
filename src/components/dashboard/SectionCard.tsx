import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const SectionCard = ({ title, description, action, children, className = "" }: Props) => (
  <Card className={`p-5 shadow-card border-border ${className}`}>
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        <h3 className="text-base font-bold text-primary tracking-tight">{title}</h3>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {action}
    </div>
    {children}
  </Card>
);
