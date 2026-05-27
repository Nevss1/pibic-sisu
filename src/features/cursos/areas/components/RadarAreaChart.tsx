"use client";

import { RadarAxis, RadarChart } from "@mui/x-charts";
import { useAreasFilter } from "../contexts/AreasFilterContext";
import { Box, Typography } from "@mui/material";
import { dashboardChartCardSx } from "@/src/config/dashboardStyles";

const AREAS = [
  { label: "Matemática", key: "media_matematica" },
  { label: "Linguagens", key: "media_linguagens" },
  { label: "Humanas", key: "media_humanas" },
  { label: "Natureza", key: "media_natureza" },
  { label: "Redação", key: "media_redacao" },
] as const;

const COLOR_CURSO = "#D5B071";
const COLOR_UFMA = "#6B9FD4";

export const RadarAreaChart = () => {
  const { dadosFiltrados: dados, dadosUFMAFiltrados: dadosUFMA } = useAreasFilter();

  const calcMedias = (rows: typeof dados) =>
    rows && rows.length > 0
      ? AREAS.map((a) => rows.reduce((sum, d) => sum + d[a.key], 0) / rows.length)
      : [];

  const mediasCurso = calcMedias(dados);
  const mediasUFMA = calcMedias(dadosUFMA);

  const maxNota = Math.ceil(
    Math.max(...mediasCurso, ...mediasUFMA, 0) / 100
  ) * 100;

  return (
    <Box sx={{ ...dashboardChartCardSx, p: { xs: 2.5, mobile: 3 } }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
        Notas médias por área
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Comparativo entre o curso selecionado e a média do campus
      </Typography>

      <RadarChart
        height={320}
        shape="circular"
        sx={{
          "& .MuiChartsLegend-label": {
            fill: "#6B7280",
            fontSize: 12,
          },
        }}
        series={[
          {
            label: "Nota média do Campus",
            data: mediasUFMA,
            color: COLOR_UFMA,
            fillArea: true,
          },
          {
            label: "Nota média",
            data: mediasCurso,
            color: COLOR_CURSO,
            fillArea: true,
          },
        ]}
        radar={{
          metrics: AREAS.map((a) => a.label),
          max: maxNota,
        }}
      >
        <RadarAxis metric="Matemática" divisions={4} labelOrientation="rotated" angle={30} />
      </RadarChart>
    </Box>
  );
};
