import { PerfilClient } from "@/src/features/perfil";
import { Box, Container, Typography } from "@mui/material";

export default function PerfilPage() {
  return (
    <Container sx={{ paddingTop: 4, paddingBottom: 6 }}>
      <Box mb={4} p={2}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: "text.primary",
          }}
        >
          Análise de perfil
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 1, maxWidth: 560 }}
        >
          Informe suas características socioeconômicas e o curso desejado para
          consultar a taxa histórica de aprovação de candidatos com perfil
          semelhante no SISU UFMA.
        </Typography>
      </Box>
      <PerfilClient />
    </Container>
  );
}
