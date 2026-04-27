// COPSOQ II mock data + computation helpers
// All scores follow the COPSOQ II convention on a 0–4 scale where higher = higher risk
// (for negative dimensions like demands, work-family conflict, stress).
// Positive dimensions (recognition, autonomy, support) are inverted internally so a
// higher displayed "risk" always means worse psychosocial condition.

export type RiskLevel = "low" | "moderate" | "high";

export const DIMENSIONS = [
  "Exigências Quantitativas",
  "Carga de Trabalho",
  "Ritmo de Trabalho",
  "Influência no Trabalho",
  "Possibilidades de Desenvolvimento",
  "Significado do Trabalho",
  "Previsibilidade",
  "Reconhecimento",
  "Clareza de Papel",
  "Conflito de Papel",
  "Qualidade da Liderança",
  "Suporte Social de Colegas",
  "Suporte Social de Superiores",
  "Comunidade Social no Trabalho",
  "Conflito Trabalho-Família",
  "Confiança Vertical",
  "Justiça e Respeito",
  "Saúde Geral",
  "Estresse",
  "Burnout",
] as const;

export type Dimension = (typeof DIMENSIONS)[number];

// Top 8 dimensions used in compact charts
export const TOP_DIMENSIONS: Dimension[] = [
  "Carga de Trabalho",
  "Reconhecimento",
  "Qualidade da Liderança",
  "Conflito Trabalho-Família",
  "Estresse",
  "Burnout",
  "Suporte Social de Superiores",
  "Justiça e Respeito",
];

export const DEPARTMENTS = [
  "Operações",
  "Comercial",
  "Tecnologia",
  "Atendimento",
  "Financeiro",
  "Recursos Humanos",
  "Logística",
  "Marketing",
] as const;

export const ROLES = ["Operacional", "Analista", "Especialista", "Coordenação", "Liderança"] as const;
export const CONTRACTS = ["CLT", "PJ", "Estágio", "Terceirizado"] as const;
export const UNITS = ["São Paulo", "Rio de Janeiro", "Belo Horizonte"] as const;
export const PERIODS = ["Mensal", "Trimestral", "Anual"] as const;

export type Department = (typeof DEPARTMENTS)[number];
export type Role = (typeof ROLES)[number];
export type Contract = (typeof CONTRACTS)[number];
export type Unit = (typeof UNITS)[number];

export interface Respondent {
  id: string;
  department: Department;
  role: Role;
  contract: Contract;
  unit: Unit;
  participated: boolean;
  scores: Record<Dimension, number>; // 0–4
  month: number; // 0–11 (last 12 months)
}

// Deterministic pseudo-random generator (seeded) for stable mock data
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20240501);

// Department-specific risk profile (bias for each dimension, makes data realistic)
const DEPT_BIAS: Record<Department, Partial<Record<Dimension, number>>> = {
  Operações: { "Carga de Trabalho": 1.2, Estresse: 1.0, Burnout: 0.9, "Conflito Trabalho-Família": 0.8 },
  Comercial: { Estresse: 1.0, "Ritmo de Trabalho": 1.1, "Exigências Quantitativas": 0.9 },
  Tecnologia: { "Conflito Trabalho-Família": 0.7, "Carga de Trabalho": 0.6, Reconhecimento: 0.8 },
  Atendimento: { Estresse: 1.1, "Qualidade da Liderança": 0.7, Burnout: 0.8 },
  Financeiro: { "Exigências Quantitativas": 0.6, "Clareza de Papel": -0.3 },
  "Recursos Humanos": { "Suporte Social de Colegas": -0.4, "Justiça e Respeito": -0.3 },
  Logística: { "Carga de Trabalho": 0.9, "Ritmo de Trabalho": 0.8 },
  Marketing: { Reconhecimento: 0.5, "Conflito de Papel": 0.4 },
};

function generateRespondents(): Respondent[] {
  const list: Respondent[] = [];
  let id = 1;
  for (const dept of DEPARTMENTS) {
    const count = 15 + Math.floor(rand() * 10); // 15–25 per dept
    for (let i = 0; i < count; i++) {
      const role = ROLES[Math.floor(rand() * ROLES.length)];
      const contract = CONTRACTS[Math.floor(rand() * CONTRACTS.length)];
      const unit = UNITS[Math.floor(rand() * UNITS.length)];
      const participated = rand() > 0.18; // ~82% participation
      const month = Math.floor(rand() * 12);

      const scores = {} as Record<Dimension, number>;
      for (const d of DIMENSIONS) {
        const bias = DEPT_BIAS[dept]?.[d] ?? 0;
        // base around 1.8 with department bias and some noise
        const raw = 1.8 + bias + (rand() - 0.5) * 1.4;
        scores[d] = Math.max(0, Math.min(4, Number(raw.toFixed(2))));
      }
      list.push({ id: `R${String(id++).padStart(4, "0")}`, department: dept, role, contract, unit, participated, scores, month });
    }
  }
  return list;
}

export const RESPONDENTS: Respondent[] = generateRespondents();

// ===== Filters and aggregation =====

export interface Filters {
  period: (typeof PERIODS)[number];
  department: Department | "Todos";
  role: Role | "Todos";
  contract: Contract | "Todos";
  unit: Unit | "Todos";
}

export const DEFAULT_FILTERS: Filters = {
  period: "Trimestral",
  department: "Todos",
  role: "Todos",
  contract: "Todos",
  unit: "Todos",
};

export function applyFilters(data: Respondent[], f: Filters): Respondent[] {
  const monthsBack = f.period === "Mensal" ? 1 : f.period === "Trimestral" ? 3 : 12;
  return data.filter((r) => {
    if (r.month >= monthsBack) return false;
    if (f.department !== "Todos" && r.department !== f.department) return false;
    if (f.role !== "Todos" && r.role !== f.role) return false;
    if (f.contract !== "Todos" && r.contract !== f.contract) return false;
    if (f.unit !== "Todos" && r.unit !== f.unit) return false;
    return true;
  });
}

export function classifyRisk(score: number): RiskLevel {
  if (score < 1.67) return "low";
  if (score < 2.67) return "moderate";
  return "high";
}

export function riskLabel(r: RiskLevel) {
  return r === "low" ? "Baixo" : r === "moderate" ? "Moderado" : "Alto";
}

export function avgScore(rs: Respondent[], dim: Dimension): number {
  const part = rs.filter((r) => r.participated);
  if (!part.length) return 0;
  return part.reduce((s, r) => s + r.scores[dim], 0) / part.length;
}

export function overallRisk(rs: Respondent[]): number {
  const part = rs.filter((r) => r.participated);
  if (!part.length) return 0;
  let sum = 0;
  let n = 0;
  for (const r of part) {
    for (const d of TOP_DIMENSIONS) {
      sum += r.scores[d];
      n++;
    }
  }
  return sum / n;
}

export function participationRate(rs: Respondent[]): number {
  if (!rs.length) return 0;
  return (rs.filter((r) => r.participated).length / rs.length) * 100;
}

export function engagementIndex(rs: Respondent[]): number {
  // Inverse of average risk on negative dimensions, scaled 0–100
  const risk = overallRisk(rs);
  return Math.max(0, Math.min(100, (1 - risk / 4) * 100));
}

export function riskDistribution(rs: Respondent[]) {
  const part = rs.filter((r) => r.participated);
  let low = 0, mod = 0, high = 0;
  for (const r of part) {
    const personal = TOP_DIMENSIONS.reduce((s, d) => s + r.scores[d], 0) / TOP_DIMENSIONS.length;
    const cls = classifyRisk(personal);
    if (cls === "low") low++;
    else if (cls === "moderate") mod++;
    else high++;
  }
  const total = part.length || 1;
  return [
    { name: "Baixo", value: low, pct: (low / total) * 100, color: "hsl(var(--risk-low))" },
    { name: "Moderado", value: mod, pct: (mod / total) * 100, color: "hsl(var(--risk-moderate))" },
    { name: "Alto", value: high, pct: (high / total) * 100, color: "hsl(var(--risk-high))" },
  ];
}

export function dimensionRanking(rs: Respondent[]) {
  return DIMENSIONS.map((d) => ({ dimension: d, score: avgScore(rs, d) }))
    .sort((a, b) => b.score - a.score);
}

export function temporalEvolution(rs: Respondent[]) {
  // Aggregate by month (0 = current month)
  const months = Array.from({ length: 12 }, (_, i) => 11 - i);
  return months.map((m) => {
    const slice = rs.filter((r) => r.month === m);
    const part = slice.filter((r) => r.participated);
    const avg = (dim: Dimension) =>
      part.length ? part.reduce((s, r) => s + r.scores[dim], 0) / part.length : 0;
    return {
      mes: monthLabel(m),
      "Risco Geral": Number(((TOP_DIMENSIONS.reduce((s, d) => s + avg(d), 0) / TOP_DIMENSIONS.length) || 0).toFixed(2)),
      Estresse: Number(avg("Estresse").toFixed(2)),
      "Carga de Trabalho": Number(avg("Carga de Trabalho").toFixed(2)),
      Burnout: Number(avg("Burnout").toFixed(2)),
    };
  });
}

function monthLabel(monthsAgo: number) {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsAgo);
  return d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
}

export function heatmapByDepartment(rs: Respondent[]) {
  return DEPARTMENTS.map((dept) => {
    const slice = rs.filter((r) => r.department === dept);
    const cells = TOP_DIMENSIONS.map((dim) => ({ dim, score: avgScore(slice, dim) }));
    const avg = cells.reduce((s, c) => s + c.score, 0) / cells.length;
    return { department: dept, cells, avg };
  }).sort((a, b) => b.avg - a.avg);
}

// Variation vs previous period (months 3–6 comparison heuristic)
export function previousPeriodVariation(rs: Respondent[], current: number, fn: (rs: Respondent[]) => number) {
  const previous = RESPONDENTS.filter((r) => r.month >= 3 && r.month < 6);
  const prev = fn(previous);
  if (!prev) return 0;
  return ((current - prev) / prev) * 100;
}

// Insights and recommendations
export interface Insight {
  severity: RiskLevel;
  title: string;
  detail: string;
}

export function generateInsights(rs: Respondent[]): Insight[] {
  const insights: Insight[] = [];
  const heatmap = heatmapByDepartment(rs);

  for (const row of heatmap.slice(0, 3)) {
    const critical = row.cells.filter((c) => c.score >= 2.67).sort((a, b) => b.score - a.score);
    if (critical.length) {
      insights.push({
        severity: "high",
        title: `${row.department} apresenta risco alto em ${critical[0].dim}`,
        detail: `Pontuação média ${critical[0].score.toFixed(2)}/4 — ação prioritária recomendada.`,
      });
    }
  }

  // Participation by department
  for (const dept of DEPARTMENTS) {
    const slice = rs.filter((r) => r.department === dept);
    const rate = participationRate(slice);
    if (slice.length > 5 && rate < 60) {
      insights.push({
        severity: "moderate",
        title: `Baixa adesão em ${dept} (${rate.toFixed(0)}%)`,
        detail: "Participação abaixo do ideal compromete a confiabilidade da análise.",
      });
    }
  }

  // Recognition critical across N areas
  const recoCritical = DEPARTMENTS.filter((d) => avgScore(rs.filter((r) => r.department === d), "Reconhecimento") >= 2.5);
  if (recoCritical.length >= 3) {
    insights.push({
      severity: "high",
      title: `Reconhecimento crítico em ${recoCritical.length} áreas`,
      detail: "Padrão sistêmico — prioridade imediata para a alta gestão.",
    });
  }

  const overall = overallRisk(rs);
  if (overall < 1.67) {
    insights.push({
      severity: "low",
      title: "Cenário psicossocial geral saudável",
      detail: `Risco médio de ${overall.toFixed(2)}/4 — manter práticas atuais e monitorar.`,
    });
  }

  return insights.slice(0, 6);
}

export interface Recommendation {
  factor: string;
  action: string;
  target: string;
  impact: "Alto" | "Médio";
}

export function generateRecommendations(rs: Respondent[]): Recommendation[] {
  const heatmap = heatmapByDepartment(rs);
  const recs: Recommendation[] = [];

  const ACTIONS: Record<string, string> = {
    "Carga de Trabalho": "Revisar distribuição de tarefas e dimensionar equipe; implementar gestão de prioridades.",
    "Reconhecimento": "Implementar feedback estruturado mensal e programa de reconhecimento entre pares.",
    "Qualidade da Liderança": "Programa de desenvolvimento de liderança e mentoring executivo.",
    "Conflito Trabalho-Família": "Política de horários flexíveis e direito à desconexão.",
    "Estresse": "Programa de bem-estar, mindfulness e suporte psicológico (EAP).",
    "Burnout": "Avaliação clínica, redistribuição de cargas e pausas estruturadas.",
    "Suporte Social de Superiores": "Treinar líderes em escuta ativa e rituais 1:1 semanais.",
    "Justiça e Respeito": "Revisar processos de promoção e canais de denúncia confidenciais.",
  };

  const seen = new Set<string>();
  for (const row of heatmap) {
    for (const c of row.cells) {
      if (c.score >= 2.5 && !seen.has(c.dim) && ACTIONS[c.dim]) {
        recs.push({
          factor: c.dim,
          action: ACTIONS[c.dim],
          target: row.department,
          impact: c.score >= 3 ? "Alto" : "Médio",
        });
        seen.add(c.dim);
      }
    }
  }

  return recs.slice(0, 6);
}
