"use client";

import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const EDICOES = [
  { value: "1", label: "1ª ed." },
  { value: "2", label: "2ª ed." },
];

type EditionFilterProps = {
  contained?: boolean;
};

export function EditionFilter({ contained = false }: EditionFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const edicao = searchParams.get("edicao") ?? null;

  const handleChange = useCallback(
    (_: React.MouseEvent, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("edicao", value);
      } else {
        params.delete("edicao");
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  return (
    <ToggleButtonGroup
      value={edicao}
      exclusive
      onChange={handleChange}
      size="small"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: contained ? 0.75 : 0,
        "& .MuiToggleButtonGroup-grouped": contained
          ? {
              m: 0,
              border: "1px solid rgba(174, 143, 88, 0.18)",
              borderRadius: "999px !important",
            }
          : undefined,
      }}
    >
      {EDICOES.map(({ value, label }) => (
        <ToggleButton
          key={value}
          value={value}
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
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
