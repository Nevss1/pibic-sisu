import pandas as pd
from sqlalchemy import create_engine

DATABASE_URL =  'postgresql://neondb_owner:npg_s5KeiBV8kZpt@ep-bold-fog-acr5li04-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
engine = create_engine(DATABASE_URL)

NUMERIC_COLS = [
    "NU_ANO","NU_EDICAO","NU_PERCENTUAL_BONUS",
    "NU_PESO_L","NU_PESO_CH","NU_PESO_CN","NU_PESO_M","NU_PESO_R",
    "NOTA_MINIMA_L","NOTA_MINIMA_CH","NOTA_MINIMA_CN","NOTA_MINIMA_M","NOTA_MINIMA_R",
    "MEDIA_MINIMA",
    "NU_NOTA_L","NU_NOTA_CH","NU_NOTA_CN","NU_NOTA_M","NU_NOTA_R",
    "NOTA_L_COM_PESO","NOTA_CH_COM_PESO","NOTA_CN_COM_PESO",
    "NOTA_M_COM_PESO","NOTA_R_COM_PESO",
    "NU_NOTA_CANDIDATO","NU_NOTACORTE","NU_CLASSIFICACAO",
    "ANO"
]

def carregar_ano(year):
    filename = f"sisu_ufma_{year}.csv"
    print(f"\n=== Carregando ano {year} do arquivo {filename} ===")

    df = pd.read_csv(filename, sep=",", dtype=str, encoding="utf-8")

    df.columns = [c.lower() for c in df.columns]

    for col in NUMERIC_COLS:
        col = col.lower()
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    df.to_sql(
        "sisu_ufma",
        engine,
        if_exists="append",
        index=False
    )

    print(f"Ano {year} inserido com {len(df)} linhas.")


def main():
    for year in range(2018, 2024):  # agora 2018 a 2023
        carregar_ano(year)

if __name__ == "__main__":
    main()
