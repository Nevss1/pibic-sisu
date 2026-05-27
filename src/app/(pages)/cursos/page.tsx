"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { useCandidatosCursos } from "@/src/hooks";
import { toTitleCase } from "@/src/utils";
import { dashboardMetricCardSx } from "@/src/config/dashboardStyles";

const TIERS = [
  { max: 6,        key: "low"      as const, label: "Baixíssima" },
  { max: 15,       key: "midLow"   as const, label: "Baixa"      },
  { max: 30,       key: "mid"      as const, label: "Moderada"   },
  { max: 60,       key: "high"     as const, label: "Alta"       },
  { max: Infinity, key: "veryHigh" as const, label: "Muito Alta" },
];

const AREAS = [
  { label: "Todos" },
  { label: "Saúde",      keywords: ["medicina", "enfermagem", "odontologia", "farmácia", "fisioterapia", "nutrição", "psicologia", "veterinária", "biomedicina", "saúde coletiva"] },
  { label: "Engenharia", keywords: ["engenharia"] },
  { label: "Tecnologia", keywords: ["computação", "sistemas de informação", "informática", "tecnologia"] },
  { label: "Humanas",    keywords: ["direito", "história", "geografia", "pedagogia", "letras", "filosofia", "sociologia", "serviço social", "ciências sociais", "arquivologia"] },
  { label: "Negócios",   keywords: ["administração", "economia", "ciências contábeis", "contábeis", "turismo", "secretariado"] },
  { label: "Ciências",   keywords: ["química", "física", "matemática", "biologia", "estatística", "ciências naturais", "oceanografia"] },
  { label: "Artes",      keywords: ["música", "teatro", "artes", "design", "dança", "educação artística"] },
  { label: "Educação",   keywords: ["educação física", "licenciatura"] },
  { label: "Outros",     keywords: [] },
];

function getCursoArea(nome: string): string {
  const lower = nome.toLowerCase();
  const match = AREAS.slice(1, -1).find((a) => a.keywords?.some((k) => lower.includes(k)));
  return match?.label ?? "Outros";
}

function getTier(ratio: number) {
  return TIERS.find((t) => ratio < t.max) ?? TIERS[TIERS.length - 1];
}

const MotionCard = motion.create(Card);

export default function CursosPage() {
  const { data: candidatos, isLoading } = useCandidatosCursos();
  const theme = useTheme();

  const [search, setSearch] = useState("");
  const [areaFiltro, setAreaFiltro] = useState("Todos");

  const cursosAgregados = useMemo(() => {
    if (!candidatos) return [];

    const map = new Map<string, { totalCandidatos: number; aprovados: number; campi: Set<string> }>();

    for (const d of candidatos) {
      if (!map.has(d.no_curso)) {
        map.set(d.no_curso, { totalCandidatos: 0, aprovados: 0, campi: new Set() });
      }
      const entry = map.get(d.no_curso)!;
      entry.totalCandidatos += d.total_candidatos;
      entry.aprovados += d.aprovados;
      entry.campi.add(d.campus);
    }

    return Array.from(map.entries())
      .map(([nome, stats]) => ({
        nome,
        concorrencia: stats.aprovados > 0 ? stats.totalCandidatos / stats.aprovados : null,
        campi: [...stats.campi].sort(),
        area: getCursoArea(nome),
      }))
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  }, [candidatos]);

  const cursosFiltrados = useMemo(() => {
    return cursosAgregados.filter((c) => {
      const matchSearch = c.nome.toLowerCase().includes(search.toLowerCase());
      const matchArea = areaFiltro === "Todos" || c.area === areaFiltro;
      return matchSearch && matchArea;
    });
  }, [cursosAgregados, search, areaFiltro]);

  return (
    <Container>
      <Box sx={{ p: 2, pb: 0 }}>
        <Typography variant="h4" sx={{ mb: 0.5 }}>
          Explorar cursos
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {isLoading
            ? "Carregando..."
            : `${cursosFiltrados.length} curso${cursosFiltrados.length !== 1 ? "s" : ""} encontrado${cursosFiltrados.length !== 1 ? "s" : ""}`}
        </Typography>

        <TextField
          fullWidth
          size="small"
          placeholder="Buscar por nome do curso..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              bgcolor: "rgba(255, 255, 255, 0.72)",
              borderRadius: "14px",
              "& fieldset": { borderColor: "rgba(174, 143, 88, 0.14)" },
              "&:hover fieldset": { borderColor: "rgba(174, 143, 88, 0.28)" },
              "&.Mui-focused fieldset": { borderColor: "#D5A642", borderWidth: 1 },
            },
          }}
        />

        {/* Área — scroll horizontal, sem quebra de linha */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            overflowX: "auto",
            pb: 1,
            mb: 3,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {AREAS.map((a) => (
            <Chip
              key={a.label}
              label={a.label}
              size="small"
              onClick={() => setAreaFiltro(a.label)}
              variant={areaFiltro === a.label ? "filled" : "outlined"}
              sx={{
                flexShrink: 0,
                borderColor: areaFiltro === a.label ? "#7A5420" : "rgba(174, 143, 88, 0.22)",
                bgcolor: areaFiltro === a.label ? "#7A5420" : "rgba(255, 255, 255, 0.58)",
                color: areaFiltro === a.label ? "#ffffff" : "#5F554A",
                fontWeight: 600,
                "&:hover": {
                  bgcolor: areaFiltro === a.label ? "#6B481B" : "rgba(213, 166, 66, 0.12)",
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              tabletSmall: "repeat(2, 1fr)",
              tablet: "repeat(3, 1fr)",
            },
            gap: 2,
            p: 2,
          }}
        >
          {cursosFiltrados.map((c) => {
            const tier = c.concorrencia != null ? getTier(c.concorrencia) : null;
            const tierColor = tier
              ? theme.palette.competition[tier.key]
              : theme.palette.text.disabled;

            return (
              <MotionCard
                key={c.nome}
                variant="outlined"
                sx={dashboardMetricCardSx}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
              >
                <CardActionArea
                  component={Link}
                  href={`/cursos/${encodeURIComponent(c.nome.toLowerCase())}`}
                >
                  <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1.5, p: 2.5 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "#7A5420", fontWeight: 700, lineHeight: 1.3 }}
                    >
                      {toTitleCase(c.nome)}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" lineHeight={1.4}>
                      {c.campi.map((campus) => toTitleCase(campus)).join(" · ")}
                    </Typography>

                    {tier && c.concorrencia != null ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <Box
                          sx={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            bgcolor: tierColor,
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{ color: tierColor, fontWeight: 600, lineHeight: 1 }}
                        >
                          {tier.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
                          · {c.concorrencia.toFixed(1)}× por vaga
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.disabled">
                        Sem dados
                      </Typography>
                    )}
                  </CardContent>
                </CardActionArea>
              </MotionCard>
            );
          })}
        </Box>
      )}
    </Container>
  );
}
