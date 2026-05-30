export type Dado = {
  ano: string
  media_nota_candidato: number
  media_nota_corte: number
  notas: number[]
  total_inscritos: string
  aprovados: string
  taxa_aprovacao: number
}

export type Dados = Dado[]

export type HistogramaBin = {
  bin_start: number
  count: number
}

export type DadoOverviewCurso = {
  edicao: number
  ano: string
  campus: string
  total_inscritos: number
  aprovados: number
  bins: HistogramaBin[]
  media_nota_candidato: number
  media_nota_corte: number
  min_nota_candidato: number
  max_nota_candidato: number
  min_nota_corte: number
  max_nota_corte: number
  inscritos_masculino: number
  inscritos_feminino: number
  taxa_aprovacao: number
  total_efetivadas: number
  taxa_efetivacao_sobre_aprovados: number
}

export type OverviewCurso = DadoOverviewCurso[]

export type DadoAreasCurso = {
  edicao: number
  ano: string
  campus: string
  media_matematica: number
  media_linguagens: number
  media_humanas: number
  media_natureza: number
  media_redacao: number
}

export type AreasCurso = DadoAreasCurso[]

export type DadoModalidadesCurso = {
  edicao: number
  categoria: string
  ano: string
  campus: string
  total_candidatos: number
  aprovados: number
  media_nota: number | null
}

export type ModalidadesCurso = DadoModalidadesCurso[]

export type DadoGeneroCurso = {
  ano: string
  campus: string
  sexo: string
  total_candidatos: number
  aprovados: number
  taxa_aprovacao: number
}

export type GeneroCurso = DadoGeneroCurso[]

/**
 * Linha retornada por GET /api/faixas-etarias.
 *
 * A idade estimada é calculada internamente como (ano - dt_nascimento).
 * O frontend nunca recebe dt_nascimento nem idades individuais —
 * apenas faixas etárias agregadas.
 */
export type DadoFaixaEtaria = {
  /** Ano do processo seletivo (ex: "2023") */
  ano: string
  /** Campus (ex: "São Luís") */
  campus: string
  /**
   * Faixa etária estimada.
   * Valores possíveis: 'Menos de 18' | '18 a 20' | '21 a 24' | '25 a 29' | '30 a 39' | '40 ou mais'
   */
  faixa_etaria: string
  /** Total de inscrições nessa faixa, campus e ano */
  total_candidatos: number
}

export type FaixasEtarias = DadoFaixaEtaria[]