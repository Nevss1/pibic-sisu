# CLAUDE.md — Dashboard SISU/UFMA

Este arquivo orienta agentes de IA (Claude Code e similares) a trabalhar neste repositório sem perder o contexto acadêmico, técnico e arquitetural do projeto.

---

## 1. Visão Geral do Projeto

**Nome:** Dashboard Analítico SISU/UFMA
**Versão:** 0.1.0 (MVP em desenvolvimento)

**Objetivo:** Oferecer uma plataforma web interativa para exploração histórica dos dados do SISU referentes à UFMA. Permite analisar concorrência, notas de corte, taxas de aprovação, composição por modalidade de cota e perfil de candidatos, por curso, campus e edição.

**Público-alvo:**
- Candidatos ao SISU que querem entender a competitividade dos cursos da UFMA
- Alunos e servidores da UFMA interessados em dados institucionais de ingresso
- O próprio pesquisador (Rafael Soares Britto Neves), como usuário e desenvolvedor do sistema

**Relação com o PIBIC:**
Este dashboard é o artefato central do projeto de Iniciação Científica. O pipeline de dados e o sistema web funcionam como o **caso de uso real de Ciência de Dados** que futuramente será conteinerizado e usado como workload para avaliação de desempenho em Docker — etapa ainda pendente.

---

## 2. Contexto Acadêmico

**Pesquisador:** Rafael Soares Britto Neves
**Curso:** Ciência da Computação — UFMA
**Programa:** PIBIC (Programa Institucional de Bolsas de Iniciação Científica) / CNPq
**Orientador:** Prof. Dr. Mário Antonio Meireles Teixeira
**Projeto CNPq vinculado:** "Avaliação de Desempenho de Aplicações em Ambientes Conteinerizados com Docker"

**Plano de trabalho oficial:**
> "Análise de Desempenho de Workloads de Ciência de Dados em Ambientes Conteinerizados com Docker"

**O que foi desenvolvido até agora:**
- Pipeline ETL de dados do SISU/UFMA (Bronze → Silver → Gold)
- Dashboard web analítico em Next.js

**O que ainda não foi implementado (etapa futura):**
- Contêinerização do pipeline e do dashboard com Docker
- Benchmarks de desempenho comparando execução local vs Docker
- Análise comparativa dos resultados para o relatório final

**Conexão entre as partes:**
O dashboard e o pipeline são resultados parciais concretos do PIBIC e constituem o workload real de Ciência de Dados que será avaliado em ambiente Docker. A fase de benchmarks Docker ainda não foi realizada. Ao redigir sobre o projeto:

- Descreva o dashboard como **resultado parcial concreto** e como **infraestrutura/workload real** para a etapa de avaliação de desempenho em Docker.
- Não descreva o dashboard como a única entrega final do PIBIC — ele é uma das entregas, não o fechamento do projeto.
- Não antecipe resultados de benchmarks que ainda não foram executados.

> O dashboard não deve ser descrito como a única entrega final do PIBIC. Ele é resultado parcial concreto e workload experimental — os benchmarks Docker constituem a etapa de avaliação ainda pendente.

---

## 3. Estado Atual do Desenvolvimento

### Implementado e funcional
- Pipeline ETL completo: CSV bruto → Silver (`silver_sisu_ufma`) → Gold (2 tabelas)
- Banco PostgreSQL no Neon com as 3 tabelas principais carregadas
- 11 rotas de API GET lendo o banco
- 7 hooks com TanStack React Query (cache, keepPreviousData, query keys compostas)
- Páginas: `/` (landing), `/cursos`, `/cursos/[curso]`, `/cursos/[curso]/areas`, `/cursos/[curso]/modalidades`, `/geral`, `/perfil`, `/informacao`
- Filtros de campus, ano e edição com contextos React
- Sistema de design coeso (paleta UFMA, tipografia, breakpoints responsivos)
- Migração para novo banco Neon com schema Silver unificado (2017–2023)
- Página `/sobre` informativa do projeto (fonte dos dados, privacidade, limitações, relação com o PIBIC)
- Pipeline documentado e versionado: `data_pipeline/requirements.txt` (deps com versões fixadas), `data_pipeline/schema.sql` (DDL documentacional) e os scripts `build_gold_overview.py` / `build_gold_modalidades.py` commitados

### Parcialmente implementado
- Filtro de edição (`EditionFilter`) existe mas não está integrado de forma consistente em todas as páginas
- `/api/cursos/overview` ainda consulta Silver diretamente em vez do Gold (inconsistente com `/api/cursos/[curso]/overview`)
- `taxa_efetivacao` existe no schema Gold mas não aparece em nenhuma visualização

### Pendente / não implementado
- `/conta` é placeholder vazio — fora do escopo atual; pode ser removida da navegação salvo decisão posterior
- Nenhum índice criado no banco — há índices recomendados (comentados) em `data_pipeline/schema.sql`, mas nenhum aplicado no Neon
- Nenhum teste automatizado (unitário ou E2E)
- Dockerfiles e docker-compose
- Benchmarks de desempenho
- Relatório final do PIBIC

> Nota: `data_pipeline/schema.sql` existe, mas é **documentacional** — descreve o schema inferido pelos scripts de upload; não é executado contra o banco e pode divergir dos tipos reais (ver avisos no próprio arquivo).

### Decisões já tomadas
- Usar arquitetura medalha: Silver (granular) + Gold (agregada) para separar dados brutos de dados prontos para visualização
- Criar tabelas Gold sob demanda, conforme novas visualizações forem necessárias
- Usar TanStack React Query para cache de estado do servidor no frontend
- Filtros de ano e campus são aplicados no frontend (dados carregados em bulk); filtro de edição é enviado como query param à API
- Categorias de modalidade são 6 atômicas: Ampla Concorrência, Bônus Maranhão, Escola Pública, PPI, Indígenas, PcD

---

## 4. Stack Técnica

### Frontend
| Tecnologia | Versão | Papel |
|---|---|---|
| Next.js | 16.0.7 | Framework (App Router) |
| React | 19.2.0 | UI |
| TypeScript | 5.x | Tipagem (strict mode) |
| Tailwind CSS | 4.0 | Utilitários de estilo |
| Material-UI | 7.3.8 | Componentes e tema |
| MUI X-Charts | 8.27.0 | Gráficos (bar, pie, radar) |
| Recharts | 3.7.0 | Gráficos de linha/compostos |
| Framer Motion | 12.23.26 | Animações |
| TanStack Query | 5.90.21 | Cache de estado do servidor |
| Axios | 1.13.6 | HTTP client |

### Backend / API
- Next.js API Routes (GET-only, read-only)
- `pg` (node-postgres) com pool de conexões
- SQL direto (sem ORM)

### Banco de Dados
- **Provedor:** Neon (PostgreSQL serverless, região AWS sa-east-1)
- **Conexão:** `DATABASE_URL` em `.env.local` (não commitado)
- **SSL:** `rejectUnauthorized: false` (necessário para Neon)
- **Pool:** `src/lib/db.ts`

### Pipeline de Dados
- Python + pandas + SQLAlchemy + numpy + psycopg2
- Scripts em `data_pipeline/`
- Execução manual local (sem agendador)

### Deploy
- Frontend: Vercel (inferido pelo README, não confirmado por config explícita)
- Banco: Neon
- Pipeline: local (sem CI/CD)

---

## 5. Arquitetura do Repositório

### Estrutura de Pastas

```
pibic-sisu/
├── src/
│   ├── app/
│   │   ├── api/                        # Rotas de API (server-side)
│   │   │   ├── areas/route.ts
│   │   │   ├── campus/route.ts
│   │   │   ├── candidatos/route.ts
│   │   │   ├── cursos/route.ts
│   │   │   ├── cursos/overview/route.ts
│   │   │   ├── cursos/[curso]/overview/route.ts
│   │   │   ├── cursos/[curso]/areas/route.ts
│   │   │   ├── cursos/[curso]/modalidades/route.ts
│   │   │   ├── modalidades/route.ts
│   │   │   ├── perfil/route.ts
│   │   │   └── perfil/opcoes/route.ts
│   │   ├── (pages)/                    # Páginas do dashboard
│   │   │   ├── layout.tsx              # Layout com sidebar + toolbar
│   │   │   ├── cursos/page.tsx
│   │   │   ├── cursos/[curso]/page.tsx
│   │   │   ├── cursos/[curso]/areas/page.tsx
│   │   │   ├── cursos/[curso]/modalidades/page.tsx
│   │   │   ├── geral/page.tsx
│   │   │   ├── perfil/page.tsx
│   │   │   ├── informacao/page.tsx
│   │   │   ├── conta/page.tsx          # Placeholder vazio
│   │   │   └── sobre/page.tsx          # Placeholder vazio
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Landing page
│   │   └── providers.tsx               # QueryClient + Tema MUI
│   ├── components/                     # Componentes compartilhados
│   │   ├── PageHeader.tsx              # Título + filtros (campus, ano, edição)
│   │   ├── CampusFilter.tsx
│   │   ├── YearFilter.tsx
│   │   └── EditionFilter.tsx
│   ├── features/                       # Lógica por domínio
│   │   ├── cursos/
│   │   │   ├── components/             # CursoOverviewCards, NotasHistogram, PieChart, CursoTabs
│   │   │   ├── contexts/               # CursoFilterContext
│   │   │   ├── areas/components/       # AreasCards, RadarAreaChart
│   │   │   ├── areas/contexts/         # AreasFilterContext
│   │   │   └── modalidades/components/ # ModalidadesCards
│   │   ├── geral/
│   │   │   ├── components/             # CandidatosBarChart (SVG), EvolucaoTemporalChart
│   │   │   └── contexts/               # GeralFilterContext
│   │   ├── perfil/
│   │   │   └── components/             # PerfilClient (formulário + tabela)
│   │   └── shared/contexts/            # YearFilterContext, CampusFilterContext
│   ├── hooks/                          # Hooks React Query
│   │   ├── useNomeCursos.ts
│   │   ├── useCandidatosCursos.ts
│   │   ├── useCursoOverview.ts
│   │   ├── useAreasNotasCurso.ts
│   │   ├── useAreasNotasUFMA.ts
│   │   ├── useModalidadesCurso.ts
│   │   └── useGeralOverview.ts
│   ├── lib/db.ts                       # Pool PostgreSQL
│   ├── types/sisu.ts                   # Interfaces TypeScript
│   ├── utils/
│   │   ├── fetchers.ts                 # Funções Axios para cada endpoint
│   │   └── utils.ts                    # toTitleCase (PT-BR aware)
│   ├── config/
│   │   ├── navigation.tsx              # NAV_ITEMS, ROUTE_LABELS
│   │   └── theme.ts                    # Tema MUI customizado
│   └── data/colunas.json               # Dicionário de dados SISU
├── data_pipeline/
│   ├── sisu_ufma_2017_2023.csv        # Dado bruto (343 MB, ~1.08M linhas)
│   ├── upload_silver.py               # CSV → silver_sisu_ufma
│   ├── build_gold_modalidades.py      # CSV → gold_modalidades (CSV intermediário)
│   ├── upload_gold_modalidades.py     # CSV → gold_modalidades_curso_ano_campus
│   ├── upload_gold_overview.py        # CSV → gold_overview_curso_ano_campus
│   └── .env                           # DATABASE_URL (não commitado)
├── CLAUDE.md
├── README.md
└── package.json
```

### Páginas Principais

| Rota | Arquivo | Estado |
|---|---|---|
| `/` | `app/page.tsx` | Funcional |
| `/cursos` | `app/(pages)/cursos/page.tsx` | Funcional |
| `/cursos/[curso]` | `app/(pages)/cursos/[curso]/page.tsx` | Funcional |
| `/cursos/[curso]/areas` | `app/(pages)/cursos/[curso]/areas/page.tsx` | Funcional |
| `/cursos/[curso]/modalidades` | `app/(pages)/cursos/[curso]/modalidades/page.tsx` | Funcional |
| `/geral` | `app/(pages)/geral/page.tsx` | Funcional |
| `/perfil` | `app/(pages)/perfil/page.tsx` | Funcional |
| `/informacao` | `app/(pages)/informacao/page.tsx` | Funcional |
| `/conta` | `app/(pages)/conta/page.tsx` | Fora do escopo atual |
| `/sobre` | `app/(pages)/sobre/page.tsx` | Funcional (página informativa) |

### Hooks e Fetchers

Cada hook usa TanStack Query e chama um fetcher de `src/utils/fetchers.ts`. A função `fetchDadosCurso(curso?, edicao?)` é reaproveitada por `useCursoOverview` e `useGeralOverview`, diferenciando-se apenas pela presença ou ausência do parâmetro `curso`.

| Hook | Endpoint | Tabela no banco |
|---|---|---|
| `useNomeCursos` | `/api/cursos` | `silver_sisu_ufma` |
| `useCandidatosCursos` | `/api/candidatos` | `silver_sisu_ufma` |
| `useCursoOverview` | `/api/cursos/[curso]/overview` | `gold_overview_curso_ano_campus` + `silver_sisu_ufma` |
| `useAreasNotasCurso` | `/api/cursos/[curso]/areas` | `silver_sisu_ufma` |
| `useAreasNotasUFMA` | `/api/areas` | `silver_sisu_ufma` |
| `useModalidadesCurso` | `/api/cursos/[curso]/modalidades` | `gold_modalidades_curso_ano_campus` |
| `useGeralOverview` | `/api/cursos/overview` | `silver_sisu_ufma` |

### Rotas de API

Todas as rotas são GET, read-only, e usam `pool.query()` com queries SQL parametrizadas.

| Rota | Tabela(s) | Observação |
|---|---|---|
| `GET /api/cursos` | Silver | Lista cursos distintos |
| `GET /api/candidatos` | Silver | Carrega todos os cursos de uma vez (bulk) |
| `GET /api/campus` | Silver | Lista campuses com contagem de cursos |
| `GET /api/areas` | Silver | Médias UFMA por área do ENEM |
| `GET /api/modalidades` | Silver | Breakdown por `grupo_concorrencia` × ano |
| `GET /api/cursos/overview` | Silver | Overview geral — consulta Silver, não Gold |
| `GET /api/cursos/[curso]/overview` | Gold overview + Silver | Dois queries paralelos + join em JS |
| `GET /api/cursos/[curso]/areas` | Silver | Médias por área para o curso |
| `GET /api/cursos/[curso]/modalidades` | Gold modalidades | Breakdown por categoria |
| `GET /api/perfil` | Silver | Query dinâmica com filtros opcionais |
| `GET /api/perfil/opcoes` | Silver | Opções de filtro para o formulário |

### Tipos TypeScript (`src/types/sisu.ts`)

```typescript
DadoOverviewCurso   // edicao, ano, campus, total_inscritos, aprovados, notas[], médias, gênero, taxa
DadoAreasCurso      // edicao, ano, campus, media_matematica, media_linguagens, media_humanas, media_natureza, media_redacao
DadoModalidadesCurso // edicao, categoria, ano, campus, total_candidatos, aprovados, media_nota
OverviewCurso       // DadoOverviewCurso[]
AreasCurso          // DadoAreasCurso[]
ModalidadesCurso    // DadoModalidadesCurso[]
```

---

## 6. Pipeline de Dados

### Bronze
- **Formato:** CSV bruto (`data_pipeline/sisu_ufma_2017_2023.csv`)
- **Tamanho:** 343 MB, ~1.08 milhão de linhas
- **Origem:** Dados abertos MEC/SISU, edições 2017–2023 (14 edições)
- **Não há tabela Bronze no banco** — o CSV é a camada Bronze

### Silver — `silver_sisu_ufma`
- **Granularidade:** 1 linha por candidato/inscrição
- **Colunas:** ~31, incluindo ano, edicao, nome_campus, nome_curso, grau, turno, notas por área, nota_candidato, nota_corte, aprovado, matricula, sexo, grupo_concorrencia, subgrupo_cota
- **Script de carga:** `upload_silver.py` (pandas `to_sql`, replace, chunks de 1000)
- **Colunas derivadas chave** (não vêm do MEC, foram construídas):
  - `GRUPO_CONCORRENCIA`: `AC` | `BONUS_MA` | `COTA`
  - `SUBGRUPO_COTA`: `SOCIAL` | `PP` | `I` | `D` | `DD` | `PPD`

### Gold — `gold_overview_curso_ano_campus`
- **Granularidade esperada:** (edicao, ano, nome_campus, nome_curso) — possivelmente também `grau` e `turno`; confirmar no `upload_gold_overview.py` antes de alterar queries
- **Conteúdo:** total_candidatos, total_aprovados, total_efetivadas, médias, min/max de notas, inscritos por gênero, taxas de aprovação e efetivação
- **Build:** `build_gold_overview.py` (presente no repositório — `data_pipeline/build_gold_overview.py`)
- **Carga:** `upload_gold_overview.py` (lê CSV pré-computado gerado pelo script acima)

### Gold — `gold_modalidades_curso_ano_campus`
- **Granularidade:** (edicao, ano, nome_campus, nome_curso, categoria)
- **Categorias atômicas (6):** Ampla Concorrência, Bônus Maranhão, Escola Pública, PPI, Indígenas, PcD
- **Conteúdo:** total_candidatos, total_aprovados, media_nota, taxa_aprovacao
- **Build:** `build_gold_modalidades.py` (lê CSV bruto, não o banco Silver — acoplamento frágil)
- **Carga:** `upload_gold_modalidades.py`

### Estratégia de Criação de Gold
Novas tabelas Gold são criadas **sob demanda**, conforme novas visualizações forem necessárias. Não há um processo automatizado — cada nova Gold requer:
1. Script Python de agregação (análogo a `build_gold_modalidades.py`)
2. Script de upload (análogo a `upload_gold_modalidades.py`)
3. Nova rota de API em `src/app/api/`
4. Novo hook em `src/hooks/`
5. Novo fetcher em `src/utils/fetchers.ts`

---

## 7. Regras Importantes sobre os Dados

Estas regras devem ser observadas antes de criar qualquer nova métrica, visualização ou query.

### Terminologia correta
- **Inscrito / candidato:** No contexto deste dataset, cada linha da Silver representa uma inscrição de um candidato em um curso. Um mesmo candidato pode ter se inscrito em até 2 opções (OPCAO = 1 ou 2). **Não confunda "total de inscrições" com "total de candidatos únicos"** — o projeto usa "inscritos" para referir-se a linhas (inscrições), não CPFs únicos.
- **Aprovado/Convocado:** `APROVADO = 'S'` significa que o candidato foi aprovado/convocado naquela inscrição. Este é o campo correto para calcular taxa de aprovação.
- **Matrícula efetivada:** `MATRICULA = 'EFETIVADA'` é um **subconjunto dos aprovados** — representa quem efetivou a matrícula após ser convocado. Não é sinônimo de aprovado.
- **Nota de corte:** `NOTA_CORTE` é a nota mínima para aprovação naquela modalidade/curso naquele ano. Candidatos com `NOTA_CANDIDATO >= NOTA_CORTE` tendem a ser aprovados, mas o campo `APROVADO` é a fonte de verdade.

### Colunas derivadas
`GRUPO_CONCORRENCIA` e `SUBGRUPO_COTA` são colunas **calculadas durante o processamento**, não campos originais do MEC. Qualquer lógica que precise categorizar modalidades deve usar essas colunas ou o mapeamento já definido:

```
AC                        → Ampla Concorrência
BONUS_MA                  → Bônus Maranhão
COTA + SOCIAL             → Escola Pública
COTA + PP                 → PPI (Preto, Pardo, Indígena)
COTA + I                  → Indígenas
COTA + D / DD / PPD       → PcD (Pessoa com Deficiência)
```

### Validação obrigatória
Qualquer nova métrica ou agregação deve ser validada contra os totais do Silver antes de entrar em produção. Exemplo: a soma de candidatos por categoria no Gold modalidades deve bater com o total de candidatos no Silver para o mesmo curso/ano/campus.

### O que não fazer
- Nunca inventar nomes de colunas ou tabelas que não existam no banco
- Nunca assumir que uma coluna existe sem verificar o schema ou os scripts de carga
- Não usar `MATRICULA` como proxy de aprovação — use `APROVADO`
- Não somar inscrições de opção 1 e opção 2 como se fossem candidatos distintos sem checar a lógica de negócio esperada

---

## 8. Convenções de Implementação

### API
- Todas as rotas são GET, sem autenticação, read-only
- Usar queries SQL parametrizadas (`$1`, `$2`) — nunca interpolação de string
- Filtro de edição é passado como query param `?edicao=1` e tratado com `($n::int IS NULL OR edicao = $n::int)`
- Usar `pool.query()` de `src/lib/db.ts` — não criar novas conexões

### Frontend
- Preservar os contratos dos hooks existentes ao refatorar APIs
- Novos hooks devem seguir o padrão: `useQuery({ queryKey: [...], queryFn: ..., placeholderData: keepPreviousData })`
- Novos fetchers vão em `src/utils/fetchers.ts`
- Novos tipos vão em `src/types/sisu.ts`
- Filtros de campus e ano são gerenciados via Context (`useCampusFilter()`, `useYearFilter()`) — não criar state local paralelo

### Estilo e componentes
- UI base: Material-UI com sx prop — não misturar com Tailwind em um mesmo elemento
- Tailwind é usado apenas para utilitários globais e layout de página
- Breakpoints customizados: `mobile (390px)`, `tabletSmall (600px)`, `tablet (960px)`, `laptop (1280px)`
- Paleta: fundo `#FEF9F6`, dourado `#D5B071`, marrom `#ae8f58`

### Mudanças
- Preferir mudanças incrementais a refactors grandes
- Antes de alterar uma rota de API, verificar quais hooks e componentes a consomem
- Antes de alterar um hook, verificar quais páginas o usam
- Validar `npm run build` após mudanças significativas (TypeScript com `ignoreBuildErrors: true` no next.config — não confiar nisso como garantia)

---

## 9. Direção Atual do Projeto

Prioridades em ordem:

1. **Finalizar o app web** — cobrir os casos de uso previstos, corrigir inconsistências de API (ex: `/api/cursos/overview` ainda usa Silver)
2. **Melhorar UX / mobile-first** — `CandidatosBarChart` (SVG custom) não funciona bem em mobile; radar chart perde legibilidade abaixo de 500px
3. **Documentar pipeline e arquitetura** — `build_gold_overview.py` e `schema.sql` (DDL documentacional) já commitados; falta validar tipos reais e aplicar índices no banco
4. **Iniciar relatório final do PIBIC** — documentar o pipeline como workload de Ciência de Dados; descrever o dashboard como artefato de análise
5. **Planejar integração Docker / workloads** — Dockerfiles para Next.js e Python; docker-compose; definição de métricas de benchmark

---

## 10. Instruções para Agentes de IA

Ao trabalhar neste repositório, siga estas diretrizes:

### Antes de qualquer alteração
- Audite os arquivos relevantes antes de propor mudanças
- Identifique quais outros arquivos serão impactados (downstream: hooks → fetchers → API → banco)
- Verifique se a tabela ou coluna que você pretende usar realmente existe no schema (consulte os scripts de upload em `data_pipeline/`)

### Ao planejar
- Apresente o plano antes de executar mudanças grandes
- Diferencie claramente o que está **implementado**, o que está **planejado** e o que está **pendente**
- Nunca invente dados acadêmicos (orientador, número do projeto, resultados de benchmark, etc.)

### Ao implementar
- Faça mudanças incrementais — uma coisa de cada vez
- Preserve os contratos de API e hooks existentes quando possível
- Se precisar quebrar um contrato existente, sinalize explicitamente e liste todos os lugares afetados

### Ao comunicar
- Mantenha respostas objetivas e rastreáveis — cite arquivos e linhas quando relevante
- Se faltar informação para completar uma tarefa, pergunte antes de assumir
- Quando algo for incerto (ex: comportamento não documentado, schema não confirmado), sinalize como "a confirmar" em vez de inventar

### Contexto acadêmico
- O projeto é um PIBIC — as decisões de produto devem levar em conta o que é defensável num relatório técnico-científico
- Docker e benchmarks são etapas futuras — não antecipe implementações dessa área sem instrução explícita
- Orientador: Prof. Dr. Mário Antonio Meireles Teixeira; Projeto CNPq: "Avaliação de Desempenho de Aplicações em Ambientes Conteinerizados com Docker" — não inventar outros dados acadêmicos

---

## 11. Plano Mínimo de Benchmark Docker

**Status: planejado — Docker ainda não foi implementado neste repositório.**

Não existe Dockerfile, docker-compose nem resultado de benchmark até o momento. Esta seção descreve o escopo mínimo planejado para a etapa experimental.

**Benchmark inicial recomendado:** começar pelo caminho **compute sem banco** — `build_gold_overview.py` (e, comparativamente, `build_gold_modalidades.py`): CSV Bronze → pandas (`read_csv` → `groupby`/`agg`) → CSV Gold. É determinístico, reproduzível e independe do Neon. Os scripts `upload_*` (que dependem do banco e usam `if_exists="replace"`) ficam para uma fase posterior, com PostgreSQL local em contêiner — nunca apontando para o Neon de produção.

### Escopo mínimo planejado

| Etapa | Descrição | Status |
|---|---|---|
| ETL local sem Docker | Executar `upload_silver.py` + Gold scripts em ambiente local | A executar |
| ETL com Docker | Executar os mesmos scripts dentro de contêiner Docker | A implementar |
| Comparação de tempo | Medir tempo de execução end-to-end (local vs Docker) | A executar |
| Coleta de CPU/RAM | Monitorar consumo de recursos durante execução (ex: `docker stats`) | A executar |
| Limites de recursos (opcional) | Testar com restrições simples de CPU/RAM via `--cpus` e `--memory` | A definir |
| Silver vs Gold (opcional) | Comparar tempo de queries diretas na Silver vs tabelas Gold | A definir |

### Regras para esta etapa
- Não criar matriz experimental grande (múltiplos cenários cruzados) sem validação prévia do pesquisador
- Não escrever resultados, métricas ou conclusões no relatório antes de executar os testes reais
- Toda afirmação de desempenho deve ser rastreável a uma execução real, com log ou print de saída

---

## 12. Comandos Úteis

### Frontend

```bash
npm install           # instalar dependências
npm run dev           # servidor de desenvolvimento (http://localhost:3000)
npm run build         # build de produção
npm run start         # servir o build de produção
npm run lint          # lint com eslint (script presente em package.json)
```

### Pipeline de Dados

> **Confirmar antes de executar** — o `DATABASE_URL` deve estar em `data_pipeline/.env` (necessário apenas para os scripts `upload_*`; os `build_*` não acessam o banco).
> `requirements.txt` já existe em `data_pipeline/`, com versões fixadas.

```bash
cd data_pipeline
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt   # deps com versões fixadas
python upload_silver.py           # carrega CSV bruto → silver_sisu_ufma
python build_gold_modalidades.py  # agrega modalidades → CSV intermediário
python upload_gold_modalidades.py # CSV → gold_modalidades_curso_ano_campus
python build_gold_overview.py     # agrega overview → CSV intermediário
python upload_gold_overview.py    # CSV → gold_overview_curso_ano_campus
```

Scripts presentes em `data_pipeline/` (verificado): `upload_silver.py`, `build_gold_modalidades.py`, `upload_gold_modalidades.py`, `build_gold_overview.py`, `upload_gold_overview.py`.
