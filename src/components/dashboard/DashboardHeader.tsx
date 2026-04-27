import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileDown, FileSpreadsheet } from "lucide-react";

interface Props {
  onExportPDF: () => void;
  onExportExcel: () => void;
  exporting?: "pdf" | "xlsx" | null;
}

export const DashboardHeader = ({ onExportPDF, onExportExcel, exporting }: Props) => {
  const today = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <header className="bg-gradient-header text-primary-foreground border-b border-primary/40">
      <div className="max-w-[1500px] mx-auto px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-lg bg-accent/95 flex items-center justify-center shadow-elevated">
            <Activity className="h-6 w-6 text-accent-foreground" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">Psicossocial Analytics</h1>
            <p className="text-xs text-primary-foreground/70">Dashboard COPSOQ II — Análise Executiva</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-xs text-primary-foreground/60 uppercase tracking-wider">Relatório de</p>
            <p className="text-sm font-medium">{today}</p>
          </div>
          <Button
            onClick={onExportExcel}
            variant="secondary"
            size="sm"
            disabled={!!exporting}
            className="bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 border border-primary-foreground/20"
          >
            <FileSpreadsheet className="h-4 w-4" />
            {exporting === "xlsx" ? "Gerando..." : "Excel"}
          </Button>
          <Button
            onClick={onExportPDF}
            size="sm"
            disabled={!!exporting}
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
          >
            <FileDown className="h-4 w-4" />
            {exporting === "pdf" ? "Gerando..." : "Exportar PDF"}
          </Button>
        </div>
      </div>
    </header>
  );
};
