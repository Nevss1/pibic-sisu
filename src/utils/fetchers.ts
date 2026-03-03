import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export async function fetchDadosdoCurso(cursoNome: string) {
  if (!cursoNome) return;

  const { data } = await api.get("/dados", {
    params: { curso: cursoNome },
  });

  return data;
}

export async function fetchDadosTotal() {
  const { data } = await api.get("/dados");
  return data;
}

export async function fetchRankingConcorridos(ano?: string) {
  const { data } = await api.get("/ranking", {
    params: ano ? { ano } : undefined,
  });

  return data;
}

export async function fetchCursos() {
  const { data } = await api.get("/cursos");
  return data;
}
