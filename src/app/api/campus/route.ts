import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export async function GET() {
  const result = await pool.query(
    `
    SELECT
      no_campus,
      COUNT(DISTINCT no_curso)::int AS qtd_cursos,
      ARRAY_AGG(DISTINCT no_curso ORDER BY no_curso) AS cursos
    FROM sisu_ufma
    GROUP BY no_campus
    ORDER BY qtd_cursos DESC
    `
  );

  return NextResponse.json(result.rows);
}
