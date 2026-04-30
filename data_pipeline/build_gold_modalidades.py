"""
Gera gold_modalidades_curso_ano_campus.csv a partir da Silver consolidada.

Granularidade: (ano, edicao, campus, curso, grau, turno, categoria)
Categorias atômicas (sem sobreposição):
  - Ampla concorrência  → GRUPO_CONCORRENCIA = 'AC'
  - Bônus Maranhão      → GRUPO_CONCORRENCIA = 'BONUS_MA'
  - Escola pública      → COTA + SUBGRUPO = SOCIAL
  - PPI                 → COTA + SUBGRUPO = PP
  - Indígenas           → COTA + SUBGRUPO = I
  - PcD                 → COTA + SUBGRUPO in (D, DD, PPD)

"Cota geral" NÃO é armazenada aqui — é calculada pelo frontend
como soma das 4 subcategorias de COTA (Escola pública + PPI + Indígenas + PcD).
"""

import numpy as np
import pandas as pd

ARQUIVO = "sisu_ufma_2017_2023.csv"
SAIDA   = "gold_modalidades_curso_ano_campus.csv"

GROUP_COLS = [
    "ano", "edicao",
    "codigo_campus", "nome_campus", "municipio_campus",
    "codigo_curso", "nome_curso", "grau", "turno",
    "categoria",
]

NUMERIC_COLS = ["ano", "edicao", "codigo_campus", "codigo_curso", "nota_candidato"]


def derivar_categoria(df: pd.DataFrame) -> pd.Series:
    g = df["grupo_concorrencia"]
    s = df["subgrupo_cota"]

    conditions = [
        g == "AC",
        g == "BONUS_MA",
        (g == "COTA") & (s == "SOCIAL"),
        (g == "COTA") & (s == "PP"),
        (g == "COTA") & (s == "I"),
        (g == "COTA") & (s.isin(["D", "DD", "PPD"])),
    ]
    choices = [
        "Ampla concorrência",
        "Bônus Maranhão",
        "Escola pública",
        "PPI",
        "Indígenas",
        "PcD",
    ]
    return pd.Series(np.select(conditions, choices, default=None), index=df.index)


def main():
    print(f"Lendo {ARQUIVO}...")
    df = pd.read_csv(ARQUIVO, dtype=str, encoding="utf-8", low_memory=False)
    df.columns = [c.lower() for c in df.columns]
    print(f"  {len(df):,} linhas carregadas")

    for col in NUMERIC_COLS:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    df["categoria"] = derivar_categoria(df)

    sem_categoria = df["categoria"].isna()
    if sem_categoria.any():
        print(f"\nATENÇÃO: {sem_categoria.sum():,} linhas sem categoria (serão descartadas):")
        print(
            df[sem_categoria][["grupo_concorrencia", "subgrupo_cota"]]
            .value_counts()
            .to_string()
        )
    df = df[~sem_categoria].copy()

    df["aprovado_s"] = df["aprovado"] == "S"

    print("\nAgregando...")
    gold = (
        df.groupby(GROUP_COLS, observed=True, dropna=False)
        .agg(
            total_candidatos=("aprovado_s", "count"),
            total_aprovados=("aprovado_s", "sum"),
            media_nota=("nota_candidato", "mean"),
        )
        .reset_index()
    )

    gold["total_candidatos"] = gold["total_candidatos"].astype(int)
    gold["total_aprovados"]  = gold["total_aprovados"].astype(int)
    gold["media_nota"]       = gold["media_nota"].round(4)
    gold["taxa_aprovacao"]   = (gold["total_aprovados"] / gold["total_candidatos"]).round(4)

    gold = gold.sort_values(["ano", "nome_campus", "nome_curso", "categoria"]).reset_index(drop=True)

    print(f"  {len(gold):,} linhas na Gold\n")
    _validar(df, gold)

    gold.to_csv(SAIDA, index=False)
    print(f"\nSalvo em: {SAIDA}")


def _validar(silver: pd.DataFrame, gold: pd.DataFrame):
    print("=== VALIDAÇÕES ===")

    # 1. Total de candidatos deve bater com a Silver (excluindo sem_categoria)
    total_silver = len(silver)
    total_gold   = gold["total_candidatos"].sum()
    ok = "✓" if total_silver == total_gold else "✗"
    print(f"{ok} Candidatos Silver: {total_silver:,}  |  Gold: {total_gold:,}")

    # 2. Total de aprovados
    aprovados_silver = (silver["aprovado"] == "S").sum()
    aprovados_gold   = gold["total_aprovados"].sum()
    ok = "✓" if aprovados_silver == aprovados_gold else "✗"
    print(f"{ok} Aprovados  Silver: {aprovados_silver:,}  |  Gold: {aprovados_gold:,}")

    # 3. Distribuição por categoria
    print("\nCandidatos por categoria:")
    dist = (
        gold.groupby("categoria")["total_candidatos"]
        .sum()
        .sort_values(ascending=False)
    )
    for cat, n in dist.items():
        pct = n / total_gold * 100
        print(f"  {cat:<25} {n:>8,}  ({pct:.1f}%)")

    # 4. Anos cobertos
    anos = sorted(gold["ano"].unique())
    print(f"\nAnos cobertos: {anos}")

    # 5. Presença por categoria × ano (detecta lacunas como SOCIAL ausente em 2022-2023)
    pivot = gold.pivot_table(
        index="categoria", columns="ano", values="total_candidatos",
        aggfunc="sum", fill_value=0
    )
    print("\nPresença por categoria × ano (0 = sem dados):")
    print(pivot.to_string())


if __name__ == "__main__":
    main()
