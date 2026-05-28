"use client";

import { useMemo } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
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
const TOP_N = 10;
const BAR_COLOR = "#4e9a8f";

type RankingEntry = {
  curso: string;
  candidatos: number;
  aprovados: number;
  taxa: number;
};

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

function MobileRankingList({ dataset }: { dataset: RankingEntry[] }) {
  const maxRate = Math.max(...dataset.map((item) => item.taxa), 0);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      {dataset.map((item, index) => {
        const barRatio =
          item.taxa > 0 && maxRate > 0 ? Math.max(item.taxa / maxRate, 0.04) : 0;

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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                  minWidth: 0,
                }}
              >
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
                {item.taxa.toFixed(1)}%
              </Typography>
            </Box>

            <Box
              sx={{
                bgcolor: "rgba(78, 154, 143, 0.12)",
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

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: 11,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {item.candidatos.toLocaleString("pt-BR")} inscritos ·{" "}
              {item.aprovados.toLocaleString("pt-BR")} aprovados
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

export function TaxaAprovacaoRanking() {
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
          anosSelecionados.includes(d.ano) && d.campus === campusSelecionado
      )
      .reduce<
        Record<string, { curso: string; candidatos: number; aprovados: number }>
      >((acc, d) => {
        acc[d.no_curso] ??= { curso: d.no_curso, candidatos: 0, aprovados: 0 };
        acc[d.no_curso].candidatos += d.total_candidatos;
        acc[d.no_curso].aprovados += d.aprovados;
        return acc;
      }, {});

    return Object.values(aggregate)
      .filter((d) => d.candidatos >= MIN_INSCRITOS)
      .map((d) => ({
        curso: d.curso,
        candidatos: d.candidatos,
        aprovados: d.aprovados,
        taxa: parseFloat(((d.aprovados / d.candidatos) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.taxa - a.taxa)
      .slice(0, TOP_N);
  }, [data, anosSelecionados, campusSelecionado]);

  if (isLoading || !data) return <DashboardLoadingState height={360} />;
  if (error) return <DashboardErrorState />;
  if (!dataset.length) return <DashboardEmptyState />;

  const chartHeight = Math.max(300, dataset.length * 52 + 64);
  const maxRate = Math.max(...dataset.map((item) => item.taxa), 0);
  const xMax = Math.min(100, Math.max(10, Math.ceil(maxRate * 1.25)));

  return (
    <CardContent sx={{ p: { xs: 2.5, mobile: 3 } }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography fontWeight={700}>
            Cursos com maior taxa de aprovação
          </Typography>
          <MuiTooltip
            title={`Top ${TOP_N} cursos com maior proporção de aprovados em relação ao total de inscrições. Considera apenas cursos com pelo menos ${MIN_INSCRITOS} inscrições no recorte selecionado.`}
            arrow
            placement="right"
          >
            <InfoOutlinedIcon
              sx={{ fontSize: 16, color: "text.disabled", cursor: "help" }}
            />
          </MuiTooltip>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Aprovados ÷ inscritos · mínimo {MIN_INSCRITOS} inscrições por curso
        </Typography>
      </Box>

      {isMobile ? (
        <MobileRankingList dataset={dataset} />
      ) : (
        <BarChart
          layout="horizontal"
          dataset={dataset}
          yAxis={[
            {
              scaleType: "band",
              dataKey: "curso",
              valueFormatter: (v) => truncate(String(v), 26),
            },
          ]}
          xAxis={[
            {
              min: 0,
              max: xMax,
              valueFormatter: (v) => `${v}%`,
            },
          ]}
          series={[
            {
              dataKey: "taxa",
              label: "Taxa de aprovação",
              color: BAR_COLOR,
              valueFormatter: (v) => `${v}%`,
            },
          ]}
          height={chartHeight}
          margin={{ left: 180, right: 24, top: 8, bottom: 32 }}
          tooltip={{ trigger: "item" }}
          slotProps={{
            legend: { hidden: true },
          }}
          sx={{
            "& .MuiChartsAxis-tickLabel": {
              fontSize: { xs: "10px", sm: "12px" },
            },
          }}
        />
      )}
    </CardContent>
  );
}
