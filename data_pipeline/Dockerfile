# Dockerfile — pipeline compute-only (build_gold_*) do Dashboard SISU/UFMA
#
# Executa apenas os scripts de agregação que leem/gravam CSV em disco, sem
# acesso ao banco de dados. O CSV de entrada NÃO é copiado para a imagem —
# deve ser montado por volume em /data no momento do `docker run`.
#
# Build (a partir da raiz do repo):
#   docker build -f data_pipeline/Dockerfile -t pibic-sisu-pipeline:benchmark data_pipeline
#
# Uso (montando o diretório data_pipeline como volume):
#   docker run --rm -v "$PWD/data_pipeline:/data" pibic-sisu-pipeline:benchmark \
#     python build_gold_overview.py --input /data/sisu_ufma_sample.csv --output /data/gold_overview_docker_sample.csv

FROM python:3.12-slim

WORKDIR /app

# GNU time — necessário para `/usr/bin/time -v` (pico de RSS) na instrumentação
# de benchmark executada DENTRO do container. Não copia dados nem código aqui.
RUN apt-get update \
    && apt-get install -y --no-install-recommends time \
    && rm -rf /var/lib/apt/lists/*

# Dependências primeiro, para aproveitar o cache de camadas do Docker
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Apenas os scripts compute-only necessários ao benchmark.
# Os scripts upload_*.py não entram: dependem de banco/SQLAlchemy.
COPY build_gold_overview.py build_gold_modalidades.py ./

# CMD seguro: não processa dados nem acessa rede/banco, apenas mostra a ajuda.
CMD ["python", "build_gold_overview.py", "--help"]
