import { toTitleCase } from "@/src/utils";
import { Box, Container } from "@mui/material";
import { EditionFilter, PageHeader } from "@/src/components";
import * as Modalidades from "@/src/features/cursos/modalidades";
import { CursoTabs } from "@/src/features/cursos";

export default async function ModalidadePage({
  params,
}: {
  params: Promise<{ curso: string }>;
}) {
  const { curso } = await params;
  const nomeCurso = toTitleCase(decodeURIComponent(curso));

  return (
    <Container>
      <Modalidades.ModalidadesFilterProvider curso={nomeCurso}>
        <PageHeader title={nomeCurso} tabs={<CursoTabs />} extraFilters={<EditionFilter />} />

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            p: 2,
          }}
        >
          <Modalidades.ModalidadesCards />
          <Modalidades.ModalidadesTemporalChart />
        </Box>
      </Modalidades.ModalidadesFilterProvider>
    </Container>
  );
}
