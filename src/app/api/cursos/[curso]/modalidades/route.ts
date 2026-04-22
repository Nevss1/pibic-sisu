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
        WHEN grupo_concorrencia = 'AC'                                         THEN 'Ampla concorrência'
        WHEN grupo_concorrencia = 'BONUS_MA'                                   THEN 'Bônus Maranhão'
        WHEN grupo_concorrencia = 'COTA' AND subgrupo_cota = 'SOCIAL'         THEN 'Escola pública'
        WHEN grupo_concorrencia = 'COTA' AND subgrupo_cota = 'PP'             THEN 'PPI'
        WHEN grupo_concorrencia = 'COTA' AND subgrupo_cota = 'I'              THEN 'Indígenas'
        WHEN grupo_concorrencia = 'COTA' AND subgrupo_cota IN ('D','DD','PPD') THEN 'PcD'
        ELSE grupo_concorrencia
      END AS categoria,
      ano,
      nome_campus AS campus,
      COUNT(*)::int                                               AS total_candidatos,
      COUNT(*) FILTER (WHERE aprovado = 'S')::int                AS aprovados,
      ROUND(AVG(nota_candidato)::numeric, 2)::float              AS media_nota
    FROM silver_sisu_ufma
    WHERE LOWER(nome_curso) = LOWER($1)
    GROUP BY grupo_concorrencia, subgrupo_cota, ano, nome_campus
    ORDER BY ano, nome_campus, total_candidatos DESC
    `,
    [nomeCurso]
  );

  return NextResponse.json(result.rows);
}
