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