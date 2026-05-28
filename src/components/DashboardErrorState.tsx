"use client";

import { CardContent } from "@mui/material";
import Alert from "@mui/material/Alert";

type Props = {
  message?: string;
};

export function DashboardErrorState({
  message = "Não foi possível carregar os dados desta visualização.",
}: Props) {
  return (
    <CardContent sx={{ p: { xs: 2.5, mobile: 3 } }}>
      <Alert
        severity="warning"
        variant="outlined"
        sx={{
          borderColor: "rgba(174, 143, 88, 0.26)",
          color: "text.secondary",
          fontSize: 13,
          "& .MuiAlert-icon": { color: "rgba(174, 143, 88, 0.7)" },
        }}
      >
        {message}
      </Alert>
    </CardContent>
  );
}
