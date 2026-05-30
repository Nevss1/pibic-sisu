"use client";

import { Box, CardContent, Typography, useMediaQuery, useTheme } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useCursoFilter } from "../contexts";

export function NotasHistogram() {
  const { dadosFiltrados: dados } = useCursoFilter();
  const theme = useTheme();
  const isLaptop = useMediaQuery(theme.breakpoints.up("laptop"));

  const isMobile = useMediaQuery(theme.breakpoints.down("tabletSmall"));

  const binMap = new Map<number, number>();
  for (const d of dados ?? []) {
    for (const b of d?.bins ?? []) {
      binMap.set(b.bin_start, (binMap.get(b.bin_start) ?? 0) + b.count);
    }
  }
  const bins = Array.from(binMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([bin_start, count]) => ({ label: String(bin_start), count }));

  const chartHeight = isLaptop ? 320 : isMobile ? 220 : 260;

  const tickStep = isMobile ? 5 : 3;
  const tickInterval = (_: string, index: number) => index % tickStep === 0;

  const chartMargin = isMobile
    ? { left: 32, right: 4, top: 4, bottom: 24 }
    : { left: 54, right: 16, top: 18, bottom: 48 };

  return (
    <Box>
      <CardContent sx={{ p: { xs: 2, mobile: 2.5, laptop: 3 } }}>
        <Typography
          variant="h6"
          sx={{ mb: isMobile ? 1 : 2, fontWeight: 700 }}
        >
          Distribuição das notas dos candidatos
        </Typography>

        {bins.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Sem dados de distribuição disponíveis.
          </Typography>
        ) : (
          <BarChart
            xAxis={[{
              data: bins.map((b) => b.label),
              scaleType: "band",
              label: isMobile ? undefined : "Nota",
              tickInterval,
              tickLabelStyle: { fontSize: isMobile ? 10 : 12 },
              categoryGapRatio: isMobile ? 0.08 : 0.2,
              barGapRatio: isMobile ? 0 : 0.1,
            }]}
            yAxis={[{
              label: isMobile ? undefined : "Candidatos",
              tickLabelStyle: { fontSize: isMobile ? 10 : 12 },
            }]}
            series={[{
              data: bins.map((b) => b.count),
              label: "Candidatos",
              color: "#D5A642",
            }]}
            height={chartHeight}
            margin={chartMargin}
            grid={{ horizontal: true }}
            hideLegend={isMobile}
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
