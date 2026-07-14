#!/usr/bin/env bash
#
# run_docker.sh — benchmark compute-only em DOCKER dos scripts build_gold_*.
#
# Executa build_gold_overview.py e build_gold_modalidades.py DENTRO do container
# pibic-sisu-pipeline:benchmark, com o diretório data_pipeline montado em /data.
# Registra DOIS tempos distintos:
#   host_elapsed_seconds    — wall-clock medido no HOST em volta do `docker run`.
#                             INCLUI o tempo de inicialização do container.
#   process_elapsed_seconds — "Elapsed (wall clock)" do /usr/bin/time -v DENTRO do
#                             container (tempo de cálculo puro, sem startup).
# A diferença entre os dois é ~o custo de subir o container.
#
# Validação técnica — os números NÃO são resultado final do PIBIC.
#
# Variáveis de ambiente:
#   INPUT_CSV             (default: sisu_ufma_sample.csv)
#   OUTPUT_DIR           (default: benchmark/results/docker)  — relativo a data_pipeline/
#   RUN_ID               (default: 1)
#   IMAGE_NAME           (default: pibic-sisu-pipeline:benchmark)
#   DOCKER_RESOURCE_FLAGS (default: vazio) — ex.: "--cpus=1 --memory=2g"
#   SCENARIO_LABEL       (default: docker) — rótulo da coluna `scenario` (usado pela matriz)
set -euo pipefail

# Localização: este script vive em data_pipeline/benchmark/.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PIPELINE_DIR="$(dirname "$SCRIPT_DIR")"

INPUT_CSV="${INPUT_CSV:-sisu_ufma_sample.csv}"
OUTPUT_DIR="${OUTPUT_DIR:-benchmark/results/docker}"
RUN_ID="${RUN_ID:-1}"
IMAGE_NAME="${IMAGE_NAME:-pibic-sisu-pipeline:benchmark}"
DOCKER_RESOURCE_FLAGS="${DOCKER_RESOURCE_FLAGS:-}"
SCENARIO="${SCENARIO_LABEL:-docker}"

mkdir -p "$PIPELINE_DIR/$OUTPUT_DIR"
METRICS="$PIPELINE_DIR/$OUTPUT_DIR/metrics.csv"
HEADER="scenario,run_id,script,input_csv,output_csv,exit_code,host_elapsed_seconds,process_elapsed_seconds,max_rss_kb,log_file"
if [[ ! -f "$METRICS" ]]; then
  echo "$HEADER" > "$METRICS"
fi

# Roda como o usuário atual para não gerar arquivos root-owned no volume.
USER_FLAG="$(id -u):$(id -g)"

# /usr/bin/time disponível na imagem? (com a imagem ajustada, esperado "yes")
HAS_TIME="$(docker run --rm "$IMAGE_NAME" sh -c 'command -v /usr/bin/time >/dev/null 2>&1 && echo yes || echo no' 2>/dev/null || echo no)"

# Converte "M:SS.ss" ou "H:MM:SS" (Elapsed do GNU time) em segundos decimais.
parse_elapsed_seconds() {
  awk -v t="$1" 'BEGIN{
    if (t=="") { printf ""; exit }
    n=split(t, a, ":");
    if (n==2)      printf "%.3f", a[1]*60 + a[2];
    else if (n==3) printf "%.3f", a[1]*3600 + a[2]*60 + a[3];
    else           printf "";
  }'
}

echo "== Benchmark DOCKER =="
echo "  scenario: $SCENARIO"
echo "  image   : $IMAGE_NAME"
echo "  input   : /data/$INPUT_CSV"
echo "  output  : /data/$OUTPUT_DIR"
echo "  run_id  : $RUN_ID"
echo "  user    : $USER_FLAG"
echo "  flags   : ${DOCKER_RESOURCE_FLAGS:-<nenhum>}"
echo "  time -v : $HAS_TIME"
echo

run_one() {
  local script="$1"
  local out_rel="$OUTPUT_DIR/$2"          # relativo a data_pipeline (== /data no container)
  local base="${script%.py}"
  local log_rel="$OUTPUT_DIR/${base}_run${RUN_ID}.log"
  local log="$PIPELINE_DIR/$log_rel"
  local exit_code host_elapsed proc_elapsed="" rss="" t0 t1 inner raw

  if [[ "$HAS_TIME" == "yes" ]]; then
    inner="/usr/bin/time -v python $script --input /data/$INPUT_CSV --output /data/$out_rel"
  else
    inner="python $script --input /data/$INPUT_CSV --output /data/$out_rel"
  fi

  echo "-- $script --"
  t0="$(date +%s.%N)"
  set +e
  # shellcheck disable=SC2086  # DOCKER_RESOURCE_FLAGS deve sofrer word-splitting
  docker run --rm \
    --user "$USER_FLAG" \
    $DOCKER_RESOURCE_FLAGS \
    -v "$PIPELINE_DIR:/data" \
    "$IMAGE_NAME" \
    sh -c "$inner" > "$log" 2>&1
  exit_code=$?
  set -e
  t1="$(date +%s.%N)"
  host_elapsed="$(awk -v a="$t0" -v b="$t1" 'BEGIN{printf "%.3f", b-a}')"

  if [[ "$HAS_TIME" == "yes" ]]; then
    rss="$(grep -F 'Maximum resident set size' "$log" | awk -F': ' '{print $NF}' | tr -d '[:space:]' || true)"
    raw="$(grep -F 'Elapsed (wall clock)' "$log" | awk -F': ' '{print $NF}' | tr -d '[:space:]' || true)"
    proc_elapsed="$(parse_elapsed_seconds "$raw")"
  fi

  # Registra a linha mesmo que o container/script tenha falhado (exit_code != 0).
  echo "$SCENARIO,$RUN_ID,$script,$INPUT_CSV,$out_rel,$exit_code,$host_elapsed,${proc_elapsed:-NA},${rss:-NA},$log_rel" >> "$METRICS"
  echo "   exit=$exit_code  host=${host_elapsed}s (c/ startup)  process=${proc_elapsed:-NA}s  max_rss_kb=${rss:-NA}  log=$log_rel"
}

run_one "build_gold_overview.py"    "gold_overview.csv"
run_one "build_gold_modalidades.py" "gold_modalidades.csv"

echo
echo "metrics: $METRICS"
