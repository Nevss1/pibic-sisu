import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// nomes dos cursos

export async function GET() {
  const result = await pool.query(
    `
    SELECT DISTINCT no_curso 
    FROM sisu_ufma
    ORDER BY no_curso
    `
  );

  return NextResponse.json(result.rows);
}
