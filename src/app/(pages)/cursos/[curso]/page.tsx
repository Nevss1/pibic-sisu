import { toTitleCase } from "@/src/utils";
import { Box, Card, Container, Typography } from "@mui/material";
import { CampusFilter, YearFilter } from "@/src/components";
import { CursoFilterProvider } from "@/src/features/cursos";
import { CursoTabs, CursoOverviewCards, NotasHistogram, PieChartGenero } from "@/src/features/cursos/components"

export default async function CursoPageOverview({
  params,
}: {
  params: Promise<{ curso: string }>;
}) {
  const { curso } = await params;
  const nomeCurso = toTitleCase(decodeURIComponent(curso));

  return (
    <Container>
      <CursoFilterProvider curso={nomeCurso}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2
          }}
        >
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
          <CampusFilter />
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CursoTabs />
            
            <YearFilter />
          </Box>
          <CursoOverviewCards />
          <Card
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: "row",
              flexGrow: 1,
            }}
          >
            <Box sx={{ flex: 1, borderRight: 1, borderColor: "divider" }}>
              <NotasHistogram />
            </Box>
            <PieChartGenero />
          </Card>
        </Box>
      </CursoFilterProvider>
    </Container>
  );
}
