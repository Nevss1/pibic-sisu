
export default async function CursoPage({ params }) {
  console.log(params)
  const { curso } = await params;
  const cursoDecoded = decodeURIComponent(curso);

  return null
}
