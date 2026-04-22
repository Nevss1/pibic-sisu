"use client";

import { Box, CircularProgress, Tooltip, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useModalidadesFilter } from "../contexts";

// "Cota geral" agrega todos os subgrupos de COTA e pode sobrepor PPI, Indígenas e PcD.
const CATEGORIAS = [
  {
    label: "Ampla concorrência",
    keys: ["Ampla concorrência"],
    descricao: [
      "Vagas sem cotas, abertas a todos os candidatos independente de escola ou renda.",
    ],
  },
  {
    label: "Bônus Maranhão",
    keys: ["Bônus Maranhão"],
    descricao: [
      "Vagas com bônus regional destinadas a candidatos oriundos do Maranhão.",
      "Categoria específica da UFMA, não presente em outras IES.",
    ],
  },
  {
    label: "Cota geral",
    keys: ["Escola pública", "PPI", "Indígenas", "PcD"],
    descricao: [
      "Total de candidatos em qualquer modalidade de cota (L1–L4 e PcD).",
      "Categoria macro — inclui PPI, Indígenas e PcD. Útil para comparar cotas vs ampla concorrência.",
    ],
  },
  {
    label: "PPI",
    keys: ["PPI"],
    descricao: [
      "Candidatos autodeclarados pretos ou pardos que cursaram o ensino médio em escola pública.",
      "Inclui variações com e sem recorte de renda.",
    ],
  },
  {
    label: "Indígenas",
    keys: ["Indígenas"],
    descricao: [
      "Candidatos autodeclarados indígenas que cursaram o ensino médio em escola pública.",
    ],
  },
  {
    label: "PcD",
    keys: ["PcD"],
    descricao: [
      "Modalidades destinadas a pessoas com deficiência (PcD).",
      "Inclui subgrupos PP+PcD (pretos/pardos com deficiência) e outros recortes de deficiência.",
    ],
  },
] as const;

function aggregateByCategoria(
  dados: ReturnType<typeof useModalidadesFilter>["dadosFiltrados"],
  keys: readonly string[]
) {
  if (!dados) return { total_candidatos: null, aprovados: null, media_nota: null };
  const rows = dados.filter((d) => keys.includes(d.categoria));
  if (rows.length === 0) return { total_candidatos: null, aprovados: null, media_nota: null };

  const total_candidatos = rows.reduce((a, b) => a + b.total_candidatos, 0);
  const aprovados = rows.reduce((a, b) => a + b.aprovados, 0);

  const rowsComNota = rows.filter((r) => r.media_nota != null);
  const media_nota =
    rowsComNota.length === 0
      ? null
      : Math.round(
          (rowsComNota.reduce((a, b) => a + b.media_nota! * b.total_candidatos, 0) /
            rowsComNota.reduce((a, b) => a + b.total_candidatos, 0)) *
            100
        ) / 100;

  return { total_candidatos, aprovados, media_nota };
}

function fmt(n: number | null) {
  if (n === null) return "—";
  return n.toLocaleString("pt-BR");
}

function fmtRate(aprovados: number | null, total: number | null) {
  if (aprovados === null || total === null || total === 0) return "—";
  return ((aprovados / total) * 100).toFixed(1) + "%";
}

export function ModalidadesCards() {
  const { dadosFiltrados: dados, isLoading } = useModalidadesFilter();

  if (isLoading) return <Box display="flex" justifyContent="center" alignItems="center" height={200}><CircularProgress /></Box>;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 2,
      }}
    >
      {CATEGORIAS.map((categoria) => {
        const { total_candidatos, aprovados, media_nota } = aggregateByCategoria(dados, categoria.keys);
        return (
          <Box
            key={categoria.label}
            sx={{
              p: 3,
              borderRadius: 2,
              border: 1,
              borderColor: "divider",
              boxShadow: "0px 1px 4px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 400, color: "text.secondary", fontSize: 14 }}
              >
                {categoria.label}
              </Typography>
              <Tooltip
                title={
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    {categoria.descricao.map((linha, i) => (
                      <Typography key={i} variant="caption" sx={{ display: "block" }}>
                        {linha}
                      </Typography>
                    ))}
                  </Box>
                }
                arrow
                placement="top"
              >
                <InfoOutlinedIcon
                  sx={{ fontSize: 15, color: "text.disabled", cursor: "default" }}
                />
              </Tooltip>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography
                sx={{
                  fontWeight: 500,
                  color: "text.primary",
                  fontSize: 28,
                  fontFamily: "var(--font-archivo), sans-serif",
                  lineHeight: 1,
                }}
              >
                {fmt(total_candidatos)}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", fontSize: 13 }}>
                candidatos
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 500,
                    color: "text.primary",
                    fontSize: 18,
                    fontFamily: "var(--font-archivo), sans-serif",
                  }}
                >
                  {media_nota ?? "—"}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", fontSize: 12 }}>
                  nota média
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 500,
                    color: "text.primary",
                    fontSize: 18,
                    fontFamily: "var(--font-archivo), sans-serif",
                  }}
                >
                  {aprovados ?? "—"}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", fontSize: 12 }}>
                  aprovados
                </Typography>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontWeight: 500,
                    color: "text.primary",
                    fontSize: 18,
                    fontFamily: "var(--font-archivo), sans-serif",
                  }}
                >
                  {fmtRate(aprovados, total_candidatos)}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", fontSize: 12 }}>
                  taxa aprovação
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
