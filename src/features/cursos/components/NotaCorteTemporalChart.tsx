"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";
import { useCursoFilter } from "../contexts";

type ChartPoint = {
  ano: string;
  media_nota_corte: number;
  min_nota_corte: number;
  max_nota_corte: number;
};

function buildChartData(dados: ReturnType<typeof useCursoFilter>["dadosFiltrados"]): ChartPoint[] {
  if (!dados || dados.length === 0) return [];

  const byYear = new Map<string, { somaMedia: number; somaInscritos: number; min: number; max: number }>();

  for (const d of dados) {
    const existing = byYear.get(d.ano);
    if (existing) {
      existing.somaMedia += d.media_nota_corte * d.total_inscritos;
      existing.somaInscritos += d.total_inscritos;
      existing.min = Math.min(existing.min, d.min_nota_corte);
      existing.max = Math.max(existing.max, d.max_nota_corte);
    } else {
      byYear.set(d.ano, {
        somaMedia: d.media_nota_corte * d.total_inscritos,
        somaInscritos: d.total_inscritos,
        min: d.min_nota_corte,
        max: d.max_nota_corte,
      });
    }
  }

  return Array.from(byYear.entries())
    .map(([ano, v]) => ({
      ano,
      media_nota_corte: Math.round((v.somaMedia / v.somaInscritos) * 100) / 100,
      min_nota_corte: Math.round(v.min * 100) / 100,
      max_nota_corte: Math.round(v.max * 100) / 100,
    }))
    .sort((a, b) => Number(a.ano) - Number(b.ano));
}

export function NotaCorteTemporalChart() {
  const theme = useTheme();
  const { dadosTodosPeriodos } = useCursoFilter();

  const chartData = useMemo(() => buildChartData(dadosTodosPeriodos), [dadosTodosPeriodos]);

  if (!chartData.length) {
    return (
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
          Evolução da nota de corte
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Sem dados disponíveis para o filtro selecionado.
        </Typography>
      </CardContent>
    );
  }

  const gridColor =
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textColor = theme.palette.text.secondary;
  const lineColor = "#D5B071";

  const allValues = chartData.flatMap((d) => [d.min_nota_corte, d.max_nota_corte]);
  const yMin = Math.floor(Math.min(...allValues) / 50) * 50;
  const yMax = Math.ceil(Math.max(...allValues) / 50) * 50;

  return (
    <CardContent>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
        Evolução da nota de corte
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Média ponderada da nota de corte por ano (mín/máx no tooltip)
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 4, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="ano"
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={56}
            tickFormatter={(v) => v.toLocaleString("pt-BR")}
          />
          <Tooltip
            contentStyle={{
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 8,
              fontSize: 13,
            }}
            labelStyle={{
              fontWeight: 600,
              marginBottom: 4,
              color: theme.palette.text.primary,
            }}
            formatter={(value, name) => {
              const labels: Record<string, string> = {
                media_nota_corte: "Média nota de corte",
                min_nota_corte: "Mínima",
                max_nota_corte: "Máxima",
              };
              return [Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 }), labels[name as string] ?? name];
            }}
          />
          {chartData.length > 1 && (
            <ReferenceLine
              y={chartData.reduce((s, d) => s + d.media_nota_corte, 0) / chartData.length}
              stroke={theme.palette.text.disabled}
              strokeDasharray="4 4"
              label={{ value: "Média geral", fill: textColor, fontSize: 11, position: "insideTopRight" }}
            />
          )}
          <Line
            dataKey="min_nota_corte"
            name="min_nota_corte"
            stroke={lineColor}
            strokeWidth={1}
            strokeDasharray="4 3"
            dot={false}
            legendType="none"
          />
          <Line
            dataKey="max_nota_corte"
            name="max_nota_corte"
            stroke={lineColor}
            strokeWidth={1}
            strokeDasharray="4 3"
            dot={false}
            legendType="none"
          />
          <Line
            dataKey="media_nota_corte"
            name="media_nota_corte"
            stroke={lineColor}
            strokeWidth={2.5}
            dot={{ r: 4, fill: lineColor, strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  );
}
