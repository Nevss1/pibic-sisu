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
        END AS campus,
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
        END AS categoria
      FROM sisu_ufma
      WHERE LOWER(no_curso) = LOWER($1)
    )
    SELECT
      categoria,
      ano,
      campus,
      COUNT(*)::int                                                AS total_candidatos,
      COUNT(*) FILTER (WHERE st_aprovado = 'S')::int             AS aprovados,
      ROUND(AVG(nu_nota_candidato)::numeric, 2)::float           AS media_nota
    FROM dados
    GROUP BY categoria, ano, campus
    ORDER BY ano, campus, total_candidatos DESC
    `,
    [nomeCurso]
  );

  return NextResponse.json(result.rows);
}
