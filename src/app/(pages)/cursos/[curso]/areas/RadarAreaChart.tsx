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

const COLOR = "#D5B071";

export const RadarAreaChart = () => {
  const { dadosFiltrados: dados } = useAreasFilter();

  const mediasGerais =
    dados && dados.length > 0
      ? AREAS.map(
          (a) => dados.reduce((sum, d) => sum + d[a.key], 0) / dados.length,
        )
      : [];

  return (
    <RadarChart
      height={300}
      // divisions={10}
      shape="circular"
      series={[
        {
          label: "Nota Média das Áreas",
          data: mediasGerais,
          color: COLOR,
          fillArea: true,
        },
      ]}
      radar={{
        metrics: AREAS.map((a) => a.label),
        max: 1000,
      }}
    >
      <RadarAxis metric="Matemática" divisions={4} labelOrientation="rotated" angle={30} />
    </RadarChart>
  );
};
