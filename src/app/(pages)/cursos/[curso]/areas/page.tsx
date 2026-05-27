import { toTitleCase } from "@/src/utils";
import { Box, Container } from "@mui/material";
import { EditionFilter, PageHeader } from "@/src/components";
import * as Areas from "@/src/features/cursos/areas";
import { CursoTabs } from "@/src/features/cursos";

export default async function AreasPage({
  params,
}: {
  params: Promise<{ curso: string }>;
}) {
  const { curso } = await params;
  const nomeCurso = toTitleCase(decodeURIComponent(curso));

  return (
    <Container>
      <Areas.AreasFilterProvider curso={nomeCurso}>
        <PageHeader
          title={nomeCurso}
          tabs={<CursoTabs />}
          extraFilters={<EditionFilter contained />}
          filtersPanel
        />

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            p: 2,
          }}
        >
          <Areas.AreasCards />
          <Areas.AreasDifferenceChart />
        </Box>
      </Areas.AreasFilterProvider>
    </Container>
  );
}
