import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const curso = searchParams.get("curso") || "";

  if (!curso) return NextResponse.json([]);

  const result = await pool.query(
    `
    SELECT nu_nota_candidato
    FROM sisu_ufma
    WHERE LOWER(no_curso) = LOWER($1)
    `,
    [curso]
  );

  return NextResponse.json(result.rows);
}
