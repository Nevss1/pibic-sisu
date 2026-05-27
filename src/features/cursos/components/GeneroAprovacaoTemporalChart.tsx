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
import { useCampusFilter } from "@/src/features";
import { useGeneroCurso } from "@/src/hooks";
import { DadoGeneroCurso } from "@/src/types/sisu";

// Valores de sexo presentes no dataset SISU (M = Masculino, F = Feminino).
// Registros com sexo nulo são excluídos pela query.
const SEXO_LABELS: Record<string, string> = {
  M: "Masculino",
  F: "Feminino",
};

const CORES_SEXO: Record<string, string> = {
  M: "#2563EB",
  F: "#EF4444",
};

type ChartPoint = {
  ano: string;
  M_taxa: number | null;
  F_taxa: number | null;
  M_total: number;
  F_total: number;
  M_aprovados: number;
  F_aprovados: number;
};

function buildChartData(dados: DadoGeneroCurso[], campus: string): ChartPoint[] {
  const filtered = dados.filter((d) => d.campus === campus);
  if (filtered.length === 0) return [];

  // Agrupa por ano — se houver múltiplas edições no mesmo ano, soma candidatos
  // e recalcula a taxa para evitar média de médias.
  const byYear = new Map<string, { M_total: number; M_aprov: number; F_total: number; F_aprov: number }>();

  for (const d of filtered) {
    const entry = byYear.get(d.ano) ?? { M_total: 0, M_aprov: 0, F_total: 0, F_aprov: 0 };
    if (d.sexo === "M") {
      entry.M_total += d.total_candidatos;
      entry.M_aprov += d.aprovados;
    } else if (d.sexo === "F") {
      entry.F_total += d.total_candidatos;
      entry.F_aprov += d.aprovados;
    }
    byYear.set(d.ano, entry);
  }

  return Array.from(byYear.entries())
    .map(([ano, v]) => ({
      ano,
      M_taxa: v.M_total > 0 ? Math.round((v.M_aprov / v.M_total) * 10000) / 100 : null,
      F_taxa: v.F_total > 0 ? Math.round((v.F_aprov / v.F_total) * 10000) / 100 : null,
      M_total: v.M_total,
      F_total: v.F_total,
      M_aprovados: v.M_aprov,
      F_aprovados: v.F_aprov,
    }))
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
      {payload.map((entry: { dataKey: string; value: number; payload: ChartPoint }) => {
        const sexo = entry.dataKey === "M_taxa" ? "M" : "F";
        const total = sexo === "M" ? entry.payload.M_total : entry.payload.F_total;
        const aprovados = sexo === "M" ? entry.payload.M_aprovados : entry.payload.F_aprovados;
        return (
          <div key={entry.dataKey} style={{ marginBottom: 4 }}>
            <span style={{ color: CORES_SEXO[sexo], fontWeight: 600 }}>
              {SEXO_LABELS[sexo]}
            </span>
            <br />
            <span style={{ color: "#666" }}>
              Taxa: <strong>{entry.value?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}%</strong>
            </span>
            <br />
            <span style={{ color: "#888", fontSize: 12 }}>
              {aprovados.toLocaleString("pt-BR")} aprovados / {total.toLocaleString("pt-BR")} inscritos
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function GeneroAprovacaoTemporalChart() {
  const theme = useTheme();
  const { curso } = useCursoFilter();
  const { campusSelecionado } = useCampusFilter();

  const { data: dadosGenero, isLoading } = useGeneroCurso(curso);

  const chartData = useMemo(
    () => (dadosGenero && campusSelecionado ? buildChartData(dadosGenero, campusSelecionado) : []),
    [dadosGenero, campusSelecionado]
  );

  const gridColor =
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(154, 106, 33, 0.12)";
  const textColor = theme.palette.text.secondary;

  if (isLoading) {
    return (
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
          Taxa de aprovação por gênero
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Carregando...
        </Typography>
      </CardContent>
    );
  }

  if (!chartData.length) {
    return (
      <CardContent>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
          Taxa de aprovação por gênero
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Sem dados disponíveis para o filtro selecionado.
        </Typography>
      </CardContent>
    );
  }

  return (
    <CardContent sx={{ p: { xs: 2.5, mobile: 3 } }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
        Taxa de aprovação por gênero
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Evolução anual da taxa de aprovação (%) para cada sexo — série histórica completa independente do filtro de ano
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
            width={48}
            tickFormatter={(v) => `${v}%`}
            domain={[0, "auto"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 13, paddingTop: 12 }}
            formatter={(value) => (value === "M_taxa" ? "Masculino" : "Feminino")}
          />
          <Line
            dataKey="M_taxa"
            name="M_taxa"
            stroke={CORES_SEXO.M}
            strokeWidth={2.5}
            dot={{ r: 4, fill: CORES_SEXO.M, stroke: "#ffffff", strokeWidth: 1.5 }}
            activeDot={{ r: 6, stroke: "#ffffff", strokeWidth: 2 }}
            connectNulls
          />
          <Line
            dataKey="F_taxa"
            name="F_taxa"
            stroke={CORES_SEXO.F}
            strokeWidth={2.5}
            dot={{ r: 4, fill: CORES_SEXO.F, stroke: "#ffffff", strokeWidth: 1.5 }}
            activeDot={{ r: 6, stroke: "#ffffff", strokeWidth: 2 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  );
}
