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
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useGeralOverview } from "@/src/hooks";
import { useCampusFilter } from "@/src/features";

type TemporalEntry = {
  ano: string | number;
  inscritos: number;
  aprovados: number;
};

function MobileTemporalList({ data }: { data: TemporalEntry[] }) {
  const maxInscritos = Math.max(...data.map((item) => item.inscritos), 1);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
      {data.map((item) => {
        const taxa =
          item.inscritos > 0 ? (item.aprovados / item.inscritos) * 100 : 0;
        const barRatio =
          item.inscritos > 0 ? Math.max(item.inscritos / maxInscritos, 0.04) : 0;

        return (
          <Box key={item.ano} sx={{ minWidth: 0 }}>
            <Box
              sx={{
                alignItems: "baseline",
                display: "flex",
                gap: 1,
                justifyContent: "space-between",
                mb: 0.75,
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  color: "text.primary",
                  flexShrink: 0,
                  fontSize: 14,
                  fontVariantNumeric: "tabular-nums",
                  fontWeight: 700,
                }}
              >
                {item.ano}
              </Typography>
              <Typography
                sx={{
                  color: "#4e9a8f",
                  flexShrink: 0,
                  fontSize: 13,
                  fontVariantNumeric: "tabular-nums",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                {taxa.toLocaleString("pt-BR", {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}
                %
              </Typography>
            </Box>

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: 12,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1.45,
                mb: 0.75,
                overflowWrap: "anywhere",
              }}
            >
              {item.inscritos.toLocaleString("pt-BR")} inscritos ·{" "}
              {item.aprovados.toLocaleString("pt-BR")} aprovados · aprovação
            </Typography>

            <Box
              sx={{
                bgcolor: "rgba(174, 143, 88, 0.12)",
                borderRadius: "6px",
                height: 10,
                overflow: "hidden",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  bgcolor: "#D5B071",
                  borderRadius: "6px",
                  height: "100%",
                  transition: "width 0.4s ease",
                  width: `${barRatio * 100}%`,
                }}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

export function EvolucaoTemporalChart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("tabletSmall"));
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
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(154, 106, 33, 0.12)";
  const textColor = theme.palette.text.secondary;

  return (
    <CardContent sx={{ p: { xs: 2.5, mobile: 3 } }}>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 700, mb: 0.5 }}
      >
        Evolução temporal
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Total de inscritos e aprovados ao longo dos anos
      </Typography>

      {isMobile ? (
        <MobileTemporalList data={chartData} />
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={chartData} margin={{ top: 4, right: 56, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} />
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
                background: "rgba(255, 255, 255, 0.96)",
                border: "1px solid rgba(174, 143, 88, 0.18)",
                borderRadius: 12,
                boxShadow: "0 10px 28px rgba(70, 50, 20, 0.12)",
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
      )}
    </CardContent>
  );
}
