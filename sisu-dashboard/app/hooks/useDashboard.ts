import { useState } from "react";
import { Dados } from "../types";
import { fetchDadosdoCurso, fetchDadosTotal } from "../utils";

export function useDashboard() {
  const [curso, setCurso] = useState("");
  const [dados, setDados] = useState<Dados>([]);
  const [anosSelecionados, setAnosSelecionados] = useState<string[]>([]);


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

  const anos = [...new Set(dados.map((d) => d.ano))];

  return { curso, setCurso, dados, anosSelecionados, setAnosSelecionados, buscarDados, buscarDadosTotal, anos };
}