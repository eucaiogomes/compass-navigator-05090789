import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { Avaliacao, avaliacaoMedia } from "@/data/avaliacoes";
import {
  ESCALA_COPSOQ, FAIXAS, INTERPRETACOES, RECOMENDACOES_DETALHADAS,
  FATORES_PROTETIVOS, FATORES_RISCO, REFERENCIAS, classificacaoTexto,
} from "@/data/relatorioConteudo";
import {
  INTRODUCAO_COPSOQ, OBJETIVO_RELATORIO, COMPONENTES_RELATORIO,
  IDENTIFICACAO_EMPRESA, RESPONSAVEL_TECNICO, METODOLOGIA_DETALHADA,
  DIMENSOES_AVALIADAS, ANALISE_GLOBAL_TEXTO, RECOMENDACOES_POR_DOMINIO,
  INTEGRACAO_PGR, REAPLICACAO_CRITERIOS, CONCLUSAO_TEXTO,
} from "@/data/relatorioConteudoExtra";

const NAVY: [number, number, number] = [16, 41, 70];
const ORANGE: [number, number, number] = [243, 146, 0];
const MUTED: [number, number, number] = [120, 130, 145];
const GREEN: [number, number, number] = [40, 167, 69];
const RED: [number, number, number] = [220, 53, 69];
const LIGHT: [number, number, number] = [248, 250, 252];

function colorForScore(score: number): [number, number, number] {
  if (score < 1.67) return GREEN;
  if (score < 2.67) return ORANGE;
  return RED;
}

// ============ PDF ============
export function exportAvaliacaoPDF(av: Avaliacao) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  const today = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  const media = avaliacaoMedia(av);
  const cls = classificacaoTexto(media);
  const adesao = (av.totalRespondentes / av.totalConvidados) * 100;

  // ---------- COVER ----------
  pdf.setFillColor(...NAVY); pdf.rect(0, 0, W, H, "F");
  pdf.setFillColor(...ORANGE); pdf.rect(0, H - 20, W, 20, "F");

  pdf.setTextColor(255); pdf.setFont("helvetica", "bold"); pdf.setFontSize(11);
  pdf.text("PSICOSSOCIAL ANALYTICS", 20, 30);
  pdf.setDrawColor(...ORANGE); pdf.setLineWidth(1.5); pdf.line(20, 33, 80, 33);

  pdf.setFontSize(9); pdf.setFont("helvetica", "normal"); pdf.setTextColor(220, 225, 235);
  pdf.text("Relatório Executivo", 20, 42);

  pdf.setFont("helvetica", "bold"); pdf.setFontSize(14); pdf.setTextColor(...ORANGE);
  pdf.text(av.codigo, 20, 95);
  pdf.setTextColor(255); pdf.setFontSize(26);
  const titleLines = pdf.splitTextToSize(av.nome, W - 40);
  pdf.text(titleLines, 20, 108);

  pdf.setFont("helvetica", "normal"); pdf.setFontSize(11); pdf.setTextColor(220, 225, 235);
  const desc = pdf.splitTextToSize(av.descricao, W - 40);
  pdf.text(desc, 20, 108 + titleLines.length * 9 + 8);

  // Info box
  const boxY = 175;
  pdf.setFillColor(255, 255, 255); pdf.setDrawColor(255, 255, 255);
  pdf.roundedRect(20, boxY, W - 40, 60, 3, 3, "F");
  pdf.setFontSize(8); pdf.setFont("helvetica", "bold"); pdf.setTextColor(...MUTED);
  const infoLeft = [
    ["PERÍODO", av.periodo],
    ["APLICAÇÃO", av.dataAplicacao],
    ["RESPONSÁVEL", av.responsavel],
  ];
  const infoRight = [
    ["RESPONDENTES", `${av.totalRespondentes} de ${av.totalConvidados}`],
    ["TAXA DE ADESÃO", `${adesao.toFixed(1)}%`],
    ["FOCO", av.departamentoFoco],
  ];
  infoLeft.forEach((row, i) => {
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(7); pdf.setTextColor(...MUTED);
    pdf.text(row[0], 26, boxY + 10 + i * 16);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(10); pdf.setTextColor(...NAVY);
    pdf.text(row[1], 26, boxY + 16 + i * 16);
  });
  infoRight.forEach((row, i) => {
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(7); pdf.setTextColor(...MUTED);
    pdf.text(row[0], W / 2 + 5, boxY + 10 + i * 16);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(10); pdf.setTextColor(...NAVY);
    pdf.text(row[1], W / 2 + 5, boxY + 16 + i * 16);
  });

  pdf.setTextColor(255); pdf.setFontSize(9); pdf.setFont("helvetica", "bold");
  pdf.text(`Emitido em ${today}`, 20, H - 8);
  pdf.text("Confidencial — Uso Interno", W - 20, H - 8, { align: "right" });

  // ---------- NOVAS PÁGINAS: INTRODUÇÃO E OBJETIVO ----------
  let y2 = newPage(pdf, av, "Introdução — Avaliação Psicossocial COPSOQ II");
  y2 = paragraph(pdf, INTRODUCAO_COPSOQ, y2, W);
  y2 += 4;
  if (y2 > H - 60) y2 = newPage(pdf, av, "Objetivo e Estrutura do Relatório");
  y2 = sectionTitle(pdf, "Objetivo do Relatório Técnico", y2);
  y2 = paragraph(pdf, OBJETIVO_RELATORIO, y2, W);
  y2 += 4;
  if (y2 > H - 60) y2 = newPage(pdf, av, "Componentes Essenciais do Relatório");
  y2 = sectionTitle(pdf, "Componentes Essenciais do Relatório", y2);
  COMPONENTES_RELATORIO.forEach((c) => {
    if (y2 > H - 30) y2 = newPage(pdf, av, "Componentes Essenciais (cont.)");
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(10); pdf.setTextColor(...NAVY);
    pdf.text(c.titulo, 20, y2);
    y2 += 5;
    y2 = paragraph(pdf, c.texto, y2, W);
    y2 += 3;
  });

  // ---------- IDENTIFICAÇÃO DA EMPRESA E RESPONSÁVEL TÉCNICO ----------
  y2 = newPage(pdf, av, "Identificação da Empresa e Responsável Técnico");
  y2 = sectionTitle(pdf, "Dados da Empresa Avaliada", y2);
  const empresaRows: [string, string][] = [
    ["Razão Social", IDENTIFICACAO_EMPRESA.razaoSocial],
    ["CNPJ", IDENTIFICACAO_EMPRESA.cnpj],
    ["Endereço", IDENTIFICACAO_EMPRESA.endereco],
    ["Data da Avaliação", IDENTIFICACAO_EMPRESA.dataAvaliacao],
    ["Setores Avaliados", IDENTIFICACAO_EMPRESA.setoresAvaliados],
  ];
  empresaRows.forEach(([k, v]) => {
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(8.5); pdf.setTextColor(...MUTED);
    pdf.text(k.toUpperCase(), 20, y2);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(10); pdf.setTextColor(...NAVY);
    pdf.text(v, 65, y2);
    y2 += 6;
  });
  y2 += 2;
  y2 = paragraph(pdf, IDENTIFICACAO_EMPRESA.contexto, y2, W);
  y2 += 4;

  if (y2 > H - 70) y2 = newPage(pdf, av, "Responsável Técnico pela Avaliação");
  y2 = sectionTitle(pdf, "Responsável Técnico pela Avaliação", y2);
  const respRows: [string, string][] = [
    ["Nome", RESPONSAVEL_TECNICO.nome],
    ["Registro Profissional", RESPONSAVEL_TECNICO.registroProfissional],
    ["Especialidade", RESPONSAVEL_TECNICO.especialidade],
    ["Contato", RESPONSAVEL_TECNICO.contato],
  ];
  respRows.forEach(([k, v]) => {
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(8.5); pdf.setTextColor(...MUTED);
    pdf.text(k.toUpperCase(), 20, y2);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(10); pdf.setTextColor(...NAVY);
    pdf.text(v, 65, y2);
    y2 += 6;
  });
  y2 += 2;
  y2 = paragraph(pdf, RESPONSAVEL_TECNICO.texto, y2, W);

  // ---------- METODOLOGIA DETALHADA E DIMENSÕES ----------
  y2 = newPage(pdf, av, "Metodologia Detalhada e Dimensões Avaliadas");
  y2 = paragraph(pdf, METODOLOGIA_DETALHADA, y2, W);
  y2 += 4;
  y2 = sectionTitle(pdf, "Dimensões Contempladas no Instrumento", y2);
  DIMENSOES_AVALIADAS.forEach((d) => {
    if (y2 > H - 15) y2 = newPage(pdf, av, "Dimensões Contempladas (cont.)");
    pdf.setFillColor(...ORANGE); pdf.circle(22, y2 - 1.2, 0.8, "F");
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(9.5); pdf.setTextColor(40);
    const lines = pdf.splitTextToSize(d, W - 50);
    pdf.text(lines, 26, y2);
    y2 += lines.length * 4.5 + 1;
  });
  y2 += 4;

  // Perfil dos participantes (a partir dos dados da avaliação)
  if (y2 > H - 60) y2 = newPage(pdf, av, "Perfil dos Participantes");
  y2 = sectionTitle(pdf, "Perfil dos Participantes", y2);
  const adesaoP = (av.totalRespondentes / av.totalConvidados) * 100;
  const perfilRows: [string, string][] = [
    ["Total de Respondentes", `${av.totalRespondentes} de ${av.totalConvidados} (${adesaoP.toFixed(1)}%)`],
    ["Período de Aplicação", av.dataAplicacao],
    ["Foco", av.departamentoFoco],
    ["Responsável", av.responsavel],
  ];
  perfilRows.forEach(([k, v]) => {
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(8.5); pdf.setTextColor(...MUTED);
    pdf.text(k.toUpperCase(), 20, y2);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(10); pdf.setTextColor(...NAVY);
    const vLines = pdf.splitTextToSize(v, W - 90);
    pdf.text(vLines, 70, y2);
    y2 += Math.max(6, vLines.length * 5 + 1);
  });

  // ---------- PAGE 2: RESUMO EXECUTIVO ----------
  pdf.addPage();
  let y = drawPageHeader(pdf, av, "Resumo Executivo");

  // KPI cards
  const kpis = [
    { label: "Risco Geral", value: media.toFixed(2), unit: "/ 4", color: colorForScore(media), badge: cls.label },
    { label: "Adesão", value: adesao.toFixed(0), unit: "%", color: adesao >= 70 ? GREEN : ORANGE, badge: adesao >= 70 ? "BOA" : "BAIXA" },
    { label: "Respondentes", value: String(av.totalRespondentes), unit: "", color: NAVY, badge: "TOTAL" },
    { label: "Dimensões Críticas", value: String(av.ranking.filter(r => r.score >= 2.67).length), unit: "", color: RED, badge: "ALTO RISCO" },
  ];
  const cardW = (W - 40 - 9) / 4;
  kpis.forEach((k, i) => {
    const x = 20 + i * (cardW + 3);
    pdf.setFillColor(...LIGHT); pdf.setDrawColor(225, 230, 238);
    pdf.roundedRect(x, y, cardW, 28, 2, 2, "FD");
    pdf.setFillColor(...k.color); pdf.rect(x, y, 2, 28, "F");
    pdf.setFontSize(7); pdf.setFont("helvetica", "bold"); pdf.setTextColor(...MUTED);
    pdf.text(k.label.toUpperCase(), x + 5, y + 6);
    pdf.setFontSize(16); pdf.setTextColor(...NAVY);
    pdf.text(k.value, x + 5, y + 17);
    pdf.setFontSize(8); pdf.setFont("helvetica", "normal");
    pdf.text(k.unit, x + 5 + pdf.getTextWidth(k.value) + 1.5, y + 17);
    pdf.setFontSize(7); pdf.setFont("helvetica", "bold"); pdf.setTextColor(...k.color);
    pdf.text(k.badge, x + 5, y + 24);
  });
  y += 36;

  // Resumo executivo text
  y = sectionTitle(pdf, "Análise Executiva", y);
  y = paragraph(pdf, av.resumoExecutivo, y, W);
  y += 4;

  y = sectionTitle(pdf, "Contexto Organizacional", y);
  y = paragraph(pdf, av.contextoOrganizacional, y, W);
  y += 4;

  // Classificação geral
  if (y > H - 60) y = newPage(pdf, av);
  y = sectionTitle(pdf, "Classificação Geral", y);
  pdf.setFillColor(...colorForScore(media));
  pdf.roundedRect(20, y, W - 40, 18, 2, 2, "F");
  pdf.setTextColor(255); pdf.setFont("helvetica", "bold"); pdf.setFontSize(13);
  pdf.text(`${cls.label} — ${media.toFixed(2)} / 4`, 26, y + 8);
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(9);
  pdf.text(cls.descricao, 26, y + 14);
  y += 26;

  // ---------- PAGE 3: RANKING ----------
  y = newPage(pdf, av, "Fatores Psicossociais — Ranking");
  y = paragraph(pdf, "Dimensões COPSOQ II ordenadas do maior para o menor risco identificado nesta avaliação. Barras coloridas indicam o nível de criticidade segundo os limiares COPSOQ.", y, W);
  y += 4;

  av.ranking.forEach((d) => {
    if (y > H - 25) y = newPage(pdf, av, "Fatores Psicossociais — Ranking (cont.)");
    const color = colorForScore(d.score);
    const cl = classificacaoTexto(d.score);
    pdf.setFontSize(9); pdf.setFont("helvetica", "bold"); pdf.setTextColor(...NAVY);
    pdf.text(d.dimension, 20, y);
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(8); pdf.setTextColor(...color);
    pdf.text(cl.label, W - 20, y, { align: "right" });
    y += 2.5;
    // Bar
    pdf.setFillColor(235, 238, 242); pdf.roundedRect(20, y, W - 40, 6, 1.5, 1.5, "F");
    const barW = ((W - 40) * d.score) / 4;
    pdf.setFillColor(...color); pdf.roundedRect(20, y, Math.max(barW, 4), 6, 1.5, 1.5, "F");
    pdf.setTextColor(255); pdf.setFont("helvetica", "bold"); pdf.setFontSize(7);
    pdf.text(d.score.toFixed(2), 20 + Math.max(barW, 12) - 2, y + 4, { align: "right" });
    y += 11;
  });

  // ---------- PAGE 4: INTERPRETAÇÃO POR DIMENSÃO ----------
  y = newPage(pdf, av, "Interpretação Técnica por Dimensão");
  y = paragraph(pdf, "Cada dimensão do COPSOQ II avalia um aspecto específico do ambiente psicossocial. Abaixo, a interpretação técnica e o significado prático de cada fator avaliado nesta pesquisa.", y, W);
  y += 4;

  av.ranking.forEach((d) => {
    const interp = INTERPRETACOES[d.dimension as string];
    if (!interp) return;
    if (y > H - 35) y = newPage(pdf, av, "Interpretação Técnica (cont.)");
    const color = colorForScore(d.score);
    pdf.setFillColor(...color); pdf.rect(20, y - 2, 1.5, 10, "F");
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(10); pdf.setTextColor(...NAVY);
    pdf.text(`${d.dimension}  •  ${d.score.toFixed(2)}/4`, 25, y + 3);
    y += 7;
    y = paragraph(pdf, interp, y, W, 25, 8.5);
    y += 4;
  });

  // ---------- PAGE 5: RECOMENDAÇÕES ----------
  y = newPage(pdf, av, "Plano de Ação Recomendado");
  y = paragraph(pdf, "Recomendações práticas e priorizadas para mitigar os fatores críticos identificados nesta avaliação. Prazos sugeridos consideram a complexidade típica de implementação.", y, W);
  y += 4;

  const dimensoesAcao = av.ranking.filter((r) => r.score >= 2.0).slice(0, 6);
  dimensoesAcao.forEach((d) => {
    const rec = RECOMENDACOES_DETALHADAS[d.dimension as string];
    if (!rec) return;
    if (y > H - 60) y = newPage(pdf, av, "Plano de Ação Recomendado (cont.)");

    const color = colorForScore(d.score);
    const startY = y;
    pdf.setDrawColor(...color); pdf.setLineWidth(0.4);
    // Title
    pdf.setFillColor(...color); pdf.roundedRect(20, y, W - 40, 9, 1.5, 1.5, "F");
    pdf.setTextColor(255); pdf.setFont("helvetica", "bold"); pdf.setFontSize(10);
    pdf.text(`${d.dimension} → ${rec.titulo}`, 23, y + 6);
    pdf.setFontSize(8); pdf.text(`${d.score.toFixed(2)}/4`, W - 23, y + 6, { align: "right" });
    y += 12;

    // Actions list
    pdf.setTextColor(40); pdf.setFont("helvetica", "normal"); pdf.setFontSize(9);
    rec.acoes.forEach((a) => {
      const lines = pdf.splitTextToSize(`•  ${a}`, W - 50);
      if (y + lines.length * 4 > H - 25) y = newPage(pdf, av, "Plano de Ação Recomendado (cont.)");
      pdf.text(lines, 25, y);
      y += lines.length * 4 + 1;
    });
    y += 2;
    pdf.setFontSize(8); pdf.setTextColor(...MUTED);
    pdf.text(`PRAZO SUGERIDO: ${rec.prazo}`, 25, y);
    pdf.text(`IMPACTO ESPERADO: ${rec.impacto}`, 25, y + 4);
    y += 12;

    // Border around block
    pdf.setDrawColor(225, 230, 238); pdf.setLineWidth(0.2);
    pdf.roundedRect(20, startY, W - 40, y - startY - 4, 1.5, 1.5, "S");
    y += 2;
  });

  // ---------- PAGE 6: METODOLOGIA + GLOSSÁRIO ----------
  y = newPage(pdf, av, "Metodologia e Referências");

  y = sectionTitle(pdf, "Instrumento Utilizado", y);
  y = paragraph(pdf, av.metodologia, y, W);
  y += 4;

  y = sectionTitle(pdf, "Escala COPSOQ II", y);
  y = paragraph(pdf, ESCALA_COPSOQ, y, W);
  y += 2;

  // Faixas table
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(8); pdf.setTextColor(...NAVY);
  pdf.setFillColor(...LIGHT); pdf.rect(20, y, W - 40, 7, "F");
  pdf.text("FAIXA", 23, y + 5);
  pdf.text("CLASSIFICAÇÃO", 60, y + 5);
  pdf.text("DESCRIÇÃO", 100, y + 5);
  y += 7;
  FAIXAS.forEach((f) => {
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(8); pdf.setTextColor(40);
    pdf.text(f.faixa, 23, y + 5);
    const c = f.classificacao === "BAIXO" ? GREEN : f.classificacao === "MODERADO" ? ORANGE : RED;
    pdf.setFont("helvetica", "bold"); pdf.setTextColor(...c);
    pdf.text(f.classificacao, 60, y + 5);
    pdf.setFont("helvetica", "normal"); pdf.setTextColor(40);
    const desc = pdf.splitTextToSize(f.descricao, W - 120);
    pdf.text(desc, 100, y + 5);
    y += Math.max(7, desc.length * 4 + 2);
    pdf.setDrawColor(225, 230, 238); pdf.line(20, y, W - 20, y);
  });
  y += 6;

  if (y > H - 60) y = newPage(pdf, av, "Metodologia e Referências (cont.)");
  y = sectionTitle(pdf, "Fatores Protetivos", y);
  FATORES_PROTETIVOS.forEach((f) => {
    if (y > H - 15) y = newPage(pdf, av, "Metodologia e Referências (cont.)");
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(9); pdf.setTextColor(40);
    pdf.text(`✓  ${f}`, 23, y); y += 5;
  });
  y += 4;

  if (y > H - 60) y = newPage(pdf, av, "Metodologia e Referências (cont.)");
  y = sectionTitle(pdf, "Fatores de Risco Comuns", y);
  FATORES_RISCO.forEach((f) => {
    if (y > H - 15) y = newPage(pdf, av, "Metodologia e Referências (cont.)");
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(9); pdf.setTextColor(40);
    pdf.text(`!  ${f}`, 23, y); y += 5;
  });
  y += 4;

  if (y > H - 50) y = newPage(pdf, av, "Metodologia e Referências (cont.)");
  y = sectionTitle(pdf, "Referências Técnicas", y);
  REFERENCIAS.forEach((r) => {
    if (y > H - 15) y = newPage(pdf, av, "Metodologia e Referências (cont.)");
    pdf.setFont("helvetica", "italic"); pdf.setFontSize(8.5); pdf.setTextColor(...MUTED);
    const lines = pdf.splitTextToSize(`— ${r}`, W - 46);
    pdf.text(lines, 23, y);
    y += lines.length * 4 + 2;
  });

  // ---------- ANÁLISE GLOBAL ----------
  y = newPage(pdf, av, "Análise Global dos Resultados");
  y = paragraph(pdf, ANALISE_GLOBAL_TEXTO, y, W);
  y += 4;

  // Resumo numérico das dimensões (mini-tabela)
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(8); pdf.setTextColor(...NAVY);
  pdf.setFillColor(...LIGHT); pdf.rect(20, y, W - 40, 7, "F");
  pdf.text("DIMENSÃO", 23, y + 5);
  pdf.text("SCORE", W - 60, y + 5);
  pdf.text("CLASSIFICAÇÃO", W - 38, y + 5);
  y += 7;
  av.ranking.forEach((d) => {
    if (y > H - 20) y = newPage(pdf, av, "Análise Global (cont.)");
    const cl = classificacaoTexto(d.score);
    const c = colorForScore(d.score);
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(8.5); pdf.setTextColor(40);
    pdf.text(d.dimension, 23, y + 5);
    pdf.text(d.score.toFixed(2), W - 60, y + 5);
    pdf.setFont("helvetica", "bold"); pdf.setTextColor(...c);
    pdf.text(cl.label, W - 38, y + 5);
    y += 6.5;
    pdf.setDrawColor(230, 234, 240); pdf.line(20, y, W - 20, y);
  });
  y += 6;

  // ---------- RECOMENDAÇÕES POR DOMÍNIO ----------
  y = newPage(pdf, av, "Recomendações Técnicas por Domínio");
  y = paragraph(pdf, "Recomendações organizadas por grandes domínios psicossociais, complementares ao plano de ação detalhado por dimensão. Aplicáveis como diretriz geral de intervenção.", y, W);
  y += 4;
  RECOMENDACOES_POR_DOMINIO.forEach((g) => {
    if (y > H - 50) y = newPage(pdf, av, "Recomendações por Domínio (cont.)");
    pdf.setFillColor(...NAVY); pdf.roundedRect(20, y, W - 40, 8, 1.5, 1.5, "F");
    pdf.setTextColor(255); pdf.setFont("helvetica", "bold"); pdf.setFontSize(10);
    pdf.text(g.dominio, 23, y + 5.5);
    y += 11;
    pdf.setTextColor(40); pdf.setFont("helvetica", "normal"); pdf.setFontSize(9);
    g.acoes.forEach((a) => {
      const lines = pdf.splitTextToSize(`•  ${a}`, W - 50);
      if (y + lines.length * 4 > H - 20) y = newPage(pdf, av, "Recomendações por Domínio (cont.)");
      pdf.text(lines, 25, y);
      y += lines.length * 4 + 1;
    });
    y += 4;
  });

  // ---------- INTEGRAÇÃO AO PGR + REAPLICAÇÃO ----------
  if (y > H - 80) y = newPage(pdf, av, "Integração ao PGR e Critérios de Reaplicação");
  else y = sectionTitle(pdf, "Integração ao Plano de Ação do PGR", y);
  y = paragraph(pdf, INTEGRACAO_PGR, y, W);
  y += 4;

  if (y > H - 60) y = newPage(pdf, av, "Critérios de Reaplicação");
  y = sectionTitle(pdf, "Critérios de Reaplicação Antecipada", y);
  y = paragraph(pdf, REAPLICACAO_CRITERIOS.observacao, y, W);
  y += 2;
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(9); pdf.setTextColor(...NAVY);
  pdf.text("Gatilhos para reaplicação fora do ciclo padrão:", 20, y);
  y += 6;
  REAPLICACAO_CRITERIOS.gatilhos.forEach((g) => {
    if (y > H - 15) y = newPage(pdf, av, "Critérios de Reaplicação (cont.)");
    pdf.setFillColor(...ORANGE); pdf.circle(22, y - 1.2, 0.8, "F");
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(9.5); pdf.setTextColor(40);
    pdf.text(g, 26, y); y += 5.5;
  });
  y += 4;

  // ---------- CONCLUSÃO ----------
  if (y > H - 60) y = newPage(pdf, av, "Conclusão");
  else y = sectionTitle(pdf, "Conclusão", y);
  y = paragraph(pdf, CONCLUSAO_TEXTO, y, W);
  y += 6;
  pdf.setDrawColor(...ORANGE); pdf.setLineWidth(0.6); pdf.line(20, y, W - 20, y);
  y += 6;
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(9.5); pdf.setTextColor(...NAVY);
  pdf.text(`Relatório elaborado por: ${av.responsavel}`, 20, y); y += 5;
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(9); pdf.setTextColor(...MUTED);
  pdf.text(`Data de emissão: ${today}`, 20, y);

  // ---------- FOOTERS ----------
  const pages = pdf.getNumberOfPages();
  for (let i = 2; i <= pages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(7.5); pdf.setTextColor(...MUTED); pdf.setFont("helvetica", "normal");
    pdf.text(`${av.codigo} • ${av.periodo} • Psicossocial Analytics`, 20, H - 8);
    pdf.text(`Página ${i} de ${pages}`, W - 20, H - 8, { align: "right" });
  }

  pdf.save(`${av.codigo}_${av.periodo.replace(/\s/g, "")}_Relatorio.pdf`);
}

// Helpers
function drawPageHeader(pdf: jsPDF, av: Avaliacao, title: string): number {
  const W = pdf.internal.pageSize.getWidth();
  pdf.setFillColor(...NAVY); pdf.rect(0, 0, W, 22, "F");
  pdf.setFillColor(...ORANGE); pdf.rect(0, 22, W, 1.5, "F");
  pdf.setTextColor(255); pdf.setFont("helvetica", "bold"); pdf.setFontSize(13);
  pdf.text(title, 20, 14);
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(8); pdf.setTextColor(220, 225, 235);
  pdf.text(`${av.codigo}  •  ${av.periodo}`, W - 20, 14, { align: "right" });
  return 32;
}

function newPage(pdf: jsPDF, av: Avaliacao, title?: string): number {
  pdf.addPage();
  return drawPageHeader(pdf, av, title ?? "Resumo Executivo");
}

function sectionTitle(pdf: jsPDF, label: string, y: number): number {
  pdf.setFont("helvetica", "bold"); pdf.setFontSize(11); pdf.setTextColor(...NAVY);
  pdf.text(label, 20, y);
  pdf.setDrawColor(...ORANGE); pdf.setLineWidth(0.6); pdf.line(20, y + 1.5, 50, y + 1.5);
  return y + 7;
}

function paragraph(pdf: jsPDF, text: string, y: number, W: number, x = 20, size = 9.5): number {
  pdf.setFont("helvetica", "normal"); pdf.setFontSize(size); pdf.setTextColor(50);
  const lines = pdf.splitTextToSize(text, W - x - 20);
  pdf.text(lines, x, y);
  return y + lines.length * (size * 0.45) + 2;
}

// ============ EXCEL ============
export function exportAvaliacaoXLS(av: Avaliacao) {
  const wb = XLSX.utils.book_new();
  const media = avaliacaoMedia(av);
  const cls = classificacaoTexto(media);
  const adesao = (av.totalRespondentes / av.totalConvidados) * 100;

  // ===== Aba 1: Capa =====
  const capa: (string | number)[][] = [
    ["RELATÓRIO PSICOSSOCIAL — COPSOQ II"],
    [],
    ["Código", av.codigo],
    ["Avaliação", av.nome],
    ["Descrição", av.descricao],
    ["Período", av.periodo],
    ["Aplicação", av.dataAplicacao],
    ["Responsável", av.responsavel],
    ["Foco", av.departamentoFoco],
    [],
    ["INDICADORES GERAIS"],
    ["Risco Psicossocial Geral", Number(media.toFixed(2)), cls.label],
    ["Total de Respondentes", av.totalRespondentes, ""],
    ["Total de Convidados", av.totalConvidados, ""],
    ["Taxa de Adesão (%)", Number(adesao.toFixed(1)), adesao >= 70 ? "Boa" : "Baixa"],
    ["Dimensões em Risco Alto", av.ranking.filter((r) => r.score >= 2.67).length, ""],
    ["Dimensões em Risco Moderado", av.ranking.filter((r) => r.score >= 1.67 && r.score < 2.67).length, ""],
    ["Dimensões em Risco Baixo", av.ranking.filter((r) => r.score < 1.67).length, ""],
    [],
    ["Emitido em", new Date().toLocaleString("pt-BR")],
  ];
  const wsCapa = XLSX.utils.aoa_to_sheet(capa);
  wsCapa["!cols"] = [{ wch: 28 }, { wch: 40 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, wsCapa, "Capa");

  // ===== Aba 2: Resumo Executivo =====
  const resumo: string[][] = [
    ["RESUMO EXECUTIVO"],
    [],
    ["Análise Executiva"],
    [av.resumoExecutivo],
    [],
    ["Contexto Organizacional"],
    [av.contextoOrganizacional],
    [],
    ["Metodologia"],
    [av.metodologia],
  ];
  const wsResumo = XLSX.utils.aoa_to_sheet(resumo);
  wsResumo["!cols"] = [{ wch: 120 }];
  XLSX.utils.book_append_sheet(wb, wsResumo, "Resumo Executivo");

  // ===== Aba 3: Ranking =====
  const ranking: (string | number)[][] = [
    ["Posição", "Dimensão COPSOQ II", "Score (0-4)", "Classificação", "Interpretação Técnica"],
  ];
  av.ranking.forEach((d, i) => {
    const cl = classificacaoTexto(d.score);
    ranking.push([
      i + 1,
      d.dimension,
      Number(d.score.toFixed(2)),
      cl.label,
      INTERPRETACOES[d.dimension as string] ?? "—",
    ]);
  });
  const wsRank = XLSX.utils.aoa_to_sheet(ranking);
  wsRank["!cols"] = [{ wch: 8 }, { wch: 32 }, { wch: 12 }, { wch: 14 }, { wch: 90 }];
  XLSX.utils.book_append_sheet(wb, wsRank, "Ranking de Dimensões");

  // ===== Aba 4: Plano de Ação =====
  const acao: (string | number)[][] = [
    ["PLANO DE AÇÃO RECOMENDADO"],
    [],
    ["Dimensão", "Score", "Classif.", "Programa", "Ações Recomendadas", "Prazo", "Impacto Esperado"],
  ];
  av.ranking
    .filter((r) => r.score >= 2.0)
    .forEach((d) => {
      const rec = RECOMENDACOES_DETALHADAS[d.dimension as string];
      if (!rec) return;
      acao.push([
        d.dimension,
        Number(d.score.toFixed(2)),
        classificacaoTexto(d.score).label,
        rec.titulo,
        rec.acoes.map((a, i) => `${i + 1}. ${a}`).join("\n"),
        rec.prazo,
        rec.impacto,
      ]);
    });
  const wsAcao = XLSX.utils.aoa_to_sheet(acao);
  wsAcao["!cols"] = [{ wch: 28 }, { wch: 8 }, { wch: 12 }, { wch: 36 }, { wch: 70 }, { wch: 14 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(wb, wsAcao, "Plano de Ação");

  // ===== Aba 5: Metodologia =====
  const metod: string[][] = [
    ["METODOLOGIA E ESCALA COPSOQ II"],
    [],
    ["Sobre a escala"],
    [ESCALA_COPSOQ],
    [],
    ["Faixa", "Classificação", "Descrição"],
    ...FAIXAS.map((f) => [f.faixa, f.classificacao, f.descricao]),
    [],
    ["Fatores Protetivos"],
    ...FATORES_PROTETIVOS.map((f) => [`✓ ${f}`]),
    [],
    ["Fatores de Risco Comuns"],
    ...FATORES_RISCO.map((f) => [`! ${f}`]),
    [],
    ["Referências Técnicas"],
    ...REFERENCIAS.map((r) => [`— ${r}`]),
  ];
  const wsMet = XLSX.utils.aoa_to_sheet(metod);
  wsMet["!cols"] = [{ wch: 22 }, { wch: 18 }, { wch: 80 }];
  XLSX.utils.book_append_sheet(wb, wsMet, "Metodologia");

  XLSX.writeFile(wb, `${av.codigo}_${av.periodo.replace(/\s/g, "")}_Dados.xlsx`);
}
