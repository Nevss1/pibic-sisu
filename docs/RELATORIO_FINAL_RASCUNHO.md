## Universidade Federal do Maranhão
## AGEUFMA — Agência de Inovação, Empreendedorismo, Pesquisa, Pós-Graduação e Internacionalização
## CPICT — Coordenação de Programas PIBIC e PIBITI
## Centro de Ciências Exatas e Tecnologia
## Curso de Ciência da Computação

**Rafael Soares Britto Neves**
**Prof. Dr. Mário Antonio Meireles Teixeira**

# Análise de Desempenho de Workloads de Ciência de Dados em Ambientes Conteinerizados com Docker

São Luís
2026

---

## Informações do bolsista

**Nome:** Rafael Soares Britto Neves
**Curso:** Ciência da Computação
**Instituição:** Universidade Federal do Maranhão — UFMA
**Telefone:** [a preencher]
**E-mail:** [a preencher]

## Informações da instituição/departamento

**Nome:** Universidade Federal do Maranhão — Departamento de Informática
**Endereço:** Av. dos Portugueses, 1966 — Bacanga — São Luís — MA
**Telefone:** [a preencher]
**E-mail:** [a preencher]

## Informações do orientador

**Nome:** Prof. Dr. Mário Antonio Meireles Teixeira
**Departamento:** [a preencher]
**Telefone:** [a preencher]
**E-mail:** [a preencher]

---

# RESUMO

Este relatório apresenta o desenvolvimento parcial e a estruturação técnica do plano de trabalho PIBIC intitulado **"Análise de Desempenho de Workloads de Ciência de Dados em Ambientes Conteinerizados com Docker"**, vinculado ao projeto CNPq **"Avaliação de Desempenho de Aplicações em Ambientes Conteinerizados com Docker"**.

O trabalho teve como base a construção de um workload real de Ciência de Dados a partir dos dados públicos do Sistema de Seleção Unificada (SISU) referentes à Universidade Federal do Maranhão (UFMA). Para isso, foram coletados, tratados e consolidados arquivos CSV oficiais do SISU/MEC, no recorte de 2017 a 2023, abrangendo 14 edições regulares e resultando em uma base analítica com aproximadamente 1,08 milhão de registros. A partir dessa base, foi desenvolvido um pipeline ETL em Python com a biblioteca pandas, com modelagem em camadas Bronze, Silver e Gold, armazenamento em banco de dados PostgreSQL e disponibilização por meio de um dashboard web interativo.

Como resultado parcial, foi implementada uma infraestrutura analítica composta por scripts de processamento, tabelas estruturadas, uma camada de API de consulta, visualizações interativas e documentação técnica. O dashboard permite explorar indicadores como notas de corte, taxas de aprovação, modalidades de concorrência, distribuição por gênero, faixa etária, áreas do ENEM e análise de perfil histórico dos candidatos. Essa infraestrutura constitui o workload de Ciência de Dados que será utilizado na etapa experimental do projeto, na qual serão comparadas execuções locais e conteinerizadas com Docker.

Até o momento, a etapa de conteinerização e os benchmarks de desempenho ainda não foram executados. Este relatório registra os resultados técnicos alcançados, as limitações da versão atual e o planejamento da etapa experimental necessária para completar a avaliação de desempenho prevista no plano de trabalho.

**Palavras-chave:** Ciência de Dados; Docker; SISU; Dashboard; PostgreSQL; Avaliação de desempenho.

---

# SUMÁRIO

1. Introdução
2. Justificativa
3. Objetivos
   3.1 Objetivo Geral
   3.2 Objetivos Específicos
4. Metodologia
   4.1 Fonte dos dados
   4.2 Tratamento e privacidade
   4.3 Pipeline de dados
   4.4 Arquitetura da aplicação web
   4.5 Dashboard analítico
   4.6 Planejamento dos experimentos com Docker
5. Resultados e Discussão
   5.1 Base consolidada SISU/UFMA
   5.2 Pipeline analítico implementado
   5.3 Dashboard web desenvolvido
   5.4 Reprodutibilidade e documentação técnica
   5.5 Planejamento da avaliação de desempenho
6. Conclusão
Referências

---

# 1 INTRODUÇÃO

A utilização de pipelines de Ciência de Dados tornou-se uma prática central em aplicações modernas que dependem da coleta, transformação, armazenamento e visualização de grandes volumes de dados. Esses pipelines frequentemente envolvem múltiplas etapas computacionais — leitura de arquivos, limpeza de dados, transformação de atributos, agregações estatísticas, persistência em bancos de dados e disponibilização dos resultados para sistemas analíticos —, cada uma com características próprias de consumo de recursos e tempo de execução.

Paralelamente, a adoção de contêineres, especialmente por meio do Docker, tornou-se uma alternativa amplamente utilizada para padronizar ambientes de execução, reduzir problemas de incompatibilidade entre dependências e facilitar a reprodutibilidade de experimentos computacionais. Em projetos de Ciência de Dados, essa característica é particularmente relevante, uma vez que bibliotecas, versões de linguagem, drivers de banco de dados e configurações do ambiente podem influenciar diretamente o tempo de execução e o consumo de recursos.

Nesse contexto, este plano de trabalho tem como objetivo analisar workloads de Ciência de Dados executados em ambientes conteinerizados com Docker. Para isso, foi desenvolvido um caso de uso real baseado nos dados públicos do Sistema de Seleção Unificada (SISU), com foco nos cursos da Universidade Federal do Maranhão (UFMA). A partir desses dados, foi construído um pipeline ETL em Python e um dashboard analítico interativo, permitindo a exploração histórica de informações de ingresso na instituição.

O trabalho realizado até o momento concentrou-se na construção da infraestrutura analítica necessária para a etapa experimental. Foram consolidados dados de 2017 a 2023, modeladas e carregadas tabelas em banco de dados PostgreSQL e implementadas visualizações interativas no dashboard. A etapa seguinte consiste em conteinerizar o pipeline e executar benchmarks comparando a execução local com a execução em Docker.

---

# 2 JUSTIFICATIVA

Os dados do SISU são disponibilizados publicamente pelo Ministério da Educação, mas sua análise direta não é trivial. Os arquivos são volumosos, distribuídos por edição, possuem múltiplas colunas e exigem tratamento para que possam ser utilizados em análises comparativas. Além disso, não há ferramenta pública centralizada que permita explorar, de forma interativa, a evolução histórica dos cursos da UFMA em termos de nota de corte, aprovação, modalidades de concorrência e perfil dos candidatos.

A construção de um dashboard analítico para os dados do SISU/UFMA atende a uma necessidade prática de organização e visualização de dados públicos. Ao mesmo tempo, o pipeline desenvolvido para alimentar esse dashboard constitui uma carga de trabalho realista de Ciência de Dados, com etapas de leitura, transformação, agregação e persistência. Essa característica torna o projeto adequado para investigação de desempenho em ambientes conteinerizados.

Do ponto de vista acadêmico, o trabalho se justifica pela articulação entre três dimensões: dados públicos educacionais, engenharia de dados e avaliação de desempenho computacional. A análise do comportamento desse pipeline em execução local e em Docker poderá fornecer evidências sobre os custos e os benefícios da conteinerização em workloads analíticos, considerando métricas como tempo de execução, uso de CPU, consumo de memória e reprodutibilidade do ambiente.

---

# 3 OBJETIVOS

## 3.1 Objetivo Geral

Desenvolver e avaliar um workload de Ciência de Dados baseado nos dados públicos do SISU/UFMA, com o objetivo de analisar seu desempenho em ambiente local e em ambiente conteinerizado com Docker.

## 3.2 Objetivos Específicos

i. Coletar e consolidar dados públicos oficiais do SISU/MEC referentes à UFMA, no recorte de 2017 a 2023.

ii. Tratar, padronizar e reduzir os dados, removendo colunas identificadoras e mantendo apenas atributos analíticos relevantes.

iii. Modelar os dados em camadas Bronze, Silver e Gold, separando dados brutos consolidados, dados limpos e agregações otimizadas para consulta.

iv. Desenvolver um dashboard web para exploração histórica dos dados SISU/UFMA por curso, campus, modalidade, notas, áreas do ENEM, faixa etária e perfil.

v. Documentar o pipeline, suas dependências, tabelas e esquema de banco de dados para permitir reprodutibilidade.

vi. Conteinerizar o pipeline de dados com Docker.

vii. Executar benchmarks comparando a execução local e a execução conteinerizada.

viii. Coletar e analisar métricas de desempenho, como tempo de execução, consumo de CPU, consumo de memória e impactos de restrições de recursos.

---

# 4 METODOLOGIA

## 4.1 Fonte dos dados

Os dados utilizados neste trabalho foram obtidos a partir dos arquivos públicos oficiais do SISU disponibilizados pelo Ministério da Educação, por meio do portal de dados abertos. Foram utilizados arquivos CSV referentes às edições regulares do SISU, com recorte temporal de 2017 a 2023, totalizando 14 edições.

A partir desses arquivos, foi realizada filtragem para manter apenas registros associados à Universidade Federal do Maranhão. A base consolidada resultante possui aproximadamente 343 MB e cerca de 1,08 milhão de linhas.

Os dados de 2024 não foram incluídos nesta versão do projeto, pois isso exigiria uma nova etapa de coleta, validação de esquema e atualização das tabelas analíticas.

## 4.2 Tratamento e privacidade

Durante o tratamento, foram removidas colunas identificadoras ou potencialmente sensíveis, como CPF, nome do candidato e número de inscrição do ENEM. A base utilizada pelo dashboard não contém identificadores individuais, mantendo apenas atributos analíticos, como ano, edição, curso, campus, notas, classificação, situação de aprovação, situação de matrícula, sexo, modalidade de concorrência, grau e turno.

Um ponto importante da modelagem é que cada linha da base representa uma inscrição ou opção de curso no SISU, e não necessariamente um candidato único. Como identificadores pessoais foram removidos, não é possível contabilizar candidatos únicos com precisão. Portanto, métricas como "total de candidatos" ou "total de inscritos" devem ser interpretadas como totais de inscrições ou opções de curso.

Também foi estabelecida distinção entre aprovação e efetivação de matrícula. A situação de aprovação indica convocação pelo SISU, enquanto a efetivação de matrícula representa um subconjunto dos convocados que concluíram o processo de matrícula na instituição.

## 4.3 Pipeline de dados

O pipeline segue uma arquitetura em camadas denominada Bronze, Silver e Gold, cada uma com granularidade e finalidade distintas.

A camada Bronze corresponde à base de dados consolidada, ainda próxima dos microdados originais do SISU/MEC, armazenada em formato CSV. Essa camada não possui representação no banco de dados; o arquivo local constitui a própria Bronze.

A camada Silver reúne os dados tratados, padronizados e enriquecidos com atributos derivados — como a categorização de modalidade de concorrência (ampla concorrência, bônus regional ou cota) e o subgrupo de cota (social, racial, indígena ou pessoa com deficiência). Esses dados são carregados em uma tabela no banco de dados PostgreSQL com granularidade por inscrição individual, servindo como fonte de verdade para consultas analíticas.

A camada Gold contém tabelas de agregação pré-computadas, criadas para otimizar as consultas do dashboard e reduzir a carga sobre a camada Silver. Foram implementadas duas tabelas Gold: uma com agregações por curso, campus, ano, edição, grau e turno, contendo indicadores como total de inscrições, aprovações, médias de notas e distribuição por gênero; e outra com agregações por modalidade de concorrência, consolidando o desempenho e o volume de candidatos por categoria. A geração dessas tabelas é realizada por scripts de processamento em Python com a biblioteca pandas, e os resultados são persistidos no banco de dados em substituição à versão anterior a cada atualização da base. A Tabela 2 apresenta um resumo comparativo das três camadas, indicando o formato de armazenamento, a granularidade e a finalidade de cada uma.

[Tabela 2 — Estrutura das camadas Bronze, Silver e Gold. Fonte: Elaborado pelo autor.]

A Figura 1 ilustra o fluxo completo do pipeline ETL, desde a origem dos dados públicos do SISU até o consumo pelo dashboard analítico.

[Figura 1 — Fluxo do pipeline ETL: Bronze, Silver e Gold. Fonte: Elaborado pelo autor.]

## 4.4 Arquitetura da aplicação web

A aplicação web foi desenvolvida como plataforma de consulta interativa sobre a base analítica construída, utilizando Next.js como framework de desenvolvimento com React e TypeScript. A comunicação entre o frontend e o banco de dados ocorre por meio de uma camada de API intermediária que executa consultas SQL parametrizadas e retorna os dados em formato estruturado para as visualizações.

O armazenamento dos dados é realizado em um banco de dados PostgreSQL hospedado em serviço de nuvem, com acesso centralizado por meio de um pool de conexões. O frontend incorpora mecanismos de cache de estado do servidor para reduzir o número de requisições repetidas e melhorar a experiência de navegação em conjunto de dados volumosos.

Essa arquitetura constitui o componente de consumo do workload — a camada responsável por tornar a base analítica acessível para exploração interativa — e será incluída na etapa de conteinerização junto ao pipeline de dados. A Figura 2 apresenta um diagrama da arquitetura geral do sistema, indicando os componentes desenvolvidos e seus relacionamentos.

[Figura 2 — Arquitetura geral do sistema analítico SISU/UFMA. Fonte: Elaborado pelo autor.]

## 4.5 Dashboard analítico

O dashboard foi desenvolvido como artefato analítico para exploração histórica dos dados SISU/UFMA, organizando as visualizações em torno das seguintes dimensões de análise:

- **Por curso:** evolução histórica de indicadores como nota de corte, volume de inscrições, taxa de aprovação e taxa de efetivação de matrícula, com filtros por campus, ano e edição;
- **Por área do ENEM:** distribuição das médias de desempenho nas cinco áreas de avaliação — Linguagens, Matemática, Ciências Humanas, Ciências da Natureza e Redação;
- **Por modalidade de concorrência:** comparação de desempenho e volume de aprovações entre as modalidades de ampla concorrência, cotas sociais, raciais, indígenas e para pessoas com deficiência, além do bônus regional;
- **Por gênero:** análise da distribuição e da aprovação por sexo ao longo das edições;
- **Por faixa etária:** distribuição histórica de inscrições e aprovações segundo a faixa etária dos candidatos;
- **Por perfil de candidato:** consulta histórica com filtros combinados que permitem analisar subgrupos específicos da base.

A plataforma também oferece uma visão geral institucional com indicadores agregados da UFMA e um dicionário de dados que documenta os atributos disponíveis e as convenções adotadas na modelagem.

## 4.6 Planejamento dos experimentos com Docker

A etapa experimental com Docker ainda não foi executada. A proposta é utilizar o pipeline de dados como workload principal de Ciência de Dados e comparar sua execução em dois cenários:

1. execução local, sem contêiner, em ambiente de desenvolvimento padrão;
2. execução conteinerizada, com Docker, em ambiente controlado e reprodutível.

As métricas previstas incluem tempo total de execução do pipeline, tempo por etapa de processamento, consumo de CPU e consumo de memória durante a execução. Adicionalmente, poderá ser avaliado o impacto de restrições de recursos computacionais — como limites de CPU e RAM configuráveis via Docker — sobre o tempo de execução e a estabilidade do pipeline. A Tabela 3 apresenta a matriz de cenários experimentais previstos, detalhando as configurações de ambiente e as variações de restrição de recursos que serão avaliadas.

[Tabela 3 — Matriz de cenários experimentais previstos. Fonte: Elaborado pelo autor.]

A comparação entre os dois cenários permitirá analisar os custos e os benefícios da conteinerização para este tipo de workload analítico, produzindo evidências empíricas sobre reprodutibilidade, portabilidade e desempenho em ambientes conteinerizados.

---

# 5 RESULTADOS E DISCUSSÃO

## 5.1 Base consolidada SISU/UFMA

Como resultado inicial, foi construída uma base consolidada com dados do SISU referentes à UFMA no período de 2017 a 2023, abrangendo 14 edições regulares. A base resultante contém aproximadamente 1,08 milhão de registros e reúne, para cada inscrição, atributos de identificação do curso, campus, grau, turno, modalidade de concorrência, notas nas cinco áreas do ENEM, nota de corte, situação de aprovação e de efetivação de matrícula, além de atributos de perfil como sexo do candidato.

O recorte abrange cursos e campi da UFMA, permitindo análises tanto por curso específico quanto em perspectiva institucional. A consolidação dessa base transforma dados públicos dispersos — distribuídos em múltiplos arquivos CSV por edição — em um conjunto estruturado, padronizado e diretamente consultável para análises históricas comparativas. A Tabela 1 apresenta uma síntese das principais características da base consolidada.

[Tabela 1 — Caracterização da base SISU/UFMA consolidada (2017–2023). Fonte: Elaborado pelo autor.]

## 5.2 Pipeline analítico implementado

O pipeline de dados desenvolvido realiza as etapas de coleta, tratamento, consolidação e agregação dos dados, seguindo a arquitetura em camadas Bronze, Silver e Gold descrita na Metodologia. A camada Silver contém os dados granulares tratados, com aproximadamente 1,08 milhão de registros representando inscrições individuais, enquanto as tabelas Gold consolidam agregações pré-computadas para consumo eficiente pelo dashboard.

As dependências do pipeline foram registradas em arquivo de requisitos de ambiente, e o esquema das tabelas principais foi documentado em arquivo de definição de dados, possibilitando a reprodução do ambiente de execução em outras máquinas ou em contêineres Docker — etapa prevista para a sequência do trabalho.

Essa infraestrutura constitui o workload central do projeto: um conjunto de operações computacionais realistas — leitura de arquivo volumoso, transformação de atributos, geração de agregações e persistência em banco de dados relacional — que será avaliado em execução local e em ambiente conteinerizado na próxima fase.

## 5.3 Dashboard web desenvolvido

O dashboard web foi implementado como artefato analítico para exploração interativa dos dados SISU/UFMA. Permite visualizar, de forma consolidada e filtrada por campus, ano e edição, informações sobre cursos, modalidades de concorrência, áreas do ENEM, perfil dos candidatos e evolução histórica de indicadores de ingresso. A Figura 3 apresenta a tela de visão geral histórica de um curso, exibindo indicadores de inscrições, aprovações e a evolução da nota de corte ao longo das edições.

[Figura 3 — Dashboard: visão geral histórica de um curso. Fonte: Captura de tela do sistema desenvolvido pelo autor.]

As principais visualizações implementadas incluem evolução da nota de corte ao longo das edições, histograma de distribuição de notas dos inscritos, taxas de aprovação e de efetivação de matrícula, distribuição de inscrições e aprovações por sexo, análise comparativa por modalidade de concorrência e subgrupo de cota, desempenho médio nas áreas do ENEM, distribuição por faixa etária e análise histórica de perfis com filtros combinados. A Figura 4 ilustra a análise por modalidade de concorrência, apresentando a distribuição de inscrições e aprovações entre as seis categorias implementadas.

[Figura 4 — Dashboard: distribuição por modalidade de concorrência. Fonte: Captura de tela do sistema desenvolvido pelo autor.]

O dashboard cumpre duas funções complementares no projeto: serve como ferramenta de análise dos dados públicos do SISU/UFMA e constitui o componente de consumo do workload de Ciência de Dados, cuja execução conteinerizada será avaliada na etapa experimental.

## 5.4 Reprodutibilidade e documentação técnica

Para apoiar a reprodutibilidade do projeto, foram produzidos documentos que registram as dependências do ambiente de execução, o esquema das tabelas do banco de dados e uma visão geral técnica da arquitetura adotada. Essa documentação organiza os procedimentos necessários para replicar o pipeline em outro ambiente — condição essencial para a futura conteinerização com Docker.

O conjunto de artefatos documentados — definição de dependências, esquema do banco de dados e descrição da arquitetura — constitui a base sobre a qual serão construídos os Dockerfiles e o ambiente de testes da etapa experimental.

## 5.5 Planejamento da avaliação de desempenho

A avaliação empírica de desempenho, que constitui o objetivo experimental central deste plano de trabalho, será realizada na sequência do desenvolvimento. A infraestrutura analítica implementada — pipeline ETL e dashboard web — será conteinerizada com Docker e utilizada como workload para comparação de desempenho entre execução local e execução em ambiente conteinerizado.

Serão coletadas métricas de tempo total de execução do pipeline, tempo por etapa de processamento, consumo de CPU e consumo de memória. Adicionalmente, poderá ser avaliado o impacto de restrições de recursos — como limites de CPU e RAM configuráveis — sobre o comportamento do workload. Os resultados quantitativos dessa etapa, incluindo tabelas de métricas e análise comparativa dos cenários, serão incorporados à versão final do relatório.

---

# 6 CONCLUSÃO

O trabalho desenvolvido até o momento resultou na construção de uma infraestrutura analítica funcional no escopo atual, baseada em dados públicos do SISU/UFMA. O pipeline de dados — composto pelas etapas de consolidação, tratamento e agregação em camadas Bronze, Silver e Gold — processa aproximadamente 1,08 milhão de registros e os disponibiliza em banco de dados estruturado para consulta analítica. O dashboard web implementado permite a exploração interativa desses dados por múltiplas dimensões, incluindo curso, campus, modalidade de concorrência, áreas do ENEM, gênero, faixa etária e perfil histórico dos candidatos.

Esses resultados representam a construção do workload de Ciência de Dados que será avaliado na etapa experimental do plano de trabalho PIBIC. A infraestrutura desenvolvida fornece um caso de uso realista e documentado, adequado para a comparação de desempenho entre execução local e execução em ambiente conteinerizado com Docker.

Algumas limitações devem ser registradas nesta versão do trabalho. O recorte temporal está restrito ao período de 2017 a 2023, não incluindo edições posteriores do SISU. A remoção de identificadores pessoais dos dados — necessária por razões de privacidade — impede a contagem exata de candidatos únicos, de modo que as métricas de volume representam totais de inscrições, não de indivíduos distintos. Por fim, a avaliação empírica de desempenho em ambiente conteinerizado ainda não foi executada, sendo esta a etapa subsequente e essencial para o cumprimento integral dos objetivos do plano de trabalho.

Como próximos passos, serão implementados os Dockerfiles para o pipeline e para a aplicação web, definida a matriz de cenários experimentais e executados os benchmarks de desempenho. Os resultados quantitativos dessa etapa permitirão concluir, com base empírica, a análise dos impactos da conteinerização sobre o workload desenvolvido.

---

# REFERÊNCIAS

DOCKER INC. Docker Documentation. Disponível em: https://docs.docker.com/. Acesso em: 2025.

MERKEL, D. Docker: Lightweight Linux Containers for Consistent Development and Deployment. **Linux Journal**, v. 2014, n. 239, 2014.

MINISTÉRIO DA EDUCAÇÃO. Dados Abertos — SISU. Disponível em: https://dadosabertos.mec.gov.br/sisu. Acesso em: 2025.

PANDAS DEVELOPMENT TEAM. pandas Documentation. Disponível em: https://pandas.pydata.org/docs/. Acesso em: 2025.

POSTGRESQL GLOBAL DEVELOPMENT GROUP. PostgreSQL Documentation. Disponível em: https://www.postgresql.org/docs/. Acesso em: 2025.

SALUNKE, Sanket Vilas; OUDA, Abdelkader. A Performance Benchmark for the PostgreSQL and MySQL Databases. **Future Internet**, v. 16, n. 10, 2024. Disponível em: https://www.mdpi.com/1999-5903/16/10/382.

SOBIERAJ, Maciej; KOTYŃSKI, Daniel. Docker Performance Evaluation across Operating Systems. **Applied Sciences**, v. 14, n. 15, p. 6672, 2024. Disponível em: https://doi.org/10.3390/app14156672.

<!-- PENDÊNCIAS PARA RAFAEL (não publicar este bloco):
- Preencher telefone, e-mail e departamento do bolsista, da instituição e do orientador.
- Confirmar se o e-mail mario.meireles@ufma.br e o telefone (98) 98604-1403 podem ser usados no relatório.
- Buscar e adicionar referência sobre arquitetura de dados em camadas (medallion/lakehouse) — verificar Armbrust et al. 2021 "Lakehouse: A New Generation of Open Platforms that Unify Data Warehousing and Advanced Analytics" ou equivalente disponível nas bases da UFMA (Portal CAPES).
- Verificar se há publicação institucional (UFMA/CNPq) relacionada ao projeto do orientador que deva ser citada.
- Após execução dos benchmarks Docker: expandir seção 5.5 com tabelas de métricas e análise comparativa, ampliar a Conclusão com análise empírica e revisar o Resumo.
- DECISÃO REGISTRADA: referência ao k6 (Grafana Labs) foi removida. O benchmark deste projeto mede execução de pipeline Python (tempo de processamento ETL), não tráfego HTTP — k6 é ferramenta de load testing para APIs com usuários virtuais e não se aplica a este workload. Caso o escopo seja ampliado para incluir testes de carga no dashboard web, a referência pode ser reincorporada.
-->
