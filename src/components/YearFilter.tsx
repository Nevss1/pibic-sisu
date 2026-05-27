"use client";

import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useYearFilter } from "../features";

type YearFilterProps = {
  contained?: boolean;
};

export function YearFilter({ contained = false }: YearFilterProps) {
  const { anosDisponiveis, anosSelecionados, setAnosSelecionados } = useYearFilter();

  return (
    <ToggleButtonGroup
      exclusive
      value={anosSelecionados[0] ?? null}
      onChange={(_, newAno: string | null) => {
        if (newAno) setAnosSelecionados([newAno]);
      }}
      size="small"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: contained ? 0.75 : "2px",
        width: contained ? "100%" : "auto",
        "& .MuiToggleButtonGroup-grouped": contained
          ? {
              m: 0,
              border: "1px solid rgba(174, 143, 88, 0.18)",
              borderRadius: "999px !important",
            }
          : undefined,
      }}
    >
      {anosDisponiveis.map((ano) => (
        <ToggleButton
          key={ano}
          value={ano}
          sx={{
            px: { xs: 1.5, mobile: 2 },
            ...(contained
              ? {
                  minHeight: 30,
                  bgcolor: "rgba(255, 252, 248, 0.72)",
                  color: "#5F554A",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "rgba(213, 166, 66, 0.12)",
                    borderColor: "rgba(174, 143, 88, 0.28)",
                  },
                  "&.Mui-selected": {
                    bgcolor: "#7A5420",
                    borderColor: "#7A5420",
                    color: "#ffffff",
                    "&:hover": {
                      bgcolor: "#6B481B",
                      borderColor: "#6B481B",
                    },
                  },
                }
              : {}),
          }}
        >
          {ano}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
