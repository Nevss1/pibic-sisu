import { Box, Card, Container } from "@mui/material";
import { PageHeader } from "@/src/components";
import { CandidatosBarChart, EvolucaoTemporalChart, FaixasEtariasChart, GeralFilterProvider, TaxaAprovacaoRanking } from "@/src/features/geral";
import { dashboardChartCardSx } from "@/src/config/dashboardStyles";

export default function GeralPage() {
  return (
    <Container>
      <GeralFilterProvider>
        <PageHeader title="Panorama geral" filtersPanel />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, px: 2, pb: 4 }}>
          <Card variant="outlined" sx={dashboardChartCardSx}>
            <CandidatosBarChart />
          </Card>

          <Card variant="outlined" sx={dashboardChartCardSx}>
            <EvolucaoTemporalChart />
          </Card>

          <Card variant="outlined" sx={dashboardChartCardSx}>
            <TaxaAprovacaoRanking />
          </Card>

          <Card variant="outlined" sx={dashboardChartCardSx}>
            <FaixasEtariasChart />
          </Card>
        </Box>
      </GeralFilterProvider>
    </Container>
  );
}
