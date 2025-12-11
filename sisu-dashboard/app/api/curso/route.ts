import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const curso = searchParams.get("curso");

  if (!curso) return NextResponse.json([]);

  const serie = await pool.query(
    `
    SELECT 
      ano,
      AVG(nu_nota_candidato) AS media_nota_candidato,
      AVG(nu_notacorte) AS media_nota_corte,
      COUNT(*) AS total_inscritos
    FROM sisu_ufma
    WHERE LOWER(no_curso) = LOWER($1)
    GROUP BY ano
    ORDER BY ano
    `,
    [curso]
  );

  const modalidades = await pool.query(
    `
    SELECT 
      ds_mod_concorrencia,
      AVG(nu_notacorte) AS media_nota_corte,
      AVG(nu_nota_candidato) AS media_nota_candidato
    FROM sisu_ufma
    WHERE LOWER(no_curso) = LOWER($1)
    GROUP BY ds_mod_concorrencia
    ORDER BY media_nota_corte DESC
    `,
    [curso]
  );

  return NextResponse.json({
    serie: serie.rows,
    modalidades: modalidades.rows,
  });
}
