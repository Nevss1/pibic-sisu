import { Container, Typography } from "@mui/material";
import CandidatosBarChart from "./CandidatosChart";
import YearFilter from "../cursos/[curso]/YearFilter";

export default function GeralPage() {
  return (
    <Container sx={{ paddingTop: 4 }}>
      <Typography 
        variant="h4"
        sx={{
          fontWeight: 500,
          letterSpacing: "-0.02em",
          color: "text.primary",
          p: 2
        }}>
        Panorama geral
      </Typography>

      <YearFilter curso="geral" />

      <CandidatosBarChart />
    </Container>
  )
}