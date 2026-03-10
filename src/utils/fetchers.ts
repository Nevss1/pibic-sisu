import axios from "axios";
import { Dados, OverviewCurso } from "../types/sisu";

const api = axios.create({
  baseURL: "/api",
});

export async function fetchHistoricoCurso(cursoNome: string): Promise<Dados> {
  const { data } = await api.get<Dados>("/historico", {
    params: { curso: cursoNome },
  });
  return data;
}

export async function fetchHistoricoGeral() {
  const { data } = await api.get("/historico");
  return data;
}

export async function fetchRankingConcorridos(ano?: string) {
  const { data } = await api.get("/ranking", {
    params: ano ? { ano } : undefined,
  });
  return data;
}

export async function fetchNomesCursos() {
  const { data } = await api.get("/cursos");
  return data;
}

export async function fetchCandidatosCursos(ano?: string, limit?: number) {
  const { data } = await api.get("/candidatos", {
    params: { ...(ano ? { ano } : {}), ...(limit ? { limit } : {}) },
  });
  return data as { no_curso: string; total_candidatos: number }[];
}

export async function fetchDadosCurso(cursoNome: string): Promise<OverviewCurso> {
  const { data } = await api.get<OverviewCurso>(`/cursos/${cursoNome}/overview`)
  console.log("dados")
  return data
}
