import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ano = searchParams.get("ano");
  const limit = searchParams.get("limit") ?? "10";

  const result = await pool.query(
    `
    SELECT
      no_curso,
      COUNT(*)::int AS total_candidatos
    FROM sisu_ufma
    ${ano ? "WHERE ano = $1" : ""}
    GROUP BY no_curso
    ORDER BY total_candidatos DESC
    `,
    ano ? [ano] : []
  );

  return NextResponse.json(result.rows);
}
