import { pool } from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ curso: string }> }
) {
  const { curso } = await params;
  const nomeCurso = decodeURIComponent(curso);

  const result = await pool.query(
    `
    SELECT
      categoria,
      ano,
      nome_campus                                                                        AS campus,
      SUM(total_candidatos)::int                                                         AS total_candidatos,
      SUM(total_aprovados)::int                                                          AS aprovados,
      ROUND((SUM(media_nota * total_candidatos) / NULLIF(SUM(total_candidatos), 0))::numeric, 2)::float AS media_nota
    FROM gold_modalidades_curso_ano_campus
    WHERE LOWER(nome_curso) = LOWER($1)
    GROUP BY ano, nome_campus, categoria
    ORDER BY ano, nome_campus, total_candidatos DESC
    `,
    [nomeCurso]
  );

  return NextResponse.json(result.rows);
}
