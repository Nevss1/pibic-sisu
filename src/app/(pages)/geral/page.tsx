import { Container, Typography } from "@mui/material";
import CandidatosBarChart from "./CandidatosChart";
import { YearFilterProvider } from "../YearFilterContext";
import { YearFilter } from "@/src/components";

export default function GeralPage() {
  return (
    <Container sx={{ paddingTop: 4 }}>
      <YearFilterProvider>
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
        <CandidatosBarChart />
      </YearFilterProvider>
    </Container>
  );
}
