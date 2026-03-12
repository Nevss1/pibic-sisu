"use client";

import { Box, CardContent, Typography } from "@mui/material";
import { BarChart as MuiBarChart } from "@mui/x-charts/BarChart";
import { useCursoFilter } from "./CursoFilterContext";

const BIN_SIZE = 5;

function buildHistogram(notas: number[], min: number, max: number) {
  const bins: { label: string; count: number }[] = [];

  for (let start = min; start < max; start += BIN_SIZE) {
    const end = start + BIN_SIZE;
    bins.push({
      label: `${start}`,
      count: notas.filter((n) => n >= start && n < end).length,
    });
  }

  return bins;
}

export default function BarChart() {
  const { dadosFiltrados: dados } = useCursoFilter();

  const notas = dados?.flatMap((d) => d?.notas) ?? []
  const min = Math.min(...dados?.map((d) => d.min_nota_candidato) ?? [0])
  const max = Math.max(...(dados?.map((d) => d.max_nota_candidato) ?? [1000]))
  const bins = buildHistogram(notas, min, max);

  return (
    <Box>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Distribuição das Notas dos Candidatos
        </Typography>
        <MuiBarChart
          xAxis={[
            {
              data: bins.map((b) => b.label),
              scaleType: "band",
              label: "Nota",
            },
          ]}
          series={[
            {
              data: bins.map((b) => b.count),
              label: "Candidatos",
              color: "#D5B071",
            },
          ]}
          height={320}
          margin={{ left: 60, right: 20, top: 20, bottom: 50 }}
        />
      </CardContent>
    </Box>
  );
}
