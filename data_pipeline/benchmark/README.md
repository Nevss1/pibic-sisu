# Benchmark compute-only — pipeline SISU/UFMA

Instrumentação inicial para medir a execução dos scripts **compute-only** do pipeline
(`build_gold_overview.py` e `build_gold_modalidades.py`) em dois cenários — **local** e
**Docker** — e gravar métricas estruturadas em CSV.

Esses scripts apenas leem um CSV e gravam um CSV: **não acessam banco de dados, Neon, nem
executam os `upload_*`.**

## Smoke test vs benchmark final

Esta etapa é uma **validação técnica** da instrumentação, executada com uma **amostra pequena**
(`sisu_ufma_sample.csv`, ~5.000 linhas).

> ⚠️ **A amostra é apenas validação técnica, não resultado final.** Os números obtidos aqui
> servem só para confirmar que a medição funciona. **Não cite estes valores como resultado** no
> relatório do PIBIC. O benchmark final usará o CSV completo (`sisu_ufma_2017_2023.csv`,
> ~1,08 milhão de linhas), com múltiplas repetições, em etapa posterior.

## Como rodar — local

```bash
bash data_pipeline/benchmark/run_local.sh
```

Variáveis de ambiente (todas opcionais):

| Variável | Default | Descrição |
|---|---|---|
| `INPUT_CSV` | `sisu_ufma_sample.csv` | CSV de entrada (relativo a `data_pipeline/`) |
| `OUTPUT_DIR` | `benchmark/results/local` | Onde gravar `metrics.csv`, logs e CSVs de saída |
| `RUN_ID` | `1` | Identificador da execução (vai para o `metrics.csv` e nomes de log) |
| `PYTHON_BIN` | `../.venv/bin/python` se existir, senão `python3` | Interpretador Python |

## Como rodar — Docker

Requer a imagem `pibic-sisu-pipeline:benchmark`. Se ela não existir (ou após alterar o Dockerfile):

```bash
docker build -f data_pipeline/Dockerfile -t pibic-sisu-pipeline:benchmark data_pipeline
```

Depois:

```bash
bash data_pipeline/benchmark/run_docker.sh
```

Variáveis adicionais:

| Variável | Default | Descrição |
|---|---|---|
| `IMAGE_NAME` | `pibic-sisu-pipeline:benchmark` | Imagem usada |
| `DOCKER_RESOURCE_FLAGS` | *(vazio)* | Flags de limite de recursos repassadas ao `docker run` |

O container roda com `--user "$(id -u):$(id -g)"`, então os arquivos gerados no volume
pertencem ao seu usuário (não a `root`).

### Limitando recursos com `DOCKER_RESOURCE_FLAGS`

```bash
# 1 CPU
DOCKER_RESOURCE_FLAGS="--cpus=1" bash data_pipeline/benchmark/run_docker.sh

# 1 CPU e 1 GB de RAM
DOCKER_RESOURCE_FLAGS="--cpus=1 --memory=1g" bash data_pipeline/benchmark/run_docker.sh
```

## Métricas coletadas

Cada execução acrescenta **uma linha por script** ao `metrics.csv` dentro do `OUTPUT_DIR`:

| Coluna | Significado |
|---|---|
| `scenario` | `local` ou `docker` |
| `run_id` | valor de `RUN_ID` |
| `script` | `build_gold_overview.py` ou `build_gold_modalidades.py` |
| `input_csv` | CSV de entrada usado |
| `output_csv` | CSV Gold gerado |
| `exit_code` | código de saída do script (0 = sucesso) |
| `elapsed_seconds` | tempo de parede (wall-clock) |
| `max_rss_kb` | pico de memória residente, em kbytes (de `/usr/bin/time -v`) |
| `log_file` | log completo daquele script (inclui as validações ✓/✗ e a saída do `time -v`) |

## Como as medições são feitas (e suas limitações)

- **`elapsed_seconds` no cenário local** é o wall-clock do processo Python.
- **`elapsed_seconds` no cenário Docker** é medido **pelo host** e **inclui o tempo de
  inicialização do container** (criar o container, montar o volume, subir o processo). Não é só
  o tempo de cálculo. O tempo "puro" de processamento dentro do container está disponível no log
  do script, na linha `Elapsed (wall clock) time` do `/usr/bin/time -v`.
- **`max_rss_kb` (pico de RSS)** vem sempre do **`/usr/bin/time -v` executado em volta do processo
  Python** — no host (local) ou **dentro do container** (Docker). Por isso a imagem Docker instala
  o pacote `time`.
- **Execução única não é estatisticamente robusta.** Para o benchmark final, repita várias vezes
  (`RUN_ID` diferentes) e agregue (média/mediana/desvio).
- **A amostra está enviesada:** `sisu_ufma_sample.csv` foi gerada com `head` e contém apenas a
  edição **2017** (sem "Bônus Maranhão", sem matrículas efetivadas). Serve para validar a
  mecânica, não para concluir sobre desempenho.
- `max_rss_kb` está em **kbytes** conforme reportado pelo GNU time.

## Saídas

Tudo é gravado sob `benchmark/results/<scenario>/` e **não é versionado** (`.gitignore`):
`metrics.csv`, os logs `*_run<RUN_ID>.log` e os CSVs Gold de saída.
