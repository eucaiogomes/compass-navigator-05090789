
# Dashboard Executivo COPSOQ II — Plano

Aplicação single-page em PT-BR, com dados mock realistas, estilo corporativo azul-marinho (inspirado na referência Lector), pronta para apresentação executiva e exportação de relatórios.

## Identidade visual
- Paleta: azul-marinho profundo (#0F2A4A) como cor primária, laranja (#F39200) como acento de ação, branco/cinza claro de fundo, semânticas verde/amarelo/vermelho para risco.
- Tipografia sans-serif limpa (Inter), hierarquia clara, cards com sombra suave e bordas arredondadas.
- Cabeçalho azul-marinho com logo "Psicossocial Analytics" e seletor de período + botões de exportação à direita.

## Estrutura da página (rolagem única)

**1. Header executivo**
- Título "Dashboard COPSOQ II — Análise Psicossocial"
- Período de referência + botões "Exportar PDF" e "Exportar Excel".

**2. Barra de filtros (sticky)**
- Período (mês/trimestre/ano), Departamento, Cargo, Tipo de vínculo, Unidade.
- Atualizam todos os componentes em tempo real (estado global via React).

**3. KPIs principais (4 cards)**
- Risco Psicossocial Geral (badge colorido: Baixo/Moderado/Alto)
- Taxa de Participação (%)
- Nível Médio de Estresse (escala 0–4)
- Índice de Engajamento (%)
- Cada card: valor grande, variação vs. período anterior (seta ↑↓ + cor), mini sparkline.

**4. Linha de gráficos principais (grid 2 colunas)**
- **Pizza/Donut**: distribuição de colaboradores por nível de risco (verde/amarelo/vermelho) com legenda e percentuais.
- **Barras horizontais**: dimensões COPSOQ ordenadas do maior risco para o menor (Exigências, Liderança, Reconhecimento, Carga, Autonomia, Suporte Social, Conflito Trabalho-Família, Saúde, etc.), barras coloridas por severidade com escala 0–4.

**5. Evolução temporal (largura total)**
- Gráfico de linha multi-série: risco geral + 2–3 dimensões críticas ao longo de 12 meses, com tooltip detalhado.

**6. Heatmap por área × dimensão**
- Tabela visual: linhas = departamentos, colunas = fatores psicossociais.
- Células coloridas em gradiente verde→amarelo→vermelho, valor numérico no centro, tooltip com contexto.
- Ordenação por criticidade (área mais crítica no topo).

**7. Insights automáticos (regras fixas)**
- Cards listando interpretações geradas por regras, ex.:
  - "🔴 Operações apresenta risco alto em Carga de Trabalho (3.4/4)"
  - "🟡 Taxa de participação de 38% em TI compromete confiabilidade"
  - "🔴 Reconhecimento crítico em 3 áreas — prioridade imediata"
- Cada insight com ícone de severidade, área impactada e indicador de prioridade.

**8. Recomendações práticas**
- Cards acionáveis vinculados aos fatores críticos detectados:
  - "Baixo Reconhecimento → implementar feedback estruturado mensal e programa de reconhecimento entre pares"
  - "Alta Carga de Trabalho → revisar distribuição de tarefas e dimensionamento da equipe"
  - "Conflito Trabalho-Família → política de horários flexíveis"
- Cada card mostra: fator, ação sugerida, área alvo, impacto esperado.

**9. Áreas críticas em destaque**
- Tabela ordenada por criticidade com badge de prioridade (Alta/Média/Baixa), botão para detalhar.

## Exportações

**PDF (multi-página)**
- Capa com título, período, logo
- Resumo executivo (3–4 parágrafos gerados das regras)
- KPIs
- Gráficos (pizza, barras, evolução)
- Heatmap
- Insights e recomendações
- Gerado client-side via jsPDF + html2canvas (captura das seções).

**Excel (.xlsx)**
- Aba 1: Resumo Geral (KPIs)
- Aba 2: Indicadores por Área
- Aba 3: Resultados por Dimensão
- Aba 4: Dados Brutos (respostas mock)
- Gerado via biblioteca SheetJS no navegador.

## Dados mock
- ~150 respondentes simulados, 8 departamentos, 5 cargos, 3 unidades, 12 meses de histórico.
- Todas as 8 dimensões principais do COPSOQ II com valores realistas.
- Calculados em runtime para refletir os filtros aplicados.

## Funcionalidades de UX
- Tooltips explicativos em todos os gráficos.
- Legendas claras com escala COPSOQ (0–4 ou Baixo/Moderado/Alto).
- Responsivo (desktop como prioridade, tablet/mobile com stack vertical).
- Animações sutis de entrada e transições de filtro.
- Destaque visual automático (borda colorida) em áreas críticas.
