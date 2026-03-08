"use client";

import { useCursoOverview } from "@/src/hooks";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { PieChart as MuiPieChart } from "@mui/x-charts/PieChart";

const CORES_GENERO = {
  masculino: "#2b68e3",
  feminino: "#e82d2dd6",
};

export default function PieChartGenero({ curso }: { curso: string }) {
  const { data: dados } = useCursoOverview(curso);

  const totalMasculino =
    dados?.reduce((acc, d) => acc + d.inscritos_masculino, 0) ?? 0;
  const totalFeminino =
    dados?.reduce((acc, d) => acc + d.inscritos_feminino, 0) ?? 0;
  const totalInscritos = totalMasculino + totalFeminino || 1;

  const seriesData = [
    { id: 0, value: totalMasculino, label: "Homens", color: CORES_GENERO.masculino },
    { id: 1, value: totalFeminino, label: "Mulheres", color: CORES_GENERO.feminino },
  ];

  return (
    <Box>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Distribuição de Inscritos por Gênero
        </Typography>
        <MuiPieChart
          series={[
            {
              data: seriesData,
              highlightScope: { fade: "global", highlight: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
              arcLabel: (item) =>
                `${((item.value / totalInscritos) * 100).toFixed(1)}%`,
              arcLabelMinAngle: 30,
              arcLabelRadius: "60%",
              innerRadius: 40,
            },
          ]}
          height={280}
          margin={{ top: 10, bottom: 60, left: 20, right: 20 }}
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
