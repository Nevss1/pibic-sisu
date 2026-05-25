import { pool } from "@/src/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ curso: string }> }
) {
  const { curso } = await params;
  const nomeCurso = decodeURIComponent(curso);
  const { searchParams } = new URL(req.url);
  const edicao = searchParams.get("edicao") ? Number(searchParams.get("edicao")) : null;

  const [goldResult, notasResult] = await Promise.all([
    pool.query(
      `
      SELECT
        edicao,
        ano,
        nome_campus                                                                           AS campus,
        SUM(total_candidatos)::int                                                            AS total_inscritos,
        SUM(total_aprovados)::int                                                             AS aprovados,
        ROUND(
          (SUM(media_nota_candidato * total_candidatos) / NULLIF(SUM(total_candidatos), 0))::numeric,
          2
        )::float                                                                              AS media_nota_candidato,
        ROUND(
          (SUM(media_nota_corte * total_candidatos) / NULLIF(SUM(total_candidatos), 0))::numeric,
          2
        )::float                                                                              AS media_nota_corte,
        ROUND(MIN(min_nota_candidato)::numeric, 2)::float                                    AS min_nota_candidato,
        ROUND(MAX(max_nota_candidato)::numeric, 2)::float                                    AS max_nota_candidato,
        ROUND(MIN(min_nota_corte)::numeric, 2)::float                                        AS min_nota_corte,
        ROUND(MAX(max_nota_corte)::numeric, 2)::float                                        AS max_nota_corte,
        SUM(inscritos_masculino)::int                                                         AS inscritos_masculino,
        SUM(inscritos_feminino)::int                                                          AS inscritos_feminino,
        ROUND(
          (SUM(total_aprovados)::float / NULLIF(SUM(total_candidatos), 0) * 100)::numeric,
          2
        )::float                                                                              AS taxa_aprovacao
      FROM gold_overview_curso_ano_campus
      WHERE LOWER(nome_curso) = LOWER($1)
        AND ($2::int IS NULL OR edicao = $2::int)
      GROUP BY edicao, ano, nome_campus
      ORDER BY edicao, ano, nome_campus
      `,
      [nomeCurso, edicao]
    ),
    pool.query(
      `
      SELECT
        edicao,
        ano,
        nome_campus                                                      AS campus,
        ARRAY_AGG(nota_candidato ORDER BY nota_candidato)               AS notas
      FROM silver_sisu_ufma
      WHERE LOWER(nome_curso) = LOWER($1)
        AND nota_candidato IS NOT NULL
        AND ($2::int IS NULL OR edicao = $2::int)
      GROUP BY edicao, ano, nome_campus
      `,
      [nomeCurso, edicao]
    ),
  ]);

  const notasMap = new Map(
    notasResult.rows.map((r) => [`${r.edicao}__${r.ano}__${r.campus}`, r.notas as number[]])
  );

  const rows = goldResult.rows.map((row) => ({
    ...row,
    notas: notasMap.get(`${row.edicao}__${row.ano}__${row.campus}`) ?? [],
  }));

  return NextResponse.json(rows);
}
