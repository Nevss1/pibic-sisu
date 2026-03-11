"use client";

import { Box, Typography } from "@mui/material";
import { DadoOverviewCurso } from "@/src/types/sisu";
import { useCursoFilter } from "./CursoFilterContext";

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

export default function CursoOverviewCards() {
  const { dadosFiltrados: dados } = useCursoFilter();

  const cards = [
    { label: "Candidatos", value: sumNum(dados, "total_inscritos") },
    { label: "Vagas", value: sumNum(dados, "aprovados") },
    { label: "Média de Nota do Candidato", value: avgNum(dados, "media_nota_candidato") },
    { label: "Média de Nota de Corte", value: avgNum(dados, "media_nota_corte") },
    { label: "Taxa de Aprovação", value: avgNum(dados, "taxa_aprovacao") != null ? `${avgNum(dados, "taxa_aprovacao")}%` : undefined },
  ];

  return (
    <Box sx={{ boxShadow: "0px 1px 4px rgba(0,0,0,0.08)", borderRadius: 2, border: 1, borderColor: "divider" }}>
      <Box sx={{ display: "flex", width: "100%" }}>
        {cards.map((card, index) => (
          <Box
            key={card.label}
            sx={{
              flex: 1,
              p: 3,
              borderRight: index < cards.length - 1 ? 1 : 0,
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                height: 100,
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
                minHeight: 100,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 400, color: "text.primary", fontSize: 16 }}
              >
                {card.label}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 500,
                  color: "text.primary",
                  fontSize: 24,
                  fontFamily: "var(--font-archivo), sans-serif",
                }}
              >
                {card.value}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
