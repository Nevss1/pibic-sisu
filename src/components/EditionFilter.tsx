"use client";

import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const EDICOES = [
  { value: "1", label: "1ª ed." },
  { value: "2", label: "2ª ed." },
];

export function EditionFilter() {
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
    >
      {EDICOES.map(({ value, label }) => (
        <ToggleButton key={value} value={value} sx={{ px: { xs: 1.5, mobile: 2 } }}>
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
