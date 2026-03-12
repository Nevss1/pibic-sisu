import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const curso = searchParams.get("curso") || "";
  const campus = searchParams.get("campus") || "";
  const modalidade = searchParams.get("modalidade") || "";
  const turno = searchParams.get("turno") || "";
  const grau = searchParams.get("grau") || "";
  const sexo = searchParams.get("sexo") || "";

  if (!curso || !campus) {
    return NextResponse.json(
      { error: "Parâmetros obrigatórios: curso e campus" },
      { status: 400 }
    );
  }

  const params: (string | number)[] = [curso, campus];
  let idx = 3;

  const conditions: string[] = [];

  if (modalidade) {
    conditions.push(`categoria = $${idx++}`);
    params.push(modalidade);
  }
  if (sexo) {
    conditions.push(`tp_sexo = $${idx++}`);
    params.push(sexo);
  }
  if (turno) {
    conditions.push(`LOWER(ds_turno) = LOWER($${idx++})`);
    params.push(turno);
  }
  if (grau) {
    conditions.push(`LOWER(ds_grau) = LOWER($${idx++})`);
    params.push(grau);
  }

  const extraWhere =
    conditions.length > 0 ? "AND " + conditions.join(" AND ") : "";

  const sql = `
    WITH norm AS (
      SELECT *,
        CASE
          WHEN LOWER(ds_mod_concorrencia) = 'ampla concorrência'
            OR LOWER(ds_mod_concorrencia) LIKE '%vagas de ampla concorrência%'
            THEN 'Ampla concorrência'
          WHEN LOWER(ds_mod_concorrencia) LIKE '%com deficiência%'
            THEN 'PcD'
          WHEN LOWER(ds_mod_concorrencia) LIKE '%indígenas%'
            THEN 'Indígenas'
          WHEN LOWER(ds_mod_concorrencia) LIKE '%pretos ou pardos%'
            THEN 'PPI'
          WHEN LOWER(ds_mod_concorrencia) LIKE '%1,5 salário%'
            THEN 'Baixa renda (EP + renda)'
          ELSE 'Escola pública'
        END AS categoria,
        CASE
          WHEN no_campus ILIKE '%complexo santa amélia%' THEN 'Cidade Universitária'
          WHEN no_campus ILIKE '%ciências sociais, saúde%' THEN 'CAMPUS DE IMPERATRIZ'
          ELSE no_campus
        END AS campus_norm
      FROM sisu_ufma
      WHERE LOWER(no_curso) = LOWER($1)
    ),
    dados AS (
      SELECT * FROM norm
      WHERE campus_norm ILIKE '%' || $2 || '%'
    )
    SELECT
      ano,
      COUNT(*)::int                                     AS total,
      COUNT(*) FILTER (WHERE st_aprovado = 'S')::int   AS aprovados,
      ROUND(AVG(nu_notacorte)::numeric, 2)::float      AS nota_corte_media
    FROM dados
    WHERE 1=1
    ${extraWhere}
    GROUP BY ano
    ORDER BY ano
  `;

  try {
    const result = await pool.query(sql, params);
    const rows = result.rows;

    if (rows.length === 0) {
      return NextResponse.json({ rows: [], resumo: null });
    }

    const totalGeral = rows.reduce((s: number, r: { total: number }) => s + r.total, 0);
    const aprovadosGeral = rows.reduce((s: number, r: { aprovados: number }) => s + r.aprovados, 0);
    const taxaGeral =
      totalGeral > 0
        ? Math.round((aprovadosGeral / totalGeral) * 1000) / 10
        : 0;

    return NextResponse.json({
      rows,
      resumo: { total: totalGeral, aprovados: aprovadosGeral, taxa: taxaGeral },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[perfil]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
