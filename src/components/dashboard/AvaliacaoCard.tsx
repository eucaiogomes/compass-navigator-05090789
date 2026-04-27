import { useState } from "react";
import { Avaliacao, avaliacaoMedia } from "@/data/avaliacoes";
import { classificacaoTexto } from "@/data/relatorioConteudo";
import { FileDown, FileSpreadsheet, Calendar, Users, Building2, GripVertical, BarChart3 } from "lucide-react";
import {
  RankingChart,
  CHART_TYPE_OPTIONS,
  type ChartType,
} from "@/components/dashboard/RankingChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  avaliacao: Avaliacao;
  onExportPDF: (av: Avaliacao) => void;
  onExportXLS: (av: Avaliacao) => void;
  exporting?: { id: string; type: "pdf" | "xlsx" } | null;
}

const colorFor = (score: number) => {
  if (score < 1.67) return "hsl(var(--risk-low))";
  if (score < 2.67) return "hsl(var(--accent))"; // moderado = laranja como na referência
  return "hsl(var(--risk-high))";
};

export const AvaliacaoCard = ({ avaliacao, onExportPDF, onExportXLS, exporting }: Props) => {
  const top = avaliacao.ranking.slice(0, 10);
  const media = avaliacaoMedia(avaliacao);
  const cls = classificacaoTexto(media);
  const adesao = (avaliacao.totalRespondentes / avaliacao.totalConvidados) * 100;
  const [chartType, setChartType] = useState<ChartType>("pie");

  const isExportingPdf = exporting?.id === avaliacao.id && exporting?.type === "pdf";
  const isExportingXls = exporting?.id === avaliacao.id && exporting?.type === "xlsx";

  return (
    <div className="bg-white border border-border rounded-2xl shadow-card overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-border/60">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex-1 flex items-start gap-2">
            <button
              type="button"
              title="Arrastar para reorganizar"
              className="drag-handle mt-0.5 -ml-1 p-1 rounded text-muted-foreground hover:text-primary hover:bg-muted cursor-grab active:cursor-grabbing"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                {avaliacao.codigo}
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white"
                style={{ background: colorFor(media) }}
              >
                {cls.label}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Média {media.toFixed(2)} / 4
              </span>
            </div>
            <h3 className="text-base font-bold text-primary leading-snug">{avaliacao.nome}</h3>
            <p className="text-xs text-accent mt-0.5">{avaliacao.descricao}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onExportXLS(avaliacao)}
              disabled={!!exporting}
              className="flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-white text-xs font-medium text-foreground hover:border-primary/40 hover:bg-muted/60 transition-colors disabled:opacity-50"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-[#107C41]" />
              {isExportingXls ? "Gerando..." : "XLS"}
            </button>
            <button
              onClick={() => onExportPDF(avaliacao)}
              disabled={!!exporting}
              className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-accent text-accent-foreground text-xs font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              <FileDown className="h-3.5 w-3.5" />
              {isExportingPdf ? "Gerando..." : "PDF"}
            </button>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-5 mt-3 text-[11px] text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            {avaliacao.periodo}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3 w-3" />
            {avaliacao.totalRespondentes} de {avaliacao.totalConvidados} ({adesao.toFixed(0)}% adesão)
          </span>
          <span className="flex items-center gap-1.5">
            <Building2 className="h-3 w-3" />
            {avaliacao.departamentoFoco}
          </span>
        </div>
      </div>

      {/* Body: ranking */}
      <div className="px-6 py-5 flex-1 overflow-auto">
        <div className="mb-3 flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h4 className="text-sm font-bold text-primary">Fatores Psicossociais — Ranking</h4>
            <p className="text-[11px] text-accent">Dimensões COPSOQ II ordenadas do maior risco para o menor</p>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
            <Select value={chartType} onValueChange={(v) => setChartType(v as ChartType)}>
              <SelectTrigger className="h-8 w-[180px] text-xs">
                <SelectValue placeholder="Tipo de gráfico" />
              </SelectTrigger>
              <SelectContent>
                {CHART_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <RankingChart data={top} type={chartType} />

        <div className="flex items-center justify-between text-[10px] text-accent pt-3 mt-3 border-t border-border/60">
          <span>Escala COPSOQ II: 0 (mínimo) — 4 (máximo)</span>
          <span>Top 10 dimensões por risco</span>
        </div>
      </div>
    </div>
  );
};
