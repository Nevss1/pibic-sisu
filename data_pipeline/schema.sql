-- =============================================================================
-- schema.sql — Dashboard SISU/UFMA
-- =============================================================================
--
-- AVISO IMPORTANTE:
--   Este arquivo é um DDL *documentacional/sugerido*, derivado da análise dos
--   scripts do pipeline (upload_silver.py, build_gold_overview.py,
--   build_gold_modalidades.py e respectivos scripts de upload).
--
--   O schema real no banco Neon pode divergir deste DDL porque as tabelas são
--   atualmente criadas via pandas.to_sql(..., if_exists="replace"), que infere
--   tipos automaticamente e NÃO cria constraints, chaves primárias ou índices.
--
--   Divergências conhecidas entre o banco atual e este DDL:
--     - Colunas aqui tipadas como SMALLINT ou INTEGER podem estar armazenadas
--       como FLOAT8 (double precision) no banco, pois o pandas converte colunas
--       numéricas com qualquer NaN para float64 antes do upload.
--     - Nenhuma PRIMARY KEY, UNIQUE, NOT NULL ou CHECK constraint existe
--       atualmente nas tabelas reais.
--
--   Antes de usar este DDL para criar/recriar as tabelas em produção:
--     1. Valide os tipos reais com:
--          SELECT column_name, data_type
--          FROM information_schema.columns
--          WHERE table_name = '<tabela>';
--        ou com \d <tabela> no psql.
--     2. Alternativamente, extraia o DDL real com:
--          pg_dump --schema-only --no-owner <banco>
--
-- Finalidade deste arquivo:
--   - Documentação técnica para o relatório do PIBIC
--   - Referência para reprodução do banco em ambiente Docker
--   - Base para definição formal de schema em iterações futuras
--
-- Este arquivo não contém dados e não deve ser executado contra o banco Neon
-- de produção sem revisão prévia dos tipos e constraints.
-- =============================================================================


-- =============================================================================
-- TABELA: silver_sisu_ufma
-- =============================================================================
-- Origem:      CSV Bronze (sisu_ufma_2017_2023.csv)
-- Script:      upload_silver.py
-- Mecanismo:   pandas.to_sql, if_exists="replace", chunksize=1000
-- Granulidade: uma linha por inscrição/opção de curso no SISU
-- Linhas:      ~1.080.713
--
-- Nota sobre colunas derivadas:
--   grupo_concorrencia e subgrupo_cota não vêm dos microdados originais do MEC.
--   São calculadas durante o processamento do CSV Bronze antes da carga.
--
-- Nota sobre dt_nascimento:
--   Armazena o ANO de nascimento como número (ex: 1999.0), não uma data.
--   O pandas converte para float64, resultando em FLOAT8 no banco.
--   A rota /api/faixas-etarias calcula a idade como: ROUND(ano) - ROUND(dt_nascimento).
-- =============================================================================

-- DROP TABLE IF EXISTS silver_sisu_ufma;

CREATE TABLE silver_sisu_ufma (

    -- -------------------------------------------------------------------------
    -- Identificação da edição SISU
    -- No banco atual (via pandas): provavelmente FLOAT8
    -- -------------------------------------------------------------------------
    ano                     SMALLINT,           -- ex: 2017, 2018, ..., 2023
    edicao                  SMALLINT,           -- 1ª ou 2ª edição do SISU no ano

    -- -------------------------------------------------------------------------
    -- Identificação do campus e curso
    -- -------------------------------------------------------------------------
    codigo_campus           INTEGER,
    nome_campus             TEXT,
    municipio_campus        TEXT,
    codigo_curso            INTEGER,
    nome_curso              TEXT,
    grau                    TEXT,               -- ex: 'Bacharel', 'Licenciatura', 'Tecnólogo'
    turno                   TEXT,               -- ex: 'Matutino', 'Noturno', 'Integral'

    -- -------------------------------------------------------------------------
    -- Vagas e regras da modalidade
    -- -------------------------------------------------------------------------
    qt_vagas_concorrencia   INTEGER,
    percentual_bonus        DOUBLE PRECISION,   -- percentual de bônus (Bônus Maranhão)

    -- -------------------------------------------------------------------------
    -- Pesos por área do ENEM
    -- -------------------------------------------------------------------------
    peso_l                  DOUBLE PRECISION,   -- linguagens
    peso_ch                 DOUBLE PRECISION,   -- ciências humanas
    peso_cn                 DOUBLE PRECISION,   -- ciências da natureza
    peso_m                  DOUBLE PRECISION,   -- matemática
    peso_r                  DOUBLE PRECISION,   -- redação

    -- -------------------------------------------------------------------------
    -- Notas mínimas por área
    -- -------------------------------------------------------------------------
    nota_minima_l           DOUBLE PRECISION,
    nota_minima_ch          DOUBLE PRECISION,
    nota_minima_cn          DOUBLE PRECISION,
    nota_minima_m           DOUBLE PRECISION,
    nota_minima_r           DOUBLE PRECISION,
    media_minima            DOUBLE PRECISION,

    -- -------------------------------------------------------------------------
    -- Dados do candidato
    -- -------------------------------------------------------------------------
    dt_nascimento           DOUBLE PRECISION,   -- ano de nascimento (float, não DATE — ver nota acima)
    opcao                   SMALLINT,           -- 1ª ou 2ª opção de curso do candidato
    sexo                    TEXT,               -- 'M' | 'F'

    -- -------------------------------------------------------------------------
    -- Notas brutas por área do ENEM
    -- -------------------------------------------------------------------------
    nota_l                  DOUBLE PRECISION,
    nota_ch                 DOUBLE PRECISION,
    nota_cn                 DOUBLE PRECISION,
    nota_m                  DOUBLE PRECISION,
    nota_r                  DOUBLE PRECISION,   -- redação

    -- -------------------------------------------------------------------------
    -- Notas ponderadas (nota_area * peso_area)
    -- -------------------------------------------------------------------------
    nota_l_com_peso         DOUBLE PRECISION,
    nota_ch_com_peso        DOUBLE PRECISION,
    nota_cn_com_peso        DOUBLE PRECISION,
    nota_m_com_peso         DOUBLE PRECISION,
    nota_r_com_peso         DOUBLE PRECISION,

    -- -------------------------------------------------------------------------
    -- Resultado da inscrição
    -- -------------------------------------------------------------------------
    nota_candidato          DOUBLE PRECISION,   -- nota final ponderada do candidato
    nota_corte              DOUBLE PRECISION,   -- nota mínima para aprovação na modalidade
    classificacao           INTEGER,            -- posição do candidato na lista
    aprovado                TEXT,               -- 'S' = convocado | 'N' = não convocado
    matricula               TEXT,               -- 'EFETIVADA' = efetivou matrícula (subconjunto de aprovados)

    -- -------------------------------------------------------------------------
    -- Modalidade de concorrência (colunas DERIVADAS — não vêm do MEC)
    -- -------------------------------------------------------------------------
    grupo_concorrencia      TEXT,               -- 'AC' | 'BONUS_MA' | 'COTA'
    subgrupo_cota           TEXT                -- 'SOCIAL' | 'PP' | 'I' | 'D' | 'DD' | 'PPD' | NULL

    -- -------------------------------------------------------------------------
    -- Colunas adicionais do CSV Bronze (a confirmar no banco real)
    -- O script upload_silver.py carrega TODAS as colunas do CSV sem filtragem
    -- explícita. O CSV original do MEC pode conter campos adicionais não
    -- referenciados pelas rotas de API atuais.
    -- -------------------------------------------------------------------------

);


-- =============================================================================
-- TABELA: gold_overview_curso_ano_campus
-- =============================================================================
-- Origem:      Agregação do CSV Bronze via build_gold_overview.py
-- Script:      upload_gold_overview.py
-- Mecanismo:   pandas.to_sql, if_exists="replace", chunksize=1000
-- Granulidade: (ano, edicao, codigo_campus, nome_campus, municipio_campus,
--               codigo_curso, nome_curso, grau, turno)
--
-- Todas as métricas são calculadas sobre inscrições (linhas da Silver),
-- não sobre candidatos únicos.
--
-- Colunas de agrupamento: 9
-- Colunas de métricas:   15
-- Total:                 24 colunas
-- =============================================================================

-- DROP TABLE IF EXISTS gold_overview_curso_ano_campus;

CREATE TABLE gold_overview_curso_ano_campus (

    -- -------------------------------------------------------------------------
    -- Chave composta de agrupamento
    -- No banco atual (via pandas): ano, edicao, codigo_campus, codigo_curso
    -- podem estar como FLOAT8 em vez de SMALLINT/INTEGER
    -- -------------------------------------------------------------------------
    ano                                 SMALLINT,
    edicao                              SMALLINT,
    codigo_campus                       INTEGER,
    nome_campus                         TEXT,
    municipio_campus                    TEXT,
    codigo_curso                        INTEGER,
    nome_curso                          TEXT,
    grau                                TEXT,
    turno                               TEXT,

    -- -------------------------------------------------------------------------
    -- Métricas de volume
    -- Calculadas com .astype(int) no build; chegam ao banco como BIGINT
    -- -------------------------------------------------------------------------
    total_candidatos                    INTEGER         NOT NULL,
    total_aprovados                     INTEGER         NOT NULL,
    total_efetivadas                    INTEGER         NOT NULL,

    -- -------------------------------------------------------------------------
    -- Métricas de notas (arredondadas a 4 casas decimais no build)
    -- Podem ser NULL quando não há dados para o grupo
    -- -------------------------------------------------------------------------
    media_nota_candidato                DOUBLE PRECISION,
    media_nota_corte                    DOUBLE PRECISION,
    min_nota_candidato                  DOUBLE PRECISION,
    max_nota_candidato                  DOUBLE PRECISION,
    min_nota_corte                      DOUBLE PRECISION,
    max_nota_corte                      DOUBLE PRECISION,

    -- -------------------------------------------------------------------------
    -- Distribuição por gênero
    -- -------------------------------------------------------------------------
    inscritos_masculino                 INTEGER         NOT NULL,
    inscritos_feminino                  INTEGER         NOT NULL,

    -- -------------------------------------------------------------------------
    -- Taxas (podem ser NULL quando o denominador = 0, via pd.NA no build)
    -- Arredondadas a 4 casas decimais; expressas como proporção (0.0–1.0),
    -- não como percentual — as rotas de API multiplicam por 100 conforme necessário
    -- -------------------------------------------------------------------------
    taxa_aprovacao                      DOUBLE PRECISION,
    taxa_efetivacao_sobre_aprovados     DOUBLE PRECISION,
    taxa_efetivacao_sobre_candidatos    DOUBLE PRECISION

);


-- =============================================================================
-- TABELA: gold_modalidades_curso_ano_campus
-- =============================================================================
-- Origem:      Agregação do CSV Bronze via build_gold_modalidades.py
-- Script:      upload_gold_modalidades.py
-- Mecanismo:   pandas.to_sql, if_exists="replace", chunksize=1000
-- Granulidade: (ano, edicao, codigo_campus, nome_campus, municipio_campus,
--               codigo_curso, nome_curso, grau, turno, categoria)
--
-- A coluna `categoria` é derivada a partir de grupo_concorrencia + subgrupo_cota.
-- "Cota geral" não é armazenada: o frontend a calcula somando as subcategorias.
--
-- Colunas de agrupamento: 10 (inclui categoria)
-- Colunas de métricas:     4
-- Total:                  14 colunas
-- =============================================================================

-- DROP TABLE IF EXISTS gold_modalidades_curso_ano_campus;

CREATE TABLE gold_modalidades_curso_ano_campus (

    -- -------------------------------------------------------------------------
    -- Chave composta de agrupamento
    -- -------------------------------------------------------------------------
    ano                 SMALLINT,
    edicao              SMALLINT,
    codigo_campus       INTEGER,
    nome_campus         TEXT,
    municipio_campus    TEXT,
    codigo_curso        INTEGER,
    nome_curso          TEXT,
    grau                TEXT,
    turno               TEXT,

    -- -------------------------------------------------------------------------
    -- Categoria de modalidade (derivada, 6 valores possíveis)
    --   'Ampla concorrência' | 'Bônus Maranhão' | 'Escola pública'
    --   'PPI' | 'Indígenas' | 'PcD'
    -- -------------------------------------------------------------------------
    categoria           TEXT            NOT NULL,

    -- -------------------------------------------------------------------------
    -- Métricas (calculadas com .astype(int) ou .round(4) no build)
    -- -------------------------------------------------------------------------
    total_candidatos    INTEGER         NOT NULL,
    total_aprovados     INTEGER         NOT NULL,
    media_nota          DOUBLE PRECISION,           -- pode ser NULL se nota_candidato ausente
    taxa_aprovacao      DOUBLE PRECISION            -- total_aprovados / total_candidatos, round(4)

);


-- =============================================================================
-- ÍNDICES RECOMENDADOS
-- =============================================================================
--
-- Os índices abaixo estão comentados por padrão.
-- Para ativá-los, remova o comentário de bloco (/* ... */) e execute no banco.
--
-- Nenhum índice existe atualmente nas tabelas (criadas via pandas.to_sql).
--
-- PRIORIDADE DE CRIAÇÃO:
--   1. silver — LOWER(nome_curso)          impacto máximo: full scan de 1M+ linhas evitado
--   2. silver — (LOWER(nome_curso), edicao, nome_campus)   endpoints de curso com filtro edição
--   3. gold_overview — LOWER(nome_curso)   consultas de overview por curso
--   4. gold_modalidades — LOWER(nome_curso) consultas de modalidades por curso
--   5. silver — (ano, nome_campus)         agrupamentos em /api/areas e /api/cursos/overview
--   6. silver — dt_nascimento              filtro em /api/faixas-etarias
-- =============================================================================

/*

-- -----------------------------------------------------------------------------
-- silver_sisu_ufma
-- -----------------------------------------------------------------------------

-- Índice funcional em LOWER(nome_curso)
-- Usado em: WHERE LOWER(nome_curso) = LOWER($1) por 6+ endpoints.
-- Sem este índice, cada query por curso faz full scan de ~1.080.713 linhas.
CREATE INDEX IF NOT EXISTS idx_silver_nome_curso_lower
    ON silver_sisu_ufma (LOWER(nome_curso));

-- Índice composto para endpoints de curso com filtro de edição e campus
-- Usado em: /api/cursos/[curso]/areas, /api/cursos/[curso]/genero,
--           /api/cursos/[curso]/overview (bins na Silver)
CREATE INDEX IF NOT EXISTS idx_silver_curso_edicao_campus
    ON silver_sisu_ufma (LOWER(nome_curso), edicao, nome_campus);

-- Índice para agrupamentos por ano e campus
-- Usado em: /api/areas, /api/cursos/overview, /api/faixas-etarias
CREATE INDEX IF NOT EXISTS idx_silver_ano_campus
    ON silver_sisu_ufma (ano, nome_campus);

-- Índice em dt_nascimento para a rota de faixas etárias
-- Usado em: WHERE dt_nascimento BETWEEN 1950 AND 2010
CREATE INDEX IF NOT EXISTS idx_silver_dt_nascimento
    ON silver_sisu_ufma (dt_nascimento);


-- -----------------------------------------------------------------------------
-- gold_overview_curso_ano_campus
-- -----------------------------------------------------------------------------

-- Índice funcional em LOWER(nome_curso)
-- Usado em: WHERE LOWER(nome_curso) = LOWER($1) em /api/cursos/[curso]/overview
CREATE INDEX IF NOT EXISTS idx_gold_overview_nome_curso_lower
    ON gold_overview_curso_ano_campus (LOWER(nome_curso));

-- Índice em edicao para filtro opcional
-- Usado em: AND ($2::int IS NULL OR edicao = $2::int)
CREATE INDEX IF NOT EXISTS idx_gold_overview_edicao
    ON gold_overview_curso_ano_campus (edicao);


-- -----------------------------------------------------------------------------
-- gold_modalidades_curso_ano_campus
-- -----------------------------------------------------------------------------

-- Índice funcional em LOWER(nome_curso)
-- Usado em: WHERE LOWER(nome_curso) = LOWER($1) em /api/cursos/[curso]/modalidades
CREATE INDEX IF NOT EXISTS idx_gold_modalidades_nome_curso_lower
    ON gold_modalidades_curso_ano_campus (LOWER(nome_curso));

-- Índice em edicao para filtro opcional
-- Usado em: AND ($2::int IS NULL OR edicao = $2::int)
CREATE INDEX IF NOT EXISTS idx_gold_modalidades_edicao
    ON gold_modalidades_curso_ano_campus (edicao);

*/


-- =============================================================================
-- NOTAS FINAIS
-- =============================================================================
--
-- 1. AUSÊNCIA DE CHAVES PRIMÁRIAS
--    Nenhuma das tabelas possui PRIMARY KEY declarada. O pandas.to_sql não cria
--    PKs. Para as tabelas Gold, uma PK composta seria:
--
--    gold_overview:    (ano, edicao, codigo_campus, codigo_curso, grau, turno)
--    gold_modalidades: (ano, edicao, codigo_campus, codigo_curso, grau, turno, categoria)
--
--    Para a Silver não há chave natural única (uma inscrição não tem ID próprio
--    neste dataset — o CSV não inclui número de inscrição no SISU).
--
-- 2. TIPOS REAIS PODEM DIVERGIR
--    O pandas.to_sql usa float64 para qualquer coluna que passou por
--    pd.to_numeric(), inclusive quando semanticamente são inteiros (ano, edicao,
--    classificacao, opcao). No banco real, essas colunas provavelmente são FLOAT8.
--    As rotas de API fazem casts explícitos (::int, ::float) para compensar.
--
-- 3. RISCO DO if_exists="replace"
--    Todos os scripts de upload usam if_exists="replace", que executa DROP TABLE
--    seguido de CREATE TABLE. Não há migração incremental. Executar um script de
--    upload apaga e recria a tabela inteira, incluindo índices e constraints que
--    tenham sido criados manualmente após o último upload.
--    → Recriar índices sempre após um novo upload.
--
-- 4. VALIDAÇÃO RECOMENDADA ANTES DO DOCKER
--    Antes de usar este schema.sql como DDL definitivo em ambiente Docker,
--    execute no banco Neon:
--
--    SELECT column_name, data_type, is_nullable
--    FROM information_schema.columns
--    WHERE table_schema = 'public'
--      AND table_name IN (
--        'silver_sisu_ufma',
--        'gold_overview_curso_ano_campus',
--        'gold_modalidades_curso_ano_campus'
--      )
--    ORDER BY table_name, ordinal_position;
--
-- =============================================================================
