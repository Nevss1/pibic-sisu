#!/usr/bin/env bash
#
# run_local.sh — benchmark compute-only LOCAL dos scripts build_gold_*.
#
# Executa build_gold_overview.py e build_gold_modalidades.py no host, mede tempo
# e pico de RSS, e grava uma linha por script em metrics.csv. Validação técnica —
# os números NÃO devem ser tratados como resultado final do PIBIC.
#
# Registra DOIS tempos distintos:
#   host_elapsed_seconds    — wall-clock medido com `date +%s.%N` em volta da execução.
#   process_elapsed_seconds — "Elapsed (wall clock)" reportado pelo /usr/bin/time -v
#                             (tempo do processo em si). No local os dois são bem próximos.
#
# Variáveis de ambiente:
#   INPUT_CSV       (default: sisu_ufma_sample.csv)
#   OUTPUT_DIR      (default: benchmark/results/local)   — relativo a data_pipeline/
#   RUN_ID          (default: 1)
#   PYTHON_BIN      (default: ../.venv/bin/python se existir, senão python3)
#   SCENARIO_LABEL  (default: local)  — rótulo da coluna `scenario` (usado pela matriz)
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
SCENARIO="${SCENARIO_LABEL:-local}"

mkdir -p "$OUTPUT_DIR"
METRICS="$OUTPUT_DIR/metrics.csv"
HEADER="scenario,run_id,script,input_csv,output_csv,exit_code,host_elapsed_seconds,process_elapsed_seconds,max_rss_kb,log_file"
if [[ ! -f "$METRICS" ]]; then
  echo "$HEADER" > "$METRICS"
fi

# GNU time disponível? (sem ele, process_elapsed e RSS ficam NA)
TIME_BIN=""
if [[ -x /usr/bin/time ]]; then
  TIME_BIN="/usr/bin/time"
fi

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

echo "== Benchmark LOCAL =="
echo "  scenario: $SCENARIO"
echo "  python  : $PYTHON_BIN"
echo "  input   : $INPUT_CSV"
echo "  output  : $OUTPUT_DIR"
echo "  run_id  : $RUN_ID"
echo "  time -v : ${TIME_BIN:-<ausente: process_elapsed/max_rss = NA>}"
echo

run_one() {
  local script="$1"
  local out="$OUTPUT_DIR/$2"
  local base="${script%.py}"
  local log="$OUTPUT_DIR/${base}_run${RUN_ID}.log"
  local exit_code host_elapsed proc_elapsed="" rss="" t0 t1 raw

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
  host_elapsed="$(awk -v a="$t0" -v b="$t1" 'BEGIN{printf "%.3f", b-a}')"

  if [[ -n "$TIME_BIN" ]]; then
    rss="$(grep -F 'Maximum resident set size' "$log" | awk -F': ' '{print $NF}' | tr -d '[:space:]' || true)"
    raw="$(grep -F 'Elapsed (wall clock)' "$log" | awk -F': ' '{print $NF}' | tr -d '[:space:]' || true)"
    proc_elapsed="$(parse_elapsed_seconds "$raw")"
  fi

  # Registra a linha mesmo que o script tenha falhado (exit_code != 0).
  echo "$SCENARIO,$RUN_ID,$script,$INPUT_CSV,$out,$exit_code,$host_elapsed,${proc_elapsed:-NA},${rss:-NA},$log" >> "$METRICS"
  echo "   exit=$exit_code  host=${host_elapsed}s  process=${proc_elapsed:-NA}s  max_rss_kb=${rss:-NA}  log=$log"
}

run_one "build_gold_overview.py"    "gold_overview.csv"
run_one "build_gold_modalidades.py" "gold_modalidades.csv"

echo
echo "metrics: $PIPELINE_DIR/$METRICS"
