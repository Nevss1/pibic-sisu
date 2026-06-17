"use client";

import { Box, Typography } from "@mui/material";
import { dashboardMetricCardSx } from "@/src/config/dashboardStyles";

export function StatBox({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Box
      sx={{
        ...dashboardMetricCardSx,
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
      }}
    >
      <Typography
        sx={{
          fontSize: 13,
          color: "#7A6A58",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 28,
          fontWeight: 700,
          color: "#7A5420",
          fontFamily: "var(--font-archivo), sans-serif",
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>
      {sub && (
        <Typography sx={{ fontSize: 12, color: "text.disabled" }}>{sub}</Typography>
      )}
    </Box>
  );
}
