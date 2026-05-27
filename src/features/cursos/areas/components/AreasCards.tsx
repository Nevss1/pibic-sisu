"use client";

import { Box, Typography } from "@mui/material";
import { useAreasFilter } from "../contexts/AreasFilterContext";
import { dashboardMetricCardSx } from "@/src/config/dashboardStyles";

const AREAS = [
  { label: "Matemática", key: "media_matematica" },
  { label: "Linguagens", key: "media_linguagens" },
  { label: "Humanas", key: "media_humanas" },
  { label: "Natureza", key: "media_natureza" },
  { label: "Redação", key: "media_redacao" },
] as const;

function avg(dados: ReturnType<typeof useAreasFilter>["dadosFiltrados"], key: typeof AREAS[number]["key"]) {
  if (!dados || dados.length === 0) return null;
  const values = dados.map((d) => d[key]).filter((v) => v != null);
  if (values.length === 0) return null;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100;
}

export function AreasCards() {
  const { dadosFiltrados: dados } = useAreasFilter();

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
      {AREAS.map((area) => (
        <Box
          key={area.key}
          sx={{
            ...dashboardMetricCardSx,
            p: { xs: 2.25, mobile: 2.75 },
            display: "flex",
            flexDirection: "column",
            gap: 1,
            minHeight: 118,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#7A6A58",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontSize: "0.6875rem",
              fontWeight: 700,
            }}
          >
            {area.label}
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              color: "#7A5420",
              fontSize: { xs: 24, mobile: 28 },
              fontFamily: "var(--font-archivo), sans-serif",
              lineHeight: 1.1,
              mt: "auto",
            }}
          >
            {avg(dados, area.key) ?? "—"}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
