import colunas from "@/src/data/colunas.json";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Link,
  Typography,
} from "@mui/material";

export default function InformacaoPage() {
  return (
    <Container sx={{ paddingTop: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 500,
          letterSpacing: "-0.02em",
          color: "text.primary",
          p: 2,
        }}
      >
        Dicionário de Dados — SISU
      </Typography>

      <Link
        href="https://dadosabertos.mec.gov.br/sisu/item/133-dicionario-de-dados"
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
        variant="body2"
        sx={{ px: 2, mb: 4, display: "block" }}
      >
        Fonte: Dados Abertos MEC
      </Link>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: 3,
          p: 2,
        }}
      >
        {Object.entries(colunas).map(([campo, info]) => (
          <Card key={campo} variant="outlined">
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {campo}
                </Typography>
                <Chip label={info.tipo} size="small" variant="outlined" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {info.nome}
              </Typography>
              <Typography variant="body2" color="text.primary">
                {info.descricao}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}
