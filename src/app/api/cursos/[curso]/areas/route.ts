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
      ROUND(AVG(nu_nota_m)::numeric, 2)::float        AS media_matematica,
      ROUND(AVG(nu_nota_l)::numeric, 2)::float        AS media_linguagens,
      ROUND(AVG(nu_nota_ch)::numeric, 2)::float       AS media_humanas,
      ROUND(AVG(nu_nota_cn)::numeric, 2)::float       AS media_natureza,
      ROUND(AVG(nu_nota_r)::numeric, 2)::float        AS media_redacao
    FROM sisu_ufma
    WHERE LOWER(no_curso) = LOWER($1)
    GROUP BY ano
    ORDER BY ano
    `,
    [nomeCurso]
  );

  return NextResponse.json(result.rows);
}
