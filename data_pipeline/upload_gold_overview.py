import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL não encontrada no arquivo .env")

ARQUIVO = "gold_overview_curso_ano_campus.csv"
TABELA = "gold_overview_curso_ano_campus"

NUMERIC_COLS = [
    "ANO",
    "EDICAO",
    "CODIGO_CAMPUS",
    "CODIGO_CURSO",
    "TOTAL_CANDIDATOS",
    "TOTAL_APROVADOS",
    "TOTAL_EFETIVADAS",
    "MEDIA_NOTA_CANDIDATO",
    "MEDIA_NOTA_CORTE",
    "MIN_NOTA_CANDIDATO",
    "MAX_NOTA_CANDIDATO",
    "MIN_NOTA_CORTE",
    "MAX_NOTA_CORTE",
    "INSCRITOS_MASCULINO",
    "INSCRITOS_FEMININO",
    "TAXA_APROVACAO",
    "TAXA_EFETIVACAO_SOBRE_APROVADOS",
    "TAXA_EFETIVACAO_SOBRE_CANDIDATOS"
]

def carregar_gold():
    print(f"Lendo arquivo: {ARQUIVO}")
    df = pd.read_csv(ARQUIVO, dtype=str, encoding="utf-8", low_memory=False)

    df.columns = [c.lower() for c in df.columns]

    for col in NUMERIC_COLS:
        col = col.lower()
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    print(f"Total de linhas lidas: {len(df)}")
    print("Conectando ao banco...")

    engine = create_engine(DATABASE_URL)

    print(f"Enviando dados para a tabela '{TABELA}'...")
    df.to_sql(
        TABELA,
        engine,
        if_exists="replace",
        index=False,
        chunksize=1000
    )

    print("Upload concluído com sucesso.")
    print(f"Tabela '{TABELA}' criada com {len(df)} linhas.")

if __name__ == "__main__":
    carregar_gold()