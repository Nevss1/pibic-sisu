#!/usr/bin/env bash
#
# run_docker.sh — benchmark compute-only em DOCKER dos scripts build_gold_*.
#
# Executa build_gold_overview.py e build_gold_modalidades.py DENTRO do container
# pibic-sisu-pipeline:benchmark, com o diretório data_pipeline montado em /data.
# Mede o pico de RSS com /usr/bin/time -v DENTRO do container; o elapsed_seconds
# registrado é o wall-clock medido no HOST e INCLUI o tempo de inicialização do
# container. Validação técnica com amostra — não é o benchmark final.
#
# Variáveis de ambiente:
#   INPUT_CSV              (default: sisu_ufma_sample.csv)
#   OUTPUT_DIR            (default: benchmark/results/docker)  — relativo a data_pipeline/
#   RUN_ID               (default: 1)
#   IMAGE_NAME           (default: pibic-sisu-pipeline:benchmark)
#   DOCKER_RESOURCE_FLAGS (default: vazio) — ex.: "--cpus=1 --memory=1g"
set -euo pipefail

# Localização: este script vive em data_pipeline/benchmark/.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PIPELINE_DIR="$(dirname "$SCRIPT_DIR")"

INPUT_CSV="${INPUT_CSV:-sisu_ufma_sample.csv}"
OUTPUT_DIR="${OUTPUT_DIR:-benchmark/results/docker}"
RUN_ID="${RUN_ID:-1}"
IMAGE_NAME="${IMAGE_NAME:-pibic-sisu-pipeline:benchmark}"
DOCKER_RESOURCE_FLAGS="${DOCKER_RESOURCE_FLAGS:-}"
SCENARIO="docker"

mkdir -p "$PIPELINE_DIR/$OUTPUT_DIR"
METRICS="$PIPELINE_DIR/$OUTPUT_DIR/metrics.csv"
if [[ ! -f "$METRICS" ]]; then
  echo "scenario,run_id,script,input_csv,output_csv,exit_code,elapsed_seconds,max_rss_kb,log_file" > "$METRICS"
fi

# Roda como o usuário atual para não gerar arquivos root-owned no volume.
USER_FLAG="$(id -u):$(id -g)"

# /usr/bin/time disponível na imagem? (com a imagem ajustada, esperado "yes")
HAS_TIME="$(docker run --rm "$IMAGE_NAME" sh -c 'command -v /usr/bin/time >/dev/null 2>&1 && echo yes || echo no' 2>/dev/null || echo no)"

echo "== Benchmark DOCKER =="
echo "  image  : $IMAGE_NAME"
echo "  input  : /data/$INPUT_CSV"
echo "  output : /data/$OUTPUT_DIR"
echo "  run_id : $RUN_ID"
echo "  user   : $USER_FLAG"
echo "  flags  : ${DOCKER_RESOURCE_FLAGS:-<nenhum>}"
echo "  time -v: $HAS_TIME"
echo

run_one() {
  local script="$1"
  local out_rel="$OUTPUT_DIR/$2"          # relativo a data_pipeline (== /data no container)
  local base="${script%.py}"
  local log_rel="$OUTPUT_DIR/${base}_run${RUN_ID}.log"
  local log="$PIPELINE_DIR/$log_rel"
  local exit_code elapsed rss="" t0 t1 inner

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
  elapsed="$(awk -v a="$t0" -v b="$t1" 'BEGIN{printf "%.3f", b-a}')"

  if [[ "$HAS_TIME" == "yes" ]]; then
    rss="$(grep -F 'Maximum resident set size' "$log" | awk -F': ' '{print $2}' | tr -d '[:space:]' || true)"
  fi

  # Registra a linha mesmo que o container/script tenha falhado (exit_code != 0).
  echo "$SCENARIO,$RUN_ID,$script,$INPUT_CSV,$out_rel,$exit_code,$elapsed,$rss,$log_rel" >> "$METRICS"
  echo "   exit=$exit_code  elapsed=${elapsed}s (host, inclui startup)  max_rss_kb=${rss:-NA}  log=$log_rel"
}

run_one "build_gold_overview.py"    "gold_overview.csv"
run_one "build_gold_modalidades.py" "gold_modalidades.csv"

echo
echo "metrics: $METRICS"
