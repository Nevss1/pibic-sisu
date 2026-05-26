"use client";

import { Box, Tooltip, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { DadoOverviewCurso } from "@/src/types/sisu";
import { useCursoFilter } from "../contexts";

function avgNum(dados: DadoOverviewCurso[] | undefined, key: keyof DadoOverviewCurso) {
  if (!dados || dados.length === 0) return undefined;
  const values = dados.map((d) => d[key] as number).filter((v) => v != null);
  if (values.length === 0) return undefined;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100;
}

function sumNum(dados: DadoOverviewCurso[] | undefined, key: keyof DadoOverviewCurso) {
  if (!dados || dados.length === 0) return undefined;
  return dados.reduce((a, d) => a + (d[key] as number), 0);
}

export function CursoOverviewCards() {
  const { dadosFiltrados: dados } = useCursoFilter();

  const totalCandidatos = sumNum(dados, "total_inscritos");
  const totalVagas = sumNum(dados, "aprovados");
  const taxaAprovacao = avgNum(dados, "taxa_aprovacao");

  const totalEfetivadas = sumNum(dados, "total_efetivadas");
  const taxaEfetivacao = avgNum(dados, "taxa_efetivacao_sobre_aprovados");

  const cards = [
    {
      label: "Candidatos",
      value: totalCandidatos != null ? totalCandidatos.toLocaleString("pt-BR") : undefined,
      info: "Total de inscrições no curso no período filtrado. Um mesmo candidato pode ter se inscrito em mais de uma edição.",
    },
    {
      label: "Vagas preenchidas",
      value: totalVagas != null ? totalVagas.toLocaleString("pt-BR") : undefined,
      info: "Total de candidatos aprovados/convocados (APROVADO = S). Representa as vagas efetivamente preenchidas pelo SISU.",
    },
    {
      label: "Nota média candidato",
      value: avgNum(dados, "media_nota_candidato"),
      info: "Média das notas finais de todos os candidatos inscritos no curso.",
    },
    {
      label: "Nota média de corte",
      value: avgNum(dados, "media_nota_corte"),
      info: "Média das notas de corte do curso. A nota de corte é a menor nota entre os aprovados em cada edição.",
    },
    {
      label: "Taxa de aprovação",
      value: taxaAprovacao != null ? `${taxaAprovacao}%` : undefined,
      info: "Percentual de candidatos inscritos que foram aprovados/convocados.",
    },
    {
      label: "Taxa de efetivação",
      value: taxaEfetivacao != null ? `${taxaEfetivacao}%` : undefined,
      info: "Percentual dos aprovados que efetivaram a matrícula. Indica a adesão real ao curso após a convocação.",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          laptop: "repeat(3, 1fr)",
        },
        gap: 1.5,
      }}
    >
      {cards.map((card) => (
        <Box
          key={card.label}
          sx={{
            p: { xs: 2, mobile: 2.5 },
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontSize: "0.6875rem",
                fontWeight: 500,
              }}
            >
              {card.label}
            </Typography>
            <Tooltip title={card.info} placement="top" arrow>
              <InfoOutlinedIcon sx={{ fontSize: 13, color: "text.disabled", cursor: "help" }} />
            </Tooltip>
          </Box>
          <Typography
            sx={{
              fontWeight: 600,
              color: "text.primary",
              fontSize: { xs: 22, mobile: 26 },
              fontFamily: "var(--font-archivo), sans-serif",
              lineHeight: 1.1,
            }}
          >
            {card.value ?? "—"}
          </Typography>
          {"description" in card && card.description && (
            <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
              {card.description}
            </Typography>
          )}
          {"detail" in card && card.detail && (
            <Typography variant="caption" sx={{ color: "text.disabled", fontSize: "0.7rem" }}>
              {card.detail}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}
