import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export async function fetchHistoricoCurso(cursoNome: string) {
  const { data } = await api.get("/historico", {
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
