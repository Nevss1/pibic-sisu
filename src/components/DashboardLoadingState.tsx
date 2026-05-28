"use client";

import { Box, CardContent, Skeleton } from "@mui/material";

type Props = {
  height?: number;
  showHeader?: boolean;
};

export function DashboardLoadingState({ height = 300, showHeader = true }: Props) {
  return (
    <CardContent sx={{ p: { xs: 2.5, mobile: 3 } }}>
      {showHeader && (
        <Box sx={{ mb: 3 }}>
          <Skeleton
            variant="text"
            width="45%"
            height={26}
            sx={{ borderRadius: 1, mb: 0.75 }}
          />
          <Skeleton
            variant="text"
            width="65%"
            height={20}
            sx={{ borderRadius: 1 }}
          />
        </Box>
      )}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={showHeader ? height - 76 : height}
        sx={{ borderRadius: 2 }}
      />
    </CardContent>
  );
}
