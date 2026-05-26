"""
Gera gold_overview_curso_ano_campus.csv a partir da Silver consolidada.

Granularidade: (ano, edicao, codigo_campus, nome_campus, municipio_campus,
                codigo_curso, nome_curso, grau, turno)

Métricas geradas:
  total_candidatos, total_aprovados, total_efetivadas,
  media_nota_candidato, media_nota_corte,
  min/max nota_candidato, min/max nota_corte,
  inscritos_masculino, inscritos_feminino,
  taxa_aprovacao, taxa_efetivacao_sobre_aprovados, taxa_efetivacao_sobre_candidatos

Regras:
  - APROVADO = 'S'       → aprovado
  - MATRICULA = 'EFETIVADA' → matrícula efetivada (subconjunto dos aprovados)
  - SEXO = 'M' / 'F'    → contagem por gênero
  - Cada linha = uma inscrição (não necessariamente candidato único)

Uso:
  python build_gold_overview.py
  python build_gold_overview.py --input sisu_ufma_2017_2023.csv --output gold_overview_curso_ano_campus.csv
"""

import argparse
import sys

import pandas as pd

DEFAULT_INPUT  = "sisu_ufma_2017_2023.csv"
DEFAULT_OUTPUT = "gold_overview_curso_ano_campus.csv"

GROUP_COLS = [
    "ano", "edicao",
    "codigo_campus", "nome_campus", "municipio_campus",
    "codigo_curso", "nome_curso", "grau", "turno",
]

NUMERIC_COLS = [
    "ano", "edicao", "codigo_campus", "codigo_curso",
    "nota_candidato", "nota_corte",
]

REQUIRED_COLS = GROUP_COLS + ["aprovado", "matricula", "nota_candidato", "nota_corte", "sexo"]


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Gera gold_overview_curso_ano_campus.csv")
    p.add_argument("--input",  default=DEFAULT_INPUT,  help="Caminho do CSV Silver de entrada")
    p.add_argument("--output", default=DEFAULT_OUTPUT, help="Caminho do CSV Gold de saída")
    return p.parse_args()


def _check_required_cols(df: pd.DataFrame) -> None:
    missing = [c for c in REQUIRED_COLS if c not in df.columns]
    if missing:
        print(f"\nERRO: colunas ausentes no arquivo de entrada: {missing}")
        print(f"Colunas disponíveis: {list(df.columns)}")
        sys.exit(1)


def main() -> None:
    args = parse_args()

    print(f"Lendo {args.input}...")
    df = pd.read_csv(args.input, dtype=str, encoding="utf-8", low_memory=False)
    df.columns = [c.lower() for c in df.columns]
    print(f"  {len(df):,} linhas carregadas")

    _check_required_cols(df)

    for col in NUMERIC_COLS:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    # flags binárias
    df["_aprovado"]  = df["aprovado"] == "S"
    df["_efetivada"] = df["matricula"] == "EFETIVADA"
    df["_masc"]      = df["sexo"] == "M"
    df["_fem"]       = df["sexo"] == "F"

    print("\nAgregando...")
    gold = (
        df.groupby(GROUP_COLS, observed=True, dropna=False)
        .agg(
            total_candidatos              = ("_aprovado",      "count"),
            total_aprovados               = ("_aprovado",      "sum"),
            total_efetivadas              = ("_efetivada",     "sum"),
            media_nota_candidato          = ("nota_candidato", "mean"),
            media_nota_corte              = ("nota_corte",     "mean"),
            min_nota_candidato            = ("nota_candidato", "min"),
            max_nota_candidato            = ("nota_candidato", "max"),
            min_nota_corte                = ("nota_corte",     "min"),
            max_nota_corte                = ("nota_corte",     "max"),
            inscritos_masculino           = ("_masc",          "sum"),
            inscritos_feminino            = ("_fem",           "sum"),
        )
        .reset_index()
    )

    # tipos
    int_cols = ["total_candidatos", "total_aprovados", "total_efetivadas",
                "inscritos_masculino", "inscritos_feminino"]
    for col in int_cols:
        gold[col] = gold[col].astype(int)

    float_cols = ["media_nota_candidato", "media_nota_corte",
                  "min_nota_candidato", "max_nota_candidato",
                  "min_nota_corte", "max_nota_corte"]
    for col in float_cols:
        gold[col] = gold[col].round(4)

    # taxas
    gold["taxa_aprovacao"] = (
        gold["total_aprovados"] / gold["total_candidatos"].replace(0, pd.NA)
    ).round(4)

    gold["taxa_efetivacao_sobre_aprovados"] = (
        gold["total_efetivadas"] / gold["total_aprovados"].replace(0, pd.NA)
    ).round(4)

    gold["taxa_efetivacao_sobre_candidatos"] = (
        gold["total_efetivadas"] / gold["total_candidatos"].replace(0, pd.NA)
    ).round(4)

    gold = gold.sort_values(["ano", "nome_campus", "nome_curso"]).reset_index(drop=True)

    print(f"  {len(gold):,} linhas na Gold\n")
    _validar(df, gold)

    gold.to_csv(args.output, index=False)
    print(f"\nSalvo em: {args.output}")


def _validar(silver: pd.DataFrame, gold: pd.DataFrame) -> None:
    print("=== VALIDAÇÕES ===")

    total_silver = len(silver)
    total_gold   = gold["total_candidatos"].sum()
    ok = "✓" if total_silver == total_gold else "✗"
    print(f"{ok} Candidatos  Silver: {total_silver:,}  |  Gold: {total_gold:,}")

    aprovados_silver = (silver["aprovado"] == "S").sum()
    aprovados_gold   = gold["total_aprovados"].sum()
    ok = "✓" if aprovados_silver == aprovados_gold else "✗"
    print(f"{ok} Aprovados   Silver: {aprovados_silver:,}  |  Gold: {aprovados_gold:,}")

    efetivadas_silver = (silver["matricula"] == "EFETIVADA").sum()
    efetivadas_gold   = gold["total_efetivadas"].sum()
    ok = "✓" if efetivadas_silver == efetivadas_gold else "✗"
    print(f"{ok} Efetivadas  Silver: {efetivadas_silver:,}  |  Gold: {efetivadas_gold:,}")

    masc_silver = (silver["sexo"] == "M").sum()
    masc_gold   = gold["inscritos_masculino"].sum()
    ok = "✓" if masc_silver == masc_gold else "✗"
    print(f"{ok} Masculino   Silver: {masc_silver:,}  |  Gold: {masc_gold:,}")

    fem_silver = (silver["sexo"] == "F").sum()
    fem_gold   = gold["inscritos_feminino"].sum()
    ok = "✓" if fem_silver == fem_gold else "✗"
    print(f"{ok} Feminino    Silver: {fem_silver:,}  |  Gold: {fem_gold:,}")

    anos = sorted(gold["ano"].unique())
    print(f"\nAnos cobertos: {anos}")

    print("\nCandidatos por ano:")
    dist = gold.groupby("ano")["total_candidatos"].sum()
    for ano, n in dist.items():
        pct = n / total_gold * 100
        print(f"  {ano}  {n:>8,}  ({pct:.1f}%)")

    # sanidade: efetivadas nunca devem superar aprovados por grupo
    violacoes = gold[gold["total_efetivadas"] > gold["total_aprovados"]]
    if violacoes.empty:
        print("\n✓ Nenhuma linha com efetivadas > aprovados")
    else:
        print(f"\n✗ {len(violacoes)} linhas com efetivadas > aprovados (investigar):")
        print(violacoes[GROUP_COLS + ["total_aprovados", "total_efetivadas"]].to_string())


if __name__ == "__main__":
    main()
