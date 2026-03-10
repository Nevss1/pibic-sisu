import { useMemo } from "react";
import { useHistoricoGeral } from "./useHistoricoGeral";
import { useRankingConcorridos } from "./useRankingConcorridos";
import { calcularMedia, calcularTotalCandidatos } from "../utils";

export function useMetricasGerais(ano?: string) {
  const { data: todosOsDados = [] } = useHistoricoGeral();
  const { data: rankingConcorridos = [] } = useRankingConcorridos(ano);

  const dados = useMemo(
    () => (ano ? todosOsDados.filter((d) => d.ano === ano) : todosOsDados),
    [todosOsDados, ano],
  );

  const metricas = useMemo(
    () => ({
      totalCandidatos: calcularTotalCandidatos(dados),
      mediaNotaCandidato: calcularMedia(dados, "media_nota_candidato"),
      mediaNotaCorte: calcularMedia(dados, "media_nota_corte"),
      taxaAprovacao: calcularMedia(dados, "taxa_aprovacao"),
      anos: todosOsDados.map((d) => d.ano),
    }),
    [dados, todosOsDados],
  );

  return { dados, rankingConcorridos, metricas };
}
