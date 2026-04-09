"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { useNomeCursos } from "@/src/hooks";

const MotionCard = motion.create(Card);

export default function CursosPage() {
  const { data: cursos, isLoading } = useNomeCursos();

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
        Cursos Disponíveis
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ px: 2, mb: 4 }}>
        Selecione um curso para visualizar estatísticas detalhadas do SISU-UFMA.
      </Typography>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              mobile: "1fr",
              tabletSmall: "repeat(2, 1fr)",
              tablet: "repeat(3, 1fr)",
            },
            gap: 3,
            p: 2,
          }}
        >
          {cursos?.map((c: { no_curso: string }) => (
            <MotionCard
              key={c.no_curso}
              variant="outlined"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <CardActionArea
                component={Link}
                href={`/cursos/${encodeURIComponent(c.no_curso.toLowerCase())}`}
              >
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {c.no_curso}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Ver estatísticas →
                  </Typography>
                </CardContent>
              </CardActionArea>
            </MotionCard>
          ))}
        </Box>
      )}
    </Container>
  );
}
