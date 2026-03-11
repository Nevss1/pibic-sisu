"use client";

import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useYearFilter } from "../app/(pages)/YearFilterContext";

export function YearFilter() {
  const { anosDisponiveis, anosSelecionados, setAnosSelecionados } = useYearFilter();

  return (
    <ToggleButtonGroup
      value={anosSelecionados}
      onChange={(_, newAnos: string[]) => {
        if (newAnos.length > 0) setAnosSelecionados(newAnos);
      }}
      size="small"
    >
      {anosDisponiveis.map((ano) => (
        <ToggleButton key={ano} value={ano} sx={{ px: 2 }}>
          {ano}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
