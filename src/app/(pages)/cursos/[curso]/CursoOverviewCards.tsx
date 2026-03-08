"use client";

import { Box, Grid, Typography } from "@mui/material";
import { useCursoFilter } from "./CursoFilterContext";

export default function CursoOverviewCards() {
  const { dadosFiltrados: dados } = useCursoFilter();

  const cards = [
    { label: "Candidatos", value: dados?.[0]?.total_inscritos },
    { label: "Média de Nota do Candidato", value: dados?.[0]?.media_nota_candidato },
    { label: "Média de Nota de Corte", value: dados?.[0]?.media_nota_corte },
    { label: "Taxa de Aprovação", value: dados?.[0] ? `${dados[0].taxa_aprovacao}%` : undefined },
  ];

  return (
    <Box sx={{ boxShadow: "0px 1px 4px rgba(0,0,0,0.08)", borderRadius: 2, border: 1, borderColor: "divider" }}>
      <Grid container>
        {cards.map((card, index) => (
          <Grid
            size={{ xs: 12, md: 3 }}
            sx={{
              p: 3,
              borderRight: index < cards.length - 1 ? 1 : 0,
              borderColor: "divider",
            }}
            key={card.label}
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
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
