import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export async function GET() {
  const result = await pool.query(`
    SELECT
      no_curso,
      ano,
      COUNT(*)::int AS total_candidatos
    FROM sisu_ufma
    GROUP BY no_curso, ano
    ORDER BY no_curso, ano
  `);

  return NextResponse.json(result.rows);
}
