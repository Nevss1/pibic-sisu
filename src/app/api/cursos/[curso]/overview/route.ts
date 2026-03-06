import { pool } from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ curso: string }> }
) {
  const { curso } = await params;
  const nomeCurso = decodeURIComponent(curso);
  console.log(nomeCurso)

  const result = await pool.query(
    `
    SELECT
      ano,
      COUNT(*)::int                                                                AS total_inscritos,
      COUNT(*) FILTER (WHERE st_aprovado = 'S')::int                             AS aprovados,
      ARRAY_AGG(nu_nota_candidato ORDER BY nu_nota_candidato)                    AS notas,
      ROUND(AVG(nu_nota_candidato)::numeric, 2)::float                           AS media_nota_candidato,
      ROUND(AVG(nu_notacorte)::numeric, 2)::float                                AS media_nota_corte,
      ROUND(MIN(nu_nota_candidato)::numeric, 2)::float                           AS min_nota_candidato,
      ROUND(MAX(nu_nota_candidato)::numeric, 2)::float                           AS max_nota_candidato,
      ROUND(MIN(nu_notacorte)::numeric, 2)::float                                AS min_nota_corte,
      ROUND(MAX(nu_notacorte)::numeric, 2)::float                                AS max_nota_corte,
      ROUND(
        ((COUNT(*) FILTER (WHERE st_aprovado = 'S')::float / COUNT(*)::float) * 100)::numeric,
        2
      )::float                                                                    AS taxa_aprovacao
    FROM sisu_ufma
    WHERE LOWER(no_curso) = LOWER($1)
    GROUP BY ano
    ORDER BY ano
    `,
    [nomeCurso]
  );

  return NextResponse.json(result.rows);
}
