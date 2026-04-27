import { Filters, DEPARTMENTS, ROLES, CONTRACTS, UNITS, PERIODS } from "@/data/copsoq";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

const FilterField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5 min-w-0 flex-1">
    <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
    {children}
  </div>
);

export const FilterBar = ({ filters, onChange }: Props) => {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => onChange({ ...filters, [key]: value });

  return (
    <div className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border shadow-card">
      <div className="max-w-[1500px] mx-auto px-6 py-3 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-primary font-semibold text-sm shrink-0">
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
        </div>

        <div className="flex flex-1 gap-3 flex-wrap">
          <FilterField label="Período">
            <Select value={filters.period} onValueChange={(v) => set("period", v as Filters["period"])}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PERIODS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Departamento">
            <Select value={filters.department} onValueChange={(v) => set("department", v as Filters["department"])}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Cargo">
            <Select value={filters.role} onValueChange={(v) => set("role", v as Filters["role"])}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Vínculo">
            <Select value={filters.contract} onValueChange={(v) => set("contract", v as Filters["contract"])}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                {CONTRACTS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </FilterField>

          <FilterField label="Unidade">
            <Select value={filters.unit} onValueChange={(v) => set("unit", v as Filters["unit"])}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todas</SelectItem>
                {UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
              </SelectContent>
            </Select>
          </FilterField>
        </div>
      </div>
    </div>
  );
};
