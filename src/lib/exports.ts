import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import {
  RESPONDENTS, applyFilters, Filters, overallRisk, participationRate, engagementIndex,
  riskDistribution, dimensionRanking, heatmapByDepartment, generateInsights, generateRecommendations,
  classifyRisk, riskLabel, DEPARTMENTS, DIMENSIONS, avgScore,
} from "@/data/copsoq";

const navy: [number, number, number] = [16, 41, 70];
const orange: [number, number, number] = [243, 146, 0];
const muted: [number, number, number] = [120, 130, 145];

export async function exportPDF(rootElement: HTMLElement, filters: Filters) {
  const filtered = applyFilters(RESPONDENTS, filters);
  const overall = overallRisk(filtered);
  const part = participationRate(filtered);
  const eng = engagementIndex(filtered);
  const stress = avgScore(filtered, "Estresse");
  const insights = generateInsights(filtered);
  const recs = generateRecommendations(filtered);

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  const today = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  // ---------- COVER ----------
  pdf.setFillColor(...navy); pdf.rect(0, 0, W, H, "F");
  pdf.setFillColor(...orange); pdf.rect(0, H - 18, W, 18, "F");

  pdf.setTextColor(255); pdf.setFont("helvetica", "bold"); pdf.setFontSize(11);
  pdf.text("PSICOSSOCIAL ANALYTICS", 20, 30);
  pdf.setDrawColor(...orange); pdf.setLineWidth(1.2); pdf.line(20, 34, 80, 34);

  pdf.setFontSize(28); pdf.text("Dashboard COPSOQ II", 20, 110);
  pdf.setFontSize(20); pdf.setFont("helvetica", "normal"); pdf.text("Relatório Executivo de", 20, 124);
  pdf.text("Riscos Psicossociais", 20, 134);

  pdf.setFontSize(11); pdf.setTextColor(220, 225, 235);
  pdf.text(`Período: ${filters.period}`, 20, 165);
  pdf.text(`Departamento: ${filters.department}`, 20, 172);
  pdf.text(`Cargo: ${filters.role}    |    Vínculo: ${filters.contract}    |    Unidade: ${filters.unit}`, 20, 179);

  pdf.setFontSize(9); pdf.setTextColor(255);
  pdf.text(`Emitido em ${today}`, 20, H - 25);

  // ---------- PAGE 2: EXECUTIVE SUMMARY + KPIs ----------
  pdf.addPage();
  drawHeader(pdf, "Resumo Executivo", filters);
  let y = 40;

  pdf.setFont("helvetica", "normal"); pdf.setFontSize(10); pdf.setTextColor(40);
  const summary = [
    `A análise COPSOQ II abrange ${filtered.length} colaboradores, com taxa de participação de ${part.toFixed(1)}% no período avaliado (${filters.period.toLowerCase()}).`,
    `O risco psicossocial geral é classificado como ${riskLabel(classifyRisk(overall)).toLowerCase()} (${overall.toFixed(2)}/4), com nível médio de estresse em ${stress.toFixed(2)} e índice de engajamento de ${eng.toFixed(0)}%.`,
    `Foram identificados ${insights.filter(i => i.severity === "high").length} alertas de prioridade alta e ${recs.length} recomendações práticas para mitigação dos fatores críticos.`,
  ];
  summary.forEach((line) => {
    const wrapped = pdf.splitTextToSize(line, W - 40);
    pdf.text(wrapped, 20, y);
    y += wrapped.length * 5 + 3;
  });

  // KPIs grid
  y += 4;
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(13); pdf.setTextColor(...navy);
  pdf.text("Indicadores Principais", 20, y); y += 6;

  const kpis = [
    { label: "Risco Psicossocial Geral", value: overall.toFixed(2), unit: "/ 4", badge: riskLabel(classifyRisk(overall)) },
    { label: "Taxa de Participação", value: part.toFixed(1), unit: "%", badge: part >= 70 ? "Boa" : "Atenção" },
    { label: "Nível Médio de Estresse", value: stress.toFixed(2), unit: "/ 4", badge: riskLabel(classifyRisk(stress)) },
    { label: "Índice de Engajamento", value: eng.toFixed(0), unit: "%", badge: eng >= 60 ? "Saudável" : "Atenção" },
  ];
  const cardW = (W - 40 - 9) / 4;
  kpis.forEach((k, i) => {
    const x = 20 + i * (cardW + 3);
    pdf.setFillColor(248, 250, 252); pdf.setDrawColor(225, 230, 238);
    pdf.roundedRect(x, y, cardW, 32, 2, 2, "FD");
    pdf.setFontSize(7); pdf.setFont("helvetica", "bold"); pdf.setTextColor(...muted);
    pdf.text(k.label.toUpperCase(), x + 3, y + 6);
    pdf.setFontSize(18); pdf.setTextColor(...navy);
    pdf.text(k.value, x + 3, y + 18);
    pdf.setFontSize(9); pdf.setFont("helvetica", "normal");
    pdf.text(k.unit, x + 3 + pdf.getTextWidth(k.value) + 1.5, y + 18);
    pdf.setFontSize(7); pdf.setFont("helvetica", "bold"); pdf.setTextColor(...orange);
    pdf.text(k.badge, x + 3, y + 27);
  });
  y += 40;

  // Snapshot main charts area from DOM
  const chartsEl = rootElement.querySelector("[data-export='charts']") as HTMLElement | null;
  if (chartsEl) {
    const img = await snapshot(chartsEl);
    const imgW = W - 40;
    const imgH = (img.height * imgW) / img.width;
    if (y + imgH > H - 20) { pdf.addPage(); drawHeader(pdf, "Análise Gráfica", filters); y = 40; }
    pdf.addImage(img.dataUrl, "PNG", 20, y, imgW, imgH);
    y += imgH + 6;
  }

  // ---------- HEATMAP PAGE ----------
  pdf.addPage();
  drawHeader(pdf, "Mapa de Calor por Área", filters);
  y = 40;
  const heatEl = rootElement.querySelector("[data-export='heatmap']") as HTMLElement | null;
  if (heatEl) {
    const img = await snapshot(heatEl);
    const imgW = W - 40;
    const imgH = (img.height * imgW) / img.width;
    pdf.addImage(img.dataUrl, "PNG", 20, y, imgW, Math.min(imgH, H - 50));
  }

  // ---------- INSIGHTS + RECOMMENDATIONS ----------
  pdf.addPage();
  drawHeader(pdf, "Insights e Recomendações", filters);
  y = 42;

  pdf.setFont("helvetica", "bold"); pdf.setFontSize(12); pdf.setTextColor(...navy);
  pdf.text("Insights Automáticos", 20, y); y += 6;

  insights.forEach((i) => {
    const color: [number, number, number] = i.severity === "high" ? [220, 53, 69] : i.severity === "moderate" ? [243, 146, 0] : [40, 167, 69];
    pdf.setFillColor(...color); pdf.rect(20, y - 3, 1.5, 12, "F");
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(10); pdf.setTextColor(40);
    const title = pdf.splitTextToSize(i.title, W - 50);
    pdf.text(title, 25, y + 1);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(8.5); pdf.setTextColor(...muted);
    const det = pdf.splitTextToSize(i.detail, W - 50);
    pdf.text(det, 25, y + 1 + title.length * 4);
    y += title.length * 4 + det.length * 3.5 + 5;
    if (y > H - 30) { pdf.addPage(); drawHeader(pdf, "Insights e Recomendações (cont.)", filters); y = 42; }
  });

  y += 4;
  if (y > H - 60) { pdf.addPage(); drawHeader(pdf, "Insights e Recomendações (cont.)", filters); y = 42; }
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(12); pdf.setTextColor(...navy);
  pdf.text("Recomendações Práticas", 20, y); y += 6;

  recs.forEach((r) => {
    pdf.setDrawColor(225, 230, 238); pdf.setFillColor(252, 253, 255);
    const boxStart = y;
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(9.5); pdf.setTextColor(...navy);
    pdf.text(`${r.factor}  →  ${r.target}`, 23, y + 5);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(9); pdf.setTextColor(50);
    const action = pdf.splitTextToSize(r.action, W - 50);
    pdf.text(action, 23, y + 11);
    const boxH = 11 + action.length * 4 + 3;
    pdf.roundedRect(20, boxStart, W - 40, boxH, 1.5, 1.5, "S");
    y += boxH + 3;
    if (y > H - 20) { pdf.addPage(); drawHeader(pdf, "Recomendações (cont.)", filters); y = 42; }
  });

  // Footer page numbers
  const pages = pdf.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    pdf.setPage(i);
    if (i === 1) continue;
    pdf.setFontSize(8); pdf.setTextColor(...muted);
    pdf.text(`Página ${i} de ${pages}`, W - 20, H - 8, { align: "right" });
    pdf.text("Psicossocial Analytics — Relatório COPSOQ II", 20, H - 8);
  }

  pdf.save(`COPSOQ_II_Relatorio_${Date.now()}.pdf`);
}

function drawHeader(pdf: jsPDF, title: string, filters: Filters) {
  const W = pdf.internal.pageSize.getWidth();
  pdf.setFillColor(...navy); pdf.rect(0, 0, W, 22, "F");
  pdf.setFillColor(...orange); pdf.rect(0, 22, W, 1.2, "F");
  pdf.setTextColor(255); pdf.setFont("helvetica", "bold"); pdf.setFontSize(13);
  pdf.text(title, 20, 14);
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(8); pdf.setTextColor(220, 225, 235);
  pdf.text(`${filters.period}  •  ${filters.department}  •  ${filters.unit}`, W - 20, 14, { align: "right" });
}

async function snapshot(el: HTMLElement): Promise<{ dataUrl: string; width: number; height: number }> {
  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: "#ffffff",
    logging: false,
    useCORS: true,
  });
  return { dataUrl: canvas.toDataURL("image/png"), width: canvas.width, height: canvas.height };
}

// ---------- EXCEL ----------
export function exportExcel(filters: Filters) {
  const filtered = applyFilters(RESPONDENTS, filters);
  const wb = XLSX.utils.book_new();

  // Aba 1 — Resumo Geral
  const resumo = [
    ["Relatório COPSOQ II — Resumo Executivo"],
    [`Emitido em ${new Date().toLocaleString("pt-BR")}`],
    [],
    ["Filtros Aplicados"],
    ["Período", filters.period],
    ["Departamento", filters.department],
    ["Cargo", filters.role],
    ["Vínculo", filters.contract],
    ["Unidade", filters.unit],
    [],
    ["Indicador", "Valor", "Classificação"],
    ["Risco Psicossocial Geral", overallRisk(filtered).toFixed(2), riskLabel(classifyRisk(overallRisk(filtered)))],
    ["Taxa de Participação (%)", participationRate(filtered).toFixed(1), participationRate(filtered) >= 70 ? "Boa" : "Atenção"],
    ["Nível Médio de Estresse", avgScore(filtered, "Estresse").toFixed(2), riskLabel(classifyRisk(avgScore(filtered, "Estresse")))],
    ["Índice de Engajamento (%)", engagementIndex(filtered).toFixed(0), engagementIndex(filtered) >= 60 ? "Saudável" : "Atenção"],
    ["Total de Respondentes", filtered.length, ""],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(resumo), "Resumo Geral");

  // Aba 2 — Indicadores por Área
  const heat = heatmapByDepartment(filtered);
  const dimsTop = heat[0]?.cells.map((c) => c.dim) ?? [];
  const areaHeader = ["Departamento", ...dimsTop, "Média", "Classificação"];
  const areaRows = heat.map((r) => [
    r.department,
    ...r.cells.map((c) => Number(c.score.toFixed(2))),
    Number(r.avg.toFixed(2)),
    riskLabel(classifyRisk(r.avg)),
  ]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([areaHeader, ...areaRows]), "Indicadores por Área");

  // Aba 3 — Resultados por Dimensão
  const dimRanking = dimensionRanking(filtered);
  const dimHeader = ["Dimensão", "Score Médio (0-4)", "Classificação"];
  const dimRows = dimRanking.map((d) => [d.dimension, Number(d.score.toFixed(2)), riskLabel(classifyRisk(d.score))]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([dimHeader, ...dimRows]), "Resultados por Dimensão");

  // Aba 4 — Insights e Recomendações
  const insights = generateInsights(filtered);
  const recs = generateRecommendations(filtered);
  const ir: (string | number)[][] = [["Insights Automáticos"], ["Severidade", "Título", "Detalhe"]];
  insights.forEach((i) => ir.push([riskLabel(i.severity), i.title, i.detail]));
  ir.push([], ["Recomendações Práticas"], ["Fator", "Ação", "Área Alvo", "Impacto"]);
  recs.forEach((r) => ir.push([r.factor, r.action, r.target, r.impact]));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(ir), "Insights e Ações");

  // Aba 5 — Dados Brutos
  const brutoHeader = ["ID", "Departamento", "Cargo", "Vínculo", "Unidade", "Participou", "Mês", ...DIMENSIONS];
  const brutoRows = filtered.map((r) => [
    r.id, r.department, r.role, r.contract, r.unit, r.participated ? "Sim" : "Não", r.month,
    ...DIMENSIONS.map((d) => Number(r.scores[d].toFixed(2))),
  ]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([brutoHeader, ...brutoRows]), "Dados Brutos");

  XLSX.writeFile(wb, `COPSOQ_II_Dados_${Date.now()}.xlsx`);
}
