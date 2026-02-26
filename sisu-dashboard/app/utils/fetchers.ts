export async function fetchDadosdoCurso(cursoNome: string) {
  if (!cursoNome) return;

  const res = await fetch(`/api/dados?curso=${encodeURIComponent(cursoNome)}`);
  return res.json();
}

export async function fetchDadosTotal() {
  const res = await fetch(`/api/dados`);
  return res.json();
}
