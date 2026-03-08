import { toTitleCase } from "@/src/utils";
import { Box, Container } from "@mui/material";
import CursoOverviewCards from "./CursoOverviewCards";
import CursoTabs from "../CursoTabs";
import BarChart from "./BarChart";

export default async function CursoPageOverview({ params }: { params: Promise<{ curso: string }> }) {
  const { curso } = await params;
  const nomeCurso = toTitleCase(decodeURIComponent(curso));

  return (
    <Container>
      <Box
        sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, p: 2 }}
      >
        <CursoTabs />
        <CursoOverviewCards curso={nomeCurso} />
        <BarChart curso={nomeCurso} />
        
      </Box>
    </Container>
  );
}
