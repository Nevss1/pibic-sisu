"use client";

import { useMemo } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useAreasFilter } from "../contexts/AreasFilterContext";
import { dashboardChartCardSx } from "@/src/config/dashboardStyles";

const AREAS = [
  { label: "Matemática", key: "media_matematica" },
  { label: "Linguagens", key: "media_linguagens" },
  { label: "Humanas", key: "media_humanas" },
  { label: "Natureza", key: "media_natureza" },
  { label: "Redação", key: "media_redacao" },
] as const;

const COLOR_CURSO = "#D5A642";
const COLOR_CAMPUS = "#5B7FA6";

type AreaKey = (typeof AREAS)[number]["key"];
type AreasRows = ReturnType<typeof useAreasFilter>["dadosFiltrados"];

function avg(dados: AreasRows, key: AreaKey) {
  if (!dados || dados.length === 0) return null;

  const values = dados.map((d) => d[key]).filter((v) => v != null);
  if (values.length === 0) return null;

  return (
    Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 100) / 100
  );
}

function formatNota(value: number | null) {
  return value == null
    ? "Sem dados"
    : value.toLocaleString("pt-BR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
}

export function AreasComparisonChart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("mobile"));
  const { dadosFiltrados: dados, dadosUFMAFiltrados: dadosUFMA } = useAreasFilter();

  const chartData = useMemo(
    () =>
      AREAS.map((area) => ({
        area: area.label,
        curso: avg(dados, area.key),
        campus: avg(dadosUFMA, area.key),
      })),
    [dados, dadosUFMA]
  );

  const hasData = chartData.some((item) => item.curso != null || item.campus != null);
  const chartHeight = isMobile ? 280 : 340;

  return (
    <Box sx={{ ...dashboardChartCardSx, p: { xs: 2.5, mobile: 3 } }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
        Notas médias por área
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Comparativo entre o curso selecionado e a média do campus
      </Typography>

      {!hasData ? (
        <Typography variant="body2" color="text.secondary">
          Sem dados disponíveis para o filtro selecionado.
        </Typography>
      ) : (
        <BarChart
          dataset={chartData}
          xAxis={[
            {
              dataKey: "area",
              scaleType: "band",
              tickLabelStyle: {
                fill: theme.palette.text.secondary,
                fontSize: isMobile ? 10 : 12,
              },
            },
          ]}
          yAxis={[
            {
              min: 0,
              tickLabelStyle: {
                fill: theme.palette.text.secondary,
                fontSize: 12,
              },
              valueFormatter: (value) => Number(value).toLocaleString("pt-BR"),
            },
          ]}
          series={[
            {
              dataKey: "curso",
              label: "Nota média do curso",
              color: COLOR_CURSO,
              valueFormatter: (value) => formatNota(value),
            },
            {
              dataKey: "campus",
              label: "Nota média do campus",
              color: COLOR_CAMPUS,
              valueFormatter: (value) => formatNota(value),
            },
          ]}
          height={chartHeight}
          margin={{
            left: isMobile ? 42 : 54,
            right: isMobile ? 8 : 18,
            top: 18,
            bottom: isMobile ? 52 : 44,
          }}
          grid={{ horizontal: true }}
          borderRadius={5}
          sx={{
            "& .MuiChartsGrid-line": {
              stroke: "rgba(154, 106, 33, 0.12)",
              strokeDasharray: "4 4",
            },
            "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": {
              stroke: "rgba(154, 106, 33, 0.18)",
            },
            "& .MuiChartsAxis-label": {
              fill: theme.palette.text.secondary,
            },
            "& .MuiBarElement-root": {
              filter: "drop-shadow(0 4px 7px rgba(70, 50, 20, 0.12))",
            },
            "& .MuiChartsLegend-label": {
              fill: theme.palette.text.secondary,
              fontSize: 12,
            },
            "& .MuiChartsTooltip-paper": {
              border: "1px solid rgba(174, 143, 88, 0.18)",
              borderRadius: 2,
              boxShadow: "0 10px 28px rgba(70, 50, 20, 0.12)",
            },
          }}
        />
      )}
    </Box>
  );
}
