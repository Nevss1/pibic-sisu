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
  LabelList,
} from "recharts";
import {
  CardContent,
  Typography,
  Box,
  Tooltip as MuiTooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useCandidatosCursos } from "@/src/hooks";
import { useCampusFilter, useYearFilter } from "@/src/features";
import { DashboardEmptyState, DashboardErrorState, DashboardLoadingState } from "@/src/components";

const MIN_INSCRITOS = 30;
const BAR_COLOR = "#D5B071";

type RankingEntry = {
  curso: string;
  media_nota_corte: number;
  total_candidatos: number;
};

function MobileRankingList({ dataset }: { dataset: RankingEntry[] }) {
  const maxNota = Math.max(...dataset.map((item) => item.media_nota_corte), 0);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      {dataset.map((item, index) => {
        const barRatio =
          item.media_nota_corte > 0 && maxNota > 0
            ? Math.max(item.media_nota_corte / maxNota, 0.04)
            : 0;

        return (
          <Box key={item.curso}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 1.25,
                mb: 0.75,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    color: "text.secondary",
                    flexShrink: 0,
                    fontSize: 12,
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: 700,
                    lineHeight: 1.5,
                    width: 24,
                  }}
                >
                  {index + 1}º
                </Typography>
                <Typography
                  sx={{
                    color: "text.primary",
                    fontSize: 13,
                    fontWeight: 600,
                    lineHeight: 1.35,
                    minWidth: 0,
                    overflowWrap: "anywhere",
                  }}
                >
                  {item.curso}
                </Typography>
              </Box>
              <Typography
                sx={{
                  color: BAR_COLOR,
                  flexShrink: 0,
                  fontSize: 13,
                  fontVariantNumeric: "tabular-nums",
                  fontWeight: 700,
                  lineHeight: 1.35,
                  whiteSpace: "nowrap",
                }}
              >
                {item.media_nota_corte.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </Box>

            <Box
              sx={{
                bgcolor: "rgba(213, 176, 113, 0.15)",
                borderRadius: "6px",
                height: 10,
                mb: 0.75,
                overflow: "hidden",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  bgcolor: BAR_COLOR,
                  borderRadius: "6px",
                  height: "100%",
                  transition: "width 0.4s ease",
                  width: `${barRatio * 100}%`,
                }}
              />
            </Box>

            <Typography sx={{ color: "text.secondary", fontSize: 11, fontVariantNumeric: "tabular-nums" }}>
              {item.total_candidatos.toLocaleString("pt-BR")} inscrições consideradas
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const entry = payload[0].payload as RankingEntry;
  return (
    <Box
      sx={{
        background: "rgba(255,255,255,0.96)",
        border: "1px solid rgba(174,143,88,0.18)",
        borderRadius: 3,
        boxShadow: "0 10px 28px rgba(70,50,20,0.12)",
        p: 1.5,
        minWidth: 220,
        fontSize: 13,
      }}
    >
      <Typography sx={{ fontWeight: 600, fontSize: 13, mb: 0.75 }}>{entry.curso}</Typography>
      <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
        Nota de corte média:{" "}
        <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
          {entry.media_nota_corte.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Box>
      </Typography>
      <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
        Inscrições:{" "}
        <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
          {entry.total_candidatos.toLocaleString("pt-BR")}
        </Box>
      </Typography>
    </Box>
  );
}

export function NotaCorteRanking() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("tabletSmall"));
  const { anosSelecionados } = useYearFilter();
  const { campusSelecionado } = useCampusFilter();
  const { data, isLoading, error } = useCandidatosCursos();

  const dataset = useMemo(() => {
    if (!data) return [];

    const aggregate = data
      .filter(
        (d) =>
          anosSelecionados.includes(d.ano) &&
          d.campus === campusSelecionado &&
          d.media_nota_corte != null
      )
      .reduce<Record<string, { curso: string; soma_ponderada: number; total_candidatos: number }>>(
        (acc, d) => {
          acc[d.no_curso] ??= { curso: d.no_curso, soma_ponderada: 0, total_candidatos: 0 };
          acc[d.no_curso].soma_ponderada += (d.media_nota_corte as number) * d.total_candidatos;
          acc[d.no_curso].total_candidatos += d.total_candidatos;
          return acc;
        },
        {}
      );

    return Object.values(aggregate)
      .filter((d) => d.total_candidatos >= MIN_INSCRITOS)
      .map((d) => ({
        curso: d.curso,
        media_nota_corte: parseFloat((d.soma_ponderada / d.total_candidatos).toFixed(2)),
        total_candidatos: d.total_candidatos,
      }))
      .sort((a, b) => b.media_nota_corte - a.media_nota_corte);
  }, [data, anosSelecionados, campusSelecionado]);

  if (isLoading || !data) return <DashboardLoadingState height={360} />;
  if (error) return <DashboardErrorState />;
  if (!dataset.length) return <DashboardEmptyState />;

  const chartHeight = dataset.length * 52 + 48;
  const textColor = theme.palette.text.secondary;
  const gridColor = theme.palette.mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(154,106,33,0.12)";
  const xMin = Math.max(0, Math.floor(Math.min(...dataset.map((i) => i.media_nota_corte)) * 0.9));
  const xMax = Math.ceil(Math.max(...dataset.map((i) => i.media_nota_corte)) * 1.12);

  return (
    <CardContent sx={{ p: { xs: 2.5, mobile: 3 } }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography fontWeight={700}>Cursos com maiores notas de corte</Typography>
          <MuiTooltip
            title={`Cursos com maior nota de corte média ponderada pelo total de inscrições. Considera apenas cursos com pelo menos ${MIN_INSCRITOS} inscrições no recorte selecionado.`}
            arrow
            placement="right"
          >
            <InfoOutlinedIcon sx={{ fontSize: 16, color: "text.disabled", cursor: "help" }} />
          </MuiTooltip>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Ranking dos cursos com maior nota de corte média no recorte selecionado.
        </Typography>
      </Box>

      {isMobile ? (
        <MobileRankingList dataset={dataset} />
      ) : (
        <Box sx={{ overflowY: "auto", maxHeight: 600 }}>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              layout="vertical"
              data={dataset}
              margin={{ top: 4, right: 72, left: 0, bottom: 4 }}
              barCategoryGap="28%"
            >
              <CartesianGrid strokeDasharray="4 4" stroke={gridColor} horizontal={false} />
              <XAxis
                type="number"
                domain={[xMin, xMax]}
                tickFormatter={(v) => v.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}
                tick={{ fill: textColor, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickCount={5}
              />
              <YAxis
                type="category"
                dataKey="curso"
                width={280}
                tick={{ fill: theme.palette.text.primary, fontSize: 13, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(213,166,66,0.06)" }} />
              <Bar dataKey="media_nota_corte" fill={BAR_COLOR} radius={[0, 4, 4, 0]}>
                <LabelList
                  dataKey="media_nota_corte"
                  position="right"
                  formatter={(v: unknown) =>
                    Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  }
                  style={{ fontSize: 12, fontWeight: 600, fill: textColor }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </CardContent>
  );
}
