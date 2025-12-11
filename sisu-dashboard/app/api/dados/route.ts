import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const curso = searchParams.get("curso") || "";

  if (!curso) return NextResponse.json([]);

  const result = await pool.query(
    `
    SELECT 
    ano,
    AVG(nu_nota_candidato) AS media_nota_candidato,
    AVG(nu_notacorte) AS media_nota_corte,
    ARRAY_AGG(nu_nota_candidato) AS notas,

    COUNT(*) AS total_inscritos,
    COUNT(*) FILTER (WHERE st_aprovado = 'S') AS aprovados,
    (COUNT(*) FILTER (WHERE st_aprovado = 'S')::float / COUNT(*)::float) * 100 AS taxa_aprovacao

    FROM sisu_ufma
    WHERE LOWER(no_curso) = LOWER($1)
    GROUP BY ano
    ORDER BY ano;
    `,
    [curso]
  );

  return NextResponse.json(result.rows);
}
