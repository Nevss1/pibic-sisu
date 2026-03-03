import { useMemo } from "react";
import { useDadosTotal } from "./useDadosTotal";
import { useRankingConcorridos } from "./useRankingConcorridos";
import { calcularMedia, calcularTotalCandidatos } from "../utils";

export function useMetricasGerais() {
  const { data: dados = [] } = useDadosTotal();
  const { data: rankingConcorridos = [] } = useRankingConcorridos();

  const metricas = useMemo(
    () => ({
      totalCandidatos: calcularTotalCandidatos(dados),
      mediaNotaCandidato: calcularMedia(dados, "media_nota_candidato"),
      mediaNotaCorte: calcularMedia(dados, "media_nota_corte"),
      taxaAprovacao: calcularMedia(dados, "taxa_aprovacao"),
      anos: dados.map((d) => d.ano),
    }),
    [dados],
  );

  return { dados, rankingConcorridos, metricas };
}
