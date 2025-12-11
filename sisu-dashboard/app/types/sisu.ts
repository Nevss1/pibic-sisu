export type Dado = {
  ano: string
  media_nota_candidato: number
  media_nota_corte: number
  notas: number[]
  total_inscritos: number
  aprovados: number
  taxa_aprovacao: number
}

export type Dados = Dado[]