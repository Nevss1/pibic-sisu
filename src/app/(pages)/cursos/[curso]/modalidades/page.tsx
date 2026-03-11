import { toTitleCase } from "@/src/utils";
import { Box, Container, Typography } from "@mui/material";
import { ModalidadesFilterProvider } from "./ModalidadesFilterContext";
import { CampusFilter, YearFilter } from "@/src/components";
import CursoTabs from "../CursoTabs";
import ModalidadesCards from "./ModalidadesCards";

export default async function ModalidadePage({
  params,
}: {
  params: Promise<{ curso: string }>;
}) {
  const { curso } = await params;
  const nomeCurso = toTitleCase(decodeURIComponent(curso));

  return (
    <Container sx={{ paddingTop: 4 }}>
      <ModalidadesFilterProvider curso={nomeCurso}>
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
          <ModalidadesCards />
        </Box>
      </ModalidadesFilterProvider>
    </Container>
  );
}
