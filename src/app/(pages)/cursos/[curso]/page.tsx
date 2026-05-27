import { toTitleCase } from "@/src/utils";
import { Box, Card, Container } from "@mui/material";
import { EditionFilter, PageHeader } from "@/src/components";
import { CursoFilterProvider } from "@/src/features/cursos";
import { CursoTabs, CursoOverviewCards, NotasHistogram, PieChartGenero, NotaCorteTemporalChart, GeneroAprovacaoTemporalChart } from "@/src/features/cursos/components"
import { dashboardChartCardSx } from "@/src/config/dashboardStyles";

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
        <PageHeader
          title={nomeCurso}
          tabs={<CursoTabs />}
          extraFilters={<EditionFilter contained />}
          filtersPanel
        />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            p: 2,
          }}
        >
          <CursoOverviewCards />
          <Card
            variant="outlined"
            sx={dashboardChartCardSx}
          >
            <NotaCorteTemporalChart />
          </Card>
          <Card
            variant="outlined"
            sx={dashboardChartCardSx}
          >
            <GeneroAprovacaoTemporalChart />
          </Card>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", laptop: "row" },
              gap: 3,
            }}
          >
            <Card
              variant="outlined"
              sx={{
                ...dashboardChartCardSx,
                flex: 1,
              }}
            >
              <NotasHistogram />
            </Card>
            <Card
              variant="outlined"
              sx={{
                ...dashboardChartCardSx,
                minWidth: { laptop: 320 },
              }}
            >
              <PieChartGenero />
            </Card>
          </Box>
        </Box>
      </CursoFilterProvider>
    </Container>
  );
}
