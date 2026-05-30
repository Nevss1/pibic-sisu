import { pool } from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await pool.query(
    `
    SELECT
      ano,
      nome_campus AS campus,
      COUNT(*)::int                                                                AS total_inscritos,
      COUNT(*) FILTER (WHERE aprovado = 'S')::int                                AS aprovados,
      ROUND(AVG(nota_candidato)::numeric, 2)::float                              AS media_nota_candidato,
      ROUND(AVG(nota_corte)::numeric, 2)::float                                  AS media_nota_corte,
      ROUND(MIN(nota_candidato)::numeric, 2)::float                              AS min_nota_candidato,
      ROUND(MAX(nota_candidato)::numeric, 2)::float                              AS max_nota_candidato,
      ROUND(MIN(nota_corte)::numeric, 2)::float                                  AS min_nota_corte,
      ROUND(MAX(nota_corte)::numeric, 2)::float                                  AS max_nota_corte,
      COUNT(*) FILTER (WHERE sexo = 'M')::int                                    AS inscritos_masculino,
      COUNT(*) FILTER (WHERE sexo = 'F')::int                                    AS inscritos_feminino,
      ROUND(
        ((COUNT(*) FILTER (WHERE aprovado = 'S')::float / COUNT(*)::float) * 100)::numeric,
        2
      )::float                                                                    AS taxa_aprovacao
    FROM silver_sisu_ufma
    GROUP BY ano, nome_campus
    ORDER BY ano, nome_campus
    `
  );

  return NextResponse.json(result.rows);
}
