import { pool } from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/faixas-etarias
 *
 * Retorna a distribuição de inscrições por faixa etária estimada,
 * agrupada por (ano, campus, faixa_etaria).
 *
 * A coluna `dt_nascimento` na Silver contém o ANO de nascimento (float8,
 * pois o pandas converte para float64 antes de fazer o upload).
 * A idade estimada é: ROUND(ano) - ROUND(dt_nascimento)  →  inteiro.
 *
 * Filtros de qualidade:
 *   - dt_nascimento BETWEEN 1950 AND 2010  (exclui anomalias do dado MEC)
 *   - idade calculada BETWEEN 15 AND 65    (dupla validação)
 *
 * O CASE é definido na subquery e referenciado por alias na query externa,
 * evitando repetição e possíveis erros de sintaxe em GROUP BY.
 *
 * Parâmetros opcionais (query string):
 *   - edicao: int — filtra por edição específica do SISU
 *   - campus: text — filtra por campus específico
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const edicaoRaw = searchParams.get("edicao");
  const campusRaw = searchParams.get("campus");

  const edicao = edicaoRaw ? parseInt(edicaoRaw, 10) : null;
  const campus = campusRaw ?? null;

  const result = await pool.query(
    `
    SELECT
      ano,
      campus,
      faixa_etaria,
      COUNT(*)::int AS total_candidatos
    FROM (
      SELECT
        ROUND(ano::numeric)::int            AS ano,
        nome_campus                         AS campus,
        CASE
          WHEN ROUND(ano::numeric) - ROUND(dt_nascimento::numeric) < 18
            THEN 'Menos de 18'
          WHEN ROUND(ano::numeric) - ROUND(dt_nascimento::numeric) BETWEEN 18 AND 20
            THEN '18 a 20'
          WHEN ROUND(ano::numeric) - ROUND(dt_nascimento::numeric) BETWEEN 21 AND 24
            THEN '21 a 24'
          WHEN ROUND(ano::numeric) - ROUND(dt_nascimento::numeric) BETWEEN 25 AND 29
            THEN '25 a 29'
          WHEN ROUND(ano::numeric) - ROUND(dt_nascimento::numeric) BETWEEN 30 AND 39
            THEN '30 a 39'
          ELSE '40 ou mais'
        END AS faixa_etaria
      FROM silver_sisu_ufma
      WHERE dt_nascimento IS NOT NULL
        AND dt_nascimento::numeric BETWEEN 1950 AND 2010
        AND (ROUND(ano::numeric) - ROUND(dt_nascimento::numeric)) BETWEEN 15 AND 65
        AND ($1::int  IS NULL OR edicao      = $1::int)
        AND ($2::text IS NULL OR nome_campus = $2::text)
    ) sub
    GROUP BY ano, campus, faixa_etaria
    ORDER BY
      ano,
      campus,
      CASE faixa_etaria
        WHEN 'Menos de 18' THEN 1
        WHEN '18 a 20'     THEN 2
        WHEN '21 a 24'     THEN 3
        WHEN '25 a 29'     THEN 4
        WHEN '30 a 39'     THEN 5
        ELSE 6
      END
    `,
    [edicao, campus]
  );

  return NextResponse.json(result.rows);
}
