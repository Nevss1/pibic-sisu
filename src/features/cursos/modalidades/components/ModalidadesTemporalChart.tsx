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
  Legend,
} from "recharts";
import { Box, Typography, useTheme } from "@mui/material";
import type { TooltipProps } from "recharts";
import { useModalidadesFilter } from "../contexts";
import type { DadoModalidadesCurso } from "@/src/types/sisu";

const CATEGORIAS = [
  "Ampla concorrência",
  "Bônus Maranhão",
  "Escola pública",
  "PPI",
  "Indígenas",
  "PcD",
] as const;

type Categoria = (typeof CATEGORIAS)[number];

const CORES: Record<Categoria, string> = {
  "Ampla concorrência": "#D5B071",
  "Bônus Maranhão": "#ae8f58",
  "Escola pública": "#7B9E87",
  PPI: "#5B7FA6",
  Indígenas: "#9B6B9B",
  PcD: "#C87361",
};

type AnoEntry = { ano: string } & Record<Categoria, number>;
type AuxCat = { total_candidatos: number; aprovados: number };
type AuxEntry = Record<Categoria, AuxCat>;

function buildChartData(dados: DadoModalidadesCurso[] | undefined): {
  chartData: AnoEntry[];
  auxData: Map<string, AuxEntry>;
} {
  if (!dados || dados.length === 0) return { chartData: [], auxData: new Map() };

  const byYear = new Map<string, AuxEntry>();

  for (const d of dados) {
    if (!CATEGORIAS.includes(d.categoria as Categoria)) continue;
    const cat = d.categoria as Categoria;

    if (!byYear.has(d.ano)) {
      byYear.set(
        d.ano,
        Object.fromEntries(
          CATEGORIAS.map((c) => [c, { total_candidatos: 0, aprovados: 0 }])
        ) as AuxEntry
      );
    }

    const entry = byYear.get(d.ano)!;
    entry[cat].total_candidatos += d.total_candidatos;
    entry[cat].aprovados += d.aprovados;
  }

  const chartData = Array.from(byYear.entries())
    .map(([ano, cats]) => ({
      ano,
      ...Object.fromEntries(
        CATEGORIAS.map((c) => [c, cats[c].total_candidatos])
      ),
    } as AnoEntry))
    .sort((a, b) => Number(a.ano) - Number(b.ano));

  return { chartData, auxData: byYear };
}

function CustomTooltip({
  active,
  payload,
  label,
  auxData,
}: TooltipProps<number, string> & { auxData: Map<string, AuxEntry> }) {
  const theme = useTheme();
  if (!active || !payload || !payload.length) return null;

  const anoData = auxData.get(label as string);
  const totalCandidatos = payload.reduce((s, p) => s + (p.value ?? 0), 0);

  return (
    <Box
      sx={{
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        p: 1.5,
        minWidth: 240,
        fontSize: 13,
      }}
    >
      <Typography sx={{ fontWeight: 600, mb: 1, fontSize: 13 }}>
        {label}
      </Typography>
      {[...payload].reverse().map((p) => {
        const cat = p.dataKey as Categoria;
        const aux = anoData?.[cat];
        const taxa =
          aux && aux.total_candidatos > 0
            ? ((aux.aprovados / aux.total_candidatos) * 100).toFixed(1) + "%"
            : "—";
        return (
          <Box
            key={cat}
            sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 0.5 }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: p.fill,
                mt: 0.3,
                flexShrink: 0,
              }}
            />
            <Box>
              <Typography sx={{ fontSize: 12, color: theme.palette.text.primary }}>
                {cat}
              </Typography>
              <Typography
                sx={{ fontSize: 11, color: theme.palette.text.secondary }}
              >
                {(p.value ?? 0).toLocaleString("pt-BR")} candidatos
                {aux
                  ? ` · ${aux.aprovados.toLocaleString("pt-BR")} aprovados · ${taxa}`
                  : ""}
              </Typography>
            </Box>
          </Box>
        );
      })}
      <Box
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          mt: 1,
          pt: 1,
        }}
      >
        <Typography sx={{ fontSize: 12, color: theme.palette.text.secondary }}>
          Total: {totalCandidatos.toLocaleString("pt-BR")} candidatos
        </Typography>
      </Box>
    </Box>
  );
}

export function ModalidadesTemporalChart() {
  const theme = useTheme();
  const { dadosTodosPeriodos } = useModalidadesFilter();

  const { chartData, auxData } = useMemo(
    () => buildChartData(dadosTodosPeriodos),
    [dadosTodosPeriodos]
  );

  const gridColor =
    theme.palette.mode === "dark"
      ? "rgba(255,255,255,0.08)"
      : "rgba(0,0,0,0.08)";
  const textColor = theme.palette.text.secondary;

  if (!chartData.length) {
    return (
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          boxShadow: "0px 1px 4px rgba(0,0,0,0.08)",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
          Candidatos por modalidade ao longo dos anos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sem dados disponíveis para o filtro selecionado.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        boxShadow: "0px 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
        Candidatos por modalidade ao longo dos anos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Total de candidatos inscritos por categoria de modalidade, por ano
      </Typography>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={chartData}
          margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={gridColor}
            vertical={false}
          />
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
            width={60}
            tickFormatter={(v) => v.toLocaleString("pt-BR")}
          />
          <Tooltip
            content={<CustomTooltip auxData={auxData} />}
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
          {CATEGORIAS.map((cat) => (
            <Bar key={cat} dataKey={cat} stackId="a" fill={CORES[cat]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
