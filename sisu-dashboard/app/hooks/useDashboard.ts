import { useState } from "react";
import { Dados } from "../types";
import { fetchDados } from "../utils";

export function useDashboard() {
  const [curso, setCurso] = useState("");
  const [dados, setDados] = useState<Dados>([]);
  const [anosSelecionados, setAnosSelecionados] = useState<string[]>([]);


  async function buscarDados(cursoNome: string) {
    if (!cursoNome) return;

    const json = await fetchDados(cursoNome);

    setDados(json);
    setAnosSelecionados([]);
  }

  const anos = [...new Set(dados.map((d) => d.ano))];

  return { curso, setCurso, dados, anosSelecionados, setAnosSelecionados, buscarDados, anos };
}