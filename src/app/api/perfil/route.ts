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
    conditions.push(`sexo = $${idx++}`);
    params.push(sexo);
  }
  if (turno) {
    conditions.push(`LOWER(turno) = LOWER($${idx++})`);
    params.push(turno);
  }
  if (grau) {
    conditions.push(`LOWER(grau) = LOWER($${idx++})`);
    params.push(grau);
  }

  const extraWhere =
    conditions.length > 0 ? "AND " + conditions.join(" AND ") : "";

  const sql = `
    WITH norm AS (
      SELECT *,
        CASE
          WHEN grupo_concorrencia = 'AC'                                         THEN 'Ampla concorrência'
          WHEN grupo_concorrencia = 'BONUS_MA'                                   THEN 'Bônus Maranhão'
          WHEN grupo_concorrencia = 'COTA' AND subgrupo_cota = 'SOCIAL'         THEN 'Escola pública'
          WHEN grupo_concorrencia = 'COTA' AND subgrupo_cota = 'PP'             THEN 'PPI'
          WHEN grupo_concorrencia = 'COTA' AND subgrupo_cota = 'I'              THEN 'Indígenas'
          WHEN grupo_concorrencia = 'COTA' AND subgrupo_cota IN ('D','DD','PPD') THEN 'PcD'
          ELSE grupo_concorrencia
        END AS categoria,
        nome_campus AS campus_norm
      FROM silver_sisu_ufma
      WHERE LOWER(nome_curso) = LOWER($1)
    ),
    base AS (
      SELECT * FROM norm
      WHERE campus_norm ILIKE '%' || $2 || '%'
    ),
    total_ano AS (
      SELECT ano, COUNT(*)::int AS total_curso
      FROM base
      GROUP BY ano
    ),
    filtrado AS (
      SELECT * FROM base
      WHERE 1=1
      ${extraWhere}
    )
    SELECT
      f.ano,
      COUNT(*)::int                                    AS total,
      COUNT(*) FILTER (WHERE f.aprovado = 'S')::int   AS aprovados,
      ROUND(AVG(f.nota_corte)::numeric, 2)::float     AS nota_corte_media,
      t.total_curso
    FROM filtrado f
    JOIN total_ano t ON t.ano = f.ano
    GROUP BY f.ano, t.total_curso
    ORDER BY f.ano
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
