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
  Legend,
} from "recharts";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";
import { useCursoFilter } from "../contexts";
import { DadoOverviewCurso } from "@/src/types/sisu";
import { DashboardEmptyState } from "@/src/components";

const CORES_SEXO = {
  masculino: "#2563EB",
  feminino: "#EF4444",
};

type ChartPoint = {
  ano: string;
  masculino: number;
  feminino: number;
};

function buildChartData(dados: DadoOverviewCurso[]): ChartPoint[] {
  const byYear = new Map<string, { masculino: number; feminino: number }>();

  for (const d of dados) {
    const entry = byYear.get(d.ano) ?? { masculino: 0, feminino: 0 };
    entry.masculino += d.inscritos_masculino;
    entry.feminino += d.inscritos_feminino;
    byYear.set(d.ano, entry);
  }

  return Array.from(byYear.entries())
    .map(([ano, v]) => ({ ano, ...v }))
    .sort((a, b) => Number(a.ano) - Number(b.ano));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.96)",
        border: "1px solid rgba(174, 143, 88, 0.18)",
        borderRadius: 12,
        boxShadow: "0 10px 28px rgba(70, 50, 20, 0.12)",
        padding: "10px 14px",
        fontSize: 13,
      }}
    >
      <p style={{ fontWeight: 700, marginBottom: 6, marginTop: 0 }}>{label}</p>
      {payload.map((entry: { dataKey: string; value: number }) => {
        const cor = entry.dataKey === "masculino" ? CORES_SEXO.masculino : CORES_SEXO.feminino;
        const rotulo = entry.dataKey === "masculino" ? "Masculino" : "Feminino";
        return (
          <div key={entry.dataKey} style={{ marginBottom: 4 }}>
            <span style={{ color: cor, fontWeight: 600 }}>{rotulo}</span>
            <br />
            <span style={{ color: "#666" }}>
              <strong>{entry.value.toLocaleString("pt-BR")}</strong> inscrições
            </span>
          </div>
        );
      })}
      <p style={{ color: "#999", fontSize: 11, marginTop: 6, marginBottom: 0 }}>
        Cada inscrição corresponde a uma opção de curso no SISU
      </p>
    </div>
  );
}

export function GeneroAprovacaoTemporalChart() {
  const theme = useTheme();
  const { dadosTodosPeriodos } = useCursoFilter();

  const chartData = useMemo(
    () => (dadosTodosPeriodos ? buildChartData(dadosTodosPeriodos) : []),
    [dadosTodosPeriodos]
  );

  const gridColor =
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(154, 106, 33, 0.12)";
  const textColor = theme.palette.text.secondary;

  if (!chartData.length) return <DashboardEmptyState />;

  return (
    <CardContent sx={{ p: { xs: 2.5, mobile: 3 } }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
        Candidatos por gênero ao longo do tempo
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Número de inscrições masculinas e femininas por ano — série histórica completa independente do filtro de ano
      </Typography>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="ano"
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={56}
            tickFormatter={(v) => v.toLocaleString("pt-BR")}
            domain={[0, "auto"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 13, paddingTop: 12 }}
            formatter={(value) => (value === "masculino" ? "Masculino" : "Feminino")}
          />
          <Line
            dataKey="masculino"
            name="masculino"
            stroke={CORES_SEXO.masculino}
            strokeWidth={2.5}
            dot={{ r: 4, fill: CORES_SEXO.masculino, stroke: "#ffffff", strokeWidth: 1.5 }}
            activeDot={{ r: 6, stroke: "#ffffff", strokeWidth: 2 }}
            connectNulls
          />
          <Line
            dataKey="feminino"
            name="feminino"
            stroke={CORES_SEXO.feminino}
            strokeWidth={2.5}
            dot={{ r: 4, fill: CORES_SEXO.feminino, stroke: "#ffffff", strokeWidth: 1.5 }}
            activeDot={{ r: 6, stroke: "#ffffff", strokeWidth: 2 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  );
}
