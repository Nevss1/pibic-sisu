import { pool } from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ curso: string }> }
) {
  const { curso } = await params;
  const nomeCurso = decodeURIComponent(curso);
  const { searchParams } = new URL(req.url);
  const edicao = searchParams.get("edicao") ? Number(searchParams.get("edicao")) : null;

  const result = await pool.query(
    `
    SELECT
      edicao,
      categoria,
      ano,
      nome_campus                                                                        AS campus,
      SUM(total_candidatos)::int                                                         AS total_candidatos,
      SUM(total_aprovados)::int                                                          AS aprovados,
      ROUND((SUM(media_nota * total_candidatos) / NULLIF(SUM(total_candidatos), 0))::numeric, 2)::float AS media_nota
    FROM gold_modalidades_curso_ano_campus
    WHERE LOWER(nome_curso) = LOWER($1)
      AND ($2::int IS NULL OR edicao = $2::int)
    GROUP BY edicao, ano, nome_campus, categoria
    ORDER BY edicao, ano, nome_campus, total_candidatos DESC
    `,
    [nomeCurso, edicao]
  );

  return NextResponse.json(result.rows);
}
