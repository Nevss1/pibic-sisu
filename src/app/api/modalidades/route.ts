import { pool } from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await pool.query(`
    SELECT
      ds_mod_concorrencia AS modalidade,
      ano,
      COUNT(*)::int                                        AS total_candidatos,
      COUNT(*) FILTER (WHERE st_aprovado = 'S')::int      AS aprovados
    FROM sisu_ufma
    GROUP BY ds_mod_concorrencia, ano
    ORDER BY ano, total_candidatos DESC
  `);

  return NextResponse.json(result.rows);
}
