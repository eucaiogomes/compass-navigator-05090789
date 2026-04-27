import { ChevronDown, Calendar, Plus, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  breadcrumb: { label: string; accent?: boolean }[];
  filterLabel?: string;
  filterOptions?: string[];
  onFilterChange?: (value: string) => void;
  periodLabel?: string;
  onAdd?: () => void;
  addOptions?: { id: string; label: string; sublabel?: string; disabled?: boolean }[];
  onAddSelect?: (id: string) => void;
}

export const PageBar = ({
  breadcrumb,
  filterLabel = "Todos",
  filterOptions,
  onFilterChange,
  periodLabel = "Abril - 2026",
  onAdd,
  addOptions,
  onAddSelect,
}: Props) => {
  return (
    <div className="space-y-3">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        {breadcrumb.map((b, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className={b.accent ? "text-accent font-semibold" : "text-muted-foreground"}>{b.label}</span>
            {i < breadcrumb.length - 1 && <span className="text-muted-foreground/50">/</span>}
          </span>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-3 flex-wrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center justify-between gap-2 min-w-[180px] h-10 px-4 rounded-full border border-border bg-white text-sm text-foreground hover:border-primary/30 transition-colors">
              <span className="truncate">{filterLabel}</span>
              <ChevronDown className="h-4 w-4 text-accent shrink-0" strokeWidth={2.5} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[220px] bg-white">
            {(filterOptions ?? ["Todos"]).map((opt) => (
              <DropdownMenuItem
                key={opt}
                onClick={() => onFilterChange?.(opt)}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>{opt}</span>
                {opt === filterLabel && <Check className="h-4 w-4 text-accent" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <button className="flex items-center justify-between gap-2 min-w-[170px] h-10 px-4 rounded-full border border-border bg-white text-sm text-muted-foreground hover:border-primary/30 transition-colors">
          <span>{periodLabel}</span>
          <Calendar className="h-4 w-4 text-muted-foreground" strokeWidth={2} />
        </button>

        {addOptions && onAddSelect ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                title="Adicionar avaliação"
                className="h-10 w-10 rounded-full border-2 border-accent text-accent flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Plus className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[300px] bg-white">
              {addOptions.length === 0 && (
                <div className="px-3 py-4 text-xs text-muted-foreground text-center">
                  Todas as avaliações já estão na tela.
                </div>
              )}
              {addOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.id}
                  disabled={opt.disabled}
                  onClick={() => !opt.disabled && onAddSelect(opt.id)}
                  className="flex flex-col items-start gap-0.5 cursor-pointer py-2"
                >
                  <span className="text-sm font-medium text-foreground">{opt.label}</span>
                  {opt.sublabel && (
                    <span className="text-[11px] text-muted-foreground">{opt.sublabel}</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button
            onClick={onAdd}
            title="Nova avaliação"
            className="h-10 w-10 rounded-full border-2 border-accent text-accent flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Plus className="h-5 w-5" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
};
