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
import { dashboardMetricCardSx } from "@/src/config/dashboardStyles";

export default function InformacaoPage() {
  return (
    <Container>
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
          gridTemplateColumns: { mobile: "1fr", tablet: "repeat(2, 1fr)" },
          gap: 3,
          p: 2,
        }}
      >
        {Object.entries(colunas).map(([campo, info]) => (
          <Card key={campo} variant="outlined" sx={dashboardMetricCardSx}>
            <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.25, p: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#7A6A58",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {campo}
                </Typography>
                <Chip
                  label={info.tipo}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: "rgba(174, 143, 88, 0.28)",
                    bgcolor: "rgba(213, 166, 66, 0.10)",
                    color: "#7A5420",
                    fontWeight: 600,
                  }}
                />
              </Box>
              <Typography variant="subtitle2" sx={{ color: "#7A5420", fontWeight: 700 }}>
                {info.nome}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
                {info.descricao}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}
