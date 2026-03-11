import { toTitleCase } from "@/src/utils";
import { Box, Container, Typography } from "@mui/material";
import { AreasFilterProvider } from "./AreasFilterContext";
import { YearFilter } from "@/src/components";
import CursoTabs from "../CursoTabs";
import AreasCards from "./AreasCards";

export default async function AreasPage({
  params,
}: {
  params: Promise<{ curso: string }>;
}) {
  const { curso } = await params;
  const nomeCurso = toTitleCase(decodeURIComponent(curso));

  return (
    <Container sx={{ paddingTop: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 500,
          letterSpacing: "-0.02em",
          color: "text.primary",
          p: 2,
        }}
      >
        {nomeCurso}
      </Typography>
      <AreasFilterProvider curso={nomeCurso}>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <CursoTabs />
            <Box sx={{ position: "relative" }}>
              <Typography
                variant="caption"
                sx={{ position: "absolute", top: -25, width: "100%", textAlign: "center" }}
              >
                Filtrar por ano:
              </Typography>
              <YearFilter />
            </Box>
          </Box>
          <AreasCards />
        </Box>
      </AreasFilterProvider>
    </Container>
  );
}
