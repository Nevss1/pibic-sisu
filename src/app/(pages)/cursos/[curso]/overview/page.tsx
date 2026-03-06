import { toTitleCase } from "@/src/utils";
import { Box, Card, Container, Grid, Paper, Typography } from "@mui/material";
import CursoTabs from "@/src/components/CursoTabs";

export default async function CursoPageOverview({
  params,
}: {
  params: Promise<{ curso: string }>;
}) {
  const { curso } = await params;
  const nomeCurso = toTitleCase(decodeURIComponent(curso));

  const cards = [
    { label: "Candidatos", value: 123192 },
    { label: "Média de Nota do Candidato", value: 3123 },
    { label: "Média de Nota de Corte", value: 31231 },
    { label: "Taxa de Aprovação", value: `${121}%` },
  ];

  return (
    <Container>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <CursoTabs />
        <Box>
          <Box
          >
            <Grid container>
              {cards.map((card, index) => (
                <Grid size={{ xs: 12, md: 3 }} key={card.label}>
                  <Card
                    variant="outlined"
                    sx={{ height: 100, p: 2, borderRadius: 0, border: 0 }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "var(--font-archivo), sans-serif",
                        fontWeight: 500,
                      }}
                    >
                      {card.label}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontFamily: "var(--font-archivo), sans-serif" }}
                    >
                      {card.value}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
