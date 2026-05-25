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
      ano,
      nome_campus AS campus,
      ROUND(AVG(nota_m)::numeric, 2)::float        AS media_matematica,
      ROUND(AVG(nota_l)::numeric, 2)::float        AS media_linguagens,
      ROUND(AVG(nota_ch)::numeric, 2)::float       AS media_humanas,
      ROUND(AVG(nota_cn)::numeric, 2)::float       AS media_natureza,
      ROUND(AVG(nota_r)::numeric, 2)::float        AS media_redacao
    FROM silver_sisu_ufma
    WHERE LOWER(nome_curso) = LOWER($1)
      AND ($2::int IS NULL OR edicao = $2::int)
    GROUP BY edicao, ano, nome_campus
    ORDER BY edicao, ano, nome_campus
    `,
    [nomeCurso, edicao]
  );

  return NextResponse.json(result.rows);
}
