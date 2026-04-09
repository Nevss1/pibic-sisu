import { Box, Typography, Container } from "@mui/material";

export default function SobrePage() {
  return (
    <Container>
      <Box
        py={10}
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
      >
        <Typography
          variant="h4"
          gutterBottom
          fontWeight={600}
          color="text.primary"
        >
          Página em Desenvolvimento
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 480 }}
        >
          Esta seção da plataforma está em fase de construção e será
          disponibilizada em breve.
        </Typography>
      </Box>
    </Container>
  );
}
