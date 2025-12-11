import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (q.length < 2) return NextResponse.json([]);

  const result = await pool.query(
    `
    SELECT DISTINCT no_curso 
    FROM sisu_ufma
    WHERE LOWER(no_curso) LIKE LOWER($1)
    ORDER BY no_curso ASC
    LIMIT 20
    `,
    [`%${q}%`]
  );

  return NextResponse.json(result.rows);
}
