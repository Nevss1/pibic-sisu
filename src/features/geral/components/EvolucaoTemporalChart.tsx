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
} from "recharts";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";
import { useGeralOverview } from "@/src/hooks";
import { useCampusFilter } from "@/src/features";

export function EvolucaoTemporalChart() {
  const theme = useTheme();
  const { campusSelecionado } = useCampusFilter();
  const { data, isLoading } = useGeralOverview();

  const chartData = useMemo(() => {
    if (!data) return [];
    return data
      .filter((d) => d.campus === campusSelecionado)
      .map((d) => ({
        ano: d.ano,
        inscritos: d.total_inscritos,
        aprovados: d.aprovados,
      }))
      .sort((a, b) => Number(a.ano) - Number(b.ano));
  }, [data, campusSelecionado]);

  if (isLoading) {
    return (
      <CardContent sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={32} />
      </CardContent>
    );
  }

  if (!chartData.length) {
    return (
      <CardContent>
        <Typography color="text.secondary">Sem dados disponíveis.</Typography>
      </CardContent>
    );
  }

  const isDark = theme.palette.mode === "dark";
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textColor = theme.palette.text.secondary;

  return (
    <CardContent>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 600, mb: 0.5 }}
      >
        Evolução temporal
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Total de inscritos e aprovados ao longo dos anos
      </Typography>

      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={chartData} margin={{ top: 4, right: 56, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="ano"
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="inscritos"
            tick={{ fill: "#5b8dee", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v.toLocaleString("pt-BR")}
            width={64}
          />
          <YAxis
            yAxisId="aprovados"
            orientation="right"
            tick={{ fill: "#4e9a8f", fontSize: 12 }}
            domain={[0, (dataMax: number) => Math.ceil(dataMax * 2)]}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v.toLocaleString("pt-BR")}
            width={56}
          />
          <Tooltip
            contentStyle={{
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 8,
              fontSize: 13,
            }}
            labelStyle={{ fontWeight: 600, marginBottom: 4, color: theme.palette.text.primary }}
            formatter={(value, name) => [Number(value).toLocaleString("pt-BR"), name]}
          />
          <Legend
            wrapperStyle={{ fontSize: 13, paddingTop: 16 }}
            iconType="plainline"
          />
          <Line
            yAxisId="inscritos"
            dataKey="inscritos"
            name="Inscritos"
            stroke="#5b8dee"
            strokeWidth={2}
            dot={{ r: 4, fill: "#5b8dee" }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="aprovados"
            dataKey="aprovados"
            name="Aprovados"
            stroke="#4e9a8f"
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={{ r: 4, fill: "#4e9a8f" }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </CardContent>
  );
}
