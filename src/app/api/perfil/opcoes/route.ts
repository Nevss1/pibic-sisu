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
        nome_campus AS campus_norm,
        turno,
        grau,
        CASE
          WHEN grupo_concorrencia = 'AC'                                         THEN 'Ampla concorrência'
          WHEN grupo_concorrencia = 'BONUS_MA'                                   THEN 'Bônus Maranhão'
          WHEN grupo_concorrencia = 'COTA' AND subgrupo_cota = 'SOCIAL'         THEN 'Escola pública'
          WHEN grupo_concorrencia = 'COTA' AND subgrupo_cota = 'PP'             THEN 'PPI'
          WHEN grupo_concorrencia = 'COTA' AND subgrupo_cota = 'I'              THEN 'Indígenas'
          WHEN grupo_concorrencia = 'COTA' AND subgrupo_cota IN ('D','DD','PPD') THEN 'PcD'
          ELSE grupo_concorrencia
        END AS categoria
      FROM silver_sisu_ufma
      WHERE LOWER(nome_curso) = LOWER($1)
    )
    SELECT
      ARRAY_AGG(DISTINCT campus_norm ORDER BY campus_norm)  AS campuses,
      ARRAY_AGG(DISTINCT turno       ORDER BY turno)        AS turnos,
      ARRAY_AGG(DISTINCT grau        ORDER BY grau)         AS graus,
      ARRAY_AGG(DISTINCT categoria   ORDER BY categoria)    AS modalidades
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
