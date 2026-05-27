"use client";

import { useMemo } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Tooltip as MuiTooltip,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useCandidatosCursos } from "@/src/hooks";
import { useCampusFilter, useYearFilter } from "@/src/features";

const MIN_INSCRITOS = 30;
const TOP_N = 10;

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max - 1) + "…" : text;
}

export function TaxaAprovacaoRanking() {
  const { anosSelecionados } = useYearFilter();
  const { campusSelecionado } = useCampusFilter();
  const { data, isLoading } = useCandidatosCursos();

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

  if (isLoading || !data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={300}>
        <CircularProgress />
      </Box>
    );
  }

  if (!dataset.length) {
    return (
      <CardContent>
        <Typography color="text.secondary">
          Sem dados disponíveis para o recorte selecionado.
        </Typography>
      </CardContent>
    );
  }

  const chartHeight = Math.max(300, dataset.length * 52 + 64);

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
            max: 100,
            valueFormatter: (v) => `${v}%`,
          },
        ]}
        series={[
          {
            dataKey: "taxa",
            label: "Taxa de aprovação",
            color: "#4e9a8f",
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
    </CardContent>
  );
}
