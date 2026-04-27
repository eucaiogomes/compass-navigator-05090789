// Avaliações disponíveis para visualização individual
// Cada avaliação tem ranking de dimensões pré-calculado e metadados
import { Dimension } from "./copsoq";

export interface AvaliacaoDimensao {
  dimension: Dimension | string;
  score: number; // 0-4
}

export interface Avaliacao {
  id: string;
  codigo: string; // Ex: NR-1
  nome: string;
  descricao: string;
  periodo: string; // Abril - 2026
  dataAplicacao: string;
  totalRespondentes: number;
  totalConvidados: number;
  departamentoFoco: string;
  responsavel: string;
  metodologia: string;
  ranking: AvaliacaoDimensao[];
  resumoExecutivo: string;
  contextoOrganizacional: string;
}

// Dataset realista de avaliações
export const AVALIACOES: Avaliacao[] = [
  {
    id: "av-001",
    codigo: "NR-1",
    nome: "NR-1 — Avaliação Psicossocial Abril/2026",
    descricao: "Diagnóstico de riscos psicossociais conforme NR-1 (atualização 2024) com base no instrumento COPSOQ II — versão curta.",
    periodo: "Abril - 2026",
    dataAplicacao: "01/04/2026 a 18/04/2026",
    totalRespondentes: 287,
    totalConvidados: 342,
    departamentoFoco: "Toda a organização",
    responsavel: "Departamento de Saúde Ocupacional & RH",
    metodologia: "COPSOQ II (Copenhagen Psychosocial Questionnaire) — versão curta validada em PT-BR. Aplicação online anônima com escala Likert 0–4.",
    ranking: [
      { dimension: "Conflito Trabalho-Família", score: 2.49 },
      { dimension: "Estresse", score: 2.48 },
      { dimension: "Reconhecimento", score: 2.40 },
      { dimension: "Carga de Trabalho", score: 2.25 },
      { dimension: "Exigências Quantitativas", score: 2.14 },
      { dimension: "Clareza de Papel", score: 2.07 },
      { dimension: "Justiça e Respeito", score: 2.02 },
      { dimension: "Suporte Social de Superiores", score: 1.99 },
      { dimension: "Qualidade da Liderança", score: 1.99 },
      { dimension: "Significado do Trabalho", score: 1.94 },
    ],
    resumoExecutivo:
      "A avaliação NR-1 de Abril/2026 indica um cenário psicossocial geral classificado como MODERADO, com pontuação média ponderada de 2,18/4. Destacam-se três dimensões em zona de atenção: Conflito Trabalho-Família (2,49), Estresse (2,48) e Reconhecimento (2,40). A taxa de adesão de 83,9% (287 de 342 colaboradores) confere alta confiabilidade estatística aos resultados. Recomenda-se ação prioritária nas três dimensões críticas identificadas, com foco em política de desconexão, programa de bem-estar e estruturação de feedback formal mensal.",
    contextoOrganizacional:
      "Esta avaliação foi aplicada após a publicação da atualização da NR-1 que tornou obrigatório o gerenciamento de riscos psicossociais no PGR (Programa de Gerenciamento de Riscos). O instrumento utilizado foi o COPSOQ II versão curta, considerado padrão-ouro internacional, com mais de 30 anos de validação científica e tradução para mais de 25 idiomas. O ciclo de aplicação foi mensal e a próxima reavaliação está prevista para Outubro/2026.",
  },
  {
    id: "av-002",
    codigo: "PCL-Q1",
    nome: "Pesquisa de Clima Organizacional — 1º Trimestre/2026",
    descricao: "Pesquisa trimestral combinando dimensões COPSOQ II com indicadores de clima e engajamento.",
    periodo: "Janeiro a Março - 2026",
    dataAplicacao: "10/03/2026 a 28/03/2026",
    totalRespondentes: 312,
    totalConvidados: 340,
    departamentoFoco: "Toda a organização",
    responsavel: "Comitê de Pessoas & Cultura",
    metodologia: "Híbrida: 32 questões COPSOQ II + 8 questões de clima organizacional + 1 NPS interno (eNPS). Aplicação anônima.",
    ranking: [
      { dimension: "Carga de Trabalho", score: 2.71 },
      { dimension: "Estresse", score: 2.62 },
      { dimension: "Conflito Trabalho-Família", score: 2.55 },
      { dimension: "Burnout", score: 2.41 },
      { dimension: "Reconhecimento", score: 2.33 },
      { dimension: "Qualidade da Liderança", score: 2.18 },
      { dimension: "Suporte Social de Superiores", score: 2.10 },
      { dimension: "Justiça e Respeito", score: 2.05 },
      { dimension: "Comunidade Social no Trabalho", score: 1.88 },
      { dimension: "Significado do Trabalho", score: 1.72 },
    ],
    resumoExecutivo:
      "O 1º Trimestre/2026 evidencia agravamento dos indicadores de Carga de Trabalho (2,71 — zona ALTA) e Estresse (2,62), confirmando tendência observada desde Outubro/2025. O eNPS interno apresentou queda de 6 pontos vs. trimestre anterior. Quatro dimensões ultrapassam o limiar de 2,40 e exigem intervenção sistêmica. Adesão de 91,8%.",
    contextoOrganizacional:
      "Período de fechamento fiscal e migração de sistema ERP, fatores conhecidos de aumento temporário de carga. Recomenda-se nova medição em Junho/2026 para validar se o aumento é circunstancial ou estrutural.",
  },
  {
    id: "av-003",
    codigo: "NR-1-OPS",
    nome: "NR-1 Operações — Recorte Setorial Março/2026",
    descricao: "Avaliação focada na área de Operações, com recorte por turno e função operacional.",
    periodo: "Março - 2026",
    dataAplicacao: "05/03/2026 a 22/03/2026",
    totalRespondentes: 84,
    totalConvidados: 92,
    departamentoFoco: "Operações",
    responsavel: "SESMT + Coordenação de Operações",
    metodologia: "COPSOQ II versão curta + 4 perguntas específicas de turno e ergonomia.",
    ranking: [
      { dimension: "Carga de Trabalho", score: 3.12 },
      { dimension: "Burnout", score: 2.95 },
      { dimension: "Estresse", score: 2.88 },
      { dimension: "Conflito Trabalho-Família", score: 2.74 },
      { dimension: "Ritmo de Trabalho", score: 2.68 },
      { dimension: "Reconhecimento", score: 2.51 },
      { dimension: "Suporte Social de Superiores", score: 2.42 },
      { dimension: "Qualidade da Liderança", score: 2.38 },
      { dimension: "Justiça e Respeito", score: 2.20 },
      { dimension: "Influência no Trabalho", score: 2.15 },
    ],
    resumoExecutivo:
      "ATENÇÃO CRÍTICA: a área de Operações apresenta TRÊS dimensões em risco ALTO (Carga de Trabalho 3,12, Burnout 2,95 e Estresse 2,88), configurando situação de risco psicossocial elevado conforme critérios COPSOQ II. Recomenda-se PLANO DE AÇÃO IMEDIATO em até 30 dias, com revisão de dimensionamento de equipe, escala de turnos e implantação de programa de saúde mental específico para a área.",
    contextoOrganizacional:
      "Operações concentra 27% do efetivo e opera em 3 turnos. Houve aumento de 18% no volume de produção desde Janeiro/2026 sem ajuste correspondente de headcount. Duas saídas voluntárias foram registradas no período da avaliação.",
  },
  {
    id: "av-004",
    codigo: "PULSO-MAR",
    nome: "Pulse Survey — Bem-Estar Mental Março/2026",
    descricao: "Pesquisa rápida de pulso (10 questões) para monitoramento mensal de bem-estar.",
    periodo: "Março - 2026",
    dataAplicacao: "25/03/2026 a 28/03/2026",
    totalRespondentes: 198,
    totalConvidados: 340,
    departamentoFoco: "Toda a organização",
    responsavel: "RH — Núcleo de Bem-Estar",
    metodologia: "Pulse com 10 itens derivados do COPSOQ II + 1 questão aberta opcional.",
    ranking: [
      { dimension: "Estresse", score: 2.32 },
      { dimension: "Conflito Trabalho-Família", score: 2.18 },
      { dimension: "Carga de Trabalho", score: 2.09 },
      { dimension: "Reconhecimento", score: 2.04 },
      { dimension: "Burnout", score: 1.98 },
      { dimension: "Suporte Social de Colegas", score: 1.72 },
      { dimension: "Qualidade da Liderança", score: 1.68 },
      { dimension: "Significado do Trabalho", score: 1.55 },
      { dimension: "Justiça e Respeito", score: 1.49 },
      { dimension: "Comunidade Social no Trabalho", score: 1.42 },
    ],
    resumoExecutivo:
      "O pulse de Março indica cenário MODERADO com pontos positivos em Comunidade Social (1,42) e Justiça/Respeito (1,49). A adesão de 58,2% é abaixo do recomendado para pulses (>70%) — sugere-se revisão da estratégia de divulgação. Estresse e Conflito Trabalho-Família mantêm-se como pontos de atenção contínua.",
    contextoOrganizacional:
      "Pulse mensal complementar à pesquisa NR-1. Ideal para monitoramento de tendências de curto prazo e validação de ações já implementadas.",
  },
];

export function getAvaliacao(id: string) {
  return AVALIACOES.find((a) => a.id === id);
}

export function avaliacaoMedia(av: Avaliacao): number {
  return av.ranking.reduce((s, r) => s + r.score, 0) / av.ranking.length;
}
