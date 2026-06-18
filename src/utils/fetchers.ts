import axios from "axios";
import { AreasCurso, FaixasEtarias, GeneroCurso, ModalidadesCurso, OverviewCurso } from "../types/sisu";

const api = axios.create({
  baseURL: "/api",
});

export async function fetchNomesCursos() {
  const { data } = await api.get("/cursos");
  return data;
}

export async function fetchCandidatosCursos() {
  const { data } = await api.get("/candidatos");
  return data as { no_curso: string; ano: string; campus: string; total_candidatos: number; aprovados: number; media_nota_corte: number | null }[];
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

export async function fetchGeneroCurso(cursoNome: string, edicao?: string) {
  const { data } = await api.get<GeneroCurso>(`/cursos/${encodeURIComponent(cursoNome)}/genero`, {
    params: edicao ? { edicao } : {},
  })
  return data
}

/**
 * Busca a distribuição de inscrições por faixa etária estimada.
 * Agrupa por (ano, campus, faixa_etaria).
 * Nunca retorna dt_nascimento nem idades individuais.
 *
 * @param campus — se fornecido, filtra no servidor; omitir para buscar todos os campuses
 * @param edicao — se fornecido, filtra pela edição do SISU
 */
export async function fetchFaixasEtarias(campus?: string, edicao?: string) {
  const params: Record<string, string> = {};
  if (campus) params.campus = campus;
  if (edicao) params.edicao = edicao;
  const { data } = await api.get<FaixasEtarias>("/faixas-etarias", {
    params: Object.keys(params).length ? params : undefined,
  });
  return data;
}
