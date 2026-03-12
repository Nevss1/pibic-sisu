import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export async function GET() {
  const result = await pool.query(`
    WITH dados AS (
      SELECT *,
        CASE
          WHEN no_campus ILIKE '%complexo santa amélia%' THEN 'Cidade Universitária'
          WHEN no_campus ILIKE '%ciências sociais, saúde%' THEN 'CAMPUS DE IMPERATRIZ'
          ELSE no_campus
        END AS campus
      FROM sisu_ufma
    )
    SELECT
      no_curso,
      ano,
      campus,
      COUNT(*)::int AS total_candidatos
    FROM dados
    GROUP BY no_curso, ano, campus
    ORDER BY no_curso, ano, campus
  `);

  return NextResponse.json(result.rows);
}
