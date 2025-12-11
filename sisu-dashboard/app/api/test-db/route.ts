import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const rows = await query(`
      SELECT ano, COUNT(*) AS total
      FROM sisu_ufma
      GROUP BY ano
      ORDER BY ano;
    `);

    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
