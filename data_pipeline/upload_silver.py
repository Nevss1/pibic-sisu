import os
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL não encontrada no arquivo .env")

ARQUIVO = "sisu_ufma_2017_2023.csv"
TABELA = "silver_sisu_ufma"

NUMERIC_COLS = [
    "ANO", "EDICAO", "CODIGO_CAMPUS", "CODIGO_CURSO",
    "QT_VAGAS_CONCORRENCIA", "PERCENTUAL_BONUS",
    "PESO_L", "PESO_CH", "PESO_CN", "PESO_M", "PESO_R",
    "NOTA_MINIMA_L", "NOTA_MINIMA_CH", "NOTA_MINIMA_CN", "NOTA_MINIMA_M", "NOTA_MINIMA_R",
    "MEDIA_MINIMA",
    "DT_NASCIMENTO", "OPCAO",
    "NOTA_L", "NOTA_CH", "NOTA_CN", "NOTA_M", "NOTA_R",
    "NOTA_L_COM_PESO", "NOTA_CH_COM_PESO", "NOTA_CN_COM_PESO", "NOTA_M_COM_PESO", "NOTA_R_COM_PESO",
    "NOTA_CANDIDATO", "NOTA_CORTE", "CLASSIFICACAO"
]

def carregar_silver():
    print(f"Lendo arquivo: {ARQUIVO}")
    df = pd.read_csv(ARQUIVO, dtype=str, encoding="utf-8", low_memory=False)

    # nomes das colunas em minúsculo
    df.columns = [c.lower() for c in df.columns]

    # conversão das colunas numéricas
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
    carregar_silver()