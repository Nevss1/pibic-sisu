"use client";

import { Box, CardContent, Typography, useMediaQuery, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useCursoFilter } from "../contexts";

const BIN_SIZE = 10;

function buildHistogram(notas: number[], min: number, max: number) {
  const bins: { label: string; count: number }[] = [];
  for (let start = Math.floor(min / BIN_SIZE) * BIN_SIZE; start < max; start += BIN_SIZE) {
    bins.push({
      label: `${start}`,
      count: notas.filter((n) => n >= start && n < start + BIN_SIZE).length,
    });
  }
  return bins;
}

export function NotasHistogram() {
  const { dadosFiltrados: dados } = useCursoFilter();
  const theme = useTheme();
  const isLaptop = useMediaQuery(theme.breakpoints.up("laptop"));

  const notas = dados?.flatMap((d) => d?.notas ?? []) ?? [];
  const min = dados?.length ? Math.min(...dados.map((d) => d.min_nota_candidato)) : 0;
  const max = dados?.length ? Math.max(...dados.map((d) => d.max_nota_candidato)) : 0;

  const bins = notas.length > 0 ? buildHistogram(notas, min, max) : [];
  const chartHeight = isLaptop ? 320 : 240;

  return (
    <Box>
      <CardContent sx={{ p: { xs: 2.5, mobile: 3 } }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Distribuição das notas dos candidatos
        </Typography>
        {bins.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Sem dados de distribuição disponíveis.
          </Typography>
        ) : (
          <BarChart
            xAxis={[{ data: bins.map((b) => b.label), scaleType: "band", label: "Nota" }]}
            yAxis={[{ label: "Candidatos" }]}
            series={[{ data: bins.map((b) => b.count), label: "Candidatos", color: "#D5A642" }]}
            height={chartHeight}
            margin={{ left: 54, right: 16, top: 18, bottom: 48 }}
            grid={{ horizontal: true }}
            sx={{
              "& .MuiChartsGrid-line": {
                stroke: "rgba(154, 106, 33, 0.12)",
                strokeDasharray: "4 4",
              },
              "& .MuiChartsAxis-line, & .MuiChartsAxis-tick": {
                stroke: "rgba(154, 106, 33, 0.18)",
              },
              "& .MuiChartsAxis-tickLabel, & .MuiChartsAxis-label": {
                fill: theme.palette.text.secondary,
              },
              "& .MuiBarElement-root": {
                filter: "drop-shadow(0 4px 7px rgba(154, 106, 33, 0.14))",
              },
              "& .MuiChartsLegend-label": {
                fill: theme.palette.text.secondary,
                fontSize: 12,
              },
            }}
          />
        )}
      </CardContent>
    </Box>
  );
}
