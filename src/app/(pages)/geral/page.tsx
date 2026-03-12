import { Box, Container, Typography } from "@mui/material";
import CandidatosBarChart from "./CandidatosChart";
import { CampusFilter, YearFilter } from "@/src/components";
import { GeralFilterProvider } from "./GeralFilterContext";

export default function GeralPage() {
  return (
    <Container sx={{ paddingTop: 4 }}>
      <GeralFilterProvider>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <CampusFilter />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "text.primary",
              p: 2,
            }}
          >
            Panorama geral
          </Typography>
          <YearFilter />
        </Box>
        <CandidatosBarChart />
      </GeralFilterProvider>
    </Container>
  );
}
