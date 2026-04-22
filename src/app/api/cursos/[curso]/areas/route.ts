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
      ano,
      nome_campus AS campus,
      ROUND(AVG(nota_m)::numeric, 2)::float        AS media_matematica,
      ROUND(AVG(nota_l)::numeric, 2)::float        AS media_linguagens,
      ROUND(AVG(nota_ch)::numeric, 2)::float       AS media_humanas,
      ROUND(AVG(nota_cn)::numeric, 2)::float       AS media_natureza,
      ROUND(AVG(nota_r)::numeric, 2)::float        AS media_redacao
    FROM silver_sisu_ufma
    WHERE LOWER(nome_curso) = LOWER($1)
    GROUP BY ano, nome_campus
    ORDER BY ano, nome_campus
    `,
    [nomeCurso]
  );

  return NextResponse.json(result.rows);
}
