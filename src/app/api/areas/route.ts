import { pool } from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await pool.query(`
    SELECT
      ano,
      nome_campus AS campus,
      ROUND(AVG(nota_m)::numeric, 2)::float        AS media_matematica,
      ROUND(AVG(nota_l)::numeric, 2)::float        AS media_linguagens,
      ROUND(AVG(nota_ch)::numeric, 2)::float       AS media_humanas,
      ROUND(AVG(nota_cn)::numeric, 2)::float       AS media_natureza,
      ROUND(AVG(nota_r)::numeric, 2)::float        AS media_redacao
    FROM silver_sisu_ufma
    GROUP BY ano, nome_campus
    ORDER BY ano, nome_campus
  `);

  return NextResponse.json(result.rows);
}
