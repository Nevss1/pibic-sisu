# 🎓 SISU UFMA — Dashboard Analítico

Projeto de Iniciação Científica (PIBIC/CNPq 2025–2026)

Dashboard interativo para análise de dados do SISU na Universidade Federal do Maranhão (UFMA), com foco em séries históricas, notas de corte, concorrência e estatísticas descritivas dos cursos.

---

## 📌 Objetivo

Construir uma plataforma web analítica que permita:

* Explorar a concorrência por curso ao longo dos anos
* Visualizar notas de corte e tendências
* Comparar cursos
* Analisar distribuições estatísticas
* Apoiar pesquisas acadêmicas com dados estruturados

---

## 🏗️ Arquitetura do Projeto

### 🔄 Pipeline de Dados

CSV (dados brutos)
→ Python (ETL e tratamento)
→ PostgreSQL (Neon)
→ API Next.js
→ Frontend (Next.js + React)

---

## 🛣️ Estrutura de Rotas (App Router)

```
/
/geral
/curso
/curso/[slug]
/curso/[slug]/historico
/curso/[slug]/estatisticas
/curso/[slug]/comparar
```

### 📍 Descrição das Rotas

* `/` → Página inicial com seleção de curso
* `/geral` → Informações institucionais e visão geral da UFMA
* `/curso` → Lista completa de cursos disponíveis
* `/curso/[slug]` → Página principal do curso (overview)
* Subrotas → Análises específicas do curso

---

## ⚙️ Tecnologias Utilizadas

### Frontend

* Next.js (App Router)
* React
* TypeScript
* Material UI (componentes)
* Framer Motion (animações)
* TanStack Query (gerenciamento de dados assíncronos)

### Backend

* API Routes do Next.js
* PostgreSQL (Neon)

### Processamento de Dados

* Python (ETL)
* Pandas

---

## 📊 Funcionalidades Principais

* 🔎 Seleção de curso via Autocomplete
* 📈 Visualização de séries históricas
* 📉 Análise de razão candidato/vaga
* 📊 Estatísticas descritivas (média, mediana, dispersão)
* 📂 Comparação entre cursos
* 🔄 Filtros por ano

---

## 🎯 Público-Alvo

* Estudantes interessados em ingressar na UFMA
* Pesquisadores
* Professores
* Gestão acadêmica

---

## 🚀 Como Rodar o Projeto

```bash
npm install
npm run dev
```

Acesse:

```
http://localhost:3000
```

---

## 📚 Estrutura de Pastas (Simplificada)

```
app/
  layout.tsx
  page.tsx
  geral/
  curso/
    page.tsx
    [slug]/
```

---

## 🔬 Contexto Acadêmico

Este projeto faz parte de um programa PIBIC com foco em análise exploratória de dados educacionais do SISU na UFMA (2018–2023).

---

## 👨‍💻 Autor

Rafael Neves
Ciência da Computação — UFMA
PIBIC/CNPq 2025–2026

---

## 📌 Status

🚧 Em desenvolvimento
