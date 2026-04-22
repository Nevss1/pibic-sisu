import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export async function GET() {
  const result = await pool.query(`
    SELECT
      nome_curso AS no_curso,
      ano,
      nome_campus AS campus,
      COUNT(*)::int                                    AS total_candidatos,
      COUNT(*) FILTER (WHERE aprovado = 'S')::int     AS aprovados
    FROM silver_sisu_ufma
    GROUP BY nome_curso, ano, nome_campus
    ORDER BY nome_curso, ano, nome_campus
  `);

  return NextResponse.json(result.rows);
}
