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
  ReferenceLine,
  Cell,
} from "recharts";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import type { TooltipProps } from "recharts";
import { useAreasFilter } from "../contexts/AreasFilterContext";
import { dashboardChartCardSx } from "@/src/config/dashboardStyles";

// ─── constantes ────────────────────────────────────────────────────────────────

const AREAS = [
  { label: "Matemática",  key: "media_matematica" },
  { label: "Linguagens",  key: "media_linguagens"  },
  { label: "Humanas",     key: "media_humanas"     },
  { label: "Natureza",    key: "media_natureza"    },
  { label: "Redação",     key: "media_redacao"     },
] as const;

const COLOR_POSITIVE = "#B8872E"; // dourado institucional
const COLOR_NEGATIVE = "#C87361"; // coral suave
const COLOR_ZERO     = "rgba(154, 106, 33, 0.30)";

type AreaKey  = (typeof AREAS)[number]["key"];
type AreasRows = ReturnType<typeof useAreasFilter>["dadosFiltrados"];

// ─── helpers ───────────────────────────────────────────────────────────────────

function avg(dados: AreasRows, key: AreaKey): number | null {
  if (!dados || dados.length === 0) return null;
  const values = dados.map((d) => d[key]).filter((v) => v != null) as number[];
  if (values.length === 0) return null;
  return Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 100) / 100;
}

function fmtNota(v: number | null): string {
  if (v == null) return "—";
  return v.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
}

function fmtSigned(v: number | null): string {
  if (v == null) return "—";
  const abs = Math.abs(v).toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });
  return `${v >= 0 ? "+" : "-"}${abs}`;
}

// ─── tipos internos ────────────────────────────────────────────────────────────

type ChartEntry = {
  label:    string;
  diferenca: number | null;
  curso:    number | null;
  campus:   number | null;
};

// ─── tooltip customizado ───────────────────────────────────────────────────────

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as ChartEntry;

  return (
    <Box
      sx={{
        background:   "rgba(255, 255, 255, 0.96)",
        border:       "1px solid rgba(174, 143, 88, 0.18)",
        borderRadius: 3,
        boxShadow:    "0 10px 28px rgba(70, 50, 20, 0.12)",
        p:            1.5,
        minWidth:     200,
        fontSize:     13,
      }}
    >
      <Typography sx={{ fontWeight: 700, mb: 1, fontSize: 13 }}>
        {d.label}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.35 }}>
        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
          Nota do curso:{" "}
          <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
            {fmtNota(d.curso)}
          </Box>
        </Typography>
        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
          Média do campus:{" "}
          <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
            {fmtNota(d.campus)}
          </Box>
        </Typography>
        <Box
          sx={{
            borderTop: "1px solid rgba(174, 143, 88, 0.14)",
            mt: 0.75,
            pt: 0.75,
          }}
        >
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
            Diferença:{" "}
            <Box
              component="span"
              sx={{
                fontWeight: 700,
                color:
                  d.diferenca == null
                    ? "text.secondary"
                    : d.diferenca >= 0
                    ? COLOR_POSITIVE
                    : COLOR_NEGATIVE,
              }}
            >
              {fmtSigned(d.diferenca)}
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// ─── label inline (SVG text) ───────────────────────────────────────────────────

interface LabelProps {
  x?:      number;
  y?:      number;
  width?:  number;
  height?: number;
  value?:  number;
}

function BarLabel({ x = 0, y = 0, width = 0, height = 0, value }: LabelProps) {
  if (value == null || !isFinite(value)) return null;

  // posiciona o label fora da barra: para positivos, à direita; negativos, à esquerda
  const isPositive = value >= 0;
  const lx     = isPositive ? x + width + 6 : x + width - 6;
  const anchor = isPositive ? "start" : "end";

  return (
    <text
      x={lx}
      y={y + height / 2}
      dy="0.35em"
      textAnchor={anchor}
      fontSize={11}
      fill="#7A6A58"
    >
      {fmtSigned(value)}
    </text>
  );
}

// ─── componente principal ──────────────────────────────────────────────────────

export function AreasDifferenceChart() {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("mobile"));

  const { dadosFiltrados: dados, dadosUFMAFiltrados: dadosUFMA } = useAreasFilter();

  const chartData = useMemo<ChartEntry[]>(
    () =>
      AREAS.map(({ label, key }) => {
        const curso  = avg(dados, key);
        const campus = avg(dadosUFMA, key);
        const diferenca =
          curso != null && campus != null
            ? Math.round((curso - campus) * 100) / 100
            : null;
        return { label, diferenca, curso, campus };
      }),
    [dados, dadosUFMA]
  );

  const hasData = chartData.some((d) => d.diferenca != null);

  // domínio simétrico em torno de zero, arredondado para múltiplo de 10
  const maxAbs = Math.max(
    ...chartData.map((d) => Math.abs(d.diferenca ?? 0)),
    10
  );
  const axisLimit = Math.ceil(maxAbs / 10) * 10 + 10;

  const gridColor  = "rgba(154, 106, 33, 0.12)";
  const textColor  = theme.palette.text.secondary;

  // margem esquerda maior em mobile para caber os labels das áreas
  const marginLeft = isMobile ? 82 : 96;

  return (
    <Box sx={{ ...dashboardChartCardSx, p: { xs: 2.5, mobile: 3 } }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
        Diferença em relação à média do campus
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Valores positivos indicam desempenho acima da média do campus; valores negativos indicam desempenho abaixo.
      </Typography>

      {!hasData ? (
        <Typography variant="body2" color="text.secondary">
          Sem dados disponíveis para o filtro selecionado.
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height={isMobile ? 300 : 320}>
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 4, right: isMobile ? 48 : 60, left: 0, bottom: 8 }}
            barCategoryGap="30%"
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke={gridColor}
              horizontal={false}
            />

            {/* eixo X (valores numéricos) */}
            <XAxis
              type="number"
              domain={[-axisLimit, axisLimit]}
              tickFormatter={(v) => fmtSigned(v)}
              tick={{ fill: textColor, fontSize: isMobile ? 10 : 12 }}
              axisLine={false}
              tickLine={false}
            />

            {/* eixo Y (nomes das áreas) */}
            <YAxis
              type="category"
              dataKey="label"
              width={marginLeft}
              tick={{ fill: textColor, fontSize: isMobile ? 11 : 12 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(213, 166, 66, 0.06)" }}
            />

            {/* linha de referência no zero */}
            <ReferenceLine
              x={0}
              stroke={COLOR_ZERO}
              strokeWidth={2}
            />

            <Bar
              dataKey="diferenca"
              radius={[0, 4, 4, 0]}
              label={<BarLabel />}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.label}
                  fill={
                    entry.diferenca == null
                      ? "rgba(154,106,33,0.22)"
                      : entry.diferenca >= 0
                      ? COLOR_POSITIVE
                      : COLOR_NEGATIVE
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
}
