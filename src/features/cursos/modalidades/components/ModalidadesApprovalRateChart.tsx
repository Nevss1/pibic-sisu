"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import type { TooltipProps } from "recharts";
import { useModalidadesFilter } from "../contexts";
import { dashboardChartCardSx } from "@/src/config/dashboardStyles";

// Categorias com as mesmas chaves de agregação usadas em ModalidadesCards
const CATEGORIAS = [
  { label: "Ampla concorrência", keys: ["Ampla concorrência"], color: "#D5B071" },
  { label: "Bônus Maranhão",     keys: ["Bônus Maranhão"],     color: "#ae8f58" },
  { label: "Cota geral",         keys: ["Escola pública", "PPI", "Indígenas", "PcD"], color: "#5F9E7B" },
  { label: "PPI",                keys: ["PPI"],                color: "#5B7FA6" },
  { label: "Indígenas",          keys: ["Indígenas"],          color: "#9B6B9B" },
  { label: "PcD",                keys: ["PcD"],                color: "#C87361" },
] as const;

type ChartEntry = {
  label: string;
  taxa: number;
  total_candidatos: number;
  aprovados: number;
  color: string;
};

function buildChartData(
  dados: ReturnType<typeof useModalidadesFilter>["dadosFiltrados"]
): ChartEntry[] {
  if (!dados) return [];

  return CATEGORIAS
    .map(({ label, keys, color }) => {
      const rows = dados.filter((d) => (keys as readonly string[]).includes(d.categoria));
      const total_candidatos = rows.reduce((a, b) => a + b.total_candidatos, 0);
      const aprovados = rows.reduce((a, b) => a + b.aprovados, 0);
      const taxa = total_candidatos > 0
        ? parseFloat(((aprovados / total_candidatos) * 100).toFixed(1))
        : 0;
      return { label, taxa, total_candidatos, aprovados, color };
    })
    .filter((e) => e.total_candidatos > 0)
    .sort((a, b) => b.taxa - a.taxa);
}

function CustomTooltip({
  active,
  payload,
}: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;

  const entry = payload[0].payload as ChartEntry;

  return (
    <Box
      sx={{
        background: "rgba(255, 255, 255, 0.96)",
        border: "1px solid rgba(174, 143, 88, 0.18)",
        borderRadius: 3,
        boxShadow: "0 10px 28px rgba(70, 50, 20, 0.12)",
        p: 1.5,
        minWidth: 220,
        fontSize: 13,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: entry.color,
            flexShrink: 0,
          }}
        />
        <Typography sx={{ fontWeight: 600, fontSize: 13 }}>
          {entry.label}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
          Candidatos:{" "}
          <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
            {entry.total_candidatos.toLocaleString("pt-BR")}
          </Box>
        </Typography>
        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
          Aprovados:{" "}
          <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
            {entry.aprovados.toLocaleString("pt-BR")}
          </Box>
        </Typography>
        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
          Taxa de aprovação:{" "}
          <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
            {entry.taxa.toFixed(1)}%
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}

// Formata rótulos longos para não ultrapassar a área do eixo Y em mobile
function truncateLabel(label: string, maxLen: number) {
  return label.length > maxLen ? label.slice(0, maxLen - 1) + "…" : label;
}

export function ModalidadesApprovalRateChart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("tabletSmall"));
  const { dadosFiltrados } = useModalidadesFilter();

  const chartData = useMemo(() => buildChartData(dadosFiltrados), [dadosFiltrados]);

  const gridColor =
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.08)"
      : "rgba(154, 106, 33, 0.12)";
  const textColor = theme.palette.text.secondary;

  // Altura dinâmica: ~52px por barra, mínimo 280px
  const chartHeight = Math.max(280, chartData.length * 56 + 40);
  const maxRate = Math.max(...chartData.map((item) => item.taxa), 0);
  const xMax = Math.min(100, Math.max(10, Math.ceil(maxRate * 1.25)));

  if (!chartData.length) {
    return (
      <Box sx={{ ...dashboardChartCardSx, p: { xs: 2.5, mobile: 3 } }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
          Taxa de aprovação por modalidade
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sem dados disponíveis para o filtro selecionado.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ ...dashboardChartCardSx, p: { xs: 2.5, mobile: 3 } }}>
      {/* Cabeçalho */}
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
        Taxa de aprovação por modalidade
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Percentual de aprovados em relação ao total de candidatos de cada
        modalidade no período filtrado.
      </Typography>

      {/* Gráfico */}
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{
            top: 0,
            right: isMobile ? 34 : 56,
            left: isMobile ? -8 : 0,
            bottom: 0,
          }}
          barCategoryGap={isMobile ? "24%" : "28%"}
        >
          <CartesianGrid
            strokeDasharray="4 4"
            stroke={gridColor}
            horizontal={false}
          />
          <XAxis
            type="number"
            domain={[0, xMax]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fill: textColor, fontSize: isMobile ? 11 : 12 }}
            axisLine={false}
            tickLine={false}
            tickCount={isMobile ? 4 : 6}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={isMobile ? 96 : 130}
            tick={{ fill: textColor, fontSize: isMobile ? 11 : 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => truncateLabel(v, isMobile ? 13 : 18)}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(213, 166, 66, 0.06)" }}
          />
          <Bar
            dataKey="taxa"
            radius={[0, 6, 6, 0]}
            label={{
              position: "right",
              formatter: (v: number) => `${v.toFixed(1)}%`,
              fill: textColor,
              fontSize: isMobile ? 11 : 12,
            }}
          >
            {chartData.map((entry) => (
              <Cell key={entry.label} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
