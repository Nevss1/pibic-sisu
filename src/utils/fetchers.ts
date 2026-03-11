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

export async function fetchCandidatosCursos() {
  const { data } = await api.get("/candidatos");
  return data as { no_curso: string; ano: string; total_candidatos: number }[];
}

export async function fetchDadosCurso(cursoNome?: string): Promise<OverviewCurso> {
  const url = cursoNome ? `/cursos/${encodeURIComponent(cursoNome)}/overview` : `/cursos/overview`
  const { data } = await api.get<OverviewCurso>(url)
  return data
}
