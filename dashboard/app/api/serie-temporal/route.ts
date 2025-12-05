import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const curso = searchParams.get("curso");

  if (!curso) {
    return NextResponse.json(
      { error: "Parâmetro 'curso' é obrigatório" },
      { status: 400 }
    );
  }

  const sql = `
    SELECT
      ano,
      AVG(nu_nota_candidato) AS media_nota_candidato,
      AVG(nu_notacorte) AS media_nota_corte
    FROM sisu_ufma
    WHERE LOWER(no_curso) = LOWER($1)
    GROUP BY ano
    ORDER BY ano;
  `;

  try {
    const rows = await query(sql, [curso]);
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
