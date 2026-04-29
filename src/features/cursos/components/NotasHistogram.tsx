"use client";

import { Box, CardContent, Typography } from "@mui/material";
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

  const notas = dados?.flatMap((d) => d?.notas ?? []) ?? [];
  const min = dados?.length ? Math.min(...dados.map((d) => d.min_nota_candidato)) : 0;
  const max = dados?.length ? Math.max(...dados.map((d) => d.max_nota_candidato)) : 0;

  const bins = notas.length > 0 ? buildHistogram(notas, min, max) : [];

  return (
    <Box>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Distribuição das Notas dos Candidatos
        </Typography>
        {bins.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Sem dados de distribuição disponíveis.
          </Typography>
        ) : (
          <BarChart
            xAxis={[{ data: bins.map((b) => b.label), scaleType: "band", label: "Nota" }]}
            series={[{ data: bins.map((b) => b.count), label: "Candidatos", color: "#D5B071" }]}
            height={320}
            margin={{ left: 60, right: 20, top: 20, bottom: 50 }}
          />
        )}
      </CardContent>
    </Box>
  );
}
