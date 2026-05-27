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
      ano,
      nome_campus                                                                AS campus,
      sexo,
      COUNT(*)::int                                                              AS total_candidatos,
      SUM(CASE WHEN aprovado = 'S' THEN 1 ELSE 0 END)::int                      AS aprovados,
      ROUND(
        (SUM(CASE WHEN aprovado = 'S' THEN 1 ELSE 0 END)::float
          / NULLIF(COUNT(*), 0) * 100)::numeric,
        2
      )::float                                                                   AS taxa_aprovacao
    FROM silver_sisu_ufma
    WHERE LOWER(nome_curso) = LOWER($1)
      AND ($2::int IS NULL OR edicao = $2::int)
      AND sexo IS NOT NULL
    GROUP BY ano, nome_campus, sexo
    ORDER BY ano, nome_campus, sexo
    `,
    [nomeCurso, edicao]
  );

  return NextResponse.json(result.rows);
}
