"use client";

import { Box, CardContent, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useCursoFilter } from "../contexts";
import { PieChart as MuiPieChart } from "@mui/x-charts/PieChart";

const CORES_GENERO = {
  masculino: "#2563EB",
  feminino: "#D95F59",
};

function formatPercent(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

export function PieChartGenero() {
  const { dadosFiltrados: dados } = useCursoFilter();
  const theme = useTheme();
  const isLaptop = useMediaQuery(theme.breakpoints.up("laptop"));
  const isMobile = useMediaQuery(theme.breakpoints.down("tabletSmall"));

  const totalMasculino = dados?.reduce((acc, d) => acc + d.inscritos_masculino, 0) ?? 0;
  const totalFeminino = dados?.reduce((acc, d) => acc + d.inscritos_feminino, 0) ?? 0;
  const totalInscritos = totalMasculino + totalFeminino;
  const percentualMasculino = (totalMasculino / (totalInscritos || 1)) * 100;
  const percentualFeminino = (totalFeminino / (totalInscritos || 1)) * 100;

  const seriesData = [
    { id: 0, value: totalMasculino, label: "Homens", color: CORES_GENERO.masculino },
    { id: 1, value: totalFeminino, label: "Mulheres", color: CORES_GENERO.feminino },
  ];

  const summaryItems = [
    {
      label: "Homens",
      valueLabel: "candidatos",
      total: totalMasculino,
      percent: percentualMasculino,
      color: CORES_GENERO.masculino,
    },
    {
      label: "Mulheres",
      valueLabel: "candidatas",
      total: totalFeminino,
      percent: percentualFeminino,
      color: CORES_GENERO.feminino,
    },
  ];

  const percentualDiff = Math.abs(percentualMasculino - percentualFeminino);
  const interpretation =
    totalInscritos === 0
      ? "Sem inscrições no período filtrado para calcular a distribuição."
      : percentualDiff < 5
        ? "A distribuição entre homens e mulheres está equilibrada no período filtrado."
        : percentualMasculino > percentualFeminino
          ? "Homens representam a maior parte das inscrições no período filtrado."
          : "Mulheres representam a maior parte das inscrições no período filtrado.";

  const chartHeight = isLaptop ? 190 : isMobile ? 170 : 190;
  const chartMaxWidth = isMobile ? 190 : 220;

  return (
    <Box sx={{ minWidth: { laptop: 280 } }}>
      <CardContent sx={{ p: { xs: 2.5, mobile: 3 } }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Distribuição por gênero
        </Typography>

        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            gap: { xs: 1.75, mobile: 2 },
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              maxWidth: chartMaxWidth,
              position: "relative",
              width: "100%",
            }}
          >
            <MuiPieChart
              hideLegend
              series={[
                {
                  data: seriesData,
                  highlightScope: { fade: "global", highlight: "item" },
                  faded: { innerRadius: 42, additionalRadius: -24, color: "gray" },
                  arcLabel: (item) => `${formatPercent((item.value / (totalInscritos || 1)) * 100)}%`,
                  arcLabelMinAngle: 16,
                  innerRadius: isMobile ? 42 : 48,
                  paddingAngle: 2,
                  valueFormatter: (item) =>
                    `${item.value.toLocaleString("pt-BR")} inscrições (${formatPercent((item.value / (totalInscritos || 1)) * 100)}%)`,
                },
              ]}
              height={chartHeight}
              margin={{ top: 6, bottom: 6, left: 6, right: 6 }}
              sx={{
                "& .MuiPieArcLabel-root": {
                  fill: "#ffffff !important",
                  fontSize: isMobile ? 11 : 12,
                  fontWeight: 700,
                },
                "& .MuiPieArc-root": {
                  filter: "drop-shadow(0 5px 10px rgba(70, 50, 20, 0.12))",
                },
              }}
            />
            <Box
              sx={{
                left: "50%",
                pointerEvents: "none",
                position: "absolute",
                textAlign: "center",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: 10,
                  fontWeight: 700,
                  lineHeight: 1,
                  textTransform: "uppercase",
                }}
              >
                Total
              </Typography>
              <Typography
                sx={{
                  color: "text.primary",
                  fontSize: { xs: 16, mobile: 18 },
                  fontVariantNumeric: "tabular-nums",
                  fontWeight: 700,
                  lineHeight: 1.15,
                }}
              >
                {totalInscritos.toLocaleString("pt-BR")}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%" }}>
            {summaryItems.map((item) => (
              <Box
                key={item.label}
                sx={{
                  alignItems: "center",
                  border: "1px solid rgba(174, 143, 88, 0.14)",
                  borderRadius: "10px",
                  display: "grid",
                  gap: 1,
                  gridTemplateColumns: "minmax(0, 1fr) auto",
                  p: 1.25,
                }}
              >
                <Box sx={{ alignItems: "center", display: "flex", gap: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      bgcolor: item.color,
                      borderRadius: "50%",
                      flexShrink: 0,
                      height: 10,
                      width: 10,
                    }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, lineHeight: 1.25 }}>
                      {item.label}
                    </Typography>
                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: 11,
                        fontVariantNumeric: "tabular-nums",
                        lineHeight: 1.35,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {item.total.toLocaleString("pt-BR")} {item.valueLabel}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  sx={{
                    color: item.color,
                    fontSize: 13,
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatPercent(item.percent)}%
                </Typography>
              </Box>
            ))}

            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                justifyContent: "space-between",
                gap: 1,
                px: 0.25,
              }}
            >
              <Typography sx={{ color: "text.secondary", fontSize: 12, fontWeight: 600 }}>
                Total
              </Typography>
              <Typography
                sx={{
                  color: "text.primary",
                  fontSize: 12,
                  fontVariantNumeric: "tabular-nums",
                  fontWeight: 700,
                  textAlign: "right",
                }}
              >
                {totalInscritos.toLocaleString("pt-BR")} inscrições
              </Typography>
            </Box>
          </Box>

          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 12,
              lineHeight: 1.45,
              width: "100%",
            }}
          >
            {interpretation}
          </Typography>
        </Box>
      </CardContent>
    </Box>
  );
}
