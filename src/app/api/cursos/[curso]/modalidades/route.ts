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
      CASE
        WHEN LOWER(ds_mod_concorrencia) = 'ampla concorrência'
          OR LOWER(ds_mod_concorrencia) LIKE '%vagas de ampla concorrência%'
          THEN 'Ampla concorrência'
        WHEN LOWER(ds_mod_concorrencia) LIKE '%com deficiência%'
          THEN 'PcD'
        WHEN LOWER(ds_mod_concorrencia) LIKE '%indígenas%'
          THEN 'Indígenas'
        WHEN LOWER(ds_mod_concorrencia) LIKE '%pretos ou pardos%'
          THEN 'PPI'
        WHEN LOWER(ds_mod_concorrencia) LIKE '%1,5 salário%'
          THEN 'Baixa renda (EP + renda)'
        ELSE 'Escola pública'
      END AS categoria,
      ano,
      COUNT(*)::int                                                AS total_candidatos,
      COUNT(*) FILTER (WHERE st_aprovado = 'S')::int             AS aprovados,
      ROUND(AVG(nu_nota_candidato)::numeric, 2)::float           AS media_nota
    FROM sisu_ufma
    WHERE LOWER(no_curso) = LOWER($1)
    GROUP BY categoria, ano
    ORDER BY ano, total_candidatos DESC
    `,
    [nomeCurso]
  );

  return NextResponse.json(result.rows);
}
