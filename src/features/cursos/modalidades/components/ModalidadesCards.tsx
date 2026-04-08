"use client";

import { Box, CircularProgress, Tooltip, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useModalidadesFilter } from "../contexts";

const CATEGORIAS = [
  {
    label: "Ampla concorrência",
    key: "Ampla concorrência",
    descricao: [
      "Vagas sem cotas, abertas a todos os candidatos independente de escola ou renda.",
      'Inclui vagas regionais de ampla concorrência (ex: vagas de medicina para alunos do Maranhão).',
    ],
  },
  {
    label: "Escola pública",
    key: "Escola pública",
    descricao: [
      "Candidatos que cursaram integralmente o ensino médio em escolas públicas, sem recorte de renda ou raça.",
      'Inclui modalidades com a cláusula "independentemente da renda" e cotas regionais de escola pública/privada do Maranhão.',
    ],
  },
  {
    label: "Baixa renda (EP + renda)",
    key: "Baixa renda (EP + renda)",
    descricao: [
      "Candidatos de escola pública com renda familiar bruta per capita igual ou inferior a 1,5 salário mínimo.",
      "Não inclui recorte racial ou de deficiência (esses entram em PPI ou PcD).",
    ],
  },
  {
    label: "PPI",
    key: "PPI",
    descricao: [
      "Candidatos autodeclarados pretos ou pardos que cursaram o ensino médio em escola pública.",
      "Inclui variações com e sem recorte de renda (até 1,5 salário mínimo ou independentemente da renda).",
    ],
  },
  {
    label: "Indígenas",
    key: "Indígenas",
    descricao: [
      "Candidatos autodeclarados indígenas que cursaram o ensino médio em escola pública.",
      "Inclui variações com e sem recorte de renda.",
    ],
  },
  {
    label: "PcD",
    key: "PcD",
    descricao: [
      "Todas as modalidades destinadas a pessoas com deficiência (PcD).",
      "Inclui submodalidades com recorte racial (pretos/pardos PcD) e/ou de renda.",
    ],
  },
] as const;

function aggregateByCategoria(
  dados: ReturnType<typeof useModalidadesFilter>["dadosFiltrados"],
  categoria: string
) {
  if (!dados) return { total_candidatos: null, aprovados: null, media_nota: null };
  const rows = dados.filter((d) => d.categoria === categoria);
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
        const { total_candidatos, aprovados, media_nota } = aggregateByCategoria(dados, categoria.key);
        return (
          <Box
            key={categoria.key}
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
