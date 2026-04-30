"use client";

import { Box, CardContent, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useCursoFilter } from "../contexts";
import { PieChart as MuiPieChart } from "@mui/x-charts/PieChart";

const CORES_GENERO = {
  masculino: "#2b68e3",
  feminino: "#e82d2dd6",
};

export function PieChartGenero() {
  const { dadosFiltrados: dados } = useCursoFilter();
  const theme = useTheme();
  const isLaptop = useMediaQuery(theme.breakpoints.up("laptop"));

  const totalMasculino = dados?.reduce((acc, d) => acc + d.inscritos_masculino, 0) ?? 0;
  const totalFeminino = dados?.reduce((acc, d) => acc + d.inscritos_feminino, 0) ?? 0;
  const totalInscritos = totalMasculino + totalFeminino || 1;

  const seriesData = [
    { id: 0, value: totalMasculino, label: "Homens",  color: CORES_GENERO.masculino },
    { id: 1, value: totalFeminino,  label: "Mulheres", color: CORES_GENERO.feminino },
  ];

  const chartHeight = isLaptop ? 260 : 220;

  return (
    <Box sx={{ minWidth: { laptop: 280 } }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Distribuição por gênero
        </Typography>
        <MuiPieChart
          series={[
            {
              data: seriesData,
              highlightScope: { fade: "global", highlight: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
              arcLabel: (item) => `${((item.value / totalInscritos) * 100).toFixed(1)}%`,
              innerRadius: 36,
            },
          ]}
          height={chartHeight}
          margin={{ top: 10, bottom: 56, left: 16, right: 16 }}
          sx={{ "& .MuiPieArcLabel-root": { fill: "#ffffff !important" } }}
          slotProps={{
            legend: {
              direction: "horizontal",
              position: { vertical: "bottom", horizontal: "center" },
            },
          }}
        />
      </CardContent>
    </Box>
  );
}
