# Pipeline de Dados SISU/UFMA

Documentação do pipeline ETL responsável por transformar os dados públicos do SISU/MEC em tabelas analíticas consumidas pelo Dashboard SISU/UFMA.

---

## 1. Visão geral

O pipeline converte dados brutos de inscrições do SISU em tabelas estruturadas e pré-agregadas que alimentam o dashboard analítico. O processo segue a arquitetura **medalha** (Bronze → Silver → Gold):

- **Bronze:** arquivo CSV consolidado, próximo do dado original do MEC.
- **Silver:** tabela PostgreSQL com dados limpos, tipados e padronizados — granularidade de inscrição individual.
- **Gold:** tabelas agregadas por curso, ano, campus e modalidade — otimizadas para as consultas do dashboard.

O pipeline é executado manualmente e localmente. Não há agendador automático. Cada etapa é um script Python independente.

---

## 2. Fonte dos dados

| Atributo | Descrição |
|---|---|
| **Origem** | Dados abertos do Ministério da Educação (MEC) / SISU |
| **Formato** | CSV |
| **Recorte temporal** | Edições de 2017 a 2023 (14 edições no total) |
| **Recorte institucional** | Filtrado para cursos da UFMA (Universidade Federal do Maranhão) |
| **Forma de obtenção** | Download manual dos microdados oficiais; consolidação em arquivo único |
| **Periodicidade** | Dados históricos estáticos — não há atualização automática |

Os dados do SISU são disponibilizados pelo MEC em chamadas regulares (geralmente duas por ano). O arquivo consolidado `sisu_ufma_2017_2023.csv` reúne todas as edições do período em um único CSV.

---

## 3. Camadas de dados

### Bronze

A camada Bronze corresponde ao dado bruto, próximo do original do MEC, sem transformações significativas.

- **Arquivo:** `sisu_ufma_2017_2023.csv`
- **Tamanho:** ~343 MB, aproximadamente 1.080.713 linhas
- **Conteúdo:** dados consolidados a partir dos microdados do SISU, ainda próximos do formato original, antes da carga na camada Silver
- **Localização:** apenas local — o arquivo está listado no `.gitignore` e não é versionado

> O arquivo Bronze não possui tabela correspondente no banco. O CSV é a camada Bronze.

### Silver

A camada Silver é a representação limpa e padronizada da Bronze, carregada no banco PostgreSQL.

- **Tabela:** `silver_sisu_ufma`
- **Script de carga:** `upload_silver.py`
- **Transformações aplicadas:**
  - Nomes de colunas convertidos para minúsculas
  - Colunas numéricas tipadas corretamente (notas, códigos, pesos, anos)
  - Colunas derivadas incluídas: `grupo_concorrencia` (AC / BONUS_MA / COTA) e `subgrupo_cota` (SOCIAL / PP / I / D / DD / PPD)
- **Granularidade:** uma linha por inscrição — um mesmo candidato pode aparecer em até duas linhas (opção 1 e opção 2)
- **Carga:** `if_exists="replace"` — a tabela é recriada a cada execução
- **Tamanho esperado:** ~1.080.713 linhas

### Gold

As tabelas Gold são pré-agregações geradas a partir da Silver (ou do CSV Bronze), otimizadas para os endpoints do dashboard. Novas tabelas Gold são criadas sob demanda, conforme novas visualizações forem necessárias.

#### `gold_overview_curso_ano_campus`

- **Script de geração:** `build_gold_overview.py` (lê o CSV Bronze)
- **Script de carga:** `upload_gold_overview.py` (lê o CSV intermediário gerado acima)
- **Granularidade:** `(ano, edicao, codigo_campus, nome_campus, municipio_campus, codigo_curso, nome_curso, grau, turno)`
- **Métricas:** total de candidatos, aprovados, efetivações, médias e extremos de nota, distribuição por gênero, taxas de aprovação e efetivação
- **Carga:** `if_exists="replace"`

#### `gold_modalidades_curso_ano_campus`

- **Script de geração:** `build_gold_modalidades.py` (lê o CSV Bronze — acoplamento direto com o CSV, não com a Silver do banco)
- **Script de carga:** `upload_gold_modalidades.py` (lê o CSV intermediário gerado acima)
- **Granularidade:** `(ano, edicao, codigo_campus, nome_campus, municipio_campus, codigo_curso, nome_curso, grau, turno, categoria)`
- **Categorias (6, sem sobreposição):**

  | Categoria | Critério |
  |---|---|
  | Ampla concorrência | `grupo_concorrencia = 'AC'` |
  | Bônus Maranhão | `grupo_concorrencia = 'BONUS_MA'` |
  | Escola pública | `grupo_concorrencia = 'COTA'` e `subgrupo_cota = 'SOCIAL'` |
  | PPI | `grupo_concorrencia = 'COTA'` e `subgrupo_cota = 'PP'` |
  | Indígenas | `grupo_concorrencia = 'COTA'` e `subgrupo_cota = 'I'` |
  | PcD | `grupo_concorrencia = 'COTA'` e `subgrupo_cota in ('D', 'DD', 'PPD')` |

- **Métricas:** total de candidatos, aprovados, média de nota, taxa de aprovação
- **Nota:** "Cota geral" não é armazenada — é calculada pelo frontend como soma das 4 subcategorias de cota
- **Carga:** `if_exists="replace"`

---

## 4. Privacidade e tratamento de colunas sensíveis

Os microdados originais do SISU podem conter informações identificadoras. O pipeline foi construído com as seguintes premissas:

- **CPF**, **nome do candidato** e **número de inscrição no ENEM** não devem aparecer na Silver nem nas tabelas Gold carregadas no banco
- O dashboard consome exclusivamente dados analíticos e agregáveis — não há exposição de dados individuais identificáveis
- Quaisquer colunas identificadoras presentes no CSV Bronze devem ser removidas antes de carregar a Silver

> **Atenção:** antes de executar `upload_silver.py` em um novo CSV, verificar se o arquivo Bronze contém colunas identificadoras e, se necessário, removê-las ou excluí-las da lista de colunas carregadas.

---

## 5. Scripts existentes

| Script | Função | Entrada | Saída | Tabela impactada |
|---|---|---|---|---|
| `upload_silver.py` | Carrega o CSV Bronze na Silver do banco | `sisu_ufma_2017_2023.csv` | — | `silver_sisu_ufma` |
| `build_gold_overview.py` | Agrega métricas de overview por curso/ano/campus | `sisu_ufma_2017_2023.csv` | `gold_overview_curso_ano_campus.csv` | — |
| `upload_gold_overview.py` | Carrega o CSV de overview na tabela Gold | `gold_overview_curso_ano_campus.csv` | — | `gold_overview_curso_ano_campus` |
| `build_gold_modalidades.py` | Agrega candidatos e aprovados por modalidade/categoria | `sisu_ufma_2017_2023.csv` | `gold_modalidades_curso_ano_campus.csv` | — |
| `upload_gold_modalidades.py` | Carrega o CSV de modalidades na tabela Gold | `gold_modalidades_curso_ano_campus.csv` | — | `gold_modalidades_curso_ano_campus` |

> `build_gold_overview.py` aceita argumentos opcionais `--input` e `--output` para sobrescrever os caminhos padrão.

---

## 6. Ordem recomendada de execução

Os scripts devem ser executados na seguinte ordem. Os passos de build e upload são dependentes entre si — o CSV intermediário precisa existir antes do upload correspondente.

```
1. Preparar o arquivo .env com DATABASE_URL (ver seção 7)
2. Instalar dependências (ver seção 7)

# Silver
3. python upload_silver.py

# Gold overview
4. python build_gold_overview.py
5. python upload_gold_overview.py

# Gold modalidades
6. python build_gold_modalidades.py
7. python upload_gold_modalidades.py
```

> A Silver e as duas tabelas Gold são independentes entre si — os passos 3–5 e 6–8 podem ser executados em qualquer ordem relativa. A dependência obrigatória é sempre `build_*` antes do `upload_*` correspondente.

---

## 7. Configuração do ambiente

### Instalação

```bash
cd data_pipeline

# Criar e ativar ambiente virtual
python -m venv .venv
source .venv/bin/activate      # Linux/macOS
# .venv\Scripts\activate       # Windows

# Instalar dependências
pip install -r requirements.txt
```

### Variáveis de ambiente

Os scripts de upload leem a conexão com o banco a partir de um arquivo `.env` localizado em `data_pipeline/`. Crie o arquivo antes de executar qualquer upload:

```
# data_pipeline/.env
DATABASE_URL=postgresql://usuario:senha@host/banco
```

> O arquivo `.env` **não é versionado** (listado no `.gitignore`). Nunca commite credenciais reais.

O `DATABASE_URL` deve apontar para a instância PostgreSQL do Neon (ou outro servidor PostgreSQL compatível). A conexão usa SSL — o driver `psycopg2-binary` já suporta isso sem configuração adicional na string de conexão.

---

## 8. Banco de dados

| Atributo | Valor |
|---|---|
| **Provedor** | Neon (PostgreSQL serverless) |
| **Região** | AWS sa-east-1 |
| **Versão PostgreSQL** | Compatível com PostgreSQL 15+ |
| **Conexão** | Via `DATABASE_URL` no arquivo `.env` |

### Tabelas principais

| Tabela | Camada | Linhas esperadas | Observação |
|---|---|---|---|
| `silver_sisu_ufma` | Silver | ~1.080.713 | Recriada a cada carga (`if_exists="replace"`) |
| `gold_overview_curso_ano_campus` | Gold | Algumas centenas | Recriada a cada carga |
| `gold_modalidades_curso_ano_campus` | Gold | Algumas centenas × 6 categorias | Recriada a cada carga |

> **Atenção:** todos os scripts de upload usam `if_exists="replace"`, o que **derruba e recria** a tabela a cada execução. Não há migração incremental. Executar um upload sobrescreve todos os dados da tabela correspondente no banco.

---

## 9. Validações conhecidas

Os scripts `build_gold_overview.py` e `build_gold_modalidades.py` executam validações automáticas ao final da agregação, imprimindo no terminal um resumo comparativo entre Silver e Gold.

As verificações incluídas são:

- Total de candidatos (linhas) na Gold deve bater com o total no CSV de entrada
- Total de aprovados (`aprovado = 'S'`) deve ser igual entre Silver e Gold
- Total de efetivações (`matricula = 'EFETIVADA'`) deve ser igual entre Silver e Gold (apenas overview)
- Nenhuma linha da Gold deve ter `total_efetivadas > total_aprovados`
- Distribuição de candidatos por categoria e por ano (apenas modalidades)

### Distinções conceituais importantes

| Conceito | Definição |
|---|---|
| **Candidato / inscrição** | Cada linha da Silver representa uma inscrição em uma opção de curso. Um candidato pode ter até 2 linhas (opção 1 e opção 2). "Total de candidatos" neste contexto significa total de inscrições, não CPFs únicos. |
| **Aprovado** | `aprovado = 'S'` — candidato convocado para matrícula. É a fonte de verdade para taxa de aprovação. |
| **Efetivação** | `matricula = 'EFETIVADA'` — subconjunto dos aprovados que concluíram a matrícula. Não é sinônimo de aprovado. |
| **Nota de corte** | `nota_corte` — nota mínima para aprovação naquela modalidade/curso/edição. O campo `aprovado` é a fonte de verdade, não a comparação direta com `nota_corte`. |

---

## 10. Relação com Docker e PIBIC

Este pipeline é o **workload central de Ciência de Dados** do projeto de Iniciação Científica vinculado ao CNPq:

> *"Avaliação de Desempenho de Aplicações em Ambientes Conteinerizados com Docker"*
> Pesquisador: Rafael Soares Britto Neves — Ciência da Computação / UFMA
> Orientador: Prof. Dr. Mário Antonio Meireles Teixeira

O pipeline será usado como carga de trabalho real para comparar o desempenho de execução em ambiente local versus ambiente Docker. O dashboard web gerado a partir das tabelas Gold constitui o segundo artefato do workload.

**Estado atual da integração com Docker:**

- Nenhum Dockerfile ou docker-compose existe neste repositório
- Nenhum benchmark foi executado até o momento
- Este README documenta a base técnica necessária para a etapa experimental futura

**O que está planejado (não implementado):**

| Etapa | Descrição |
|---|---|
| Dockerfile para Python | Conteinerizar o pipeline ETL |
| docker-compose | Orquestrar pipeline + banco local para testes |
| Benchmark local | Medir tempo de execução e consumo de recursos sem Docker |
| Benchmark Docker | Mesma medição dentro de contêiner |
| Comparação | Análise dos resultados para o relatório final do PIBIC |

---

## 11. Pendências

| Item | Estado | Observação |
|---|---|---|
| Schema DDL SQL | Pendente | Não existe arquivo `.sql` documentando a estrutura das tabelas. O schema é inferido pelos scripts de upload e pelo pandas `to_sql`. |
| Índices no banco | Pendente | Nenhum índice documentado. Colunas candidatas: `nome_curso`, `nome_campus`, `ano`, `edicao`. |
| `requirements.txt` | **Concluído** | Criado com as 5 dependências identificadas nos scripts. |
| Gold de faixa etária | Melhoria futura | A visualização de faixa etária já existe na página `/geral` e consulta a Silver diretamente. Uma tabela Gold dedicada permanece como melhoria futura de performance e reprodutibilidade. |
| Gold para `/api/cursos/overview` | Melhoria futura | A rota ainda consulta a Silver diretamente; o `ARRAY_AGG` pesado já foi removido. Uma tabela Gold institucional pode ser criada futuramente, mas não é bloqueante. |
| Versionamento do CSV Bronze | Decisão pendente | O arquivo `sisu_ufma_2017_2023.csv` está no `.gitignore`. Considerar documentar uma URL ou fonte oficial para reprodução. |
| Dockerfiles e docker-compose | Futuro | Etapa experimental do PIBIC ainda não iniciada. |
