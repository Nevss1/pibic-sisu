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
    WITH dados AS (
      SELECT *,
        CASE
          WHEN no_campus ILIKE '%complexo santa amélia%' THEN 'Cidade Universitária'
          WHEN no_campus ILIKE '%ciências sociais, saúde%' THEN 'CAMPUS DE IMPERATRIZ'
          ELSE no_campus
        END AS campus
      FROM sisu_ufma
      WHERE LOWER(no_curso) = LOWER($1)
    )
    SELECT
      ano,
      campus,
      ROUND(AVG(nu_nota_m)::numeric, 2)::float        AS media_matematica,
      ROUND(AVG(nu_nota_l)::numeric, 2)::float        AS media_linguagens,
      ROUND(AVG(nu_nota_ch)::numeric, 2)::float       AS media_humanas,
      ROUND(AVG(nu_nota_cn)::numeric, 2)::float       AS media_natureza,
      ROUND(AVG(nu_nota_r)::numeric, 2)::float        AS media_redacao
    FROM dados
    GROUP BY ano, campus
    ORDER BY ano, campus
    `,
    [nomeCurso]
  );

  return NextResponse.json(result.rows);
}
