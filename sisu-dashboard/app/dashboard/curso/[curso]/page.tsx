// app/dashboard/curso/[curso]/page.tsx

import CursoClientPage from "./CursoClientPage";

export default async function CursoPage({ params }) {
  const { curso } = await params;
  const cursoDecoded = decodeURIComponent(curso);

  return <CursoClientPage curso={cursoDecoded} />;
}
