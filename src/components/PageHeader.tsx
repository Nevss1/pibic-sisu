"use client";

import { Box, Typography } from "@mui/material";
import { CampusFilter } from "./CampusFilter";
import { YearFilter } from "./YearFilter";

interface PageHeaderProps {
  title: string;
  tabs?: React.ReactNode;
  extraFilters?: React.ReactNode;
}

export function PageHeader({ title, tabs, extraFilters }: PageHeaderProps) {
  return (
    <Box sx={{ px: 2, pt: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", mobile: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", mobile: "center" },
          gap: 2,
          mb: 2,
        }}
      >
        <Typography variant="h4">{title}</Typography>
        <CampusFilter />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", mobile: "row" },
          justifyContent: tabs ? "space-between" : "flex-end",
          alignItems: { xs: "flex-start", mobile: "center" },
          gap: { xs: 1.5, mobile: 0 },
          mb: 2,
        }}
      >
        {tabs}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {extraFilters}
          <YearFilter />
        </Box>
      </Box>
    </Box>
  );
}
