"use client";

import { Box, Typography } from "@mui/material";
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

  const cards = [
    {
      label: "Candidatos",
      value: totalCandidatos != null ? totalCandidatos.toLocaleString("pt-BR") : undefined,
    },
    {
      label: "Vagas preenchidas",
      value: totalVagas != null ? totalVagas.toLocaleString("pt-BR") : undefined,
    },
    {
      label: "Nota média candidato",
      value: avgNum(dados, "media_nota_candidato"),
    },
    {
      label: "Nota média de corte",
      value: avgNum(dados, "media_nota_corte"),
    },
    {
      label: "Taxa de aprovação",
      value: taxaAprovacao != null ? `${taxaAprovacao}%` : undefined,
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          laptop: "repeat(5, 1fr)",
        },
        gap: 1.5,
      }}
    >
      {cards.map((card, index) => (
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
            gridColumn: {
              xs: index === cards.length - 1 ? "1 / -1" : "auto",
              laptop: "auto",
            },
          }}
        >
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
        </Box>
      ))}
    </Box>
  );
}
