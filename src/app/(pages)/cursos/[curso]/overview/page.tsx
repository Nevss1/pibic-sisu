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
          p: 2,
        }}
      >
        <CursoTabs />
        <Box>
          <Box
            sx={{ boxShadow: "0px 1px 4px rgba(0,0,0,0.08)", borderRadius: 2, border: 1, borderColor: "divider" }}
          >
            <Grid container>
              {cards.map((card, index) => (
                <Grid
                  size={{ xs: 12, md: 3 }}
                  sx={{
                    p: 3,
                    borderRight: index < cards.length - 1 ? 1 : 0,
                    borderColor: "divider",
                  }}
                  key={card.label}
                >
                  <Box
                    sx={{
                      height: 100,
                      display: "flex",
                      justifyContent: "space-between",
                      flexDirection: "column",
                      minHeight: 100,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 400,
                        color: "text.primary",
                        fontSize: 16,
                      }}
                    >
                      {card.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        color: "text.primary",
                        fontSize: 24,
                        fontFamily: "var(--font-archivo), sans-serif",
                      }}
                    >
                      {card.value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
