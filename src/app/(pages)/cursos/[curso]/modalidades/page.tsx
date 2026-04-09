import { toTitleCase } from "@/src/utils";
import { Box, Container, Typography } from "@mui/material";
import { CampusFilter, YearFilter } from "@/src/components";
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
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
          <Modalidades.ModalidadesCards />
        </Box>
      </Modalidades.ModalidadesFilterProvider>
    </Container>
  );
}
