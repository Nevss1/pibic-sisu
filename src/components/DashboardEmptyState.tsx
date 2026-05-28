"use client";

import { Box, CardContent, Typography } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

type Props = {
  message?: string;
  hint?: string;
  height?: number;
};

export function DashboardEmptyState({
  message = "Sem dados disponíveis para o recorte selecionado.",
  hint = "Tente alterar o campus, ano ou edição.",
  height = 180,
}: Props) {
  return (
    <CardContent sx={{ p: { xs: 2.5, mobile: 3 } }}>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          height,
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <InboxOutlinedIcon
          sx={{ color: "rgba(174, 143, 88, 0.38)", fontSize: 36 }}
        />
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", maxWidth: 320 }}
        >
          {message}
        </Typography>
        {hint && (
          <Typography
            variant="caption"
            sx={{ color: "text.disabled", maxWidth: 300 }}
          >
            {hint}
          </Typography>
        )}
      </Box>
    </CardContent>
  );
}
