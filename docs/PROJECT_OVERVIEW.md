# Visão Geral do Projeto — Dashboard SISU/UFMA

---

## 1. Resumo

O Dashboard SISU/UFMA é uma plataforma web analítica desenvolvida para tornar acessíveis os dados históricos de inscrições do Sistema de Seleção Unificada (SISU) referentes à Universidade Federal do Maranhão (UFMA). A partir de dados públicos do Ministério da Educação (MEC), o projeto organiza as informações em um pipeline ETL Python/Pandas, armazena os resultados em PostgreSQL e os expõe por meio de um dashboard interativo em Next.js com visualizações por curso, campus, modalidade de cota e perfil de candidatos.

O projeto é composto por dois artefatos principais: (1) o pipeline de dados, que vai do CSV bruto à tabelas estruturadas no banco, e (2) o dashboard web, que consome essas tabelas e apresenta análises interativas. Ambos são resultado parcial concreto do trabalho de Iniciação Científica e constituem o workload real de Ciência de Dados que será submetido à avaliação de desempenho em ambiente Docker na etapa experimental ainda pendente.

---

## 2. Contexto acadêmico

| Atributo | Valor |
|---|---|
| **Pesquisador** | Rafael Soares Britto Neves |
| **Curso** | Ciência da Computação — Universidade Federal do Maranhão (UFMA) |
| **Orientador** | Prof. Dr. Mário Antonio Meireles Teixeira |
| **Programa** | PIBIC — Programa Institucional de Bolsas de Iniciação Científica / CNPq |
| **Projeto CNPq vinculado** | "Avaliação de Desempenho de Aplicações em Ambientes Conteinerizados com Docker" |
| **Plano de trabalho** | "Análise de Desempenho de Workloads de Ciência de Dados em Ambientes Conteinerizados com Docker" |

O dashboard e o pipeline de dados são **resultados parciais concretos** do PIBIC. Eles constituem também o **workload real de Ciência de Dados** que será avaliado em ambiente Docker na etapa experimental prevista para a fase final do projeto. Os benchmarks de desempenho com Docker **ainda não foram executados** — esta etapa permanece como trabalho futuro.

Ao citar o projeto, é importante diferenciar:

- **Produto web:** funcionalmente pronto no escopo atual — o dashboard está operacional, com todas as páginas previstas implementadas, visualizações, filtros e responsividade mobile ajustados.
- **Pipeline ETL:** concluído para o escopo atual (Bronze → Silver → Gold para as visualizações implementadas).
- **Etapa experimental Docker:** planejada, mas não iniciada — nenhum Dockerfile, docker-compose ou resultado de benchmark existe até o momento.

---

## 3. Problema abordado

Os microdados do SISU são disponibilizados anualmente pelo MEC em formato CSV, com granularidade de inscrição individual. Embora sejam dados públicos e oficiais, sua análise direta requer esforço considerável: os arquivos são volumosos (centenas de megabytes por edição), as colunas estão em formato bruto sem padronização entre edições, e não existe uma ferramenta consolidada que permita explorar o histórico de desempenho de cursos específicos de uma instituição.

No caso da UFMA em particular, não havia até o início deste projeto nenhuma plataforma que permitisse a estudantes, pesquisadores ou gestores responder perguntas como: *Qual foi a nota de corte de Medicina ao longo dos últimos seis anos? Qual curso tem a maior taxa de aprovação por cotas? Como se distribui o perfil de candidatos por faixa etária e gênero?*

O projeto endereça esse problema por três frentes:
1. **Pipeline ETL** — consolida, limpa e padroniza os dados de 14 edições do SISU (2017–2023) referentes à UFMA em um banco PostgreSQL estruturado.
2. **Tabelas Gold** — pré-agrega as métricas mais consultadas para tornar as consultas do dashboard eficientes.
3. **Dashboard web** — expõe as análises de forma interativa, com filtros por curso, campus, ano e edição.

---

## 4. Fonte e recorte dos dados

| Atributo | Descrição |
|---|---|
| **Origem** | Dados abertos do Ministério da Educação (MEC) — microdados do SISU |
| **URL de referência** | [dadosabertos.mec.gov.br/sisu](https://dadosabertos.mec.gov.br/sisu) |
| **Formato** | CSV (chamadas regulares por edição) |
| **Recorte temporal** | Edições de 2017 a 2023 — 14 edições no total (geralmente 2 por ano) |
| **Recorte institucional** | Filtrado para cursos ofertados pela UFMA |
| **Forma de consolidação** | Download manual dos microdados; concatenação em arquivo único |
| **Periodicidade** | Dados históricos estáticos — sem atualização automática |

O arquivo consolidado `sisu_ufma_2017_2023.csv` tem aproximadamente 343 MB e 1.080.713 linhas. Os dados de **2024 não estão incluídos** nesta versão do projeto.

---

## 5. Tratamento e privacidade

Os microdados originais do SISU podem conter colunas identificadoras. O pipeline foi construído com as seguintes premissas:

- **CPF**, **nome do candidato** e **número de inscrição no ENEM** não devem aparecer na camada Silver nem nas tabelas Gold armazenadas no banco.
- O dashboard consome exclusivamente dados analíticos e agregáveis — nenhum dado individual identificável é exposto.
- Quaisquer colunas identificadoras presentes no CSV Bronze devem ser removidas antes da carga na Silver.

### Distinções conceituais importantes

| Conceito | Definição |
|---|---|
| **Inscrição / candidato** | Cada linha da Silver representa uma inscrição em uma opção de curso. Um mesmo candidato pode aparecer em até duas linhas (opção 1 e opção 2). "Total de inscritos" refere-se a linhas, não a CPFs únicos. |
| **Aprovado** | `aprovado = 'S'` — candidato convocado para matrícula. É a fonte de verdade para calcular taxa de aprovação. |
| **Efetivação** | `matricula = 'EFETIVADA'` — subconjunto dos aprovados que concluíram o processo de matrícula. Não é sinônimo de aprovado. |
| **Nota de corte** | `nota_corte` — nota mínima para aprovação na modalidade/curso/edição. O campo `aprovado` é a fonte de verdade; a comparação direta com `nota_corte` não é suficiente. |

---

## 6. Arquitetura de dados

O pipeline segue a **arquitetura medalha** (Bronze → Silver → Gold), padrão amplamente utilizado em engenharia de dados para separar responsabilidades de cada camada.

### Bronze

- **Forma:** arquivo CSV local (`sisu_ufma_2017_2023.csv`)
- **Conteúdo:** dado bruto, próximo do original do MEC, sem transformações significativas
- **Tamanho:** ~343 MB, ~1.080.713 linhas
- **Observação:** não há tabela Bronze no banco — o arquivo CSV é a própria camada Bronze; está listado no `.gitignore` e não é versionado

### Silver — `silver_sisu_ufma`

- **Script de carga:** `upload_silver.py`
- **Granularidade:** uma linha por inscrição/opção de curso
- **Colunas principais:** `ano`, `edicao`, `nome_campus`, `nome_curso`, `grau`, `turno`, notas por área do ENEM, `nota_candidato`, `nota_corte`, `aprovado`, `matricula`, `sexo`, `dt_nascimento`, `opcao`, `grupo_concorrencia`, `subgrupo_cota`
- **Colunas derivadas** (não vêm do MEC):
  - `grupo_concorrencia`: `AC` | `BONUS_MA` | `COTA`
  - `subgrupo_cota`: `SOCIAL` | `PP` | `I` | `D` | `DD` | `PPD`
- **Mecanismo de carga:** `pandas.to_sql`, `if_exists="replace"`, chunks de 1000 linhas
- **Linhas esperadas:** ~1.080.713

### Gold — `gold_overview_curso_ano_campus`

- **Scripts:** `build_gold_overview.py` → `upload_gold_overview.py`
- **Granularidade:** `(ano, edicao, codigo_campus, nome_campus, municipio_campus, codigo_curso, nome_curso, grau, turno)`
- **Métricas:** total de candidatos, aprovados e efetivações; médias, mínimos e máximos de nota; distribuição por gênero; taxas de aprovação e efetivação
- **Alimenta:** endpoints `/api/cursos/[curso]/overview` e, indiretamente, a maior parte das páginas de curso

### Gold — `gold_modalidades_curso_ano_campus`

- **Scripts:** `build_gold_modalidades.py` → `upload_gold_modalidades.py`
- **Granularidade:** `(ano, edicao, codigo_campus, nome_campus, municipio_campus, codigo_curso, nome_curso, grau, turno, categoria)`
- **Categorias (6, sem sobreposição):**

  | Categoria | Critério |
  |---|---|
  | Ampla concorrência | `grupo_concorrencia = 'AC'` |
  | Bônus Maranhão | `grupo_concorrencia = 'BONUS_MA'` |
  | Escola pública | `grupo_concorrencia = 'COTA'` e `subgrupo_cota = 'SOCIAL'` |
  | PPI | `grupo_concorrencia = 'COTA'` e `subgrupo_cota = 'PP'` |
  | Indígenas | `grupo_concorrencia = 'COTA'` e `subgrupo_cota = 'I'` |
  | PcD | `grupo_concorrencia = 'COTA'` e `subgrupo_cota in ('D', 'DD', 'PPD')` |

- **Métricas:** total de candidatos, aprovados, média de nota, taxa de aprovação
- **Alimenta:** endpoints `/api/cursos/[curso]/modalidades`

### Mapeamento tabelas → dashboard

| Tabela | Camada | Alimenta |
|---|---|---|
| `silver_sisu_ufma` | Silver | `/api/cursos`, `/api/campus`, `/api/areas`, `/api/perfil`, `/api/perfil/opcoes`, `/api/faixas-etarias`, `/api/cursos/overview`, `/api/cursos/[curso]/areas` |
| `gold_overview_curso_ano_campus` | Gold | `/api/cursos/[curso]/overview` (bins de histograma calculados no backend a partir dos dados agregados), `/api/candidatos` |
| `gold_modalidades_curso_ano_campus` | Gold | `/api/cursos/[curso]/modalidades` |

---

## 7. Arquitetura da aplicação web

### Stack

| Camada | Tecnologia | Versão | Papel |
|---|---|---|---|
| Framework | Next.js (App Router) | 15.x | Roteamento, SSR, API Routes |
| UI | React | 19.x | Componentes e estado |
| Tipagem | TypeScript (strict) | 5.x | Segurança de tipos em toda a aplicação |
| Estilo base | Material-UI (MUI) | 7.x | Componentes e tema customizado |
| Utilitários CSS | Tailwind CSS | 4.x | Layout e utilitários globais |
| Gráficos | MUI X-Charts | 8.x | Barras, pizza, radar |
| Gráficos | Recharts | 3.x | Linhas e compostos temporais |
| Animações | Framer Motion | 12.x | Transições de UI |
| Cache de dados | TanStack Query (React Query) | 5.x | Estado do servidor, cache, `keepPreviousData` |
| HTTP client | Axios | 1.x | Requisições às API Routes |
| Banco de dados | PostgreSQL (Neon serverless) | — | Armazenamento das tabelas Silver e Gold |
| Driver DB | `pg` (node-postgres) | — | Pool de conexões nas API Routes |

### Padrão de dados no frontend

O frontend segue um padrão consistente: cada visualização tem um **hook React Query** que chama um **fetcher Axios** que acessa uma **API Route** que executa SQL parametrizado no banco. Os filtros de campus e ano são gerenciados via Context e aplicados no frontend (dados carregados em bulk); o filtro de edição é enviado como query param à API.

```
Contexto (campus, ano, edição)
  → Hook (TanStack Query + fetcher)
    → API Route (SQL parametrizado → pool PostgreSQL)
      → Banco Neon
```

### Organização do código

```
src/
├── app/api/           # API Routes (GET-only, SQL direto)
├── app/(pages)/       # Páginas do dashboard
├── features/          # Lógica e componentes por domínio
│   ├── cursos/        # Componentes, contexts, areas/, modalidades/
│   ├── geral/         # Componentes e contexts de visão geral
│   ├── perfil/        # Formulário de perfil e tabela de resultados
│   └── shared/        # Contexts compartilhados (campus, ano)
├── hooks/             # Hooks React Query
├── utils/fetchers.ts  # Funções Axios por endpoint
├── types/sisu.ts      # Interfaces TypeScript
├── lib/db.ts          # Pool PostgreSQL
└── config/            # Tema MUI, navegação, estilos compartilhados
```

---

## 8. Páginas e funcionalidades

| Rota | Objetivo | Principais visualizações | Dados usados |
|---|---|---|---|
| `/` | Landing page — apresentação e acesso rápido | Cards de destaque, links para seções | Estático |
| `/cursos` | Lista todos os cursos da UFMA com ranking de candidatos | Gráfico de barras SVG de candidatos por curso, filtro de campus | `silver_sisu_ufma` |
| `/cursos/[curso]` | Overview histórico de um curso específico | KPIs (candidatos, aprovados, taxas), nota de corte temporal, histograma de notas, gênero | Gold overview + Silver |
| `/cursos/[curso]/areas` | Desempenho do curso por área do ENEM | Radar comparativo (curso vs UFMA), cards por área, gráfico de diferença | Silver |
| `/cursos/[curso]/modalidades` | Análise de cotas e modalidades de concorrência | Cards por categoria, aprovação por modalidade temporal, taxa de aprovação por modalidade | Gold modalidades |
| `/geral` | Visão agregada de todos os cursos da UFMA | Gráfico de candidatos por curso (SVG), evolução temporal geral, faixas etárias, ranking de aprovação | Silver |
| `/perfil` | Busca de perfil histórico por filtros | Formulário com múltiplos filtros, tabela de resultados, gráfico de perfil temporal | Silver |
| `/informacao` | Dicionário de dados do SISU | Cards por campo com nome, tipo e descrição | JSON local (`colunas.json`) |
| `/sobre` | Informações sobre o projeto | Conteúdo informativo sobre o projeto PIBIC | Estático |

A rota `/conta` existe como placeholder e está fora do escopo atual.

---

## 9. Principais visualizações

| Visualização | Componente | Página(s) |
|---|---|---|
| KPIs / cards de overview | `CursoOverviewCards` | `/cursos/[curso]` |
| Nota de corte ao longo do tempo | `NotaCorteTemporalChart` | `/cursos/[curso]` |
| Histograma de notas dos candidatos (bins pré-computados no backend) | `NotasHistogram` | `/cursos/[curso]` |
| Aprovação por gênero (temporal) | `GeneroAprovacaoTemporalChart` | `/cursos/[curso]` |
| Pizza de distribuição por gênero | `PieChart` | `/cursos/[curso]` |
| Radar de áreas do ENEM (curso vs UFMA) | `RadarAreaChart` | `/cursos/[curso]/areas` |
| Gráfico de diferença por área | `AreasDifferenceChart` | `/cursos/[curso]/areas` |
| Cards por área do ENEM | `AreasCards` | `/cursos/[curso]/areas` |
| Cards por modalidade/cota | `ModalidadesCards` | `/cursos/[curso]/modalidades` |
| Taxa de aprovação por modalidade (temporal) | `ModalidadesTemporalChart` | `/cursos/[curso]/modalidades` |
| Aprovação por modalidade (barras) | `ModalidadesApprovalRateChart` | `/cursos/[curso]/modalidades` |
| Ranking de aprovação por curso | `TaxaAprovacaoRanking` | `/geral` |
| Candidatos por curso (barras SVG) | `CandidatosChart` | `/cursos`, `/geral` |
| Evolução temporal geral | `EvolucaoTemporalChart` | `/geral` |
| Faixas etárias | `FaixasEtariasChart` | `/geral` |
| Perfil histórico (tabela + gráfico) | `PerfilClient`, `PerfilTemporalChart` | `/perfil` |
| Dicionário de dados | (componente inline) | `/informacao` |

---

## 10. Estado atual do projeto

### Implementado e funcional

- Pipeline ETL completo: CSV bruto → Silver → Gold (overview e modalidades)
- Banco PostgreSQL no Neon com as três tabelas principais carregadas
- 11 rotas de API GET lendo o banco com SQL parametrizado
- 10 hooks com TanStack React Query (cache, `keepPreviousData`, query keys compostas)
- **Dashboard web funcionalmente pronto no escopo atual** — todas as páginas previstas implementadas
- Páginas funcionais: `/`, `/cursos`, `/cursos/[curso]`, `/cursos/[curso]/areas`, `/cursos/[curso]/modalidades`, `/geral`, `/perfil`, `/informacao`, `/sobre`
- Filtros de campus, ano e edição com contextos React
- Sistema de design coeso: paleta UFMA, tipografia, breakpoints responsivos (mobile 390px → laptop 1280px)
- Layout responsivo com sidebar e toolbar
- `data_pipeline/requirements.txt`, `data_pipeline/README.md` e `data_pipeline/schema.sql` documentados e commitados

### Parcialmente implementado / melhorável

- Filtro de edição (`EditionFilter`) existe, mas não está integrado de forma consistente em todas as páginas
- `/api/cursos/overview` ainda consulta Silver diretamente (o `ARRAY_AGG` pesado foi removido, mas não houve migração para Gold — inconsistente com `/api/cursos/[curso]/overview`, que usa Gold)
- `CandidatosChart` (SVG customizado) tem limitações de legibilidade em telas mobile muito estreitas
- Schema DDL em `schema.sql` é documentacional/sugerido — tipos reais no banco Neon podem divergir (colunas numéricas provavelmente FLOAT8 via `pandas.to_sql`)
- Nenhum índice criado nas tabelas (criadas via `pandas.to_sql` sem `CREATE INDEX`)

### Pendente

- Dockerfiles e docker-compose (etapa experimental do PIBIC)
- Benchmarks de desempenho (local vs Docker)
- Relatório final do PIBIC
- Validação dos tipos reais no banco Neon (confrontar `schema.sql` com `information_schema.columns`)
- Criação de índices reais no banco (candidatos: `LOWER(nome_curso)`, `nome_campus`, `ano`, `edicao`)
- Inclusão de dados de 2024

---

## 11. Relação com Docker e workloads

O pipeline ETL é o **workload central de Ciência de Dados** deste projeto de PIBIC. Ele processa ~1,08 milhão de linhas de dados tabulares, realiza transformações com Pandas e executa carga em banco PostgreSQL — características representativas de workloads reais de Ciência de Dados que podem ser avaliados em termos de tempo de execução e consumo de recursos.

O dashboard web e suas API Routes constituem um segundo artefato do workload: cargas de leitura estruturada com queries SQL sobre tabelas de diferentes granularidades (Silver com ~1M linhas vs Gold com centenas de linhas pré-agregadas).

### Estado atual da integração com Docker

**Nenhum Dockerfile, docker-compose ou benchmark existe neste repositório até o momento.**

### Etapas planejadas (não implementadas)

| Etapa | Descrição | Estado |
|---|---|---|
| Dockerfile para Python | Conteinerizar o pipeline ETL | Planejado |
| docker-compose | Orquestrar pipeline + banco local | Planejado |
| Benchmark local | Medir tempo de execução e consumo de recursos sem Docker | A executar |
| Benchmark Docker | Mesma medição dentro de contêiner | A executar |
| Restrições de recursos (opcional) | Testar com `--cpus` e `--memory` | A definir |
| Comparação Silver vs Gold | Comparar tempo de queries diretas | A definir |
| Análise comparativa | Compilar resultados para o relatório final | A executar |

A comparação prevista é: execução do pipeline em ambiente local sem Docker versus execução dentro de contêiner Docker, medindo tempo de CPU, tempo de parede e consumo de memória.

---

## 12. Limitações

- **Recorte temporal:** dados disponíveis apenas até 2023; 2024 não incluído nesta versão.
- **Qualidade dos dados públicos:** o pipeline depende da consistência dos microdados disponibilizados pelo MEC; variações de formato entre edições requerem tratamento manual.
- **Candidatos únicos:** a remoção de identificadores pessoais (CPF, número de inscrição no ENEM) impede a contagem de candidatos únicos — as métricas de volume referem-se a inscrições, não a indivíduos distintos.
- **Schema inferido pelo Pandas:** as tabelas no banco Neon foram criadas via `pandas.to_sql`, que infere tipos automaticamente sem constraints, PKs ou índices. O arquivo `schema.sql` é documentacional; os tipos reais no banco podem divergir (colunas numéricas possivelmente FLOAT8 onde o schema sugere SMALLINT/INTEGER).
- **Sem índices no banco:** nenhum índice foi criado nas tabelas atuais. Queries que filtram por `LOWER(nome_curso)` na Silver fazem full scan de ~1M linhas.
- **Algumas queries ainda usam Silver diretamente:** `/api/cursos/overview` consulta Silver sem agregação Gold, o que é menos eficiente para aquela rota.
- **Benchmarks Docker não realizados:** toda afirmação comparativa de desempenho entre ambientes ainda não tem base empírica.

---

## 13. Próximos passos

Em ordem de prioridade:

1. **Iniciar rascunho do relatório final do PIBIC** — descrever o pipeline como workload de Ciência de Dados e o dashboard como artefato de análise; usar `data_pipeline/README.md` e `data_pipeline/schema.sql` como base técnica.
2. **Validar o schema real no banco Neon** — executar `information_schema.columns` e confrontar com `data_pipeline/schema.sql`; atualizar o arquivo se necessário.
3. **Criar índices no banco** — prioridade: `LOWER(nome_curso)` na Silver; seguido por índices compostos para endpoints com filtro de edição/campus.
4. **Planejar Docker mínimo** — Dockerfile para o pipeline Python; docker-compose com banco local para testes.
5. **Executar benchmarks locais** — medir tempo de execução do pipeline completo e consumo de CPU/RAM.
6. **Executar benchmarks em Docker** — repetir as medições dentro de contêiner com configuração equivalente.
7. **Inserir resultados reais no relatório** — toda métrica de desempenho deve ser rastreável a uma execução real com log ou saída capturada.
8. **Avaliar Golds futuras** — considerar tabela Gold para `/api/cursos/overview` (atualmente Silver) e para faixas etárias (atualmente Silver direta em `/api/faixas-etarias`).

---

*Documento gerado em 2026-05-30. Reflete o estado do projeto na data de criação. Atualizar conforme novas etapas forem concluídas.*
