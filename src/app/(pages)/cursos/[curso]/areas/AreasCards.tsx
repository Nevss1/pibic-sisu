"use client";

import { Box, Typography } from "@mui/material";
import { useAreasFilter } from "./AreasFilterContext";

const AREAS = [
  { label: "Matemática", key: "media_matematica" },
  { label: "Linguagens", key: "media_linguagens" },
  { label: "Humanas", key: "media_humanas" },
  { label: "Natureza", key: "media_natureza" },
  { label: "Redação", key: "media_redacao" },
] as const;

function avg(dados: ReturnType<typeof useAreasFilter>["dadosFiltrados"], key: typeof AREAS[number]["key"]) {
  if (!dados || dados.length === 0) return null;
  const values = dados.map((d) => d[key]).filter((v) => v != null);
  if (values.length === 0) return null;
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100;
}

export default function AreasCards() {
  const { dadosFiltrados: dados } = useAreasFilter();

  return (
    <Box
      sx={{
        boxShadow: "0px 1px 4px rgba(0,0,0,0.08)",
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
      }}
    >
      <Box sx={{ display: "flex", width: "100%" }}>
        {AREAS.map((area, index) => (
          <Box
            key={area.key}
            sx={{
              flex: 1,
              p: 3,
              borderRight: index < AREAS.length - 1 ? 1 : 0,
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                height: 100,
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
                minHeight: 100,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 400, color: "text.primary", fontSize: 16 }}
              >
                {area.label}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 500,
                  color: "text.primary",
                  fontSize: 24,
                  fontFamily: "var(--font-archivo), sans-serif",
                }}
              >
                {avg(dados, area.key) ?? "—"}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
