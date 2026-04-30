import { Box, Card, Container } from "@mui/material";
import { PageHeader } from "@/src/components";
import { CandidatosBarChart, EvolucaoTemporalChart, GeralFilterProvider } from "@/src/features/geral";

export default function GeralPage() {
  return (
    <Container>
      <GeralFilterProvider>
        <PageHeader title="Panorama geral" />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, px: 2, pb: 4 }}>
          <Card variant="outlined">
            <CandidatosBarChart />
          </Card>

          <Card variant="outlined">
            <EvolucaoTemporalChart />
          </Card>
        </Box>
      </GeralFilterProvider>
    </Container>
  );
}
