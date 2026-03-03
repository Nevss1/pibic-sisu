import { useMemo } from "react";
import { useHistoricoGeral } from "./useHistoricoGeral";
import { useRankingConcorridos } from "./useRankingConcorridos";
import { calcularMedia, calcularTotalCandidatos } from "../utils";

export function useMetricasGerais() {
  const { data: dados = [] } = useHistoricoGeral();
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
