import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const area = searchParams.get("nome")?.toLowerCase();

  if (!area) {
    return NextResponse.json({ error: "Área não informada." }, { status: 400 });
  }

  let coluna: string | null = null;

  switch (area) {
    case "exatas":
      coluna = "nu_nota_m";
      break;
    case "humanas":
      coluna = "nu_nota_l";
      break;
    case "ciencias":
      coluna = "nu_nota_cn";
      break;
    case "redacao":
      coluna = "nu_nota_r";
      break;
    case "geral":
      coluna = "nu_nota_candidato";
      break;
    default:
      return NextResponse.json({ error: "Área inválida." }, { status: 400 });
  }

  const query = `
    SELECT ${coluna} AS nota
    FROM sisu_ufma
    WHERE ${coluna} IS NOT NULL
  `;

  const result = await pool.query(query);

  const notas = result.rows.map((r) => Number(r.nota));

  if (notas.length === 0) {
    return NextResponse.json({ error: "Sem dados." });
  }

  const media =
    notas.reduce((acc, x) => acc + x, 0) / notas.length;

  const sorted = [...notas].sort((a, b) => a - b);
  const mediana =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

  const desvioPadrao = Math.sqrt(
    notas.reduce((acc, x) => acc + (x - media) ** 2, 0) / notas.length
  );

  return NextResponse.json({
    area,
    total_candidatos: notas.length,
    media: Number(media.toFixed(2)),
    mediana: Number(mediana.toFixed(2)),
    desvio_padrao: Number(desvioPadrao.toFixed(2)),
    notas,
  });
}
