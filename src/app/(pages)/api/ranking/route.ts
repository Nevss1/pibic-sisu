import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

// ranking 5 cursos mais concorridos (razao_inscritos_por_vaga)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ano = searchParams.get("ano");

  const result = await pool.query(
    `
    SELECT
      no_curso,
      COUNT(*)::int AS total_inscritos,
      COUNT(*) FILTER (WHERE st_aprovado = 'S')::int AS vagas,
      ROUND(
        COUNT(*)::numeric / NULLIF(COUNT(*) FILTER (WHERE st_aprovado = 'S'), 0),
        2
      )::float AS razao_inscritos_por_vaga
    FROM sisu_ufma
    ${ano ? "WHERE ano = $1" : ""}
    GROUP BY no_curso
    HAVING COUNT(*) FILTER (WHERE st_aprovado = 'S') > 0
    ORDER BY razao_inscritos_por_vaga DESC
    LIMIT 5
    `,
    ano ? [ano] : []
  );

  return NextResponse.json(result.rows);
}
