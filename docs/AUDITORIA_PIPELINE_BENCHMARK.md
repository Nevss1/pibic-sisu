# Auditoria PIBIC SISU/UFMA — Pipeline e Benchmark

> Auditoria read-only. Nenhum arquivo do repositório foi alterado durante a
> auditoria. Todas as afirmações são rastreáveis aos arquivos citados em
> `data_pipeline/`.

## 1. Resumo executivo

O workload de Ciência de Dados existe, está coerente e é **parcialmente pronto para Docker**.
São 5 scripts Python em `data_pipeline/`, divididos em dois grupos:

- **`build_*` (2 scripts):** CSV Bronze → pandas → CSV Gold. **Não tocam o banco.**
  São candidatos ideais para benchmark computacional reproduzível.
- **`upload_*` (3 scripts):** CSV → `pandas.to_sql(if_exists="replace")` → tabela PostgreSQL.
  Dependem do Neon, são **destrutivos** e **network-bound** — impróprios para uma
  comparação local-vs-Docker justa enquanto apontarem para o Neon de produção.

**Recomendação central:** o benchmark inicial deve ser o caminho **sem banco**
(`build_gold_overview.py`, secundariamente `build_gold_modalidades.py`). Os
`upload_*` ficam para uma fase posterior com PostgreSQL **local** em contêiner.

O projeto **está pronto** para um Dockerfile do benchmark de compute. As pendências
encontradas são melhorias de reprodutibilidade (pinning de versões, paths
parametrizáveis), não bloqueios.

## 2. Estrutura encontrada

| Pasta/arquivo | Papel |
|---|---|
| `src/` | Dashboard web Next.js (não é o workload do benchmark) |
| `data_pipeline/` | **Pipeline ETL Python — o workload do PIBIC** |
| `docs/` | Documentação adicional |
| `.venv/` (raiz) | venv Python 3.12 já com `pandas` instalado |
| `public/`, `.agents/`, `.claude/`, `.vscode/` | Auxiliares |

**Documentação relevante:**
- `data_pipeline/README.md` (12,7 KB) — **atual e detalhado**; descreve camadas, scripts, ordem de execução, riscos e relação com Docker.
- `data_pipeline/schema.sql` (401 linhas) — DDL **documentacional** (não executado; auto-rotulado como divergente do banco real).
- `CLAUDE.md` (raiz) — **desatualizado** em pontos (ver §9).
- `README.md` (raiz) — foco no frontend.

## 3. Scripts do pipeline

Todos vivem em `data_pipeline/`. CWD esperado = `data_pipeline/` (paths relativos).

| Script | Função | Lê CSV | Grava CSV | Usa banco | .env/DATABASE_URL | Paths hardcoded | CLI args | Seguro p/ benchmark | Dependências |
|---|---|---|---|---|---|---|---|---|---|
| `upload_silver.py` | CSV Bronze → tabela `silver_sisu_ufma` (~1,08M linhas) | ✓ | ✗ | ✓ `to_sql` replace, chunksize 1000 | ✓ | ✓ (ARQUIVO+TABELA) | ✗ | ⚠ destrutivo + network-bound | pandas, sqlalchemy, dotenv, psycopg2 |
| `build_gold_overview.py` | Agrega overview por curso/ano/campus → CSV | ✓ (`--input`) | ✓ (`--output`) | ✗ | ✗ | só defaults (sobrescrevíveis) | ✓ argparse | ✓✓ **melhor candidato** | pandas |
| `upload_gold_overview.py` | CSV overview → tabela Gold (centenas de linhas) | ✓ | ✗ | ✓ replace | ✓ | ✓ | ✗ | ⚠ destrutivo (rápido) | pandas, sqlalchemy, dotenv |
| `build_gold_modalidades.py` | Agrega modalidades/categoria → CSV | ✓ | ✓ | ✗ | ✗ | ✓ (ARQUIVO+SAIDA, sem argparse) | ✗ | ✓ compute puro (menos flexível) | pandas, numpy |
| `upload_gold_modalidades.py` | CSV modalidades → tabela Gold | ✓ | ✗ | ✓ replace | ✓ | ✓ | ✗ | ⚠ destrutivo (rápido) | pandas, sqlalchemy, dotenv |

Observações:
- `build_gold_overview.py` é o mais maduro: `argparse --input/--output`, checagem de colunas obrigatórias (`_check_required_cols`) e validações Silver-vs-Gold.
- `build_gold_modalidades.py` é coerente mas **não tem argparse** (paths fixos) — assimetria com o overview.
- As validações dos `build_*` apenas **imprimem** ✓/✗; **não** chamam `sys.exit` em divergência (não falham o processo). OK para benchmark, fraco para CI.
- Colunas referenciadas pelos scripts existem no CSV real (cabeçalho verificado): `grupo_concorrencia`, `subgrupo_cota`, `aprovado`, `matricula`, `sexo`, `nota_candidato`, `nota_corte`, `ano`, `edicao`. **Nenhum script quebrado.**

## 4. Entradas, saídas e dados

- **CSV Bronze:** `data_pipeline/sisu_ufma_2017_2023.csv` — presente, **343 MB, 1.080.713 linhas** (verificado). **Gitignored** (`data_pipeline/.gitignore`), não versionado.
- **Cabeçalho real (31 colunas):** ANO, EDICAO, CODIGO_CAMPUS, NOME_CAMPUS, MUNICIPIO_CAMPUS, CODIGO_CURSO, NOME_CURSO, GRAU, TURNO, TP_COTA, TIPO_MOD_CONCORRENCIA, MOD_CONCORRENCIA, QT_VAGAS_CONCORRENCIA, PERCENTUAL_BONUS, SEXO, DT_NASCIMENTO, UF_CANDIDATO, MUNICIPIO_CANDIDATO, OPCAO, NOTA_L, NOTA_CH, NOTA_CN, NOTA_M, NOTA_R, NOTA_CANDIDATO, NOTA_CORTE, CLASSIFICACAO, APROVADO, MATRICULA, GRUPO_CONCORRENCIA, SUBGRUPO_COTA.
  - O CSV **não contém** CPF/nome/inscrição ENEM (premissa de privacidade do README §4 satisfeita), mas contém `DT_NASCIMENTO`, `UF_CANDIDATO`, `MUNICIPIO_CANDIDATO` (quase-identificadores).
- **CSVs intermediários** (`gold_overview_curso_ano_campus.csv`, `gold_modalidades_curso_ano_campus.csv`): **ainda não gerados** localmente; escritos no CWD ao rodar os `build_*`.
  - ⚠ Não estão no `.gitignore` → se gerados, **seriam versionados** (risco de commitar artefatos).
- **Risco de sobrescrita:** `build_*` sobrescrevem CSVs Gold locais (derivados, baixo risco). `upload_*` fazem **DROP+CREATE** das tabelas (alto risco se apontarem para o Neon de produção que o dashboard consome).

## 5. Banco de dados

- **Dependem de PostgreSQL/Neon:** `upload_silver.py`, `upload_gold_overview.py`, `upload_gold_modalidades.py`.
- **Tabelas:** `silver_sisu_ufma`, `gold_overview_curso_ano_campus`, `gold_modalidades_curso_ano_campus`.
- **`pandas.to_sql` usado:** sim, nos três uploads, sempre `if_exists="replace"` (destrutivo, sem migração incremental).
- **Migrations/schema:** não há migrations. `schema.sql` existe mas é **documentacional** — não é executado, não cria PK/índices/constraints, e diverge dos tipos reais (pandas infere `float8`).
- **Conexão:** `DATABASE_URL` em `data_pipeline/.env` (chave confirmada, valor não inspecionado). Driver `psycopg2-binary`. Neon = serverless, região sa-east-1.

## 6. Dependências

- **Python — `data_pipeline/requirements.txt`:** `pandas`, `numpy`, `sqlalchemy`, `psycopg2-binary`, `python-dotenv`.
  - ⚠ **Sem versões fixadas** → build não reproduzível (ruim para proveniência de benchmark).
  - `.venv/` na raiz (Python 3.12) já tem `pandas`.
- **Node — `package.json`:** Next 16.0.7, React 19.2.0, MUI 7, TanStack Query, `pg` 8.16.3. Frontend **fora** do workload do benchmark de pipeline.

## 7. Benchmark sem banco

Caminho recomendado: **CSV (343 MB) → `pandas.read_csv` → `groupby`/`agg` → `to_csv`**.
CPU + memória bound, determinístico, reproduzível.

- **`build_gold_overview.py`** — primário. Parametrizável (`--input/--output`), com validações. Não toca o banco.
- **`build_gold_modalidades.py`** — secundário. Compute puro (pandas+numpy), porém paths fixos.

Métricas sugeridas: tempo de parede (end-to-end), pico de RSS (RAM), uso de CPU — comparando local vs Docker.

## 8. Benchmark com banco

Candidatos: `upload_silver.py` (carga pesada, ~1,08M linhas, chunksize 1000) + os dois uploads Gold (pequenos).

**Riscos com Neon:**
1. **Destrutivo:** `if_exists="replace"` derruba as tabelas que o dashboard usa em produção.
2. **Network-bound / não reproduzível:** latência serverless variável, cold starts, região remota → mede rede para sa-east-1, não desempenho do contêiner. Comparação local-vs-Docker fica injusta.
3. **Provisionamento:** carga de 1M+ linhas sobre rede pode ser lenta/instável.

→ Se a carga em banco for benchmarkada, usar **PostgreSQL local em contêiner** (docker-compose) com `DATABASE_URL` descartável, **nunca** o Neon de produção.

## 9. Problemas e riscos

- **Drift de documentação:** `CLAUDE.md` afirma que `requirements.txt` e `schema.sql` "não existem" e trata `build_gold_overview.py` como incerto — os três **existem e estão commitados**. `data_pipeline/README.md` está correto; o `CLAUDE.md` está defasado.
- **`schema.sql` diverge do CSV real:** lista colunas Silver ausentes no CSV (`peso_*`, `nota_minima_*`, `*_com_peso`, `media_minima`) e omite colunas presentes (`tp_cota`, `tipo_mod_concorrencia`, `mod_concorrencia`, `uf_candidato`, `municipio_candidato`). Auto-rotulado como documentacional, mas a divergência é real.
- **`requirements.txt` sem versões** → não reproduzível.
- **Paths relativos hardcoded** em 4 de 5 scripts → exigem CWD = `data_pipeline/`; no Docker o CSV precisa ser montado no path correspondente. Só `build_gold_overview.py` é parametrizável.
- **Assimetria:** `build_gold_modalidades.py` sem argparse (vs overview).
- **`if_exists="replace"` em todos os uploads** → nunca apontar para o Neon de produção em benchmark.
- **CSV não versionado (343 MB, gitignored)** → reprodutibilidade depende de documentar a fonte; no Docker montar como **volume**, não `COPY` (evita inchar a imagem).
- **CSVs Gold intermediários fora do `.gitignore`** → risco de commitar artefatos gerados.
- **Sem testes automatizados**; validações dos `build_*` só imprimem, não falham o processo.
- **Não há Dockerfile/docker-compose** (esperado — etapa não iniciada).

## 10. Recomendação para próxima etapa

**Benchmark mínimo recomendado:** compute **sem banco** — CSV → `build_gold_overview.py` → CSV, medindo tempo, pico de RAM e CPU, local vs Docker.

**Entram no benchmark inicial:**
- `build_gold_overview.py` (primário)
- `build_gold_modalidades.py` (secundário/comparativo)

**Ficam fora por enquanto:**
- `upload_silver.py`, `upload_gold_overview.py`, `upload_gold_modalidades.py` — dependem do banco, são destrutivos e network-bound no Neon. Adiar para fase com PostgreSQL local em contêiner.

**Mudanças mínimas antes do Docker (não bloqueantes, melhoram reprodutibilidade):**
1. Fixar versões em `data_pipeline/requirements.txt`.
2. Adicionar `argparse --input/--output` a `build_gold_modalidades.py` (paridade + controle de paths no contêiner).
3. Definir estratégia do CSV: montar como **volume** (não `COPY`) e documentar a fonte/URL para reprodução.
4. Adicionar os CSVs Gold ao `data_pipeline/.gitignore`.
5. (Opcional) Atualizar `CLAUDE.md` para refletir que `requirements.txt`, `schema.sql` e `build_gold_overview.py` já existem.

**Pronto para criar Dockerfile?**
- **Sim** para o benchmark de compute (`build_gold_overview.py` é autocontido, deps conhecidas, CSV disponível). As mudanças acima são qualidade, não bloqueio.
- **Não** para o benchmark com banco — exige Postgres local + estratégia não destrutiva + evitar o Neon.
