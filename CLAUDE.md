# CLAUDE.md

## Projeto
Dashboard analítico do SISU/UFMA, com foco em análise histórica de cursos, concorrência, notas, aprovações e matrículas.

## Objetivo
Permitir exploração analítica dos dados históricos do SISU da UFMA para apoiar entendimento de competitividade, tendências e perfis de ingresso.

## Stack
- Frontend: Next.js / React
- Visualização: gráficos e dashboards
- Dados: pipeline em Python / pandas
- Banco: PostgreSQL
- Deploy: Vercel

## Estado atual
O projeto já existe e foi inicialmente construído sobre um dataset antigo, com cálculos derivados espalhados no código.

Agora foi construída uma nova camada Silver consolidada, cobrindo 2017–2023, com schema unificado e colunas derivadas novas, como:
- GRUPO_CONCORRENCIA
- SUBGRUPO_COTA

Essa nova modelagem substitui a estrutura anterior e deve orientar a próxima fase de refatoração.

## Situação dos dados
Existe agora uma base histórica consolidada com uma linha por inscrição/opção de curso, contendo informações padronizadas de:
- ano
- edição
- curso
- campus
- notas
- aprovação
- matrícula
- concorrência
- subgrupo de cota

## Próxima etapa
A próxima fase do projeto é construir uma camada Gold com tabelas agregadas para alimentar o dashboard, reduzir cálculos em runtime e alinhar o sistema à nova modelagem de dados.

## Questões importantes
- O projeto antigo dependia de um schema diferente.
- Pode ser necessário refatorar queries, hooks, componentes e lógica de agregação.
- A coluna EDICAO agora existe e pode exigir decisão de produto sobre filtro por edição/semestre.
- A prioridade é preservar a utilidade do dashboard enquanto se adapta o sistema à nova base Silver.