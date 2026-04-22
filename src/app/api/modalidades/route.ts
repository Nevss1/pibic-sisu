import { pool } from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await pool.query(`
    SELECT
      grupo_concorrencia AS modalidade,
      ano,
      COUNT(*)::int                                        AS total_candidatos,
      COUNT(*) FILTER (WHERE aprovado = 'S')::int         AS aprovados
    FROM silver_sisu_ufma
    GROUP BY grupo_concorrencia, ano
    ORDER BY ano, total_candidatos DESC
  `);

  return NextResponse.json(result.rows);
}
