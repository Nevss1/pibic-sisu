"use client";

import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Fragment } from "react";
import { dashboardGlassCardSx } from "@/src/config/dashboardStyles";
import type { AnoRow } from "../perfil.types";

export function TabelaHistorico({ rows }: { rows: AnoRow[] }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("mobile"));

  if (isMobile) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {rows.map((row) => {
          const taxa = row.total > 0 ? ((row.aprovados / row.total) * 100).toFixed(1) + "%" : "—";
          const participacao = row.total_curso > 0 ? ((row.total / row.total_curso) * 100).toFixed(1) + "%" : "—";
          return (
            <Box key={row.ano} sx={{ ...dashboardGlassCardSx, p: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>
                {row.ano}
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                {[
                  { label: "Candidatos",    value: row.total.toLocaleString("pt-BR") },
                  { label: "Aprovados",     value: row.aprovados.toLocaleString("pt-BR") },
                  { label: "Taxa aprov.",   value: taxa },
                  { label: "Participação",  value: participacao },
                  { label: "Nota de corte", value: row.nota_corte_media?.toFixed(2) ?? "—" },
                ].map(({ label, value }) => (
                  <Box key={label}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#7A6A58",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        fontSize: "0.625rem",
                      }}
                    >
                      {label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#7A5420", fontWeight: 700 }}>
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "auto 1fr 1fr 1fr 1fr 1fr",
        columnGap: 4,
        rowGap: 1,
        alignItems: "center",
        overflowX: "auto",
      }}
    >
      {["Ano", "Candidatos", "Aprovados", "Taxa aprov.", "Participação", "Nota de corte"].map((h) => (
        <Typography
          key={h}
          variant="caption"
          sx={{ color: "#7A6A58", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}
        >
          {h}
        </Typography>
      ))}
      {rows.map((row) => {
        const taxa = row.total > 0 ? ((row.aprovados / row.total) * 100).toFixed(1) + "%" : "—";
        const participacao = row.total_curso > 0 ? ((row.total / row.total_curso) * 100).toFixed(1) + "%" : "—";
        return (
          <Fragment key={row.ano}>
            <Typography variant="body2" sx={{ color: "#7A5420", fontWeight: 700 }}>{row.ano}</Typography>
            <Typography variant="body2" color="text.secondary">{row.total.toLocaleString("pt-BR")}</Typography>
            <Typography variant="body2" color="text.secondary">{row.aprovados.toLocaleString("pt-BR")}</Typography>
            <Typography variant="body2" color="text.secondary">{taxa}</Typography>
            <Typography variant="body2" color="text.secondary">{participacao}</Typography>
            <Typography variant="body2" color="text.secondary">{row.nota_corte_media?.toFixed(2) ?? "—"}</Typography>
          </Fragment>
        );
      })}
    </Box>
  );
}
