import type { SxProps, Theme } from "@mui/material/styles";

export const dashboardGlassCardSx = {
  bgcolor: "rgba(255, 255, 255, 0.72)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(174, 143, 88, 0.14)",
  borderRadius: "16px",
  boxShadow: "0 8px 20px rgba(70, 50, 20, 0.045)",
} satisfies SxProps<Theme>;

export const dashboardChartCardSx = {
  bgcolor: "rgba(255, 252, 248, 0.82)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(174, 143, 88, 0.16)",
  borderRadius: "20px",
  boxShadow: "0 8px 24px rgba(70, 50, 20, 0.06)",
  overflow: "hidden",
} satisfies SxProps<Theme>;

export const dashboardMetricCardSx = {
  ...dashboardGlassCardSx,
  overflow: "hidden",
  position: "relative",
  transition: "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    bgcolor: "rgba(213, 166, 66, 0.42)",
  },
  "&:hover": {
    borderColor: "rgba(174, 143, 88, 0.26)",
    boxShadow: "0 12px 26px rgba(70, 50, 20, 0.07)",
    transform: "translateY(-2px)",
  },
} satisfies SxProps<Theme>;
