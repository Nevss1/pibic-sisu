#!/usr/bin/env python3
"""
aggregate_metrics.py — agrega os metrics.csv da matriz de benchmark em summary.csv.

Lê recursivamente todos os metrics.csv sob --input-root, agrupa por (scenario, script)
e calcula estatísticas de tempo e memória. Não acessa banco de dados — apenas CSVs locais.

Uso:
  python aggregate_metrics.py --input-root benchmark/results/matrix
"""

import argparse
import glob
import os
import sys

import pandas as pd

NUMERIC_COLS = ["exit_code", "host_elapsed_seconds", "process_elapsed_seconds", "max_rss_kb"]


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Agrega metrics.csv da matriz de benchmark em summary.csv")
    p.add_argument(
        "--input-root",
        default="benchmark/results/matrix",
        help="Raiz onde procurar metrics.csv recursivamente (default: benchmark/results/matrix)",
    )
    return p.parse_args()


def main() -> None:
    args = parse_args()
    root = args.input_root

    paths = sorted(glob.glob(os.path.join(root, "**", "metrics.csv"), recursive=True))
    if not paths:
        print(f"ERRO: nenhum metrics.csv encontrado sob '{root}'")
        sys.exit(1)

    print(f"Lendo {len(paths)} arquivo(s) metrics.csv:")
    for p in paths:
        print(f"  - {p}")

    df = pd.concat([pd.read_csv(p) for p in paths], ignore_index=True)

    # Coerção numérica: valores 'NA' viram NaN e são ignorados nas estatísticas.
    for col in NUMERIC_COLS:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    df["_success"] = df["exit_code"] == 0

    rows = []
    for (scenario, script), g in df.groupby(["scenario", "script"], dropna=False):
        rows.append(
            {
                "scenario": scenario,
                "script": script,
                "runs": int(len(g)),
                "success_count": int(g["_success"].sum()),
                "failure_count": int((~g["_success"]).sum()),
                "median_host_elapsed_seconds": round(g["host_elapsed_seconds"].median(), 4),
                "mean_host_elapsed_seconds": round(g["host_elapsed_seconds"].mean(), 4),
                "std_host_elapsed_seconds": round(g["host_elapsed_seconds"].std(ddof=1), 4),
                "median_process_elapsed_seconds": round(g["process_elapsed_seconds"].median(), 4),
                "mean_process_elapsed_seconds": round(g["process_elapsed_seconds"].mean(), 4),
                "std_process_elapsed_seconds": round(g["process_elapsed_seconds"].std(ddof=1), 4),
                "median_max_rss_kb": g["max_rss_kb"].median(),
                "mean_max_rss_kb": round(g["max_rss_kb"].mean(), 1),
                "max_max_rss_kb": g["max_rss_kb"].max(),
            }
        )

    summary = pd.DataFrame(rows).sort_values(["scenario", "script"]).reset_index(drop=True)

    out = os.path.join(root, "summary.csv")
    summary.to_csv(out, index=False)

    print(f"\nSalvo: {out}\n")
    print(summary.to_string(index=False))

    total_fail = int((~df["_success"]).sum())
    if total_fail:
        print(f"\nATENÇÃO: {total_fail} execução(ões) com exit_code != 0 — investigar os logs.")


if __name__ == "__main__":
    main()
