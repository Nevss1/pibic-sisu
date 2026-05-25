import { toTitleCase } from "@/src/utils";
import { Box, Card, Container } from "@mui/material";
import { EditionFilter, PageHeader } from "@/src/components";
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
        <PageHeader title={nomeCurso} tabs={<CursoTabs />} extraFilters={<EditionFilter />} />

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
            sx={{
              display: "flex",
              flexDirection: { xs: "column", laptop: "row" },
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                flex: 1,
                borderRight: { xs: 0, laptop: 1 },
                borderBottom: { xs: 1, laptop: 0 },
                borderColor: "divider",
              }}
            >
              <NotasHistogram />
            </Box>
            <PieChartGenero />
          </Card>
        </Box>
      </CursoFilterProvider>
    </Container>
  );
}
