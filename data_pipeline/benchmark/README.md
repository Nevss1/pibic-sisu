# Benchmark compute-only — pipeline SISU/UFMA

Instrumentação para medir a execução dos scripts **compute-only** do pipeline
(`build_gold_overview.py` e `build_gold_modalidades.py`) em vários cenários — **local** e
**Docker** (com e sem limites de recurso) — e gravar métricas estruturadas em CSV.

Esses scripts apenas leem um CSV e gravam um CSV: **não acessam banco de dados, Neon, nem
executam os `upload_*`.**

## Scripts

| Arquivo | Papel |
|---|---|
| `run_local.sh` | Roda os 2 scripts no host e mede |
| `run_docker.sh` | Roda os 2 scripts no container e mede (aceita `DOCKER_RESOURCE_FLAGS`) |
| `run_matrix.sh` | Orquestra a matriz de cenários com N repetições |
| `aggregate_metrics.py` | Agrega os `metrics.csv` em um `summary.csv` (mediana/média/desvio) |

## Smoke test vs benchmark final

> ⚠️ **A amostra é apenas validação técnica, não resultado final.** O default de todos os scripts
> é `sisu_ufma_sample.csv` (~5.000 linhas, só edição 2017). **Não cite esses valores** no relatório.
> O benchmark final usa o CSV completo (`sisu_ufma_2017_2023.csv`, ~1,08 milhão de linhas) com
> várias repetições, em execução aprovada à parte.

## `host_elapsed_seconds` vs `process_elapsed_seconds`

O `metrics.csv` registra **dois tempos**, propositalmente:

- **`host_elapsed_seconds`** — wall-clock medido no host com `date +%s.%N` em volta da execução.
  No cenário **Docker**, inclui o **tempo de inicialização do container** (criar container, montar
  volume, subir processo), não só o cálculo.
- **`process_elapsed_seconds`** — o campo `Elapsed (wall clock)` do `/usr/bin/time -v`, ou seja, o
  tempo do **processo Python em si**. No Docker, é medido **dentro do container** → é o cálculo
  "puro", sem o startup.

A diferença `host − process` no Docker é, aproximadamente, **o custo de subir o container**.
No local os dois ficam bem próximos. Reporte os dois no relatório.

## Métricas coletadas (`metrics.csv`)

Uma linha por script por execução:

| Coluna | Significado |
|---|---|
| `scenario` | `local`, `docker_unrestricted`, `docker_cpu_1`, ... |
| `run_id` | número da repetição |
| `script` | `build_gold_overview.py` ou `build_gold_modalidades.py` |
| `input_csv` / `output_csv` | CSV de entrada / CSV Gold gerado |
| `exit_code` | 0 = sucesso |
| `host_elapsed_seconds` | wall-clock do host (Docker inclui startup) |
| `process_elapsed_seconds` | tempo do processo via `/usr/bin/time -v` (`NA` se indisponível) |
| `max_rss_kb` | pico de RSS em kbytes (de `/usr/bin/time -v`) |
| `log_file` | log completo do script |

## Matriz experimental

Cenários rodados por `run_matrix.sh`:

| Cenário | Como roda | `DOCKER_RESOURCE_FLAGS` |
|---|---|---|
| `local` | host, via `run_local.sh` | — |
| `docker_unrestricted` | container sem limites | *(vazio)* |
| `docker_cpu_1` | container com 1 CPU | `--cpus=1` |
| `docker_memory_2g` | container com 2 GB | `--memory=2g` |
| `docker_cpu_1_memory_2g` | container com 1 CPU e 2 GB | `--cpus=1 --memory=2g` |

> ⚠️ **Não use `--memory=1g` como cenário principal.** A validação com o CSV completo mostrou pico
> de RSS ~**1,2 GB** por script — com 1 GB o container seria morto por OOM (`Killed`). Os cenários
> de memória usam **2 GB** por isso. `1g` só faz sentido como teste proposital de contenção/falha.

## Como rodar — com a amostra (validação)

```bash
# Matriz completa, 2 repetições, na amostra:
INPUT_CSV=sisu_ufma_sample.csv RUNS=2 bash data_pipeline/benchmark/run_matrix.sh

# Agregar:
python data_pipeline/benchmark/aggregate_metrics.py --input-root data_pipeline/benchmark/results/matrix
```

Também dá para rodar um cenário isolado:

```bash
bash data_pipeline/benchmark/run_local.sh
DOCKER_RESOURCE_FLAGS="--cpus=1 --memory=2g" bash data_pipeline/benchmark/run_docker.sh
```

## Como rodar — com o CSV completo (benchmark, só após aprovação)

```bash
INPUT_CSV=sisu_ufma_2017_2023.csv \
RUNS=5 \
OUTPUT_ROOT=benchmark/results/matrix-full \
bash data_pipeline/benchmark/run_matrix.sh

python data_pipeline/benchmark/aggregate_metrics.py --input-root data_pipeline/benchmark/results/matrix-full
```

**Recomendação para o relatório: pelo menos 5 repetições por cenário** (`RUNS=5`), reportando
mediana e desvio-padrão. Descartar mentalmente a 1ª repetição (aquecimento) e manter a máquina
o mais ociosa possível durante a execução.

## Saídas e limitações

- Tudo é gravado sob `benchmark/results/…` e **não é versionado** (`.gitignore`): `metrics.csv`,
  `summary.csv`, logs `*_run<RUN_ID>.log` e os CSVs Gold.
- O container roda com `--user "$(id -u):$(id -g)"` → arquivos gerados pertencem ao seu usuário.
- **Execução única não é robusta** — use repetições e agregue.
- O `host_elapsed_seconds` do Docker inclui o startup do container; compare também o
  `process_elapsed_seconds` para o cálculo puro.
- A amostra está enviesada (só 2017); serve para validar a mecânica, não para concluir desempenho.
- Cache de disco do SO não é controlado entre execuções — para o benchmark final, padronize
  (ex.: sempre "quente", lendo o CSV uma vez antes) e documente.
