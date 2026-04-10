import { Box, Card, Container, Typography } from "@mui/material";
import { CampusFilter, YearFilter } from "@/src/components";
import { CandidatosBarChart, GeralFilterProvider } from "@/src/features/geral";

export default function GeralPage() {
  return (
    <Container>
      <GeralFilterProvider>
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
            }}
          >
            Panorama geral
          </Typography>
          <CampusFilter />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            px: 2,
            mb: 4,
          }}
        >
          <YearFilter />
        </Box>

        <Card variant="outlined">
          <CandidatosBarChart />
        </Card>
      </GeralFilterProvider>
    </Container>
  );
}
