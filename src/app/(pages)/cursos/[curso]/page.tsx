import { toTitleCase } from "@/src/utils";
import { Box, Card, Container, Typography } from "@mui/material";
import CursoOverviewCards from "./CursoOverviewCards";
import BarChart from "./BarChart";
import PieChartGenero from "./PieChart";
import CursoTabs from "./CursoTabs";
import { CursoFilterProvider } from "./CursoFilterContext";
import YearFilter from "./YearFilter";

export default async function CursoPageOverview({
  params,
}: {
  params: Promise<{ curso: string }>;
}) {
  const { curso } = await params;
  const nomeCurso = toTitleCase(decodeURIComponent(curso));

  return (
    <Container>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 500,
          letterSpacing: "-0.02em",
          color: "text.primary",
          p: 2,
          mt: 2,
        }}
      >
        {nomeCurso}
      </Typography>
      <CursoFilterProvider curso={nomeCurso}>
        <Box
          sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, p: 2 }}
        >
          <CursoTabs />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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
              <BarChart />
            </Box>
            <PieChartGenero />
          </Card>
        </Box>
      </CursoFilterProvider>
    </Container>
  );
}
