import axios from "axios";
import { AreasCurso, ModalidadesCurso, OverviewCurso } from "../types/sisu";

const api = axios.create({
  baseURL: "/api",
});

export async function fetchNomesCursos() {
  const { data } = await api.get("/cursos");
  return data;
}

export async function fetchCandidatosCursos() {
  const { data } = await api.get("/candidatos");
  return data as { no_curso: string; ano: string; campus: string; total_candidatos: number; aprovados: number }[];
}

export async function fetchDadosCurso(cursoNome?: string, edicao?: string) {
  const url = cursoNome ? `/cursos/${encodeURIComponent(cursoNome)}/overview` : `/cursos/overview`
  const { data } = await api.get<OverviewCurso>(url, { params: edicao ? { edicao } : {} })
  return data
}

export async function fetchAreasNotasCurso(cursoNome: string, edicao?: string) {
  const { data } = await api.get<AreasCurso>(`/cursos/${encodeURIComponent(cursoNome)}/areas`, {
    params: edicao ? { edicao } : {},
  })
  return data
}

export async function fetchAreasNotasUFMA() {
  const { data } = await api.get<AreasCurso>(`/areas`)
  return data
}

export async function fetchModalidadesCurso(cursoNome: string, edicao?: string) {
  const { data } = await api.get<ModalidadesCurso>(`/cursos/${encodeURIComponent(cursoNome)}/modalidades`, {
    params: edicao ? { edicao } : {},
  })
  return data
}
