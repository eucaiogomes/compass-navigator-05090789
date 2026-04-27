// Conteúdo textual rico pré-pronto para PDF/XLS
// Interpretações por dimensão, recomendações detalhadas, glossário

export const ESCALA_COPSOQ = `A escala COPSOQ II varia de 0 (mínimo) a 4 (máximo). Para dimensões de risco (carga, estresse, burnout, conflito), valores MAIS ALTOS indicam pior condição. Para dimensões positivas (suporte, reconhecimento, significado), os escores são internamente invertidos para que a leitura seja sempre uniforme: maior valor = maior risco psicossocial.`;

export const FAIXAS = [
  { faixa: "0,00 — 1,66", classificacao: "BAIXO", descricao: "Risco psicossocial baixo. Manter práticas atuais e monitorar." },
  { faixa: "1,67 — 2,66", classificacao: "MODERADO", descricao: "Zona de atenção. Avaliar tendências e implementar ações preventivas." },
  { faixa: "2,67 — 4,00", classificacao: "ALTO", descricao: "Risco psicossocial alto. Ação corretiva imediata recomendada." },
];

// Interpretação textual por dimensão (rica, executiva)
export const INTERPRETACOES: Record<string, string> = {
  "Carga de Trabalho":
    "Mede a percepção do volume de trabalho a ser executado em relação ao tempo disponível. Escores elevados associam-se a fadiga crônica, queda de produtividade e maior incidência de absenteísmo. A literatura demonstra correlação direta com transtornos musculoesqueléticos e episódios de burnout.",
  "Exigências Quantitativas":
    "Avalia o ritmo e a quantidade de trabalho exigida. Difere de Carga de Trabalho por focar na pressão temporal. Valores acima de 2,5 são preditores de esgotamento em médio prazo.",
  "Ritmo de Trabalho":
    "Mensura a velocidade exigida na execução das tarefas. Escores altos sugerem necessidade de revisar fluxos, automatizar etapas repetitivas ou redimensionar equipes.",
  "Estresse":
    "Indicador de tensão psicofisiológica auto-percebida. Acima de 2,5 representa risco aumentado para hipertensão, ansiedade e quadros depressivos. É um dos preditores mais fortes de afastamentos por CID F (transtornos mentais).",
  "Burnout":
    "Síndrome ocupacional reconhecida pela OMS (CID-11). Valores acima de 2,5 indicam exaustão emocional significativa. Acima de 3,0 sugere necessidade de avaliação clínica individualizada.",
  "Conflito Trabalho-Família":
    "Mede o grau em que demandas profissionais interferem na vida pessoal e familiar. Está associado a queda de engajamento, intenção de turnover e maior número de licenças. Mitigado por políticas de horários flexíveis e direito à desconexão.",
  "Reconhecimento":
    "Percepção de valorização pelo trabalho realizado. Baixo reconhecimento é o segundo maior preditor de turnover voluntário, atrás apenas de qualidade da liderança imediata.",
  "Qualidade da Liderança":
    "Avalia a percepção dos colaboradores sobre a competência, justiça e suporte do gestor direto. Lideranças mal avaliadas geram efeito cascata em todas as demais dimensões.",
  "Suporte Social de Superiores":
    "Mede a disponibilidade de apoio prático e emocional por parte dos gestores. Correlaciona-se positivamente com retenção de talentos e satisfação no trabalho.",
  "Suporte Social de Colegas":
    "Avalia a percepção de apoio entre pares. Equipes com alto suporte horizontal apresentam menor taxa de adoecimento mental.",
  "Comunidade Social no Trabalho":
    "Mede o senso de pertencimento e conexão com o grupo de trabalho. Importante fator protetivo contra isolamento e quadros depressivos.",
  "Influência no Trabalho":
    "Grau de autonomia e participação nas decisões que afetam o próprio trabalho. Baixa influência associa-se a sentimento de impotência e desengajamento.",
  "Possibilidades de Desenvolvimento":
    "Percepção de oportunidades de aprendizado e crescimento. Fator crítico para retenção de talentos da geração Y/Z.",
  "Significado do Trabalho":
    "Percepção do propósito e relevância do trabalho realizado. Atua como fator protetivo mesmo em ambientes com outras dimensões críticas.",
  "Previsibilidade":
    "Mede o quanto o colaborador é informado sobre mudanças, decisões e direção da empresa. Baixa previsibilidade gera ansiedade organizacional.",
  "Clareza de Papel":
    "Grau em que o colaborador conhece suas responsabilidades, metas e limites de atuação. Baixa clareza correlaciona-se com retrabalho e conflitos interpessoais.",
  "Conflito de Papel":
    "Mensura demandas contraditórias recebidas pelo colaborador. Escores altos indicam falhas de governança ou comunicação entre lideranças.",
  "Confiança Vertical":
    "Confiança entre colaboradores e alta direção. Fator-chave para mudanças organizacionais bem-sucedidas.",
  "Justiça e Respeito":
    "Percepção de equidade nos processos (promoções, distribuição de carga, reconhecimento). Baixa justiça é fator de risco para conflitos e processos trabalhistas.",
  "Saúde Geral":
    "Auto-avaliação do estado de saúde geral. Indicador-resumo do impacto cumulativo das demais dimensões.",
};

// Recomendações detalhadas (multi-linha) por fator
export const RECOMENDACOES_DETALHADAS: Record<string, { titulo: string; acoes: string[]; prazo: string; impacto: string }> = {
  "Carga de Trabalho": {
    titulo: "Plano de Mitigação de Sobrecarga",
    acoes: [
      "Mapear as 3 atividades de maior consumo de tempo por equipe e avaliar automação ou redistribuição.",
      "Implantar reuniões de priorização semanais com matriz de Eisenhower (urgente x importante).",
      "Revisar dimensionamento de headcount considerando o aumento real de demanda dos últimos 6 meses.",
      "Estabelecer SLA interno máximo para entregas e proibir reuniões fora do expediente.",
    ],
    prazo: "60 dias",
    impacto: "Redução esperada de 0,3 a 0,6 pontos na próxima medição.",
  },
  "Estresse": {
    titulo: "Programa de Bem-Estar Psicológico",
    acoes: [
      "Contratar EAP (Employee Assistance Program) com atendimento psicológico 24/7.",
      "Implementar sessões mensais de mindfulness no horário de trabalho.",
      "Treinar lideranças para identificar sinais precoces de adoecimento mental.",
      "Criar canal confidencial de escuta ativa via SESMT.",
    ],
    prazo: "90 dias",
    impacto: "Redução de 15-25% em afastamentos por CID F em 12 meses.",
  },
  "Burnout": {
    titulo: "Protocolo de Prevenção e Tratamento de Burnout",
    acoes: [
      "Triagem clínica individual para colaboradores com escore >3,0 (consentido e confidencial).",
      "Política formal de pausas estruturadas (5 min a cada 90 min de trabalho).",
      "Revisão obrigatória de carga para gestores de equipes com alta incidência.",
      "Banco de horas com obrigatoriedade de gozo trimestral.",
    ],
    prazo: "Imediato",
    impacto: "Redução de turnover involuntário e custos com saúde mental.",
  },
  "Conflito Trabalho-Família": {
    titulo: "Política de Equilíbrio Vida-Trabalho",
    acoes: [
      "Formalizar direito à desconexão fora do expediente (sem cobranças por mensagens).",
      "Oferecer modelo híbrido ou flexibilidade de horário para funções compatíveis.",
      "Licença parental ampliada (acima do mínimo legal).",
      "Programa de apoio a cuidadores (filhos, idosos).",
    ],
    prazo: "120 dias",
    impacto: "Aumento de retenção, especialmente em faixas etárias 28-45 anos.",
  },
  "Reconhecimento": {
    titulo: "Sistema Estruturado de Reconhecimento",
    acoes: [
      "Implantar rituais de feedback formal mensal (1:1) entre líder e liderado.",
      "Plataforma de reconhecimento entre pares (ex: kudos, badges).",
      "Revisão da política de bônus e méritos com critérios transparentes.",
      "Celebração pública de marcos individuais e de equipe.",
    ],
    prazo: "60 dias",
    impacto: "Melhora direta em engajamento e eNPS.",
  },
  "Qualidade da Liderança": {
    titulo: "Desenvolvimento de Lideranças",
    acoes: [
      "Programa de formação em liderança humanizada (mínimo 40h).",
      "Avaliação 360° anual com plano de desenvolvimento individual.",
      "Mentoring cruzado entre lideranças sêniores e novas.",
      "KPI de saúde da equipe na avaliação de performance dos gestores.",
    ],
    prazo: "180 dias",
    impacto: "Efeito cascata em todas as demais dimensões psicossociais.",
  },
  "Suporte Social de Superiores": {
    titulo: "Capacitação de Líderes em Escuta e Suporte",
    acoes: [
      "Treinar lideranças em escuta ativa e comunicação não-violenta.",
      "Instituir 1:1s semanais ou quinzenais como ritual obrigatório.",
      "Criar protocolo para encaminhamento de casos sensíveis ao RH/SESMT.",
    ],
    prazo: "90 dias",
    impacto: "Detecção precoce de problemas e fortalecimento de vínculo.",
  },
  "Justiça e Respeito": {
    titulo: "Governança de Equidade",
    acoes: [
      "Revisar e tornar transparentes os critérios de promoção e remuneração.",
      "Canal de denúncia confidencial e independente (compliance/ouvidoria).",
      "Política de tolerância zero a assédio com treinamento anual obrigatório.",
      "Comitê de diversidade e inclusão com pauta ativa.",
    ],
    prazo: "120 dias",
    impacto: "Redução de conflitos, processos e melhora de reputação interna.",
  },
  "Clareza de Papel": {
    titulo: "Estruturação de Papéis e Responsabilidades",
    acoes: [
      "Revisar descrições de cargo e atualizar matrizes RACI por processo.",
      "Definir OKRs trimestrais alinhados em cascata.",
      "Onboarding estruturado mínimo de 30 dias para novos contratados.",
    ],
    prazo: "90 dias",
    impacto: "Redução de retrabalho e conflitos entre áreas.",
  },
  "Ritmo de Trabalho": {
    titulo: "Gestão de Ritmo e Pausas",
    acoes: [
      "Análise ergonômica e de cadência de produção.",
      "Implantar rodízio de funções em postos de alta repetitividade.",
      "Pausas micro-estruturadas em postos críticos.",
    ],
    prazo: "60 dias",
    impacto: "Redução de fadiga e LER/DORT.",
  },
  "Exigências Quantitativas": {
    titulo: "Equilíbrio entre Demanda e Capacidade",
    acoes: [
      "Forecast de demanda trimestral com plano de capacidade.",
      "Revisão de SLAs internos com áreas demandantes.",
      "Banco de horas com regras claras de compensação.",
    ],
    prazo: "90 dias",
    impacto: "Estabilização do ritmo e previsibilidade.",
  },
  "Significado do Trabalho": {
    titulo: "Conexão com Propósito",
    acoes: [
      "Comunicação sistemática do impacto do trabalho de cada equipe.",
      "Encontros com clientes/usuários finais para times de back-office.",
      "Storytelling de cases de sucesso em comunicação interna.",
    ],
    prazo: "Contínuo",
    impacto: "Engajamento e retenção, especialmente em jovens talentos.",
  },
};

export const FATORES_PROTETIVOS = [
  "Liderança humanizada e acessível",
  "Clareza de propósito e comunicação transparente",
  "Autonomia e flexibilidade compatível com a função",
  "Reconhecimento formal e informal frequente",
  "Equilíbrio vida-trabalho respeitado",
  "Comunidade de pares forte e colaborativa",
  "Acesso facilitado a apoio psicológico",
];

export const FATORES_RISCO = [
  "Sobrecarga crônica sem perspectiva de alívio",
  "Liderança autoritária ou ausente",
  "Falta de reconhecimento ou critérios opacos",
  "Conflitos interpessoais não mediados",
  "Insegurança no emprego ou mudanças sem comunicação",
  "Demandas emocionais altas sem suporte",
  "Cultura de presenteísmo e hiperconectividade",
];

export const REFERENCIAS = [
  "Kristensen, T. S. et al. The Copenhagen Psychosocial Questionnaire — COPSOQ II (2010).",
  "NR-1 (Norma Regulamentadora 1) — atualização 2024 — Ministério do Trabalho e Emprego.",
  "OMS — CID-11 — QD85 Burnout (Síndrome do Esgotamento Profissional).",
  "ISO 45003:2021 — Gestão de saúde e segurança psicológica no trabalho.",
];

export function classificacaoTexto(score: number): { label: string; descricao: string } {
  if (score < 1.67) return { label: "BAIXO", descricao: "Risco psicossocial baixo. Manter práticas atuais e monitorar." };
  if (score < 2.67) return { label: "MODERADO", descricao: "Zona de atenção. Implementar ações preventivas." };
  return { label: "ALTO", descricao: "Risco alto. Ação corretiva imediata recomendada." };
}
