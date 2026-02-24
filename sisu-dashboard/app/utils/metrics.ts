import { Dado, Dados } from "../types"

export function calcularMedia(dado: Dados, campo: keyof Dado) {
  if (dado.length > 0) {
    return (dado.reduce((acc, d) => acc + (d[campo] as number), 0) / dado.length).toFixed(2)
  } else {
    return "0"
  }
}

export function calcularDadosPorAno(dados: Dados, anosSelecionados: string[]) {
  return anosSelecionados.length === 0
    ? dados
    : dados.filter((d) => anosSelecionados.includes(d.ano));
}

export function calcularTotalCandidatos(dados: Dados) {
  return dados.flatMap((d) => d.total_inscritos).reduce((acc, v) => acc + Number(v), 0)
}