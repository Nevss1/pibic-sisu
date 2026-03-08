import { toTitleCase } from "@/src/utils";
import { Box, Card, Container } from "@mui/material";
import CursoOverviewCards from "./CursoOverviewCards";
import BarChart from "./BarChart";
import PieChartGenero from "./PieChart";
import CursoTabs from "./CursoTabs";

export default async function CursoPageOverview({
  params,
}: {
  params: Promise<{ curso: string }>;
}) {
  const { curso } = await params;
  const nomeCurso = toTitleCase(decodeURIComponent(curso));

  return (
    <Container>
      <Box
        sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, p: 2 }}
      >
        <CursoTabs />
        <CursoOverviewCards curso={nomeCurso} />
        <Card
          variant="outlined"
          sx={{
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
          }}
        >
          <Box sx={{ flex: 1, borderRight: 1, borderColor: "divider", }}>
            <BarChart curso={nomeCurso} />
          </Box>
          <PieChartGenero curso={nomeCurso} />
        </Card>
      </Box>
    </Container>
  );
}
