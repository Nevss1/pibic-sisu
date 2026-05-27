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
  TooltipProps,
} from "recharts";
import {
  Box,
  CardContent,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useFaixasEtarias } from "@/src/hooks";
import { useCampusFilter } from "@/src/features";

// ─── Configuração das faixas ────────────────────────────────────────────────

const FAIXAS = [
  { key: "Menos de 18", color: "#5b8dee" },
  { key: "18 a 20",     color: "#4e9a8f" },
  { key: "21 a 24",     color: "#8fbe6e" },
  { key: "25 a 29",     color: "#D5B071" },
  { key: "30 a 39",     color: "#e07b39" },
  { key: "40 ou mais",  color: "#ae8f58" },
] as const;

// ─── Tipo interno para as linhas do gráfico ──────────────────────────────────

type ChartRow = {
  ano: string;
  _total: number;
} & Partial<Record<(typeof FAIXAS)[number]["key"], number>>;

// ─── Tooltip customizado ─────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;

  const total = payload.reduce((sum, p) => sum + (p.value ?? 0), 0);

  return (
    <Box
      sx={{
        bgcolor: "rgba(255, 255, 255, 0.97)",
        border: "1px solid rgba(174, 143, 88, 0.18)",
        borderRadius: "12px",
        boxShadow: "0 10px 28px rgba(70, 50, 20, 0.12)",
        maxWidth: 220,
        p: "10px 14px",
      }}
    >
      <Typography
        sx={{ color: "text.primary", fontWeight: 700, mb: 0.75, fontSize: 13 }}
      >
        {label}
      </Typography>

      {[...payload].reverse().map((p) => {
        const pct =
          total > 0 ? ((p.value ?? 0) / total) * 100 : 0;
        return (
          <Box
            key={p.dataKey}
            sx={{ alignItems: "center", display: "flex", gap: 0.75, mb: 0.4 }}
          >
            <Box
              sx={{
                bgcolor: p.fill,
                borderRadius: "3px",
                flexShrink: 0,
                height: 10,
                width: 10,
              }}
            />
            <Typography sx={{ color: "text.secondary", fontSize: 12, flexGrow: 1 }}>
              {p.name}
            </Typography>
            <Typography
              sx={{
                color: "text.primary",
                fontVariantNumeric: "tabular-nums",
                fontSize: 12,
                fontWeight: 600,
                ml: 1,
                whiteSpace: "nowrap",
              }}
            >
              {(p.value ?? 0).toLocaleString("pt-BR")}
              {" "}
              <Typography component="span" sx={{ color: "text.disabled", fontSize: 11 }}>
                ({pct.toFixed(1)}%)
              </Typography>
            </Typography>
          </Box>
        );
      })}

      <Box
        sx={{
          borderTop: "1px solid rgba(174, 143, 88, 0.14)",
          display: "flex",
          justifyContent: "space-between",
          mt: 0.75,
          pt: 0.75,
        }}
      >
        <Typography sx={{ color: "text.secondary", fontSize: 12 }}>Total</Typography>
        <Typography
          sx={{
            color: "text.primary",
            fontVariantNumeric: "tabular-nums",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {total.toLocaleString("pt-BR")}
        </Typography>
      </Box>
    </Box>
  );
}

// ─── Fallback mobile: lista de anos com barra de distribuição ─────────────────

type MobileRow = ChartRow;

function MobileFaixasList({ data }: { data: MobileRow[] }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {data.map((row) => {
        const total = row._total || 1;
        return (
          <Box key={row.ano}>
            <Typography
              sx={{
                color: "text.primary",
                fontVariantNumeric: "tabular-nums",
                fontSize: 14,
                fontWeight: 700,
                mb: 1,
              }}
            >
              {row.ano}
            </Typography>

            {FAIXAS.map(({ key, color }) => {
              const val = row[key] ?? 0;
              const pct = (val / total) * 100;
              return (
                <Box key={key} sx={{ mb: 0.75 }}>
                  <Box
                    sx={{
                      alignItems: "baseline",
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.3,
                    }}
                  >
                    <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
                      {key}
                    </Typography>
                    <Typography
                      sx={{
                        color: "text.primary",
                        fontVariantNumeric: "tabular-nums",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {pct.toFixed(1)}%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: "rgba(174, 143, 88, 0.10)",
                      borderRadius: "5px",
                      height: 8,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: color,
                        borderRadius: "5px",
                        height: "100%",
                        transition: "width 0.4s ease",
                        width: `${Math.max(pct, pct > 0 ? 1 : 0)}%`,
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        );
      })}
    </Box>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

/**
 * FaixasEtariasChart
 *
 * Exibe a distribuição de inscrições por faixa etária estimada (ano − dt_nascimento),
 * agrupada por ano. Filtro de campus aplicado a partir do contexto.
 *
 * Mostra todos os anos disponíveis no eixo X (igual a EvolucaoTemporalChart)
 * porque o eixo X é o próprio tempo — filtrar por ano resultaria num gráfico
 * de barra única, sem valor analítico.
 *
 * Privacidade: dt_nascimento nunca é retornado; apenas faixas agregadas.
 */
export function FaixasEtariasChart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("tabletSmall"));
  const { campusSelecionado } = useCampusFilter();
  const { data, isLoading } = useFaixasEtarias();

  const chartData = useMemo<ChartRow[]>(() => {
    if (!data) return [];

    // Filtra por campus e pivota faixa_etaria → colunas
    const byAno = new Map<string, ChartRow>();

    for (const d of data) {
      if (d.campus !== campusSelecionado) continue;

      if (!byAno.has(d.ano)) {
        byAno.set(d.ano, { ano: d.ano, _total: 0 });
      }
      const row = byAno.get(d.ano)!;
      row[d.faixa_etaria as (typeof FAIXAS)[number]["key"]] =
        (row[d.faixa_etaria as (typeof FAIXAS)[number]["key"]] ?? 0) +
        d.total_candidatos;
      row._total += d.total_candidatos;
    }

    return Array.from(byAno.values()).sort(
      (a, b) => Number(a.ano) - Number(b.ano)
    );
  }, [data, campusSelecionado]);

  // ── Estados de carregamento / vazio ─────────────────────────────────────

  // Aguarda tanto os dados da API quanto o campus ser selecionado pelo
  // GeralFilterProvider (que depende de useCursoOverview resolver).
  // Sem esse check, o useMemo roda com campusSelecionado="" e retorna
  // array vazio antes do contexto de campus estar pronto.
  if (isLoading || !campusSelecionado) {
    return (
      <CardContent sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={32} />
      </CardContent>
    );
  }

  if (!chartData.length) {
    return (
      <CardContent>
        <Typography color="text.secondary">
          Sem dados de faixa etária disponíveis para o campus selecionado.
        </Typography>
      </CardContent>
    );
  }

  // ── Estilo ───────────────────────────────────────────────────────────────

  const isDark = theme.palette.mode === "dark";
  const gridColor = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(154, 106, 33, 0.12)";
  const textColor = theme.palette.text.secondary;

  return (
    <CardContent sx={{ p: { xs: 2.5, mobile: 3 } }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
        Distribuição por faixa etária
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Inscrições por faixa etária estimada ao longo dos anos · idade = ano do processo − ano de nascimento
      </Typography>

      {isMobile ? (
        <MobileFaixasList data={chartData} />
      ) : (
        <ResponsiveContainer width="100%" height={340}>
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 24, left: 0, bottom: 0 }}
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
            <YAxis
              tick={{ fill: textColor, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v.toLocaleString("pt-BR")}
              width={64}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
              iconType="square"
              iconSize={10}
            />
            {FAIXAS.map(({ key, color }) => (
              <Bar
                key={key}
                dataKey={key}
                name={key}
                stackId="faixas"
                fill={color}
                radius={
                  key === "40 ou mais"
                    ? [4, 4, 0, 0]
                    : undefined
                }
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </CardContent>
  );
}
