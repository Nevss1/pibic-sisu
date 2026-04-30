"use client";

import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useYearFilter } from "../features";

export function YearFilter() {
  const { anosDisponiveis, anosSelecionados, setAnosSelecionados } = useYearFilter();

  return (
    <ToggleButtonGroup
      value={anosSelecionados}
      onChange={(_, newAnos: string[]) => {
        if (newAnos.length > 0) setAnosSelecionados(newAnos);
      }}
      size="small"
      sx={{ display: "flex", flexWrap: "wrap", gap: "2px" }}
    >
      {anosDisponiveis.map((ano) => (
        <ToggleButton key={ano} value={ano} sx={{ px: { xs: 1.5, mobile: 2 } }}>
          {ano}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
