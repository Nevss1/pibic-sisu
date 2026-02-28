import { useState } from "react";
import { Dados } from "../types";
import { fetchDadosdoCurso, fetchDadosTotal, fetchRankingConcorridos } from "../utils";

export function useDashboard() {
  const [curso, setCurso] = useState("");
  const [dados, setDados] = useState<Dados>([]);
  const [anosSelecionados, setAnosSelecionados] = useState<string[]>([]);
  const [rankingConcorridos, setRankingConcorridos] = useState<Dados>([]);

  async function buscarDados(cursoNome: string) {
    if (!cursoNome) return;

    const json = await fetchDadosdoCurso(cursoNome);

    setDados(json);
    setAnosSelecionados([]);
  }

  async function buscarDadosTotal() {
    const json = await fetchDadosTotal();

    setDados(json);
  }

  async function buscarRankingConcorridos(ano?: string) {
    const json = await fetchRankingConcorridos(ano);

    setRankingConcorridos(json);
  }

  const anos = [...new Set(dados.map((d) => d.ano))];

  return { curso, setCurso, dados, anosSelecionados, setAnosSelecionados, buscarDados, buscarDadosTotal, anos, rankingConcorridos, buscarRankingConcorridos };
}