import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export async function GET() {
  const result = await pool.query(`
    SELECT
      nome_curso                 AS no_curso,
      ano,
      nome_campus                AS campus,
      SUM(total_candidatos)::int AS total_candidatos,
      SUM(total_aprovados)::int  AS aprovados
    FROM gold_overview_curso_ano_campus
    GROUP BY nome_curso, ano, nome_campus
    ORDER BY nome_curso, ano, nome_campus
  `);

  return NextResponse.json(result.rows);
}
