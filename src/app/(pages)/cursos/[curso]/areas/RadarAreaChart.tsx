"use client";

import { RadarAxis, RadarChart } from "@mui/x-charts";
import { useAreasFilter } from "./AreasFilterContext";

const AREAS = [
  { label: "Matemática", key: "media_matematica" },
  { label: "Linguagens", key: "media_linguagens" },
  { label: "Humanas", key: "media_humanas" },
  { label: "Natureza", key: "media_natureza" },
  { label: "Redação", key: "media_redacao" },
] as const;

const COLOR_CURSO = "#D5B071";
const COLOR_UFMA = "#6B9FD4";

export const RadarAreaChart = () => {
  const { dadosFiltrados: dados, dadosUFMAFiltrados: dadosUFMA } = useAreasFilter();

  const calcMedias = (rows: typeof dados) =>
    rows && rows.length > 0
      ? AREAS.map((a) => rows.reduce((sum, d) => sum + d[a.key], 0) / rows.length)
      : [];

  const mediasCurso = calcMedias(dados);
  const mediasUFMA = calcMedias(dadosUFMA);

  const maxNota = Math.ceil(
    Math.max(...mediasCurso, ...mediasUFMA, 0) / 100
  ) * 100;

  return (
    <RadarChart
      height={300}
      shape="circular"
      sx={{ bgcolor: "#FEF9F6", borderRadius: 2 }}
      series={[
        {
          label: "Nota média do Campus",
          data: mediasUFMA,
          color: COLOR_UFMA,
          fillArea: true,
        },
        {
          label: "Nota Média ",
          data: mediasCurso,
          color: COLOR_CURSO,
          fillArea: true,
        },
      ]}
      radar={{
        metrics: AREAS.map((a) => a.label),
        max: maxNota,
      }}
    >
      <RadarAxis metric="Matemática" divisions={4} labelOrientation="rotated" angle={30} />
    </RadarChart>
  );
};
