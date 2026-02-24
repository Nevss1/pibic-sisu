export async function fetchDadosdoCurso(cursoNome: string) {
  if (!cursoNome) return;

  const res = await fetch(`/api/dados?curso=${encodeURIComponent(cursoNome)}`);
  return res.json();
}
