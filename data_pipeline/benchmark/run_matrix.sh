#!/usr/bin/env bash
#
# run_matrix.sh — orquestra a matriz de cenários compute-only com N repetições.
#
# Roda os 5 cenários principais (local + 4 variações de Docker) chamando
# run_local.sh / run_docker.sh. Cada cenário grava em seu próprio diretório.
#
# ATENÇÃO: por padrão usa a AMOSTRA pequena (sisu_ufma_sample.csv). Este NÃO é o
# benchmark final; os números só viram resultado quando rodado com o CSV completo
# e com repetições suficientes, após aprovação.
#
# Variáveis de ambiente:
#   INPUT_CSV    (default: sisu_ufma_sample.csv)
#   RUNS         (default: 3)
#   OUTPUT_ROOT  (default: benchmark/results/matrix)   — relativo a data_pipeline/
#   IMAGE_NAME   (default: pibic-sisu-pipeline:benchmark)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PIPELINE_DIR="$(dirname "$SCRIPT_DIR")"

INPUT_CSV="${INPUT_CSV:-sisu_ufma_sample.csv}"
RUNS="${RUNS:-3}"
OUTPUT_ROOT="${OUTPUT_ROOT:-benchmark/results/matrix}"
IMAGE_NAME="${IMAGE_NAME:-pibic-sisu-pipeline:benchmark}"

# Cenários no formato "nome|tipo|flags_docker".
SCENARIOS=(
  "local|local|"
  "docker_unrestricted|docker|"
  "docker_cpu_1|docker|--cpus=1"
  "docker_memory_2g|docker|--memory=2g"
  "docker_cpu_1_memory_2g|docker|--cpus=1 --memory=2g"
)

echo "== Matriz de benchmark compute-only =="
echo "  input      : $INPUT_CSV"
echo "  runs       : $RUNS"
echo "  output_root: $OUTPUT_ROOT"
echo "  image      : $IMAGE_NAME"
echo "  cenários   : local, docker_unrestricted, docker_cpu_1, docker_memory_2g, docker_cpu_1_memory_2g"
echo

# Aviso se OUTPUT_ROOT já existe — NÃO apaga nada.
if [[ -e "$PIPELINE_DIR/$OUTPUT_ROOT" ]]; then
  echo "AVISO: '$OUTPUT_ROOT' já existe. Resultados novos serão ADICIONADOS (append) aos metrics.csv existentes."
  echo "       Para começar limpo, defina OUTPUT_ROOT diferente (ex.: benchmark/results/matrix-<data>) ou remova o diretório manualmente."
  echo
fi

for entry in "${SCENARIOS[@]}"; do
  IFS='|' read -r name kind flags <<< "$entry"
  out_dir="$OUTPUT_ROOT/$name"
  echo "########## Cenário: $name (flags: ${flags:-<nenhum>}) ##########"
  for (( i=1; i<=RUNS; i++ )); do
    echo "----- $name — run $i/$RUNS -----"
    if [[ "$kind" == "local" ]]; then
      INPUT_CSV="$INPUT_CSV" OUTPUT_DIR="$out_dir" RUN_ID="$i" SCENARIO_LABEL="$name" \
        bash "$SCRIPT_DIR/run_local.sh"
    else
      INPUT_CSV="$INPUT_CSV" OUTPUT_DIR="$out_dir" RUN_ID="$i" SCENARIO_LABEL="$name" \
        IMAGE_NAME="$IMAGE_NAME" DOCKER_RESOURCE_FLAGS="$flags" \
        bash "$SCRIPT_DIR/run_docker.sh"
    fi
    echo
  done
done

echo "== Matriz concluída =="
echo "Agregue com:"
echo "   python $SCRIPT_DIR/aggregate_metrics.py --input-root $OUTPUT_ROOT"
