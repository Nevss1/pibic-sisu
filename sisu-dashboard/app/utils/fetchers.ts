export async function fetchDadosdoCurso(cursoNome: string) {
  if (!cursoNome) return;

  const res = await fetch(`/api/dados?curso=${encodeURIComponent(cursoNome)}`);
  return res.json();
}

export async function fetchDadosTotal() {
  const res = await fetch(`/api/dados`);
  return res.json();
}

export async function fetchRankingConcorridos(ano?: string) {
  if (ano) {
    const res = await fetch(`/api/ranking?ano=${encodeURIComponent(ano)}`);
    return res.json();
  }
  const res = await fetch(`/api/ranking`);
  return res.json();
}

export async function fetchCursos() {
  const res = await fetch(`/api/cursos`);
  return res.json();
}
