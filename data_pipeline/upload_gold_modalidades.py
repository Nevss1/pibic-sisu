import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL não encontrada no arquivo .env")

ARQUIVO = "gold_modalidades_curso_ano_campus.csv"
TABELA  = "gold_modalidades_curso_ano_campus"

NUMERIC_COLS = [
    "ano", "edicao", "codigo_campus", "codigo_curso",
    "total_candidatos", "total_aprovados",
    "media_nota", "taxa_aprovacao",
]


def carregar():
    print(f"Lendo {ARQUIVO}...")
    df = pd.read_csv(ARQUIVO, dtype=str, encoding="utf-8", low_memory=False)

    for col in NUMERIC_COLS:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    print(f"  {len(df):,} linhas | colunas: {list(df.columns)}")
    print("Conectando ao banco...")

    engine = create_engine(DATABASE_URL)

    print(f"Enviando para '{TABELA}'...")
    df.to_sql(TABELA, engine, if_exists="replace", index=False, chunksize=1000)

    print(f"Concluído — {len(df):,} linhas na tabela '{TABELA}'.")


if __name__ == "__main__":
    carregar()
