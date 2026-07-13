#!/usr/bin/env bash
#
# run_local.sh — benchmark compute-only LOCAL dos scripts build_gold_*.
#
# Executa build_gold_overview.py e build_gold_modalidades.py no host, mede tempo
# de parede e pico de RSS com /usr/bin/time -v, e grava uma linha por script em
# metrics.csv. Validação técnica com amostra — NÃO é o benchmark final com o CSV
# completo, e os números aqui não devem ser usados como resultado.
#
# Variáveis de ambiente:
#   INPUT_CSV   (default: sisu_ufma_sample.csv)
#   OUTPUT_DIR  (default: benchmark/results/local)   — relativo a data_pipeline/
#   RUN_ID      (default: 1)
#   PYTHON_BIN  (default: ../.venv/bin/python se existir, senão python3)
set -euo pipefail

# Localização: este script vive em data_pipeline/benchmark/.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PIPELINE_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PIPELINE_DIR"

# Python local: preferir o .venv da raiz do repo; senão python3; ainda sobrescrevível.
DEFAULT_PYTHON="python3"
if [[ -x "../.venv/bin/python" ]]; then
  DEFAULT_PYTHON="../.venv/bin/python"
fi

INPUT_CSV="${INPUT_CSV:-sisu_ufma_sample.csv}"
OUTPUT_DIR="${OUTPUT_DIR:-benchmark/results/local}"
RUN_ID="${RUN_ID:-1}"
PYTHON_BIN="${PYTHON_BIN:-$DEFAULT_PYTHON}"
SCENARIO="local"

mkdir -p "$OUTPUT_DIR"
METRICS="$OUTPUT_DIR/metrics.csv"
if [[ ! -f "$METRICS" ]]; then
  echo "scenario,run_id,script,input_csv,output_csv,exit_code,elapsed_seconds,max_rss_kb,log_file" > "$METRICS"
fi

# GNU time disponível? (sem ele, RSS fica vazio/NA)
TIME_BIN=""
if [[ -x /usr/bin/time ]]; then
  TIME_BIN="/usr/bin/time"
fi

echo "== Benchmark LOCAL =="
echo "  python : $PYTHON_BIN"
echo "  input  : $INPUT_CSV"
echo "  output : $OUTPUT_DIR"
echo "  run_id : $RUN_ID"
echo "  time -v: ${TIME_BIN:-<ausente, max_rss_kb=NA>}"
echo

run_one() {
  local script="$1"
  local out="$OUTPUT_DIR/$2"
  local base="${script%.py}"
  local log="$OUTPUT_DIR/${base}_run${RUN_ID}.log"
  local exit_code elapsed rss="" t0 t1

  echo "-- $script --"
  t0="$(date +%s.%N)"
  set +e
  if [[ -n "$TIME_BIN" ]]; then
    "$TIME_BIN" -v "$PYTHON_BIN" "$script" --input "$INPUT_CSV" --output "$out" > "$log" 2>&1
    exit_code=$?
  else
    "$PYTHON_BIN" "$script" --input "$INPUT_CSV" --output "$out" > "$log" 2>&1
    exit_code=$?
  fi
  set -e
  t1="$(date +%s.%N)"
  elapsed="$(awk -v a="$t0" -v b="$t1" 'BEGIN{printf "%.3f", b-a}')"

  if [[ -n "$TIME_BIN" ]]; then
    rss="$(grep -F 'Maximum resident set size' "$log" | awk -F': ' '{print $2}' | tr -d '[:space:]' || true)"
  fi

  # Registra a linha mesmo que o script tenha falhado (exit_code != 0).
  echo "$SCENARIO,$RUN_ID,$script,$INPUT_CSV,$out,$exit_code,$elapsed,$rss,$log" >> "$METRICS"
  echo "   exit=$exit_code  elapsed=${elapsed}s  max_rss_kb=${rss:-NA}  log=$log"
}

run_one "build_gold_overview.py"    "gold_overview.csv"
run_one "build_gold_modalidades.py" "gold_modalidades.csv"

echo
echo "metrics: $PIPELINE_DIR/$METRICS"
