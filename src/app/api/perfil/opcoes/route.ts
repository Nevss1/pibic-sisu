import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";

// Retorna as opções disponíveis (campus, turno, grau, modalidade)
// filtradas pelo curso selecionado (e opcionalmente pelo campus).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const curso = searchParams.get("curso") || "";
  const campus = searchParams.get("campus") || "";

  if (!curso) {
    return NextResponse.json({ campuses: [], turnos: [], graus: [], modalidades: [] });
  }

  const params: string[] = [curso];
  const campusFilter = campus ? `AND campus_norm ILIKE '%' || $2 || '%'` : "";
  if (campus) params.push(campus);

  const sql = `
    WITH norm AS (
      SELECT
        CASE
          WHEN no_campus ILIKE '%complexo santa amélia%' THEN 'Cidade Universitária'
          WHEN no_campus ILIKE '%ciências sociais, saúde%' THEN 'CAMPUS DE IMPERATRIZ'
          ELSE no_campus
        END AS campus_norm,
        ds_turno,
        ds_grau,
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
        END AS categoria
      FROM sisu_ufma
      WHERE LOWER(no_curso) = LOWER($1)
    )
    SELECT
      ARRAY_AGG(DISTINCT campus_norm ORDER BY campus_norm)   AS campuses,
      ARRAY_AGG(DISTINCT ds_turno    ORDER BY ds_turno)      AS turnos,
      ARRAY_AGG(DISTINCT ds_grau     ORDER BY ds_grau)       AS graus,
      ARRAY_AGG(DISTINCT categoria   ORDER BY categoria)     AS modalidades
    FROM norm
    WHERE 1=1
    ${campusFilter}
  `;

  try {
    const result = await pool.query(sql, params);
    const row = result.rows[0];
    return NextResponse.json({
      campuses:   row.campuses   ?? [],
      turnos:     row.turnos     ?? [],
      graus:      row.graus      ?? [],
      modalidades: row.modalidades ?? [],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[perfil/opcoes]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
