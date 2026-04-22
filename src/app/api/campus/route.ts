import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export async function GET() {
  const result = await pool.query(
    `
    SELECT
      nome_campus,
      COUNT(DISTINCT nome_curso)::int AS qtd_cursos,
      ARRAY_AGG(DISTINCT nome_curso ORDER BY nome_curso) AS cursos
    FROM silver_sisu_ufma
    GROUP BY nome_campus
    ORDER BY qtd_cursos DESC
    `
  );

  return NextResponse.json(result.rows);
}
