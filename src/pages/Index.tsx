import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { PageBar } from "@/components/layout/PageBar";
import { AvaliacaoCard } from "@/components/dashboard/AvaliacaoCard";
import { AVALIACOES, Avaliacao } from "@/data/avaliacoes";
import { exportAvaliacaoPDF, exportAvaliacaoXLS } from "@/lib/avaliacaoExports";
import { toast } from "sonner";

const Index = () => {
  const [exporting, setExporting] = useState<{ id: string; type: "pdf" | "xlsx" } | null>(null);
  const [setorFiltro, setSetorFiltro] = useState<string>("Todos");

  const setores = Array.from(new Set(AVALIACOES.map((a) => a.departamentoFoco)));
  const filterOptions = ["Todos", ...setores];

  const avaliacoesFiltradas =
    setorFiltro === "Todos"
      ? AVALIACOES
      : AVALIACOES.filter((a) => a.departamentoFoco === setorFiltro);

  const handlePDF = async (av: Avaliacao) => {
    setExporting({ id: av.id, type: "pdf" });
    try {
      await new Promise((r) => setTimeout(r, 50));
      exportAvaliacaoPDF(av);
      toast.success(`Relatório PDF de "${av.codigo}" gerado`);
    } catch (e) {
      console.error(e);
      toast.error("Falha ao gerar PDF");
    } finally {
      setExporting(null);
    }
  };

  const handleXLS = async (av: Avaliacao) => {
    setExporting({ id: av.id, type: "xlsx" });
    try {
      await new Promise((r) => setTimeout(r, 50));
      exportAvaliacaoXLS(av);
      toast.success(`Planilha XLS de "${av.codigo}" gerada`);
    } catch (e) {
      console.error(e);
      toast.error("Falha ao gerar XLS");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <Sidebar />
      <Topbar />

      <main className="ml-12 pt-14">
        <div className="max-w-[1400px] mx-auto px-6 py-6">
          <PageBar
            breadcrumb={[
              { label: "Minha Área" },
              { label: "NR-1", accent: true },
            ]}
            filterLabel={setorFiltro}
            filterOptions={filterOptions}
            onFilterChange={setSetorFiltro}
            periodLabel="Abril - 2026"
            onAdd={() => toast.info("Nova avaliação — em breve")}
          />

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {avaliacoesFiltradas.map((av) => (
              <div key={av.id} className="h-[640px]">
                <AvaliacaoCard
                  avaliacao={av}
                  onExportPDF={handlePDF}
                  onExportXLS={handleXLS}
                  exporting={exporting}
                />
              </div>
            ))}
          </div>

          {avaliacoesFiltradas.length === 0 && (
            <div className="mt-10 text-center text-sm text-muted-foreground">
              Nenhuma avaliação encontrada para o filtro selecionado.
            </div>
          )}

          <footer className="text-center text-[11px] text-muted-foreground py-8 mt-4">
            Psicossocial Analytics • Dashboard COPSOQ II • Dados de demonstração
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Index;
