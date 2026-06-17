"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { Box, Typography, useTheme } from "@mui/material";
import { dashboardGlassCardSx } from "@/src/config/dashboardStyles";
import type { AnoRow } from "../perfil.types";

type ChartRow = {
  ano: number;
  taxa: number | null;
  nota_corte_media: number | null;
  total: number;
  aprovados: number;
};

type TooltipPayloadItem = {
  name: string;
  value: number | null;
  color: string;
  payload: ChartRow;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: number;
};

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const entry = payload[0]?.payload as ChartRow | undefined;
  if (!entry) return null;

  const rows = [
    {
      label: "Taxa de aprovação",
      value: entry.taxa != null ? `${entry.taxa.toFixed(1)}%` : "—",
    },
    {
      label: "Candidatos (perfil)",
      value: entry.total.toLocaleString("pt-BR"),
    },
    {
      label: "Aprovados",
      value: entry.aprovados.toLocaleString("pt-BR"),
    },
    {
      label: "Nota de corte média",
      value: entry.nota_corte_media != null
        ? entry.nota_corte_media.toFixed(2)
        : "—",
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: "rgba(255, 255, 255, 0.96)",
        border: "1px solid rgba(174, 143, 88, 0.18)",
        borderRadius: 3,
        p: 1.5,
        minWidth: 200,
        boxShadow: "0 10px 28px rgba(70, 50, 20, 0.12)",
      }}
    >
      <Typography variant="caption" fontWeight={700} display="block" mb={1}>
        {label}
      </Typography>
      {rows.map(({ label: l, value }) => (
        <Box
          key={l}
          sx={{ display: "flex", justifyContent: "space-between", gap: 3 }}
        >
          <Typography variant="caption" color="text.secondary">{l}</Typography>
          <Typography variant="caption" fontWeight={500}>{value}</Typography>
        </Box>
      ))}
    </Box>
  );
}

export function PerfilTemporalChart({ rows }: { rows: AnoRow[] }) {
  const theme = useTheme();

  const chartData = useMemo<ChartRow[]>(
    () =>
      rows
        .map((r) => ({
          ano: r.ano,
          taxa:
            r.total > 0
              ? parseFloat(((r.aprovados / r.total) * 100).toFixed(1))
              : null,
          nota_corte_media: r.nota_corte_media,
          total: r.total,
          aprovados: r.aprovados,
        }))
        .sort((a, b) => a.ano - b.ano),
    [rows]
  );

  const isDark = theme.palette.mode === "dark";
  const gridColor = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(154, 106, 33, 0.12)";
  const textColor = theme.palette.text.secondary;

  if (chartData.length < 2) {
    return (
      <Box sx={{ ...dashboardGlassCardSx, p: 3, textAlign: "center" }}>
        <Typography variant="body2" color="text.disabled">
          São necessários pelo menos 2 anos com dados para exibir a evolução temporal.
        </Typography>
      </Box>
    );
  }

  const hasCorte = chartData.some((d) => d.nota_corte_media != null);

  return (
    <Box sx={{ ...dashboardGlassCardSx, p: 3 }}>
      <Typography variant="body2" fontWeight={700} color="#7A5420" mb={0.5}>
        Evolução da taxa de aprovação
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" mb={3}>
        Aprovados ÷ candidatos do perfil por ano
      </Typography>

      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart
          data={chartData}
          margin={{ top: 4, right: hasCorte ? 56 : 24, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="4 4"
            stroke={gridColor}
            vertical={false}
          />
          <XAxis
            dataKey="ano"
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          {/* Eixo esquerdo — taxa de aprovação (%) */}
          <YAxis
            yAxisId="taxa"
            domain={[0, 100]}
            tick={{ fill: "#4e9a8f", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            width={48}
          />

          {/* Eixo direito — nota de corte (opcional) */}
          {hasCorte && (
            <YAxis
              yAxisId="corte"
              orientation="right"
              tick={{ fill: "#D5B071", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v.toFixed(0)}
              width={48}
              domain={["auto", "auto"]}
            />
          )}

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{ fontSize: 13, paddingTop: 16 }}
            iconType="plainline"
          />

          <ReferenceLine
            yAxisId="taxa"
            y={0}
            stroke={gridColor}
            strokeWidth={1}
          />

          <Line
            yAxisId="taxa"
            dataKey="taxa"
            name="Taxa de aprovação (%)"
            stroke="#4e9a8f"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#4e9a8f" }}
            activeDot={{ r: 6 }}
            connectNulls={false}
          />

          {hasCorte && (
            <Line
              yAxisId="corte"
              dataKey="nota_corte_media"
              name="Nota de corte média"
              stroke="#D5B071"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={{ r: 3, fill: "#D5B071" }}
              activeDot={{ r: 5 }}
              connectNulls={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
}
