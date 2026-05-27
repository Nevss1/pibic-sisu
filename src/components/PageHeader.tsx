"use client";

import { Box, Typography } from "@mui/material";
import { CampusFilter } from "./CampusFilter";
import { YearFilter } from "./YearFilter";

interface PageHeaderProps {
  title: string;
  tabs?: React.ReactNode;
  extraFilters?: React.ReactNode;
  filtersPanel?: boolean;
}

export function PageHeader({ title, tabs, extraFilters, filtersPanel = false }: PageHeaderProps) {
  if (filtersPanel) {
    return (
      <Box sx={{ px: 2, pt: 2 }}>
        <Typography variant="h4" sx={{ mb: 1.5 }}>
          {title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: 1,
            mb: 2,
            width: "100%",
            maxWidth: "100%",
            p: 1.25,
            bgcolor: "rgba(255, 255, 255, 0.65)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(174, 143, 88, 0.14)",
            borderRadius: "16px",
            boxShadow: "0 6px 16px rgba(70, 50, 20, 0.035)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              gap: 1.5,
            }}
          >
            <Box sx={{ width: "100%" }}>
              <CampusFilter contained />
            </Box>

            {extraFilters && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", mobile: "row" },
                  alignItems: { xs: "stretch", mobile: "center" },
                  gap: 0.75,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "#7A6A58",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    lineHeight: 1,
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  Edição
                </Typography>
                {extraFilters}
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", mobile: "row" },
              alignItems: { xs: "stretch", mobile: "center" },
              gap: 0.75,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#7A6A58",
                fontWeight: 700,
                letterSpacing: "0.06em",
                lineHeight: 1,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              Ano
            </Typography>
            <YearFilter contained />
          </Box>
        </Box>

        {tabs && (
          <Box sx={{ mb: 2 }}>
            {tabs}
          </Box>
        )}
      </Box>
    );
  }

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
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "flex-start", mobile: "flex-end" }, gap: 1 }}>
          {extraFilters}
          <YearFilter />
        </Box>
      </Box>
    </Box>
  );
}
