export type Dado = {
  ano: string
  media_nota_candidato: number
  media_nota_corte: number
  notas: number[]
  total_inscritos: string
  aprovados: string
  taxa_aprovacao: number
}

export type DadoRanking = {
  no_curso: string
  razao_inscritos_por_vaga: number
}

export type Dados = Dado[]

export type DadoOverviewCurso = {
  ano: string
  total_inscritos: number
  aprovados: number
  notas: number[]
  media_nota_candidato: number
  media_nota_corte: number
  min_nota_candidato: number
  max_nota_candidato: number
  min_nota_corte: number
  max_nota_corte: number
  inscritos_masculino: number
  inscritos_feminino: number
  taxa_aprovacao: number
}

export type OverviewCurso = DadoOverviewCurso[]

export type DadoAreasCurso = {
  ano: string
  media_matematica: number
  media_linguagens: number
  media_humanas: number
  media_natureza: number
  media_redacao: number
}

export type AreasCurso = DadoAreasCurso[]

export type DadoModalidadesCurso = {
  categoria: string
  ano: string
  total_candidatos: number
  aprovados: number
  media_nota: number | null
}

export type ModalidadesCurso = DadoModalidadesCurso[]